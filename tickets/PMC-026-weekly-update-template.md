---
id: PMC-026
title: Weekly Update Template
phase: 1 - Core Skills
status: todo
type: template
estimate: 1
dependencies: [PMC-025]
---

## Description

Create the weekly update template used by the stakeholder update skill. This template structures a concise weekly status report designed for engineering leads, cross-functional partners, and direct managers.

The template must include the following sections in order:

1. **TL;DR** - Exactly 3 bullet points summarizing the most important takeaways from the week
2. **What Shipped** - List of features, fixes, or deliverables that went live this week
3. **Key Metrics** - Relevant quantitative indicators (adoption, performance, revenue impact, etc.)
4. **Blockers / Needs** - Issues requiring escalation or assistance from stakeholders
5. **Next Week Focus** - Top priorities and expected deliverables for the coming week

## Acceptance Criteria

- [ ] Template file exists at the designated path within the stakeholder-update skill directory
- [ ] Template contains all five required sections: TL;DR, What Shipped, Key Metrics, Blockers/Needs, Next Week Focus
- [ ] TL;DR section is constrained to exactly 3 bullet points with guidance on what makes a good summary bullet
- [ ] What Shipped section includes placeholders for item name, description, and impact
- [ ] Key Metrics section includes placeholders for metric name, current value, trend direction, and target
- [ ] Blockers/Needs section includes fields for blocker description, owner, and requested action
- [ ] Next Week Focus section supports prioritized list with expected completion status
- [ ] Template includes formatting guidance (Markdown output, consistent heading levels)
- [ ] Template is referenced correctly from the stakeholder-update SKILL.md

## Files to Create/Modify

- `skills/stakeholder-update/templates/weekly-update.md`
