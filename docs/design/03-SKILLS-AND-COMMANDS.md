# 03 - Skills and Slash Commands

Every skill lives in `skills/<name>/SKILL.md` and is invoked as `/pmcopilot:<name>`. Below are full SKILL.md definitions for each skill.

---

## 1. /pmcopilot:competitive-teardown

**The flagship skill.** Orchestrates a full competitive analysis using simulators, browsers, and app store data.

```yaml
---
name: competitive-teardown
description: >
  Run a comprehensive competitive teardown of one or more competitor products.
  Supports mobile apps (via iOS Simulator and Android Emulator), websites (via Chrome),
  and app store intelligence. Produces a structured report with screenshots, feature
  matrices, UX pattern analysis, and strategic recommendations.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash, Grep, Glob, Agent(app-teardown, web-teardown, research-synthesizer)
context: fork
agent: general-purpose
model: opus
effort: max
argument-hint: "[competitor names or URLs, comma-separated]"
---

# Competitive Teardown

You are orchestrating a comprehensive competitive teardown for a Product Manager.

## Input
The user will provide one or more competitor names, app names, or URLs: $ARGUMENTS

## Execution Plan

### Step 1: Classify each competitor
For each competitor, determine:
- Is it a mobile app? (check App Store / Play Store)
- Is it a website/web app?
- Is it both?

### Step 2: Launch parallel research agents

**For mobile apps**: Delegate to `app-teardown` agent
- Provide: app name, bundle ID or package name
- Expected output: screenshots of key flows, feature inventory, UX patterns

**For websites**: Delegate to `web-teardown` agent
- Provide: URL(s) to analyze
- Expected output: pricing data, feature lists, landing page analysis, performance metrics

**For all competitors**: Use `mcp__app-store-intel__*` MCP tools
- Get: ratings, reviews, version history, category rankings

### Step 3: Synthesize findings
Combine all agent outputs into a unified report:

1. **Executive Summary** -- 3-5 key takeaways
2. **Feature Comparison Matrix** -- side-by-side feature grid
3. **UX Pattern Analysis** -- common and unique UX patterns with screenshot evidence
4. **Pricing Comparison** -- pricing tiers, free vs paid features
5. **App Store Performance** -- ratings, review sentiment, download trends
6. **Strengths and Weaknesses** -- per competitor SWOT
7. **Strategic Recommendations** -- what to copy, what to avoid, whitespace opportunities
8. **Screenshot Gallery** -- organized by flow (onboarding, core loop, monetization, settings)

### Step 4: Output
Save the report as a markdown file. Include all screenshots as inline images.
If the user wants a presentation, also generate a PPTX.

## Templates
For the report structure, see [templates/teardown-report.md](templates/teardown-report.md)
For the feature matrix, see [templates/feature-matrix.md](templates/feature-matrix.md)
```

---

## 2. /pmcopilot:prd

**Generates a PRD using your preferred template, optionally grounded in research data.**

```yaml
---
name: prd-generator
description: >
  Generate a Product Requirements Document (PRD) for a new feature or product.
  Supports multiple templates: Amazon PRFAQ, Google PRD, Stripe PRD, or custom.
  Can incorporate competitive research, user research, and analytics data.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash, Grep, Glob, Agent(prd-writer)
context: fork
agent: general-purpose
model: opus
effort: high
argument-hint: "[feature name] [--template amazon|google|stripe]"
---

# PRD Generator

You are a senior PM writing a Product Requirements Document.

## Input
Feature or product: $ARGUMENTS[0]
Template (optional): $ARGUMENTS[1] (defaults to project setting or "google")

## Available Templates

### Google PRD Format
Sections: Overview, Goals & Non-Goals, User Stories, Detailed Requirements,
Design Considerations, Metrics & Success Criteria, Open Questions, Timeline

### Amazon PRFAQ Format
Sections: Press Release (future-back), FAQ (External), FAQ (Internal),
Appendix with detailed requirements

### Stripe PRD Format
Sections: Problem Statement, Solution Overview, User Flows, API Design,
Edge Cases, Rollout Plan, Success Metrics

## Process

1. **Gather context**: Check if there's existing competitive research, user research,
   or analytics data in the project. Use Jira/Linear MCP to pull related tickets.

2. **Draft the PRD**: Using the selected template, write a complete first draft.
   Every section should have substantive content, not placeholders.

3. **Add data backing**: Where possible, reference specific data points --
   competitor feature comparisons, user research quotes, analytics metrics.

4. **Flag open questions**: Identify genuine unknowns that need stakeholder input.

5. **Output**: Save as markdown file with clear structure.

## Templates
See [templates/](templates/) for full template files.
```

---

## 3. /pmcopilot:sprint-review

