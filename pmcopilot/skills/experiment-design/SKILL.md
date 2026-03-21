---
name: experiment-design
model: sonnet
effort: high
context: fork
agent: general-purpose
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
  - mcp__pm-frameworks__*
argument-hint: "[feature or hypothesis to test]"
---

# Experiment Design

Design rigorous A/B tests and experiments with statistically sound methodology. This skill helps product managers move from intuition to evidence-based decision making by structuring hypotheses, selecting metrics, calculating sample sizes, and defining clear decision criteria.

## Input

The user provides one of the following:

- A **feature or product change** they want to test (e.g., "new checkout flow", "redesigned onboarding")
- A **hypothesis** they want to validate (e.g., "adding social proof to pricing page will increase conversion")
- A **metric they want to improve** with a proposed intervention
- An **existing experiment** they want reviewed or refined

## Output Structure

The skill produces a complete experiment plan containing:

### 1. Hypothesis

A structured, testable hypothesis following the format:

**If we** [make this specific change], **then** [this metric] **will** [increase/decrease] **by** [measurable amount] **because** [underlying rationale based on user behavior or evidence].

Guidance for formulating testable hypotheses:

- Be specific about the change, the metric, and the expected direction of impact
- Ground the rationale in user research, behavioral principles, or prior data -- not assumptions
- Avoid vague statements like "improve user experience" -- tie everything to a measurable outcome
- Each experiment should test one primary hypothesis; secondary hypotheses are acceptable but should be clearly labeled

### 2. Variants

- **Control**: The current experience, unchanged
- **Treatment(s)**: One or more variants with precise descriptions of what differs from control
- Include mockup references or detailed behavioral descriptions for each variant
- If testing multiple treatments, explain what each isolates

### 3. Metrics

Selecting the right metrics is critical. Metrics fall into three categories:

**Primary Metric (Decision Metric)**
- The single metric used to make the ship/no-ship decision
- Must be directly influenced by the change being tested
- Must be measurable within the experiment timeframe
- Choose metrics that align with the business outcome you care about, not proxy metrics unless necessary

**Secondary Metrics (Learning Metrics)**
- Metrics that help you understand *why* the primary metric moved (or did not)
- Provide diagnostic depth -- e.g., if conversion increases, did time-on-page change? Did bounce rate shift?
- Typically 2-5 secondary metrics; more than that dilutes focus

**Guardrail Metrics (Safety Metrics)**
- Metrics that must *not* degrade beyond an acceptable threshold
- Protect against unintended negative consequences (e.g., increased conversion but higher refund rate)
- Define explicit thresholds -- if a guardrail is breached, the experiment is stopped or the treatment is rejected regardless of primary metric performance

### 4. Sample Size Calculation

Use the `mcp__pm-frameworks__sample_size_calc` tool with:

- **Baseline rate**: Current value of the primary metric
- **Minimum Detectable Effect (MDE)**: The smallest improvement worth detecting
- **Significance level**: 95% (alpha = 0.05) unless otherwise justified
- **Power**: 80% (beta = 0.20) unless otherwise justified

Report the required sample size per variant and the estimated time to reach that sample size given current traffic.

### 5. Duration

- Minimum duration based on sample size requirements
- Must include at least one full business cycle (typically 1-2 weeks) to account for day-of-week effects
- Maximum recommended duration to avoid history threats and novelty effects
- Note any seasonality or external events that could confound results

### 6. Segmentation

- **Target population**: Who is eligible for the experiment
- **Exclusion criteria**: Who should be excluded and why (e.g., internal users, bots, users in other active experiments)
- **Segments of interest**: Pre-defined subgroups for heterogeneous treatment effect analysis (e.g., new vs. returning users, mobile vs. desktop)

### 7. Rollout Plan

- Phased rollout percentages (e.g., 5% -> 25% -> 50% -> 100%)
- Go/no-go checkpoints at each phase
- Criteria for early stopping (both positive and negative)
- Ramp-down and cleanup procedures

## Process

1. **Understand the context**: Read any provided background, PRDs, or prior research. Ask clarifying questions if the change or goal is ambiguous.
2. **Formulate the hypothesis**: Draft a structured hypothesis. Validate that it is specific, measurable, and falsifiable.
3. **Design variants**: Define control and treatment(s). Ensure changes are isolated so results are attributable.
4. **Select metrics**: Choose primary, secondary, and guardrail metrics. Justify each selection.
5. **Calculate sample size**: Use `mcp__pm-frameworks__sample_size_calc` with the baseline rate and MDE.
6. **Determine duration and segmentation**: Factor in traffic volume, business cycles, and exclusion criteria.
7. **Define the decision framework**: Specify what happens if the experiment wins, loses, or is inconclusive.
8. **Create the rollout plan**: Design phased rollout with checkpoints.
9. **Write the plan**: Use the template at `templates/ab-test-plan.md` as the structure for the final output.

## Templates

The `templates/` directory contains:

- **ab-test-plan.md**: Complete A/B test plan template with all sections above
