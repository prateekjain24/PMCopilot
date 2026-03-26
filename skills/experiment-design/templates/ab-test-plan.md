# A/B Test Plan

## Metadata

| Field | Value |
|-------|-------|
| Experiment Name | [Descriptive name for the experiment] |
| Owner | [Name and role of the experiment owner] |
| Start Date | [YYYY-MM-DD] |
| End Date | [YYYY-MM-DD] |
| Status | Draft / In Review / Running / Completed / Stopped |

---

## Hypothesis

**If we** [describe the specific change being made],
**then** [name the primary metric] **will** [increase/decrease]
**by** [expected magnitude, e.g., "5%" or "200ms"]
**because** [rationale grounded in user behavior, research, or data].

### Rationale

[Expand on the reasoning behind this hypothesis. Reference user research, analytics, competitive analysis, or behavioral principles that support the expected outcome.]

---

## Variants

### Control

- **Description**: [Describe the current experience that remains unchanged]
- **Implementation notes**: [Any technical details about the control condition]

### Treatment A

- **Description**: [Describe the specific changes in this variant]
- **Key differences from control**: [List the exact elements that differ]
- **Implementation notes**: [Technical details, feature flags, or configuration]

### Treatment B (if applicable)

- **Description**: [Describe the specific changes in this variant]
- **Key differences from control**: [List the exact elements that differ]
- **What this variant isolates vs. Treatment A**: [Explain what additional variable this tests]
- **Implementation notes**: [Technical details, feature flags, or configuration]

---

## Metrics

### Primary Metric (Decision Metric)

| Metric | Current Baseline | Minimum Detectable Effect | Target Direction |
|--------|-----------------|--------------------------|-----------------|
| [Metric name] | [Current value] | [MDE, e.g., +3% relative] | [Increase / Decrease] |

**Why this metric**: [Justify why this is the right metric for the ship/no-ship decision]

### Secondary Metrics (Learning Metrics)

| Metric | Current Baseline | Expected Direction | Purpose |
|--------|-----------------|-------------------|---------|
| [Metric 1] | [Value] | [Up/Down/Neutral] | [What this metric helps explain] |
| [Metric 2] | [Value] | [Up/Down/Neutral] | [What this metric helps explain] |
| [Metric 3] | [Value] | [Up/Down/Neutral] | [What this metric helps explain] |

### Guardrail Metrics (Safety Metrics)

| Metric | Current Baseline | Threshold | Action if Breached |
|--------|-----------------|-----------|-------------------|
| [Metric 1] | [Value] | [Max acceptable degradation] | [Stop experiment / Escalate / Review] |
| [Metric 2] | [Value] | [Max acceptable degradation] | [Stop experiment / Escalate / Review] |

---

## Sample Size Calculation

| Parameter | Value |
|-----------|-------|
| Baseline conversion rate | [e.g., 12%] |
| Minimum Detectable Effect (MDE) | [e.g., 5% relative lift = 12.6% absolute] |
| Significance level (alpha) | 0.05 (95% confidence) |
| Statistical power (1 - beta) | 0.80 (80% power) |
| Test type | [One-tailed / Two-tailed] |
| Required sample size per variant | [Calculated value] |
| Total sample size (all variants) | [Calculated value] |
| Estimated daily eligible traffic | [Value] |
| Estimated days to reach sample size | [Value] |

---

## Segmentation

### Target Population

- [Define who is included in the experiment, e.g., "All logged-in users on the web platform"]

### Exclusion Criteria

- [Criterion 1, e.g., "Internal employee accounts"]
- [Criterion 2, e.g., "Users currently enrolled in other checkout experiments"]
- [Criterion 3, e.g., "Bot traffic identified by user-agent filtering"]

### Segments of Interest

Pre-defined subgroups for post-hoc analysis of heterogeneous treatment effects:

- [Segment 1, e.g., "New users (first 7 days) vs. returning users"]
- [Segment 2, e.g., "Mobile vs. desktop"]
- [Segment 3, e.g., "Geography: NA vs. APAC vs. EMEA"]

---

## Decision Framework

### Success Criteria

The experiment is a **win** if:
- Primary metric shows a statistically significant improvement (p < 0.05) at or above the MDE
- No guardrail metrics are breached beyond their defined thresholds
- Results are consistent across key segments (no major negative subgroup effects)

### Duration Commitment

- **Minimum runtime**: [X days] (to capture full business cycles and reach required sample size)
- **Maximum runtime**: [Y days] (to limit exposure to novelty effects and external confounds)
- Do not call the experiment early based on trending results; wait for the minimum runtime unless a guardrail is breached

### Decision Actions

| Outcome | Criteria | Action |
|---------|----------|--------|
| Win | Primary metric significant, guardrails intact | Ship treatment to 100%; document learnings |
| Loss | Primary metric significantly negative | Revert to control; conduct post-mortem to understand why |
| Inconclusive | Primary metric not significant after max duration | Evaluate secondary metrics for learnings; consider larger MDE, different approach, or accept current state |
| Guardrail breach | Any guardrail exceeds threshold | Stop experiment immediately; revert to control; investigate root cause |

---

## Rollout Plan

### Phased Rollout

| Phase | Traffic Allocation | Duration | Go/No-Go Checkpoint |
|-------|-------------------|----------|---------------------|
| Phase 0: Smoke test | 1-2% | 1-2 days | Verify instrumentation, no errors, data flowing correctly |
| Phase 1: Initial ramp | 5% | 3-5 days | Confirm no guardrail breaches, logging accuracy |
| Phase 2: Mid ramp | 25% | [Until sample size reached] | Review interim metrics, check for segment-level issues |
| Phase 3: Full experiment | 50/50 split | [Remainder of experiment duration] | Final analysis at conclusion |
| Phase 4: Ship or revert | 100% or 0% | Post-experiment | Based on decision framework above |

### Go/No-Go Checkpoints

At each phase transition, verify:

- [ ] No increase in error rates or system degradation
- [ ] Guardrail metrics within acceptable thresholds
- [ ] Data collection is accurate and complete (no instrumentation gaps)
- [ ] No unexpected user complaints or support ticket spikes

### Cleanup

- [ ] Remove feature flags after full rollout or revert
- [ ] Archive experiment configuration and results
- [ ] Update documentation and share learnings with the team
- [ ] Close out any related tickets or tracking items
