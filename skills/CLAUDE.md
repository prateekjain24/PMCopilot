# Skills Directory

Skills are background knowledge files auto-activated by Claude based on description match. User-facing slash commands live in `commands/` instead.

## Skill Structure

```
skills/<name>/
├── SKILL.md          # Required: skill definition with YAML frontmatter
├── templates/        # Optional: output templates (markdown, HTML)
├── frameworks/       # Optional: framework configs (for prioritize)
├── src/              # Optional: TypeScript helpers
└── examples/         # Optional: example outputs
```

## SKILL.md Format

```yaml
---
name: skill-name
description: What this skill does (one sentence) — Claude uses this to decide when to activate
---

Background knowledge and domain context here...
```

## Required Frontmatter Fields

| Field | Notes |
|-------|-------|
| `name` | Kebab-case, matches directory name |
| `description` | One-line summary — Claude uses this to decide when to auto-activate |

## Current Skills (12)

competitive-teardown, prd-generator, sprint-review, market-sizing, prioritize, user-research, roadmap, experiment-design, stakeholder-update, app-store-intel, launch-checklist, metrics-review

Reference: `docs/design/03-SKILLS-AND-COMMANDS.md`
