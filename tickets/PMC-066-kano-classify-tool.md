---
id: PMC-066
title: Kano Model Classification Tool
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-063]
---

## Description
Implement the Kano model classification as two MCP tools within the pm-frameworks server: `kano_classify` for classifying a single feature based on its functional/dysfunctional survey pair, and `kano_batch` for classifying an entire survey dataset at once.

The Kano model classifies product features into categories based on how customers respond to two questions:
1. **Functional question**: "How would you feel if the product HAD this feature?"
2. **Dysfunctional question**: "How would you feel if the product DID NOT have this feature?"

Each answer uses a 5-point scale: Like, Expect, Neutral, Live with, Dislike

The classification uses the standard Kano evaluation table to map the (functional, dysfunctional) answer pair to one of these categories:
- **Must-be (M)**: Expected baseline features. Absence causes dissatisfaction, presence does not increase satisfaction. Example: a login page for a SaaS app.
- **One-dimensional (O)**: Linear satisfaction features. More is better. Example: loading speed.
- **Attractive (A)**: Delight features. Absence is acceptable, presence creates disproportionate satisfaction. Example: unexpected personalization.
- **Indifferent (I)**: Features customers do not care about either way.
- **Reverse (R)**: Features that actively cause dissatisfaction when present.
- **Questionable (Q)**: Contradictory responses indicating the question was misunderstood.

`kano_batch` processes an array of survey responses for a single feature (multiple respondents) and produces aggregate classification with distribution percentages and the dominant category. It can also process multiple features at once, returning per-feature classification.

## Acceptance Criteria
- [ ] `kano_classify` tool registered with parameters: `functional_answer` (enum: like/expect/neutral/live_with/dislike), `dysfunctional_answer` (same enum)
- [ ] Classification uses the standard 5x5 Kano evaluation table correctly
- [ ] Returns: `{ category: string, functional: string, dysfunctional: string, description: string }`
- [ ] All six categories supported: Must-be, One-dimensional, Attractive, Indifferent, Reverse, Questionable
- [ ] `kano_batch` tool registered with parameter: `survey_responses` (array of `{ feature_name: string, functional_answer: string, dysfunctional_answer: string }`)
- [ ] `kano_batch` groups responses by feature and computes: category distribution (percentage of each category), dominant category (plurality), total respondent count per feature
- [ ] `kano_batch` returns per-feature results sorted by actionability (Must-be first, then One-dimensional, Attractive, Indifferent, Reverse)
- [ ] Includes confidence indicator based on category agreement: >60% agreement = "Strong", 40-60% = "Moderate", <40% = "Weak/Mixed"
- [ ] Description field provides actionable guidance per category (e.g., Must-be: "Ensure this feature is present and functional. Absence will drive churn.")
- [ ] Input validation: functional_answer and dysfunctional_answer must be one of the five valid values
- [ ] Unit tests cover: each cell of the 5x5 evaluation table, batch aggregation with clear majority, batch with mixed responses, validation errors

## Files to Create/Modify
- `mcp-servers/pm-frameworks/src/tools/kano.ts` - Kano classification and batch tool implementations
- `mcp-servers/pm-frameworks/src/tools/kano.test.ts` - Unit tests (including full evaluation table coverage)
- `mcp-servers/pm-frameworks/src/tools/index.ts` - Register Kano tools in barrel export
