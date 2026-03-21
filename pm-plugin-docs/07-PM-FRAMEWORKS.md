# 07 - PM Frameworks and Templates

PMCopilot ships with structured implementations of the most widely-used PM frameworks. These are available both as skill instructions and as calculators via the `pm-frameworks` MCP server.

---

## Prioritization Frameworks

### 1. RICE Scoring

**Adoption**: Used by 50%+ SaaS PMs. Originated at Intercom.

**Formula**: `RICE Score = (Reach x Impact x Confidence) / Effort`

| Parameter | Definition | Scale |
|-----------|-----------|-------|
| Reach | Number of users impacted per quarter | Absolute number (e.g., 10000) |
| Impact | How much each user is impacted | 0.25 (minimal), 0.5 (low), 1 (medium), 2 (high), 3 (massive) |
| Confidence | How sure are you about estimates | 50% (low), 80% (medium), 100% (high) |
| Effort | Person-months of work | Absolute number (e.g., 3) |

**MCP Tool**: `rice_score` and `rice_batch` in pm-frameworks server

**Example**:
```
Feature: In-app messaging
Reach: 15000 users/quarter
Impact: 2 (high)
Confidence: 80%
Effort: 4 person-months

RICE = (15000 x 2 x 0.8) / 4 = 6000
```

**When to use**: Default framework for most product teams. Good balance of rigor and simplicity.

**Limitations**: Impact scale is subjective; teams often inflate confidence scores.

---

### 2. ICE Scoring

**Formula**: `ICE Score = Impact x Confidence x Ease`

| Parameter | Definition | Scale |
|-----------|-----------|-------|
| Impact | Expected impact on key metric | 1-10 |
| Confidence | How confident in estimates | 1-10 |
| Ease | How easy to implement | 1-10 |

**MCP Tool**: `ice_score` in pm-frameworks server

**When to use**: Quick prioritization when you need a fast gut-check. Less rigorous than RICE but faster.

---

### 3. MoSCoW Method

**Categories**:
- **Must have**: Non-negotiable. Product fails without these.
- **Should have**: Important but not critical. Can delay if needed.
- **Could have**: Nice to have. Include if time/resources permit.
- **Won't have (this time)**: Explicitly excluded from this iteration.

**MCP Tool**: `moscow_sort` in pm-frameworks server

**When to use**: Scope management for a specific release. Great for stakeholder alignment.

**Rule of thumb**: Must-haves should be ~60% of effort, Should-haves ~20%, Could-haves ~20%.

---

### 4. Kano Model

**Classifies features into 5 categories based on user survey**:

| Category | Definition | Priority |
|----------|-----------|----------|
| Must-be (Basic) | Expected. Absence causes dissatisfaction, presence doesn't delight | Must build |
| One-dimensional (Performance) | More is better. Linear relationship with satisfaction | Build to compete |
| Attractive (Delighter) | Unexpected. Absence doesn't hurt, presence delights | Build to differentiate |
| Indifferent | Users don't care either way | Deprioritize |
| Reverse | Some users actively dislike this | Avoid or make optional |

**Survey format**: Two questions per feature:
1. Functional: "How would you feel if this feature existed?"
2. Dysfunctional: "How would you feel if this feature did NOT exist?"

**Answer options**: Like it, Expect it, Neutral, Can live with it, Dislike it

**MCP Tool**: `kano_classify` and `kano_batch` in pm-frameworks server

---

### 5. Cost of Delay / CD3

**Formula**: `CD3 = Cost of Delay per week / Job Duration in weeks`

**Cost of Delay** includes:
- Revenue lost per week of not having the feature
- Customer churn risk per week
- Competitive advantage erosion per week
- Regulatory penalty risk per week

**MCP Tool**: `cost_of_delay` in pm-frameworks server

**When to use**: When time-sensitivity matters more than absolute value. Great for deciding sequencing.

---

### 6. Weighted Scoring

**Custom criteria with custom weights**:

| Feature | Criteria 1 (w=30%) | Criteria 2 (w=25%) | Criteria 3 (w=25%) | Criteria 4 (w=20%) | Total |
|---------|-------------------|-------------------|-------------------|-------------------|-------|
| Feature A | 8 | 6 | 7 | 9 | 7.35 |
| Feature B | 5 | 9 | 8 | 6 | 7.05 |

**MCP Tool**: `weighted_score` in pm-frameworks server

**When to use**: When your team has specific strategic criteria that don't fit standard frameworks.

---

### 7. Opportunity Scoring

**Based on Outcome-Driven Innovation (ODI) by Tony Ulwick**:

