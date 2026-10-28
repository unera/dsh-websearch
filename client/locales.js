// Interface dictionaries: Russian, Chinese and English.
//
// Chinese is the primary locale (the host ships it as default), Russian is what we
// read, English is the fallback the registry already knows. Every key must exist in
// all three — `test/locales.test.mjs` compares the key sets, because a missing key
// only shows on somebody else's screen.

export const NS = 'dsh-websearch'

export const en = {
  'nav.title': 'Web search',
  'page.hint': 'Exa providers used for web search. Description is optional; a provider can be enabled once its API key is stored.',
  'page.activeSelf': 'This aggregator is the active search provider.',
  'page.activeOther': 'Active search provider: ',
  'page.activeNone': 'none',
  'page.useForSearch': 'Use for search and page fetch',
  'page.registered': 'registered',
  'page.notRegistered': 'not registered: ',
  'page.unknown': 'unknown',
  'form.type': 'Provider',
  'form.typeNone': 'none',
  'form.typeLocked': 'The provider type cannot be changed — add a new entry instead',
  'form.chooseHint': 'Choose a web search provider.',
  'form.desc': 'Description',
  'form.descPlaceholder': 'Description (optional)',
  'form.secret': 'Secret',
  'form.secretNew': 'API key (required)',
  'form.secretStored': 'Key stored — leave blank to keep it',
  'form.enabled': 'enabled',
  'form.needKey': 'Store the API key first',
  'form.add': 'Add',
  'form.save': 'Save',
  'form.cancel': 'Cancel',
  'list.edit': 'Click to edit',
  'list.disable': 'Currently enabled. Click to disable.',
  'list.enable': 'Currently disabled. Click to enable.',
  'list.up': 'Move up',
  'list.down': 'Move down',
  'list.delete': 'Delete',
  'list.reset': 'reset',
  'list.counters': 'searches and fetches: ',
  'list.and': ' and ',
  'list.lastSearch': 'last search: ',
  'list.lastError': 'last search error: ',
  'list.lastFetch': 'last fetch: ',
  'list.lastFetchError': 'last fetch error: ',
  'common.loading': 'Loading…',
  'common.never': 'never'
}

export const ru = {
  'nav.title': 'Веб-поиск',
  'page.hint': 'Провайдеры Exa для поиска в интернете. Описание необязательно; включить провайдера можно после сохранения API-ключа.',
  'page.activeSelf': 'Этот агрегатор — активный провайдер поиска.',
  'page.activeOther': 'Активный провайдер поиска: ',
  'page.activeNone': 'нет',
  'page.useForSearch': 'Использовать для поиска и загрузки страниц',
  'page.registered': 'зарегистрирован',
  'page.notRegistered': 'не зарегистрирован: ',
  'page.unknown': 'неизвестно',
  'form.type': 'Провайдер',
  'form.typeNone': 'нет',
  'form.typeLocked': 'Тип провайдера нельзя изменить — добавьте новую запись',
  'form.chooseHint': 'Выберите провайдера поиска в интернете.',
  'form.desc': 'Описание',
  'form.descPlaceholder': 'Описание (необязательно)',
  'form.secret': 'Секрет',
  'form.secretNew': 'API-ключ (обязательно)',
  'form.secretStored': 'Ключ сохранён — оставьте пустым, чтобы сохранить',
  'form.enabled': 'включён',
  'form.needKey': 'Сначала сохраните API-ключ',
  'form.add': 'Добавить',
  'form.save': 'Сохранить',
  'form.cancel': 'Отмена',
  'list.edit': 'Нажмите, чтобы изменить',
  'list.disable': 'Включён. Нажмите, чтобы выключить.',
  'list.enable': 'Выключен. Нажмите, чтобы включить.',
  'list.up': 'Выше',
  'list.down': 'Ниже',
  'list.delete': 'Удалить',
  'list.reset': 'сбросить',
  'list.counters': 'запросов и выборок: ',
  'list.and': ' и ',
  'list.lastSearch': 'последний поиск: ',
  'list.lastError': 'последняя ошибка поиска: ',
  'list.lastFetch': 'последняя выборка: ',
  'list.lastFetchError': 'последняя ошибка выборки: ',
  'common.loading': 'Загрузка…',
  'common.never': 'никогда'
}

export const zh = {
  'nav.title': '网络搜索',
  'page.hint': '用于网络搜索的 Exa 提供方。描述可选；保存 API 密钥后才能启用提供方。',
  'page.activeSelf': '此聚合器是当前生效的搜索提供方。',
  'page.activeOther': '当前生效的搜索提供方：',
  'page.activeNone': '无',
  'page.useForSearch': '用于搜索和抓取网页',
  'page.registered': '已注册',
  'page.notRegistered': '未注册：',
  'page.unknown': '未知',
  'form.type': '提供方',
  'form.typeNone': '无',
  'form.typeLocked': '提供方类型不可修改 — 请新增一条记录',
  'form.chooseHint': '请选择网络搜索的提供方。',
  'form.desc': '描述',
  'form.descPlaceholder': '描述（可选）',
  'form.secret': '密钥',
  'form.secretNew': 'API 密钥（必填）',
  'form.secretStored': '密钥已保存 — 留空则保持不变',
  'form.enabled': '已启用',
  'form.needKey': '请先保存 API 密钥',
  'form.add': '添加',
  'form.save': '保存',
  'form.cancel': '取消',
  'list.edit': '点击以编辑',
  'list.disable': '已启用。点击停用。',
  'list.enable': '已停用。点击启用。',
  'list.up': '上移',
  'list.down': '下移',
  'list.delete': '删除',
  'list.reset': '重置',
  'list.counters': '搜索与抓取：',
  'list.and': ' 和 ',
  'list.lastSearch': '上次搜索：',
  'list.lastError': '上次搜索错误：',
  'list.lastFetch': '上次抓取：',
  'list.lastFetchError': '上次抓取错误：',
  'common.loading': '正在加载…',
  'common.never': '从未'
}

export const DICTIONARIES = { en, ru, zh }

/** Provider type → the name a person reads. Types come from the host. */
export const TYPE_LABELS = { exa: 'Exa', deepseek: 'DeepSeek', openai: 'OpenAI' }

/** Types the form offers, in the order of the host's `PROVIDER_TYPES`. */
export const TYPE_OPTIONS = ['exa', 'deepseek', 'openai']
