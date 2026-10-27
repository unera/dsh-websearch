import { useEffect, useSyncExternalStore, useState } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

const NS = 'settings.webSearch'
const SECTION_ID = 'websearch'
const NS_HOST = 'dsh-websearch'

/*
 * Field chrome lives in a stylesheet rather than inline styles, because the
 * secret input needs `:autofill` rules: Firefox paints an autofilled field with
 * its own background and text colour, which turned the key box white on white.
 * `color-scheme: dark` keeps that repaint dark when the shell is dark.
 */
const CSS = `
.dws-field {
  background: transparent; border: 1px solid rgba(127,127,127,.35); border-radius: 6px;
  color: inherit; color-scheme: dark; font: inherit; min-width: 0; padding: 8px 10px; width: 100%;
}
.dws-field:focus { outline: 1px solid rgba(127,127,127,.7); outline-offset: 0; }
.dws-field::placeholder { color: inherit; opacity: .45; }
.dws-field:-webkit-autofill, .dws-field:autofill {
  -webkit-text-fill-color: inherit;
  box-shadow: 0 0 0 1000px rgba(127,127,127,.14) inset;
}
.dws-one-line { display: block; overflow: hidden; resize: vertical; }
`

function mountStyle() {
  if (typeof document === 'undefined') return
  if (document.querySelector('style[data-plugin-css="dsh-websearch"]') !== null) return
  const tag = document.createElement('style')
  tag.dataset.plugin = '@dr-co/dsh-websearch'
  tag.dataset.pluginCss = 'dsh-websearch'
  tag.textContent = CSS
  document.head.appendChild(tag)
}
mountStyle()

function useForm(form) {
  return useSyncExternalStore(form.subscribe.bind(form), form.getSnapshot.bind(form), form.getSnapshot.bind(form))
}

function providersOf(value) {
  return Array.isArray(value?.providers) ? value.providers.map(provider => ({ ...provider })) : []
}

/**
 * Provider indices whose `apiKey` the host reports as set. The value itself
 * never reaches the page: `describe` answers only whether a secret is stored,
 * addressed by its config path.
 * @returns Map of provider index → true.
 */
function keyedIndices(describeValue) {
  const namespace = describeValue?.namespaces?.find(view => view.ns === NS_HOST)
  const keyed = new Map()
  for (const secret of namespace?.secrets ?? []) {
    const [head, index, field] = secret.path ?? []
    if (head === 'providers' && field === 'apiKey' && secret.set === true) keyed.set(String(index), true)
  }
  return keyed
}

