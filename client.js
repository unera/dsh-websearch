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
var API = "/__ws";
var EXA_ICON = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg width="107" height="129" viewBox="0 0 107 129" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M106.417 9.30741C106.417 9.57392 106.324 9.83227 106.155 10.0388L61.5395 64.5L106.155 118.96C106.324 119.166 106.417 119.425 106.417 119.691V127.843C106.417 128.482 105.897 129 105.255 129H1.16175C0.520132 129 0 128.482 0 127.843V1.15695C0 0.517982 0.520131 0 1.16174 0H105.255C105.897 0 106.417 0.517984 106.417 1.15695V9.30741ZM19.0364 116.382H87.6921L53.363 74.4795L19.0364 116.382ZM12.6699 104.192L40.1426 70.6585H12.6699V104.192ZM12.6699 58.0409H39.8964L12.6699 24.8064V58.0409ZM53.363 54.5193L87.6921 12.6176H19.0364L53.363 54.5193Z" fill="#0143D9"/></svg>'
);
var TYPE_LABELS = { exa: "Exa" };
var typeLabel = (type) => TYPE_LABELS[type] ?? String(type ?? "unknown");
var iconOf = (type) => (type ?? "exa") === "exa" ? EXA_ICON : null;
var CSS = `
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
var emptyEntry = { desc: "", apiKey: "", enabled: true };
var when = (ms) => typeof ms === "number" && ms > 0 ? new Date(ms).toLocaleString() : "never";
function WebSearchPage() {
  const [providers, setProviders] = (0, import_react.useState)([]);
  const [selected, setSelected] = (0, import_react.useState)(null);
  const [entry, setEntry] = (0, import_react.useState)(emptyEntry);
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
  const run = async (action, work) => {
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
    return action;
  };
  (0, import_react.useEffect)(() => {
    call("/state").then(apply2).catch((e) => setError(String(e?.message ?? e))).finally(() => setLoading(false));
  }, []);
  const select = (index) => {
    if (busy) return;
    if (selected === index) {
      setSelected(null);
      setEntry(emptyEntry);
      return;
    }
    const provider = providers[index];
    setSelected(index);
    setEntry({ desc: provider?.desc ?? "", apiKey: "", enabled: provider?.enabled !== false });
  };
  const editing = selected !== null && providers[selected] !== void 0;
  const hasStoredKey = editing && providers[selected].keySet === true;
  const canEnable = hasStoredKey || entry.apiKey.trim() !== "";
  const canSubmit = !busy && entry.apiKey !== void 0 && (editing || entry.apiKey.trim() !== "");
  const submit = () => {
    const draft = { desc: entry.desc, apiKey: entry.apiKey.trim(), enabled: entry.enabled === true };
    run(editing ? "save" : "add", () => call("/providers", editing ? { action: "save", index: selected, draft } : { action: "add", draft })).then(() => {
      setSelected(null);
      setEntry(emptyEntry);
    });
  };
  const act = (action) => (event) => {
    event.stopPropagation();
    run(action.action, () => call("/providers", action));
  };
  if (loading) return (0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("h2", { style: styles.heading, children: "Web search" }), (0, import_jsx_runtime.jsx)("p", { children: "Loading\u2026" })] });
  return (0, import_jsx_runtime.jsxs)("section", { style: styles.page, children: [
    (0, import_jsx_runtime.jsx)("h2", { style: styles.heading, children: "Web search" }),
    (0, import_jsx_runtime.jsx)("p", { style: styles.hint, children: "Exa providers used for web search. Description is optional; a provider can be enabled once its API key is stored." }),
    (0, import_jsx_runtime.jsxs)("div", { style: styles.row, children: [
      (0, import_jsx_runtime.jsx)("span", {
        style: styles.activeLabel,
        children: active === "dsh-websearch" ? "This aggregator is the active search provider." : `Active search provider: ${active === "" ? "none" : active}`
      }),
      active === "dsh-websearch" && registered !== null && (0, import_jsx_runtime.jsx)("span", {
        style: registered.registered ? styles.green : styles.red,
        children: registered.registered ? "registered" : `not registered: ${registered.reason || "unknown"}`
      }),
      active !== "dsh-websearch" && (0, import_jsx_runtime.jsx)("button", {
        style: styles.button,
        disabled: busy,
        onClick: () => run("select", () => call("/providers", { action: "select" })),
        children: "Use for search"
      })
    ] }),
    (0, import_jsx_runtime.jsxs)("div", { style: styles.addCard, children: [
      (0, import_jsx_runtime.jsx)("textarea", {
        className: "dws-field dws-one-line",
        rows: 1,
        value: entry.desc,
        placeholder: "Description (optional)",
        spellCheck: false,
        autoComplete: "off",
        disabled: busy,
        onChange: (e) => setEntry({ ...entry, desc: e.target.value })
      }),
      (0, import_jsx_runtime.jsx)("input", {
        className: "dws-field",
        type: "password",
        value: entry.apiKey,
        name: "dsh-websearch-key",
        autoComplete: "new-password",
        disabled: busy,
        placeholder: editing && hasStoredKey ? "Key stored \u2014 leave blank to keep it" : "Exa API key (required)",
        onChange: (e) => setEntry({ ...entry, apiKey: e.target.value })
      }),
      (0, import_jsx_runtime.jsxs)("div", { style: styles.row, children: [
        (0, import_jsx_runtime.jsxs)("label", { style: styles.enabled, title: canEnable ? "" : "Store the API key first", children: [
          (0, import_jsx_runtime.jsx)("input", {
            type: "checkbox",
            checked: entry.enabled === true,
            disabled: busy || !canEnable,
            onChange: (e) => setEntry({ ...entry, enabled: e.target.checked })
          }),
          " enabled"
        ] }),
        (0, import_jsx_runtime.jsx)("button", { style: styles.button, disabled: !canSubmit, onClick: submit, children: editing ? `Save ${typeLabel(providers[selected]?.type)}` : "Add provider" }),
        editing && (0, import_jsx_runtime.jsx)("button", {
          style: styles.button,
          disabled: busy,
          onClick: () => {
            setSelected(null);
            setEntry(emptyEntry);
          },
          children: "Cancel"
        })
      ] })
    ] }),
    providers.length > 0 && (0, import_jsx_runtime.jsx)("ul", { style: styles.list, children: providers.map((provider, index) => {
      const on = provider.enabled === true;
      const icon = iconOf(provider.type);
      return (0, import_jsx_runtime.jsxs)("li", {
        className: "dws-row",
        "data-selected": String(index === selected),
        style: styles.item,
        onClick: () => select(index),
        title: "Click to edit",
        children: [
          (0, import_jsx_runtime.jsx)("button", {
            className: "dws-icon",
            disabled: busy,
            title: on ? "Disable" : "Enable",
            onClick: act({ action: "toggle", index }),
            children: on ? "\u23F8" : "\u25B6"
          }),
          (0, import_jsx_runtime.jsx)("span", { style: styles.id, children: provider.id || "\u2014" }),
          icon !== null && (0, import_jsx_runtime.jsx)("img", { src: icon, alt: typeLabel(provider.type), width: 13, height: 16, style: { flex: "0 0 auto", opacity: on ? 1 : 0.35 } }),
          provider.desc !== "" && (0, import_jsx_runtime.jsx)("span", { style: styles.desc, children: provider.desc }),
          (0, import_jsx_runtime.jsxs)("span", {
            style: styles.counters,
            title: `last search: ${when(provider.stats?.lastSearch)}
