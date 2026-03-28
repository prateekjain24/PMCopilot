# PMCopilot Plugin -- End-to-End Test Prompt

Copy this entire prompt and paste it into a Claude Code session running with `claude --plugin-dir .` from the PMCopilot repo root. It will walk through every layer of the plugin and report results.

---

## Instructions for Claude

You are testing the PMCopilot Claude Code plugin. Run each test phase below in order, report PASS/FAIL for each check, and stop if you hit a blocking failure. Be precise -- do not skip any test. After all phases complete, print a summary table.

Create a temporary test directory inside the project for all output: `mkdir -p ./test-output`

IMPORTANT: All test files must be written inside `./test-output/` (project-relative), NOT in `/tmp/`. This ensures hooks can detect file paths correctly.

---

## Phase 0: Plugin Loading

Verify the plugin loaded correctly.

1. List all available slash commands starting with `/pmcopilot:`. Confirm these 13 exist: `competitive-teardown`, `prd`, `sprint-review`, `market-sizing`, `prioritize`, `user-research`, `roadmap`, `experiment`, `stakeholder-update`, `app-store-intel`, `launch-checklist`, `metrics-review`, `setup`. Report any missing.

2. Confirm the 4 custom MCP servers are registered by listing tools matching `mcp__pm-frameworks__*`, `mcp__app-store-intel__*`, `mcp__simulator-bridge__*`, `mcp__emulator-bridge__*`. Report the tool count for each.

3. Check that the SessionStart hooks ran. You should see context injection from `smart-session-start.sh` (PM profile info, or a note that pm-profile.json was not found). Report what you see.

---

## Phase 1: pm-frameworks MCP -- Parameter Accuracy

This is the most critical phase. For each tool, call it with the EXACT parameters shown and verify the response. Read `mcp-servers/pm-frameworks/CLAUDE.md` first for the authoritative parameter reference.

### Test 1.1: rice_score
Call `mcp__pm-frameworks__rice_score` with:
- reach: 5000
- impact: 2
- confidence: 80
- effort: 4

Expected: score should be `(5000 * 2 * (80/100)) / 4 = 2000`. Verify the score is 2000 and the summary mentions "high impact". PASS if score = 2000.

### Test 1.2: rice_batch
Call `mcp__pm-frameworks__rice_batch` with:
```json
{
  "features": [
    {"name": "Push Notifications", "reach": 10000, "impact": 1, "confidence": 90, "effort": 2},
    {"name": "Dark Mode", "reach": 8000, "impact": 0.5, "confidence": 70, "effort": 1},
    {"name": "Export to PDF", "reach": 3000, "impact": 2, "confidence": 60, "effort": 5}
  ]
}
```
Expected: Features should be ranked. Push Notifications should rank #1 (score = 4500). Verify all three features appear with ranks, scores, and stats block.

### Test 1.3: ice_score
Call `mcp__pm-frameworks__ice_score` with:
- impact: 8
- confidence: 7
- ease: 6

Expected: score = 8 * 7 * 6 = 336. Tier should be "Low Priority" (100-399 range). PASS if score = 336.

### Test 1.4: moscow_sort
Call `mcp__pm-frameworks__moscow_sort` with:
```json
{
  "features": [
    {"name": "User Auth", "category": "must", "effort_estimate": 15},
    {"name": "Dashboard", "category": "must", "effort_estimate": 20},
    {"name": "Notifications", "category": "should", "effort_estimate": 8},
    {"name": "Dark Mode", "category": "could", "effort_estimate": 3},
    {"name": "Legacy API", "category": "wont", "effort_estimate": 10}
  ]
}
```
Expected: Features sorted into 4 buckets. Must Have effort = 35 days, which is 35/(15+20+8+3) = 76% of active effort. This should trigger a warning about exceeding 60% Must Have threshold. PASS if warning is present.

### Test 1.5: kano_classify
Call `mcp__pm-frameworks__kano_classify` with:
- functional: "like"
- dysfunctional: "neutral"

Expected: category = "Attractive". PASS if correct.

### Test 1.6: kano_batch
Call `mcp__pm-frameworks__kano_batch` with:
```json
{
  "features": [
    {
      "name": "Instant Checkout",
      "responses": [
        {"functional": "like", "dysfunctional": "dislike"},
        {"functional": "like", "dysfunctional": "dislike"},
        {"functional": "expect", "dysfunctional": "dislike"},
        {"functional": "like", "dysfunctional": "neutral"},
        {"functional": "like", "dysfunctional": "dislike"}
      ]
    }
  ]
}
```
Expected: Dominant category should be "One-dimensional" (3 out of 5 responses are like/dislike). Confidence should be "Moderate" (60%). Verify distribution percentages add up to 100%.

