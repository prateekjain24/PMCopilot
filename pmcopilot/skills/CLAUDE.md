# Skills Directory

Each skill is a subdirectory containing a `SKILL.md` file. Skills are user-facing slash commands invoked as `/pmcopilot:<name>`.

## Skill Structure

```
skills/<name>/
├── SKILL.md          # Required: skill definition with YAML frontmatter
├── templates/        # Optional: output templates (markdown, HTML)
├── frameworks/       # Optional: framework configs (for prioritize)
├── src/              # Optional: TypeScript helpers
└── examples/         # Optional: example outputs
```

Individual skill dirs do NOT need their own CLAUDE.md — `SKILL.md` already serves that purpose.

## SKILL.md Format

```yaml
---
name: skill-name
description: What this skill does (one sentence)
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Agent(agent-name)
  - mcp__server-name__*
context: fork
model: opus          # or sonnet
effort: high
argument-hint: "<competitor-name> [--format markdown]"
---

Skill prompt and orchestration logic here...
```

## Required Frontmatter Fields

| Field | Notes |
|-------|-------|
| `name` | Kebab-case, matches directory name |
| `description` | One-line summary |
| `user-invocable` | Always `true` for skills |
| `allowed-tools` | Tools this skill can use (NOT `tools` — that's for agents) |
| `context` | Always `fork` (isolated context) |
| `model` | `opus` or `sonnet` |
| `argument-hint` | Usage hint shown to user |

**Critical:** Skills use `allowed-tools` (NOT `tools`). Skills do NOT have `maxTurns`.

## Agent References

To invoke an agent from a skill, add `Agent(<agent-name>)` to `allowed-tools`:
```yaml
allowed-tools:
  - Agent(app-teardown, web-teardown)
  - Agent(research-synthesizer)
```

## Required Sections in SKILL.md Body

Every skill prompt must include:
- **Graceful Degradation**: What to do when MCP servers or agents are unavailable
- **Next Steps**: Suggested follow-up actions for the user

## Current Skills (12)

competitive-teardown, prd, sprint-review, market-sizing, prioritize, user-research, roadmap, experiment, stakeholder-update, app-store-intel, launch-checklist, metrics-review

Reference: `pm-plugin-docs/03-SKILLS-AND-COMMANDS.md`
