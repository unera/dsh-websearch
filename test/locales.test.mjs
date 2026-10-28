import test from 'node:test'
import assert from 'node:assert/strict'

import { DICTIONARIES, NS, TYPE_OPTIONS, TYPE_LABELS } from '../client/locales.js'

const languages = Object.keys(DICTIONARIES)

test('every dictionary carries exactly the same keys', () => {
  const reference = Object.keys(DICTIONARIES.en).sort()
  for (const language of languages) {
    assert.deepEqual(Object.keys(DICTIONARIES[language]).sort(), reference, `${language} key set differs`)
  }
})

test('no dictionary value is empty or still a raw key', () => {
  for (const language of languages) {
    for (const [key, value] of Object.entries(DICTIONARIES[language])) {
      assert.equal(typeof value, 'string', `${language}:${key} is not a string`)
      assert.notEqual(value.trim(), '', `${language}:${key} is empty`)
      assert.notEqual(value, key, `${language}:${key} was not translated`)
    }
  }
})

test('the three languages are actually different where it matters', () => {
  assert.equal(DICTIONARIES.ru['nav.title'], 'Веб-поиск')
  assert.equal(DICTIONARIES.zh['nav.title'], '网络搜索')
  assert.equal(DICTIONARIES.en['nav.title'], 'Web search')
  assert.notEqual(DICTIONARIES.ru['form.chooseHint'], DICTIONARIES.en['form.chooseHint'])
})

test('the namespace and the type table are stable', () => {
  assert.equal(NS, 'dsh-websearch')
  assert.deepEqual([...TYPE_OPTIONS], ['exa', 'deepseek', 'openai', 'jina', 'perplexity', 'tavily', 'firecrawl'])
  assert.equal(TYPE_LABELS.exa, 'Exa')
  assert.equal(TYPE_LABELS.deepseek, 'DeepSeek')
  assert.equal(TYPE_LABELS.openai, 'OpenAI')
  assert.equal(TYPE_LABELS.jina, 'Jina')
  assert.equal(TYPE_LABELS.perplexity, 'Perplexity')
  assert.equal(TYPE_LABELS.tavily, 'Tavily')
  assert.equal(TYPE_LABELS.firecrawl, 'Firecrawl')
})
