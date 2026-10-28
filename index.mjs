import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { credentialRef } from '@deepseek-ai/dsh-credentials'
import { WebError } from '@deepseek-ai/dsh-web'
import z from '@deepseek-ai/schemastery'

export const name = 'dsh-websearch'
export const inject = ['web', 'settings']

export const EXA_SEARCH_URL = 'https://api.exa.ai/search'
export const INTERNAL_PROVIDER_ID = 'internal'

const ProviderConfigSchema = z.object({
  id: z.string().default('h-new00').hidden().disabled(),
  type: z.string().default('exa').hidden().disabled(),
  desc: z.string().default(''),
  apiKey: z.string().role('secret').default(''),
  credentialRef: z.string().role('credential-ref').default('').hidden().disabled(),
  enabled: z.boolean().default(true),
  endpoints: z.object({ search: z.string().default('').hidden().disabled() }).default({}).hidden().disabled(),
  throttle: z.object({
    requests: z.number().step(1).min(1).default(20).hidden().disabled(),
    windowSeconds: z.number().step(1).min(1).default(60).hidden().disabled(),
    maxConcurrent: z.number().step(1).min(1).default(2).hidden().disabled(),
  }).default({}).hidden().disabled(),
  config: z.dict(z.any()).default({}).hidden().disabled(),
})

export const Config = z.object({
  providers: z.array(ProviderConfigSchema).default([]).volatile(),
})

export function normalizeProviderId(value) {
  const id = String(value ?? '')
  if (!/^[A-Za-z][A-Za-z0-9_-]{5,7}$/.test(id)) throw new TypeError('provider id must start with a letter and contain 6-8 allowed characters')
  return id
}

export function generateProviderId(existing = []) {
  const used = new Set(existing.map(provider => provider.id))
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'
  for (let attempt = 0; attempt < 100; attempt++) {
    let id = String.fromCharCode(97 + Math.floor(Math.random() * 26))
    while (id.length < 7) id += alphabet[Math.floor(Math.random() * alphabet.length)]
    if (!used.has(id)) return id
  }
  throw new Error('unable to generate a unique provider id')
}

export function makeCredentialRef(type, id) {
  const normalize = value => String(value).replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return `DSH_WEBSEARCH_${normalize(type)}_${normalize(id)}`.toUpperCase()
}

export function createExaProvider(config, credentials, { fetchFn = fetch } = {}) {
  const id = normalizeProviderId(config.id)
  const ref = credentialRef(config.credentialRef ?? makeCredentialRef('exa', id))
  const endpoint = config.endpoints?.search ?? EXA_SEARCH_URL
  return {
    id,
    type: 'exa',
    desc: config.desc ?? '',
    credentialRef: config.credentialRef ?? makeCredentialRef('exa', id),
    enabled: config.enabled !== false,
    throttle: config.throttle ?? undefined,
    config: config.config ?? {},
    available: () => Boolean(credentials),
    async search(request, signal) {
      const query = String(request.query ?? '').trim()
      if (!query) return { sources: [], truncated: false }
      const resolved = await credentials?.resolve(ref)
      const apiKey = config.apiKey?.trim()
        || resolved?.value?.trim()
        || process.env[config.credentialRef ?? '']?.trim()
      if (!apiKey) {
        throw new WebError(`Exa search has no API key for "${config.credentialRef ?? makeCredentialRef('exa', id)}"`, 'WEB_PROVIDER_CREDENTIAL_MISSING')
      }
      let response
      try {
        response = await fetchFn(endpoint, {
          method: 'POST',
          headers: { accept: 'application/json', 'content-type': 'application/json', 'x-api-key': apiKey },
          body: JSON.stringify({
            query,
            ...(request.maxResults === undefined ? {} : { numResults: request.maxResults }),
            ...config.config,
          }),
          signal,
        })
      } catch (error) {
        if (signal?.aborted) throw new WebError('Exa search aborted', 'WEB_ABORTED', { cause: error })
        throw new WebError(`Exa search request failed: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      if (response.status === 401 || response.status === 403) throw new WebError('Exa rejected the configured API key.', 'WEB_PROVIDER_CREDENTIAL_INVALID')
      if (response.status === 429) throw new WebError('Exa search was rate limited.', 'WEB_PROVIDER_RATE_LIMITED')
      if (!response.ok) {
        const detail = (await response.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 240)
        throw new WebError(`Exa search failed (${response.status})${detail ? `: ${detail}` : '.'}`, 'WEB_PROVIDER_ERROR')
      }
      let data
      try { data = await response.json() } catch (error) { throw new WebError(`Exa returned malformed JSON: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error }) }
      const sources = normalizeSources(data?.results)
      return { sources, truncated: request.maxResults !== undefined && sources.length > request.maxResults }
    },
  }
}

