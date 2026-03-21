# RICE Scoring Framework

RICE is a quantitative prioritization framework developed by Intercom. It scores features across four dimensions to produce a single comparable score.

## Formula

```
RICE Score = (Reach x Impact x Confidence) / Effort
```

## Parameters

### Reach

The number of users or customers who will be affected by this feature **per quarter**.

- Use absolute numbers (e.g., 10,000 users, 500 accounts)
- Estimate based on: current user base, funnel data, segment size, feature adoption patterns
- For new products without data, estimate from TAM/SAM analysis or comparable features
- Be specific: "all users" is not a number

### Impact

How much this feature will move the target metric **per user** who encounters it.

| Score | Label | Meaning |
|-------|-------|---------|
| 3 | Massive | Transformative change to the user experience or key metric |
| 2 | High | Significant improvement that users will notice and value |
| 1 | Medium | Moderate improvement; meaningful but not dramatic |
| 0.5 | Low | Minor improvement; nice to have |
| 0.25 | Minimal | Barely noticeable improvement |

### Confidence

How confident you are in your Reach, Impact, and Effort estimates.

| Score | Label | Guidance |
|-------|-------|----------|
| 100% | High | Backed by data: A/B test results, user research, production metrics, comparable feature launches |
| 80% | Medium | Informed estimate: some data, strong product intuition, analogous precedent |
| 50% | Low | Speculative: gut feeling, no supporting data, new territory |

Use confidence honestly. It is the built-in hedge against uncertain estimates. If you are unsure about reach or impact, lower your confidence rather than inflating the other numbers.

### Effort

The total effort required to ship the feature, measured in **person-months**.

- Include all disciplines: design, engineering, QA, data science, content
- Round to the nearest 0.5 person-month
- Consider: implementation, testing, documentation, rollout, monitoring
- A 2-engineer, 3-week project = approximately 1.5 person-months

## Worked Example

Evaluating three features for a SaaS product:

| Feature | Reach (users/qtr) | Impact | Confidence | Effort (person-mo) | RICE Score |
|---------|-------------------|--------|------------|--------------------:|----------:|
| In-app messaging | 15,000 | 2 (High) | 80% | 4 | **6,000** |
| CSV export | 2,000 | 1 (Medium) | 100% | 0.5 | **4,000** |
| Dashboard redesign | 20,000 | 1 (Medium) | 50% | 6 | **1,667** |

**Calculation for in-app messaging:**
`(15,000 x 2 x 0.8) / 4 = 24,000 / 4 = 6,000`

**Result:** In-app messaging ranks highest despite the dashboard redesign reaching more users, because its impact is higher and the effort is reasonable. CSV export ranks second due to its low effort despite modest reach.

## When to Use

- **Default choice** for most product teams balancing multiple feature candidates
- When you have reasonable estimates for user reach (existing product with analytics)
- When effort estimation is feasible (team has done similar work before)
- When you need a single number to compare disparate features

## Limitations

- **Bias toward high-reach features**: Features affecting a small but critical user segment (e.g., enterprise admins) may score poorly despite being strategically important
- **Impact scale is subjective**: The 0.25-3 scale requires judgment; teams often anchor on "Medium" and rarely use 0.25 or 3
- **Confidence inflation**: Teams tend to overestimate confidence; calibrate by asking "what data supports this?"
- **Effort underestimation**: Engineering effort is notoriously hard to estimate; consider adding a buffer
- **Doesn't capture urgency**: Two features with the same RICE score might have very different time-sensitivity; consider supplementing with Cost of Delay
