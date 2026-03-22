---
id: PMC-087
title: App store search tools
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-086]
---

## Description

Implement search tools for the app-store-intel MCP server. These tools let PMs discover apps on both the Apple App Store and Google Play Store by keyword, with country-specific results.

**Tools:**

1. **search_app_store** -- Searches the Apple App Store via the iTunes Search API.
   - API: `GET https://itunes.apple.com/search?term=<query>&country=<country>&media=software&limit=<limit>`
   - Params: `query` (required), `country` (optional, ISO 3166-1 alpha-2, default `us`), `limit` (optional, 1-200, default 25)
   - Returns: array of `{ app_id, name, developer, bundle_id, price, rating, rating_count, icon_url, description_snippet, category, release_date }`

2. **search_play_store** -- Searches the Google Play Store.
   - Uses google-play-scraper patterns to search by keyword.
   - Params: `query` (required), `country` (optional, default `us`), `limit` (optional, 1-250, default 25)
   - Returns: array of `{ app_id, name, developer, price, free, rating, rating_count, icon_url, description_snippet, category, installs }`

Both tools should use the caching layer from PMC-086, keyed on `(store, query, country, limit)`.

## Acceptance Criteria

- [ ] `search_app_store` tool registered and queries iTunes Search API correctly
- [ ] `search_app_store` normalizes iTunes API response into the defined return schema
- [ ] `search_play_store` tool registered and queries Play Store correctly
- [ ] `search_play_store` normalizes Play Store response into the defined return schema
- [ ] Both tools support `country` parameter with ISO 3166-1 alpha-2 validation
- [ ] Both tools clamp `limit` to their respective valid ranges
- [ ] Results are cached using the disk caching layer with TTL
- [ ] Both tools handle empty results gracefully (return empty array, not error)
- [ ] Both tools handle API/network errors with descriptive error messages
- [ ] Unit tests with mocked API responses for each tool
- [ ] Tests cover cache hit and cache miss scenarios

## Files to Create/Modify

- `mcp-servers/app-store-intel/src/tools/search-app-store.ts`
- `mcp-servers/app-store-intel/src/tools/search-play-store.ts`
- `mcp-servers/app-store-intel/src/index.ts` (register tools)
- `mcp-servers/app-store-intel/tests/tools/search-app-store.test.ts`
- `mcp-servers/app-store-intel/tests/tools/search-play-store.test.ts`
