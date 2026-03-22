---
id: PMC-067
title: MoSCoW Sort Tool
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-063]
---

## Description
Implement the MoSCoW prioritization framework as an MCP tool within the pm-frameworks server. MoSCoW sorts features into four priority buckets based on business constraints like time, budget, and resource availability.

**MoSCoW categories:**
- **Must have (Mo)**: Non-negotiable requirements. Without these, the product/release is not viable. Typically legal requirements, core functionality for MVP, or contractual obligations.
- **Should have (S)**: Important features that are not critical for launch but should be included if at all possible. Workarounds may exist.
- **Could have (Co)**: Desirable features that improve user experience or polish but can be dropped without significant impact. First to be descoped under pressure.
- **Won&apos;t have (W)**: Features explicitly deprioritized for this iteration. Documenting these is valuable for managing stakeholder expectations and planning future releases.

The `moscow_sort` tool takes a list of features (each with name, description, and optional metadata like estimated effort and business value) along with a constraints object (available time, team size, total budget, or a simple effort cap). It returns features sorted into the four MoSCoW buckets.

The sorting logic should use a heuristic approach: features are initially sorted by a composite score of business value and urgency, then allocated to buckets based on cumulative effort vs constraint capacity. Must-haves consume up to ~60% of capacity, Should-haves up to ~80%, Could-haves up to ~100%, and anything beyond becomes a Won&apos;t-have.

The tool should also accept pre-assigned categories (when a PM has already decided certain features are Must-haves) and sort only the unassigned features.

## Acceptance Criteria
- [ ] `moscow_sort` tool registered with parameters: `features` (array of `{ name: string, description?: string, effort?: number, value?: number, category?: string }`), `constraints` (object with `total_effort_budget: number`)
- [ ] Features with pre-assigned categories are placed directly into their designated bucket
- [ ] Unassigned features are scored by `value / effort` ratio (defaulting to equal weight if either is missing) and sorted descending
- [ ] Allocation logic: Must-haves fill to ~60% of total effort budget, Should-haves to ~80%, Could-haves to ~100%, remainder becomes Won&apos;t-have
- [ ] Allocation percentages are configurable via optional `thresholds` parameter (default: `{ must: 0.6, should: 0.8, could: 1.0 }`)
- [ ] Returns: `{ must_have: Feature[], should_have: Feature[], could_have: Feature[], wont_have: Feature[], summary: { total_effort: number, budget_used_pct: number, feature_counts: Record<string, number> } }`
- [ ] Each feature in the result includes its assigned category and the running effort total at that point
- [ ] Summary includes total effort allocated, percentage of budget used by must+should, and count per bucket
- [ ] Human-readable output explains the sort rationale (e.g., "Feature X placed in Should-have: high value (8/10) but budget was 72% consumed after Must-haves")
- [ ] Handles edge cases: no constraints provided (sorts by value/effort ratio only, all placed in Must-have), all features pre-assigned, zero-effort features
- [ ] Unit tests cover: basic sort, pre-assigned categories, custom thresholds, edge cases, missing effort/value defaults

## Files to Create/Modify
- `mcp-servers/pm-frameworks/src/tools/moscow.ts` - MoSCoW sort tool implementation
- `mcp-servers/pm-frameworks/src/tools/moscow.test.ts` - Unit tests
- `mcp-servers/pm-frameworks/src/tools/index.ts` - Register MoSCoW tool in barrel export
