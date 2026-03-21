---
id: PMC-086
title: Scaffold app-store-intel MCP server
phase: 4 - App Teardown Engine
status: todo
type: mcp-scaffold
estimate: 1
dependencies: [PMC-002]
---

## Description

Scaffold the `app-store-intel` MCP server at `mcp-servers/app-store-intel/`. This server aggregates app metadata, reviews, rankings, and version history from the Apple App Store and Google Play Store, giving PMs competitive intelligence without leaving their workflow.

The server uses TypeScript + Node.js with STDIO transport. Data sources:
- **Apple App Store**: iTunes Search API (`https://itunes.apple.com/search`, `/lookup`), RSS feeds for rankings
- **Google Play Store**: `google-play-scraper` npm package patterns (or equivalent scraping approach)

**Environment variables:**
- `CACHE_DIR` -- directory for caching API responses (defaults to `${CLAUDE_PLUGIN_DATA}/cache/app-store-intel`)
- `CACHE_TTL_HOURS` -- how long cached responses remain valid (default 24)

The scaffold should include a caching layer that stores JSON responses on disk keyed by a hash of the request parameters, checking TTL before returning cached data. This avoids redundant API calls and rate limiting.

## Acceptance Criteria

- [ ] `mcp-servers/app-store-intel/` directory created with `package.json`, `tsconfig.json`, and entry point
- [ ] TypeScript project compiles and runs with STDIO transport
- [ ] Environment variables `CACHE_DIR` and `CACHE_TTL_HOURS` are read with sensible defaults
- [ ] `CACHE_DIR` is auto-created if it does not exist
- [ ] Disk-based caching layer implemented: stores responses as JSON, keys by hash of request params, respects TTL
- [ ] HTTP client helper with retry logic, rate-limit backoff, and timeout handling
- [ ] Separate adapter modules stubbed for App Store (iTunes API) and Play Store (scraper)
- [ ] Server registers with MCP and responds to `initialize` handshake
- [ ] Unit tests cover caching logic (cache hit, cache miss, cache expiry)
- [ ] `bun install` resolves all dependencies

## Files to Create/Modify

- `mcp-servers/app-store-intel/package.json`
- `mcp-servers/app-store-intel/tsconfig.json`
- `mcp-servers/app-store-intel/src/index.ts`
- `mcp-servers/app-store-intel/src/config.ts`
- `mcp-servers/app-store-intel/src/cache.ts`
- `mcp-servers/app-store-intel/src/http-client.ts`
- `mcp-servers/app-store-intel/src/adapters/app-store.ts`
- `mcp-servers/app-store-intel/src/adapters/play-store.ts`
- `mcp-servers/app-store-intel/tests/cache.test.ts`
- `mcp-servers/app-store-intel/tests/http-client.test.ts`
