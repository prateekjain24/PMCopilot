# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PMCopilot is a Claude Code plugin for Product Managers. It provides an AI-powered copilot that interacts with real PM tools -- simulators, browsers, Jira, Figma, Slack, analytics platforms -- to do research, run analysis, and produce grounded artifacts. The design docs live in `pm-plugin-docs/` (files 00-10).

You are head of product for this project.

## Plugin Architecture

PMCopilot is structured as a Claude Code plugin with four component types:

- **Skills** (`skills/<name>/SKILL.md`): User-facing slash commands invoked as `/pmcopilot:<name>`. Use YAML frontmatter with `allowed-tools`, `user-invocable: true`, `context: fork`, `model`, `effort`, `argument-hint`.
- **Agents** (`agents/<name>.md`): Autonomous subagents with their own system prompts. Use YAML frontmatter with `tools` (not `allowed-tools`), `maxTurns`, `permissionMode`, `memory`, `isolation`, `background`.
- **MCP Servers** (`mcp-servers/<name>/`): TypeScript + Node.js servers (STDIO transport) registered in `.mcp.json`. Tools namespaced as `mcp__<server>__<tool>` with wildcard `mcp__<server>__*`.
- **Hooks** (`hooks/hooks.json`): Lifecycle hooks (SessionStart, PreToolUse, PostToolUse, SubagentStop) for validation and automation.

Plugin manifest lives at `.claude-plugin/plugin.json`. Development mode: `claude --plugin-dir ./pmcopilot`.

## Key Naming Conventions

- Skills use `allowed-tools` in frontmatter; agents use `tools` (these are different fields)
- Skills do NOT have `maxTurns`; agents do
- MCP tool references: `mcp__simulator-bridge__take_screenshot` (specific) or `mcp__simulator-bridge__*` (wildcard)
- Agent references in skills: `Agent(app-teardown, web-teardown)`
- Plugin environment variables: `${CLAUDE_PLUGIN_ROOT}` (install dir), `${CLAUDE_PLUGIN_DATA}` (~/.claude/plugins/data/pmcopilot/)

## Component Inventory

### 12 Skills
competitive-teardown, prd, sprint-review, market-sizing, prioritize, user-research, roadmap, experiment, stakeholder-update, app-store-intel, launch-checklist, metrics-review

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

Skills orchestrate agents which use MCP tools. Example flow:
```
/pmcopilot:competitive-teardown "Grab vs Gojek"
  -> competitive-teardown skill (orchestrator)
    -> app-teardown agent (parallel) -> simulator-bridge MCP -> xcrun simctl/adb
    -> web-teardown agent (parallel) -> Chrome MCP -> browser automation
    -> app-store-intel MCP -> App Store/Play Store APIs
  -> research-synthesizer agent -> unified report
```

## Connected External MCP Servers

These are already connected and referenced by their server IDs in skill/agent definitions:
- **Atlassian (Jira + Confluence)**: Sprint data, ticket management, Confluence publishing
- **Slack**: Post updates, search discussions, create canvases
- **Gmail**: Draft stakeholder emails, search feedback
- **Google Calendar**: Meeting context, scheduling
- **Granola**: Meeting transcripts for user research analysis
- **Perplexity** (via n8n): Web research for market sizing
- **Chrome** (Claude in Chrome + Control Chrome): Web teardown automation

Not yet connected: Amplitude, Mixpanel, Figma, Linear, Notion.

## Implementation Roadmap

The project follows a 6-phase, 22-week plan (see `09-IMPLEMENTATION-ROADMAP.md`):
- **Phase 0** (Wk 1-2): Plugin scaffold + PRD skill + pm-frameworks MCP
- **Phase 1** (Wk 3-5): Core skills (prioritize, roadmap, experiment, user-research, stakeholder-update, launch-checklist)
- **Phase 2** (Wk 6-9): Wire already-connected MCPs into skills; add analytics MCPs
- **Phase 3** (Wk 10-12): Web teardown engine (Chrome-based competitive research)
- **Phase 4** (Wk 13-18): App teardown engine (simulator/emulator MCP servers + agent)
- **Phase 5** (Wk 19-22): Polish, memory, hooks, marketplace distribution

## Key Design Decisions

- **Android emulator is primary** for competitor app teardowns (APKs easier to obtain, no code signing issues, reliable adb interaction)
- iOS Simulator best for own-app testing and iOS-specific UX patterns
- Agent navigation uses accessibility trees first, coordinates as fallback
- Screen deduplication: >80% element overlap = same screen
- Web teardown: 2-second delay between navigations, max 50 pages per competitor, respect robots.txt
- Competitive intel cached for 7 days; screenshots cached indefinitely
- All teardown data persisted in `${CLAUDE_PLUGIN_DATA}/teardowns/`

## PM Frameworks Available via pm-frameworks MCP

Prioritization: RICE, ICE, MoSCoW, Kano, Weighted Scoring, Opportunity Scoring, Cost of Delay (CD3)
Experimentation: sample_size_calc, significance_test
Market sizing: tam_sam_som

## Permission Modes for Agents

- `acceptEdits`: app-teardown, web-teardown, prd-writer, ux-reviewer, research-synthesizer
- `default` (interactive): data-analyst, sprint-analyst
- Long-running agents (app-teardown, web-teardown) use `background: true` + `isolation: worktree`

## Build and Development

MCP servers are TypeScript + Node.js projects under `mcp-servers/<name>/`:
```bash
cd mcp-servers/<server-name>
bun install
bun run build    # compiles to dist/index.js
```

Test plugin loading:
```bash
claude --plugin-dir ./pmcopilot
```

Hook scripts live in `hooks/` and are referenced from `hooks/hooks.json`. Exit code 0 = allow, 2 = block (reason on stderr).
