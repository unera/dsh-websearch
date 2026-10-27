import { useSyncExternalStore, useState } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

const NS = 'settings.webSearch'

function useForm(form) {
  return useSyncExternalStore(form.subscribe.bind(form), form.getSnapshot.bind(form), form.getSnapshot.bind(form))
}

function cloneProviders(value) {
  return Array.isArray(value?.providers) ? value.providers.map(provider => ({ ...provider })) : []
}

function WebSearchCard({ view, ctx }) {
  const form = ctx.configForms.get('dsh-websearch')
  const snapshot = useForm(form)
  const [draftKey, setDraftKey] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (view === 'summary') return 'Configure Exa web search providers.'
  if (snapshot.status === 'loading') return jsx('div', { children: 'Loading web search settings…' })
  if (snapshot.status === 'unavailable') return jsx('div', { children: 'Web search settings are unavailable.' })

  const providers = cloneProviders(snapshot.value)
  const update = (index, field, value) => {
    const next = cloneProviders(snapshot.value)
    next[index] = { ...next[index], [field]: value }
    return next
  }
  const save = async (next) => {
    setBusy(true); setError('')
    try { if (!await form.set('providers', next)) setError('Settings were rejected.') }
    catch (e) { setError(String(e?.message ?? e)) }
    finally { setBusy(false) }
  }
  const add = () => save([...providers, { id: `h-${Math.random().toString(36).slice(2, 7)}`, type: 'exa', desc: '', apiKey: '', enabled: true }])
  const remove = (index) => save(providers.filter((_, at) => at !== index))
  const edit = (index, field, value) => save(update(index, field, value))

  return jsxs('section', { style: styles.section, children: [
    jsx('p', { style: styles.hint, children: 'Add Exa search providers. API keys are stored as secrets.' }),
    ...providers.map((provider, index) => jsxs('div', { style: styles.card, children: [
      jsxs('div', { style: styles.row, children: [
        jsx('input', { style: styles.input, value: provider.desc ?? '', placeholder: 'Description', disabled: busy || !snapshot.writable, onChange: e => edit(index, 'desc', e.target.value) }),
        jsx('label', { style: styles.enabled, children: [jsx('input', { type: 'checkbox', checked: provider.enabled !== false, disabled: busy || !snapshot.writable, onChange: e => edit(index, 'enabled', e.target.checked) }), ' enabled'] }),
        jsx('button', { disabled: busy || !snapshot.writable, onClick: () => remove(index), children: 'Delete' })
      ] }),
      jsxs('div', { style: styles.row, children: [
        jsx('input', { style: styles.input, type: 'password', value: draftKey[index] ?? '', placeholder: provider.apiKey ? 'API key configured — enter to replace' : 'Exa API key', disabled: busy || !snapshot.writable, onChange: e => setDraftKey({ ...draftKey, [index]: e.target.value }) }),
        jsx('button', { disabled: busy || !snapshot.writable || !(draftKey[index] ?? '').trim(), onClick: () => { const value = draftKey[index]; setDraftKey({ ...draftKey, [index]: '' }); edit(index, 'apiKey', value) }, children: 'Set key' })
      ] }),
      jsx('small', { style: styles.meta, children: `id: ${provider.id ?? 'generated'}` })
    ] })),
    jsx('button', { disabled: busy || !snapshot.writable, onClick: add, children: '+ Add Exa provider' }),
    error && jsx('p', { style: styles.error, children: error })
  ] })
}

const styles = {
  section: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { border: '1px solid var(--dsw-alias-border-secondary, #555)', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 },
  row: { display: 'flex', gap: 8, alignItems: 'center' },
  input: { flex: 1, minWidth: 0, padding: '8px 10px', borderRadius: 6, border: '1px solid var(--dsw-alias-border-secondary, #555)', background: 'transparent', color: 'inherit' },
  enabled: { whiteSpace: 'nowrap' },
  hint: { margin: 0, opacity: 0.75 },
  meta: { opacity: 0.55 },
  error: { color: '#f66' }
}

export function apply(ctx) {
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('plugins.item', () => ctx.slots.register({
    name: 'plugins.item', id: 'dsh-websearch', order: 25,
    label: () => 'Web search', locale: NS
  }, props => jsx(WebSearchCard, { ...props, ctx })))
}

export const inject = ['slots', 'locale', 'configForms']
