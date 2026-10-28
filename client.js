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
  "page.useForSearch": "Use for search and page fetch",
  "page.registered": "registered",
  "page.notRegistered": "not registered: ",
  "page.unknown": "unknown",
  "form.type": "Provider",
  "form.typeNone": "none",
  "form.typeLocked": "The provider type cannot be changed \u2014 add a new entry instead",
  "form.chooseHint": "Choose a web search provider.",
  "form.desc": "Description",
  "form.descPlaceholder": "Description (optional)",
  "form.allowSearch": "allow search",
  "form.allowFetch": "allow page fetch",
  "form.noFetch": "This provider cannot fetch pages",
  "form.model": "Model",
  "form.modelHint": "Model name, for example gpt-5.5",
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
  "caps.searchOnly": "search only",
  "caps.searchFetch": "search and fetch",
  "caps.fetchOnly": "fetch only",
  "list.counters": "searches and fetches: ",
  "list.and": " and ",
  "list.lastSearch": "last search: ",
  "list.lastError": "last search error: ",
  "list.lastFetch": "last fetch: ",
  "list.lastFetchError": "last fetch error: ",
  "common.loading": "Loading\u2026",
  "common.never": "never"
};
var ru = {
  "nav.title": "\u0412\u0435\u0431-\u043F\u043E\u0438\u0441\u043A",
  "page.hint": "\u041F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u044B Exa \u0434\u043B\u044F \u043F\u043E\u0438\u0441\u043A\u0430 \u0432 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0435. \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E; \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 \u043C\u043E\u0436\u043D\u043E \u043F\u043E\u0441\u043B\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F API-\u043A\u043B\u044E\u0447\u0430.",
  "page.activeSelf": "\u042D\u0442\u043E\u0442 \u0430\u0433\u0440\u0435\u0433\u0430\u0442\u043E\u0440 \u2014 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440 \u043F\u043E\u0438\u0441\u043A\u0430.",
  "page.activeOther": "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440 \u043F\u043E\u0438\u0441\u043A\u0430: ",
  "page.activeNone": "\u043D\u0435\u0442",
  "page.useForSearch": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0434\u043B\u044F \u043F\u043E\u0438\u0441\u043A\u0430 \u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446",
  "page.registered": "\u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D",
  "page.notRegistered": "\u043D\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D: ",
  "page.unknown": "\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E",
  "form.type": "\u041F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440",
  "form.typeNone": "\u043D\u0435\u0442",
  "form.typeLocked": "\u0422\u0438\u043F \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 \u043D\u0435\u043B\u044C\u0437\u044F \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u2014 \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043D\u043E\u0432\u0443\u044E \u0437\u0430\u043F\u0438\u0441\u044C",
  "form.chooseHint": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 \u043F\u043E\u0438\u0441\u043A\u0430 \u0432 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0435.",
  "form.desc": "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
  "form.descPlaceholder": "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)",
  "form.allowSearch": "\u0440\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u043F\u043E\u0438\u0441\u043A",
  "form.allowFetch": "\u0440\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u0441\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435",
  "form.noFetch": "\u042D\u0442\u043E\u0442 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440 \u043D\u0435 \u0443\u043C\u0435\u0435\u0442 \u0441\u043A\u0430\u0447\u0438\u0432\u0430\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B",
  "form.model": "\u041C\u043E\u0434\u0435\u043B\u044C",
  "form.modelHint": "\u0418\u043C\u044F \u043C\u043E\u0434\u0435\u043B\u0438, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 gpt-5.5",
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
  "caps.searchOnly": "\u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0438\u0441\u043A",
  "caps.searchFetch": "\u043F\u043E\u0438\u0441\u043A \u0438 \u0441\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435",
  "caps.fetchOnly": "\u0442\u043E\u043B\u044C\u043A\u043E \u0441\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435",
  "list.counters": "\u0437\u0430\u043F\u0440\u043E\u0441\u043E\u0432 \u0438 \u0432\u044B\u0431\u043E\u0440\u043E\u043A: ",
  "list.and": " \u0438 ",
  "list.lastSearch": "\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043F\u043E\u0438\u0441\u043A: ",
  "list.lastError": "\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u0438\u0441\u043A\u0430: ",
  "list.lastFetch": "\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0432\u044B\u0431\u043E\u0440\u043A\u0430: ",
  "list.lastFetchError": "\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u0432\u044B\u0431\u043E\u0440\u043A\u0438: ",
  "common.loading": "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026",
  "common.never": "\u043D\u0438\u043A\u043E\u0433\u0434\u0430"
};
var zh = {
  "nav.title": "\u7F51\u7EDC\u641C\u7D22",
  "page.hint": "\u7528\u4E8E\u7F51\u7EDC\u641C\u7D22\u7684 Exa \u63D0\u4F9B\u65B9\u3002\u63CF\u8FF0\u53EF\u9009\uFF1B\u4FDD\u5B58 API \u5BC6\u94A5\u540E\u624D\u80FD\u542F\u7528\u63D0\u4F9B\u65B9\u3002",
  "page.activeSelf": "\u6B64\u805A\u5408\u5668\u662F\u5F53\u524D\u751F\u6548\u7684\u641C\u7D22\u63D0\u4F9B\u65B9\u3002",
  "page.activeOther": "\u5F53\u524D\u751F\u6548\u7684\u641C\u7D22\u63D0\u4F9B\u65B9\uFF1A",
  "page.activeNone": "\u65E0",
  "page.useForSearch": "\u7528\u4E8E\u641C\u7D22\u548C\u6293\u53D6\u7F51\u9875",
  "page.registered": "\u5DF2\u6CE8\u518C",
  "page.notRegistered": "\u672A\u6CE8\u518C\uFF1A",
  "page.unknown": "\u672A\u77E5",
  "form.type": "\u63D0\u4F9B\u65B9",
  "form.typeNone": "\u65E0",
  "form.typeLocked": "\u63D0\u4F9B\u65B9\u7C7B\u578B\u4E0D\u53EF\u4FEE\u6539 \u2014 \u8BF7\u65B0\u589E\u4E00\u6761\u8BB0\u5F55",
  "form.chooseHint": "\u8BF7\u9009\u62E9\u7F51\u7EDC\u641C\u7D22\u7684\u63D0\u4F9B\u65B9\u3002",
  "form.desc": "\u63CF\u8FF0",
  "form.descPlaceholder": "\u63CF\u8FF0\uFF08\u53EF\u9009\uFF09",
  "form.allowSearch": "\u5141\u8BB8\u641C\u7D22",
  "form.allowFetch": "\u5141\u8BB8\u6293\u53D6",
  "form.noFetch": "\u6B64\u63D0\u4F9B\u65B9\u65E0\u6CD5\u6293\u53D6\u9875\u9762",
  "form.model": "\u6A21\u578B",
  "form.modelHint": "\u6A21\u578B\u540D\u79F0\uFF0C\u4F8B\u5982 gpt-5.5",
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
  "caps.searchOnly": "\u4EC5\u641C\u7D22",
  "caps.searchFetch": "\u641C\u7D22\u4E0E\u6293\u53D6",
  "caps.fetchOnly": "\u4EC5\u6293\u53D6",
  "list.counters": "\u641C\u7D22\u4E0E\u6293\u53D6\uFF1A",
  "list.and": " \u548C ",
  "list.lastSearch": "\u4E0A\u6B21\u641C\u7D22\uFF1A",
  "list.lastError": "\u4E0A\u6B21\u641C\u7D22\u9519\u8BEF\uFF1A",
  "list.lastFetch": "\u4E0A\u6B21\u6293\u53D6\uFF1A",
  "list.lastFetchError": "\u4E0A\u6B21\u6293\u53D6\u9519\u8BEF\uFF1A",
  "common.loading": "\u6B63\u5728\u52A0\u8F7D\u2026",
  "common.never": "\u4ECE\u672A"
};
var DICTIONARIES = { en, ru, zh };
var TYPE_LABELS = { exa: "Exa", deepseek: "DeepSeek", openai: "OpenAI" };
var TYPE_OPTIONS = ["exa", "deepseek", "openai"];

