import { useEffect, useState } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { DICTIONARIES, NS, TYPE_LABELS, TYPE_OPTIONS } from './locales.js'

const SECTION_ID = 'websearch'
const API = '/__ws'

/* Exa logomark, inlined so the page never depends on an external image fetch. */
const EXA_ICON = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg width="107" height="129" viewBox="0 0 107 129" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M106.417 9.30741C106.417 9.57392 106.324 9.83227 106.155 10.0388L61.5395 64.5L106.155 118.96C106.324 119.166 106.417 119.425 106.417 119.691V127.843C106.417 128.482 105.897 129 105.255 129H1.16175C0.520132 129 0 128.482 0 127.843V1.15695C0 0.51798 0.520131 0 1.16174 0H105.255C105.897 0 106.417 0.517984 106.417 1.15695V9.30741ZM19.0364 116.382H87.6921L53.363 74.4795L19.0364 116.382ZM12.6699 104.192L40.1426 70.6585H12.6699V104.192ZM12.6699 58.0409H39.8964L12.6699 24.8064V58.0409ZM53.363 54.5193L87.6921 12.6176H19.0364L53.363 54.5193Z" fill="#0143D9"/></svg>',
)

const typeLabel = type => TYPE_LABELS[type] ?? String(type ?? '')
const iconOf = type => ((type ?? 'exa') === 'exa' ? EXA_ICON : null)

/*
 * Field chrome lives in a stylesheet rather than inline styles, because the
 * secret input needs `:autofill` rules: Firefox paints an autofilled field with
 * its own background and text colour, which turned the key box white on white.
 * `color-scheme: dark` keeps that repaint dark when the shell is dark.
 *
 * `box-sizing: border-box` and `min-width: 0` are what keep a wide value from
 * pushing the field outside its card — the broken layout was exactly that.
 */