last error: ${when(provider.stats?.lastError)}`,
            children: [
              (0, import_jsx_runtime.jsx)("span", { style: styles.green, children: provider.stats?.searches ?? 0 }),
              (0, import_jsx_runtime.jsx)("span", { style: styles.slash, children: "/" }),
              (0, import_jsx_runtime.jsx)("span", { style: styles.red, children: provider.stats?.errors ?? 0 })
            ]
          }),
          (0, import_jsx_runtime.jsx)("button", {
            className: "dws-icon",
            disabled: busy,
            title: "reset",
            onClick: act({ action: "reset", index }),
            children: "\u27F2"
          }),
          (0, import_jsx_runtime.jsxs)("span", { style: styles.actions, children: [
            (0, import_jsx_runtime.jsx)("button", { className: "dws-icon", disabled: busy, title: "Delete", onClick: act({ action: "delete", index }), children: "\xD7" }),
            (0, import_jsx_runtime.jsx)("button", { className: "dws-icon", disabled: busy || index === 0, title: "Move up", onClick: act({ action: "move", index, delta: -1 }), children: "\u2191" }),
            (0, import_jsx_runtime.jsx)("button", { className: "dws-icon", disabled: busy || index === providers.length - 1, title: "Move down", onClick: act({ action: "move", index, delta: 1 }), children: "\u2193" })
          ] })
        ]
      });
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
  list: { display: "flex", flexDirection: "column", gap: 2, listStyle: "none", margin: 0, padding: 0 },
  item: { alignItems: "center", display: "flex", gap: 8 },
  id: { flex: "0 0 auto", fontFamily: "monospace", fontSize: 12, opacity: 0.75 },
  desc: { flex: "1 1 auto", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  actions: { display: "flex", flex: "0 0 auto", gap: 4 },
  counters: { flex: "0 0 auto", fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap" },
  green: { color: "#3fb950" },
  red: { color: "#f85149" },
  slash: { opacity: 0.5 },
  activeLabel: { fontSize: 12, opacity: 0.75 },
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
  error: { margin: 0, color: "#f66" }
};
function apply(ctx) {
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: SECTION_ID,
    order: 35,
    locale: NS,
    label: () => "Web search"
  }, WebSearchPage));
}
var inject = ["slots", "locale"];

    return module.exports;
  }
});
