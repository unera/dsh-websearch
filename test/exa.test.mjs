import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

// Every counter read/write resolves DSH_HOME lazily, so pointing it at a
// throwaway directory keeps the suite away from the real deployment state.
process.env.DSH_HOME = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-websearch-test-'))
import {
  createExaProvider,
  createSearchAggregator,
  describeProviders,
  generateProviderId,
  makeCredentialRef,
  normalizeProviderId,
} from '../index.mjs'

const config = { id: 'h-a7K2x', type: 'exa', credentialRef: 'DSH_WEBSEARCH_EXA_H_A7K2X', enabled: true }

test('generates short ids and credential refs', () => {
  const id = generateProviderId([{ id: 'h-a7K2x' }])
  assert.match(id, /^[A-Za-z][A-Za-z0-9_-]{5,7}$/)
  assert.notEqual(id, 'h-a7K2x')
  assert.equal(normalizeProviderId('h-a7K2x'), 'h-a7K2x')
  assert.equal(makeCredentialRef('exa', 'h-a7K2x'), 'DSH_WEBSEARCH_EXA_H_A7K2X')
})

test('normalizes Exa results and sends the API key', async () => {
  const calls = []
  const provider = createExaProvider(config, { resolve: async () => ({ value: 'secret' }) }, {
    fetchFn: async (url, init) => {
      calls.push([url, init])
      return new Response(JSON.stringify({ results: [
        { url: 'https://example.com/a', title: 'A', summary: 'S' },
        { url: 'https://example.com/a', title: 'duplicate' },
      ] }), { status: 200 })
    },
  })
  const result = await provider.search({ query: 'test', maxResults: 3 })
  assert.equal(calls.length, 1)
  assert.equal(calls[0][0], 'https://api.exa.ai/search')
  assert.equal(new Headers(calls[0][1].headers).get('x-api-key'), 'secret')
  assert.deepEqual(JSON.parse(calls[0][1].body), { query: 'test', numResults: 3 })
  assert.deepEqual(result.sources, [{ url: 'https://example.com/a', title: 'A', snippet: 'S' }])
})

test('reports missing credentials', async () => {
  const provider = createExaProvider(config, { resolve: async () => undefined }, { fetchFn: async () => assert.fail('must not fetch') })
  await assert.rejects(provider.search({ query: 'test' }), error => error.code === 'WEB_PROVIDER_CREDENTIAL_MISSING')
})

test('falls back after a classified provider failure', async () => {
  const first = { id: 'h-first', enabled: true, available: () => true, search: async () => { throw Object.assign(new Error('no key'), { code: 'WEB_PROVIDER_CREDENTIAL_MISSING' }) } }
  const second = { id: 'h-second', enabled: true, available: () => true, search: async () => ({ sources: [{ url: 'https://example.com' }], truncated: false }) }
  const result = await createSearchAggregator([first, second]).search({ query: 'test' })
  assert.deepEqual(result.sources, [{ url: 'https://example.com' }])
})

test('does not fall back after an invalid request', async () => {
  const first = { id: 'h-first', enabled: true, available: () => true, search: async () => { throw Object.assign(new Error('bad query'), { code: 'WEB_INVALID_REQUEST' }) } }
  const second = { id: 'h-second', enabled: true, available: () => true, search: async () => assert.fail('must not run') }
  await assert.rejects(createSearchAggregator([first, second]).search({ query: 'test' }), error => error.code === 'WEB_INVALID_REQUEST')
})

test('describes safe provider configuration without secret values', () => {
  assert.deepEqual(describeProviders([{
    ...config,
    desc: 'Основной Exa',
    endpoints: { search: null },
    throttle: { requests: 20, windowSeconds: 60, maxConcurrent: 2 },
    config: { numResults: 8 },
  }]), [{
    id: 'h-a7K2x',
    type: 'exa',
    desc: 'Основной Exa',
    credentialRef: 'DSH_WEBSEARCH_EXA_H_A7K2X',
    enabled: true,
    endpoints: { search: null },
    throttle: { requests: 20, windowSeconds: 60, maxConcurrent: 2 },
    config: { numResults: 8 },
    configured: true,
    available: true,
  }])
})

test('unwraps a volatile provider field and tolerates a plain array', async () => {
  const { unwrapProviders } = await import('../index.mjs')
  const rows = [{ id: 'h-a7K2x' }]
  assert.deepEqual(unwrapProviders(rows), rows)
  assert.deepEqual(unwrapProviders({ get: () => rows }), rows)
  assert.deepEqual(unwrapProviders(undefined), [])
  assert.deepEqual(unwrapProviders({ not: 'an array' }), [])
})

