import { useEffect, useSyncExternalStore, useState } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

const NS = 'settings.webSearch'
const SECTION_ID = 'websearch'
const NS_HOST = 'dsh-websearch'

/* Exa logomark, inlined so the page never depends on an external image fetch. */
const EXA_ICON = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg width="107" height="129" viewBox="0 0 107 129" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M106.417 9.30741C106.417 9.57392 106.324 9.83227 106.155 10.0388L61.5395 64.5L106.155 118.96C106.324 119.166 106.417 119.425 106.417 119.691V127.843C106.417 128.482 105.897 129 105.255 129H1.16175C0.520132 129 0 128.482 0 127.843V1.15695C0 0.517982 0.520131 0 1.16174 0H105.255C105.897 0 106.417 0.517984 106.417 1.15695V9.30741ZM19.0364 116.382H87.6921L53.363 74.4795L19.0364 116.382ZM12.6699 104.192L40.1426 70.6585H12.6699V104.192ZM12.6699 58.0409H39.8964L12.6699 24.8064V58.0409ZM53.363 54.5193L87.6921 12.6176H19.0364L53.363 54.5193Z" fill="#0143D9"/></svg>',
)

/** Provider type → the name a person reads. */
const TYPE_LABELS = { exa: 'Exa' }
const typeLabel = type => TYPE_LABELS[type] ?? String(type ?? 'unknown')

/*
 * Field chrome lives in a stylesheet rather than inline styles, because the
 * secret input needs `:autofill` rules: Firefox paints an autofilled field with
 * its own background and text colour, which turned the key box white on white.
 * `color-scheme: dark` keeps that repaint dark when the shell is dark.
 */
