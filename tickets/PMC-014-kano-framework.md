---
id: PMC-014
title: Kano Framework Reference
phase: 1 - Core Skills
status: todo
type: template
estimate: 1
dependencies: [PMC-011]
---

## Description

Create the Kano framework reference document at `skills/prioritize/frameworks/kano.md`. The Kano Model is a qualitative prioritization framework that classifies features based on how they affect customer satisfaction. Unlike scoring frameworks (RICE, ICE), Kano uses survey-based classification to sort features into five categories. This reference file is used by the prioritize skill to guide the assistant through Kano analysis, including the survey question format, the classification evaluation table, and interpretation of results.

## Acceptance Criteria

- [ ] File created at `skills/prioritize/frameworks/kano.md`
- [ ] Defines all **5 Kano categories** with clear descriptions:
  - **Must-be** (basic expectations; absence causes dissatisfaction, presence does not increase satisfaction)
  - **One-dimensional** (performance; satisfaction scales linearly with fulfillment)
  - **Attractive** (delighters; absence is acceptable, presence creates disproportionate satisfaction)
  - **Indifferent** (no significant effect on satisfaction either way)
  - **Reverse** (presence causes dissatisfaction for some users)
- [ ] Documents the **survey format** with paired questions per feature:
  - Functional question: "How would you feel if this feature were present?"
  - Dysfunctional question: "How would you feel if this feature were absent?"
  - Answer options for each: Like, Expect, Neutral, Live with, Dislike
- [ ] Contains the **classification evaluation table** (5x5 matrix) that maps functional + dysfunctional answer pairs to a Kano category
- [ ] Contains guidance on how to aggregate survey responses across multiple respondents
- [ ] Contains **When to Use** guidance explaining Kano is best for understanding customer sentiment, validating feature assumptions, and when you have access to user research or survey data
- [ ] Contains **Limitations** or caveats (e.g., requires user research effort, categories can shift over time, sample size considerations)
- [ ] Formatting is clean markdown suitable for inclusion in skill output

## Files to Create/Modify

- `skills/prioritize/frameworks/kano.md`