/** Minimal settings stand-in: the handler must never drop a stored key. */
function fakeSettings(providers) {
  const state = { providers: providers.map(provider => ({ ...provider })) }
  return {
    state,
    describe: () => [{ ns: 'dsh-websearch', value: { providers: state.providers.map(p => ({ ...p })) } }],
    update: async (_ns, patch) => { state.providers = patch.providers.map(p => ({ ...p })) },
  }
}

function callHandler(handler, { method = 'POST', url = '/__ws/providers', body = {} } = {}) {
  const response = { status: 0, payload: null, writeHead(code) { this.status = code }, end(text) { this.payload = JSON.parse(text) } }
  const request = {
    method,
    url,
    async *[Symbol.asyncIterator]() {
      if (method === 'POST') yield Buffer.from(JSON.stringify(body))
    },
  }
  return handler(request, response).then(() => response)
}

test('keeps stored keys through move, toggle and delete', async () => {
  const { createProviderHandler } = await import('../index.mjs')
  const settings = fakeSettings([
    { id: 'h-aaaaa', type: 'exa', desc: 'first', apiKey: 'key-one', enabled: true },
    { id: 'h-bbbbb', type: 'exa', desc: 'second', apiKey: 'key-two', enabled: true },
  ])
  const handler = createProviderHandler(settings)

  const moved = await callHandler(handler, { body: { action: 'move', index: 0, delta: 1 } })
  assert.equal(moved.status, 200)
  assert.deepEqual(settings.state.providers.map(p => p.id), ['h-bbbbb', 'h-aaaaa'])
  assert.deepEqual(settings.state.providers.map(p => p.apiKey), ['key-two', 'key-one'])

  await callHandler(handler, { body: { action: 'toggle', index: 1 } })
  assert.equal(settings.state.providers[1].enabled, false)
  assert.equal(settings.state.providers[1].apiKey, 'key-one')

  const deleted = await callHandler(handler, { body: { action: 'delete', index: 0 } })
  assert.equal(deleted.payload.providers.length, 1)
  assert.equal(settings.state.providers[0].apiKey, 'key-one')
  assert.equal(deleted.payload.providers[0].keySet, true)
  assert.equal(Object.hasOwn(deleted.payload.providers[0], 'apiKey'), false)
})

test('adds a provider and refuses an empty key', async () => {
  const { createProviderHandler } = await import('../index.mjs')
  const settings = fakeSettings([])
  const handler = createProviderHandler(settings)

  const refused = await callHandler(handler, { body: { action: 'add', draft: { desc: 'x', apiKey: '  ' } } })
  assert.equal(refused.status, 400)

  const added = await callHandler(handler, { body: { action: 'add', draft: { desc: 'Exa', apiKey: 'k-1', enabled: true } } })
  assert.equal(added.status, 200)
  assert.equal(settings.state.providers.length, 1)
  assert.equal(settings.state.providers[0].apiKey, 'k-1')
  assert.match(settings.state.providers[0].id, /^[A-Za-z][A-Za-z0-9_-]{5,7}$/)
})

test('the add action stores the chosen type and refuses an unknown one', async () => {
  const { createProviderHandler } = await import('../index.mjs')
  const settings = fakeSettings([])
  const handler = createProviderHandler(settings)

  const unknown = await callHandler(handler, { body: { action: 'add', draft: { type: 'nope', apiKey: 'k-1' } } })
  assert.equal(unknown.status, 400)
  assert.equal(settings.state.providers.length, 0)

  const added = await callHandler(handler, { body: { action: 'add', draft: { type: 'exa', apiKey: 'k-1' } } })
  assert.equal(added.status, 200)
  assert.equal(settings.state.providers[0].type, 'exa')
  assert.match(settings.state.providers[0].credentialRef, /^DSH_WEBSEARCH_EXA_/)
})

test('saving without a key keeps the stored one', async () => {
  const { createProviderHandler } = await import('../index.mjs')
  const settings = fakeSettings([{ id: 'h-ccccc', type: 'exa', desc: 'old', apiKey: 'keep-me', enabled: true }])
  const handler = createProviderHandler(settings)

  await callHandler(handler, { body: { action: 'save', index: 0, draft: { desc: 'new', apiKey: '', enabled: false } } })
  assert.equal(settings.state.providers[0].desc, 'new')
  assert.equal(settings.state.providers[0].enabled, false)
  assert.equal(settings.state.providers[0].apiKey, 'keep-me')
})

