---
id: PMC-008
title: Google PRD Template
phase: 1 - Core Skills
status: todo
type: template
estimate: 1
dependencies: [PMC-006]
---

## Description

Create the Google-style PRD template at `skills/prd-generator/templates/google-prd.md`. This is one of three PRD template formats offered by the prd-generator skill. The Google format is the most widely used PRD structure in the industry, emphasizing clear goal-setting, user stories, and measurable success metrics. Each section must include inline guidance text that instructs the PM on what to write, along with placeholder structure (headings, bullet skeletons, tables) so the generated output is ready to fill in or has already been populated by the skill.

## Acceptance Criteria

- [ ] File created at `skills/prd-generator/templates/google-prd.md`
- [ ] Contains **Overview** section with guidance on summarizing the product/feature in 2-3 sentences
- [ ] Contains **Goals and Non-Goals** section with separate sub-sections and guidance on writing measurable goals and explicitly scoped-out non-goals
- [ ] Contains **User Stories** section with guidance on writing stories in "As a [persona], I want [action] so that [outcome]" format, with placeholder rows
- [ ] Contains **Detailed Requirements** section with guidance on breaking down functional and non-functional requirements, including a table or list skeleton
- [ ] Contains **Design Considerations** section with guidance on technical constraints, dependencies, UX considerations, and open design decisions
- [ ] Contains **Metrics** section with guidance on defining success metrics, baselines, and targets in a table format
- [ ] Contains **Open Questions** section with guidance on capturing unresolved decisions, owners, and due dates
- [ ] Contains **Timeline** section with guidance on milestones, phases, and target dates in a table or list format
- [ ] Every section includes italicized or bracketed guidance text explaining what belongs there
- [ ] Template uses markdown formatting consistent with other PMCopilot templates

## Files to Create/Modify

- `skills/prd-generator/templates/google-prd.md`
