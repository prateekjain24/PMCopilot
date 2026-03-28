# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PMCopilot is a Claude Code plugin for Product Managers. It provides an AI-powered copilot that interacts with real PM tools -- simulators, browsers, Jira, Figma, Slack, analytics platforms -- to do research, run analysis, and produce grounded artifacts. The design docs live in `docs/design/` (files 00-10).

You are head of product for this project.

## PMCopilot Philosophy

PMCopilot is opinionated about how PMs should work with AI. These eight principles are enforced across all skills, agents, and commands:

1. **Clarify before you create.** Never generate a strategic artifact from a vague prompt. Ask the questions a great PM mentor would ask -- questions that force the PM to sharpen their own thinking before the tool starts working. Every command defines a Clarification Framework with must-know questions (block execution until answered), should-know questions (ask unless inferable from context), and nice-to-know questions (skip unless the PM invites depth). Two good questions upfront save ten minutes of wrong output. Check `pm-profile.json` and `_Context.md` first -- if they already provide the answer, confirm rather than re-ask. The question burden should decrease over time as the tool learns the PM's context. See the Clarification Protocol section below for full details.
2. **Context before execution.** Read `_Context.md` in the working folder (if it exists) before reading other files. Respect its read/skip directives -- do not read files it tells you to skip. Then read `${CLAUDE_PLUGIN_DATA}/pm-profile.json` for user identity and output preferences.
3. **Plan before execution.** For any multi-step task, present a short plan (sources to read, structure of the deliverable, key assumptions) and wait for user approval before producing the artifact. A 30-second review prevents 10 minutes of wrong output.
4. **Cite your sources.** Every claim must trace back to a file, a Jira ticket, a Slack message, or a data point. Use inline citations like "per roadmap-h1.md" or "from GRAB-1234". No unattributed assertions.
5. **Accumulate, don't repeat.** Agents with project memory should reference prior work. Show what changed rather than starting from scratch. If a competitive teardown was run last month, the new one should note what shifted.
6. **Separate signal from noise.** `_Context.md` tells you what matters in a folder. A folder with 40 files but only 5 relevant ones should not produce output that mixes current strategy docs with old brainstorm notes.
7. **Ship a summary.** Every multi-agent workflow must produce a `what-changed.md` summary listing what each sub-agent found, what changed since the last run, and key cross-cutting themes.
8. **Automate the routine.** Morning briefs, sprint digests, competitive pulses -- these are best run as scheduled tasks, not manually triggered every time. The `/pmcopilot:setup` command helps users set these up.

If `pm-profile.json` does not exist when a session starts, suggest running `/pmcopilot:setup` to personalize the experience.

## Clarification Protocol

Principle #1 -- "Clarify before you create" -- is PMCopilot's defining behavior. This section explains how it works across the system.

### Why Clarification Matters

The biggest waste in PM work isn't bad execution -- it's executing the wrong thing clearly. When a PM says "write a PRD for notifications," they know what they mean but haven't articulated scope, audience, the problem being solved, or how success gets measured. PMCopilot treats clarifying questions not as overhead but as a **thinking tool** that helps the PM do better work.

### Three-Tier Question Model

Every command that produces an artifact defines a Clarification Framework with three tiers:

| Tier | Rule | Typical count |
|------|------|---------------|
| **Must-know** | Always ask. Do NOT generate the artifact until these are answered. | 2-3 per command |
| **Should-know** | Ask unless the answer is already in pm-profile.json, _Context.md, or the user's prompt. | 1-2 per command |
| **Nice-to-know** | Skip unless the PM seems open to a longer conversation. | 0-1 per command |

### Command Categories and Clarification Depth

Not every command needs the same level of clarification:

| Category | Commands | Clarification depth |
|----------|----------|-------------------|
| **Generation** (creates a new artifact) | prd, roadmap, experiment, stakeholder-update, user-research | Full framework: 2-4 questions before execution |
| **Analysis** (evaluates existing data) | competitive-teardown, prioritize, market-sizing, metrics-review, sprint-review, launch-checklist | Scoping questions: 1-3 to define boundaries |
| **Lookup** (retrieves specific data) | app-store-intel, setup | Light touch: 0-1 quick confirmation |

### Progressive Context Reduction

The clarification burden must decrease over time. Three mechanisms make this happen:

1. **pm-profile.json** stores the PM's defaults -- product line, market, team size, preferred frameworks, stakeholder audience. Commands check the profile first and skip questions already answered there.
2. **_Context.md** in the working folder provides project-level context. If it says "GrabFood Indonesia reactivation campaign," the PRD command already knows the product, market, and strategic area.
3. **In-prompt inference.** If the PM writes "/pmcopilot:prd push notification opt-in for GrabFood targeting churned users in ID to improve 14-day reactivation rate," all must-know questions are answered -- acknowledge and move on.

### Question Quality Guidelines

Questions should feel like a sharp PM mentor, not a bureaucratic form:

| Instead of this... | Ask this... |
|---|---|
| "What's the feature name?" | "What user problem does this solve, and how do you know it's real?" |
| "Which metric?" | "If this ships and succeeds, what number changes and by how much?" |
| "Who's the target?" | "Who's the target user -- and who is explicitly NOT the target?" |
| "What's the scope?" | "What's the smallest version of this that still tests your hypothesis?" |
| "Any constraints?" | "What's the one thing that could kill this project?" |

### Anti-Patterns to Avoid

