# @dr-co/dsh-websearch

[![ci](https://github.com/unera/dsh-websearch/actions/workflows/ci.yml/badge.svg)](https://github.com/unera/dsh-websearch/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@dr-co/dsh-websearch)](https://www.npmjs.com/package/@dr-co/dsh-websearch)

## Why?

Out of the box DeepSeek Harness ships one web-search provider, and it is not always the
one you want: one key ran out of quota, another answers faster, a third can extract
page text, a fourth searches your language better. Swapping them means editing config
and restarting.

This plugin turns provider choice into a list in Settings:

- **several providers at once** — a search walks the list top to bottom until one
  answers; order is changed with two buttons and applies immediately;
- **separate permissions** — search only, page retrieval only, or both; a type with no
  page endpoint cannot be given that permission at all;
- **keys in the standard place** — in the DSH credentials store, not in the
  configuration file;
- **visibility** — per-provider counters for requests and errors, plus a self-test
  button that runs the real search and the real retrieval (30 s per half) and reports
  the outcome in a tooltip;
- **a switch for the bad day** — "Unregister" hands control back to DSH's own
  providers in one click, deleting nothing.

## What it does

The plugin registers a single provider with the id `dsh-websearch` for both
`web_search` and `web_fetch`. DSH selects providers explicitly
(`web.searchProvider` / `web.fetchProvider`), so the page has one button to register
this aggregator and one to unregister it — both take effect without a restart.

The provider list is read on **every call**, so reordering a row or clearing a checkbox
applies to the next request. Errors split into two classes: an expired key, a rate
limit or a provider failure hands over to the next entry, while an invalid request
(`WEB_INVALID_URL`, `WEB_INVALID_REQUEST`) is returned to the caller as is — a mistake
in the arguments must not be masked by another provider's answer.

## Supported providers

| type | search | page fetch | notes |
| --- | --- | --- | --- |
| `exa` | yes | yes | `/search` and `/contents` |
| `deepseek` | yes | yes | `/v1/tools/search`, `/v1/tools/fetch` |
| `openai` | yes | no | Responses API with the `web_search` tool |
| `jina` | yes | yes | `s.jina.ai`, `r.jina.ai`; the reader also works anonymously |
| `perplexity` | yes | no | Agent API, `/v1/agent` |
| `tavily` | yes | yes | `/search`, `/extract` |
| `firecrawl` | yes | yes | `/v2/search`, `/v2/scrape`; renders JavaScript |
| `brave` | yes | no | independent index, `/res/v1/web/search` |
| `serper` | yes | no | Google results, `google.serper.dev/search` |

Permissions are stored per provider. A type without a page endpoint never stores
"allow fetch"; search stays whatever the user chose.

## Secrets

Keys never reach the configuration. The settings page writes them to the credentials
store under `DSH_WEBSEARCH_<TYPE>_<ID>` and leaves `apiKey: ""` in the profile. A
provider resolves its key in order: the entry's own `apiKey` field (legacy documents
only), the credentials store, then the environment variable of the same name. On
startup a one-time migration moves keys left in the configuration by older builds into
the store.

## Settings page

The `dsh-websearch` section lists providers with their mark, id, capability label and
counters. Per row: enable/disable, a self-test button, move up/down, and delete with
confirmation. The form above the list adds a provider or edits the selected one — while
editing, the button reads "Save …".

## Configuration

```yaml
- name: "@dr-co/dsh-websearch"
  config:
    providers:
      - id: dZd8wKm
        type: exa
        desc: primary
        credentialRef: DSH_WEBSEARCH_EXA_DZD8WKM
        enabled: true
        useSearch: true
        useFetch: true
```

For the aggregator to be used, `web.searchProvider` and `web.fetchProvider` must name
`dsh-websearch` — that is what the "Register" button does.

## Install

```sh
npm pack
dsh plugin --profile web add ./dr-co-dsh-websearch-<version>.tgz
```

## Tests

```sh
npm test
```

Every provider is driven through an injected transport: no test reaches the network,
and failures (401/403/429/5xx, `200` with an unusable body, malformed JSON) are
asserted as classified errors.

## CI

`.github/workflows/ci.yml` runs the tests on Node 22 and 24, rebuilds the client
bundle and fails if the committed `client.js` drifts from the sources, checks the
tarball contents and the manifest. `.github/workflows/release.yml` publishes to npm
with provenance when a `v*` tag is pushed, after verifying that the tag matches
`package.json`.