```yaml
---
name: sprint-review
description: >
  Generate a sprint review summary by pulling data from Jira/Linear,
  analyzing completed vs planned work, flagging blockers, and drafting
  the review presentation.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash, Agent(sprint-analyst), mcp__43470b8f-a656-4653-8dba-c593836b1597__searchJiraIssuesUsingJql, mcp__43470b8f-a656-4653-8dba-c593836b1597__getJiraIssue
context: fork
agent: general-purpose
model: sonnet
effort: high
argument-hint: "[sprint name or number] [--project PROJECT_KEY]"
---

# Sprint Review Generator

## Input
Sprint: $ARGUMENTS

## Process

1. **Pull sprint data** from Jira/Linear MCP:
   - All tickets in the sprint (completed, in-progress, blocked)
   - Story points planned vs delivered
   - Carry-over from previous sprint

2. **Analyze velocity**:
   - Compare to last 3 sprints
   - Identify trends (accelerating, decelerating, stable)

3. **Categorize completed work**:
   - New features
   - Bug fixes
   - Tech debt / infrastructure
   - Design / research

4. **Identify risks and blockers**:
   - Tickets that missed the sprint
   - Dependencies on other teams
   - Recurring blockers

5. **Draft the review**:
   - What we shipped (with demo links where available)
   - What we didn't ship and why
   - Velocity analysis
   - Next sprint preview
   - Shoutouts / team highlights
```

---

## 4. /pmcopilot:market-sizing

```yaml
---
name: market-sizing
description: >
  Estimate TAM, SAM, and SOM for a product or market opportunity.
  Uses both top-down and bottom-up methodologies. Can incorporate
  web research for market data.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash, WebSearch, mcp__pm_content_n8n_mcp__perplexity_search
context: fork
agent: general-purpose
model: opus
effort: high
argument-hint: "[market or product description]"
---

# Market Sizing

## Input
Market/product: $ARGUMENTS

## Process

1. **Web research**: Use web search and Chrome to find:
   - Industry reports (Statista, Grand View Research, etc.)
   - Public company filings with market data
   - Analyst estimates

2. **Top-down sizing**:
   - Total addressable market (TAM) from industry data
   - Serviceable addressable market (SAM) based on geographic/segment filters
   - Serviceable obtainable market (SOM) based on realistic capture rate

3. **Bottom-up sizing**:
   - Number of potential customers in target segments
   - Average revenue per customer (ARPU)
   - Realistic penetration rate over 1/3/5 years

4. **Cross-validate**: Compare top-down and bottom-up estimates.
   Flag discrepancies and explain them.

5. **Use pm-frameworks MCP**: Call `tam_sam_som` tool for structured calculations.

6. **Output**: Markdown report with:
   - Executive summary with headline numbers
   - Methodology explanation
   - Data sources with links
   - Sensitivity analysis (optimistic / base / conservative)
   - Visual representation (can be rendered as chart)
```

---

## 5. /pmcopilot:prioritize

```yaml
---
name: prioritize
description: >
  Prioritize a list of features or initiatives using RICE, ICE, MoSCoW,
  Kano, Weighted Scoring, or Cost of Delay frameworks. Reads from
  Jira/Linear backlog or accepts manual input.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash, mcp__43470b8f-a656-4653-8dba-c593836b1597__searchJiraIssuesUsingJql
context: fork
agent: general-purpose
model: sonnet
effort: high
argument-hint: "[framework: rice|ice|moscow|kano|weighted|cod] [--from-jira PROJECT_KEY]"
---

# Feature Prioritization

## Input
Framework: $ARGUMENTS[0] (default: rice)
Source: $ARGUMENTS[1] (optional: --from-jira, --from-linear, or manual list)

## Process

1. **Gather features**:
   - From Jira/Linear: pull backlog items via MCP
   - From manual input: parse user's feature list

2. **For each feature, estimate parameters**:
   - RICE: Reach, Impact (0.25/0.5/1/2/3), Confidence (50/80/100%), Effort (person-months)
   - ICE: Impact (1-10), Confidence (1-10), Ease (1-10)
   - Kano: Functional + dysfunctional survey responses
   - MoSCoW: Must/Should/Could/Won't classification
   - Weighted: Custom criteria with weights
   - CoD: Cost of Delay per week, Duration in weeks

3. **Calculate scores**: Use `pm-frameworks` MCP tools for structured calculation.

4. **Rank and output**:
   - Ranked list with scores
   - Visualization (can generate chart data)
   - Recommendation: "Top 3 to do next"
   - Trade-off analysis between top candidates
```

---

## 6. /pmcopilot:user-research