function WebSearchPage(props) {
  const { ctx } = props
  const form = ctx.configForms.get(NS_HOST)
  const snapshot = useForm(form)
  const [draftKey, setDraftKey] = useState({})
  const [keySet, setKeySet] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const refreshKeySet = async () => {
    try {
      const view = await ctx.remote.settings.describe()
      setKeySet(Object.fromEntries(keyedIndices(view)))
    } catch {
      // An unavailable describe must not lock the form: fall back to what this
      // page saved itself, and let the host refuse an unusable provider later.
    }
  }
  useEffect(() => { refreshKeySet() }, [])

  const heading = jsx('h2', { style: styles.heading, children: 'Web search' })
  if (snapshot.status === 'loading') return jsxs('div', { children: [heading, jsx('p', { children: 'Loading…' })] })
  if (snapshot.status === 'unavailable') return jsxs('div', { children: [heading, jsx('p', { children: 'Settings namespace is not served.' })] })

  const providers = providersOf(snapshot.value)
  const locked = busy || !snapshot.writable

  const save = async (next) => {
    setBusy(true); setError('')
    try { if (!await form.set('providers', next)) setError('The deployment rejected these values.') }
    catch (e) { setError(String(e?.message ?? e)) }
    finally { setBusy(false) }
  }
  const patch = (index, field, value) => {
    const next = providersOf(snapshot.value)
    next[index] = { ...next[index], [field]: value }
    return save(next)
  }
  const add = () => save([...providersOf(snapshot.value), {
    id: `h-${Math.random().toString(36).slice(2, 7)}`,
    type: 'exa',
    desc: '',
    apiKey: '',
    // A provider starts off; it may only be switched on once its key is stored.
    enabled: false,
  }])
  const saveKey = async (index) => {
    const value = draftKey[index]
    await patch(index, 'apiKey', value)
    setDraftKey({ ...draftKey, [index]: '' })
    setKeySet(previous => ({ ...previous, [String(index)]: true }))
    refreshKeySet()
  }

  return jsxs('section', { style: styles.page, children: [
    heading,
    jsx('p', { style: styles.hint, children: 'Exa providers used for web search. Description is optional; a provider can be enabled once its API key is stored.' }),
    ...providers.map((provider, index) => {
      const hasKey = keySet[String(index)] === true || (draftKey[index] ?? '').trim() !== ''
      return jsxs('div', { style: styles.card, children: [
        jsxs('div', { style: styles.row, children: [
          jsx('textarea', {
            className: 'dws-field dws-one-line',
            rows: 1,
            value: provider.desc ?? '',
            placeholder: 'Description (optional)',
            spellCheck: false,
            autoComplete: 'off',
            disabled: locked,
            onChange: e => patch(index, 'desc', e.target.value),
          }),
          jsxs('label', { style: styles.enabled, title: hasKey ? '' : 'Store an API key first', children: [
            jsx('input', {
              type: 'checkbox',
              checked: provider.enabled === true,
              // The requested gate: a provider may be switched on only once its
              // key is stored. Switching an enabled one off always stays allowed.
              disabled: locked || (!hasKey && provider.enabled !== true),
              onChange: e => patch(index, 'enabled', e.target.checked),
            }),
            ' enabled',
          ] }),
          jsx('button', {
            style: styles.button, disabled: locked,
            onClick: () => save(providersOf(snapshot.value).filter((_, at) => at !== index)),
            children: 'Delete',
          }),
        ] }),
        jsxs('div', { style: styles.row, children: [
          jsx('input', {
            className: 'dws-field',
            type: 'password',
            value: draftKey[index] ?? '',
            name: `dsh-websearch-key-${index}`,
            // Keeps Firefox's password manager from offering to save a search key.
            autoComplete: 'new-password',
            placeholder: keySet[String(index)] === true ? 'Key stored — enter a new one' : 'Exa API key',
            disabled: locked,
            onChange: e => setDraftKey({ ...draftKey, [index]: e.target.value }),
          }),
          jsx('button', {
            style: styles.button,
            disabled: locked || (draftKey[index] ?? '').trim() === '',
            onClick: () => saveKey(index),
            children: 'Save key',
          }),
        ] }),
        jsx('small', { style: styles.meta, children: `id ${provider.id ?? '—'} · ${provider.type ?? 'exa'}${hasKey ? '' : ' · key required to enable'}` }),
      ] })
    }),
    jsx('button', { style: styles.button, disabled: locked, onClick: add, children: '+ Add Exa provider' }),
    error !== '' && jsx('p', { style: styles.error, children: error }),
  ] })
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 760 },
  heading: { margin: 0, fontSize: 20, fontWeight: 600 },
  hint: { margin: 0, opacity: 0.7, fontSize: 13 },
  card: { border: '1px solid rgba(127,127,127,.3)', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 },
  row: { display: 'flex', gap: 8, alignItems: 'center' },
  button: { padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(127,127,127,.35)', background: 'transparent', color: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap' },
  enabled: { whiteSpace: 'nowrap', fontSize: 13 },
  meta: { opacity: 0.55 },
  error: { margin: 0, color: '#f66' },
}

export function apply(ctx) {
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: SECTION_ID,
    order: 35,
    locale: NS,
    label: () => 'Web search',
  }, props => jsx(WebSearchPage, { ...props, ctx })))
}

export const inject = ['slots', 'locale', 'configForms', 'remote']
