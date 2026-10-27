import { useEffect, useState } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

const NS = 'settings.webSearch'
const SECTION_ID = 'websearch'
const API = '/__ws'

/* Exa logomark, inlined so the page never depends on an external image fetch. */
const EXA_ICON = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg width="107" height="129" viewBox="0 0 107 129" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M106.417 9.30741C106.417 9.57392 106.324 9.83227 106.155 10.0388L61.5395 64.5L106.155 118.96C106.324 119.166 106.417 119.425 106.417 119.691V127.843C106.417 128.482 105.897 129 105.255 129H1.16175C0.520132 129 0 128.482 0 127.843V1.15695C0 0.517982 0.520131 0 1.16174 0H105.255C105.897 0 106.417 0.517984 106.417 1.15695V9.30741ZM19.0364 116.382H87.6921L53.363 74.4795L19.0364 116.382ZM12.6699 104.192L40.1426 70.6585H12.6699V104.192ZM12.6699 58.0409H39.8964L12.6699 24.8064V58.0409ZM53.363 54.5193L87.6921 12.6176H19.0364L53.363 54.5193Z" fill="#0143D9"/></svg>',
)

/** Provider type → the name a person reads. */
const TYPE_LABELS = { exa: 'Exa' }
const typeLabel = type => TYPE_LABELS[type] ?? String(type ?? 'unknown')
const iconOf = type => ((type ?? 'exa') === 'exa' ? EXA_ICON : null)

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
  -webkit-text-fill-color: inherit; box-shadow: 0 0 0 1000px rgba(127,127,127,.14) inset;
}
.dws-one-line { display: block; overflow: hidden; resize: none; }
.dws-icon {
  background: transparent; border: 1px solid rgba(127,127,127,.35); border-radius: 6px;
  color: inherit; cursor: pointer; font: inherit; line-height: 1; padding: 4px 8px;
}
.dws-icon:disabled { cursor: default; opacity: .35; }
.dws-row { align-items: center; border-radius: 8px; cursor: pointer; display: flex; gap: 8px; padding: 4px 6px; }
.dws-row:hover { background: rgba(127,127,127,.10); }
.dws-row[data-selected="true"] { background: rgba(127,127,127,.20); }
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

