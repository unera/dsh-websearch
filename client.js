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
  "help.list": "Add the providers you need to the list below. A search walks them from top to bottom until they run out or a result is found.",
  "help.registration": "Registering makes this aggregator the active provider. If something here breaks, unregister: DSH falls back to its built-in providers and nothing is deleted.",
  "help.restart": "Restart DeepSeek Harness for this to take effect.",
  "page.register": "Register",
  "page.unregister": "Unregister",
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
  "list.deleteConfirm": "Delete the '{0}' provider (id {1})?",
  "list.reset": "reset",
  "test.one": "Test this provider",
  "test.off": "Nothing to test: the provider is off or has no allowed capability",
  "test.running": "Testing\u2026",
  "test.search": "search",
  "test.fetch": "page fetch",
  "test.ok": "ok",
  "test.failed": "failed",
  "test.skipped": "skipped",
  "error.unsupportedType": 'The host does not know the provider type "{0}" yet \u2014 restart it after installing the update',
  "error.keyRequired": "An API key is required",
  "error.indexOutOfRange": "That provider is no longer in the list",
  "error.moveOutOfRange": "Nothing to move it past",
  "error.unknownAction": 'The host does not know the action "{0}"',
  "error.failed": "The deployment rejected the change: {0}",
  "caps.off": "off",
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
  "help.list": "\u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043D\u0443\u0436\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 \u0432 \u0441\u043F\u0438\u0441\u043E\u043A \u043D\u0438\u0436\u0435. \u041F\u0440\u0438 \u0440\u0430\u0431\u043E\u0442\u0435 \u043F\u043E\u0438\u0441\u043A \u0431\u0443\u0434\u0435\u0442 \u043F\u0435\u0440\u0435\u0431\u0438\u0440\u0430\u0442\u044C \u0438\u0445 \u0441\u0432\u0435\u0440\u0445\u0443 \u0432\u043D\u0438\u0437, \u043F\u043E\u043A\u0430 \u043E\u043D\u0438 \u043D\u0435 \u0438\u0441\u0447\u0435\u0440\u043F\u0430\u044E\u0442\u0441\u044F \u0438\u043B\u0438 \u043D\u0435 \u0431\u0443\u0434\u0435\u0442 \u0434\u043E\u0441\u0442\u0438\u0433\u043D\u0443\u0442 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442.",
  "help.registration": "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u0434\u0435\u043B\u0430\u0435\u0442 \u0430\u0433\u0440\u0435\u0433\u0430\u0442\u043E\u0440 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u043C. \u0415\u0441\u043B\u0438 \u0437\u0434\u0435\u0441\u044C \u0447\u0442\u043E-\u0442\u043E \u0441\u043B\u043E\u043C\u0430\u0435\u0442\u0441\u044F \u2014 \u043E\u0442\u0437\u043E\u0432\u0438\u0442\u0435 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044E: DSH \u0432\u0435\u0440\u043D\u0451\u0442\u0441\u044F \u043A \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u043C \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430\u043C, \u043D\u0438\u0447\u0435\u0433\u043E \u0443\u0434\u0430\u043B\u044F\u0442\u044C \u043D\u0435 \u043D\u0443\u0436\u043D\u043E.",
  "help.restart": "\u0427\u0442\u043E\u0431\u044B \u044D\u0442\u043E \u043F\u0440\u0438\u043C\u0435\u043D\u0438\u043B\u043E\u0441\u044C, \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 DeepSeek Harness.",
  "page.register": "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
  "page.unregister": "\u041E\u0442\u043E\u0437\u0432\u0430\u0442\u044C \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044E",
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
  "list.deleteConfirm": "\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \xAB{0}\xBB \u0441 id={1}?",
  "list.reset": "\u0441\u0431\u0440\u043E\u0441\u0438\u0442\u044C",
  "test.one": "\u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u044D\u0442\u043E\u0433\u043E \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430",
  "test.off": "\u041F\u0440\u043E\u0432\u0435\u0440\u044F\u0442\u044C \u043D\u0435\u0447\u0435\u0433\u043E: \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D \u0438\u043B\u0438 \u043D\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u043E \u043D\u0438 \u043F\u043E\u0438\u0441\u043A\u0430, \u043D\u0438 \u0441\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u044F",
  "test.running": "\u041F\u0440\u043E\u0432\u0435\u0440\u044F\u044E\u2026",
  "test.search": "\u043F\u043E\u0438\u0441\u043A",
  "test.fetch": "\u0441\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435",
  "test.ok": "\u0443\u0441\u043F\u0435\u0448\u043D\u043E",
  "test.failed": "\u043E\u0448\u0438\u0431\u043A\u0430",
  "test.skipped": "\u043D\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u043B\u043E\u0441\u044C",
  "error.unsupportedType": "\u0425\u043E\u0441\u0442 \u0435\u0449\u0451 \u043D\u0435 \u0437\u043D\u0430\u0435\u0442 \u0442\u0438\u043F \xAB{0}\xBB \u2014 \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u0435\u0433\u043E \u043F\u043E\u0441\u043B\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F",
  "error.keyRequired": "\u041D\u0443\u0436\u0435\u043D API-\u043A\u043B\u044E\u0447",
  "error.indexOutOfRange": "\u042D\u0442\u043E\u0433\u043E \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 \u0443\u0436\u0435 \u043D\u0435\u0442 \u0432 \u0441\u043F\u0438\u0441\u043A\u0435",
  "error.moveOutOfRange": "\u0414\u0430\u043B\u044C\u0448\u0435 \u0434\u0432\u0438\u0433\u0430\u0442\u044C \u043D\u0435\u043A\u0443\u0434\u0430",
  "error.unknownAction": "\u0425\u043E\u0441\u0442 \u043D\u0435 \u0437\u043D\u0430\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \xAB{0}\xBB",
  "error.failed": "\u0420\u0430\u0437\u0432\u0451\u0440\u0442\u044B\u0432\u0430\u043D\u0438\u0435 \u043E\u0442\u043A\u043B\u043E\u043D\u0438\u043B\u043E \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435: {0}",
  "caps.off": "\u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E",
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
  "help.list": "\u5C06\u9700\u8981\u7684\u63D0\u4F9B\u65B9\u52A0\u5165\u4E0B\u9762\u7684\u5217\u8868\u3002\u641C\u7D22\u65F6\u6309\u4ECE\u4E0A\u5230\u4E0B\u7684\u987A\u5E8F\u4F9D\u6B21\u5C1D\u8BD5\uFF0C\u76F4\u5230\u7528\u5C3D\u6216\u5F97\u5230\u7ED3\u679C\u3002",
  "help.registration": "\u6CE8\u518C\u540E\u672C\u805A\u5408\u5668\u6210\u4E3A\u6D3B\u52A8\u63D0\u4F9B\u65B9\u3002\u82E5\u6B64\u5904\u51FA\u95EE\u9898\uFF0C\u8BF7\u64A4\u9500\u6CE8\u518C\uFF1ADSH \u4F1A\u56DE\u9000\u5230\u5185\u7F6E\u63D0\u4F9B\u65B9\uFF0C\u4E0D\u4F1A\u5220\u9664\u4EFB\u4F55\u5185\u5BB9\u3002",
  "help.restart": "\u8BF7\u91CD\u542F DeepSeek Harness \u4F7F\u5176\u751F\u6548\u3002",
  "page.register": "\u6CE8\u518C",
  "page.unregister": "\u64A4\u9500\u6CE8\u518C",
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
  "list.deleteConfirm": "\u786E\u5B9A\u8981\u5220\u9664\u201C{0}\u201D\uFF08id {1}\uFF09\u5417\uFF1F",
  "list.reset": "\u91CD\u7F6E",
  "test.one": "\u6D4B\u8BD5\u6B64\u63D0\u4F9B\u65B9",
  "test.off": "\u65E0\u53EF\u6D4B\u8BD5\uFF1A\u63D0\u4F9B\u65B9\u5DF2\u5173\u95ED\u6216\u672A\u5141\u8BB8\u4EFB\u4F55\u80FD\u529B",
  "test.running": "\u6D4B\u8BD5\u4E2D\u2026",
  "test.search": "\u641C\u7D22",
  "test.fetch": "\u6293\u53D6",
  "test.ok": "\u6210\u529F",
  "test.failed": "\u5931\u8D25",
  "test.skipped": "\u672A\u6D4B\u8BD5",
  "error.unsupportedType": "\u5BBF\u4E3B\u5C1A\u4E0D\u8BA4\u8BC6\u63D0\u4F9B\u65B9\u7C7B\u578B\u201C{0}\u201D\u2014\u2014\u5B89\u88C5\u66F4\u65B0\u540E\u8BF7\u91CD\u542F",
  "error.keyRequired": "\u9700\u8981 API \u5BC6\u94A5",
  "error.indexOutOfRange": "\u8BE5\u63D0\u4F9B\u65B9\u5DF2\u4E0D\u5728\u5217\u8868\u4E2D",
  "error.moveOutOfRange": "\u65E0\u6CD5\u7EE7\u7EED\u79FB\u52A8",
  "error.unknownAction": "\u5BBF\u4E3B\u4E0D\u8BA4\u8BC6\u64CD\u4F5C\u201C{0}\u201D",
  "error.failed": "\u90E8\u7F72\u62D2\u7EDD\u4E86\u8BE5\u66F4\u6539\uFF1A{0}",
  "caps.off": "\u5DF2\u5173\u95ED",
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
var TYPE_LABELS = { exa: "Exa", deepseek: "DeepSeek", openai: "OpenAI", jina: "Jina", perplexity: "Perplexity", tavily: "Tavily", firecrawl: "Firecrawl", brave: "Brave", serper: "Serper" };
var TYPE_OPTIONS = ["exa", "deepseek", "openai", "jina", "perplexity", "tavily", "firecrawl", "brave", "serper"];

