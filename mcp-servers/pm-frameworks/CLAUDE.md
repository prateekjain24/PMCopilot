# pm-frameworks MCP Server -- Tool Reference

12 pure-computation tools for PM frameworks. No external dependencies, no API calls -- all calculations run locally.

This file is the authoritative reference for all 12 tools. When calling any tool, use EXACTLY the parameter names, types, and allowed values documented here. Do not guess parameter names.

Tools are invoked as `mcp__pm-frameworks__<tool_name>`.

## Code Layout

```
src/
  index.ts                  # FastMCP server setup, registers all tools
  types.ts                  # Shared types (ValidationError, etc.)
  utils/validation.ts       # validateRange, validatePositive, roundTo
  tools/
    rice.ts + rice.test.ts
    ice.ts + ice.test.ts
    kano.ts + kano.test.ts
    moscow.ts + moscow.test.ts
    weighted-score.ts + weighted-score.test.ts
    opportunity-score.ts + opportunity-score.test.ts
    cost-of-delay.ts + cost-of-delay.test.ts
    tam-sam-som.ts + tam-sam-som.test.ts
    sample-size-calc.ts + sample-size-calc.test.ts
    significance-test.ts + significance-test.test.ts
    index.ts              # Barrel export
```

## Testing

```bash
bun test    # Runs all co-located .test.ts files
```

---

## Prioritization Frameworks

### rice_score

Calculate a single RICE prioritization score.

Formula: `score = (reach * impact * (confidence / 100)) / effort`

| Parameter | Type | Required | Range / Allowed Values | Description |
|-----------|------|----------|----------------------|-------------|
| reach | number | yes | >= 0 | Number of users reached per time period |
| impact | number | yes | Standard scale: 0.25, 0.5, 1, 2, 3 (custom values accepted with warning) | Impact per user. 0.25=minimal, 0.5=low, 1=medium, 2=high, 3=massive |
| confidence | number | yes | 0--100 | Confidence as a percentage. NOT 0--1. Use 80 not 0.8 |
| effort | number | yes | > 0 | Effort in person-months. Must be strictly positive |

Returns: `{ score, reach, impact, confidence, effort, summary, warnings? }`

COMMON MISTAKE: `confidence` is 0--100 (percentage), not 0--1 (fraction).

---

### rice_batch

Score multiple features at once, ranked by RICE score descending.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| features | array | yes | Min 1 item. Each item is an object (see below) |

Each feature object:

| Field | Type | Required | Range | Description |
|-------|------|----------|-------|-------------|
| name | string | yes | -- | Feature name |
| reach | number | yes | >= 0 | Users reached |
| impact | number | yes | Standard: 0.25, 0.5, 1, 2, 3 | Impact per user |
| confidence | number | yes | 0--100 | Confidence percentage |
| effort | number | yes | > 0 | Person-months |

Returns: `{ features: [{ rank, name, score, params }], stats: { mean, median, min, max }, summary, warnings? }`

---

### ice_score

Calculate an ICE prioritization score.

Formula: `score = impact * confidence * ease` (all on 1--10 scale, max score = 1000)

| Parameter | Type | Required | Range | Description |
|-----------|------|----------|-------|-------------|
| impact | number | yes | 1--10 | How much will this move the target metric? |
| confidence | number | yes | 1--10 | How confident are you in impact and ease estimates? |
| ease | number | yes | 1--10 | How easy to implement? 10=trivial, 1=extremely hard |

Returns: `{ score, impact, confidence, ease, tier, summary, warnings? }`

Tier classification: 700--1000 = High Priority, 400--699 = Medium Priority, 100--399 = Low Priority, 1--99 = Deprioritize.

COMMON MISTAKE: All three params are 1--10 integers. Not percentages, not 0--1 fractions.

---

### moscow_sort

Categorize features into MoSCoW priority buckets.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| features | array | yes | Min 1 item. Each item is an object (see below) |

Each feature object:

| Field | Type | Required | Allowed Values | Description |
|-------|------|----------|----------------|-------------|
| name | string | yes | -- | Feature name |
| category | string | yes | `"must"`, `"should"`, `"could"`, `"wont"` | MoSCoW bucket. Lowercase, no spaces |
| effort_estimate | number | no (default 0) | >= 0 | Effort in person-days |

