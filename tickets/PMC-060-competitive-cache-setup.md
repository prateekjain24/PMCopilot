---
id: PMC-060
title: Competitive Intelligence Cache Setup
phase: 3 - Web Teardown Engine
status: done
type: infra
estimate: 1
dependencies: [PMC-053]
---

## Description
Set up the cache directory structure and TTL-based cache management logic within `${CLAUDE_PLUGIN_DATA}` for storing competitive intelligence artifacts. The cache ensures that repeated teardowns and comparisons do not redundantly fetch the same data, while respecting freshness requirements that vary by content type.

The cache directory structure under `${CLAUDE_PLUGIN_DATA}/competitive-cache/` should be:
```
competitive-cache/
  html/          # HTML snapshots of competitor pages
  screenshots/   # Screenshots of competitor flows
  pricing/       # Pricing data snapshots
  blog/          # Blog/changelog content
  metadata.json  # Cache index with timestamps and TTLs
```

TTL policies by content type:
- **HTML snapshots**: 7 days - competitor pages change infrequently
- **Screenshots**: indefinite (no expiry) - visual references remain useful as historical record
- **Pricing data**: 7 days (weekly refresh) - pricing changes are strategic signals
- **Blog/changelog content**: 1 day (daily refresh) - blog posts indicate active development

Rate limiting rules that the cache layer must enforce:
- Minimum 2 seconds between navigation requests to any single domain
- Maximum 50 pages per competitor per teardown session
- Respect `robots.txt` directives (store parsed robots.txt per domain, refresh weekly)

The cache manager should provide: `get(key, type)`, `set(key, type, data)`, `isValid(key, type)`, `invalidate(key, type)`, `pruneExpired()`, and `getCacheStats()`.

## Acceptance Criteria
- [ ] Cache root directory created at `${CLAUDE_PLUGIN_DATA}/competitive-cache/` with subdirectories for html, screenshots, pricing, blog
- [ ] `metadata.json` index tracks cache entries with key, type, timestamp, TTL, file path, and size
- [ ] `CacheManager` class implements `get`, `set`, `isValid`, `invalidate`, and `pruneExpired` methods
- [ ] TTL enforcement: HTML snapshots expire after 7 days, screenshots never expire, pricing expires after 7 days, blog content expires after 1 day
- [ ] `pruneExpired()` removes stale entries from disk and updates metadata
- [ ] `getCacheStats()` returns total entries, total size, entries by type, and count of expired entries
- [ ] Rate limiter enforces 2-second minimum delay between requests to the same domain
- [ ] Rate limiter enforces 50-page maximum per competitor per session
- [ ] `robots.txt` parser fetches, caches (7-day TTL), and checks rules before allowing page fetch
- [ ] Cache keys are deterministic and collision-free (based on URL hash + type)
- [ ] File I/O errors are handled gracefully (missing dirs recreated, corrupted metadata rebuilt)
- [ ] Unit tests cover TTL expiry logic, rate limiting, robots.txt parsing, and cache CRUD operations

## Files to Create/Modify
- `src/cache/competitive-cache.ts` - CacheManager class with TTL logic and directory management
- `src/cache/rate-limiter.ts` - Domain-aware rate limiter with per-session page counters
- `src/cache/robots-parser.ts` - robots.txt fetcher, parser, and rule checker
- `src/cache/competitive-cache.test.ts` - Unit tests for cache manager
- `src/cache/rate-limiter.test.ts` - Unit tests for rate limiter