// client/index.jsx
var SECTION_ID = "websearch";
var API = "/__ws";
var EXA_ICON = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg width="107" height="129" viewBox="0 0 107 129" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M106.417 9.30741C106.417 9.57392 106.324 9.83227 106.155 10.0388L61.5395 64.5L106.155 118.96C106.324 119.166 106.417 119.425 106.417 119.691V127.843C106.417 128.482 105.897 129 105.255 129H1.16175C0.520132 129 0 128.482 0 127.843V1.15695C0 0.51798 0.520131 0 1.16174 0H105.255C105.897 0 106.417 0.517984 106.417 1.15695V9.30741ZM19.0364 116.382H87.6921L53.363 74.4795L19.0364 116.382ZM12.6699 104.192L40.1426 70.6585H12.6699V104.192ZM12.6699 58.0409H39.8964L12.6699 24.8064V58.0409ZM53.363 54.5193L87.6921 12.6176H19.0364L53.363 54.5193Z" fill="#0143D9"/></svg>'
);
var DEEPSEEK_ICON = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#5786FE" d="M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45"/></svg>'
);
var OPENAI_ICON = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#EDEDED" d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>'
);
var JINA_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEH0lEQVR4nOVXT2gcZRT/vfd9M9nJkpaWFCxa722gJ9GbpuBB9OLBCdJDabOl0MRLqFoEYRgvwYOHEnoQ3FAiPbhbTz1IPZQEDyp4KGjpQZF6Cbppu7ZJ2Jlv5nvPwybbpjbtJq3k4IOBYXh/ft9v3r+P8KxkenoPdu16Ds4JjKFN9bxXhCHDuQ6mpm5urtiPJAkjTQXnz78G5i9RFPsg0p/PMHRw7nP7VAAABiDwfgqDgwfgnICZ+7IUGYAx7z8dgJER7b07p1BVALq5QU8I3iuI3NMy8IBLWqe+v1+wpt8fXf+VqOrOAiCSnQUA7DADO/gLupVCtMMMADuYA90q/P/mQA/CvzqhAoQ4Zhw6RAAwPz+P0dFRoTSVZx9eNwLQODbUbHo0m36D4sICNEkYAJ4xkPsAkiRhSlOvp04Fy8ArEDnkgUEr8qcl+onS9DcAaMSxGXsY4PZFrK4ND0pTaddqJ1ZEPiCigxXbxSaq6JRlvnzy5Dcrzn28f27ueo+p7YpqtwqYM0YcMwDcGR//YncYzipwsFMU0s7zsp1l5V3nfCEyMGDM20MDA9+3xsffombTN+LYbBsAkYIZUG0xNZt+6cSJ6T1RVLvV6RRZWQoRMQGWiCwBBoC287wsRYYqzJeWa7XDY82mP9Vub6+KVBXMCuAX/rtWe9kSfXi70/EgskT0KKfERDb3vhwwppKLzChA+xcX+1k+HskBVAnGXGURmYqsJVEFPWGZYCJ7N88lNObVW8ePv5SmabllClQVxjCcuw3mKyzAaOY90P9yIoPWKjOPbsWoJ0QeUQQAlzAx0WIFhr3IE0+/4RBdCg9sNTYABREhyxzC8DMAxADKbTraup1qiWrVwPtPcfr0r2g0mAm4GTArVLfS4QjAjS0GL1CtBlhZ+Q6HD3+CRsMgjoWJ6OuKtSR9rNMKqCHiZedyAr4FgL5QqxYYHAyQ5zcQBO/gyBGP69cVRMoh0cyKc63IWlbgsd1NVYu9lQqLan3v7OwfSZKEjwWg6gEIhoYCFMWPWF19HRMTLSQJYW2m8FC9/hcxnwyZKWA2olqqqmi3Ya4/XlWL4UolbOf5NTj3kSYJz28koHsp6Qbt5kcUGQQBI8vOI8uO4OzZxd51bk1Y49jsrdcv33Pu3YCovS+KbGQtWyIyRBQw01AQmOEoClaK4mpA9MbwxYv3AGDh/s2IwEwwxiKKDKpVC2OAsrwC1VFMTr6HM2c6DwcHAEvNptc4NnThwleLR4/+oNXqpFd9U1VfVCBQ4F4h8rMXmdtdr88BgHYnp6DRWJ8HBURWIdKCc7+DaAHAZUxOXgMANBoGY2PycPAu8nX+HphwmiS2s7T0fJFllV3V6h2amVl6IA+IiDYm7LlzLyCKAlQqLRw7ttr7niSMkRHC2NimufUPkcj3dJ0PHO0AAAAASUVORK5CYII=";
var PERPLEXITY_ICON = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#20808D" d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z"/></svg>'
);
var TAVILY_ICON = "data:image/png;base64,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";
var FIRECRAWL_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADuklEQVR4nMWXX4hUVRzHP+femXHWWWQ3NHezKEwWkk2RwAc3FHxJVBKKHpae2iDKCFx8qYfwwehFI1Q06SFNRUqUAoXqwUqM/q0v4maoi6bJ0uiyusrozs7c8+vhd+7OjHPv7p2xpQPD3Hvu73d+3/P9nt/vnGNERPgfm9e0p1j9PWRLNe1pHPaQQGOaGqZ5BgZOwMXfNLAxQHNKNg4gpP3Cr7BpBRz5AIr3AFNhY2YBuCCPdUHZwr73YdfrMDEOBhplojkJRDSQD2TT8N0X8OVWjd0gCY0DCDW/cRVK7j1j4Pv9MHxJ323y7GgQgAAGigX4+SikAVvWXMoPw9BAld1MALCBzvD4Drh4TmduraZkEfjnsos/EwzYALwUDJ6CYx+B/0DeG6Awps9++j8GIAKeD9f+gB19MDaqtE+mnVHWH+nU2X+zFwq3QueHBBAGuTMCO/vg6mXIeLU5by1k3VDbe2HvxkqlnKYlK8XGwNEP4dzvMNtXOWpAWsj48NU2yOchNwtu34SWOYBMWaanhilWnS+dgRO7K4uuDiAQBDCSh6wP94rwy7FE+0Mynk7ug8IE+B41mhqvNkiqak/48RCM3dTvU2RFPIBQ42IB/j4fdlYFByYsBOJKsPOxokwNDcLJz5xhUxKIznC8AGMjtZbGaBVc2gNtc/W5gmKyXvH1xzA67FiIzoZ4AMaDK2cVgO/Xfxs30PMKvLUHUpnwQwVExuiC/OmI64qWoT4LxK3aoAQH3oPW9vpvItAi0N4BK16GJZ/AwA/QUp0hngYdOuOwheujVo54Bu4XNPe/PQzXBrXuSyiLha5l0L1K359bC14EzUbg7igEZbWLUGGaNWB0ZVcfu8oBzMlB33Zo69D+ruWQFgjiVnt8NYwHMCsHuTaYHNOAGK3zb+6EZ1frzAAyWcjmYHar2kzGNSqhn3Y1JQmAMG/TGVjQ5WZv1Llo4aV+WP2a25ycuw3g7U9hQz+UpKK3J7BwmQNTr7/rj2hBoP/nT4tsSIm86Im8gMi7K0VKRWdk6+1Hh0VenSeyDpF1RqS3XST/lzOvsq9q0RJ4brN5pgdW9cJ9C2kf1ryhKWeD2tl4nva1d6p9yYOywNqN8OiTleyJChXZW01Z7xZ44ik9/81fGOoU77P4eShZ6F4O69+Z9qQcDyBkoeNp2HwQOhdVDhxxzRgtXN1Lof9zaJvvKnF8KTbT3g3FHbmu/wkIPL44mtKw78pZaGlV4KHvVJgTXU4TDNSsTzIAkPwO2OBdMTmAGWr/AvUbx3J8yNACAAAAAElFTkSuQmCC";
var BRAVE_ICON = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#FB542B" d="M15.68 0l2.096 2.38s1.84-.512 2.709.358c.868.87 1.584 1.638 1.584 1.638l-.562 1.381.715 2.047s-2.104 7.98-2.35 8.955c-.486 1.919-.818 2.66-2.198 3.633-1.38.972-3.884 2.66-4.293 2.916-.409.256-.92.692-1.38.692-.46 0-.97-.436-1.38-.692a185.796 185.796 0 01-4.293-2.916c-1.38-.973-1.712-1.714-2.197-3.633-.247-.975-2.351-8.955-2.351-8.955l.715-2.047-.562-1.381s.716-.768 1.585-1.638c.868-.87 2.708-.358 2.708-.358L8.321 0h7.36zm-3.679 14.936c-.14 0-1.038.317-1.758.69-.72.373-1.242.637-1.409.742-.167.104-.065.301.087.409.152.107 2.194 1.69 2.393 1.866.198.175.489.464.687.464.198 0 .49-.29.688-.464.198-.175 2.24-1.759 2.392-1.866.152-.108.254-.305.087-.41-.167-.104-.689-.368-1.41-.741-.72-.373-1.617-.69-1.757-.69zm0-11.278s-.409.001-1.022.206-1.278.46-1.584.46c-.307 0-2.581-.434-2.581-.434S4.119 7.152 4.119 7.849c0 .697.339.881.68 1.243l2.02 2.149c.192.203.59.511.356 1.066-.235.555-.58 1.26-.196 1.977.384.716 1.042 1.194 1.464 1.115.421-.08 1.412-.598 1.776-.834.364-.237 1.518-1.19 1.518-1.554 0-.365-1.193-1.02-1.413-1.168-.22-.15-1.226-.725-1.247-.95-.02-.227-.012-.293.284-.851.297-.559.831-1.304.742-1.8-.089-.495-.95-.753-1.565-.986-.615-.232-1.799-.671-1.947-.74-.148-.068-.11-.133.339-.175.448-.043 1.719-.212 2.292-.052.573.16 1.552.403 1.632.532.079.13.149.134.067.579-.081.445-.5 2.581-.541 2.96-.04.38-.12.63.288.724.409.094 1.097.256 1.333.256s.924-.162 1.333-.256c.408-.093.329-.344.288-.723-.04-.38-.46-2.516-.541-2.961-.082-.445-.012-.45.067-.579.08-.129 1.059-.372 1.632-.532.573-.16 1.845.009 2.292.052.449.042.487.107.339.175-.148.069-1.332.508-1.947.74-.615.233-1.476.49-1.565.986-.09.496.445 1.241.742 1.8.297.558.304.624.284.85-.02.226-1.026.802-1.247.95-.22.15-1.413.804-1.413 1.169 0 .364 1.154 1.317 1.518 1.554.364.236 1.355.755 1.776.834.422.079 1.08-.4 1.464-1.115.384-.716.039-1.422-.195-1.977-.235-.555.163-.863.355-1.066l2.02-2.149c.341-.362.68-.546.68-1.243 0-.697-2.695-3.96-2.695-3.96s-2.274.436-2.58.436c-.307 0-.972-.256-1.585-.461-.613-.205-1.022-.206-1.022-.206z"/></svg>'
);
var spinner = () => (0, import_jsx_runtime.jsx)("span", { className: "dws-spin", children: "\u27F3" });
var SectionBoundary = class extends import_react.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error === null) return this.props.children;
    return (0, import_jsx_runtime.jsxs)("section", {
      style: { display: "flex", flexDirection: "column", gap: 8, padding: 16 },
      children: [
        (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 14, margin: 0 }, children: "dsh-websearch" }),
        (0, import_jsx_runtime.jsx)("p", { style: { color: "#f85149", fontSize: 12, margin: 0 }, children: String(this.state.error?.message ?? this.state.error) })
      ]
    });
  }
};
var SERPER_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAJ30lEQVR4nIVXWXSV1RX+9vnPP9yRJEYilSlUWzGUKWFQQGNBbe1D7aqkuhZP1gW1YgIsUGof7r19KCKUDFQ0dq36gtiV9Mk6LEWbUEEDJICUaTkwqihThvvf6R/O7sPNHy5T2Wvdl/+es/e3h/PtvQk3EGamJEApIgUAm/YMTNIg50HSfGaexswTiDCqeBaDBJwiqR0g39/p+f4nq2aXHQeARIJFMgkmIr6eHbrex0SCRSpVNNxyID0FPho1qS0SmllNgkBEIHH5MgNgBTAzWCl4rnMCyt/OPjavmB07dLXO/wtgcQdrnQ3kN3f1l1HceA7ETWYoEg5OO9ksWKnjTDhHTDYIYHCUGKNJiElGODyMCMhn7QIJ8XJeFf60tq5iMNB9QwDBgQ27Lk7RQ+brZihS57suQATPKZwAaW8o5XUpU/siTaHvU1PIAYCOQ2yc5lyVKPh3CiEfgPKWSCs0kX0FqetwnNwev5B7ctWcWw5fDWIEQEcHaw0N5LfsGZilWaFOTdMnKN8DM5/zXHdjLBJ59anJlC4FzMwEAFfnt7XnQpx163ea1FcT0a1Ck/A855Tj+b9eXRvpC2yNAGBmIiJu7huaTKR9JHVjDBHB87yPXc9ZuroufgwAEsyiBqDDACeLgQYAJJNJQjKJ4L+gcDf0XLjbCkXbhZDzGQzPdb8RUixqnGodC2xSglkAQMXui1EljS4zFJ3JrOA5hbdzFwtL1j5YMdje3qsvW1rrgYgTzKKmE9RwVS6ZmTo7IRoayAcztb8GuWwZuYmuE2UVo6q2SsP4BZFAIZ/d64QjC7P/QAbJYa8AoLU3vf6Vo8ybDxa4ZZ/9yfqjHAOADmatNE1XhPpzNl8/wVZ7L+vBt0Bf6d3Wngvxlj6756+fOfzKUebWvvS64CwBQMuei1MgzL3SNA3PKQwKVvc21sWPleYKzAQibv60f6KwjEfB+JlSqgaEEBjfS934MOcUOp6bFd8VnC2trZf7hia7pO2Uul7mOU7BJVW3Zmb8SBGtZjWakZBFgADUi4118WNdXSwD4zyscOOe9G9kONwVqwg3RyvCDxtWaKyUxi2haPTuWIXRGDbMj5r3ppMgYjATmKmhgfxEF8tnauNHfd9/CSBhhkMhHaIRAKjtQK5a+d4OMxwdm8/Yp2OR/E9+e1elHVT3iAf77Yd8Eu+Y4ZDM29kvfcXvCsG7FYu0YDWJgV/pZuh+aWgoZDJrmmZGN46QDzMxgJd2IWpY9n+tSHR8PmOfgSvvF8r35umGNY4IxMDWpybfmk4mkxQ8rYYGqASzcBnPh2IhmRvKdLMqLFxVF21aMTO2bVVt5F8r6mKtA1b0Ia+Qa9c0gJnXbTpij0mlSHFJOp6fT2libAOBDNMaz7o3TxCJBSQ0uIWCR4wPASbUJ4NCIoA4/ukZkxnT8xkHrPDSirqK0xvePxtp72U90dUll/aynppCzqh0dEWm334fjL2W5+VLCzbZDQ1gIsJ2z3E8EhoEsEAqpaaTIPiud9pg7SuAGN0ccDYDwLj4OP/rgm1LXStzHWcegPfWPDwmM1L5CRaJQ4eMk51wKuZEf2mN/lZbNvX27BUk1Q0FELOV/crLO2dkxKhmwjRq7rW/C0UjVfls5tP+L0/WpxqmOAFJXEFSvUObouWxlZn+DED0pmLvDSI6DuGfXTmjfAA3kUBP4hAbZTl7RygWnZvP2GclEceJAKVU9rLxay+v7+tPod8eZ4TCj4Vj4gnfwxN2f+YSFJ1q6U1/x6CvhJQffLnj3x9sbnqkUOpEMRIjIJzmXjtDBDAwSt4MeYmSQQCL2z7LPjF4zn8cRD8Gc3WsMjrDsAAnB2TT7vIf1S/c27bfWU5Ee64GcT2RgBhkRkhAhBMdhwwium4UAoZrJHoTwJubeu0xAI0ZupSpEkx3MPGDrPihaHl0lt2ffXvj7sH5RPR5AIK56EziEBvI2RFmgIBByaxOM+M2EKpGT5xUBeBMMglCSbMBgKDBJLq6ZM35em6oo7MAzpYc2dzaOzjX7k9vi5XHqocGMk8DWFmsfniBznLkbmNCFTPAwCkJwgFWPFuTcrzH7h0Af416CKSgAkrdcnCgvOCIrQw6u6ou9lQHsxbw/OFuUM15cCeApjrqadmX2WaG8Qf088QrQlgPgRSzytt36IYxjhWDGJ9JFvgPK3+pbpoy77oLAepCd6LobTJJKYDTHlVGzPAj0tDQ0ju0r4Foy/Xy2d7Lek5lFhRyEKBidOrrgRSAZD38FIgFpRdJw5C+60H5/sfUdqC/WnnaDjMSG5vP2KeFd3Zq45w700EBXp4V7JejZZHfZ9P5rPK8NoL2yrTa0LdbOjt5fnSxdCoHp+pCe8GIRB91czlFvndf46z4rkQiIZLJJANA227ElLQPFqk4fVoneb9onF5+gkh7D1BkmNYEpd32NBFxdzF3SCZBYKZCmfNCpj/zVjhmhUPR6Fom/+iBvkzfvT98ZLuqyhzWNdkTrYg+ysrzfN9Z0TgrvouZKZVKqWQ3NCJiJTPP6FZoAkOREOK95bXhUwQArfvydyvl9emmYXiOO6jDn/dMbfxo0IhGSOStb8Kjbo8tJ6Znpa6PlaYJTQM8h+EWch5JucPJ5Navvqdse1A/gY5Nu9M1mhQ7NUOPe45TYKjalbXxo5RgFiki1dyXWWeFw2s914Hvuj3k5h9umls51MGsNdBlEACwfuf5mB625ggfdylSFkG7wJq+d9UM8wgADrpgcLe1h+Os29s1ac6Who58NvvnlbWRPyaYRXEkSwLhxy9EjGzoI9MKzxoeyd65NHhuSeqB6oH2dtaXLYXHAJIly8r1pKODtcWLoV4bHsnWfTxQHgrrb+iG+XMSAk4us0da0YXnO1HsFcBlnm47mL9LeepDqeu3EwhKeTvzOXvZmrmVR0bIqLtb1JyvZywuPsHAcE09+HA3CPVQI9vU/nSNBv1vUsp7mBie436tCbHw2enWCEFdM5Zv7MvUmrr8p6bpE4fH8vOe5/+lwPlX19ZVDJZ6e6Ox/MXeS6MsYTwtpb4KKI7lvuecLHj5x1bXll07lgcSLA2bdl+sEbr5dzMUme27LiAE3HzulCbEVodVl2Ttix9Yoe8ahheT1nc/N3n02CqQfycJ8VPl+0sMKzxe+QrS0OFkM7udTP7JNfdVHrnhYnI1iBd7L42yyHwe4CYzXLKa5XJQvn8CRN+DVXEmIBEBc5XQtGozFAIzwAwUsnaeBG0hJ59qmls5dNPVLJDSRbL4fNBIQlskpDFJaOLa5ZSDH0P5Cr7nHGff306C25pmxo9crfOmAIL8JksqfkNPf7Um5b1C0AJmnkZE46G4fFjLAIBTQmj7le/vZM37ZOWM8pNFw0UmvFFb/h/cj5fvxLouSwAAAABJRU5ErkJggg==";
var ICONS = {
  exa: EXA_ICON,
  deepseek: DEEPSEEK_ICON,
  openai: OPENAI_ICON,
  jina: JINA_ICON,
  perplexity: PERPLEXITY_ICON,
  tavily: TAVILY_ICON,
  firecrawl: FIRECRAWL_ICON,
  brave: BRAVE_ICON,
  serper: SERPER_ICON
};
var typeLabel = (type) => TYPE_LABELS[type] ?? String(type ?? "");
var PROVIDER_CAPS = {
  exa: { search: true, fetch: true },
  deepseek: { search: true, fetch: true },
  openai: { search: true, fetch: false },
  jina: { search: true, fetch: true },
  perplexity: { search: true, fetch: false },
  tavily: { search: true, fetch: true },
  firecrawl: { search: true, fetch: true },
  brave: { search: true, fetch: false },
  serper: { search: true, fetch: false }
};
var capsKey = (capabilities, enabled) => {
  const search = capabilities?.search !== false;
  const fetch2 = capabilities?.fetch === true;
  if (enabled === false || !search && !fetch2) return "caps.off";
  if (search && fetch2) return "caps.searchFetch";
  return search ? "caps.searchOnly" : "caps.fetchOnly";
};
var iconOf = (type) => ICONS[type ?? "exa"] ?? null;
var iconNode = (type, size) => {
  const icon = iconOf(type);
  if (icon === null) return null;
  return (0, import_jsx_runtime.jsx)("img", { src: icon, alt: "", width: size, height: size, style: { flex: "0 0 auto" } });
};
var capsStyle = (key) => {
  if (key === "caps.off") return styles.capsOff;
  if (key === "caps.searchFetch") return styles.capsFull;
  return styles.capsPartial;
};
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
  color: inherit; cursor: pointer; font: inherit; font-size: 12px; line-height: 1; padding: 3px 6px;
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
.dws-fields > .dws-model { flex: 0 1 150px; min-width: 110px; }
/* A one-row textarea, used instead of a password input because password managers
 * kept filling the wrong field. */