**Formula**: `Opportunity Score = Importance + max(Importance - Satisfaction, 0)`

- Features where importance is high but satisfaction is low = biggest opportunities
- Plot on a 2x2 matrix: Importance (Y) vs Satisfaction (X)
- Top-left quadrant = underserved needs = biggest opportunities

**MCP Tool**: `opportunity_score` in pm-frameworks server

---

## Roadmapping Frameworks

### Now / Next / Later (Preferred - 70%+ tech companies)

```
+------------------+------------------+------------------+
|       NOW        |       NEXT       |      LATER       |
| (This quarter)   | (Next quarter)   | (2+ quarters)    |
| High confidence  | Medium confidence| Low confidence   |
| Committed        | Planned          | Exploratory      |
+------------------+------------------+------------------+
| - Feature A      | - Feature D      | - Feature G      |
| - Feature B      | - Feature E      | - Feature H      |
| - Feature C      | - Feature F      | - Feature I      |
+------------------+------------------+------------------+
```

**Why it works**: Avoids false precision of date-based roadmaps. Communicates confidence levels.

### Timeline-Based (For executive / board communication)

```
Q1 2026          Q2 2026          Q3 2026          Q4 2026
|                |                |                |
|--[Feature A]---|                |                |
|    [Feature B]-|--[Feature C]--|                |
|                |   [Feature D]-|--[Feature E]---|
|                |                |  [Feature F]---|
```

### Outcome-Based (For OKR-driven teams)

```
Outcome: Increase retention by 15%
  |-- Key Result: D7 retention from 40% to 55%
  |     |-- Initiative: Personalized onboarding
  |     |-- Initiative: Push notification optimization
  |-- Key Result: Monthly active usage from 60% to 75%
        |-- Initiative: Habit loop features
        |-- Initiative: Content recommendations
```

---

## Research Frameworks

### Jobs-to-Be-Done (JTBD)

**Core concept**: People don't buy products; they hire them to do a job.

**Job statement format**: `When [situation], I want to [motivation], so I can [expected outcome]`

**JTBD Canvas**:
```
Job Performer: [Who is the person?]

Core Functional Job:
  "Help me [job] so that [outcome]"

Related Jobs:
  - [Adjacent job 1]
  - [Adjacent job 2]

Emotional Jobs:
  - Feel [emotion 1]
  - Avoid feeling [emotion 2]

Social Jobs:
  - Be perceived as [perception]
  - Avoid being perceived as [perception]

Job Map (Steps):
  1. Define -> Pain: [what's hard about this step]
  2. Locate -> Pain: [what's hard]
  3. Prepare -> Pain: [what's hard]
  4. Confirm -> Pain: [what's hard]
  5. Execute -> Pain: [what's hard]
  6. Monitor -> Pain: [what's hard]
  7. Modify -> Pain: [what's hard]
  8. Conclude -> Pain: [what's hard]
```

### User Personas

**Template**:
```
Name: [Fictional name]
Photo: [Placeholder]
Role: [Job title / life stage]
Age: [Range]
Location: [Geographic]
Tech Savviness: [Low / Medium / High]

Goals:
  1. [Primary goal]
  2. [Secondary goal]
  3. [Tertiary goal]

Frustrations:
  1. [Pain point 1]
  2. [Pain point 2]
  3. [Pain point 3]

Quote: "[Something this persona would say]"

Day in the Life:
  [Brief narrative of how they encounter the problem space]

How They Currently Solve It:
  [Current tools/workarounds]
```

### Customer Interview Guide

**Structure**:
```
Research Objective: [What are we trying to learn?]

Screening Questions:
  1. [Ensure they match target persona]
  2. [Verify relevant experience]

Warm-up (2 min):
  - Tell me about your role
  - Walk me through a typical day

Core Questions (20 min):
  [Topic 1: Problem Space]
  - Tell me about the last time you [relevant activity]
  - What was the hardest part?
  - How did you work around it?

  [Topic 2: Current Solutions]
  - What tools do you currently use for [activity]?
  - What do you like/dislike about them?
  - If you could change one thing, what would it be?

  [Topic 3: Proposed Solution]
  - [Show concept/prototype]
  - Walk me through what you see
  - How would this fit into your workflow?

Follow-up Probes:
  - "Tell me more about that"
  - "Why is that important to you?"
  - "Can you give me a specific example?"
  - "What would happen if you couldn't do that?"

Wrap-up (3 min):
  - Is there anything else I should have asked?
  - Anyone else you'd recommend I talk to?
```

---

## Metrics Frameworks

### North Star Metric Framework