test('counts searches and failures per provider', async () => {
  const { countProvider, statsOf, clearCounterCache } = await import('../index.mjs')
  clearCounterCache()
  const ok = countProvider({ id: 'h-ok001', async search() { return { sources: [] } } })
  const bad = countProvider({ id: 'h-bad01', async search() { throw new Error('boom') } })

  await ok.search({ query: 'q' })
  await ok.search({ query: 'q' })
  await assert.rejects(() => bad.search({ query: 'q' }))

  assert.equal(statsOf('h-ok001').searches, 2)
  assert.equal(statsOf('h-ok001').lastSearch > 0, true)
  assert.equal(statsOf('h-bad01').errors, 1)
  assert.equal(statsOf('h-bad01').lastError > 0, true)
})

test('persists counters to one JSON file per provider', async () => {
  const { countProvider, statsOf, clearCounterCache, countersDir } = await import('../index.mjs')
  clearCounterCache()
  const provider = countProvider({ id: 'h-disk1', async search() { return { sources: [] } } })
  await provider.search({ query: 'q' })

  const file = path.join(countersDir(), 'h-disk1.json')
  const onDisk = JSON.parse(fs.readFileSync(file, 'utf8'))
  assert.equal(onDisk.searches, 1)
  assert.equal(onDisk.errors, 0)
  assert.equal(onDisk.lastSearch > 0, true)

  // A fresh process reads the same file back.
  clearCounterCache()
  assert.equal(statsOf('h-disk1').searches, 1)
})

test('a broken or missing counter file starts from zeros', async () => {
  const { statsOf, clearCounterCache, countersDir } = await import('../index.mjs')
  clearCounterCache()
  fs.mkdirSync(countersDir(), { recursive: true })
  fs.writeFileSync(path.join(countersDir(), 'h-broken.json'), '{not json', 'utf8')

  const zeros = { searches: 0, errors: 0, lastSearch: 0, lastError: 0, fetches: 0, fetchErrors: 0, lastFetch: 0, lastFetchError: 0 }
  assert.deepEqual(statsOf('h-broken'), zeros)
  assert.deepEqual(statsOf('h-missing1'), zeros)
})

test('reset zeroes both counters and both dates on disk', async () => {
  const { createProviderHandler, countProvider, statsOf, clearCounterCache } = await import('../index.mjs')
  clearCounterCache()
  const provider = countProvider({ id: 'h-zero1', async search() { return { sources: [] } } })
  await provider.search({ query: 'q' })

  const settings = fakeSettings([{ id: 'h-zero1', type: 'exa', desc: '', apiKey: 'k', enabled: true }])
  const handler = createProviderHandler(settings)

  const response = await callHandler(handler, { body: { action: 'reset', index: 0 } })
  assert.equal(response.status, 200)
  const zeros = { searches: 0, errors: 0, lastSearch: 0, lastError: 0, fetches: 0, fetchErrors: 0, lastFetch: 0, lastFetchError: 0 }
  assert.deepEqual(statsOf('h-zero1'), zeros)
  assert.deepEqual(response.payload.providers[0].stats, zeros)
})

test('state reports providers, counters and registration', async () => {
  const { createProviderHandler } = await import('../index.mjs')
  const settings = fakeSettings([{ id: 'h-state1', type: 'exa', desc: 'kept', apiKey: 'k', enabled: true }])
  const handler = createProviderHandler(settings)

  const response = await callHandler(handler, { method: 'GET', url: '/__ws/state' })
  assert.equal(response.status, 200)
  assert.equal(response.payload.providers.length, 1)
  assert.equal(response.payload.providers[0].keySet, true)
  assert.equal(typeof response.payload.registered, 'boolean')
  assert.equal(response.payload.providerId, 'dsh-websearch')
})

test('a provider with a stored key is available without the credentials seam', async () => {
  const { createExaProvider } = await import('../index.mjs')
  const withKey = createExaProvider({ ...config, apiKey: 'k-1' }, undefined)
  assert.equal(withKey.available(), true)

  const withoutKey = createExaProvider({ ...config, apiKey: '' }, undefined)
  assert.equal(withoutKey.available(), false)

  const viaSeam = createExaProvider({ ...config, apiKey: '' }, { resolve: async () => null })
  assert.equal(viaSeam.available(), true)
})

