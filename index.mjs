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

export function apply(ctx, config = {}) {
  ctx.inject(['settings'], child => {
    child.effect(() => child.settings.configure({ auto: true }, ctx.fiber))
  })
  const providersConfig = (config.providers ?? []).map((provider, index) => {
    const id = /^[A-Za-z][A-Za-z0-9_-]{5,7}$/.test(provider.id ?? '') ? provider.id : `h-${String(index).padStart(4, '0')}`
    return {
      ...provider,
      id,
      type: 'exa',
      credentialRef: provider.credentialRef || makeCredentialRef('exa', id),
    }
  })
  ctx.inject(['web'], scoped => {
    const credentials = scoped.get('credentials')
    const providers = providersConfig.map(provider => createExaProvider(provider, credentials))
    if (providers.length === 0) return undefined
    return scoped.web.registerSearchProvider(createSearchAggregator(providers))
  })
}

export default { name, inject, Config, apply }