async function call(path, body) {
  const response = await fetch(`${API}${path}`, body === undefined
    ? { cache: 'no-store' }
    : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
  const text = await response.text()
  const payload = text === '' ? null : JSON.parse(text)
  if (!response.ok) throw new Error(payload?.error ?? `${response.status} ${response.statusText}`)
  return payload
}

const emptyEntry = { desc: '', apiKey: '', enabled: true }

export function WebSearchPage() {
  const [providers, setProviders] = useState([])
  const [selected, setSelected] = useState(null)
  const [entry, setEntry] = useState(emptyEntry)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const apply = payload => { if (Array.isArray(payload?.providers)) setProviders(payload.providers) }

  const run = async (action, work) => {
    setBusy(true); setError('')
    try {
      await work()
      apply(await call('/state'))
    } catch (e) {
      setError(String(e?.message ?? e))
    } finally {
      setBusy(false)
    }
    return action
  }

  useEffect(() => {
    call('/state').then(apply).catch(e => setError(String(e?.message ?? e))).finally(() => setLoading(false))
  }, [])

  const select = (index) => {
    if (busy) return
    if (selected === index) {
      setSelected(null)
      setEntry(emptyEntry)
      return
    }
    const provider = providers[index]
    setSelected(index)
    // The stored key never leaves the host, so the field starts empty and a
    // blank value on save keeps what is stored.
    setEntry({ desc: provider?.desc ?? '', apiKey: '', enabled: provider?.enabled !== false })
  }

  const editing = selected !== null && providers[selected] !== undefined
  const hasStoredKey = editing && providers[selected].keySet === true
  const canEnable = hasStoredKey || entry.apiKey.trim() !== ''
  const canSubmit = !busy && entry.apiKey !== undefined && (editing || entry.apiKey.trim() !== '')

  const submit = () => {
    const draft = { desc: entry.desc, apiKey: entry.apiKey.trim(), enabled: entry.enabled === true }
    run(editing ? 'save' : 'add', () => call('/providers', editing
      ? { action: 'save', index: selected, draft }
      : { action: 'add', draft }))
      .then(() => { setSelected(null); setEntry(emptyEntry) })
  }

  const act = (action) => (event) => {
    event.stopPropagation()
    run(action.action, () => call('/providers', action))
  }

  if (loading) return jsxs('div', { children: [jsx('h2', { style: styles.heading, children: 'Web search' }), jsx('p', { children: 'Loading…' })] })

  return jsxs('section', { style: styles.page, children: [
    jsx('h2', { style: styles.heading, children: 'Web search' }),
    jsx('p', { style: styles.hint, children: 'Exa providers used for web search. Description is optional; a provider can be enabled once its API key is stored.' }),

    jsxs('div', { style: styles.addCard, children: [
      jsx('textarea', {
        className: 'dws-field dws-one-line', rows: 1, value: entry.desc,
        placeholder: 'Description (optional)', spellCheck: false, autoComplete: 'off', disabled: busy,
        onChange: e => setEntry({ ...entry, desc: e.target.value }),
      }),
      jsx('input', {
        className: 'dws-field', type: 'password', value: entry.apiKey, name: 'dsh-websearch-key',
        autoComplete: 'new-password', disabled: busy,
        placeholder: editing && hasStoredKey ? 'Key stored — leave blank to keep it' : 'Exa API key (required)',
        onChange: e => setEntry({ ...entry, apiKey: e.target.value }),
      }),
      jsxs('div', { style: styles.row, children: [
        jsxs('label', { style: styles.enabled, title: canEnable ? '' : 'Store the API key first', children: [
          jsx('input', {
            type: 'checkbox', checked: entry.enabled === true, disabled: busy || !canEnable,
            onChange: e => setEntry({ ...entry, enabled: e.target.checked }),
          }),
          ' enabled',
        ] }),
        jsx('button', { style: styles.button, disabled: !canSubmit, onClick: submit, children: editing ? `Save ${typeLabel(providers[selected]?.type)}` : 'Add provider' }),
        editing && jsx('button', {
          style: styles.button, disabled: busy,
          onClick: () => { setSelected(null); setEntry(emptyEntry) },
          children: 'Cancel',
        }),
      ] }),
    ] }),

    providers.length > 0 && jsx('ul', { style: styles.list, children: providers.map((provider, index) => {
      const on = provider.enabled === true
      const icon = iconOf(provider.type)
      return jsxs('li', {
        className: 'dws-row',
        'data-selected': String(index === selected),
        style: styles.item,
        onClick: () => select(index),
        title: 'Click to edit',
        children: [
          jsx('button', {
            className: 'dws-icon',
            disabled: busy,
            title: on ? 'Disable' : 'Enable',
            onClick: act({ action: 'toggle', index }),
            children: on ? '⏸' : '▶',
          }),
          jsx('span', { style: styles.id, children: provider.id || '—' }),
          icon !== null && jsx('img', { src: icon, alt: typeLabel(provider.type), width: 13, height: 16, style: { flex: '0 0 auto', opacity: on ? 1 : 0.35 } }),
          provider.desc !== '' && jsx('span', { style: styles.desc, children: provider.desc }),
          jsxs('span', { style: styles.actions, children: [
            jsx('button', { className: 'dws-icon', disabled: busy, title: 'Delete', onClick: act({ action: 'delete', index }), children: '×' }),
            jsx('button', { className: 'dws-icon', disabled: busy || index === 0, title: 'Move up', onClick: act({ action: 'move', index, delta: -1 }), children: '↑' }),
            jsx('button', { className: 'dws-icon', disabled: busy || index === providers.length - 1, title: 'Move down', onClick: act({ action: 'move', index, delta: 1 }), children: '↓' }),
          ] }),
        ],
      })
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
  list: { display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, padding: 0 },
  item: { alignItems: 'center', display: 'flex', gap: 8 },
  id: { flex: '0 0 auto', fontFamily: 'monospace', fontSize: 12, opacity: 0.75 },
  desc: { flex: '1 1 auto', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  actions: { display: 'flex', flex: '0 0 auto', gap: 4 },
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
  }, WebSearchPage))
}

export const inject = ['slots', 'locale']
