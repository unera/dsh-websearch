# @dr-co/dsh-websearch

One `web` provider for DeepSeek Harness that runs a configurable list of search
backends, ordered by the user, with separate permissions for searching and for
retrieving pages.

## What it does

- Registers a single provider id, `dsh-websearch`, for both `web_search` and
  `web_fetch`. DSH names providers explicitly (`web.searchProvider` /
  `web.fetchProvider`), so the settings page has one button that registers this
  aggregator and one that hands control back to DSH's built-in providers.
- Walks its list from top to bottom: the first enabled provider that is allowed to
  act and available wins. Credential, rate-limit and provider errors fall through to
  the next entry; an invalid request (`WEB_INVALID_URL`, `WEB_INVALID_REQUEST`) is
  reported instead of being retried elsewhere.
- Reads the list on every call, so reordering or disabling takes effect on the next
  query rather than at the next restart.

## Supported provider types

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

Search and fetch permissions are stored per provider. A type without a page
endpoint never stores `useFetch: true`; search stays whatever the user chose.

## Secrets

Keys never live in the configuration document. The settings page writes them to the
credentials store under `DSH_WEBSEARCH_<TYPE>_<ID>` and leaves `apiKey: ""` in the
profile patch. Providers resolve, in order: the provider's own `apiKey` field (legacy
documents only), the credentials store, then the environment variable of the same
name. On startup a one-time migration moves keys that older builds left in the
configuration into the store.

## Settings page

The `dsh-websearch` section of Settings lists providers with their mark, id,
capability label and counters. Per row: enable/disable, a self-test button that runs
the real search and page-retrieval paths (30 s per half) and reports the result in a
tooltip, reorder, and delete with confirmation. The form above the list adds a
provider or edits the selected one — the button says *Save …* while editing.

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

`web.searchProvider` and `web.fetchProvider` must name `dsh-websearch` for the
aggregator to be used; a restart applies that change.

## Install

```sh
npm pack
dsh plugin --profile web add ./dr-co-dsh-websearch-<version>.tgz
```

## Tests

```sh
npm test
```

The suite drives every provider through an injected transport: no test reaches the
network, and failures (401/403/429/5xx, `200` with an unusable body, malformed JSON)
are asserted as classified errors.
