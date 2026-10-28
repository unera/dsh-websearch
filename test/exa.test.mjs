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

  assert.deepEqual(statsOf('h-broken'), { searches: 0, errors: 0, lastSearch: 0, lastError: 0 })
  assert.deepEqual(statsOf('h-missing1'), { searches: 0, errors: 0, lastSearch: 0, lastError: 0 })
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
  assert.deepEqual(statsOf('h-zero1'), { searches: 0, errors: 0, lastSearch: 0, lastError: 0 })
  assert.deepEqual(response.payload.providers[0].stats, { searches: 0, errors: 0, lastSearch: 0, lastError: 0 })
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
