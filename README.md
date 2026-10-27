# @dr-co/dsh-websearch

Configurable search-provider aggregator for DeepSeek Harness.

## Current milestone

Implemented and tested:

- provider configuration metadata;
- short generated provider IDs;
- deterministic credential references;
- Exa adapter and normalized `WebSearchResult`;
- classified fallback between configured providers;
- safe `describeProviders()` output without secret values.

`npm test` currently passes 6 tests.

## Upstream seam blocker

The current `@deepseek-ai/dsh-web` service exposes provider registration and one
selected `search()` operation, but does not expose a provider lookup or a way
to invoke a registered provider by id. Its provider map is private. Therefore
this plugin must not call `ctx.web.search()` from its own registered provider:
that would recurse into the aggregator.

The built-in `internal` provider needs a small upstream seam/API addition before
it can participate in this aggregator's fallback stack. Settings UI and the
model-facing `web_search_providers` tool also require the host's settings/tool
integration to be wired into the bundle.

No DSH core or `dsh-chatgpt-subscription` files are modified by this package.