- **Question fatigue.** If pm-profile.json and _Context.md already answer most questions, don't re-ask. Confirm and move.
- **Interrogation mode.** Never dump all questions at once. Ask 2-3 critical ones first, then follow up based on answers.
- **Blocking simple tasks.** "Compare Grab vs Gojek ratings" should not trigger 5 questions. Infer what you can, ask at most one ("Any specific markets, or should I use SG?").
- **Repeating across sessions.** If the PM answered "I work on GrabFood" yesterday and pm-profile.json has it, do not ask again today.

## Plugin Architecture

PMCopilot is structured as a Claude Code plugin with four component types:

- **Commands** (`commands/<name>.md`): User-facing slash commands invoked as `/pmcopilot:<name>`. Use YAML frontmatter with `description`, `argument-hint`, `allowed-tools`, `model`.
- **Skills** (`skills/<name>/SKILL.md`): Background knowledge auto-activated by Claude based on description match. Use YAML frontmatter with `name`, `description`, `allowed-tools`.
- **Agents** (`agents/<name>.md`): Autonomous subagents with their own system prompts. Use YAML frontmatter with `tools` (not `allowed-tools`), `maxTurns`, `permissionMode`, `memory`, `isolation`, `background`.
- **MCP Servers** (`mcp-servers/<name>/`): TypeScript + Node.js servers (STDIO transport) registered in `.mcp.json`. Tools namespaced as `mcp__<server>__<tool>` with wildcard `mcp__<server>__*`.
- **Hooks** (`hooks/hooks.json`): Lifecycle hooks that fire automatically at key moments (SessionStart, PreToolUse, PostToolUse, Stop, SubagentStop) to enforce quality and surface insights without user action.

Plugin manifest lives at `.claude-plugin/plugin.json`. Development mode: `claude --plugin-dir .` (from repo root).

## Hooks Architecture

Hooks are PMCopilot's invisible quality layer. They fire automatically at lifecycle events, catching problems before they ship and surfacing insights the PM would otherwise miss. All hooks are configured in `hooks/hooks.json`.

### Hook Types

PMCopilot uses three of the four available hook types:

- **command**: A shell script. Zero LLM cost. Best for data processing, file checks, and snapshot comparisons. Exit code 0 = allow, 2 = block (reason on stderr). Stdout text is injected into Claude's context for SessionStart hooks.
- **prompt**: A single-turn LLM call. Low cost (~0.001-0.003 per fire). Best for judgment calls like tone checking or quality gating. Must respond with `{"ok": true}` or `{"ok": false, "reason": "..."}`.
- **agent**: A multi-turn subagent with Read, Grep, Glob tools. Higher cost but can read and analyze files. Best for complex verification like PRD rubric checks. Uses `if` field for fine-grained filtering (e.g., `Write(*prd*)|Edit(*prd*)`).

### 7 PM-Value Hooks

| Hook | Event | Type | What It Does |
|------|-------|------|-------------|
| Smart Session Start | SessionStart | command | Injects PM profile, folder context, stale data warnings, and unfinished work into session context |
| Communication Tone Check | PreToolUse | prompt | Reviews outbound Slack/email messages for clarity, tone, conciseness, and actionability before sending |
| Jira Ticket Quality Gate | PreToolUse | prompt | Validates acceptance criteria, scope clarity, story points, and issue type before creating tickets |
| PRD Quality Gate | PostToolUse | agent | Runs a 7-point rubric (metrics, non-goals, edge cases, user stories, citations, dependencies, no TBD) on any PRD/spec file after write/edit |
| Sprint Anomaly Detector | PostToolUse | command | Parses Jira query results for stale tickets (3+ days no update), blocked items, missing story points, low sprint completion |
| Competitive Delta Tracker | PostToolUse | command | Compares app-store-intel results against stored snapshots, flags rating changes, new versions, sentiment shifts |
| Citation Verifier | Stop | prompt | Checks that data points, competitor claims, and quotes in the final response are properly attributed to sources |

### Infrastructure Hooks (pre-existing)

- **check-simulators.sh** (SessionStart/command): Detects available iOS Simulators and Android Emulators
- **check-simulator-running.sh** (PreToolUse/command): Ensures a simulator/emulator is running before bridge tool calls
- **auto-screenshot.sh** (PostToolUse/command): Captures screenshot after tap/swipe actions during app teardowns
- **collect-teardown-results.sh** (SubagentStop/command): Collects output from app-teardown and web-teardown agents

### Hook Data Flow

All hooks receive a JSON payload on stdin containing `session_id`, `transcript_path`, `cwd`, and (for tool hooks) `tool_name`, `tool_input`, `tool_response`. Command hooks that write to stdout inject that text into Claude's context. The `matcher` field filters by tool name (supports regex and wildcards). The `if` field on agent hooks adds file-path-level filtering.

### Adding New Hooks

When adding hooks, choose the cheapest type that solves the problem:
1. Can a shell script do it? Use **command** (zero LLM cost).
2. Does it need judgment but not file access? Use **prompt** (single LLM call).
3. Does it need to read and reason about files? Use **agent** (multi-turn, higher cost).

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

Hook scripts live in `hooks/` and are referenced from `hooks/hooks.json`. All scripts must be executable (`chmod +x`). Exit code 0 = allow, 2 = block (reason on stderr). Command hooks use `set -euo pipefail` and read JSON from stdin. See the Hooks Architecture section above for the full inventory.

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