```yaml
---
name: user-research
description: >
  Create user research artifacts: personas, interview guides, JTBD canvases,
  affinity maps. Can also analyze interview transcripts and extract insights.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash, Grep, mcp__3053a93d-10f6-40f2-893b-fcd0bb589fb8__get_meeting_transcript, mcp__3053a93d-10f6-40f2-893b-fcd0bb589fb8__list_meetings
context: fork
agent: general-purpose
model: opus
effort: high
argument-hint: "[artifact: persona|interview-guide|jtbd|affinity-map|analyze-transcript]"
---

# User Research Toolkit

## Input
Artifact type: $ARGUMENTS[0]
Additional context: $ARGUMENTS[1:]

## Artifacts

### Persona
- Name, photo placeholder, demographics
- Goals, frustrations, motivations
- Tech savviness, day-in-the-life scenario
- Quote that captures their essence
- Jobs to be done

### Interview Guide
- Research objectives (3-5)
- Screening questions
- Warm-up questions
- Core questions (grouped by topic, open-ended)
- Follow-up probes
- Wrap-up and debrief questions

### JTBD Canvas
- Job performer
- Core functional job
- Related jobs
- Emotional jobs
- Social jobs
- Job steps (with pain points at each step)
- Desired outcomes

### Affinity Map
- Input: raw notes, transcripts, or survey responses
- Process: group into themes, label clusters
- Output: structured theme hierarchy with evidence

### Transcript Analysis
- Input: interview transcript (file path or pasted text)
- Process: extract quotes, themes, pain points, feature requests
- Output: structured insight report
```

---

## 7. /pmcopilot:roadmap

```yaml
---
name: roadmap
description: >
  Generate a product roadmap in Now/Next/Later, timeline-based, or
  outcome-based format. Can pull from Jira/Linear backlog and
  prioritization results.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash, mcp__43470b8f-a656-4653-8dba-c593836b1597__searchJiraIssuesUsingJql
context: fork
agent: general-purpose
model: sonnet
effort: high
argument-hint: "[format: now-next-later|timeline|outcome-based] [--quarters N]"
---

# Roadmap Generator

## Input
Format: $ARGUMENTS[0] (default: now-next-later)
Timeframe: $ARGUMENTS[1] (default: 3 quarters)

## Formats

### Now / Next / Later
- Now: committed work, high confidence, this quarter
- Next: planned work, medium confidence, next quarter
- Later: exploratory, low confidence, 2+ quarters out
- Each item: title, objective, key results, confidence level

### Timeline-Based
- Quarter-by-quarter view
- Milestones and dependencies
- Resource allocation
- Risk flags

### Outcome-Based
- Outcomes (not outputs)
- Key results per outcome
- Initiatives that drive each outcome
- Metrics to track progress

## Process
1. Pull prioritized backlog from Jira/Linear (if connected)
2. Group features into themes/pillars
3. Assign to time horizons based on priority + dependencies
4. Generate roadmap document with clear ownership and metrics
```

---

## 8. /pmcopilot:experiment

```yaml
---
name: experiment-design
description: >
  Design an A/B test or experiment. Includes hypothesis, variants,
  sample size calculation, success metrics, and guardrail metrics.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash
context: fork
agent: general-purpose
model: sonnet
effort: high
argument-hint: "[feature or hypothesis to test]"
---

# Experiment Design

## Input
Feature/hypothesis: $ARGUMENTS

## Output Structure
1. **Hypothesis**: If we [change], then [metric] will [improve/decrease] by [amount]
2. **Variants**: Control + 1-3 treatment variants with clear descriptions
3. **Primary metric**: The one metric that determines success
4. **Secondary metrics**: Supporting metrics to watch
5. **Guardrail metrics**: Metrics that must NOT degrade
6. **Sample size**: Use `pm-frameworks` MCP `sample_size_calc` tool
7. **Duration**: Based on traffic and required sample size
8. **Segmentation**: User segments to analyze separately
9. **Rollout plan**: What happens if the test wins/loses/is inconclusive
```

---

## 9. /pmcopilot:stakeholder-update

```yaml
---
name: stakeholder-update
description: >
  Generate a stakeholder update email or document. Pulls from sprint data,
  metrics, and recent decisions. Supports weekly update, monthly review,
  or executive summary formats.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash, mcp__0d3ccbd5-2c59-4d74-aa42-4830ee6d1e48__slack_send_message, mcp__0d3ccbd5-2c59-4d74-aa42-4830ee6d1e48__slack_create_canvas, mcp__43470b8f-a656-4653-8dba-c593836b1597__searchJiraIssuesUsingJql
context: fork
agent: general-purpose
model: sonnet
effort: medium
argument-hint: "[format: weekly|monthly|exec-summary] [--period YYYY-MM-DD:YYYY-MM-DD]"
---

# Stakeholder Update

## Input
Format: $ARGUMENTS[0] (default: weekly)

## Formats

### Weekly Update
- TL;DR (3 bullets)
- What shipped this week
- Key metrics movement
- Blockers / needs from leadership
- Next week focus

### Monthly Review
- Month in review (narrative)
- OKR progress (with red/yellow/green)
- Key wins and learnings
- Risks and mitigations
- Next month priorities

### Executive Summary
- One-paragraph summary
- Metrics dashboard (key numbers)
- Strategic decisions needed
- Resource asks

## Process
1. Pull recent sprint data from Jira/Linear
2. Pull metrics from analytics MCP (if connected)
3. Check Slack for recent decisions/announcements
4. Draft update in chosen format
5. Keep it concise -- executives don't read walls of text
```