```
North Star Metric: [The one metric that best captures the core value you deliver]

Input Metrics (4-6 that feed the North Star):
  - Breadth: [How many users engage?]
  - Depth: [How much do they engage?]
  - Frequency: [How often do they engage?]
  - Efficiency: [How quickly do they get value?]

Example (Grab):
  North Star: Completed rides per week
  Input Metrics:
    - Breadth: Weekly active riders
    - Depth: Rides per rider per week
    - Frequency: Days with at least one ride per week
    - Efficiency: Time from app open to ride booked
```

### AARRR Pirate Metrics

```
Acquisition: How do users find us?
  - New sign-ups per week
  - Channel breakdown (organic, paid, referral)
  - CAC per channel

Activation: Do they have a great first experience?
  - Onboarding completion rate
  - Time to first value action
  - Setup completion rate

Retention: Do they come back?
  - D1 / D7 / D30 retention
  - Cohort retention curves
  - Churn rate

Revenue: Can we make money?
  - ARPU (Average Revenue Per User)
  - Conversion rate (free to paid)
  - LTV (Lifetime Value)
  - LTV:CAC ratio

Referral: Do they tell others?
  - Viral coefficient (K-factor)
  - NPS score
  - Referral rate
```

### OKR Framework

```
Objective: [Qualitative, inspirational goal]
  Key Result 1: [Quantitative metric] from [X] to [Y] by [date]
  Key Result 2: [Quantitative metric] from [X] to [Y] by [date]
  Key Result 3: [Quantitative metric] from [X] to [Y] by [date]

Scoring (at end of period):
  0.0 - 0.3: Red (failed to make progress)
  0.4 - 0.6: Yellow (made progress but fell short)
  0.7 - 1.0: Green (achieved or exceeded)

Note: 0.7 is the target. Consistently scoring 1.0 means OKRs aren't ambitious enough.
```

---

## Experimentation Frameworks

### A/B Test Design Template

```
Experiment Name: [Descriptive name]
Owner: [PM name]
Start Date: [Date]
Expected Duration: [X weeks]

Hypothesis:
  If we [change], then [metric] will [direction] by [amount]
  because [rationale].

Variants:
  Control: [Current experience]
  Treatment A: [Description of change]
  Treatment B: [Optional second variant]

Metrics:
  Primary: [The ONE metric that determines success]
  Secondary: [Supporting metrics]
  Guardrails: [Metrics that must NOT degrade]
    - [e.g., crash rate, support tickets, revenue per user]

Sample Size:
  Baseline conversion rate: X%
  Minimum detectable effect: Y%
  Significance level: 95% (alpha = 0.05)
  Power: 80% (beta = 0.20)
  Required sample per variant: [calculated via pm-frameworks MCP]
  Expected duration at current traffic: [X days]

Segmentation:
  - New vs existing users
  - Platform (iOS / Android / Web)
  - Geography
  - User tier (free / paid)

Decision Framework:
  If primary metric improves by >= MDE with statistical significance:
    -> Ship to 100%
  If primary metric improves but not significant after 2x duration:
    -> Extend or redesign experiment
  If guardrail metrics degrade:
    -> Kill experiment immediately
  If primary metric is flat:
    -> Don't ship. Iterate on hypothesis.
```

---

## Communication Frameworks

### Weekly Stakeholder Update Template

```
Subject: [Product Area] Weekly Update - [Date]

TL;DR
- [Most important thing that happened]
- [Second most important thing]
- [What you need from them, if anything]

What Shipped
- [Feature/fix]: [one-line description] [link to release notes]

Key Metrics
- [Primary metric]: [value] ([delta] vs last week)
- [Secondary metric]: [value] ([delta])

In Progress
- [Feature]: [% complete] - on track / at risk / blocked
  - [blocker description if at risk/blocked]

Decisions Needed
- [Decision]: [context] - need answer by [date]

Next Week
- [Priority 1]
- [Priority 2]
```

### Launch Communication Template

```
Subject: [Product/Feature] Launch - [Date]

What's Launching:
  [1-2 sentence description]

Why It Matters:
  [Business impact / user impact]

Who's Affected:
  [User segments, internal teams]

Rollout Plan:
  [Date]: [X]% rollout to [segment]
  [Date]: [Y]% rollout
  [Date]: 100% GA

Success Metrics:
  [Metric 1]: target [value] within [timeframe]
  [Metric 2]: target [value]

Known Limitations:
  - [Limitation 1]
  - [Limitation 2]

Escalation Path:
  - Engineering: [name/channel]
  - Product: [name/channel]
  - Support: [name/channel]

Marketing Assets:
  - Blog post: [link]
  - Help center: [link]
  - In-app messaging: [link to config]
```
