---
id: PMC-088
title: App store details and version history tools
phase: 4 - App Teardown Engine
status: todo
type: mcp-tool
estimate: 1
dependencies: [PMC-086]
---

## Description

Implement the app details and version history tools for the app-store-intel MCP server. These tools provide deep metadata about a specific app and its release cadence -- essential for competitive analysis and understanding an app&apos;s evolution.

**Tools:**

1. **get_app_details** -- Retrieves full metadata for a specific app.
   - For App Store: `GET https://itunes.apple.com/lookup?id=<app_id>&country=<country>`
   - For Play Store: google-play-scraper `app()` method equivalent
   - Params: `store` (required, `app_store` | `play_store`), `app_id` (required)
   - Returns: `{ app_id, name, developer, developer_url, description, whats_new, version, size, rating, rating_count, ratings_breakdown, price, free, category, content_rating, screenshots, icon_url, supported_devices, privacy_url, release_date, last_updated, in_app_purchases }`

2. **get_version_history** -- Retrieves the release/version history for an app.
   - For App Store: parses version notes from iTunes API and/or web scraping
   - For Play Store: google-play-scraper patterns or web scraping
   - Params: `store` (required, `app_store` | `play_store`), `app_id` (required)
   - Returns: array of `{ version, release_date, release_notes }` sorted newest first

Both tools use the caching layer keyed on `(store, app_id)`.

## Acceptance Criteria

- [ ] `get_app_details` returns comprehensive metadata for App Store apps via iTunes Lookup API
- [ ] `get_app_details` returns comprehensive metadata for Play Store apps via scraper adapter
- [ ] `get_app_details` normalizes both store responses into a unified schema
- [ ] `get_app_details` includes `ratings_breakdown` (1-5 star distribution) where available
- [ ] `get_version_history` returns chronological release entries for App Store apps
- [ ] `get_version_history` returns chronological release entries for Play Store apps
- [ ] `get_version_history` entries are sorted newest first
- [ ] Both tools validate `store` param against allowed values
- [ ] Both tools return descriptive errors for invalid or not-found `app_id`
- [ ] Results are cached with TTL
- [ ] Unit tests with mocked API/scraper responses for each tool and each store

## Files to Create/Modify

- `mcp-servers/app-store-intel/src/tools/get-app-details.ts`
- `mcp-servers/app-store-intel/src/tools/get-version-history.ts`
- `mcp-servers/app-store-intel/src/index.ts` (register tools)
- `mcp-servers/app-store-intel/tests/tools/get-app-details.test.ts`
- `mcp-servers/app-store-intel/tests/tools/get-version-history.test.ts`