---

## 10. /pmcopilot:app-store-intel

```yaml
---
name: app-store-intel
description: >
  Get competitive intelligence from App Store and Google Play Store.
  Reviews, ratings, version history, category rankings, and sentiment analysis.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash, mcp__app-store-intel__*
model: sonnet
effort: medium
argument-hint: "[app name or bundle ID] [--store ios|android|both]"
---

# App Store Intelligence

## Input
App: $ARGUMENTS[0]
Store: $ARGUMENTS[1] (default: both)

## Process
1. Use `mcp__app-store-intel__*` MCP tools to search and identify the app
2. Pull: ratings, review count, version history, category ranking
3. Fetch recent reviews (last 100) and analyze sentiment
4. Identify recurring themes in negative reviews (pain points)
5. Identify recurring themes in positive reviews (strengths)
6. Track version cadence (how often do they ship?)
7. Output structured report with data tables and key insights
```

---

## 11. /pmcopilot:launch-checklist

```yaml
---
name: launch-checklist
description: >
  Generate a comprehensive product launch checklist covering engineering,
  design, marketing, legal, support, and analytics readiness.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash
model: sonnet
effort: medium
argument-hint: "[feature or product name] [--type soft|hard|beta]"
---

# Launch Checklist

## Input
Feature: $ARGUMENTS[0]
Launch type: $ARGUMENTS[1] (default: soft)

## Checklist Categories
1. Engineering readiness (feature flags, rollback plan, load testing)
2. QA / testing (test cases, edge cases, regression)
3. Design sign-off (final review, asset delivery)
4. Analytics (events instrumented, dashboards ready)
5. Marketing (blog post, changelog, in-app messaging)
6. Support (help docs, CS team briefed, escalation path)
7. Legal / compliance (privacy review, terms update)
8. Rollout plan (percentage rollout, monitoring plan)
9. Post-launch (success criteria, review cadence)
```

---

## 12. /pmcopilot:metrics-review

```yaml
---
name: metrics-review
description: >
  Pull and analyze product metrics from your analytics platform.
  Supports North Star, AARRR pirate metrics, and custom KPI dashboards.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash, Agent(data-analyst)
context: fork
agent: general-purpose
model: sonnet
effort: high
argument-hint: "[metric framework: north-star|aarrr|custom] [--period 7d|30d|90d]"
---

# Metrics Review

## Input
Framework: $ARGUMENTS[0] (default: north-star)
Period: $ARGUMENTS[1] (default: 30d)

## Process
1. Connect to analytics MCP (Amplitude/Mixpanel)
2. Pull relevant metrics for the chosen framework
3. Calculate period-over-period changes
4. Identify anomalies and trends
5. Cross-reference with recent releases (from Jira/Linear)
6. Output: metrics dashboard with trend analysis and recommendations

## Frameworks

### North Star
- North Star metric + input metrics
- Trend over selected period
- Correlation with recent changes

### AARRR (Pirate Metrics)
- Acquisition: new users, channels
- Activation: onboarding completion, first value moment
- Retention: D1/D7/D30, cohort analysis
- Revenue: ARPU, conversion rate, LTV
- Referral: viral coefficient, NPS
```

---

## Skill Interaction Patterns

### Chaining Skills
```
User: "Do a competitive teardown of Uber Eats, then write a PRD
       for our delivery feature based on the findings"

PMCopilot:
1. Invokes /pmcopilot:competitive-teardown "Uber Eats"
2. Saves teardown report
3. Invokes /pmcopilot:prd "delivery feature" --context teardown-report.md
4. PRD references specific competitive findings
```

### Parallel Execution
```
User: "Prepare for my quarterly product review"

PMCopilot (in parallel):
- /pmcopilot:metrics-review --period 90d
- /pmcopilot:sprint-review --last-3-sprints
- /pmcopilot:roadmap now-next-later
Then synthesizes into executive presentation
```

### Auto-Invocation
Claude can auto-invoke skills based on description matching:
- User asks "how does Gojek's onboarding work?" -> auto-invokes app-teardown agent
- User asks "should we build feature X or Y first?" -> auto-invokes prioritize skill
- User asks "what are users saying about our app?" -> auto-invokes app-store-intel
