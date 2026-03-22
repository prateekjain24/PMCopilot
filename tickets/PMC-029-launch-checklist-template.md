---
id: PMC-029
title: Launch Checklist Template
phase: 1 - Core Skills
status: done
type: template
estimate: 1
dependencies: [PMC-028]
---

## Description

Create the launch checklist template used by the launch checklist skill. This template provides the structural scaffold for all three launch types (soft, hard, beta) and renders a Markdown checklist organized by category. The template must support conditional sections that appear or hide based on launch type.

Each category section contains:
- A category header with a progress indicator placeholder (e.g., "3/5 complete")
- Individual checklist items as Markdown checkboxes
- Columns/fields for: item description, owner, due date, status (not started, in progress, done, blocked)
- A notes area for category-specific context

The template must clearly distinguish between **required** items (must be checked before launch) and **recommended** items (best practice but not blocking).

## Acceptance Criteria

- [ ] Template file exists at the designated path within the launch-checklist skill directory
- [ ] Template covers all nine categories: Engineering Readiness, QA, Design Sign-off, Analytics, Marketing, Support, Legal/Compliance, Rollout Plan, Post-Launch
- [ ] Each category contains specific checklist items with checkbox format
- [ ] Each item includes fields for description, owner, due date, and status
- [ ] Template distinguishes required vs. recommended items per launch type
- [ ] Template includes conditional markers so the skill can include/exclude categories based on launch type (soft/hard/beta)
- [ ] Hard launch renders all categories; soft launch omits Legal/Compliance and Marketing detail; beta launch focuses on Engineering, QA, Analytics, and Rollout Plan
- [ ] Template includes a summary header section with product name, launch type, target date, and overall readiness score placeholder
- [ ] Template is referenced correctly from the launch-checklist SKILL.md

## Files to Create/Modify

- `skills/launch-checklist/templates/launch-checklist.md`