export function createSearchAggregator(providers, { deduplicate = true } = {}) {
  const list = [...providers]
  return {
    id: 'dsh-websearch',
    available: () => list.some(provider => provider.enabled !== false && provider.available()),
    async search(request, signal) {
      let firstError
      const seen = new Set()
      for (const provider of list) {
        if (provider.enabled === false || !provider.available()) continue
        try {
          const result = await provider.search(request, signal)
          if (!deduplicate) return result
          const sources = result.sources.filter(source => {
            const key = source.url.toLowerCase()
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          return { ...result, sources }
        } catch (error) {
          if (firstError === undefined) firstError = error
          if (!isFallbackError(error)) throw error
        }
      }
      if (firstError !== undefined) throw firstError
      throw new WebError('No enabled web search provider is available.', 'WEB_PROVIDER_UNAVAILABLE')
    },
  }
}

export function describeProviders(configs) {
  return configs.map(config => ({
    id: config.id,
    type: config.type,
    desc: config.desc ?? '',
    credentialRef: config.credentialRef ?? null,
    enabled: config.enabled !== false,
    ...(config.endpoints !== undefined ? { endpoints: config.endpoints } : {}),
    ...(config.throttle !== undefined ? { throttle: config.throttle } : {}),
    ...(config.config !== undefined ? { config: config.config } : {}),
    configured: config.type === 'internal' ? true : Boolean(config.credentialRef),
    available: config.enabled !== false,
  }))
}

export function isFallbackError(error) {
  return [
    'WEB_PROVIDER_CREDENTIAL_MISSING',
    'WEB_PROVIDER_CREDENTIAL_INVALID',
    'WEB_PROVIDER_RATE_LIMITED',
    'WEB_PROVIDER_QUOTA_EXHAUSTED',
    'WEB_PROVIDER_ERROR',
    'WEB_PROVIDER_UNAVAILABLE',
  ].includes(error?.code)
}

function normalizeSources(results) {
  if (!Array.isArray(results)) return []
  const seen = new Set()
  const sources = []
  for (const item of results) {
    if (!item || typeof item.url !== 'string' || !/^https?:\/\//i.test(item.url)) continue
    const url = item.url.trim()
    const key = url.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    const title = text(item.title)
    const snippet = text(item.summary) ?? text(item.highlights)
    const publishedAt = text(item.publishedDate)
    sources.push({ url, ...(title ? { title } : {}), ...(snippet ? { snippet } : {}), ...(publishedAt ? { publishedAt } : {}) })
  }
  return sources
}

function text(value) {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (Array.isArray(value)) {
    const joined = value.filter(item => typeof item === 'string').join('\n').trim()
    return joined || undefined
  }
  return undefined
}

/** Read the provider list from a `volatile()` field or a plain array. */
export function unwrapProviders(value) {
  const plain = typeof value?.get === 'function' ? value.get() : value
  return Array.isArray(plain) ? plain : []
}

/** Namespace this plugin's entry registers. */
export const SETTINGS_NAMESPACE = 'dsh-websearch'
export const ROUTE_PREFIX = '/__ws'
/** Id this plugin registers its aggregator under and the value `web.searchProvider` names. */
export const SEARCH_PROVIDER_ID = 'dsh-websearch'
/** The `web` seam's namespace, whose `searchProvider` field selects the active provider. */
export const WEB_NAMESPACE = 'web'

/**
 * Where per-provider counters live: one JSON file per provider, beside the other
 * plugin state under `$DSH_HOME/storages`.
 */
export function countersDir(env = process.env) {
  const home = typeof env.DSH_HOME === 'string' && env.DSH_HOME !== ''
    ? path.resolve(env.DSH_HOME)
    : path.join(os.homedir(), '.dsh')
  return path.join(home, 'storages', 'dsh-websearch-counters')
}

const ZERO_STATS = Object.freeze({ searches: 0, errors: 0, lastSearch: 0, lastError: 0 })

/** What this process actually registered with the `web` seam; the page reports it. */
export const runtimeState = { registered: false, reason: '' }

/** Keep only the four counter fields, so a hand-edited file cannot poison the page. */
function sanitizeStats(value) {
  const count = field => {
    const number = Number(value?.[field])
    return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0
  }
  return { searches: count('searches'), errors: count('errors'), lastSearch: count('lastSearch'), lastError: count('lastError') }
}

let cacheDir = null
let cache = new Map()

/** Drop the in-memory copy; the next read comes from disk again. */
export function clearCounterCache() {
  cacheDir = null
  cache.clear()
}

function countersFile(id) {
  const dir = countersDir()
  if (cacheDir !== dir) {
    cacheDir = dir
    cache = new Map()
  }
  return { dir, file: path.join(dir, `${String(id).replace(/[^A-Za-z0-9_-]/g, '_')}.json`) }
}

/** Counters for one provider; an unreadable or broken file starts from zeros. */
export function statsOf(id) {
  const key = String(id)
  const { file } = countersFile(key)
  if (cache.has(key)) return cache.get(key)
  let value = { ...ZERO_STATS }
  try {
    value = sanitizeStats(JSON.parse(fs.readFileSync(file, 'utf8')))
  } catch {
    // Missing, unreadable or unparseable: the provider simply starts at zero.
  }
  cache.set(key, value)
  return value
}

function saveStats(id, value) {
  const key = String(id)
  const { dir, file } = countersFile(key)
  cache.set(key, value)
  try {
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(file, `${JSON.stringify(value)}\n`, 'utf8')
  } catch {
    // A read-only DSH_HOME must not break searching; counters stay in memory.
  }
  return value
}

/** Zero both counters and both dates. */
export function resetStats(id) {
  return saveStats(id, { ...ZERO_STATS })
}

/** Forget a provider's counters, file included. */
export function forgetStats(id) {
  const key = String(id)
  const { file } = countersFile(key)
  cache.delete(key)
  try { fs.unlinkSync(file) } catch { /* nothing to remove */ }
}

/** Wrap one provider so every completed search and every failure is counted. */
export function countProvider(provider) {
  return {
    ...provider,
    async search(request, signal) {
      const before = statsOf(provider.id)
      try {
        const result = await provider.search(request, signal)
        saveStats(provider.id, { ...before, searches: before.searches + 1, lastSearch: Date.now() })
        return result
      } catch (error) {
        saveStats(provider.id, { ...before, errors: before.errors + 1, lastError: Date.now() })
        throw error
      }
    },
  }
}

const PROVIDER_ID = /^[A-Za-z][A-Za-z0-9_-]{5,7}$/
/** What the page may see of one provider: never the key itself. */
function publicProvider(provider, index) {
  return {
    index,
    id: provider.id ?? '',
    type: provider.type ?? 'exa',
    desc: provider.desc ?? '',
    enabled: provider.enabled !== false,
    keySet: String(provider.apiKey ?? '').trim() !== '',
    stats: statsOf(provider.id),
  }
}

/**
 * Provider CRUD for the settings page.
 *
 * It lives on the host because `apiKey` is a schema secret: redacted reads never
 * carry it, so a page that rewritten the whole array would erase every stored
 * key. Here the array is read whole (secrets included), one change is applied,
 * and the array is written back, leaving untouched keys intact.
 *
 * @param settings - host settings service owning the plugin's namespace.
 * @returns An HTTP handler for {@link ROUTE_PREFIX}.
 */
export function createProviderHandler(settings) {
  const read = () => {
    const descriptor = settings.describe().find(entry => String(entry.ns) === SETTINGS_NAMESPACE)
    const value = descriptor?.value
    return Array.isArray(value?.providers) ? value.providers.map(provider => ({ ...provider })) : []
  }
  const write = providers => settings.update(SETTINGS_NAMESPACE, { providers })
  /** The provider id the `web` seam currently selects, if any. */
  const selectedSearchProvider = () => {
    const descriptor = settings.describe().find(entry => String(entry.ns) === WEB_NAMESPACE)
    const value = descriptor?.value
    return typeof value?.searchProvider === 'string' ? value.searchProvider : ''
  }

  const json = (response, status, body) => {
    const text = JSON.stringify(body)
    response.writeHead(status, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'content-length': Buffer.byteLength(text),
    })
    response.end(text)
  }

  const readBody = async request => {
    const chunks = []
    let size = 0
    for await (const chunk of request) {
      size += chunk.length
      if (size > 256 * 1024) throw new Error('request body is too large')
      chunks.push(chunk)
    }
    const text = Buffer.concat(chunks).toString('utf8').trim()
    return text === '' ? {} : JSON.parse(text)
  }

  const indexOf = (providers, raw) => {
    const index = Number(raw)
    if (!Number.isInteger(index) || index < 0 || index >= providers.length) {
      throw new Error(`provider index ${JSON.stringify(raw)} is out of range`)
    }
    return index
  }

  return async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://localhost')
      const path = url.pathname.startsWith(ROUTE_PREFIX) ? url.pathname.slice(ROUTE_PREFIX.length) || '/' : url.pathname

      if (request.method === 'GET' && path === '/state') {
        const providers = read()
        return json(response, 200, {
          providers: providers.map(publicProvider),
          searchProvider: selectedSearchProvider(),
          providerId: SEARCH_PROVIDER_ID,
          registered: runtimeState.registered,
          reason: runtimeState.reason,
        })
      }
      if (request.method !== 'POST') return json(response, 405, { error: 'method not allowed' })

      const body = await readBody(request)
      const providers = read()
      const action = String(body.action ?? '')

      if (action === 'add') {
        const draft = body.draft ?? {}
        const apiKey = String(draft.apiKey ?? '').trim()
        if (apiKey === '') return json(response, 400, { error: 'an API key is required' })
        const id = generateProviderId(providers)
        providers.unshift({
          id,
          type: 'exa',
          desc: String(draft.desc ?? '').trim(),
          apiKey,
          credentialRef: makeCredentialRef('exa', id),
          enabled: draft.enabled !== false,
        })
      } else if (action === 'save') {
        const index = indexOf(providers, body.index)
        const draft = body.draft ?? {}
        const next = { ...providers[index], desc: String(draft.desc ?? '').trim(), enabled: draft.enabled !== false }
        const apiKey = String(draft.apiKey ?? '').trim()
        // An empty key field means "keep the stored one", not "erase it".
        if (apiKey !== '') next.apiKey = apiKey
        providers[index] = next
      } else if (action === 'delete') {
        const [removed] = providers.splice(indexOf(providers, body.index), 1)
        forgetStats(removed?.id ?? '')
      } else if (action === 'move') {
        const index = indexOf(providers, body.index)
        const target = index + Number(body.delta ?? 0)
        if (target < 0 || target >= providers.length) return json(response, 400, { error: 'move is out of range' })
        ;[providers[index], providers[target]] = [providers[target], providers[index]]
      } else if (action === 'reset') {
        resetStats(providers[indexOf(providers, body.index)]?.id ?? '')
      } else if (action === 'select') {
        // The `web` seam never adopts a provider on its own; the page points it here.
        await settings.update(WEB_NAMESPACE, { searchProvider: SEARCH_PROVIDER_ID })
      } else if (action === 'toggle') {
        const index = indexOf(providers, body.index)
        providers[index] = { ...providers[index], enabled: providers[index].enabled === false }
      } else {
        return json(response, 400, { error: `unknown action ${JSON.stringify(action)}` })
      }

      if (action !== 'select') await write(providers)
      const after = read()
      return json(response, 200, {
        providers: after.map(publicProvider),
        searchProvider: selectedSearchProvider(),
        providerId: SEARCH_PROVIDER_ID,
      })
    } catch (error) {
      return json(response, 400, { error: String(error?.message ?? error) })
    }
  }
}

