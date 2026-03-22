---
id: PMC-089
title: App store reviews and sentiment tools
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-086]
---

## Description

Implement the reviews and sentiment analysis tools for the app-store-intel MCP server. These tools let PMs pull user reviews with filtering and sorting, and get an automated sentiment summary -- core inputs for understanding user perception and identifying pain points.

**Tools:**

1. **get_app_reviews** -- Fetches user reviews for an app.
   - For App Store: RSS feed at `https://itunes.apple.com/rss/customerreviews/id=<app_id>/sortBy=<sort>/json` or equivalent API
   - For Play Store: google-play-scraper `reviews()` method equivalent
   - Params: `store` (required, `app_store` | `play_store`), `app_id` (required), `count` (optional, default 50, max 500), `sort` (optional, `most_recent` | `most_helpful`, default `most_recent`), `rating_filter` (optional, 1-5 integer to filter by star rating)
   - Returns: array of `{ review_id, author, rating, title, text, date, version, helpful_count }`

2. **get_review_sentiment** -- Analyzes sentiment across a sample of reviews.
   - Fetches a sample of reviews internally (reuses get_app_reviews logic), then computes sentiment metrics using keyword/pattern analysis (no external AI API dependency).
   - Params: `store` (required, `app_store` | `play_store`), `app_id` (required), `sample_size` (optional, default 100)
   - Returns: `{ overall_sentiment (positive/neutral/negative), sentiment_score (-1.0 to 1.0), positive_pct, negative_pct, neutral_pct, top_positive_themes[], top_negative_themes[], sample_size_actual }`
   - Theme extraction uses keyword frequency analysis on review text, grouping related terms (e.g. "crash", "freeze", "hang" -> "stability issues")

## Acceptance Criteria

- [ ] `get_app_reviews` fetches reviews from App Store via RSS/API
- [ ] `get_app_reviews` fetches reviews from Play Store via scraper adapter
- [ ] `get_app_reviews` supports `sort` parameter (most_recent, most_helpful)
- [ ] `get_app_reviews` supports `rating_filter` to return only reviews of a specific star rating
- [ ] `get_app_reviews` clamps `count` to 1-500 range
- [ ] `get_review_sentiment` computes sentiment score from review text using keyword/pattern analysis
- [ ] `get_review_sentiment` extracts top positive and negative themes via keyword frequency grouping
- [ ] `get_review_sentiment` handles apps with very few reviews gracefully (adjusts sample_size_actual)
- [ ] Both tools validate `store` param against allowed values
- [ ] Results are cached with TTL
- [ ] Unit tests with mocked review data for each tool and each store
- [ ] Sentiment analysis tests verify correct classification on known positive/negative review samples

## Files to Create/Modify

- `mcp-servers/app-store-intel/src/tools/get-app-reviews.ts`
- `mcp-servers/app-store-intel/src/tools/get-review-sentiment.ts`
- `mcp-servers/app-store-intel/src/helpers/sentiment.ts`
- `mcp-servers/app-store-intel/src/index.ts` (register tools)
- `mcp-servers/app-store-intel/tests/tools/get-app-reviews.test.ts`
- `mcp-servers/app-store-intel/tests/tools/get-review-sentiment.test.ts`
- `mcp-servers/app-store-intel/tests/helpers/sentiment.test.ts`