const CSS = `
.dws-field {
  background: transparent; border: 1px solid rgba(127,127,127,.35); border-radius: 6px;
  color: inherit; color-scheme: dark; font: inherit; min-width: 0; padding: 6px 9px; width: 100%;
}
.dws-field:focus { outline: 1px solid rgba(127,127,127,.7); outline-offset: 0; }
.dws-field::placeholder { color: inherit; opacity: .45; }
.dws-field:-webkit-autofill, .dws-field:autofill {
  -webkit-text-fill-color: inherit;
  box-shadow: 0 0 0 1000px rgba(127,127,127,.14) inset;
}
.dws-one-line { display: block; overflow: hidden; resize: none; }
.dws-icon {
  background: transparent; border: 1px solid rgba(127,127,127,.35); border-radius: 6px;
  color: inherit; cursor: pointer; font: inherit; line-height: 1; padding: 4px 8px;
}
.dws-icon:disabled { cursor: default; opacity: .35; }
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
 * Provider indices whose `apiKey` the host reports as stored. The value itself
 * never reaches the page: `describe` answers only whether a secret is set,
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

const newProviderId = () => `h-${Math.random().toString(36).slice(2, 7)}`

export function WebSearchPage(props) {
  const { ctx } = props
  const form = ctx.configForms.get(NS_HOST)
  const snapshot = useForm(form)
  const [draft, setDraft] = useState([])
  const [keySet, setKeySet] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [entry, setEntry] = useState({ desc: '', apiKey: '', enabled: true })

  const refreshKeySet = async () => {
    try {
      const view = await ctx.remote.settings.describe()
      setKeySet(Object.fromEntries(keyedIndices(view)))
    } catch {
      // An unavailable describe must not lock the form: the host still refuses
      // a provider it cannot authenticate.
    }
  }
  useEffect(() => { refreshKeySet() }, [])

  // The draft follows the host document whenever the host publishes a revision,
  // so typing never writes on every keystroke.
  useEffect(() => { setDraft(providersOf(snapshot.value)) }, [snapshot.revision, snapshot.status])

  const heading = jsx('h2', { style: styles.heading, children: 'Web search' })
  if (snapshot.status === 'loading') return jsxs('div', { children: [heading, jsx('p', { children: 'Loading…' })] })
  if (snapshot.status === 'unavailable') return jsxs('div', { children: [heading, jsx('p', { children: 'Settings namespace is not served.' })] })

  const locked = busy || !snapshot.writable

  const commit = async (next) => {
    setBusy(true); setError('')
    try {
      if (!await form.set('providers', next)) setError('The deployment rejected these values.')
      else setDraft(next)
    } catch (e) {
      setError(String(e?.message ?? e))
    } finally {
      setBusy(false)
    }
  }

  const move = (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= draft.length) return
    const next = [...draft]
    ;[next[index], next[target]] = [next[target], next[index]]
    commit(next)
  }
  const remove = (index) => commit(draft.filter((_, at) => at !== index))

  const canAdd = !locked && entry.apiKey.trim() !== ''
  const add = async () => {
    const apiKey = entry.apiKey.trim()
    if (apiKey === '') return
    // A newly added provider goes to the top of the list.
    await commit([{
      id: newProviderId(),
      type: 'exa',
      desc: entry.desc.trim(),
      apiKey,
      enabled: entry.enabled === true,
    }, ...draft])
    setEntry({ desc: '', apiKey: '', enabled: true })
    refreshKeySet()
  }

  return jsxs('section', { style: styles.page, children: [
    heading,
    jsx('p', { style: styles.hint, children: 'Exa providers used for web search. Description is optional; a provider can be enabled once its API key is stored.' }),

    jsxs('div', { style: styles.addCard, children: [
      jsx('textarea', {
        className: 'dws-field dws-one-line', rows: 1, value: entry.desc,
        placeholder: 'Description (optional)', spellCheck: false, autoComplete: 'off', disabled: locked,
        onChange: e => setEntry({ ...entry, desc: e.target.value }),
      }),
      jsx('input', {
        className: 'dws-field', type: 'password', value: entry.apiKey, name: 'dsh-websearch-new-key',
        autoComplete: 'new-password', placeholder: 'Exa API key (required)', disabled: locked,
        onChange: e => setEntry({ ...entry, apiKey: e.target.value }),
      }),
      jsxs('div', { style: styles.row, children: [
        jsxs('label', { style: styles.enabled, title: canAdd ? '' : 'Enter the API key first', children: [
          jsx('input', {
            type: 'checkbox', checked: entry.enabled === true, disabled: !canAdd,
            onChange: e => setEntry({ ...entry, enabled: e.target.checked }),
          }),
          ' enabled',
        ] }),
        jsx('button', { style: styles.button, disabled: !canAdd, onClick: add, children: 'Add provider' }),
      ] }),
    ] }),

    draft.length > 0 && jsx('ul', { style: styles.list, children: draft.map((provider, index) => {
      const on = provider.enabled === true
      const hasKey = keySet[String(index)] === true || String(provider.apiKey ?? '').trim() !== ''
      return jsxs('li', { style: styles.item, children: [
        jsx('img', {
          src: EXA_ICON, alt: typeLabel(provider.type), width: 14, height: 17,
          style: { flex: '0 0 auto', opacity: on ? 1 : 0.35 },
        }),
        jsx('span', { style: styles.kind, title: on ? '' : 'Disabled', children: typeLabel(provider.type) }),
        jsx('span', { style: styles.desc, title: hasKey ? '' : 'No API key stored', children: provider.desc || '\u2014' }),
        jsx('button', { className: 'dws-icon', disabled: locked, onClick: () => remove(index), title: 'Delete', children: '×' }),
        jsx('button', { className: 'dws-icon', disabled: locked || index === 0, onClick: () => move(index, -1), title: 'Move up', children: '↑' }),
        jsx('button', { className: 'dws-icon', disabled: locked || index === draft.length - 1, onClick: () => move(index, 1), title: 'Move down', children: '↓' }),
      ] })
    }) }),

    error !== '' && jsx('p', { style: styles.error, children: error }),
  ] })
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 780 },
  heading: { margin: 0, fontSize: 20, fontWeight: 600 },
  hint: { margin: 0, opacity: 0.7, fontSize: 13 },
  addCard: {
    border: '1px solid rgba(127,127,127,.3)', borderRadius: 10, padding: 12,
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  list: { display: 'flex', flexDirection: 'column', gap: 4, listStyle: 'none', margin: 0, padding: 0 },
  item: { alignItems: 'center', display: 'flex', gap: 8, padding: '2px 0' },
  kind: { flex: '0 0 auto', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' },
  desc: {
    flex: '1 1 auto', fontSize: 13, opacity: 0.75, overflow: 'hidden',
    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  row: { alignItems: 'center', display: 'flex', gap: 8 },
  button: {
    padding: '7px 12px', borderRadius: 6, border: '1px solid rgba(127,127,127,.35)',
    background: 'transparent', color: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap',
  },
  enabled: { whiteSpace: 'nowrap', fontSize: 13 },
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