Returns: `{ buckets: { must: {...}, should: {...}, could: {...}, wont: {...} }, effort_summary: { must_pct, should_pct, could_pct }, summary, warnings? }`

Warns if Must Have items consume more than 60% of total effort (violates the 60/20/20 rule).

COMMON MISTAKE: Category values are lowercase abbreviations: `"must"`, `"should"`, `"could"`, `"wont"`. NOT `"Must Have"`, not `"M"`.

---

### weighted_score

Score features against custom weighted criteria.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| features | array | yes | Min 1 item. Each item has `name` (string) and `scores` (object) |
| weights | object | yes | Keys = criterion names, values = weight numbers. Should sum to 100 |

Each feature object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | yes | Feature name |
| scores | object | yes | Keys = criterion names (must match keys in `weights`), values = numeric scores |

Example call:
```json
{
  "features": [
    { "name": "Feature A", "scores": { "revenue_impact": 8, "user_demand": 9, "dev_effort": 3 } },
    { "name": "Feature B", "scores": { "revenue_impact": 5, "user_demand": 7, "dev_effort": 8 } }
  ],
  "weights": { "revenue_impact": 40, "user_demand": 35, "dev_effort": 25 }
}
```

Returns: `{ features: [{ rank, name, weighted_score, per_criteria_breakdown }], criteria_weights, summary, warnings? }`

If weights do not sum to 100, they are auto-normalized with a warning.

---

### opportunity_score

Calculate Outcome-Driven Innovation (ODI) opportunity scores.

