---
id: PMC-100
title: Write README
phase: 5 - Polish and Distribution
status: done
type: docs
estimate: 1
dependencies: [PMC-001]
---

## Description

Write the main README.md for the PMCopilot project. This is the first thing potential users see -- it must clearly communicate what PMCopilot does, who it is for, and how to get started in under 2 minutes of reading.

The README should cover:

- **Tagline and value proposition**: One-line description of PMCopilot as a Claude Code plugin for Product Managers.
- **Feature overview**: Concise list of capabilities organized by category (PRD writing, prioritization frameworks, sprint analytics, app/web teardowns, market sizing, experiment design, stakeholder communication).
- **Quick start**: Minimal steps to install and run the first skill.
- **Skills catalog**: Table of all available skills with one-line descriptions.
- **Agent catalog**: Table of all agents with their roles and memory behavior.
- **Integration matrix**: Which external tools are supported (Jira, Slack, Amplitude, Mixpanel, Figma, Granola, Gmail, GCal) and what each integration enables.
- **Requirements**: Claude Code version, OS support, optional dependencies.
- **Links**: To the integration setup guide, troubleshooting guide, and marketplace listing.

## Acceptance Criteria

- [ ] README.md exists at the project root
- [ ] Includes a clear one-line description of what PMCopilot is
- [ ] Includes a "Quick Start" section with install command and first-use example
- [ ] Includes a skills table listing all skills with brief descriptions
- [ ] Includes an agents table listing all agents with their purpose and memory scope
- [ ] Includes an integration matrix showing supported tools and what they enable
- [ ] Includes a requirements section listing Claude Code version and OS compatibility
- [ ] Includes links to the integration setup guide (PMC-101), troubleshooting guide (PMC-102), and marketplace listing
- [ ] Uses no emojis unless explicitly standard in marketplace READMEs
- [ ] Reads well on both GitHub and the Claude Code marketplace
- [ ] All section links and cross-references are valid

## Files to Create/Modify

- `README.md` -- main project README
