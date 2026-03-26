# Shared TypeScript Utilities

Reusable TypeScript modules used by skills and orchestration logic. Not an MCP server — these are imported directly.

## Directory Map

### `cache/`
- **competitive-cache.ts** — TTL-based disk cache for competitive intel (default: 7 days for data, indefinite for screenshots)
- **rate-limiter.ts** — Token bucket rate limiter for web requests
- **robots-parser.ts** — Parse and enforce `robots.txt` rules before crawling

### `comparison/`
- **feature-merger.ts** — Consolidate feature lists across competitors using Levenshtein fuzzy matching (>80% similarity = same feature)
- **multi-competitor.ts** — Orchestrate comparison across N competitors
- **positioning-map.ts** — Generate 2D positioning maps from feature/pricing data
- **pricing-normalizer.ts** — Normalize pricing plans to monthly USD for comparison

### `templates/`
- **feature-matrix.ts** — Generate HTML/Markdown feature comparison tables
- **teardown-report.ts** — Format competitive teardown reports with screenshots

### `skills/market-sizing/`
- **web-research.ts** — Integration with Perplexity (via n8n) for market data
- **cross-validation.ts** — Validate TAM/SAM/SOM estimates using multiple data sources