.dws-one-line { display: block; overflow: hidden; resize: none; }
.dws-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; }
.dws-button {
  background: transparent; border: 1px solid rgba(127,127,127,.35); border-radius: 6px;
  color: inherit; cursor: pointer; font: inherit; font-size: 11px; padding: 5px 10px; white-space: nowrap;
}
.dws-button:disabled { cursor: default; opacity: .4; }
.dws-spin { animation: dws-spin 1s linear infinite; display: inline-block; }
@keyframes dws-spin { from { transform: rotate(0turn); } to { transform: rotate(1turn); } }
/* Side-by-side help plates: the left one carries the walkthrough, the right one the
 * registration control. Plain flex, no media query \u2014 the panel decides the width. */
.dws-plates { align-items: stretch; display: flex; flex-wrap: nowrap; gap: 8px; width: 100%; }
.dws-plate-side { flex: 0 0 30%; min-width: 0; }
.dws-plate-main { flex: 1 1 0; min-width: 0; }
/* Icon picker: a button that opens a list, since <select> cannot render images. */
.dws-picker { min-width: 0; position: relative; }
.dws-picker-button { align-items: center; cursor: pointer; display: flex; gap: 6px; text-align: left; }
.dws-picker-button:disabled { cursor: default; opacity: .6; }
.dws-picker-value { align-items: center; display: flex; gap: 6px; overflow: hidden; }
.dws-picker-list {
  background: var(--dsw-alias-bg-secondary, #242424); border: 1px solid rgba(127,127,127,.45);
  border-radius: 8px; box-shadow: 0 10px 26px rgba(0,0,0,.45); display: flex; flex-direction: column;
  gap: 2px; left: 0; max-height: 320px; min-width: 100%; overflow-y: auto; padding: 4px;
  position: absolute; top: calc(100% + 4px); z-index: 40;
}
.dws-picker-item {
  align-items: center; background: transparent; border: 0; border-radius: 6px; color: inherit;
  cursor: pointer; display: flex; font: inherit; font-size: 13px; gap: 8px; padding: 5px 8px;
  text-align: left; white-space: nowrap; width: 100%;
}
.dws-picker-item:hover { background: rgba(127,127,127,.18); }
.dws-picker-item[aria-selected="true"] { background: rgba(127,127,127,.26); }
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
async function call(path, body, signal) {
  const response = await fetch(`${API}${path}`, body === void 0 ? { cache: "no-store", ...signal === void 0 ? {} : { signal } } : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), ...signal === void 0 ? {} : { signal } });
  const text = await response.text();
  const payload = text === "" ? null : JSON.parse(text);
  if (!response.ok) {
    const failure = new Error(payload?.error ?? `${response.status} ${response.statusText}`);
    failure.code = payload?.code;
    failure.params = payload?.params;
    throw failure;
  }
  return payload;
}
var emptyDraft = { type: "", desc: "", model: "", apiKey: "", enabled: true, useSearch: true, useFetch: true };
var uiLanguage = (t) => {
  const title = t("nav.title");
  if (title === "\u0412\u0435\u0431-\u043F\u043E\u0438\u0441\u043A") return "ru";
  if (title === "\u7F51\u7EDC\u641C\u7D22") return "zh";
  return "en";
};
function WebSearchPageInner(props) {
  const t = typeof props?.t === "function" ? props.t : (key) => key;
  const [providers, setProviders] = (0, import_react.useState)([]);
  const [selected, setSelected] = (0, import_react.useState)(null);
  const [pickerOpen, setPickerOpen] = (0, import_react.useState)(false);
  const [restartNeeded, setRestartNeeded] = (0, import_react.useState)(false);
  const [tests, setTests] = (0, import_react.useState)({});
  const [draft, setDraft] = (0, import_react.useState)(emptyDraft);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
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
    setError(null);
    try {
      await work();
      apply2(await call("/state"));
    } catch (e) {
      setError({ text: String(e?.message ?? e), code: e?.code, params: e?.params });
    } finally {
      setBusy(false);
    }
  };
  (0, import_react.useEffect)(() => {
    call("/state").then(apply2).catch((e) => setError({ text: String(e?.message ?? e), code: e?.code, params: e?.params })).finally(() => setLoading(false));
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
  const testLine = (labelKey, part) => {
    if (part === void 0) return void 0;
    if (part.skipped === true) return `${t(labelKey)}: ${t("test.skipped")}`;
    return `${t(labelKey)}: ${part.ok === true ? t("test.ok") : `${t("test.failed")} \u2014 ${part.detail ?? ""}`}`;
  };
  const canTest = (provider) => {
    const caps = provider.capabilities ?? {};
    const touchesSearch = caps.search !== false && provider.useSearch !== false;
    const touchesFetch = caps.fetch === true && provider.useFetch !== false;
    return provider.enabled !== false && (touchesSearch || touchesFetch);
  };
  const runOneTest = async (index, provider) => {
    if (!canTest(provider)) return;
    {
      setTests((previous) => ({ ...previous, [provider.id]: { running: true } }));
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 65e3);
        let result;
        try {
          result = await call("/providers", { action: "test", index }, controller.signal);
        } finally {
          clearTimeout(timer);
        }
        setTests((previous) => ({ ...previous, [provider.id]: result }));
      } catch (e) {
        const detail = e?.name === "AbortError" ? "timed out" : String(e?.message ?? e);
        setTests((previous) => ({
          ...previous,
          [provider.id]: { search: { ok: false, detail }, fetch: { skipped: true } }
        }));
      }
    }
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
  const errorText = (failure) => {
    const withParam = (key, value) => {
      const template = t(key);
      return template === key ? void 0 : template.replace("{0}", String(value ?? ""));
    };
    let text;
    if (failure.code === "unsupported-type") text = withParam("error.unsupportedType", failure.params?.type);
    else if (failure.code === "key-required") text = withParam("error.keyRequired");
    else if (failure.code === "index-out-of-range") text = withParam("error.indexOutOfRange");
    else if (failure.code === "move-out-of-range") text = withParam("error.moveOutOfRange");
    else if (failure.code === "unknown-action") text = withParam("error.unknownAction", failure.params?.action);
    if (text !== void 0) return text;
    return withParam("error.failed", failure.text) ?? failure.text;
  };
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
  const typeSelect = (0, import_jsx_runtime.jsxs)("div", { className: "dws-picker", children: [
    (0, import_jsx_runtime.jsx)("button", {
      type: "button",
      className: "dws-field dws-picker-button",
      disabled: busy || editing,
      title: editing ? t("form.typeLocked") : t("form.type"),
      "aria-haspopup": "listbox",
      "aria-expanded": String(pickerOpen),
      onClick: () => {
        if (!busy && !editing) setPickerOpen(!pickerOpen);
      },
      children: formType === "" ? (0, import_jsx_runtime.jsx)("span", { className: "dws-note", children: t("form.typeNone") }) : (0, import_jsx_runtime.jsxs)("span", { className: "dws-picker-value", children: [
        iconNode(formType, 12),
        (0, import_jsx_runtime.jsx)("span", { children: typeLabel(formType) })
      ] })
    }),
    pickerOpen && (0, import_jsx_runtime.jsx)("div", { className: "dws-picker-list", role: "listbox", children: typeOptions.map((option) => {
      const value = String(option.props.value);
      return (0, import_jsx_runtime.jsxs)("button", {
        type: "button",
        key: value === "" ? "none" : value,
        className: "dws-picker-item",
        role: "option",
        "aria-selected": String(value === formType),
        onClick: () => {
          setPickerOpen(false);
          chooseType({ target: { value } });
        },
        children: [
          iconNode(value, 14),
          (0, import_jsx_runtime.jsx)("span", { children: value === "" ? t("form.typeNone") : typeLabel(value) })
        ]
      });
    }) })
  ] });
  return (0, import_jsx_runtime.jsxs)("section", { style: styles.page, children: [
    (0, import_jsx_runtime.jsx)("h2", { style: styles.heading, children: t("nav.title") }),
    (0, import_jsx_runtime.jsxs)("div", { className: "dws-plates", children: [
      (0, import_jsx_runtime.jsx)("div", { className: "dws-card dws-plate-side", children: (0, import_jsx_runtime.jsx)("p", {
        style: styles.helpTextBright,
        children: t("help.list")
      }) }),
      (0, import_jsx_runtime.jsx)("div", { className: "dws-card dws-plate-main", children: (0, import_jsx_runtime.jsxs)("div", {
        style: { display: "flex", flexDirection: "column", gap: 8 },
        children: [
          (0, import_jsx_runtime.jsxs)("div", { style: styles.statusRow, children: [
            (0, import_jsx_runtime.jsx)("span", {
              style: styles.activeLabel,
              children: active === "dsh-websearch" ? t("page.activeSelf") : `${t("page.activeOther")}${active === "" ? t("page.activeNone") : active}`
            }),
            active === "dsh-websearch" && registered !== null && (0, import_jsx_runtime.jsx)("span", {
              style: registered.registered ? styles.green : styles.red,
              children: registered.registered ? t("page.registered") : `${t("page.notRegistered")}${registered.reason || registered.step || t("page.unknown")}`
            }),
            // Only one of the two can apply at a time, so only that one is drawn.
            active === "dsh-websearch" ? (0, import_jsx_runtime.jsx)("button", {
              className: "dws-button",
              disabled: busy,
              onClick: () => run(() => call("/providers", { action: "unregister" })).then(() => setRestartNeeded(true)),
              children: t("page.unregister")
            }) : (0, import_jsx_runtime.jsx)("button", {
              className: "dws-button",
              disabled: busy,
              onClick: () => run(() => call("/providers", { action: "select" })).then(() => setRestartNeeded(true)),
              children: t("page.register")
            })
          ] }),
          (0, import_jsx_runtime.jsx)("p", { style: styles.helpText, children: t("help.registration") }),
          restartNeeded && (0, import_jsx_runtime.jsx)("p", { style: styles.restartWarning, children: t("help.restart") })
        ]
      }) })
    ] }),
    (0, import_jsx_runtime.jsxs)("div", { className: "dws-card", children: [
      // Row 1: provider type, description and the secret side by side. Until a type
      // is chosen the two data cells give way to one instruction, so the card keeps
      // a single line of height.
      (0, import_jsx_runtime.jsxs)("div", { className: "dws-fields", children: [
        typeSelect,
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
          // Dimmed rather than merely disabled: the switch is not just unavailable
          // now, it can never apply to this provider type.
          style: typeCaps.fetch ? styles.enabled : styles.enabledOff,
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
    // Right under the form: an error belongs to the action just taken, and on a
    // full page the message at the bottom was easy to miss.
    error !== null && (0, import_jsx_runtime.jsx)("p", { style: styles.error, children: errorText(error) }),
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
            (0, import_jsx_runtime.jsx)("span", { style: styles.kind, children: typeLabel(provider.type) }),
            // Always present, empty or not: it is the flexible column that pushes the
            // capability label and the actions into their fixed places.
            (0, import_jsx_runtime.jsx)("span", { style: styles.desc, children: provider.desc }),
            (0, import_jsx_runtime.jsx)("span", {
              style: capsStyle(capsKey(provider.capabilities, on)),
              children: t(capsKey(provider.capabilities, on))
            }),
            (() => {
              const tested = tests[provider.id];
              const testable = canTest(provider);
              const running = tested?.running === true;
              const lines = tested === void 0 || running ? [] : [testLine("test.search", tested.search), testLine("test.fetch", tested.fetch)].filter((line) => line !== void 0);
              const failed = tested !== void 0 && tested.running !== true && (tested.search !== void 0 && tested.search.ok === false || tested.fetch !== void 0 && tested.fetch.ok === false);
              const label2 = !testable ? t("test.off") : running ? t("test.running") : [t("test.one"), ...lines].join("\n");
              return (0, import_jsx_runtime.jsx)("button", {
                className: "dws-icon",
                disabled: busy || running || !testable,
                title: label2,
                onClick: (event) => {
                  event.stopPropagation();
                  void runOneTest(index, provider);
                },
                children: running ? spinner() : tested === void 0 ? "\u27F3" : failed ? "!" : "\u2713",
                style: tested === void 0 || running ? void 0 : failed ? styles.testFail : styles.testOk
              });
            })(),
            (0, import_jsx_runtime.jsxs)("span", { style: styles.actions, children: [
              (0, import_jsx_runtime.jsx)("button", {
                className: "dws-icon",
                disabled: busy,
                title: t("list.delete"),
                onClick: (event) => {
                  event.stopPropagation();
                  const question = t("list.deleteConfirm").replace("{0}", typeLabel(provider.type)).replace("{1}", provider.id ?? "\u2014");
                  if (typeof window !== "undefined" && typeof window.confirm === "function" && !window.confirm(question)) return;
                  run(() => call("/providers", { action: "delete", index }));
                },
                children: "\xD7"
              }),
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
    }) })
  ] });
}
var styles = {
  page: { display: "flex", flexDirection: "column", gap: 14, maxWidth: 780, minWidth: 0 },
  heading: { margin: 0, fontSize: 20, fontWeight: 600 },
  helpText: { fontSize: 11, lineHeight: 1.45, margin: 0, opacity: 0.7 },
  helpStrong: { fontSize: 11, fontWeight: 700, lineHeight: 1.45, margin: 0 },
  restartWarning: { color: "#f85149", fontSize: 11, fontWeight: 700, lineHeight: 1.45, margin: 0 },
  helpTextBright: { fontSize: 11, lineHeight: 1.45, margin: 0, opacity: 1 },
  statusRow: { alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8 },
  hint: { margin: 0, opacity: 0.7, fontSize: 13 },
  list: { display: "flex", flexDirection: "column", gap: 2, listStyle: "none", margin: 0, padding: 0 },
  item: { alignItems: "stretch", display: "flex", flexDirection: "column", gap: 2 },
  line: { alignItems: "center", display: "flex", gap: 8, minWidth: 0 },
  under: { alignItems: "center", display: "flex", gap: 6, paddingLeft: 2 },
  id: { flex: "0 0 auto", fontFamily: "monospace", fontSize: 12, opacity: 0.75 },
  desc: { flex: "1 1 auto", fontSize: 13, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  // Pinned right whatever stands before it: rows without a description used to
  // pull the action buttons left, out of line with the rest.
  actions: { display: "flex", flex: "0 0 auto", gap: 4, marginLeft: "auto" },
  counters: { flex: "0 0 auto", fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap" },
  green: { color: "#3fb950" },
  red: { color: "#f85149" },
  slash: { opacity: 0.5 },
  activeLabel: { fontSize: 12, opacity: 0.75 },
  muted: { opacity: 0.6 },
  testOk: { color: "#56d364", flex: "0 0 auto", fontSize: 13, fontWeight: 700 },
  testFail: { color: "#f85149", flex: "0 0 auto", fontSize: 13, fontWeight: 700 },
  capsFull: { color: "#56d364", flex: "0 0 auto", fontSize: 11, whiteSpace: "nowrap" },
  capsPartial: { color: "#2ea043", flex: "0 0 auto", fontSize: 11, whiteSpace: "nowrap" },
  capsOff: { color: "#f85149", flex: "0 0 auto", fontSize: 11, opacity: 0.8, whiteSpace: "nowrap" },
  row: { alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8, minWidth: 0 },
  enabled: { whiteSpace: "nowrap", fontSize: 13 },
  enabledOff: { whiteSpace: "nowrap", fontSize: 13, opacity: 0.4 },
  kind: { flex: "0 0 auto", fontSize: 12, fontWeight: 500, opacity: 0.85, whiteSpace: "nowrap" },
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
function WebSearchPage(props) {
  return (0, import_jsx_runtime.jsx)(SectionBoundary, { children: (0, import_jsx_runtime.jsx)(WebSearchPageInner, props) });
}
var inject = ["slots", "locale"];

    return module.exports;
  }
});