test('an empty endpoints.search still calls the Exa endpoint', async () => {
  const { createExaProvider } = await import('../index.mjs')
  const calls = []
  const provider = createExaProvider({ ...config, apiKey: 'k-1', endpoints: { search: '' } }, undefined, {
    fetchFn: async (url) => { calls.push(url); return { ok: true, status: 200, json: async () => ({ results: [] }) } },
  })
  await provider.search({ query: 'q' })
  assert.deepEqual(calls, ['https://api.exa.ai/search'])
})

test('maps a DeepSeek Search API answer to sources', async () => {
  const { mapDeepseekResponse } = await import('../index.mjs')
  const payload = {
    results: [
      { url: 'https://a.example', title: 'A', snippet: 'short', summary: 'long', date: '2026-10-28' },
      { url: 'https://b.example', title: '', snippet: '', summary: 'only summary', date: null },
      { url: '', title: 'no url' },
    ],
  }
  assert.deepEqual(mapDeepseekResponse(payload).sources, [
    { url: 'https://a.example', title: 'A', snippet: 'short', publishedAt: '2026-10-28' },
    { url: 'https://b.example', snippet: 'only summary' },
  ])
  assert.throws(() => mapDeepseekResponse({ nope: true }), /unexpected body/)
})

test('DeepSeek provider calls the Search API directly', async () => {
  const { createProvider } = await import('../index.mjs')
  const calls = []
  const provider = createProvider({ id: 'h-dsk01', type: 'deepseek', apiKey: 'k-9', enabled: true }, undefined, {
    fetchFn: async (url, init) => {
      calls.push({ url, init })
      return {
        ok: true, status: 200,
        json: async () => ({ results: [{ url: 'https://x.example', title: 'X', snippet: 's', date: null }] }),
      }
    },
  })
  assert.equal(provider.type, 'deepseek')
  const result = await provider.search({ query: 'курс доллара' })
  assert.deepEqual(result.sources, [{ url: 'https://x.example', title: 'X', snippet: 's' }])

  const [{ url, init }] = calls
  assert.equal(url, 'https://api.deepseek.com/v1/tools/search')
  assert.equal(init.headers.authorization, 'Bearer k-9')
  assert.equal(init.headers['x-api-key'], undefined)
  const body = JSON.parse(init.body)
  assert.equal(body.query, 'курс доллара')
  assert.equal(body.count, 10)
  assert.equal(body.need_content, false)
})

test('createProvider picks the protocol by type', async () => {
  const { createProvider } = await import('../index.mjs')
  assert.equal(createProvider({ ...config }, undefined).type, 'exa')
  assert.equal(createProvider({ ...config, id: 'h-dsk02', type: 'deepseek' }, undefined).type, 'deepseek')
})

test('Exa fetch retrieves page text through /contents', async () => {
  const { createExaProvider } = await import('../index.mjs')
  const calls = []
  const provider = createExaProvider({ ...config, apiKey: 'k-1' }, undefined, {
    fetchFn: async (url, options) => {
      calls.push({ url, body: JSON.parse(options.body) })
      return {
        ok: true,
        status: 200,
        async json() {
          return { results: [{ url: 'https://example.com', title: 'Example', text: 'Hello page' }] }
        },
      }
    },
  })
  const result = await provider.fetch({ url: 'https://example.com' })
  assert.equal(calls[0].url, 'https://api.exa.ai/contents')
  assert.deepEqual(calls[0].body, { urls: ['https://example.com'], text: true })
  assert.equal(result.statusCode, 200)
  assert.deepEqual(result.body, { kind: 'text', content: 'Hello page' })
  assert.equal(result.url, 'https://example.com')
})

test('Exa fetch rejects a non-http URL and an empty page', async () => {
  const { createExaProvider } = await import('../index.mjs')
  const provider = createExaProvider({ ...config, apiKey: 'k-1' }, undefined, {
    fetchFn: async () => ({ ok: true, status: 200, async json() { return { results: [] } } }),
  })
  await assert.rejects(provider.fetch({ url: 'file:///etc/passwd' }), error => error.code === 'WEB_INVALID_URL')
  await assert.rejects(provider.fetch({ url: 'https://example.com' }), error => error.code === 'WEB_PROVIDER_ERROR')
})

test('the fetch aggregator falls over to the next usable provider', async () => {
  const { createFetchAggregator } = await import('../index.mjs')
  const failing = {
    id: 'a', enabled: true, available: () => true,
    async fetch() { throw Object.assign(new Error('no key'), { code: 'WEB_PROVIDER_CREDENTIAL_MISSING' }) },
  }
  const working = {
    id: 'b', enabled: true, available: () => true,
    async fetch() { return { url: 'https://example.com', statusCode: 200, body: { kind: 'text', content: 'ok' }, truncated: false } },
  }
  const aggregator = createFetchAggregator([failing, working])
  const result = await aggregator.fetch({ url: 'https://example.com' })
  assert.equal(result.body.content, 'ok')
  assert.equal(createFetchAggregator([failing]).available(), true)
})