const CSS = `
.dws-field {
  background: transparent; border: 1px solid rgba(127,127,127,.35); border-radius: 6px;
  box-sizing: border-box; color: inherit; color-scheme: dark; font: inherit;
  max-width: 100%; min-width: 0; padding: 6px 9px; width: 100%;
}
.dws-field:focus { outline: 1px solid rgba(127,127,127,.7); outline-offset: 0; }
.dws-field::placeholder { color: inherit; opacity: .45; }
.dws-field:-webkit-autofill, .dws-field:autofill {
  -webkit-text-fill-color: inherit; box-shadow: 0 0 0 1000px rgba(127,127,127,.14) inset;
}
.dws-icon {
  background: transparent; border: 1px solid rgba(127,127,127,.35); border-radius: 6px;
  color: inherit; cursor: pointer; font: inherit; line-height: 1; padding: 4px 8px;
}
.dws-icon:disabled { cursor: default; opacity: .35; }
.dws-row { align-items: center; border-radius: 8px; cursor: pointer; display: flex; gap: 8px; padding: 4px 6px; }
.dws-row:hover { background: rgba(127,127,127,.10); }
.dws-row[data-selected="true"] { background: rgba(127,127,127,.20); }
.dws-card {
  border: 1px solid rgba(127,127,127,.3); border-radius: 10px; box-sizing: border-box;
  display: flex; flex-direction: column; gap: 10px; max-width: 100%; min-width: 0; padding: 12px;
}
.dws-fieldset { display: flex; flex-direction: column; gap: 4px; min-width: 0; width: 100%; }
.dws-label { font-size: 12px; opacity: .7; }
.dws-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; }
.dws-button {
  background: transparent; border: 1px solid rgba(127,127,127,.35); border-radius: 6px;
  color: inherit; cursor: pointer; font: inherit; padding: 7px 12px; white-space: nowrap;
}
.dws-button:disabled { cursor: default; opacity: .4; }
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

const emptyDraft = { type: '', desc: '', apiKey: '', enabled: true }

/** The language the host is showing, read off the dictionary it handed us. */
const uiLanguage = t => {
  const title = t('nav.title')
  if (title === 'Веб-поиск') return 'ru'
  if (title === '网络搜索') return 'zh'
  return 'en'
}

export function WebSearchPage(props) {
  const t = typeof props?.t === 'function' ? props.t : key => key
  const [providers, setProviders] = useState([])
  const [selected, setSelected] = useState(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('')
  const [registered, setRegistered] = useState(null)

  const apply = payload => {
    if (Array.isArray(payload?.providers)) setProviders(payload.providers)
    if (typeof payload?.searchProvider === 'string') setActive(payload.searchProvider)
    if (typeof payload?.registered === 'boolean') setRegistered(payload)
  }

  const run = async (work) => {
    setBusy(true); setError('')
    try {
      await work()
      apply(await call('/state'))
    } catch (e) {
      setError(String(e?.message ?? e))
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    call('/state').then(apply).catch(e => setError(String(e?.message ?? e))).finally(() => setLoading(false))
  }, [])

  const editing = selected !== null && providers[selected] !== undefined
  const formType = editing ? (providers[selected].type ?? 'exa') : draft.type
  const showingForm = editing || formType !== ''
  const hasStoredKey = editing && providers[selected].keySet === true
  const canEnable = hasStoredKey || draft.apiKey.trim() !== ''
  const canSubmit = !busy && formType !== '' && (editing || draft.apiKey.trim() !== '')

  const selectRow = index => {
    if (busy) return
    if (selected === index) {
      setSelected(null)
      setDraft(emptyDraft)
      return
    }
    const provider = providers[index]
    setSelected(index)
    // The stored key never leaves the host, so the field starts empty and a
    // blank value on save keeps what is stored.
    setDraft({
      type: provider?.type ?? 'exa',
      desc: provider?.desc ?? '',
      apiKey: '',
      enabled: provider?.enabled !== false,
    })
  }

  const chooseType = event => {
    const type = event.target.value
    setSelected(null)
    setDraft({ ...emptyDraft, type })
  }

  const reset = () => {
    setSelected(null)
    setDraft(emptyDraft)
  }

  const submit = () => {
    const body = {
      desc: draft.desc,
      apiKey: draft.apiKey.trim(),
      enabled: draft.enabled === true,
    }
    run(() => call('/providers', editing
      ? { action: 'save', index: selected, draft: body }
      : { action: 'add', draft: { ...body, type: formType } }))
      .then(reset)
  }

  const act = action => (event) => {
    event.stopPropagation()
    run(() => call('/providers', action))
  }

  const lang = uiLanguage(t)
  const when = ms => (typeof ms === 'number' && ms > 0 ? new Date(ms).toLocaleString(lang) : t('common.never'))

  if (loading) {
    return jsxs('section', { style: styles.page, children: [
      jsx('h2', { style: styles.heading, children: t('nav.title') }),
      jsx('p', { children: t('common.loading') }),
    ] })
  }

  const fieldset = (label, control) => jsxs('label', { className: 'dws-fieldset', children: [
    jsx('span', { className: 'dws-label', children: label }),
    control,
  ] })

  // One list, built in order: the empty choice while adding, a stored type this
  // build does not offer yet, then every type the host supports.
  const typeOptions = []
  if (!editing && formType === '') {
    typeOptions.push(jsx('option', { value: '', children: t('form.typeNone'), key: '' }))
  }
  if (formType !== '' && !TYPE_OPTIONS.includes(formType)) {
    typeOptions.push(jsx('option', { value: formType, children: typeLabel(formType), key: formType }))
  }
  for (const type of TYPE_OPTIONS) {
    typeOptions.push(jsx('option', { value: type, children: typeLabel(type), key: type }))
  }

  const typeSelect = jsx('select', {
    className: 'dws-field',
    value: formType,
    disabled: busy || editing,
    title: editing ? t('form.typeLocked') : undefined,
    onChange: editing ? undefined : chooseType,
    children: typeOptions,
  })

  return jsxs('section', { style: styles.page, children: [
    jsx('h2', { style: styles.heading, children: t('nav.title') }),
    jsx('p', { style: styles.hint, children: t('page.hint') }),
    jsxs('div', { style: styles.row, children: [
      jsx('span', {
        style: styles.activeLabel,
        children: active === 'dsh-websearch'
          ? t('page.activeSelf')
          : `${t('page.activeOther')}${active === '' ? t('page.activeNone') : active}`,
      }),
      active === 'dsh-websearch' && registered !== null && jsx('span', {
        style: registered.registered ? styles.green : styles.red,
        children: registered.registered
          ? t('page.registered')
          : `${t('page.notRegistered')}${registered.reason || t('page.unknown')}`,
      }),
      active !== 'dsh-websearch' && jsx('button', {
        className: 'dws-button', disabled: busy,
        onClick: () => run(() => call('/providers', { action: 'select' })),
        children: t('page.useForSearch'),
      }),
    ] }),

    jsxs('div', { className: 'dws-card', children: [
      fieldset(t('form.type'), typeSelect),
      !showingForm && jsx('p', { style: styles.hint, children: t('form.chooseHint') }),
      showingForm && fieldset(t('form.desc'), jsx('input', {
        className: 'dws-field', type: 'text', value: draft.desc,
        placeholder: t('form.descPlaceholder'), spellCheck: false, autoComplete: 'off', disabled: busy,
        onChange: e => setDraft({ ...draft, desc: e.target.value }),
      })),
      showingForm && fieldset(t('form.secret'), jsx('input', {
        className: 'dws-field', type: 'password', value: draft.apiKey, name: 'dsh-websearch-key',
        autoComplete: 'new-password', disabled: busy,
        placeholder: hasStoredKey ? t('form.secretStored') : t('form.secretNew'),
        onChange: e => setDraft({ ...draft, apiKey: e.target.value }),
      })),
      showingForm && jsxs('div', { className: 'dws-actions', children: [
        jsxs('label', { style: styles.enabled, title: canEnable ? '' : t('form.needKey'), children: [
          jsx('input', {
            type: 'checkbox', checked: draft.enabled === true, disabled: busy || !canEnable,
            onChange: e => setDraft({ ...draft, enabled: e.target.checked }),
          }),
          ` ${t('form.enabled')}`,
        ] }),
        jsx('button', {
          className: 'dws-button', disabled: !canSubmit, onClick: submit,
          children: editing ? `${t('form.save')} ${typeLabel(formType)}` : t('form.add'),
        }),
        editing && jsx('button', {
          className: 'dws-button', disabled: busy, onClick: reset, children: t('form.cancel'),
        }),
      ] }),
    ] }),

    providers.length > 0 && jsx('ul', { style: styles.list, children: providers.map((provider, index) => {
      const on = provider.enabled === true
      const icon = iconOf(provider.type)
      const stats = provider.stats ?? {}
      return jsxs('li', {
        className: 'dws-row',
        'data-selected': String(index === selected),
        style: styles.item,
        onClick: () => selectRow(index),
        title: t('list.edit'),
        children: [
          jsxs('div', { style: styles.line, children: [
            jsx('button', {
              className: 'dws-icon',
              disabled: busy,
              title: on ? t('list.disable') : t('list.enable'),
              onClick: act({ action: 'toggle', index }),
              children: on ? '⏸' : '▶',
            }),
            jsx('span', { style: styles.id, children: provider.id || '—' }),
            icon !== null && jsx('img', {
              src: icon, alt: typeLabel(provider.type), width: 13, height: 16,
              style: { flex: '0 0 auto', opacity: on ? 1 : 0.35 },
            }),
            provider.desc !== '' && jsx('span', { style: styles.desc, children: provider.desc }),
            jsxs('span', { style: styles.actions, children: [
              jsx('button', { className: 'dws-icon', disabled: busy, title: t('list.delete'), onClick: act({ action: 'delete', index }), children: '×' }),
              jsx('button', { className: 'dws-icon', disabled: busy || index === 0, title: t('list.up'), onClick: act({ action: 'move', index, delta: -1 }), children: '↑' }),
              jsx('button', { className: 'dws-icon', disabled: busy || index === providers.length - 1, title: t('list.down'), onClick: act({ action: 'move', index, delta: 1 }), children: '↓' }),
            ] }),
          ] }),
          jsxs('div', { style: styles.under, children: [
            jsxs('span', {
              style: styles.counters,
              title: `${t('list.lastSearch')}${when(stats.lastSearch)}\n${t('list.lastError')}${when(stats.lastError)}`,
              children: [
                jsx('span', { style: styles.muted, children: t('list.counters') }),
                jsx('span', { style: styles.green, children: stats.searches ?? 0 }),
                jsx('span', { style: styles.slash, children: '/' }),
                jsx('span', { style: styles.red, children: stats.errors ?? 0 }),
              ],
            }),
            jsx('button', {
              className: 'dws-icon', disabled: busy, title: t('list.reset'),
              onClick: act({ action: 'reset', index }), children: '⟲',
            }),
          ] }),
        ],
      }, provider.id || String(index))
    }) }),

    error !== '' && jsx('p', { style: styles.error, children: error }),
  ] })
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 780, minWidth: 0 },
  heading: { margin: 0, fontSize: 20, fontWeight: 600 },
  hint: { margin: 0, opacity: 0.7, fontSize: 13 },
  list: { display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, padding: 0 },
  item: { alignItems: 'stretch', display: 'flex', flexDirection: 'column', gap: 2 },
  line: { alignItems: 'center', display: 'flex', gap: 8, minWidth: 0 },
  under: { alignItems: 'center', display: 'flex', gap: 6, paddingLeft: 2 },
  id: { flex: '0 0 auto', fontFamily: 'monospace', fontSize: 12, opacity: 0.75 },
  desc: { flex: '1 1 auto', fontSize: 13, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  actions: { display: 'flex', flex: '0 0 auto', gap: 4 },
  counters: { flex: '0 0 auto', fontFamily: 'monospace', fontSize: 12, whiteSpace: 'nowrap' },
  green: { color: '#3fb950' },
  red: { color: '#f85149' },
  slash: { opacity: 0.5 },
  activeLabel: { fontSize: 12, opacity: 0.75 },
  muted: { opacity: 0.6 },
  row: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, minWidth: 0 },
  enabled: { whiteSpace: 'nowrap', fontSize: 13 },
  error: { margin: 0, color: '#f66' },
}

export function apply(ctx) {
  let t = key => key
  try {
    t = ctx.locale.bind(NS)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[dsh-websearch] locale unavailable, keys are shown as is: ${error?.message ?? error}`)
  }

  try {
    ctx.effect(() => {
      ctx.locale.register(NS, 'en', DICTIONARIES.en)
      ctx.locale.register(NS, 'zh', DICTIONARIES.zh)
      return () => {}
    }, 'dsh-websearch: dictionaries')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[dsh-websearch] dictionaries failed: ${error?.message ?? error}`)
  }

  // Another plugin may have registered `ru` first; the registry throws on a
  // duplicate id and that must not take the page down with it.
  try {
    ctx.effect(() => {
      try {
        return ctx.locale.addLanguage('ru')
      } catch (error) {
        if (!/already/i.test(String(error?.message ?? error))) throw error
        return () => {}
      }
    }, 'dsh-websearch: ru language')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[dsh-websearch] ru language failed: ${error?.message ?? error}`)
  }

  try {
    ctx.effect(() => {
      ctx.locale.register(NS, 'ru', DICTIONARIES.ru)
      return () => {}
    }, 'dsh-websearch: ru dictionary')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[dsh-websearch] ru dictionary failed: ${error?.message ?? error}`)
  }

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: SECTION_ID,
    order: 35,
    locale: NS,
    label: () => t('nav.title'),
  }, WebSearchPage))
}

export const inject = ['slots', 'locale']
