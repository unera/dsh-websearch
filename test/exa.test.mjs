import test from 'node:test'
import assert from 'node:assert/strict'
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