test('DeepSeek fetch text picks a known field or accepts plain text', async () => {
  const { deepseekFetchText } = await import('../index.mjs')
  assert.equal(deepseekFetchText('{"content":"page"}'), 'page')
  assert.equal(deepseekFetchText('{"data":{"markdown":"# Title"}}'), '# Title')
  assert.equal(deepseekFetchText('just text'), 'just text')
  assert.equal(deepseekFetchText('{"results":[]}'), undefined)
  assert.equal(deepseekFetchText('   '), undefined)
})

test('reordering the provider list changes which one searches next', async () => {
  const { createProvider, createSearchAggregator } = await import('../index.mjs')
  const hits = []
  const fetchFn = name => async url => {
    hits.push(name)
    return { ok: true, status: 200, json: async () => ({ results: [{ url: `https://${name}.example`, title: name, snippet: 's', date: null }] }) }
  }
  // Order lives in this array, exactly as it lives in the settings document.
  let configs = [
    { id: 'h-dsk10', type: 'deepseek', apiKey: 'k', enabled: true },
    { id: 'h-exa10', type: 'exa', apiKey: 'k', enabled: true },
  ]
  const aggregator = createSearchAggregator(() =>
    configs.filter(c => c.enabled !== false)
      .map(c => createProvider(c, undefined, { fetchFn: c.type === 'deepseek' ? fetchFn('deepseek') : fetchFn('exa') })))

  assert.equal((await aggregator.search({ query: 'q' })).sources[0].url, 'https://deepseek.example')
  configs = [configs[1], configs[0]]
  assert.equal((await aggregator.search({ query: 'q' })).sources[0].url, 'https://exa.example')
  assert.deepEqual(hits, ['deepseek', 'exa'])
})

test('a disabled provider drops out without rebuilding the aggregator', async () => {
  const { createProvider, createSearchAggregator } = await import('../index.mjs')
  let configs = [
    { id: 'h-exa11', type: 'exa', apiKey: 'k', enabled: false },
    { id: 'h-dsk11', type: 'deepseek', apiKey: 'k', enabled: true },
  ]
  const aggregator = createSearchAggregator(() =>
    configs.filter(c => c.enabled !== false)
      .map(c => createProvider(c, undefined, {
        fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ results: [{ url: 'https://ds.example', title: 'ds', snippet: 's', date: null }] }) }),
      })))
  assert.equal(aggregator.available(), true)
  assert.equal((await aggregator.search({ query: 'q' })).sources[0].url, 'https://ds.example')

  configs = configs.map(c => ({ ...c, enabled: false }))
  assert.equal(aggregator.available(), false)
})

test('counts fetches separately from searches', async () => {
  const { countProvider, statsOf, clearCounterCache } = await import('../index.mjs')
  clearCounterCache()
  const provider = countProvider({
    id: 'h-fetch1',
    async search() { return { sources: [] } },
    async fetch() { return { url: 'https://x', statusCode: 200, body: { kind: 'text', content: 'x' }, truncated: false } },
  })
  await provider.search({ query: 'q' })
  await provider.fetch({ url: 'https://x' })
  await provider.fetch({ url: 'https://y' })

  const stats = statsOf('h-fetch1')
  assert.equal(stats.searches, 1)
  assert.equal(stats.errors, 0)
  assert.equal(stats.fetches, 2)
  assert.equal(stats.fetchErrors, 0)
  assert.equal(stats.lastFetch > 0, true)

  const failing = countProvider({ id: 'h-fetch2', async search() { return { sources: [] } }, async fetch() { throw new Error('nope') } })
  await assert.rejects(() => failing.fetch({ url: 'https://z' }))
  assert.equal(statsOf('h-fetch2').fetchErrors, 1)
  assert.equal(statsOf('h-fetch2').lastFetchError > 0, true)
})

