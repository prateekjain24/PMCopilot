---
id: PMC-062
title: Multi-Competitor Comparison Matrix
phase: 3 - Web Teardown Engine
status: todo
type: script
estimate: 1
dependencies: [PMC-053, PMC-059]
---

## Description
Build the multi-competitor comparison script that aggregates data from multiple individual web teardowns into unified comparison outputs. While a single teardown (PMC-058) analyzes one competitor in depth, this ticket produces side-by-side views across all competitors in a market.

The script takes as input either a list of completed teardown data objects or competitor identifiers that can be loaded from the competitive cache (PMC-060). It produces three distinct comparison outputs:

1. **Feature Matrix** - Uses the feature matrix template (PMC-059) to render a full feature-by-feature comparison across all competitors. The script must merge feature lists from individual teardowns, align feature names (fuzzy matching for slightly different naming), and fill gaps with "unknown" markers.

2. **Pricing Table** - A normalized pricing comparison table that aligns tiers across competitors (Free, Starter/Basic, Pro/Growth, Enterprise), showing price per seat, included features per tier, overage costs, and annual discount percentages.

3. **Positioning Map** - A 2D positioning analysis with configurable axes (default: price vs feature richness). Each competitor is placed on the map with coordinates derived from their pricing and feature count. Output as both a data structure (for programmatic use) and an ASCII-art scatter plot (for terminal rendering).

The script should support incremental updates: when a new competitor teardown is completed, it can be merged into an existing comparison without re-processing all competitors.

## Acceptance Criteria
- [ ] Script accepts a list of teardown data objects or competitor IDs to load from cache
- [ ] Feature matrix output merges features from all competitors using the PMC-059 `generateFeatureMatrix` function
- [ ] Feature name alignment uses fuzzy matching (Levenshtein distance or similar) to reconcile variations like "SSO" vs "Single Sign-On"
- [ ] Pricing table normalizes tiers across competitors into a comparable format with columns for each competitor
- [ ] Pricing table includes: tier name, monthly price, annual price, per-seat indicator, key included features
- [ ] Positioning map calculates coordinates from pricing (x-axis) and feature richness (y-axis) by default
- [ ] Positioning map renders as ASCII scatter plot suitable for terminal display
- [ ] Positioning map axes are configurable (e.g., price vs ease-of-use, feature count vs market share)
- [ ] Incremental update: adding a new competitor to an existing comparison does not require reprocessing existing competitors
- [ ] Output is available as both structured data (TypeScript objects) and rendered markdown
- [ ] Handles edge cases: single competitor (no comparison, just summary), missing pricing data, competitors with very different feature sets
- [ ] Unit tests cover feature merging, fuzzy matching, pricing normalization, positioning calculation, and ASCII rendering

## Files to Create/Modify
- `src/comparison/multi-competitor.ts` - Main comparison orchestrator
- `src/comparison/feature-merger.ts` - Feature list alignment and fuzzy matching logic
- `src/comparison/pricing-normalizer.ts` - Pricing tier normalization across competitors
- `src/comparison/positioning-map.ts` - 2D positioning calculation and ASCII renderer
- `src/comparison/multi-competitor.test.ts` - Unit tests for comparison logic
