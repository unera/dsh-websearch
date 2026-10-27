import { useSyncExternalStore, useState } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

const NS = 'settings.webSearch'
const SECTION_ID = 'websearch'
const NS_HOST = 'dsh-websearch'

function useForm(form) {
  return useSyncExternalStore(form.subscribe.bind(form), form.getSnapshot.bind(form), form.getSnapshot.bind(form))
}

function providersOf(value) {
  return Array.isArray(value?.providers) ? value.providers.map(provider => ({ ...provider })) : []
}

function WebSearchPage(props) {
  const { ctx } = props
  const form = ctx.configForms.get(NS_HOST)
  const snapshot = useForm(form)
  const [draftKey, setDraftKey] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

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
    id: `h-${Math.random().toString(36).slice(2, 7)}`, type: 'exa', desc: '', apiKey: '', enabled: true,
  }])

  return jsxs('section', { style: styles.page, children: [
    heading,
    jsx('p', { style: styles.hint, children: 'Exa providers used for web search. The key is stored as a secret.' }),
    ...providers.map((provider, index) => jsxs('div', { style: styles.card, children: [
      jsxs('div', { style: styles.row, children: [
        jsx('input', {
          style: styles.input, value: provider.desc ?? '', placeholder: 'Description',
          disabled: locked, onChange: e => patch(index, 'desc', e.target.value),
        }),
        jsx('label', { style: styles.enabled, children: [
          jsx('input', {
            type: 'checkbox', checked: provider.enabled !== false, disabled: locked,
            onChange: e => patch(index, 'enabled', e.target.checked),
          }), ' enabled',
        ] }),
        jsx('button', {
          style: styles.button, disabled: locked,
          onClick: () => save(providersOf(snapshot.value).filter((_, at) => at !== index)),
          children: 'Delete',
        }),
      ] }),
      jsxs('div', { style: styles.row, children: [
        jsx('input', {
          style: styles.input, type: 'password', value: draftKey[index] ?? '',
          placeholder: provider.apiKeySet || provider.apiKey ? 'Key configured — enter a new one' : 'Exa API key',
          disabled: locked, onChange: e => setDraftKey({ ...draftKey, [index]: e.target.value }),
        }),
        jsx('button', {
          style: styles.button,
          disabled: locked || (draftKey[index] ?? '').trim() === '',
          onClick: () => {
            const value = draftKey[index]
            setDraftKey({ ...draftKey, [index]: '' })
            patch(index, 'apiKey', value)
          },
          children: 'Save key',
        }),
      ] }),
      jsx('small', { style: styles.meta, children: `id ${provider.id ?? '—'} · ${provider.type ?? 'exa'}` }),
    ] })),
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
  input: { flex: 1, minWidth: 0, padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(127,127,127,.35)', background: 'transparent', color: 'inherit' },
  button: { padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(127,127,127,.35)', background: 'transparent', color: 'inherit', cursor: 'pointer' },
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

export const inject = ['slots', 'locale', 'configForms']