Formula: `score = importance + max(importance - satisfaction, 0)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| features | array | yes | Min 1 item. Each item is an object (see below) |

Each feature object:

| Field | Type | Required | Range | Description |
|-------|------|----------|-------|-------------|
| name | string | yes | -- | Feature or job-to-be-done name |
| importance | number | yes | 1--10 | How important to the user |
| satisfaction | number | yes | 1--10 | How satisfied with current solutions |

Returns: `{ features: [{ rank, name, importance, satisfaction, gap, score, classification }], summary }`

Classification: score > 15 = Underserved, 12--15 = Appropriately Served, < 12 = Overserved.

---

### cost_of_delay

Calculate Cost of Delay / Duration (CD3) for WSJF-style prioritization.

Formula: `cost_of_delay = revenue_lost + churn_risk + competitive_erosion + regulatory_risk` (all per week in dollars). `cd3 = cost_of_delay / duration_weeks`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| features | array | yes | Min 1 item. Each item is an object (see below) |

Each feature object:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| name | string | yes | -- | Feature name |
| duration_weeks | number | yes | -- | Estimated duration in weeks. Must be > 0 |
| revenue_lost | number | no | 0 | Revenue lost per week of delay ($) |
| churn_risk | number | no | 0 | Churn risk cost per week ($) |
| competitive_erosion | number | no | 0 | Competitive erosion cost per week ($) |
| regulatory_risk | number | no | 0 | Regulatory risk cost per week ($) |

Returns: `{ features: [{ rank, name, duration_weeks, cost_of_delay, cd3, cost_breakdown }], summary }`

Ranked by CD3 descending (highest urgency first).

---

## Kano Model

### kano_classify

Classify a single Kano response pair.

| Parameter | Type | Required | Allowed Values | Description |
|-----------|------|----------|----------------|-------------|
| functional | string | yes | `"like"`, `"expect"`, `"neutral"`, `"live_with"`, `"dislike"` | How user feels if feature IS present |
| dysfunctional | string | yes | `"like"`, `"expect"`, `"neutral"`, `"live_with"`, `"dislike"` | How user feels if feature IS NOT present |

Returns: `{ category, functional, dysfunctional, description }`

Categories: Attractive, One-dimensional, Must-be, Indifferent, Reverse, Questionable.

COMMON MISTAKE: Use `"live_with"` (with underscore). NOT `"tolerate"`, not `"liveWith"`, not `"live with"`.

---

### kano_batch

Classify multiple features with multiple respondents each.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| features | array | yes | Min 1 item. Each item is an object (see below) |

Each feature object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | yes | Feature name |
| responses | array | yes | Min 1 item. Each: `{ functional, dysfunctional }` using the same 5 allowed values as kano_classify |

Returns: `{ features: [{ name, dominant_category, distribution, confidence, respondent_count }] }`

Confidence: >60% dominant = Strong, 40--60% = Moderate, <40% = Weak.

---

## Market Sizing

### tam_sam_som

Calculate TAM, SAM, and SOM market sizes.

| Parameter | Type | Required | Allowed Values | Description |
|-----------|------|----------|----------------|-------------|
| total_market | number | yes | >= 0 | Total Addressable Market in dollars |
| serviceable_pct | number | yes | 0--100 | Percentage of TAM that is serviceable |
| obtainable_pct | number | yes | 0--100 | Percentage of SAM that is obtainable |
| methodology | string | yes | `"top_down"`, `"bottom_up"`, `"analogous"` | Market sizing methodology |

Returns: `{ tam, sam, som, methodology, ratios: { sam_to_tam, som_to_sam, som_to_tam }, summary }`

COMMON MISTAKE: `serviceable_pct` and `obtainable_pct` are 0--100 percentages. Use `15` for 15%, NOT `0.15`.

COMMON MISTAKE: The parameter is `total_market`, NOT `total_market_size`, NOT `tam`.

COMMON MISTAKE: `methodology` is required. Do not omit it.

---

## Experimentation

### sample_size_calc

Calculate required sample size for an A/B test using two-proportion z-test.

| Parameter | Type | Required | Default | Allowed Values | Description |
|-----------|------|----------|---------|----------------|-------------|
| baseline_rate | number | yes | -- | 0--1 (e.g. 0.05 for 5%) | Current conversion rate as a decimal fraction |
| mde | number | yes | -- | e.g. 0.10 for 10% relative lift | Minimum detectable effect as a relative change |
| significance | number | no | 0.95 | Only: 0.80, 0.85, 0.90, 0.95, 0.975, 0.99, 0.995 | Confidence level. NOT alpha |
| power | number | no | 0.80 | Only: 0.80, 0.85, 0.90, 0.95, 0.975, 0.99, 0.995 | Statistical power |

Returns: `{ sample_size_per_variant, total_sample_size, baseline_rate, expected_variant_rate, absolute_effect, significance, power, summary }`

COMMON MISTAKE: `significance` here means confidence level (e.g. 0.95 for 95% confidence). It is NOT alpha (0.05). Passing 0.05 WILL fail with an error.

COMMON MISTAKE: Only the exact discrete values listed above are supported for `significance` and `power`. Passing 0.9999 or 0.7 will throw an error.

---

### significance_test

Run a two-proportion z-test on completed A/B experiment results.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| control_visitors | integer | yes | -- | Visitors in control group. >= 1 |
| control_conversions | integer | yes | -- | Conversions in control. >= 0, must be <= control_visitors |
| variant_visitors | integer | yes | -- | Visitors in variant group. >= 1 |
| variant_conversions | integer | yes | -- | Conversions in variant. >= 0, must be <= variant_visitors |
| significance_level | number | no | 0.05 | Alpha level. Range: 0.001--0.5. Typical: 0.05 for 95% confidence |

Returns: `{ control_rate, variant_rate, relative_lift, absolute_lift, z_score, p_value, significant, confidence_interval: { lower, upper }, interpretation }`

NOTE: Unlike `sample_size_calc`, this tool's `significance_level` IS alpha (0.05 = 95% confidence), not the confidence level. The naming convention differs between the two experimentation tools.

---

## Quick Reference: Parameter Pitfalls

| Pitfall | Wrong | Correct |
|---------|-------|---------|
| RICE confidence | `confidence: 0.8` | `confidence: 80` |
| ICE scale | `impact: 80` | `impact: 8` |
| MoSCoW category | `"Must Have"` | `"must"` |
| Kano response | `"tolerate"` | `"live_with"` |
| TAM parameter name | `total_market_size` | `total_market` |
| TAM percentages | `serviceable_pct: 0.15` | `serviceable_pct: 15` |
| TAM methodology | _(omitted)_ | `methodology: "top_down"` (required) |
| Sample size significance | `significance: 0.05` | `significance: 0.95` |
| Significance test alpha | `significance_level: 0.95` | `significance_level: 0.05` |