### Test 1.7: tam_sam_som
Call `mcp__pm-frameworks__tam_sam_som` with:
- total_market: 50000000000
- serviceable_pct: 12
- obtainable_pct: 8
- methodology: "top_down"

Expected: TAM = $50B, SAM = $6B (12% of 50B), SOM = $480M (8% of 6B). Verify methodology appears as "top-down" in summary. PASS if SAM = 6000000000 and SOM = 480000000.

CRITICAL CHECK: Do NOT pass `total_market_size` (wrong name). Do NOT pass `serviceable_pct: 0.12` (wrong scale). Do NOT omit `methodology` (required).

### Test 1.8: weighted_score
Call `mcp__pm-frameworks__weighted_score` with:
```json
{
  "features": [
    {"name": "Feature A", "scores": {"revenue": 9, "feasibility": 4, "user_need": 7}},
    {"name": "Feature B", "scores": {"revenue": 5, "feasibility": 9, "user_need": 8}}
  ],
  "weights": {"revenue": 50, "feasibility": 20, "user_need": 30}
}
```
Expected: Feature A weighted score = (9*50 + 4*20 + 7*30)/100 = 7.4. Feature B = (5*50 + 9*20 + 8*30)/100 = 6.7. Feature A should rank #1. PASS if Feature A ranks higher.

### Test 1.9: opportunity_score
Call `mcp__pm-frameworks__opportunity_score` with:
```json
{
  "features": [
    {"name": "Payment Speed", "importance": 9, "satisfaction": 4},
    {"name": "App Design", "importance": 6, "satisfaction": 7},
    {"name": "Receipt Download", "importance": 8, "satisfaction": 3}
  ]
}
```
Expected: Payment Speed: score = 9 + max(9-4, 0) = 14 (Appropriately Served). Receipt Download: score = 8 + max(8-3, 0) = 13 (Appropriately Served). App Design: score = 6 + max(6-7, 0) = 6 (Overserved). Receipt Download or Payment Speed should rank #1.

### Test 1.10: cost_of_delay
Call `mcp__pm-frameworks__cost_of_delay` with:
```json
{
  "features": [
    {"name": "Compliance Fix", "duration_weeks": 2, "regulatory_risk": 50000, "revenue_lost": 0},
    {"name": "New Checkout", "duration_weeks": 6, "revenue_lost": 20000, "competitive_erosion": 5000}
  ]
}
```
Expected: Compliance Fix CD3 = 50000/2 = 25000. New Checkout CD3 = 25000/6 = 4167. Compliance Fix should rank #1 (highest urgency). PASS if ranking is correct.

### Test 1.11: sample_size_calc
Call `mcp__pm-frameworks__sample_size_calc` with:
- baseline_rate: 0.05
- mde: 0.20

(Use defaults for significance and power: 0.95 and 0.80)

Expected: Should return a sample_size_per_variant (expected somewhere around 3500-4000 range for these inputs). Verify total_sample_size = 2 * sample_size_per_variant. PASS if numbers are sensible.

CRITICAL CHECK: Do NOT pass `significance: 0.05` (that would fail -- it means confidence level here, not alpha).

### Test 1.12: significance_test
Call `mcp__pm-frameworks__significance_test` with:
- control_visitors: 10000
- control_conversions: 500
- variant_visitors: 10000
- variant_conversions: 600

Expected: control_rate = 0.05, variant_rate = 0.06, relative lift = 20%. Should be statistically significant at p < 0.05. Verify `significant: true`. PASS if significant is true.

---

## Phase 2: app-store-intel MCP

### Test 2.1: search_app_store
Call `mcp__app-store-intel__search_app_store` with:
- query: "Grab"
- country: "sg"
- limit: 5

Expected: Should return a list of apps. Verify at least one result contains "Grab" in the name. PASS if results are returned.

### Test 2.2: get_app_details
Call `mcp__app-store-intel__get_app_details` with:
- store: "app_store"
- app_id: "647268330"

