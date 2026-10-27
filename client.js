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
var SECTION_ID = "websearch";
var NS_HOST = "dsh-websearch";
function useForm(form) {
  return (0, import_react.useSyncExternalStore)(form.subscribe.bind(form), form.getSnapshot.bind(form), form.getSnapshot.bind(form));
}
function providersOf(value) {
  return Array.isArray(value?.providers) ? value.providers.map((provider) => ({ ...provider })) : [];
}
function WebSearchPage(props) {
  const { ctx } = props;
  const form = ctx.configForms.get(NS_HOST);
  const snapshot = useForm(form);
  const [draftKey, setDraftKey] = (0, import_react.useState)({});
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)("");
  const heading = (0, import_jsx_runtime.jsx)("h2", { style: styles.heading, children: "Web search" });
  if (snapshot.status === "loading") return (0, import_jsx_runtime.jsxs)("div", { children: [heading, (0, import_jsx_runtime.jsx)("p", { children: "Loading\u2026" })] });
  if (snapshot.status === "unavailable") return (0, import_jsx_runtime.jsxs)("div", { children: [heading, (0, import_jsx_runtime.jsx)("p", { children: "Settings namespace is not served." })] });
  const providers = providersOf(snapshot.value);
  const locked = busy || !snapshot.writable;
  const save = async (next) => {
    setBusy(true);
    setError("");
    try {
      if (!await form.set("providers", next)) setError("The deployment rejected these values.");
    } catch (e) {
      setError(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  };
  const patch = (index, field, value) => {
    const next = providersOf(snapshot.value);
    next[index] = { ...next[index], [field]: value };
    return save(next);
  };
  const add = () => save([...providersOf(snapshot.value), {
    id: `h-${Math.random().toString(36).slice(2, 7)}`,
    type: "exa",
    desc: "",
    apiKey: "",
    enabled: true
  }]);
  return (0, import_jsx_runtime.jsxs)("section", { style: styles.page, children: [
    heading,
    (0, import_jsx_runtime.jsx)("p", { style: styles.hint, children: "Exa providers used for web search. The key is stored as a secret." }),
    ...providers.map((provider, index) => (0, import_jsx_runtime.jsxs)("div", { style: styles.card, children: [
      (0, import_jsx_runtime.jsxs)("div", { style: styles.row, children: [
        (0, import_jsx_runtime.jsx)("input", {
          style: styles.input,
          value: provider.desc ?? "",
          placeholder: "Description",
          disabled: locked,
          onChange: (e) => patch(index, "desc", e.target.value)
        }),
        (0, import_jsx_runtime.jsx)("label", { style: styles.enabled, children: [
          (0, import_jsx_runtime.jsx)("input", {
            type: "checkbox",
            checked: provider.enabled !== false,
            disabled: locked,
            onChange: (e) => patch(index, "enabled", e.target.checked)
          }),
          " enabled"
        ] }),
        (0, import_jsx_runtime.jsx)("button", {
          style: styles.button,
          disabled: locked,
          onClick: () => save(providersOf(snapshot.value).filter((_, at) => at !== index)),
          children: "Delete"
        })
      ] }),
      (0, import_jsx_runtime.jsxs)("div", { style: styles.row, children: [
        (0, import_jsx_runtime.jsx)("input", {
          style: styles.input,
          type: "password",
          value: draftKey[index] ?? "",
          placeholder: provider.apiKeySet || provider.apiKey ? "Key configured \u2014 enter a new one" : "Exa API key",
          disabled: locked,
          onChange: (e) => setDraftKey({ ...draftKey, [index]: e.target.value })
        }),
        (0, import_jsx_runtime.jsx)("button", {
          style: styles.button,
          disabled: locked || (draftKey[index] ?? "").trim() === "",
          onClick: () => {
            const value = draftKey[index];
            setDraftKey({ ...draftKey, [index]: "" });
            patch(index, "apiKey", value);
          },
          children: "Save key"
        })
      ] }),
      (0, import_jsx_runtime.jsx)("small", { style: styles.meta, children: `id ${provider.id ?? "\u2014"} \xB7 ${provider.type ?? "exa"}` })
    ] })),
    (0, import_jsx_runtime.jsx)("button", { style: styles.button, disabled: locked, onClick: add, children: "+ Add Exa provider" }),
    error !== "" && (0, import_jsx_runtime.jsx)("p", { style: styles.error, children: error })
  ] });
}
var styles = {
  page: { display: "flex", flexDirection: "column", gap: 12, maxWidth: 760 },
  heading: { margin: 0, fontSize: 20, fontWeight: 600 },
  hint: { margin: 0, opacity: 0.7, fontSize: 13 },
  card: { border: "1px solid rgba(127,127,127,.3)", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 10 },
  row: { display: "flex", gap: 8, alignItems: "center" },
  input: { flex: 1, minWidth: 0, padding: "8px 10px", borderRadius: 6, border: "1px solid rgba(127,127,127,.35)", background: "transparent", color: "inherit" },
  button: { padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(127,127,127,.35)", background: "transparent", color: "inherit", cursor: "pointer" },
  enabled: { whiteSpace: "nowrap", fontSize: 13 },
  meta: { opacity: 0.55 },
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
var inject = ["slots", "locale", "configForms"];

    return module.exports;
  }
});
