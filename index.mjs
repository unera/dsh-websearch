import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { credentialRef } from '@deepseek-ai/dsh-credentials'
import { WebError } from '@deepseek-ai/dsh-web'
import z from '@deepseek-ai/schemastery'

export const name = 'dsh-websearch'
export const inject = ['web', 'settings']

export const EXA_SEARCH_URL = 'https://api.exa.ai/search'
/** Exa's page retrieval: the fetch half of the same API key. */
export const EXA_CONTENTS_URL = 'https://api.exa.ai/contents'
/** DeepSeek's own page retrieval, alongside its `tools/search`. */
export const DEEPSEEK_FETCH_URL = 'https://api.deepseek.com/v1/tools/fetch'

/**
 * DeepSeek Search API base, including its `/v1/tools` prefix; `/search` is appended.
 * This is the deployment's default provider (`deepseek-search-api`), a direct
 * request with no auxiliary model turn — the Messages-based `web_search` tool is
 * a different, weaker path.
 */
export const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1/tools'
/** Results requested per search, the service's own default. */
export const DEEPSEEK_DEFAULT_COUNT = 10
/** OpenAI Responses endpoint; the hosted `web_search` tool travels inside it. */
export const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'
/** Default search-capable model; a provider entry may name another. */
export const OPENAI_DEFAULT_MODEL = 'gpt-5.5'
/** Jina Reader retrieves one page as markdown; the URL is appended to this base. */
export const JINA_READER_URL = 'https://r.jina.ai'
/** Jina search base; the query is appended. Requires an API key. */
export const JINA_SEARCH_URL = 'https://s.jina.ai'
/**
 * Perplexity Agent API base. Sonar's `/chat/completions` retired in favour of this
 * endpoint; `/v1/agent` and `/v1/responses` are the same surface.
 */
export const PERPLEXITY_BASE_URL = 'https://api.perplexity.ai'
/** Search model slug on the Agent API. */
export const PERPLEXITY_DEFAULT_MODEL = 'perplexity/sonar'
/**
 * Tavily endpoints. Search answers with snippets; extract returns page text as
 * markdown, up to twenty URLs per call.
 */
export const TAVILY_BASE_URL = 'https://api.tavily.com'
/** Results requested per search; Tavily's own default is five. */
export const TAVILY_DEFAULT_MAX_RESULTS = 5
export const INTERNAL_PROVIDER_ID = 'internal'

