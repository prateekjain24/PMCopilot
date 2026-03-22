---
id: PMC-090
title: App store rankings, comparison, and tracking tools
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-086]
---

## Description

Implement the rankings, comparison, similarity, and rating tracking tools for the app-store-intel MCP server. These tools round out the competitive intelligence suite, letting PMs analyze category standings, benchmark apps side-by-side, discover alternatives, and track rating trends over time.

**Tools:**

1. **get_category_rankings** -- Retrieves top apps in a category.
   - For App Store: RSS feed at `https://rss.applemarketingtools.com/api/v2/<country>/apps/top-<type>/<limit>/<category>.json`
   - For Play Store: scraper category listing
   - Params: `store` (required), `category` (required -- e.g. `PRODUCTIVITY`, `SOCIAL_NETWORKING`), `country` (optional, default `us`), `type` (optional, `free` | `paid` | `grossing`, default `free`)
   - Returns: array of `{ rank, app_id, name, developer, rating, icon_url }`

2. **compare_apps** -- Side-by-side comparison of multiple apps on selected metrics.
   - Internally calls `get_app_details` for each app and assembles a comparison table.
   - Params: `app_ids` (required, array of `{ store, app_id }`), `metrics` (optional, array of metric names to include -- defaults to all: `rating`, `rating_count`, `price`, `size`, `last_updated`, `version`, `category`)
   - Returns: `{ metrics: string[], apps: [{ app_id, name, store, values: { [metric]: value } }] }`

3. **get_similar_apps** -- Finds apps similar to a given app.
   - For Play Store: google-play-scraper `similar()` method equivalent
   - For App Store: combines category + keyword search heuristic
   - Params: `store` (required), `app_id` (required)
   - Returns: array of `{ app_id, name, developer, rating, icon_url }`

4. **track_rating_history** -- Returns historical rating data points for an app over a time period.
   - Uses cached snapshots: each time `get_app_details` is called, the rating is stored with a timestamp. This tool reads from that history.
   - For initial use (no history), returns the current rating as a single data point and explains that history will accumulate over time.
   - Params: `store` (required), `app_id` (required), `period` (optional, `7d` | `30d` | `90d` | `all`, default `30d`)
   - Returns: `{ app_id, store, data_points: [{ date, rating, rating_count }], period }`

## Acceptance Criteria

- [ ] `get_category_rankings` returns ranked app list for App Store via RSS/marketing tools API
- [ ] `get_category_rankings` returns ranked app list for Play Store via scraper
- [ ] `get_category_rankings` supports `free`, `paid`, and `grossing` list types
- [ ] `compare_apps` fetches details for all requested apps and assembles comparison table
- [ ] `compare_apps` handles mixed stores (some App Store, some Play Store) in a single call
- [ ] `compare_apps` filters to only requested metrics when `metrics` param is provided
- [ ] `get_similar_apps` returns similar apps from Play Store
- [ ] `get_similar_apps` returns similar apps from App Store using category/keyword heuristic
- [ ] `track_rating_history` reads from accumulated rating snapshots in cache
- [ ] `track_rating_history` filters data points by the requested period
- [ ] `track_rating_history` handles first-time use gracefully (returns single current data point)
- [ ] All tools validate `store` param against allowed values
- [ ] Results are cached with TTL (except `track_rating_history` which reads historical cache)
- [ ] Unit tests with mocked responses for each tool

## Files to Create/Modify

- `mcp-servers/app-store-intel/src/tools/get-category-rankings.ts`
- `mcp-servers/app-store-intel/src/tools/compare-apps.ts`
- `mcp-servers/app-store-intel/src/tools/get-similar-apps.ts`
- `mcp-servers/app-store-intel/src/tools/track-rating-history.ts`
- `mcp-servers/app-store-intel/src/helpers/rating-store.ts`
- `mcp-servers/app-store-intel/src/index.ts` (register tools)
- `mcp-servers/app-store-intel/tests/tools/get-category-rankings.test.ts`
- `mcp-servers/app-store-intel/tests/tools/compare-apps.test.ts`
- `mcp-servers/app-store-intel/tests/tools/get-similar-apps.test.ts`
- `mcp-servers/app-store-intel/tests/tools/track-rating-history.test.ts`
