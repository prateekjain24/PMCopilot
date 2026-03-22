---
id: PMC-034
title: Metrics Review Skill
phase: 1 - Core Skills
status: done
type: skill
estimate: 1
dependencies: [PMC-005]
---

## Description

Implement the metrics review skill at `skills/metrics-review/SKILL.md`. This skill helps PMs conduct structured metrics reviews using established product analytics frameworks. It pulls data, applies the chosen framework, identifies anomalies and trends, and produces an actionable metrics narrative.

The skill must use model `sonnet` and supports two primary frameworks:

1. **North Star Metric** - Identifies and tracks the single metric that best captures the core value the product delivers. Breaks it down into input metrics (breadth, depth, frequency, efficiency) and maps the causal chain from team activities to north star movement.

2. **AARRR Pirate Metrics** - Analyzes the full funnel across five stages:
   - **Acquisition** - How users find the product (channels, CAC, volume)
   - **Activation** - First-value experience (onboarding completion, time-to-value)
   - **Retention** - Repeat usage (D1/D7/D30, cohort curves, churn rate)
   - **Revenue** - Monetization (ARPU, LTV, conversion rate, expansion revenue)
   - **Referral** - Viral growth (NPS, referral rate, K-factor)

The `data-analyst` sub-agent handles data retrieval, statistical analysis, and anomaly detection, while the main skill focuses on narrative interpretation and strategic recommendations.

Allowed tools: `Read`, `Write`, `Bash`, `Agent(data-analyst)`.

## Acceptance Criteria

- [ ] `skills/metrics-review/SKILL.md` exists and follows the standard skill schema
- [ ] Model is set to `sonnet`
- [ ] Allowed tools list includes `Read`, `Write`, `Bash`, `Agent(data-analyst)`
- [ ] Skill supports both North Star and AARRR Pirate Metrics frameworks
- [ ] Skill prompts the user to select a framework and provide the product/feature context
- [ ] Skill defines the `data-analyst` sub-agent with its responsibilities (data pulling, statistical analysis, trend detection)
- [ ] North Star framework output includes: north star metric definition, current value, trend, input metrics breakdown, and causal analysis
- [ ] AARRR framework output includes: metrics for each funnel stage, stage-over-stage conversion rates, weakest stage identification, and improvement recommendations
- [ ] Skill identifies anomalies (significant deviations from trend) and highlights them with potential explanations
- [ ] Skill produces actionable recommendations tied to specific metric movements
- [ ] Skill handles missing or partial data by clearly noting gaps and adjusting analysis scope

## Files to Create/Modify

- `skills/metrics-review/SKILL.md`
