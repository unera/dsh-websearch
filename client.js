window.__ModuleLoader__.load({
  id: "@dr-co/dsh-websearch",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// client/index.jsx
var index_exports = {};
__export(index_exports, {
  WebSearchPage: () => WebSearchPage,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");

// client/locales.js
var NS = "dsh-websearch";
var en = {
  "nav.title": "Web search",
  "page.hint": "Exa providers used for web search. Description is optional; a provider can be enabled once its API key is stored.",
  "page.activeSelf": "This aggregator is the active search provider.",
  "page.activeOther": "Active search provider: ",
  "page.activeNone": "none",
  "page.useForSearch": "Use for search",
  "page.registered": "registered",
  "page.notRegistered": "not registered: ",
  "page.unknown": "unknown",
  "form.type": "Provider",
  "form.typeNone": "\u2014 choose a provider \u2014",
  "form.typeLocked": "The provider type cannot be changed \u2014 add a new entry instead",
  "form.chooseHint": "Choose a web search provider.",
  "form.desc": "Description",
  "form.descPlaceholder": "Description (optional)",
  "form.secret": "Secret",
  "form.secretNew": "API key (required)",
  "form.secretStored": "Key stored \u2014 leave blank to keep it",
  "form.enabled": "enabled",
  "form.needKey": "Store the API key first",
  "form.add": "Add",
  "form.save": "Save",
  "form.cancel": "Cancel",
  "list.edit": "Click to edit",
  "list.disable": "Currently enabled. Click to disable.",
  "list.enable": "Currently disabled. Click to enable.",
  "list.up": "Move up",
  "list.down": "Move down",
  "list.delete": "Delete",
  "list.reset": "reset",
  "list.counters": "requests/errors: ",
  "list.lastSearch": "last search: ",
  "list.lastError": "last error: ",
  "common.loading": "Loading\u2026",
  "common.never": "never"
};
var ru = {
  "nav.title": "\u0412\u0435\u0431-\u043F\u043E\u0438\u0441\u043A",
  "page.hint": "\u041F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u044B Exa \u0434\u043B\u044F \u043F\u043E\u0438\u0441\u043A\u0430 \u0432 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0435. \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E; \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 \u043C\u043E\u0436\u043D\u043E \u043F\u043E\u0441\u043B\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F API-\u043A\u043B\u044E\u0447\u0430.",
  "page.activeSelf": "\u042D\u0442\u043E\u0442 \u0430\u0433\u0440\u0435\u0433\u0430\u0442\u043E\u0440 \u2014 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440 \u043F\u043E\u0438\u0441\u043A\u0430.",
  "page.activeOther": "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440 \u043F\u043E\u0438\u0441\u043A\u0430: ",
  "page.activeNone": "\u043D\u0435\u0442",
  "page.useForSearch": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0434\u043B\u044F \u043F\u043E\u0438\u0441\u043A\u0430",
  "page.registered": "\u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D",
  "page.notRegistered": "\u043D\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D: ",
  "page.unknown": "\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E",
  "form.type": "\u041F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440",
  "form.typeNone": "\u2014 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 \u2014",
  "form.typeLocked": "\u0422\u0438\u043F \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 \u043D\u0435\u043B\u044C\u0437\u044F \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u2014 \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043D\u043E\u0432\u0443\u044E \u0437\u0430\u043F\u0438\u0441\u044C",
  "form.chooseHint": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 \u043F\u043E\u0438\u0441\u043A\u0430 \u0432 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0435.",
  "form.desc": "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
  "form.descPlaceholder": "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)",
  "form.secret": "\u0421\u0435\u043A\u0440\u0435\u0442",
  "form.secretNew": "API-\u043A\u043B\u044E\u0447 (\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)",
  "form.secretStored": "\u041A\u043B\u044E\u0447 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u2014 \u043E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u0443\u0441\u0442\u044B\u043C, \u0447\u0442\u043E\u0431\u044B \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
  "form.enabled": "\u0432\u043A\u043B\u044E\u0447\u0451\u043D",
  "form.needKey": "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0435 API-\u043A\u043B\u044E\u0447",
  "form.add": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
  "form.save": "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
  "form.cancel": "\u041E\u0442\u043C\u0435\u043D\u0430",
  "list.edit": "\u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C",
  "list.disable": "\u0412\u043A\u043B\u044E\u0447\u0451\u043D. \u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u0432\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C.",
  "list.enable": "\u0412\u044B\u043A\u043B\u044E\u0447\u0435\u043D. \u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u044C.",
  "list.up": "\u0412\u044B\u0448\u0435",
  "list.down": "\u041D\u0438\u0436\u0435",
  "list.delete": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
  "list.reset": "\u0441\u0431\u0440\u043E\u0441\u0438\u0442\u044C",
  "list.counters": "\u0437\u0430\u043F\u0440\u043E\u0441\u043E\u0432/\u043E\u0448\u0438\u0431\u043E\u043A: ",
  "list.lastSearch": "\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043F\u043E\u0438\u0441\u043A: ",
  "list.lastError": "\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043E\u0448\u0438\u0431\u043A\u0430: ",
  "common.loading": "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026",
  "common.never": "\u043D\u0438\u043A\u043E\u0433\u0434\u0430"
};
var zh = {
  "nav.title": "\u7F51\u7EDC\u641C\u7D22",
  "page.hint": "\u7528\u4E8E\u7F51\u7EDC\u641C\u7D22\u7684 Exa \u63D0\u4F9B\u65B9\u3002\u63CF\u8FF0\u53EF\u9009\uFF1B\u4FDD\u5B58 API \u5BC6\u94A5\u540E\u624D\u80FD\u542F\u7528\u63D0\u4F9B\u65B9\u3002",
  "page.activeSelf": "\u6B64\u805A\u5408\u5668\u662F\u5F53\u524D\u751F\u6548\u7684\u641C\u7D22\u63D0\u4F9B\u65B9\u3002",
  "page.activeOther": "\u5F53\u524D\u751F\u6548\u7684\u641C\u7D22\u63D0\u4F9B\u65B9\uFF1A",
  "page.activeNone": "\u65E0",
  "page.useForSearch": "\u7528\u4E8E\u641C\u7D22",
  "page.registered": "\u5DF2\u6CE8\u518C",
  "page.notRegistered": "\u672A\u6CE8\u518C\uFF1A",
  "page.unknown": "\u672A\u77E5",
  "form.type": "\u63D0\u4F9B\u65B9",
  "form.typeNone": "\u2014 \u8BF7\u9009\u62E9\u63D0\u4F9B\u65B9 \u2014",
  "form.typeLocked": "\u63D0\u4F9B\u65B9\u7C7B\u578B\u4E0D\u53EF\u4FEE\u6539 \u2014 \u8BF7\u65B0\u589E\u4E00\u6761\u8BB0\u5F55",
  "form.chooseHint": "\u8BF7\u9009\u62E9\u7F51\u7EDC\u641C\u7D22\u7684\u63D0\u4F9B\u65B9\u3002",
  "form.desc": "\u63CF\u8FF0",
  "form.descPlaceholder": "\u63CF\u8FF0\uFF08\u53EF\u9009\uFF09",
  "form.secret": "\u5BC6\u94A5",
  "form.secretNew": "API \u5BC6\u94A5\uFF08\u5FC5\u586B\uFF09",
  "form.secretStored": "\u5BC6\u94A5\u5DF2\u4FDD\u5B58 \u2014 \u7559\u7A7A\u5219\u4FDD\u6301\u4E0D\u53D8",
  "form.enabled": "\u5DF2\u542F\u7528",
  "form.needKey": "\u8BF7\u5148\u4FDD\u5B58 API \u5BC6\u94A5",
  "form.add": "\u6DFB\u52A0",
  "form.save": "\u4FDD\u5B58",
  "form.cancel": "\u53D6\u6D88",
  "list.edit": "\u70B9\u51FB\u4EE5\u7F16\u8F91",
  "list.disable": "\u5DF2\u542F\u7528\u3002\u70B9\u51FB\u505C\u7528\u3002",
  "list.enable": "\u5DF2\u505C\u7528\u3002\u70B9\u51FB\u542F\u7528\u3002",
  "list.up": "\u4E0A\u79FB",
  "list.down": "\u4E0B\u79FB",
  "list.delete": "\u5220\u9664",
  "list.reset": "\u91CD\u7F6E",
  "list.counters": "\u8BF7\u6C42/\u9519\u8BEF\uFF1A",
  "list.lastSearch": "\u4E0A\u6B21\u641C\u7D22\uFF1A",
  "list.lastError": "\u4E0A\u6B21\u9519\u8BEF\uFF1A",
  "common.loading": "\u6B63\u5728\u52A0\u8F7D\u2026",
  "common.never": "\u4ECE\u672A"
};
var DICTIONARIES = { en, ru, zh };
var TYPE_LABELS = { exa: "Exa", deepseek: "DeepSeek" };
var TYPE_OPTIONS = ["exa", "deepseek"];

// client/index.jsx
var SECTION_ID = "websearch";
var API = "/__ws";
var EXA_ICON = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg width="107" height="129" viewBox="0 0 107 129" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M106.417 9.30741C106.417 9.57392 106.324 9.83227 106.155 10.0388L61.5395 64.5L106.155 118.96C106.324 119.166 106.417 119.425 106.417 119.691V127.843C106.417 128.482 105.897 129 105.255 129H1.16175C0.520132 129 0 128.482 0 127.843V1.15695C0 0.51798 0.520131 0 1.16174 0H105.255C105.897 0 106.417 0.517984 106.417 1.15695V9.30741ZM19.0364 116.382H87.6921L53.363 74.4795L19.0364 116.382ZM12.6699 104.192L40.1426 70.6585H12.6699V104.192ZM12.6699 58.0409H39.8964L12.6699 24.8064V58.0409ZM53.363 54.5193L87.6921 12.6176H19.0364L53.363 54.5193Z" fill="#0143D9"/></svg>'
);
var typeLabel = (type) => TYPE_LABELS[type] ?? String(type ?? "");
var iconOf = (type) => (type ?? "exa") === "exa" ? EXA_ICON : null;
var CSS = `
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
`;
function mountStyle() {
  if (typeof document === "undefined") return;
  if (document.querySelector('style[data-plugin-css="dsh-websearch"]') !== null) return;
  const tag = document.createElement("style");
  tag.dataset.plugin = "@dr-co/dsh-websearch";
  tag.dataset.pluginCss = "dsh-websearch";
  tag.textContent = CSS;
  document.head.appendChild(tag);
}
mountStyle();
async function call(path, body) {
  const response = await fetch(`${API}${path}`, body === void 0 ? { cache: "no-store" } : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const text = await response.text();
  const payload = text === "" ? null : JSON.parse(text);
  if (!response.ok) throw new Error(payload?.error ?? `${response.status} ${response.statusText}`);
  return payload;
}
var emptyDraft = { type: "", desc: "", apiKey: "", enabled: true };
var uiLanguage = (t) => {
  const title = t("nav.title");
  if (title === "\u0412\u0435\u0431-\u043F\u043E\u0438\u0441\u043A") return "ru";
  if (title === "\u7F51\u7EDC\u641C\u7D22") return "zh";
  return "en";
};
function WebSearchPage(props) {
  const t = typeof props?.t === "function" ? props.t : (key) => key;
  const [providers, setProviders] = (0, import_react.useState)([]);
  const [selected, setSelected] = (0, import_react.useState)(null);
  const [draft, setDraft] = (0, import_react.useState)(emptyDraft);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)("");
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [active, setActive] = (0, import_react.useState)("");
  const [registered, setRegistered] = (0, import_react.useState)(null);
  const apply2 = (payload) => {
    if (Array.isArray(payload?.providers)) setProviders(payload.providers);
    if (typeof payload?.searchProvider === "string") setActive(payload.searchProvider);
    if (typeof payload?.registered === "boolean") setRegistered(payload);
  };
  const run = async (work) => {
    setBusy(true);
    setError("");
    try {
      await work();
      apply2(await call("/state"));
    } catch (e) {
      setError(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  };
  (0, import_react.useEffect)(() => {
    call("/state").then(apply2).catch((e) => setError(String(e?.message ?? e))).finally(() => setLoading(false));
  }, []);
  const editing = selected !== null && providers[selected] !== void 0;
  const formType = editing ? providers[selected].type ?? "exa" : draft.type;
  const showingForm = editing || formType !== "";
  const hasStoredKey = editing && providers[selected].keySet === true;
  const canEnable = hasStoredKey || draft.apiKey.trim() !== "";
  const canSubmit = !busy && formType !== "" && (editing || draft.apiKey.trim() !== "");
  const selectRow = (index) => {
    if (busy) return;
    if (selected === index) {
      setSelected(null);
      setDraft(emptyDraft);
      return;
    }
    const provider = providers[index];
    setSelected(index);
    setDraft({
      type: provider?.type ?? "exa",
      desc: provider?.desc ?? "",
      apiKey: "",
      enabled: provider?.enabled !== false
    });
  };
  const chooseType = (event) => {
    const type = event.target.value;
    setSelected(null);
    setDraft({ ...emptyDraft, type });
  };
  const reset = () => {
    setSelected(null);
    setDraft(emptyDraft);
  };
  const submit = () => {
    const body = {
      desc: draft.desc,
      apiKey: draft.apiKey.trim(),
      enabled: draft.enabled === true
    };
    run(() => call("/providers", editing ? { action: "save", index: selected, draft: body } : { action: "add", draft: { ...body, type: formType } })).then(reset);
  };
  const act = (action) => (event) => {
    event.stopPropagation();
    run(() => call("/providers", action));
  };
  const lang = uiLanguage(t);
  const when = (ms) => typeof ms === "number" && ms > 0 ? new Date(ms).toLocaleString(lang) : t("common.never");
  if (loading) {
    return (0, import_jsx_runtime.jsxs)("section", { style: styles.page, children: [
      (0, import_jsx_runtime.jsx)("h2", { style: styles.heading, children: t("nav.title") }),
      (0, import_jsx_runtime.jsx)("p", { children: t("common.loading") })
    ] });
  }
  const fieldset = (label, control) => (0, import_jsx_runtime.jsxs)("label", { className: "dws-fieldset", children: [
    (0, import_jsx_runtime.jsx)("span", { className: "dws-label", children: label }),
    control
  ] });
  const typeOptions = [];
  if (!editing && formType === "") {
    typeOptions.push((0, import_jsx_runtime.jsx)("option", { value: "", children: t("form.typeNone"), key: "" }));
  }
  if (formType !== "" && !TYPE_OPTIONS.includes(formType)) {
    typeOptions.push((0, import_jsx_runtime.jsx)("option", { value: formType, children: typeLabel(formType), key: formType }));
  }
  for (const type of TYPE_OPTIONS) {
    typeOptions.push((0, import_jsx_runtime.jsx)("option", { value: type, children: typeLabel(type), key: type }));
  }
  const typeSelect = (0, import_jsx_runtime.jsx)("select", {
    className: "dws-field",
    value: formType,
    disabled: busy || editing,
    title: editing ? t("form.typeLocked") : void 0,
    onChange: editing ? void 0 : chooseType,
    children: typeOptions
  });
  return (0, import_jsx_runtime.jsxs)("section", { style: styles.page, children: [
    (0, import_jsx_runtime.jsx)("h2", { style: styles.heading, children: t("nav.title") }),
    (0, import_jsx_runtime.jsx)("p", { style: styles.hint, children: t("page.hint") }),
    (0, import_jsx_runtime.jsxs)("div", { style: styles.row, children: [
      (0, import_jsx_runtime.jsx)("span", {
        style: styles.activeLabel,
        children: active === "dsh-websearch" ? t("page.activeSelf") : `${t("page.activeOther")}${active === "" ? t("page.activeNone") : active}`
      }),
      active === "dsh-websearch" && registered !== null && (0, import_jsx_runtime.jsx)("span", {
        style: registered.registered ? styles.green : styles.red,
        children: registered.registered ? t("page.registered") : `${t("page.notRegistered")}${registered.reason || t("page.unknown")}`
      }),
      active !== "dsh-websearch" && (0, import_jsx_runtime.jsx)("button", {
        className: "dws-button",
        disabled: busy,
        onClick: () => run(() => call("/providers", { action: "select" })),
        children: t("page.useForSearch")
      })
    ] }),
    (0, import_jsx_runtime.jsxs)("div", { className: "dws-card", children: [
      // One row, three cells: the provider type, its description, and the key with
      // the button that submits the form. Until a type is chosen the two data cells
      // carry an instruction instead of an input, so the form keeps one line.
      (0, import_jsx_runtime.jsxs)("div", { className: "dws-form", children: [
        (0, import_jsx_runtime.jsx)("select", {
          className: "dws-field",
          value: formType,
          disabled: busy || editing,
          title: editing ? t("form.typeLocked") : void 0,
          onChange: editing ? void 0 : chooseType,
          children: typeOptions
        }),
        showingForm ? (0, import_jsx_runtime.jsx)("input", {
          className: "dws-field",
          type: "text",
          value: draft.desc,
          placeholder: t("form.descPlaceholder"),
          spellCheck: false,
          autoComplete: "off",
          disabled: busy,
          onChange: (e) => setDraft({ ...draft, desc: e.target.value })
        }) : (0, import_jsx_runtime.jsx)("span", { className: "dws-note", children: t("form.chooseHint") }),
        (0, import_jsx_runtime.jsxs)("div", { className: "dws-key", children: [
          showingForm ? (0, import_jsx_runtime.jsx)("input", {
            className: "dws-field",
            type: "password",
            value: draft.apiKey,
            name: "dsh-websearch-key",
            autoComplete: "new-password",
            disabled: busy,
            placeholder: hasStoredKey ? t("form.secretStored") : t("form.secretNew"),
            onChange: (e) => setDraft({ ...draft, apiKey: e.target.value })
          }) : (0, import_jsx_runtime.jsx)("span", { className: "dws-note", children: t("form.chooseHint") }),
          (0, import_jsx_runtime.jsx)("button", {
            className: "dws-button",
            disabled: !canSubmit,
            onClick: submit,
            children: editing ? t("form.save") : t("form.add")
          })
        ] })
      ] }),
      showingForm && (0, import_jsx_runtime.jsxs)("div", { className: "dws-actions", children: [
        (0, import_jsx_runtime.jsxs)("label", { style: styles.enabled, title: canEnable ? "" : t("form.needKey"), children: [
          (0, import_jsx_runtime.jsx)("input", {
            type: "checkbox",
            checked: draft.enabled === true,
            disabled: busy || !canEnable,
            onChange: (e) => setDraft({ ...draft, enabled: e.target.checked })
          }),
          ` ${t("form.enabled")}`
        ] }),
        editing && (0, import_jsx_runtime.jsx)("button", {
          className: "dws-button",
          disabled: busy,
          onClick: reset,
          children: t("form.cancel")
        })
      ] })
    ] }),
    providers.length > 0 && (0, import_jsx_runtime.jsx)("ul", { style: styles.list, children: providers.map((provider, index) => {
      const on = provider.enabled === true;
      const icon = iconOf(provider.type);
      const stats = provider.stats ?? {};
      return (0, import_jsx_runtime.jsxs)("li", {
        className: "dws-row",
        "data-selected": String(index === selected),
        style: styles.item,
        onClick: () => selectRow(index),
        title: t("list.edit"),
        children: [
          (0, import_jsx_runtime.jsxs)("div", { style: styles.line, children: [
            (0, import_jsx_runtime.jsx)("button", {
              className: "dws-icon",
              disabled: busy,
              title: on ? t("list.disable") : t("list.enable"),
              onClick: act({ action: "toggle", index }),
              children: on ? "\u23F8" : "\u25B6"
            }),
            (0, import_jsx_runtime.jsx)("span", { style: styles.id, children: provider.id || "\u2014" }),
            icon !== null && (0, import_jsx_runtime.jsx)("img", {
              src: icon,
              alt: typeLabel(provider.type),
              width: 13,
              height: 16,
              style: { flex: "0 0 auto", opacity: on ? 1 : 0.35 }
            }),
            provider.desc !== "" && (0, import_jsx_runtime.jsx)("span", { style: styles.desc, children: provider.desc }),
            (0, import_jsx_runtime.jsxs)("span", { style: styles.actions, children: [
              (0, import_jsx_runtime.jsx)("button", { className: "dws-icon", disabled: busy, title: t("list.delete"), onClick: act({ action: "delete", index }), children: "\xD7" }),
              (0, import_jsx_runtime.jsx)("button", { className: "dws-icon", disabled: busy || index === 0, title: t("list.up"), onClick: act({ action: "move", index, delta: -1 }), children: "\u2191" }),
              (0, import_jsx_runtime.jsx)("button", { className: "dws-icon", disabled: busy || index === providers.length - 1, title: t("list.down"), onClick: act({ action: "move", index, delta: 1 }), children: "\u2193" })
            ] })
          ] }),
          (0, import_jsx_runtime.jsxs)("div", { style: styles.under, children: [
            (0, import_jsx_runtime.jsxs)("span", {
              style: styles.counters,
              title: `${t("list.lastSearch")}${when(stats.lastSearch)}
${t("list.lastError")}${when(stats.lastError)}`,
              children: [
                (0, import_jsx_runtime.jsx)("span", { style: styles.muted, children: t("list.counters") }),
                (0, import_jsx_runtime.jsx)("span", { style: styles.green, children: stats.searches ?? 0 }),
                (0, import_jsx_runtime.jsx)("span", { style: styles.slash, children: "/" }),
                (0, import_jsx_runtime.jsx)("span", { style: styles.red, children: stats.errors ?? 0 })
              ]
            }),
            (0, import_jsx_runtime.jsx)("button", {
              className: "dws-icon",
              disabled: busy,
              title: t("list.reset"),
              onClick: act({ action: "reset", index }),
              children: "\u27F2"
            })
          ] })
        ]
      }, provider.id || String(index));
    }) }),
    error !== "" && (0, import_jsx_runtime.jsx)("p", { style: styles.error, children: error })
  ] });
}
var styles = {
  page: { display: "flex", flexDirection: "column", gap: 14, maxWidth: 780, minWidth: 0 },
  heading: { margin: 0, fontSize: 20, fontWeight: 600 },
  hint: { margin: 0, opacity: 0.7, fontSize: 13 },
  list: { display: "flex", flexDirection: "column", gap: 2, listStyle: "none", margin: 0, padding: 0 },
  item: { alignItems: "stretch", display: "flex", flexDirection: "column", gap: 2 },
  line: { alignItems: "center", display: "flex", gap: 8, minWidth: 0 },
  under: { alignItems: "center", display: "flex", gap: 6, paddingLeft: 2 },
  id: { flex: "0 0 auto", fontFamily: "monospace", fontSize: 12, opacity: 0.75 },
  desc: { flex: "1 1 auto", fontSize: 13, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  actions: { display: "flex", flex: "0 0 auto", gap: 4 },
  counters: { flex: "0 0 auto", fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap" },
  green: { color: "#3fb950" },
  red: { color: "#f85149" },
  slash: { opacity: 0.5 },
  activeLabel: { fontSize: 12, opacity: 0.75 },
  muted: { opacity: 0.6 },
  row: { alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8, minWidth: 0 },
  enabled: { whiteSpace: "nowrap", fontSize: 13 },
  error: { margin: 0, color: "#f66" }
};
function apply(ctx) {
  let t = (key) => key;
  try {
    t = ctx.locale.bind(NS);
  } catch (error) {
    console.warn(`[dsh-websearch] locale unavailable, keys are shown as is: ${error?.message ?? error}`);
  }
  try {
    ctx.effect(() => {
      ctx.locale.register(NS, "en", DICTIONARIES.en);
      ctx.locale.register(NS, "zh", DICTIONARIES.zh);
      return () => {
      };
    }, "dsh-websearch: dictionaries");
  } catch (error) {
    console.warn(`[dsh-websearch] dictionaries failed: ${error?.message ?? error}`);
  }
  try {
    ctx.effect(() => {
      try {
        return ctx.locale.addLanguage("ru");
      } catch (error) {
        if (!/already/i.test(String(error?.message ?? error))) throw error;
        return () => {
        };
      }
    }, "dsh-websearch: ru language");
  } catch (error) {
    console.warn(`[dsh-websearch] ru language failed: ${error?.message ?? error}`);
  }
  try {
    ctx.effect(() => {
      ctx.locale.register(NS, "ru", DICTIONARIES.ru);
      return () => {
      };
    }, "dsh-websearch: ru dictionary");
  } catch (error) {
    console.warn(`[dsh-websearch] ru dictionary failed: ${error?.message ?? error}`);
  }
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: SECTION_ID,
    order: 35,
    locale: NS,
    label: () => t("nav.title")
  }, WebSearchPage));
}
var inject = ["slots", "locale"];

    return module.exports;
  }
});