export function apply(ctx, config = {}) {
  ctx.inject(['settings'], child => {
    child.effect(() => child.settings.configure({ auto: true }, ctx.fiber))
  })
  const providersConfig = unwrapProviders(config.providers)
    .filter(provider => (provider.type ?? 'exa') === 'exa')
    .map((provider, index) => {
      const id = /^[A-Za-z][A-Za-z0-9_-]{5,7}$/.test(provider.id ?? '') ? provider.id : `h-${String(index).padStart(4, '0')}`
      return {
        ...provider,
        id,
        type: 'exa',
        credentialRef: provider.credentialRef || makeCredentialRef('exa', id),
      }
    })
  ctx.inject(['settings', 'webServer'], scoped => {
    const settings = scoped.settings ?? scoped.get?.('settings')
    const server = scoped.webServer ?? scoped.get?.('webServer')
    if (typeof settings?.update !== 'function' || typeof server?.register !== 'function') return undefined
    const handler = createProviderHandler(settings)
    return scoped.effect(() => {
      const unregister = server.register({ kind: 'prefix', path: ROUTE_PREFIX, handler })
      return () => { try { unregister?.() } catch { /* already gone */ } }
    })
  })
  ctx.inject(['web'], scoped => {
    const credentials = scoped.get('credentials')
    const providers = providersConfig
      .filter(provider => provider.enabled !== false)
      .map(provider => countProvider(createExaProvider(provider, credentials)))
    if (providers.length === 0) {
      runtimeState.registered = false
      runtimeState.reason = 'no enabled exa provider is configured'
      return undefined
    }
    const dispose = scoped.web.registerSearchProvider(createSearchAggregator(providers))
    runtimeState.registered = true
    runtimeState.reason = ''
    return () => { runtimeState.registered = false; dispose?.() }
  })
}

apply.Config = Config
apply.inject = inject
export default apply
