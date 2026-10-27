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
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var NS = "settings.webSearch";
function useForm(form) {
  return (0, import_react.useSyncExternalStore)(form.subscribe.bind(form), form.getSnapshot.bind(form), form.getSnapshot.bind(form));
}
function cloneProviders(value) {
  return Array.isArray(value?.providers) ? value.providers.map((provider) => ({ ...provider })) : [];
}
function WebSearchCard({ view, ctx }) {
  const form = ctx.configForms.get("dsh-websearch");
  const snapshot = useForm(form);
  const [draftKey, setDraftKey] = (0, import_react.useState)({});
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)("");
  if (view === "summary") return "Configure Exa web search providers.";
  if (snapshot.status === "loading") return (0, import_jsx_runtime.jsx)("div", { children: "Loading web search settings\u2026" });
  if (snapshot.status === "unavailable") return (0, import_jsx_runtime.jsx)("div", { children: "Web search settings are unavailable." });
  const providers = cloneProviders(snapshot.value);
  const update = (index, field, value) => {
    const next = cloneProviders(snapshot.value);
    next[index] = { ...next[index], [field]: value };
    return next;
  };
  const save = async (next) => {
    setBusy(true);
    setError("");
    try {
      if (!await form.set("providers", next)) setError("Settings were rejected.");
    } catch (e) {
      setError(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  };
  const add = () => save([...providers, { id: `h-${Math.random().toString(36).slice(2, 7)}`, type: "exa", desc: "", apiKey: "", enabled: true }]);
  const remove = (index) => save(providers.filter((_, at) => at !== index));
  const edit = (index, field, value) => save(update(index, field, value));
  return (0, import_jsx_runtime.jsxs)("section", { style: styles.section, children: [
    (0, import_jsx_runtime.jsx)("p", { style: styles.hint, children: "Add Exa search providers. API keys are stored as secrets." }),
    ...providers.map((provider, index) => (0, import_jsx_runtime.jsxs)("div", { style: styles.card, children: [
      (0, import_jsx_runtime.jsxs)("div", { style: styles.row, children: [
        (0, import_jsx_runtime.jsx)("input", { style: styles.input, value: provider.desc ?? "", placeholder: "Description", disabled: busy || !snapshot.writable, onChange: (e) => edit(index, "desc", e.target.value) }),
        (0, import_jsx_runtime.jsx)("label", { style: styles.enabled, children: [(0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: provider.enabled !== false, disabled: busy || !snapshot.writable, onChange: (e) => edit(index, "enabled", e.target.checked) }), " enabled"] }),
        (0, import_jsx_runtime.jsx)("button", { disabled: busy || !snapshot.writable, onClick: () => remove(index), children: "Delete" })
      ] }),
      (0, import_jsx_runtime.jsxs)("div", { style: styles.row, children: [
        (0, import_jsx_runtime.jsx)("input", { style: styles.input, type: "password", value: draftKey[index] ?? "", placeholder: provider.apiKey ? "API key configured \u2014 enter to replace" : "Exa API key", disabled: busy || !snapshot.writable, onChange: (e) => setDraftKey({ ...draftKey, [index]: e.target.value }) }),
        (0, import_jsx_runtime.jsx)("button", { disabled: busy || !snapshot.writable || !(draftKey[index] ?? "").trim(), onClick: () => {
          const value = draftKey[index];
          setDraftKey({ ...draftKey, [index]: "" });
          edit(index, "apiKey", value);
        }, children: "Set key" })
      ] }),
      (0, import_jsx_runtime.jsx)("small", { style: styles.meta, children: `id: ${provider.id ?? "generated"}` })
    ] })),
    (0, import_jsx_runtime.jsx)("button", { disabled: busy || !snapshot.writable, onClick: add, children: "+ Add Exa provider" }),
    error && (0, import_jsx_runtime.jsx)("p", { style: styles.error, children: error })
  ] });
}
var styles = {
  section: { display: "flex", flexDirection: "column", gap: 12 },
  card: { border: "1px solid var(--dsw-alias-border-secondary, #555)", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 10 },
  row: { display: "flex", gap: 8, alignItems: "center" },
  input: { flex: 1, minWidth: 0, padding: "8px 10px", borderRadius: 6, border: "1px solid var(--dsw-alias-border-secondary, #555)", background: "transparent", color: "inherit" },
  enabled: { whiteSpace: "nowrap" },
  hint: { margin: 0, opacity: 0.75 },
  meta: { opacity: 0.55 },
  error: { color: "#f66" }
};
function apply(ctx) {
  const t = ctx.locale.bind(NS);
  ctx.slots.inject("plugins.item", () => ctx.slots.register({
    name: "plugins.item",
    id: "dsh-websearch",
    order: 25,
    label: () => "Web search",
    locale: NS
  }, (props) => (0, import_jsx_runtime.jsx)(WebSearchCard, { ...props, ctx })));
}
var inject = ["slots", "locale", "configForms"];

    return module.exports;
  }
});