(This is Grab's Apple ID. Note: NOT 1018689184 which is an old/different listing.)

Expected: Should return detailed metadata including name, rating, version, description. Verify `name` contains "Grab". PASS if valid details returned.

### Test 2.3: get_app_reviews
Call `mcp__app-store-intel__get_app_reviews` with:
- store: "app_store"
- app_id: "647268330"
- country: "sg"
- count: 10
- sort: "most_recent"

NOTE: The `country` parameter is important. Use "sg" for Grab since that is where it is most popular and has the most reviews. Using "us" will likely return empty results for region-specific apps.

Expected: Should return up to 10 reviews with author, rating, text fields. PASS if at least 1 review returned. If 0 reviews returned, it may be an Apple RSS feed availability issue (not a bug in the tool).

### Test 2.4: get_review_sentiment
Call `mcp__app-store-intel__get_review_sentiment` with:
- store: "app_store"
- app_id: "647268330"
- country: "sg"
- sample_size: 50

NOTE: Pass `country: "sg"` to match the region used in 2.3.

Expected: Should return sentiment breakdown (positive/negative/neutral percentages) and themes. PASS if percentages sum to approximately 100%.

### Test 2.5: compare_apps
Call `mcp__app-store-intel__compare_apps` with:
```json
{
  "app_ids": [
    {"store": "app_store", "app_id": "647268330"},
    {"store": "app_store", "app_id": "944875099"}
  ]
}
```
(Grab vs Gojek on App Store)

Expected: Should return side-by-side comparison with ratings, categories, etc. PASS if both apps appear in results.

### Test 2.6: get_category_rankings
Call `mcp__app-store-intel__get_category_rankings` with:
- store: "app_store"
- category: "social-networking"
- country: "us"
- type: "free"

NOTE: Use "social-networking" / "us" which is a well-populated category. The "travel" / "sg" combo previously failed because the Apple RSS feed does not reliably serve genre-filtered results for all country/genre combinations. The tool now includes a fallback to unfiltered rankings, but using a popular category improves reliability.

Expected: Should return a ranked list of apps. PASS if results returned.

---

## Phase 3: Hooks Verification

### Test 3.1: PRD Quality Gate (PostToolUse agent hook)
Write a deliberately incomplete PRD file INSIDE the project directory (hooks may not fire for files outside the project):

```
Write a file called ./test-output/test-prd.md with this content:

# PRD: New Feature

## Goals
- Make the app better
- Increase engagement

## User Stories
- Users should be able to do the thing

## Requirements
- TBD
```

IMPORTANT: The file path MUST contain "prd" in the name and MUST be inside the project directory (not /tmp/). The hook matches `Write(*prd*)`.

After writing this file, the PRD Quality Gate hook should fire. Check if the hook provides feedback about: missing metrics on goals, missing non-goals section, missing edge cases, malformed user stories, TBD placeholder, missing dependencies. PASS if the hook fires and flags at least 3 issues.

### Test 3.2: Citation Verifier (Stop hook)
After completing Phase 2 tests above, the Stop hook (Citation Verifier) should have been active. Note whether it flagged any uncited claims in your responses. This hook should allow responses that properly cite their sources (e.g., "per app-store-intel results") and flag responses with uncited data claims. Report whether the hook is firing.

---

## Phase 4: Commands (Smoke Tests)

These test that commands load and begin execution correctly. You do not need to complete multi-step wizards.

### Test 4.1: /pmcopilot:setup
Run `/pmcopilot:setup`. Verify it starts the onboarding wizard and asks about name/role. You can exit after the first question -- just confirm the command loads and the prompt is conversational. PASS if wizard starts.

### Test 4.2: /pmcopilot:prioritize
Run `/pmcopilot:prioritize "Push Notifications, Dark Mode, Export to PDF, Search Improvements, Onboarding Revamp" --framework rice`. Verify it starts gathering RICE inputs or asks clarifying questions. PASS if the command loads and engages with the feature list.

### Test 4.3: /pmcopilot:market-sizing
Run `/pmcopilot:market-sizing "ride-hailing market in Southeast Asia"`. Verify it begins researching or asks about methodology/scope. PASS if the command loads.

### Test 4.4: /pmcopilot:experiment
Run `/pmcopilot:experiment "Adding a tip prompt after ride completion"`. Verify it starts designing an A/B test (hypothesis, metrics, etc.). PASS if the command loads and begins structuring the experiment.

### Test 4.5: /pmcopilot:launch-checklist
Run `/pmcopilot:launch-checklist "GrabPay Crypto Wallet" --type soft`. Verify it starts generating a categorized checklist. PASS if the command loads.

---

## Phase 5: Cross-Integration Checks

### Test 5.1: pm-frameworks used by prioritize skill
After running /pmcopilot:prioritize in Test 4.2, check whether the command internally calls pm-frameworks MCP tools (rice_score or rice_batch). The prioritize skill's allowed-tools should include pm-frameworks MCP. Report whether the integration works.

### Test 5.2: app-store-intel used by app-store-intel command
Run `/pmcopilot:app-store-intel "Grab vs Gojek vs Bolt"`. Verify it uses the app-store-intel MCP tools (search, details, reviews, compare). PASS if MCP tools are called.

---

## Summary

After all phases complete, print a results table:

```
| Phase | Test | Result | Notes |
|-------|------|--------|-------|
| 0     | Plugin Loading | ... | ... |
| 1.1   | rice_score | ... | ... |
...
```

Count totals: X passed, Y failed, Z skipped.

For any failures, note the exact error message and which parameter or component caused the issue. This helps us debug quickly.