const ProviderConfigSchema = z.object({
  id: z.string().default('h-new00').hidden().disabled(),
  type: z.string().default('exa').hidden(),
  desc: z.string().default(''),
  /** Model a provider answers with; only model-backed search (OpenAI) reads it. */
  model: z.string().default(''),
  apiKey: z.string().role('secret').default(''),
  credentialRef: z.string().role('credential-ref').default('').hidden(),
  enabled: z.boolean().default(true),
  /** Whether this entry may serve `web_search`. Separate from what the type can do. */
  useSearch: z.boolean().default(true),
  /** Whether this entry may serve `web_fetch`. */
  useFetch: z.boolean().default(true),
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
  // The schema default for `endpoints.search` is an empty string, so `??` never
  // falls back and the request would be sent to "". Treat blank as "use the default".
  const endpoint = String(config.endpoints?.search ?? '').trim() || EXA_SEARCH_URL
  const contentsEndpoint = String(config.endpoints?.contents ?? '').trim() || EXA_CONTENTS_URL
  const keyInConfig = String(config.apiKey ?? '').trim() !== ''
  const keyInEnv = String(process.env[config.credentialRef ?? ''] ?? '').trim() !== ''
  return {
    id,
    type: 'exa',
    desc: config.desc ?? '',
    credentialRef: config.credentialRef ?? makeCredentialRef('exa', id),
    enabled: config.enabled !== false,
    throttle: config.throttle ?? undefined,
    config: config.config ?? {},
    // Searchable when a key is already in the config, or when the credentials
    // seam can resolve the reference. Depending on the seam alone reported a
    // provider with a stored key as unavailable, and `web` then refused to search.
    available: () => keyInConfig || Boolean(credentials) || keyInEnv,
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
    /**
     * Page retrieval through Exa's `/contents`, the fetch half of the same key.
     * Exa answers with the extracted text, not with the target's own status, so a
     * success is HTTP 200 and a page without usable text is an error.
     */
    async fetch(request, signal) {
      const url = String(request?.url ?? '').trim()
      if (!/^https?:\/\//i.test(url)) {
        throw new WebError(`Exa fetch needs an http(s) URL, got ${JSON.stringify(url)}`, 'WEB_INVALID_URL')
      }
      const resolved = await credentials?.resolve(ref)
      const apiKey = config.apiKey?.trim()
        || resolved?.value?.trim()
        || process.env[config.credentialRef ?? '']?.trim()
      if (!apiKey) {
        throw new WebError(`Exa fetch has no API key for "${config.credentialRef ?? makeCredentialRef('exa', id)}"`, 'WEB_PROVIDER_CREDENTIAL_MISSING')
      }
      let response
      try {
        response = await fetchFn(contentsEndpoint, {
          method: 'POST',
          headers: { accept: 'application/json', 'content-type': 'application/json', 'x-api-key': apiKey },
          body: JSON.stringify({ urls: [url], text: true }),
          signal,
        })
      } catch (error) {
        if (signal?.aborted) throw new WebError('Exa fetch aborted', 'WEB_ABORTED', { cause: error })
        throw new WebError(`Exa fetch request failed: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      if (response.status === 401 || response.status === 403) throw new WebError('Exa rejected the configured API key.', 'WEB_PROVIDER_CREDENTIAL_INVALID')
      if (response.status === 429) throw new WebError('Exa fetch was rate limited.', 'WEB_PROVIDER_RATE_LIMITED')
      if (!response.ok) {
        const detail = (await response.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 240)
        throw new WebError(`Exa fetch failed (${response.status})${detail ? `: ${detail}` : '.'}`, 'WEB_PROVIDER_ERROR')
      }
      let data
      try { data = await response.json() } catch (error) {
        throw new WebError(`Exa returned malformed JSON: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      const item = Array.isArray(data?.results) ? data.results[0] : null
      const content = text(item?.text) ?? text(item?.summary)
      if (!content) {
        throw new WebError(`Exa returned no usable text for ${url}.`, 'WEB_PROVIDER_ERROR')
      }
      return {
        url: text(item?.url) ?? url,
        statusCode: 200,
        body: { kind: 'text', content },
        truncated: false,
      }
    },
  }
}

/**
 * Map a DeepSeek Search API response onto `WebSearchResult`.
 * @param payload - Parsed response body.
 * @returns Sources in provider order, with the display snippet kept.
 * @throws {@link WebError} when the body is not a Search API answer.
 */
export function mapDeepseekResponse(payload) {
  if (payload === null || typeof payload !== 'object' || !Array.isArray(payload.results)) {
    throw new WebError('DeepSeek Search API returned an unexpected body', 'WEB_PROVIDER_ERROR')
  }
  const sources = []
  for (const item of payload.results) {
    if (item === null || typeof item !== 'object') continue
    if (typeof item.url !== 'string' || item.url === '') continue
    const snippet = typeof item.snippet === 'string' && item.snippet !== ''
      ? item.snippet
      : (typeof item.summary === 'string' && item.summary !== '' ? item.summary : undefined)
    sources.push({
      url: item.url,
      ...typeof item.title === 'string' && item.title !== '' ? { title: item.title } : {},
      ...snippet ? { snippet } : {},
      ...typeof item.date === 'string' && item.date !== '' ? { publishedAt: item.date } : {},
    })
  }
  return { sources, truncated: false }
}

/**
 * A DeepSeek-backed search provider: one direct Search API request per query.
 *
 * @param config - One provider entry.
 * @param credentials - Optional credentials seam used to resolve the key reference.
 * @param options.fetchFn - Transport, replaceable in tests.
 */
export function createDeepseekProvider(config, credentials, { fetchFn = fetch } = {}) {
  const id = normalizeProviderId(config.id)
  const ref = credentialRef(config.credentialRef ?? makeCredentialRef('deepseek', id))
  const base = String(config.baseUrl ?? config.endpoints?.search ?? '').trim() || DEEPSEEK_BASE_URL
  const endpoint = `${base.replace(/\/+$/, '')}/search`
  const count = Number.isInteger(config.count) && config.count > 0 ? config.count : DEEPSEEK_DEFAULT_COUNT
  const keyInConfig = String(config.apiKey ?? '').trim() !== ''
  const keyInEnv = String(process.env[config.credentialRef ?? ''] ?? '').trim() !== ''
  return {
    id,
    type: 'deepseek',
    desc: config.desc ?? '',
    credentialRef: config.credentialRef ?? makeCredentialRef('deepseek', id),
    enabled: config.enabled !== false,
    throttle: config.throttle ?? undefined,
    config: config.config ?? {},
    available: () => keyInConfig || Boolean(credentials) || keyInEnv,
    async search(request, signal) {
      const query = String(request.query ?? '').trim()
      if (!query) return { sources: [], truncated: false }
      const resolved = await credentials?.resolve(ref)
      const apiKey = String(config.apiKey ?? '').trim()
        || String(resolved?.value ?? '').trim()
        || String(process.env[ref] ?? '').trim()
      if (!apiKey) {
        throw new WebError(`DeepSeek search has no API key for "${ref}"`, 'WEB_PROVIDER_CREDENTIAL_MISSING')
      }
      const body = {
        query,
        count: Math.min(count, request.maxResults ?? count),
        need_content: false,
      }
      let response
      try {
        response = await fetchFn(endpoint, {
          method: 'POST',
          redirect: 'error',
          headers: {
            authorization: `Bearer ${apiKey}`,
            'content-type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify(body),
          signal,
        })
      } catch (error) {
        if (signal?.aborted) throw new WebError('DeepSeek search aborted', 'WEB_ABORTED', { cause: error })
        throw new WebError(`DeepSeek search request failed: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      if (response.status === 401 || response.status === 403) throw new WebError('DeepSeek rejected the configured API key.', 'WEB_PROVIDER_CREDENTIAL_INVALID')
      if (response.status === 429) throw new WebError('DeepSeek search was rate limited.', 'WEB_PROVIDER_RATE_LIMITED')
      if (!response.ok) {
        const detail = (await response.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 240)
        throw new WebError(`DeepSeek search failed (${response.status})${detail ? `: ${detail}` : '.'}`, 'WEB_PROVIDER_ERROR')
      }
      let payload
      try { payload = await response.json() } catch (error) {
        throw new WebError(`DeepSeek returned malformed JSON: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      return mapDeepseekResponse(payload)
    },
    /**
     * Page retrieval through DeepSeek's own `tools/fetch`.
     *
     * The endpoint's exact payload is not pinned down in this build (no API key was
     * available to probe it), so the body is read tolerantly: the first usable text
     * field wins, and a plain-text answer is accepted as is.
     */
    async fetch(request, signal) {
      const url = String(request?.url ?? '').trim()
      if (!/^https?:\/\//i.test(url)) {
        throw new WebError(`DeepSeek fetch needs an http(s) URL, got ${JSON.stringify(url)}`, 'WEB_INVALID_URL')
      }
      const resolved = await credentials?.resolve(ref)
      const apiKey = String(config.apiKey ?? '').trim()
        || String(resolved?.value ?? '').trim()
        || String(process.env[ref] ?? '').trim()
      if (!apiKey) {
        throw new WebError(`DeepSeek fetch has no API key for "${ref}"`, 'WEB_PROVIDER_CREDENTIAL_MISSING')
      }
      const fetchEndpoint = String(config.endpoints?.fetch ?? '').trim() || DEEPSEEK_FETCH_URL
      let response
      try {
        response = await fetchFn(fetchEndpoint, {
          method: 'POST',
          // Page retrieval must follow redirects: sites answer with 301/302 to the
          // canonical URL, and refusing them turned an ordinary page into an error.
          redirect: 'follow',
          headers: {
            authorization: `Bearer ${apiKey}`,
            'content-type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify({ url }),
          signal,
        })
      } catch (error) {
        if (signal?.aborted) throw new WebError('DeepSeek fetch aborted', 'WEB_ABORTED', { cause: error })
        throw new WebError(`DeepSeek fetch request failed: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      if (response.status === 401 || response.status === 403) throw new WebError('DeepSeek rejected the configured API key.', 'WEB_PROVIDER_CREDENTIAL_INVALID')
      if (response.status === 429) throw new WebError('DeepSeek fetch was rate limited.', 'WEB_PROVIDER_RATE_LIMITED')
      if (!response.ok) {
        const detail = (await response.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 240)
        throw new WebError(`DeepSeek fetch failed (${response.status})${detail ? `: ${detail}` : '.'}`, 'WEB_PROVIDER_ERROR')
      }
      const raw = await response.text()
      const content = deepseekFetchText(raw)
      if (!content) throw new WebError(`DeepSeek returned no usable text for ${url}.`, 'WEB_PROVIDER_ERROR')
      // `response.url` is the address after redirects, so the caller learns what
      // page the text really came from.
      const finalUrl = String(response.url ?? '').trim() || url
      return { url: finalUrl, statusCode: 200, body: { kind: 'text', content }, truncated: false }
    },
  }
}

/**
 * The text of a `tools/fetch` answer, whatever field this build happens to get.
 * An empty result is `undefined`, never an empty string, so a caller can tell
 * "no content" from "empty page".
 */
export function deepseekFetchText(raw) {
  const body = typeof raw === 'string' ? raw.trim() : ''
  if (body === '') return undefined
  let payload
  try { payload = JSON.parse(body) } catch { return body }
  const candidate = payload?.content ?? payload?.markdown ?? payload?.text ?? payload?.html
    ?? payload?.data?.content ?? payload?.data?.markdown ?? payload?.result?.content
  const found = typeof candidate === 'string' ? candidate.trim() : ''
  return found === '' ? undefined : found
}

/**
 * Map a Responses API answer onto `WebSearchResult`.
 *
 * OpenAI answers with a `web_search_call` item (its `action.sources` carry every
 * URL the tool consulted when the request asked for them) plus a `message` whose
 * text blocks hold `url_citation` annotations. Both are folded together here,
 * citations supplying titles for URLs the call listing already named.
 *
 * @param payload - Parsed Responses body.
 * @returns Sources in first-seen order.
 * @throws {@link WebError} when the answer carries no search at all.
 */
export function mapOpenaiResponse(payload) {
  const output = Array.isArray(payload?.output) ? payload.output : []
  const calls = output.filter(item => item?.type === 'web_search_call')
  if (calls.length === 0) {
    throw new WebError(
      'OpenAI returned no web_search_call; the request may not have triggered a search',
      'WEB_PROVIDER_ERROR',
    )
  }
  const seen = new Map()
  const add = (url, title) => {
    if (typeof url !== 'string' || url === '') return
    const known = seen.get(url)
    if (known === undefined) seen.set(url, typeof title === 'string' && title !== '' ? title : undefined)
    else if (known === undefined && typeof title === 'string' && title !== '') seen.set(url, title)
  }
  for (const call of calls) {
    for (const source of call.action?.sources ?? []) add(source?.url, source?.title)
  }
  for (const item of output) {
    if (item?.type !== 'message') continue
    for (const block of item.content ?? []) {
      for (const cite of block?.annotations ?? []) {
        if (cite?.type === 'url_citation') add(cite.url, cite.title)
      }
    }
  }
  const sources = [...seen].map(([url, title]) => ({ url, ...title === undefined ? {} : { title } }))
  return { sources, truncated: false }
}

/**
 * OpenAI search: the hosted `web_search` tool inside one Responses call.
 *
 * OpenAI publishes no standalone search endpoint and no page-retrieval endpoint,
 * so this provider searches only — the fetch aggregator skips it because it has no
 * `fetch` method. `tool_choice: 'required'` forces the tool, because with `auto`
 * the model may answer from memory instead of searching.
 *
 * @param config - One provider entry.
 * @param credentials - Optional credentials seam used to resolve the key reference.
 * @param options.fetchFn - Transport, replaceable in tests.
 */
export function createOpenaiProvider(config, credentials, { fetchFn = fetch } = {}) {
  const id = normalizeProviderId(config.id)
  const ref = credentialRef(config.credentialRef ?? makeCredentialRef('openai', id))
  const endpoint = String(config.baseUrl ?? '').trim() || OPENAI_RESPONSES_URL
  const model = String(config.model ?? '').trim() || OPENAI_DEFAULT_MODEL
  const keyInConfig = String(config.apiKey ?? '').trim() !== ''
  const keyInEnv = String(process.env[config.credentialRef ?? ''] ?? '').trim() !== ''
  return {
    id,
    type: 'openai',
    desc: config.desc ?? '',
    credentialRef: config.credentialRef ?? makeCredentialRef('openai', id),
    enabled: config.enabled !== false,
    throttle: config.throttle ?? undefined,
    config: config.config ?? {},
    available: () => keyInConfig || Boolean(credentials) || keyInEnv,
    async search(request, signal) {
      const query = String(request.query ?? '').trim()
      if (!query) return { sources: [], truncated: false }
      const resolved = await credentials?.resolve(ref)
      const apiKey = String(config.apiKey ?? '').trim()
        || String(resolved?.value ?? '').trim()
        || String(process.env[ref] ?? '').trim()
      if (!apiKey) {
        throw new WebError(`OpenAI search has no API key for "${ref}"`, 'WEB_PROVIDER_CREDENTIAL_MISSING')
      }
      const body = {
        model,
        tools: [{ type: 'web_search' }],
        tool_choice: 'required',
        // Ask for the complete source list, not only the inline citations.
        include: ['web_search_call.action.sources'],
        input: `Search the web and list the sources for: ${query}`,
      }
      let response
      try {
        response = await fetchFn(endpoint, {
          method: 'POST',
          redirect: 'error',
          headers: {
            authorization: `Bearer ${apiKey}`,
            'content-type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify(body),
          signal,
        })
      } catch (error) {
        if (signal?.aborted) throw new WebError('OpenAI search aborted', 'WEB_ABORTED', { cause: error })
        throw new WebError(`OpenAI search request failed: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      if (response.status === 401 || response.status === 403) throw new WebError('OpenAI rejected the configured API key.', 'WEB_PROVIDER_CREDENTIAL_INVALID')
      if (response.status === 429) throw new WebError('OpenAI search was rate limited.', 'WEB_PROVIDER_RATE_LIMITED')
      if (!response.ok) {
        const detail = (await response.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 240)
        throw new WebError(`OpenAI search failed (${response.status})${detail ? `: ${detail}` : '.'}`, 'WEB_PROVIDER_ERROR')
      }
      let payload
      try { payload = await response.json() } catch (error) {
        throw new WebError(`OpenAI returned malformed JSON: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      return mapOpenaiResponse(payload)
    },
  }
}


/**
 * Jina: two public HTTP endpoints rather than one API.
 *
 * `r.jina.ai/<url>` renders a page to markdown and works without a key (a key only
 * raises limits), while `s.jina.ai/<query>` answers searches and needs one. The
 * provider therefore reports itself available whenever either side can run: a
 * keyless entry still retrieves pages, and a search on it fails as a missing
 * credential, which the aggregator treats as a reason to try the next provider.
 *
 * @param config - One provider entry.
 * @param credentials - Optional credentials seam used to resolve the key reference.
 * @param options.fetchFn - Transport, replaceable in tests.
 */
export function createJinaProvider(config, credentials, { fetchFn = fetch } = {}) {
  const id = normalizeProviderId(config.id)
  const ref = credentialRef(config.credentialRef ?? makeCredentialRef('jina', id))
  const searchBase = (String(config.baseUrl ?? config.endpoints?.search ?? '').trim() || JINA_SEARCH_URL).replace(/\/+$/, '')
  const readerBase = (String(config.endpoints?.fetch ?? '').trim() || JINA_READER_URL).replace(/\/+$/, '')
  const keyInConfig = String(config.apiKey ?? '').trim() !== ''
  const keyInEnv = String(process.env[config.credentialRef ?? ''] ?? '').trim() !== ''
  const apiKeyOf = async () => {
    const resolved = await credentials?.resolve(ref)
    return String(config.apiKey ?? '').trim()
      || String(resolved?.value ?? '').trim()
      || String(process.env[ref] ?? '').trim()
  }
  return {
    id,
    type: 'jina',
    desc: config.desc ?? '',
    credentialRef: config.credentialRef ?? makeCredentialRef('jina', id),
    enabled: config.enabled !== false,
    throttle: config.throttle ?? undefined,
    config: config.config ?? {},
    // Page retrieval needs no key, so the entry is usable as soon as it exists.
    available: () => true,
    async search(request, signal) {
      const query = String(request.query ?? '').trim()
      if (!query) return { sources: [], truncated: false }
      const apiKey = await apiKeyOf()
      if (!apiKey) {
        throw new WebError(`Jina search has no API key for "${ref}"`, 'WEB_PROVIDER_CREDENTIAL_MISSING')
      }
      let response
      try {
        response = await fetchFn(`${searchBase}/${encodeURIComponent(query)}`, {
          method: 'GET',
          redirect: 'error',
          headers: { authorization: `Bearer ${apiKey}`, accept: 'application/json' },
          signal,
        })
      } catch (error) {
        if (signal?.aborted) throw new WebError('Jina search aborted', 'WEB_ABORTED', { cause: error })
        throw new WebError(`Jina search request failed: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      if (response.status === 401 || response.status === 403) throw new WebError('Jina rejected the configured API key.', 'WEB_PROVIDER_CREDENTIAL_INVALID')
      if (response.status === 429) throw new WebError('Jina search was rate limited.', 'WEB_PROVIDER_RATE_LIMITED')
      if (!response.ok) {
        const detail = (await response.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 240)
        throw new WebError(`Jina search failed (${response.status})${detail ? `: ${detail}` : '.'}`, 'WEB_PROVIDER_ERROR')
      }
      let payload
      try { payload = await response.json() } catch (error) {
        throw new WebError(`Jina returned malformed JSON: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      return mapJinaResponse(payload)
    },
    async fetch(request, signal) {
      const url = String(request?.url ?? '').trim()
      if (!/^https?:\/\//i.test(url)) {
        throw new WebError(`Jina fetch needs an http(s) URL, got ${JSON.stringify(url)}`, 'WEB_INVALID_URL')
      }
      const apiKey = await apiKeyOf()
      let response
      try {
        response = await fetchFn(`${readerBase}/${url}`, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            accept: 'text/plain',
            ...apiKey === '' ? {} : { authorization: `Bearer ${apiKey}` },
          },
          signal,
        })
      } catch (error) {
        if (signal?.aborted) throw new WebError('Jina fetch aborted', 'WEB_ABORTED', { cause: error })
        throw new WebError(`Jina fetch request failed: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      if (response.status === 401 || response.status === 403) throw new WebError('Jina rejected the configured API key.', 'WEB_PROVIDER_CREDENTIAL_INVALID')
      if (response.status === 429) throw new WebError('Jina fetch was rate limited.', 'WEB_PROVIDER_RATE_LIMITED')
      if (!response.ok) {
        const detail = (await response.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 240)
        throw new WebError(`Jina fetch failed (${response.status})${detail ? `: ${detail}` : '.'}`, 'WEB_PROVIDER_ERROR')
      }
      const content = (await response.text()).trim()
      if (content === '') throw new WebError(`Jina returned no text for ${url}.`, 'WEB_PROVIDER_ERROR')
      const finalUrl = String(response.url ?? '').trim() || url
      return { url: finalUrl, statusCode: 200, body: { kind: 'text', content }, truncated: false }
    },
  }
}

/**
 * Map a Jina search answer onto `WebSearchResult`.
 * @param payload - Parsed `s.jina.ai` body.
 * @returns Sources in provider order.
 * @throws {@link WebError} when the body is not a search answer.
 */
export function mapJinaResponse(payload) {
  if (payload === null || typeof payload !== 'object' || !Array.isArray(payload.data)) {
    throw new WebError('Jina search returned an unexpected body', 'WEB_PROVIDER_ERROR')
  }
  const sources = []
  for (const item of payload.data) {
    if (item === null || typeof item !== 'object') continue
    if (typeof item.url !== 'string' || item.url === '') continue
    const snippet = String(item.description ?? item.content ?? '').replace(/\s+/g, ' ').trim()
    sources.push({
      url: item.url,
      ...typeof item.title === 'string' && item.title !== '' ? { title: item.title } : {},
      ...snippet === '' ? {} : { snippet: snippet.slice(0, 500) },
    })
  }
  return { sources, truncated: false }
}


/**
 * Map a Perplexity answer onto `WebSearchResult`.
 *
 * Structured `search_results` is preferred because it carries titles and
 * snippets; the older `citations` array holds bare URLs and is used only when
 * `search_results` is absent.
 *
 * @param payload - Parsed chat-completions body.
 * @returns Sources in provider order.
 * @throws {@link WebError} when the body carries neither shape.
 */
export function mapPerplexityResponse(payload) {
  if (payload === null || typeof payload !== 'object') {
    throw new WebError('Perplexity returned an unexpected body', 'WEB_PROVIDER_ERROR')
  }
  // A failed run may still arrive with HTTP 200, so the body decides.
  if (payload.status === 'failed' || payload.status === 'cancelled') {
    const detail = payload.error?.message ?? payload.error?.code ?? payload.status
    throw new WebError(`Perplexity run ${payload.status}: ${String(detail)}`, 'WEB_PROVIDER_ERROR')
  }
  const output = Array.isArray(payload.output) ? payload.output : []
  const block = output.find(item => item?.type === 'search_results')
  if (block === undefined) {
    throw new WebError('Perplexity returned no search_results item', 'WEB_PROVIDER_ERROR')
  }
  const sources = []
  const seen = new Set()
  for (const item of block.results ?? []) {
    if (item === null || typeof item !== 'object') continue
    if (typeof item.url !== 'string' || item.url === '' || seen.has(item.url)) continue
    seen.add(item.url)
    sources.push({
      url: item.url,
      ...typeof item.title === 'string' && item.title !== '' ? { title: item.title } : {},
      ...typeof item.snippet === 'string' && item.snippet !== '' ? { snippet: item.snippet } : {},
      ...typeof item.date === 'string' && item.date !== '' ? { publishedAt: item.date } : {},
    })
  }
  return { sources, truncated: false }
}

/**
 * Perplexity search through the Agent API.
 *
 * Sonar's chat-completions surface is retired, so this calls `/v1/agent`: a bare
 * model request does no search there, and the web tool is offered *and* forced,
 * because an ungrounded answer would have no sources at all. Perplexity publishes
 * no page-retrieval endpoint, so the entry carries no `fetch` method.
 *
 * @param config - One provider entry.
 * @param credentials - Optional credentials seam used to resolve the key reference.
 * @param options.fetchFn - Transport, replaceable in tests.
 */
export function createPerplexityProvider(config, credentials, { fetchFn = fetch } = {}) {
  const id = normalizeProviderId(config.id)
  const ref = credentialRef(config.credentialRef ?? makeCredentialRef('perplexity', id))
  const base = (String(config.baseUrl ?? '').trim() || PERPLEXITY_BASE_URL).replace(/\/+$/, '')
  const endpoint = base.endsWith('/v1') ? `${base}/agent` : `${base}/v1/agent`
  const model = String(config.model ?? '').trim() || PERPLEXITY_DEFAULT_MODEL
  const keyInConfig = String(config.apiKey ?? '').trim() !== ''
  const keyInEnv = String(process.env[config.credentialRef ?? ''] ?? '').trim() !== ''
  return {
    id,
    type: 'perplexity',
    desc: config.desc ?? '',
    credentialRef: config.credentialRef ?? makeCredentialRef('perplexity', id),
    enabled: config.enabled !== false,
    throttle: config.throttle ?? undefined,
    config: config.config ?? {},
    available: () => keyInConfig || Boolean(credentials) || keyInEnv,
    async search(request, signal) {
      const query = String(request.query ?? '').trim()
      if (!query) return { sources: [], truncated: false }
      const resolved = await credentials?.resolve(ref)
      const apiKey = String(config.apiKey ?? '').trim()
        || String(resolved?.value ?? '').trim()
        || String(process.env[ref] ?? '').trim()
      if (!apiKey) {
        throw new WebError(`Perplexity search has no API key for "${ref}"`, 'WEB_PROVIDER_CREDENTIAL_MISSING')
      }
      // The Agent API rejects unknown fields, so only these four are sent.
      const body = {
        model,
        input: query,
        tools: [{ type: 'web_search' }],
        tool_choice: { type: 'web_search' },
      }
      let response
      try {
        response = await fetchFn(endpoint, {
          method: 'POST',
          redirect: 'error',
          headers: {
            authorization: `Bearer ${apiKey}`,
            'content-type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify(body),
          signal,
        })
      } catch (error) {
        if (signal?.aborted) throw new WebError('Perplexity search aborted', 'WEB_ABORTED', { cause: error })
        throw new WebError(`Perplexity search request failed: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      if (response.status === 401 || response.status === 403) throw new WebError('Perplexity rejected the configured API key.', 'WEB_PROVIDER_CREDENTIAL_INVALID')
      if (response.status === 429) throw new WebError('Perplexity search was rate limited.', 'WEB_PROVIDER_RATE_LIMITED')
      if (!response.ok) {
        const detail = (await response.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 240)
        throw new WebError(`Perplexity search failed (${response.status})${detail ? `: ${detail}` : '.'}`, 'WEB_PROVIDER_ERROR')
      }
      let payload
      try { payload = await response.json() } catch (error) {
        throw new WebError(`Perplexity returned malformed JSON: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
      }
      return mapPerplexityResponse(payload)
    },
  }
}


/**
 * Map a Tavily search answer onto `WebSearchResult`.
 * @param payload - Parsed `/search` body.
 * @returns Sources in provider order, snippets taken from `content`.
 * @throws {@link WebError} when the body carries no results array.
 */
export function mapTavilyResponse(payload) {
  if (payload === null || typeof payload !== 'object' || !Array.isArray(payload.results)) {
    throw new WebError('Tavily returned an unexpected body', 'WEB_PROVIDER_ERROR')
  }
  const sources = []
  const seen = new Set()
  for (const item of payload.results) {
    if (item === null || typeof item !== 'object') continue
    if (typeof item.url !== 'string' || item.url === '' || seen.has(item.url)) continue
    seen.add(item.url)
    const snippet = String(item.content ?? '').replace(/\s+/g, ' ').trim()
    sources.push({
      url: item.url,
      ...typeof item.title === 'string' && item.title !== '' ? { title: item.title } : {},
      ...snippet === '' ? {} : { snippet: snippet.slice(0, 500) },
      ...typeof item.published_date === 'string' && item.published_date !== ''
        ? { publishedAt: item.published_date } : {},
    })
  }
  return { sources, truncated: false }
}

/**
 * Tavily: search plus page extraction through one API.
 *
 * Extract answers 200 even when individual URLs failed, so `failed_results` is
 * checked explicitly instead of trusting the status code — otherwise a broken page
 * would look like an empty one.
 *
 * @param config - One provider entry.
 * @param credentials - Optional credentials seam used to resolve the key reference.
 * @param options.fetchFn - Transport, replaceable in tests.
 */
export function createTavilyProvider(config, credentials, { fetchFn = fetch } = {}) {
  const id = normalizeProviderId(config.id)
  const ref = credentialRef(config.credentialRef ?? makeCredentialRef('tavily', id))
  const base = (String(config.baseUrl ?? '').trim() || TAVILY_BASE_URL).replace(/\/+$/, '')
  const keyInConfig = String(config.apiKey ?? '').trim() !== ''
  const keyInEnv = String(process.env[config.credentialRef ?? ''] ?? '').trim() !== ''
  const apiKeyOf = async () => {
    const resolved = await credentials?.resolve(ref)
    return String(config.apiKey ?? '').trim()
      || String(resolved?.value ?? '').trim()
      || String(process.env[ref] ?? '').trim()
  }
  const call = async (path, body, signal) => {
    const apiKey = await apiKeyOf()
    if (!apiKey) {
      throw new WebError(`Tavily has no API key for "${ref}"`, 'WEB_PROVIDER_CREDENTIAL_MISSING')
    }
    let response
    try {
      response = await fetchFn(`${base}${path}`, {
        method: 'POST',
        redirect: 'error',
        headers: {
          authorization: `Bearer ${apiKey}`,
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(body),
        signal,
      })
    } catch (error) {
      if (signal?.aborted) throw new WebError('Tavily request aborted', 'WEB_ABORTED', { cause: error })
      throw new WebError(`Tavily request failed: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
    }
    if (response.status === 401 || response.status === 403) throw new WebError('Tavily rejected the configured API key.', 'WEB_PROVIDER_CREDENTIAL_INVALID')
    if (response.status === 429) throw new WebError('Tavily was rate limited.', 'WEB_PROVIDER_RATE_LIMITED')
    if (!response.ok) {
      const detail = (await response.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 240)
      throw new WebError(`Tavily request failed (${response.status})${detail ? `: ${detail}` : '.'}`, 'WEB_PROVIDER_ERROR')
    }
    try { return await response.json() } catch (error) {
      throw new WebError(`Tavily returned malformed JSON: ${String(error)}`, 'WEB_PROVIDER_ERROR', { cause: error })
    }
  }
  return {
    id,
    type: 'tavily',
    desc: config.desc ?? '',
    credentialRef: config.credentialRef ?? makeCredentialRef('tavily', id),
    enabled: config.enabled !== false,
    throttle: config.throttle ?? undefined,
    config: config.config ?? {},
    available: () => keyInConfig || Boolean(credentials) || keyInEnv,
    async search(request, signal) {
      const query = String(request.query ?? '').trim()
      if (!query) return { sources: [], truncated: false }
      const payload = await call('/search', {
        query,
        max_results: Number(request.maxResults) > 0 ? Number(request.maxResults) : TAVILY_DEFAULT_MAX_RESULTS,
      }, signal)
      return mapTavilyResponse(payload)
    },
    async fetch(request, signal) {
      const url = String(request?.url ?? '').trim()
      if (!/^https?:\/\//i.test(url)) {
        throw new WebError(`Tavily fetch needs an http(s) URL, got ${JSON.stringify(url)}`, 'WEB_INVALID_URL')
      }
      const payload = await call('/extract', { urls: [url], format: 'markdown' }, signal)
      const failed = Array.isArray(payload?.failed_results) ? payload.failed_results[0] : undefined
      if (failed !== undefined) {
        throw new WebError(
          `Tavily could not extract ${url}: ${String(failed?.error ?? 'unknown reason')}`,
          'WEB_PROVIDER_ERROR',
        )
      }
      const item = Array.isArray(payload?.results) ? payload.results[0] : undefined
      const content = String(item?.raw_content ?? '').trim()
      if (content === '') throw new WebError(`Tavily returned no text for ${url}.`, 'WEB_PROVIDER_ERROR')
      return { url: String(item?.url ?? url), statusCode: 200, body: { kind: 'text', content }, truncated: false }
    },
  }
}

/** Build the provider a config entry names; the type decides the wire protocol. */
export function createProvider(config, credentials, options) {
  const type = config.type ?? 'exa'
  const provider = type === 'deepseek'
    ? createDeepseekProvider(config, credentials, options)
    : type === 'openai'
      ? createOpenaiProvider(config, credentials, options)
      : type === 'jina'
        ? createJinaProvider(config, credentials, options)
        : type === 'perplexity'
          ? createPerplexityProvider(config, credentials, options)
          : type === 'tavily'
            ? createTavilyProvider(config, credentials, options)
            : createExaProvider(config, credentials, options)
  // The aggregators read these: a type may be able to do something the entry is
  // configured not to use, which is how one provider searches while the next
  // one, further down the list, does the page retrieval.
  provider.useSearch = config.useSearch !== false
  provider.useFetch = config.useFetch !== false
  return provider
}

export function createSearchAggregator(source, { deduplicate = true } = {}) {
  // `source` may be a function: the provider list and its order are configuration,
  // so they are read per call rather than captured when the plugin starts.
  const read = typeof source === 'function' ? source : () => source
  return {
    id: 'dsh-websearch',
    available: () => read().some(provider => provider.enabled !== false && provider.available()),
    async search(request, signal) {
      let firstError
      const seen = new Set()
      for (const provider of read()) {
        if (provider.enabled === false || provider.useSearch === false || !provider.available()) continue
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

/**
 * Fetch through the same provider list the search aggregator uses: the first
 * enabled provider that can retrieve the URL wins, and a provider that is simply
 * unusable hands over to the next one instead of failing the whole call.
 *
 * @param providers - provider objects, each carrying its own `fetch`.
 */
export function createFetchAggregator(source) {
  // Like the search aggregator: the list is configuration and is read per call.
  const read = typeof source === 'function' ? source : () => source
  return {
    id: 'dsh-websearch',
    available: () => read().some(provider => provider.enabled !== false && provider.available()),
    async fetch(request, signal) {
      let firstError
      for (const provider of read()) {
        if (provider.enabled === false || provider.useFetch === false || !provider.available()) continue
        if (typeof provider.fetch !== 'function') continue
        try {
          return await provider.fetch(request, signal)
        } catch (error) {
          if (firstError === undefined) firstError = error
          if (!isFallbackError(error)) throw error
        }
      }
      if (firstError !== undefined) throw firstError
      throw new WebError('No enabled web fetch provider is available.', 'WEB_PROVIDER_UNAVAILABLE')
    },
  }
}

export function describeProviders(configs) {  return configs.map(config => ({
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
/**
 * Provider types this build can talk to. The form's select offers exactly these,
 * and `/providers` refuses anything else instead of storing a type it cannot run.
 */
export const PROVIDER_TYPES = Object.freeze(['exa', 'deepseek', 'openai', 'jina', 'perplexity', 'tavily'])

/**
 * What each provider type can do. Search and page retrieval are separate
 * capabilities here, because a type may have only one of them — OpenAI searches
 * but publishes no page-retrieval endpoint, and a reader-only type would be the
 * mirror image.
 */
export const PROVIDER_CAPABILITIES = Object.freeze({
  exa: Object.freeze({ search: true, fetch: true }),
  deepseek: Object.freeze({ search: true, fetch: true }),
  openai: Object.freeze({ search: true, fetch: false }),
  // Jina renders pages and searches; the reader works even without a key.
  jina: Object.freeze({ search: true, fetch: true }),
  perplexity: Object.freeze({ search: true, fetch: false }),
  tavily: Object.freeze({ search: true, fetch: true }),
})
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

const ZERO_STATS = Object.freeze({
  searches: 0, errors: 0, lastSearch: 0, lastError: 0,
  fetches: 0, fetchErrors: 0, lastFetch: 0, lastFetchError: 0,
})

/** What this process actually registered with the `web` seam; the page reports it. */
export const runtimeState = { registered: false, reason: '', step: 'plugin loaded' }

/** Keep only the counter fields, so a hand-edited file cannot poison the page. */
function sanitizeStats(value) {
  const count = field => {
    const number = Number(value?.[field])
    return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0
  }
  return {
    searches: count('searches'), errors: count('errors'),
    lastSearch: count('lastSearch'), lastError: count('lastError'),
    fetches: count('fetches'), fetchErrors: count('fetchErrors'),
    lastFetch: count('lastFetch'), lastFetchError: count('lastFetchError'),
  }
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

/**
 * Wrap one provider so every completed search or page fetch, and every failure of
 * either, is counted. Search and fetch keep their own pair of counters and dates.
 */
export function countProvider(provider) {
  const wrapped = {
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
  if (typeof provider.fetch === 'function') {
    wrapped.fetch = async (request, signal) => {
      const before = statsOf(provider.id)
      try {
        const result = await provider.fetch(request, signal)
        saveStats(provider.id, { ...before, fetches: before.fetches + 1, lastFetch: Date.now() })
        return result
      } catch (error) {
        saveStats(provider.id, { ...before, fetchErrors: before.fetchErrors + 1, lastFetchError: Date.now() })
        throw error
      }
    }
  }
  return wrapped
}

const PROVIDER_ID = /^[A-Za-z][A-Za-z0-9_-]{5,7}$/
/** What the page may see of one provider: never the key itself. */
function publicProvider(provider, index) {
  return {
    index,
    id: provider.id ?? '',
    type: provider.type ?? 'exa',
    desc: provider.desc ?? '',
    model: provider.model ?? '',
    enabled: provider.enabled !== false,
    keySet: String(provider.apiKey ?? '').trim() !== '',
    capabilities: {
      search: (PROVIDER_CAPABILITIES[provider.type ?? 'exa'] ?? { search: true }).search !== false
        && provider.useSearch !== false,
      fetch: (PROVIDER_CAPABILITIES[provider.type ?? 'exa'] ?? { fetch: true }).fetch === true
        && provider.useFetch !== false,
    },
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
      throw Object.assign(new Error(`provider index ${JSON.stringify(raw)} is out of range`), { code: 'index-out-of-range' })
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
          step: runtimeState.step,
        })
      }
      if (request.method !== 'POST') return json(response, 405, { error: 'method not allowed' })

      const body = await readBody(request)
      const providers = read()
      const action = String(body.action ?? '')

      if (action === 'add') {
        const draft = body.draft ?? {}
        const type = String(draft.type ?? 'exa')
        if (!PROVIDER_TYPES.includes(type)) {
          return json(response, 400, { error: `unsupported provider type ${JSON.stringify(type)}`, code: 'unsupported-type', params: { type } })
        }
        const caps = PROVIDER_CAPABILITIES[type]
        const typeSearch = caps.search !== false
        const typeFetch = caps.fetch === true
        const apiKey = String(draft.apiKey ?? '').trim()
        if (apiKey === '') return json(response, 400, { error: 'an API key is required', code: 'key-required' })
        const id = generateProviderId(providers)
        providers.unshift({
          id,
          type,
          desc: String(draft.desc ?? '').trim(),
          model: String(draft.model ?? '').trim(),
          apiKey,
          credentialRef: makeCredentialRef(type, id),
          enabled: draft.enabled !== false,
          useSearch: typeSearch !== false,
          useFetch: typeFetch === true && draft.useFetch !== false,
        })
      } else if (action === 'save') {
        const index = indexOf(providers, body.index)
        const draft = body.draft ?? {}
        const existingType = providers[index].type ?? 'exa'
        const caps = PROVIDER_CAPABILITIES[existingType] ?? { search: true, fetch: true }
        const typeSearch = caps.search !== false
        const typeFetch = caps.fetch === true
        const next = {
          ...providers[index],
          desc: String(draft.desc ?? '').trim(),
          model: String(draft.model ?? '').trim(),
          enabled: draft.enabled !== false,
          useSearch: typeSearch !== false,
          useFetch: typeFetch === true && draft.useFetch !== false,
        }
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
        if (target < 0 || target >= providers.length) return json(response, 400, { error: 'move is out of range', code: 'move-out-of-range' })
        ;[providers[index], providers[target]] = [providers[target], providers[index]]
      } else if (action === 'reset') {
        resetStats(providers[indexOf(providers, body.index)]?.id ?? '')
      } else if (action === 'select') {
        // The `web` seam never adopts a provider on its own; the page points it here
        // for both capabilities, because one key covers search and fetch alike.
        await settings.update(WEB_NAMESPACE, {
          searchProvider: SEARCH_PROVIDER_ID,
          fetchProvider: SEARCH_PROVIDER_ID,
        })
      } else if (action === 'toggle') {
        const index = indexOf(providers, body.index)
        providers[index] = { ...providers[index], enabled: providers[index].enabled === false }
      } else {
        return json(response, 400, { error: `unknown action ${JSON.stringify(action)}`, code: 'unknown-action', params: { action } })
      }

      if (action !== 'select') await write(providers)
      const after = read()
      return json(response, 200, {
        providers: after.map(publicProvider),
        searchProvider: selectedSearchProvider(),
        providerId: SEARCH_PROVIDER_ID,
      })
    } catch (error) {
      // `code` lets the page show a translated message instead of server English.
      return json(response, 400, {
        error: String(error?.message ?? error),
        ...error?.code === undefined ? {} : { code: String(error.code) },
      })
    }
  }
}

export function apply(ctx, config = {}) {
  // Services a fiber may read must be declared in its own `inject`: `ctx.get` on
  // anything else throws "cannot get property ... without inject". So they are
  // captured here, from scopes that do declare them.
  const shared = { settings: null, credentials: null }
  ctx.inject(['settings'], child => {
    shared.settings = child.settings
    child.effect(() => child.settings.configure({ auto: true }, ctx.fiber))
  })
  ctx.inject(['credentials'], child => {
    shared.credentials = child.credentials
  })
  // The composed config is only the fallback: the settings document is the truth
  // once it exists, and it is re-read on every search so a reordered list takes
  // effect at the next query instead of at the next restart.
  const normalizeConfigs = list => unwrapProviders(list)
    .filter(provider => PROVIDER_TYPES.includes(provider.type ?? 'exa'))
    .map((provider, index) => {
      const id = /^[A-Za-z][A-Za-z0-9_-]{5,7}$/.test(provider.id ?? '') ? provider.id : `h-${String(index).padStart(4, '0')}`
      return {
        ...provider,
        id,
        type: provider.type ?? 'exa',
        credentialRef: provider.credentialRef || makeCredentialRef(provider.type ?? 'exa', id),
      }
    })
  const fallbackConfigs = normalizeConfigs(config.providers)
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
    runtimeState.step = 'web inject entered'
    try {
      runtimeState.step = 'web inject entered'
      // `ctx.get` may refuse a service this fiber did not declare, so a lookup that
      // throws must not take the whole registration down with it.
      const credentials = shared.credentials
      const settings = shared.settings
      /** The current provider objects, in list order, freshly built for this call. */
      const liveProviders = () => {
        let configs = fallbackConfigs
        if (typeof settings?.describe === 'function') {
          const descriptor = settings.describe().find(entry => String(entry.ns) === SETTINGS_NAMESPACE)
          const stored = descriptor?.value?.providers
          if (Array.isArray(stored)) configs = normalizeConfigs(stored)
        }
        return configs
          .filter(provider => provider.enabled !== false)
          .map(provider => countProvider(createProvider(provider, credentials)))
      }
      runtimeState.step = 'services resolved'
      let dispose
      try {
        dispose = scoped.web.registerSearchProvider(createSearchAggregator(liveProviders))
      } catch (error) {
        runtimeState.registered = false
        runtimeState.reason = `registerSearchProvider failed: ${String(error?.message ?? error)}`
        throw error
      }
      // Every provider that can search also retrieves pages; the same live list serves
      // both capabilities, so one configured key covers `web_search` and `web_fetch`.
      let disposeFetch
      try {
        disposeFetch = scoped.web.registerFetchProvider(createFetchAggregator(liveProviders))
      } catch (error) {
        runtimeState.registered = false
        runtimeState.reason = `registerFetchProvider failed: ${String(error?.message ?? error)}`
        throw error
      }
      runtimeState.registered = true
      runtimeState.reason = ''
      runtimeState.step = 'registered'
      return () => { runtimeState.registered = false; runtimeState.step = 'disposed'; dispose?.(); disposeFetch?.() }

    } catch (error) {
      runtimeState.registered = false
      runtimeState.reason = String(error?.stack ?? error?.message ?? error)
      runtimeState.step = 'failed'
      throw error
    }
  })
}

apply.Config = Config
apply.inject = inject
export default apply
