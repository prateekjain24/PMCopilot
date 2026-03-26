# Agents Directory

Agent definitions are plain markdown files with YAML frontmatter. Each file is one agent — agents do NOT use subdirectories (unlike skills).

## File Format

```yaml
---
name: agent-name
description: What this agent does (one sentence)
tools:
  - Read
  - Write
  - Bash
  - mcp__server-name__*
model: opus          # opus for complex reasoning, sonnet for data tasks
effort: high
maxTurns: 50         # max agentic round-trips before stopping
permissionMode: acceptEdits  # or "default" for interactive
memory: true         # persist context across invocations
isolation: worktree  # run in isolated git worktree
background: true     # run as background task
---

System prompt and instructions here...
```

## Required Frontmatter Fields

| Field | Notes |
|-------|-------|
| `name` | Kebab-case, matches filename without `.md` |
| `description` | One-line summary |
| `tools` | List of tools agent can use (NOT `allowed-tools` — that's for skills) |
| `model` | `opus` or `sonnet` |
| `maxTurns` | Integer; skills do NOT have this field |
| `permissionMode` | `acceptEdits` or `default` |

**Critical:** Agents use `tools`, skills use `allowed-tools`. These are different fields.

## Permission Modes

- **`acceptEdits`**: app-teardown, web-teardown, prd-writer, ux-reviewer, research-synthesizer
  - Agent can read/write files and run tools without user confirmation
- **`default`** (interactive): data-analyst, sprint-analyst
  - User must approve each tool invocation

## Long-Running Agents

app-teardown and web-teardown use `background: true` + `isolation: worktree` because they may run for minutes navigating apps/websites.

## Design Decisions

- **Android emulator is primary** for competitor app teardowns (APKs easier to obtain, no code signing, reliable adb)
- iOS Simulator is best for own-app testing and iOS-specific UX patterns
- Agent navigation: accessibility trees first, coordinates as fallback
- Screen deduplication: >80% element overlap = same screen (skip duplicate)
- All teardown data persists in `${CLAUDE_PLUGIN_DATA}/teardowns/`

## Current Agents

| Agent | Model | Permission | Background |
|-------|-------|------------|------------|
| app-teardown | opus | acceptEdits | yes |
| web-teardown | opus | acceptEdits | yes |
| research-synthesizer | opus | acceptEdits | no |
| prd-writer | opus | acceptEdits | no |
| data-analyst | sonnet | default | no |
| sprint-analyst | sonnet | default | no |
| ux-reviewer | opus | acceptEdits | no |

Reference: `pm-plugin-docs/04-SUBAGENTS.md`