test('maps a Responses answer to sources from the call and the citations', async () => {
  const { mapOpenaiResponse } = await import('../index.mjs')
  const payload = {
    output: [
      {
        type: 'web_search_call',
        action: { type: 'search', sources: [
          { url: 'https://a.example', title: 'A' },
          { url: 'https://b.example' },
        ] },
      },
      {
        type: 'message',
        content: [{ type: 'output_text', annotations: [
          { type: 'url_citation', url: 'https://b.example', title: 'B from citation' },
          { type: 'url_citation', url: 'https://c.example', title: 'C' },
        ] }],
      },
    ],
  }
  assert.deepEqual(mapOpenaiResponse(payload).sources, [
    { url: 'https://a.example', title: 'A' },
    { url: 'https://b.example', title: 'B from citation' },
    { url: 'https://c.example', title: 'C' },
  ])
  assert.throws(() => mapOpenaiResponse({ output: [] }), /no web_search_call/)
})

test('OpenAI provider forces the hosted web_search tool', async () => {
  const { createProvider } = await import('../index.mjs')
  const calls = []
  const provider = createProvider({ id: 'h-oai01', type: 'openai', apiKey: 'sk-1', enabled: true }, undefined, {
    fetchFn: async (url, init) => {
      calls.push({ url, init })
      return {
        ok: true, status: 200,
        json: async () => ({ output: [
          { type: 'web_search_call', action: { sources: [{ url: 'https://x.example', title: 'X' }] } },
          { type: 'message', content: [{ type: 'output_text', annotations: [] }] },
        ] }),
      }
    },
  })
  assert.equal(provider.type, 'openai')
  // No page-retrieval API exists, so the fetch aggregator must skip this provider.
  assert.equal(typeof provider.fetch, 'undefined')

  const result = await provider.search({ query: 'курс доллара' })
  assert.deepEqual(result.sources, [{ url: 'https://x.example', title: 'X' }])

  const [{ url, init }] = calls
  assert.equal(url, 'https://api.openai.com/v1/responses')
  assert.equal(init.headers.authorization, 'Bearer sk-1')
  const body = JSON.parse(init.body)
  assert.deepEqual(body.tools, [{ type: 'web_search' }])
  assert.equal(body.tool_choice, 'required')
  assert.deepEqual(body.include, ['web_search_call.action.sources'])
  assert.match(body.input, /курс доллара/)
})

test('stores a provider model through add and save', async () => {
  const { createProviderHandler } = await import('../index.mjs')
  const settings = fakeSettings([])
  const handler = createProviderHandler(settings)

  await callHandler(handler, { body: { action: 'add', draft: { type: 'openai', apiKey: 'sk-1', model: 'gpt-5.5' } } })
  assert.equal(settings.state.providers[0].model, 'gpt-5.5')

  await callHandler(handler, { body: { action: 'save', index: 0, draft: { desc: '', model: 'gpt-4.1', enabled: true } } })
  assert.equal(settings.state.providers[0].model, 'gpt-4.1')
})

test('state reports what each provider can do', async () => {
  const { createProviderHandler } = await import('../index.mjs')
  const settings = fakeSettings([
    { id: 'h-caps1', type: 'openai', apiKey: 'k', enabled: true },
    { id: 'h-caps2', type: 'exa', apiKey: 'k', enabled: true },
  ])
  const response = await callHandler(createProviderHandler(settings), { method: 'GET', url: '/__ws/state' })
  assert.deepEqual(response.payload.providers[0].capabilities, { search: true, fetch: false })
  assert.deepEqual(response.payload.providers[1].capabilities, { search: true, fetch: true })
})

test('a provider may be denied fetch so the next one retrieves pages', async () => {
  const { createProvider, createFetchAggregator } = await import('../index.mjs')
  const hit = []
  const make = (cfg) => createProvider(cfg, undefined, {
    fetchFn: async (url) => {
      hit.push(cfg.type)
      return cfg.type === 'deepseek'
        ? { ok: true, status: 200, text: async () => 'deepseek page' }
        : { ok: true, status: 200, json: async () => ({ results: [{ url: 'https://x.example', text: 'exa page' }] }) }
    },
  })
  const configs = [
    { id: 'h-dsk20', type: 'deepseek', apiKey: 'k', enabled: true, useFetch: false },
    { id: 'h-exa20', type: 'exa', apiKey: 'k', enabled: true },
  ]
  const aggregator = createFetchAggregator(() => configs.map(make))
  const result = await aggregator.fetch({ url: 'https://x.example' })
  assert.equal(result.statusCode, 200)
  assert.deepEqual(hit, ['exa'])
})

test('capabilities fold the per-entry permissions in', async () => {
  const { createProviderHandler } = await import('../index.mjs')
  const settings = fakeSettings([
    { id: 'h-perm1', type: 'exa', apiKey: 'k', enabled: true, useFetch: false },
  ])
  const response = await callHandler(createProviderHandler(settings), { method: 'GET', url: '/__ws/state' })
  assert.deepEqual(response.payload.providers[0].capabilities, { search: true, fetch: false })
})

