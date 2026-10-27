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
var NS = "settings.webSearch";
var SECTION_ID = "websearch";
var NS_HOST = "dsh-websearch";
var CSS = `
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
function useForm(form) {
  return (0, import_react.useSyncExternalStore)(form.subscribe.bind(form), form.getSnapshot.bind(form), form.getSnapshot.bind(form));
}
function providersOf(value) {
  return Array.isArray(value?.providers) ? value.providers.map((provider) => ({ ...provider })) : [];
}
function keyedIndices(describeValue) {
  const namespace = describeValue?.namespaces?.find((view) => view.ns === NS_HOST);
  const keyed = /* @__PURE__ */ new Map();
  for (const secret of namespace?.secrets ?? []) {
    const [head, index, field] = secret.path ?? [];
    if (head === "providers" && field === "apiKey" && secret.set === true) keyed.set(String(index), true);
  }
  return keyed;
}
var newProviderId = () => `h-${Math.random().toString(36).slice(2, 7)}`;
function WebSearchPage(props) {
  const { ctx } = props;
  const form = ctx.configForms.get(NS_HOST);
  const snapshot = useForm(form);
  const [draft, setDraft] = (0, import_react.useState)([]);
  const [keySet, setKeySet] = (0, import_react.useState)({});
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)("");
  const [entry, setEntry] = (0, import_react.useState)({ desc: "", apiKey: "", enabled: true });
  const refreshKeySet = async () => {
    try {
      const view = await ctx.remote.settings.describe();
      setKeySet(Object.fromEntries(keyedIndices(view)));
    } catch {
    }
  };
  (0, import_react.useEffect)(() => {
    refreshKeySet();
  }, []);
  (0, import_react.useEffect)(() => {
    setDraft(providersOf(snapshot.value));
  }, [snapshot.revision, snapshot.status]);
  const heading = (0, import_jsx_runtime.jsx)("h2", { style: styles.heading, children: "Web search" });
  if (snapshot.status === "loading") return (0, import_jsx_runtime.jsxs)("div", { children: [heading, (0, import_jsx_runtime.jsx)("p", { children: "Loading\u2026" })] });
  if (snapshot.status === "unavailable") return (0, import_jsx_runtime.jsxs)("div", { children: [heading, (0, import_jsx_runtime.jsx)("p", { children: "Settings namespace is not served." })] });
  const locked = busy || !snapshot.writable;
  const commit = async (next) => {
    setBusy(true);
    setError("");
    try {
      if (!await form.set("providers", next)) setError("The deployment rejected these values.");
      else setDraft(next);
    } catch (e) {
      setError(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  };
  const editDescription = (index, value) => {
    setDraft(draft.map((provider, at) => at === index ? { ...provider, desc: value } : provider));
  };
  const commitDescription = () => {
    if (JSON.stringify(draft) === JSON.stringify(providersOf(snapshot.value))) return;
    commit(draft);
  };
  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= draft.length) return;
    const next = [...draft];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };
  const remove = (index) => commit(draft.filter((_, at) => at !== index));
  const toggle = (index) => commit(draft.map((provider, at) => at === index ? { ...provider, enabled: provider.enabled !== true } : provider));
  const canAdd = !locked && entry.apiKey.trim() !== "";
  const add = async () => {
    const apiKey = entry.apiKey.trim();
    if (apiKey === "") return;
    await commit([{
      id: newProviderId(),
      type: "exa",
      desc: entry.desc.trim(),
      apiKey,
      enabled: entry.enabled === true
    }, ...draft]);
    setEntry({ desc: "", apiKey: "", enabled: true });
    refreshKeySet();
  };
  return (0, import_jsx_runtime.jsxs)("section", { style: styles.page, children: [
    heading,
    (0, import_jsx_runtime.jsx)("p", { style: styles.hint, children: "Exa providers used for web search. Description is optional; a provider can be enabled once its API key is stored." }),
    (0, import_jsx_runtime.jsxs)("div", { style: styles.addCard, children: [
      (0, import_jsx_runtime.jsx)("textarea", {
        className: "dws-field dws-one-line",
        rows: 1,
        value: entry.desc,
        placeholder: "Description (optional)",
        spellCheck: false,
        autoComplete: "off",
        disabled: locked,
        onChange: (e) => setEntry({ ...entry, desc: e.target.value })
      }),
      (0, import_jsx_runtime.jsx)("input", {
        className: "dws-field",
        type: "password",
        value: entry.apiKey,
        name: "dsh-websearch-new-key",
        autoComplete: "new-password",
        placeholder: "Exa API key (required)",
        disabled: locked,
        onChange: (e) => setEntry({ ...entry, apiKey: e.target.value })
      }),
      (0, import_jsx_runtime.jsxs)("div", { style: styles.row, children: [
        (0, import_jsx_runtime.jsxs)("label", { style: styles.enabled, title: canAdd ? "" : "Enter the API key first", children: [
          (0, import_jsx_runtime.jsx)("input", {
            type: "checkbox",
            checked: entry.enabled === true,
            disabled: !canAdd,
            onChange: (e) => setEntry({ ...entry, enabled: e.target.checked })
          }),
          " enabled"
        ] }),
        (0, import_jsx_runtime.jsx)("button", { style: styles.button, disabled: !canAdd, onClick: add, children: "Add provider" })
      ] })
    ] }),
    draft.length > 0 && (0, import_jsx_runtime.jsx)("ul", { style: styles.list, children: draft.map((provider, index) => {
      const hasKey = keySet[String(index)] === true || String(provider.apiKey ?? "").trim() !== "";
      return (0, import_jsx_runtime.jsxs)("li", { style: styles.item, children: [
        (0, import_jsx_runtime.jsx)("input", {
          type: "checkbox",
          checked: provider.enabled === true,
          disabled: locked || !hasKey,
          title: hasKey ? "Enabled" : "Store an API key first",
          onChange: () => toggle(index)
        }),
        (0, import_jsx_runtime.jsx)("textarea", {
          className: "dws-field dws-one-line",
          rows: 1,
          value: provider.desc ?? "",
          placeholder: "Description (optional)",
          spellCheck: false,
          autoComplete: "off",
          disabled: locked,
          onChange: (e) => editDescription(index, e.target.value),
          onBlur: commitDescription
        }),
        (0, import_jsx_runtime.jsxs)("span", { style: styles.meta, children: [provider.id ?? "\u2014", hasKey ? "" : " \xB7 no key"] }),
        (0, import_jsx_runtime.jsx)("button", { className: "dws-icon", disabled: locked || index === 0, onClick: () => move(index, -1), title: "Move up", children: "\u2191" }),
        (0, import_jsx_runtime.jsx)("button", { className: "dws-icon", disabled: locked || index === draft.length - 1, onClick: () => move(index, 1), title: "Move down", children: "\u2193" }),
        (0, import_jsx_runtime.jsx)("button", { className: "dws-icon", disabled: locked, onClick: () => remove(index), title: "Delete", children: "\xD7" })
      ] });
    }) }),
    error !== "" && (0, import_jsx_runtime.jsx)("p", { style: styles.error, children: error })
  ] });
}
var styles = {
  page: { display: "flex", flexDirection: "column", gap: 14, maxWidth: 780 },
  heading: { margin: 0, fontSize: 20, fontWeight: 600 },
  hint: { margin: 0, opacity: 0.7, fontSize: 13 },
  addCard: {
    border: "1px solid rgba(127,127,127,.3)",
    borderRadius: 10,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  list: { display: "flex", flexDirection: "column", gap: 6, listStyle: "none", margin: 0, padding: 0 },
  item: { alignItems: "center", display: "flex", gap: 8 },
  row: { alignItems: "center", display: "flex", gap: 8 },
  button: {
    padding: "7px 12px",
    borderRadius: 6,
    border: "1px solid rgba(127,127,127,.35)",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    whiteSpace: "nowrap"
  },
  enabled: { whiteSpace: "nowrap", fontSize: 13 },
  meta: { opacity: 0.5, fontSize: 12, whiteSpace: "nowrap" },
  error: { margin: 0, color: "#f66" }
};
function apply(ctx) {
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: SECTION_ID,
    order: 35,
    locale: NS,
    label: () => "Web search"
  }, (props) => (0, import_jsx_runtime.jsx)(WebSearchPage, { ...props, ctx })));
}
var inject = ["slots", "locale", "configForms", "remote"];

    return module.exports;
  }
});
