# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PMCopilot is a Claude Code plugin for Product Managers. It provides an AI-powered copilot that interacts with real PM tools -- simulators, browsers, Jira, Figma, Slack, analytics platforms -- to do research, run analysis, and produce grounded artifacts. The design docs live in `docs/design/` (files 00-10).

You are head of product for this project.

## PMCopilot Philosophy

PMCopilot is opinionated about how PMs should work with AI. These seven principles are enforced across all skills, agents, and commands:

1. **Context before execution.** Read `_Context.md` in the working folder (if it exists) before reading other files. Respect its read/skip directives -- do not read files it tells you to skip. Then read `${CLAUDE_PLUGIN_DATA}/pm-profile.json` for user identity and output preferences.
2. **Plan before execution.** For any multi-step task, present a short plan (sources to read, structure of the deliverable, key assumptions) and wait for user approval before producing the artifact. A 30-second review prevents 10 minutes of wrong output.
3. **Cite your sources.** Every claim must trace back to a file, a Jira ticket, a Slack message, or a data point. Use inline citations like "per roadmap-h1.md" or "from GRAB-1234". No unattributed assertions.
4. **Accumulate, don't repeat.** Agents with project memory should reference prior work. Show what changed rather than starting from scratch. If a competitive teardown was run last month, the new one should note what shifted.
5. **Separate signal from noise.** `_Context.md` tells you what matters in a folder. A folder with 40 files but only 5 relevant ones should not produce output that mixes current strategy docs with old brainstorm notes.
6. **Ship a summary.** Every multi-agent workflow must produce a `what-changed.md` summary listing what each sub-agent found, what changed since the last run, and key cross-cutting themes.
7. **Automate the routine.** Morning briefs, sprint digests, competitive pulses -- these are best run as scheduled tasks, not manually triggered every time. The `/pmcopilot:setup` command helps users set these up.

If `pm-profile.json` does not exist when a session starts, suggest running `/pmcopilot:setup` to personalize the experience.

## Plugin Architecture

PMCopilot is structured as a Claude Code plugin with four component types:

- **Commands** (`commands/<name>.md`): User-facing slash commands invoked as `/pmcopilot:<name>`. Use YAML frontmatter with `description`, `argument-hint`, `allowed-tools`, `model`.
- **Skills** (`skills/<name>/SKILL.md`): Background knowledge auto-activated by Claude based on description match. Use YAML frontmatter with `name`, `description`, `allowed-tools`.
- **Agents** (`agents/<name>.md`): Autonomous subagents with their own system prompts. Use YAML frontmatter with `tools` (not `allowed-tools`), `maxTurns`, `permissionMode`, `memory`, `isolation`, `background`.
- **MCP Servers** (`mcp-servers/<name>/`): TypeScript + Node.js servers (STDIO transport) registered in `.mcp.json`. Tools namespaced as `mcp__<server>__<tool>` with wildcard `mcp__<server>__*`.
- **Hooks** (`hooks/hooks.json`): Lifecycle hooks (SessionStart, PreToolUse, PostToolUse, SubagentStop) for validation and automation.

Plugin manifest lives at `.claude-plugin/plugin.json`. Development mode: `claude --plugin-dir .` (from repo root).

## Key Naming Conventions

- Skills use `allowed-tools` in frontmatter; agents use `tools` (these are different fields)
- Skills do NOT have `maxTurns`; agents do
- MCP tool references: `mcp__simulator-bridge__take_screenshot` (specific) or `mcp__simulator-bridge__*` (wildcard)
- Agent references in skills: `Agent(app-teardown, web-teardown)`
- Plugin environment variables: `${CLAUDE_PLUGIN_ROOT}` (install dir), `${CLAUDE_PLUGIN_DATA}` (~/.claude/plugins/data/pmcopilot/)
- Command names are short (`prd`, `experiment`); skill directory names are descriptive (`prd-generator`, `experiment-design`) since skills are auto-activated by description match

## Component Inventory

### 13 Commands
competitive-teardown, prd, sprint-review, market-sizing, prioritize, user-research, roadmap, experiment, stakeholder-update, app-store-intel, launch-checklist, metrics-review, setup

### 7 Agents
| Agent | Model | Key Role |
|-------|-------|----------|
| app-teardown | opus | Navigate iOS/Android apps on simulators, screenshot every screen |
| web-teardown | opus | Browse competitor websites via Chrome automation |
| research-synthesizer | opus | Orchestrate other agents, synthesize multi-source findings |
| prd-writer | opus | Write PRDs using best-practice templates |
| data-analyst | sonnet | Query Amplitude/Mixpanel for product metrics |
| sprint-analyst | sonnet | Analyze Jira/Linear sprint data |
| ux-reviewer | opus | Review screenshots for UX quality against heuristics |

### 4 Custom MCP Servers (TypeScript, STDIO)
- **simulator-bridge**: Wraps `xcrun simctl` + `idb` for iOS Simulator control (15 tools)
- **emulator-bridge**: Wraps `adb` for Android Emulator control (16 tools)
- **app-store-intel**: App Store + Play Store data extraction (10 tools)
- **pm-frameworks**: RICE, ICE, Kano, MoSCoW, TAM/SAM/SOM calculators (12 tools)

## Stacking Pattern

Commands orchestrate agents which use MCP tools. Example flow:
```
/pmcopilot:competitive-teardown "Grab vs Gojek"
  -> competitive-teardown command (orchestrator)
    -> app-teardown agent (parallel) -> simulator-bridge MCP -> xcrun simctl/adb
    -> web-teardown agent (parallel) -> Chrome MCP -> browser automation
    -> app-store-intel MCP -> App Store/Play Store APIs
  -> research-synthesizer agent -> unified report
```

## Build and Development

MCP servers are TypeScript + Node.js projects under `mcp-servers/<name>/`:
```bash
cd mcp-servers/<server-name>
bun install
bun run build    # compiles to dist/index.js
```

Test plugin loading (from repo root):
```bash
claude --plugin-dir .
```

Hook scripts live in `hooks/` and are referenced from `hooks/hooks.json`. Exit code 0 = allow, 2 = block (reason on stderr).

## Repository Layout

| Directory | Contents |
|-----------|----------|
| `commands/` | 13 slash-command Markdown files |
| `agents/` | 7 agent system-prompt Markdown files |
| `skills/` | Background skills (each in its own subdirectory with SKILL.md) |
| `mcp-servers/` | 4 custom STDIO MCP servers (TypeScript) |
| `hooks/` | Lifecycle hook scripts + hooks.json |
| `src/` | Shared utilities and plugin bootstrap code |
| `templates/` | PRD, roadmap, report, folder-context, and schedule templates |
| `marketplace/` | Plugin marketplace metadata and assets |
| `docs/design/` | Design documents (files 00-10) |
| `scripts/` | Dev/build/release helper scripts |