// client/index.jsx
var SECTION_ID = "websearch";
var API = "/__ws";
var EXA_ICON = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg width="107" height="129" viewBox="0 0 107 129" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M106.417 9.30741C106.417 9.57392 106.324 9.83227 106.155 10.0388L61.5395 64.5L106.155 118.96C106.324 119.166 106.417 119.425 106.417 119.691V127.843C106.417 128.482 105.897 129 105.255 129H1.16175C0.520132 129 0 128.482 0 127.843V1.15695C0 0.51798 0.520131 0 1.16174 0H105.255C105.897 0 106.417 0.517984 106.417 1.15695V9.30741ZM19.0364 116.382H87.6921L53.363 74.4795L19.0364 116.382ZM12.6699 104.192L40.1426 70.6585H12.6699V104.192ZM12.6699 58.0409H39.8964L12.6699 24.8064V58.0409ZM53.363 54.5193L87.6921 12.6176H19.0364L53.363 54.5193Z" fill="#0143D9"/></svg>'
);
var DEEPSEEK_ICON = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#5786FE" d="M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45"/></svg>'
);
var ICONS = { exa: EXA_ICON, deepseek: DEEPSEEK_ICON };
var typeLabel = (type) => TYPE_LABELS[type] ?? String(type ?? "");
var PROVIDER_CAPS = {
  exa: { search: true, fetch: true },
  deepseek: { search: true, fetch: true },
  openai: { search: true, fetch: false }
};
var capsKey = (capabilities) => {
  const search = capabilities?.search !== false;
  const fetch2 = capabilities?.fetch === true;
  if (search && fetch2) return "caps.searchFetch";
  return search ? "caps.searchOnly" : "caps.fetchOnly";
};
var iconOf = (type) => ICONS[type ?? "exa"] ?? null;
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
.dws-note { flex: 1 1 100%; font-size: 13px; opacity: .7; }
/*
 * Two packed rows instead of a tall column: provider, description and secret share
 * the first line, the checkbox and the buttons the second. Labels are dropped on
 * purpose \u2014 the placeholders say the same in less height.
 */
