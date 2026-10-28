import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('../client/index.jsx', import.meta.url), 'utf8')

/** Every class the markup asks for. */
const used = new Set()
for (const match of source.matchAll(/className: '([^']+)'/g)) {
  for (const name of match[1].split(/\s+/)) if (name !== '') used.add(name)
}

/** Every class the stylesheet defines a rule for. */
const css = source.slice(source.indexOf('const CSS = `'), source.indexOf('\n`\n', source.indexOf('const CSS = `')))
const defined = new Set()
for (const match of css.matchAll(/\.([a-z][\w-]*)/g)) defined.add(match[1])

test('every class used by the page has a rule in the stylesheet', () => {
  // A class without a rule silently loses its layout, which is how the picker
  // popup once rendered as a plain block and the help plates stacked.
  const missing = [...used].filter(name => !defined.has(name)).sort()
  assert.deepEqual(missing, [], `classes without CSS: ${missing.join(', ')}`)
})
