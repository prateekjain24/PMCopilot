---
id: PMC-027
title: Executive Summary Template
phase: 1 - Core Skills
status: done
type: template
estimate: 1
dependencies: [PMC-025]
---

## Description

Create the executive summary template used by the stakeholder update skill. This template is designed for VP/C-level audiences and emphasizes strategic context, key decisions needed, and resource implications. It must be scannable in under 60 seconds.

The template must include the following sections:

1. **One-Paragraph Summary** - A single dense paragraph (3-5 sentences) capturing the overall state of the product/initiative, suitable for forwarding as-is
2. **Metrics Dashboard** - A compact table of 4-6 north-star and supporting metrics with current values, period-over-period change, and status indicators (on-track, at-risk, off-track)
3. **Strategic Decisions Needed** - Numbered list of decisions requiring executive input, each with context, options, and a recommended path
4. **Resource Asks** - Specific requests for headcount, budget, tooling, or cross-team support, each with justification and urgency

## Acceptance Criteria

- [ ] Template file exists at the designated path within the stakeholder-update skill directory
- [ ] Template contains all four required sections: One-Paragraph Summary, Metrics Dashboard, Strategic Decisions Needed, Resource Asks
- [ ] One-Paragraph Summary includes guidance to keep it to 3-5 sentences with a strategic lens
- [ ] Metrics Dashboard is structured as a table with columns for metric name, current value, change, and status
- [ ] Strategic Decisions Needed includes fields for decision context, options (2-3), recommendation, and deadline
- [ ] Resource Asks includes fields for request type, justification, impact if not fulfilled, and urgency level
- [ ] Template tone guidance emphasizes brevity, precision, and executive-appropriate language
- [ ] Template is referenced correctly from the stakeholder-update SKILL.md

## Files to Create/Modify

- `skills/stakeholder-update/templates/exec-summary.md`