.dws-fields { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; min-width: 0; width: 100%; }
.dws-fields > .dws-type { flex: 0 1 140px; min-width: 110px; }
.dws-fields > .dws-grow { flex: 1 1 150px; min-width: 0; }
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
var emptyDraft = { type: "", desc: "", model: "", apiKey: "", enabled: true, useSearch: true, useFetch: true };
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
      model: provider?.model ?? "",
      apiKey: "",
      enabled: provider?.enabled !== false,
      useSearch: provider?.capabilities?.search !== false,
      useFetch: provider?.capabilities?.fetch !== false
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
      model: draft.model.trim(),
      apiKey: draft.apiKey.trim(),
      useSearch: draft.useSearch !== false,
      useFetch: draft.useFetch !== false,
      enabled: draft.enabled === true
    };
    run(() => call("/providers", editing ? { action: "save", index: selected, draft: body } : { action: "add", draft: { ...body, type: formType } })).then(reset);
  };
  const act = (action) => (event) => {
    event.stopPropagation();
    run(() => call("/providers", action));
  };
  const label = (key, fallback) => {
    const text = t(key);
    return text === key ? fallback : text;
  };
  const typeCaps = PROVIDER_CAPS[formType] ?? { search: true, fetch: true };
  const lang = uiLanguage(t);
  const when = (ms) => typeof ms === "number" && ms > 0 ? new Date(ms).toLocaleString(lang) : t("common.never");
  if (loading) {
    return (0, import_jsx_runtime.jsxs)("section", { style: styles.page, children: [
      (0, import_jsx_runtime.jsx)("h2", { style: styles.heading, children: t("nav.title") }),
      (0, import_jsx_runtime.jsx)("p", { children: t("common.loading") })
    ] });
  }
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
        children: registered.registered ? t("page.registered") : `${t("page.notRegistered")}${registered.reason || registered.step || t("page.unknown")}`
      }),
      active !== "dsh-websearch" && (0, import_jsx_runtime.jsx)("button", {
        className: "dws-button",
        disabled: busy,
        onClick: () => run(() => call("/providers", { action: "select" })),
        children: t("page.useForSearch")
      })
    ] }),
    (0, import_jsx_runtime.jsxs)("div", { className: "dws-card", children: [
      // Row 1: provider type, description and the secret side by side. Until a type
      // is chosen the two data cells give way to one instruction, so the card keeps
      // a single line of height.
      (0, import_jsx_runtime.jsxs)("div", { className: "dws-fields", children: [
        (0, import_jsx_runtime.jsx)("select", {
          className: "dws-field dws-type",
          value: formType,
          disabled: busy || editing,
          title: editing ? t("form.typeLocked") : void 0,
          onChange: editing ? void 0 : chooseType,
          children: typeOptions
        }),
        showingForm ? (0, import_jsx_runtime.jsx)("input", {
          className: "dws-field dws-grow",
          type: "text",
          value: draft.desc,
          placeholder: t("form.descPlaceholder"),
          spellCheck: false,
          autoComplete: "off",
          disabled: busy,
          onChange: (e) => setDraft({ ...draft, desc: e.target.value })
        }) : (0, import_jsx_runtime.jsx)("span", { className: "dws-note", children: t("form.chooseHint") }),
        showingForm && (0, import_jsx_runtime.jsx)("textarea", {
          // A textarea cannot be autofilled, so Firefox's password manager stops
          // offering to save a search key. It is not masked: a textarea cannot be,
          // and the field is write-only — the stored value never comes back.
          className: "dws-field dws-grow dws-one-line",
          rows: 1,
          value: draft.apiKey,
          autoComplete: "off",
          spellCheck: false,
          disabled: busy,
          placeholder: hasStoredKey ? t("form.secretStored") : t("form.secretNew"),
          onChange: (e) => setDraft({ ...draft, apiKey: e.target.value })
        })
      ] }),
      // Row 2: the switch, the model only where a model answers the search, and
      // what submits or drops the draft.
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
        (0, import_jsx_runtime.jsxs)("label", {
          style: styles.enabled,
          title: t("form.allowSearch"),
          children: [
            (0, import_jsx_runtime.jsx)("input", {
              type: "checkbox",
              checked: draft.useSearch !== false,
              disabled: busy,
              onChange: (e) => setDraft({ ...draft, useSearch: e.target.checked })
            }),
            ` ${label("form.allowSearch", "allow search")}`
          ]
        }),
        (0, import_jsx_runtime.jsxs)("label", {
          style: styles.enabled,
          title: typeCaps.fetch ? t("form.allowFetch") : t("form.noFetch"),
          children: [
            (0, import_jsx_runtime.jsx)("input", {
              type: "checkbox",
              // A type without a page-retrieval endpoint cannot be allowed to fetch.
              checked: typeCaps.fetch && draft.useFetch !== false,
              disabled: busy || !typeCaps.fetch,
              onChange: (e) => setDraft({ ...draft, useFetch: e.target.checked })
            }),
            ` ${label("form.allowFetch", "allow page fetch")}`
          ]
        }),
        formType === "openai" && (0, import_jsx_runtime.jsx)("input", {
          className: "dws-field dws-model",
          type: "text",
          value: draft.model,
          placeholder: t("form.modelHint"),
          spellCheck: false,
          autoComplete: "off",
          disabled: busy,
          title: t("form.model"),
          onChange: (e) => setDraft({ ...draft, model: e.target.value })
        }),
        (0, import_jsx_runtime.jsx)("button", {
          className: "dws-button",
          disabled: !canSubmit,
          onClick: submit,
          children: editing ? t("form.save") : t("form.add")
        }),
        (0, import_jsx_runtime.jsx)("button", {
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
            (0, import_jsx_runtime.jsx)("span", { style: styles.caps, children: t(capsKey(provider.capabilities)) }),
            (0, import_jsx_runtime.jsxs)("span", { style: styles.actions, children: [
              (0, import_jsx_runtime.jsx)("button", { className: "dws-icon", disabled: busy, title: t("list.delete"), onClick: act({ action: "delete", index }), children: "\xD7" }),
              (0, import_jsx_runtime.jsx)("button", { className: "dws-icon", disabled: busy || index === 0, title: t("list.up"), onClick: act({ action: "move", index, delta: -1 }), children: "\u2191" }),
              (0, import_jsx_runtime.jsx)("button", { className: "dws-icon", disabled: busy || index === providers.length - 1, title: t("list.down"), onClick: act({ action: "move", index, delta: 1 }), children: "\u2193" })
            ] })
          ] }),
          (0, import_jsx_runtime.jsxs)("div", { style: styles.under, children: [
            (0, import_jsx_runtime.jsxs)("span", {
              style: styles.counters,
              title: [
                `${t("list.lastSearch")}${when(stats.lastSearch)}`,
                `${t("list.lastError")}${when(stats.lastError)}`,
                `${t("list.lastFetch")}${when(stats.lastFetch)}`,
                `${t("list.lastFetchError")}${when(stats.lastFetchError)}`
              ].join("\n"),
              children: [
                (0, import_jsx_runtime.jsx)("span", { style: styles.muted, children: t("list.counters") }),
                (0, import_jsx_runtime.jsx)("span", { style: styles.green, children: stats.searches ?? 0 }),
                (0, import_jsx_runtime.jsx)("span", { style: styles.slash, children: "/" }),
                (0, import_jsx_runtime.jsx)("span", { style: styles.red, children: stats.errors ?? 0 }),
                (0, import_jsx_runtime.jsx)("span", { style: styles.muted, children: t("list.and") }),
                (0, import_jsx_runtime.jsx)("span", { style: styles.green, children: stats.fetches ?? 0 }),
                (0, import_jsx_runtime.jsx)("span", { style: styles.slash, children: "/" }),
                (0, import_jsx_runtime.jsx)("span", { style: styles.red, children: stats.fetchErrors ?? 0 })
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
  caps: { flex: "0 0 auto", fontSize: 11, opacity: 0.55, whiteSpace: "nowrap" },
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