test('a type that cannot fetch never stores an enabled fetch permission', async () => {
  const { createProviderHandler } = await import('../index.mjs')
  const settings = fakeSettings([])
  const handler = createProviderHandler(settings)

  await callHandler(handler, { body: { action: 'add', draft: { type: 'openai', apiKey: 'sk-1', useFetch: true } } })
  assert.equal(settings.state.providers[0].useFetch, false)
  assert.equal(settings.state.providers[0].useSearch, true)

  await callHandler(handler, { body: { action: 'save', index: 0, draft: { model: '', enabled: true, useFetch: true } } })
  assert.equal(settings.state.providers[0].useFetch, false)
})

test('DeepSeek page retrieval follows redirects and reports the final URL', async () => {
  const { createProvider } = await import('../index.mjs')
  const seen = []
  const provider = createProvider({ id: 'h-red01', type: 'deepseek', apiKey: 'k', enabled: true }, undefined, {
    fetchFn: async (url, init) => {
      seen.push({ url, redirect: init.redirect })
      return {
        ok: true, status: 200,
        url: 'https://example.com/final',
        text: async () => 'final page',
      }
    },
  })
  const result = await provider.fetch({ url: 'http://example.com/start' })
  assert.equal(seen[0].redirect, 'follow')
  assert.equal(result.url, 'https://example.com/final')
  assert.equal(result.body.kind, 'text')
})

test('Jina searches and retrieves through its two endpoints', async () => {
  const { createProvider } = await import('../index.mjs')
  const calls = []
  const provider = createProvider({ id: 'h-jina1', type: 'jina', apiKey: 'jk-1', enabled: true }, undefined, {
    fetchFn: async (url, init) => {
      calls.push({ url, init })
      if (url.startsWith('https://s.jina.ai/')) {
        return { ok: true, status: 200, json: async () => ({ data: [
          { title: 'A', url: 'https://a.example', description: 'about a' },
          { title: 'B', url: 'https://b.example', content: 'long text' },
        ] }) }
      }
      return { ok: true, status: 200, url: 'https://example.com/after-redirect', text: async () => '# Page\n\ntext' }
    },
  })
  assert.equal(provider.available(), true)

  const found = await provider.search({ query: 'курс доллара' })
  assert.deepEqual(found.sources, [
    { url: 'https://a.example', title: 'A', snippet: 'about a' },
    { url: 'https://b.example', title: 'B', snippet: 'long text' },
  ])
  assert.equal(calls[0].url, 'https://s.jina.ai/%D0%BA%D1%83%D1%80%D1%81%20%D0%B4%D0%BE%D0%BB%D0%BB%D0%B0%D1%80%D0%B0')
  assert.equal(calls[0].init.headers.authorization, 'Bearer jk-1')

  const page = await provider.fetch({ url: 'https://example.com' })
  assert.equal(calls[1].url, 'https://r.jina.ai/https://example.com')
  assert.equal(calls[1].init.redirect, 'follow')
  assert.equal(page.url, 'https://example.com/after-redirect')
  assert.equal(page.body.content, '# Page\n\ntext')
})

test('Jina fetches without a key but refuses to search', async () => {
  const { createProvider } = await import('../index.mjs')
  const provider = createProvider({ id: 'h-jina2', type: 'jina', apiKey: '', enabled: true }, undefined, {
    fetchFn: async () => ({ ok: true, status: 200, text: async () => 'page' }),
  })
  assert.equal(provider.available(), true)
  await assert.rejects(() => provider.search({ query: 'q' }), /no API key/)
  assert.equal((await provider.fetch({ url: 'https://example.com' })).body.content, 'page')
})

test('Perplexity searches through the Agent API and reads the search_results item', async () => {
  const { createProvider, mapPerplexityResponse } = await import('../index.mjs')
  const calls = []
  const provider = createProvider({ id: 'h-pplx1', type: 'perplexity', apiKey: 'pk-1', enabled: true }, undefined, {
    fetchFn: async (url, init) => {
      calls.push({ url, init })
      return { ok: true, status: 200, json: async () => ({
        status: 'completed',
        output: [
          { type: 'search_results', results: [
            { url: 'https://a.example', title: 'A', snippet: 'about a', date: '2026-10-28' },
            { url: 'https://a.example', title: 'dup' },
          ] },
          { type: 'message', content: [{ type: 'output_text', text: 'answer' }] },
        ],
      }) }
    },
  })
  assert.equal(provider.type, 'perplexity')
  assert.equal(typeof provider.fetch, 'undefined')

  const result = await provider.search({ query: 'курс доллара' })
  assert.deepEqual(result.sources, [
    { url: 'https://a.example', title: 'A', snippet: 'about a', publishedAt: '2026-10-28' },
  ])

  const [{ url, init }] = calls
  assert.equal(url, 'https://api.perplexity.ai/v1/agent')
  assert.equal(init.headers.authorization, 'Bearer pk-1')
  const body = JSON.parse(init.body)
  assert.equal(body.model, 'perplexity/sonar')
  assert.equal(body.input, 'курс доллара')
  assert.deepEqual(body.tools, [{ type: 'web_search' }])
  assert.deepEqual(body.tool_choice, { type: 'web_search' })
  // Strict mode: nothing from the retired chat-completions body survives.
  assert.deepEqual(Object.keys(body).sort(), ['input', 'model', 'tool_choice', 'tools'])

  // A 200-wrapped failure must not look like an empty answer.
  assert.throws(
    () => mapPerplexityResponse({ status: 'failed', error: { message: 'quota' }, output: [] }),
    /Perplexity run failed: quota/,
  )
  assert.throws(() => mapPerplexityResponse({ status: 'completed', output: [] }), /no search_results item/)
})


test('Tavily searches and extracts pages', async () => {
  const { createProvider } = await import('../index.mjs')
  const calls = []
  const provider = createProvider({ id: 'h-tav01', type: 'tavily', apiKey: 'tvly-1', enabled: true }, undefined, {
    fetchFn: async (url, init) => {
      calls.push({ url, init })
      if (url.endsWith('/search')) {
        return { ok: true, status: 200, json: async () => ({ results: [
          { url: 'https://a.example', title: 'A', content: 'long   snippet', published_date: '2026-10-28' },
          { url: 'https://a.example', title: 'dup', content: 'x' },
        ] }) }
      }
      return { ok: true, status: 200, json: async () => ({ results: [
        { url: 'https://example.com', raw_content: '# Page' },
      ], failed_results: [] }) }
    },
  })
  assert.equal(provider.type, 'tavily')

  const found = await provider.search({ query: 'курс доллара' })
  assert.deepEqual(found.sources, [
    { url: 'https://a.example', title: 'A', snippet: 'long snippet', publishedAt: '2026-10-28' },
  ])
  assert.equal(calls[0].url, 'https://api.tavily.com/search')
  assert.equal(calls[0].init.headers.authorization, 'Bearer tvly-1')
  assert.equal(JSON.parse(calls[0].init.body).max_results, 5)

  const page = await provider.fetch({ url: 'https://example.com' })
  assert.equal(calls[1].url, 'https://api.tavily.com/extract')
  assert.deepEqual(JSON.parse(calls[1].init.body), { urls: ['https://example.com'], format: 'markdown' })
  assert.equal(page.body.content, '# Page')
})

test('Tavily treats a per-URL extract failure as an error, not an empty page', async () => {
  const { createProvider } = await import('../index.mjs')
  const provider = createProvider({ id: 'h-tav02', type: 'tavily', apiKey: 'tvly-1' }, undefined, {
    fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ results: [], failed_results: [{ url: 'https://x', error: 'blocked' }] }) }),
  })
  await assert.rejects(() => provider.fetch({ url: 'https://x' }), /could not extract .*blocked/)
})

test('handler refusals carry a code the page can translate', async () => {
  const { createProviderHandler } = await import('../index.mjs')
  const settings = fakeSettings([])
  const handler = createProviderHandler(settings)

  const unknown = await callHandler(handler, { body: { action: 'add', draft: { type: 'nope', apiKey: 'k' } } })
  assert.equal(unknown.status, 400)
  assert.equal(unknown.payload.code, 'unsupported-type')
  assert.equal(unknown.payload.params.type, 'nope')

  const noKey = await callHandler(handler, { body: { action: 'add', draft: { type: 'exa', apiKey: '  ' } } })
  assert.equal(noKey.payload.code, 'key-required')

  const badAction = await callHandler(handler, { body: { action: 'nonsense' } })
  assert.equal(badAction.payload.code, 'unknown-action')

  const badIndex = await callHandler(handler, { body: { action: 'delete', index: 7 } })
  assert.equal(badIndex.payload.code, 'index-out-of-range')
})
