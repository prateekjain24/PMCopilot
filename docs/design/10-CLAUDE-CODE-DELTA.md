# 10 - Claude Code Architecture Delta

This document captures what changes now that we're building on Claude Code specifically. It corrects assumptions in the earlier docs and maps our plugin design to the actual Claude Code plugin system.

---

## What We Got Right

- **MCP servers via .mcp.json** -- correct format, STDIO transport for local servers
- **Skills as SKILL.md** -- correct approach, YAML frontmatter is the right pattern
- **Subagents as markdown with YAML frontmatter** -- correct concept
- **Plugin distribution via marketplace** -- correct, official + custom marketplaces exist
- **Hooks system** -- exists and is richer than we planned

## What Needs to Change

### 1. Plugin Directory Structure (CORRECTED)

**Our original assumption**:
```
pmcopilot/
  plugin.json        <-- wrong location
  .mcp.json
  skills/
  agents/
```

**Actual Claude Code structure**:
```
pmcopilot/
  .claude-plugin/
    plugin.json      <-- manifest goes INSIDE .claude-plugin/
  skills/            <-- at plugin root, NOT inside .claude-plugin
    competitive-teardown/
      SKILL.md
    prd/
      SKILL.md
      templates/
        google-prd.md
        amazon-prfaq.md
    prioritize/
      SKILL.md
    ...
  agents/            <-- at plugin root
    app-teardown.md
    web-teardown.md
    research-synthesizer.md
    prd-writer.md
    data-analyst.md
    sprint-analyst.md
    ux-reviewer.md
  hooks/
    hooks.json
  .mcp.json          <-- at plugin root
  settings.json      <-- at plugin root
  mcp-servers/       <-- our custom MCP server source code
    simulator-bridge/
    emulator-bridge/
    app-store-intel/
    pm-frameworks/
```

### 2. Plugin Manifest (CORRECTED)

**File**: `.claude-plugin/plugin.json`

```json
{
  "name": "pmcopilot",
  "version": "0.1.0",
  "description": "The PM's copilot -- competitive teardowns, PRDs, prioritization, sprint reviews, and more",
  "author": {
    "name": "Prateek Jain",
    "email": "prateekjain24@outlook.com",
    "url": "https://github.com/prateekjain"
  },
  "license": "MIT",
  "keywords": [
    "product-management",
    "competitive-analysis",
    "prd",
    "roadmap",
    "prioritization",
    "sprint-review",
    "app-teardown"
  ],
  "skills": "./skills/",
  "agents": "./agents/",
  "hooks": "./hooks/hooks.json",
  "mcpServers": "./.mcp.json"
}
```

### 3. Skill Format (CORRECTED)

**Our original**: Had roughly the right idea but some field names were wrong.

**Actual SKILL.md frontmatter fields**:

```yaml
---
name: competitive-teardown
description: >
  Run a comprehensive competitive teardown of a mobile app or website.
  Use this when the user asks about competitor analysis, competitive
  research, or app/website teardowns.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash, Glob, Grep, Agent(app-teardown, web-teardown, research-synthesizer)
model: opus
effort: max
context: fork
agent: general-purpose
argument-hint: "[competitor-name] [platform: ios|android|web|all]"
---
```

**Key corrections**:
- `allowed-tools` not `tools` (that's for agents)
- `disable-model-invocation` controls auto-triggering
- `user-invocable` controls visibility in `/` menu
- `context: fork` runs in isolated subagent context
- `agent` specifies which agent type when using `context: fork`
- `argument-hint` shows in autocomplete
- No `maxTurns` in skills -- that's an agent field

### 4. Subagent Format (CORRECTED)

**Actual agent frontmatter fields**:

```yaml
---
name: app-teardown
description: >
  Autonomously navigate a mobile app on iOS Simulator or Android Emulator.
  Take screenshots of every key screen, map user flows, identify UX patterns.
tools: Read, Write, Bash, Glob, mcp__simulator-bridge__*, mcp__emulator-bridge__*, mcp__app-store-intel__*
disallowedTools: Edit
model: opus
permissionMode: acceptEdits
maxTurns: 50
skills:
  - app-store-intel
memory: project
isolation: worktree
effort: max
---
```

**Key corrections**:
- `tools` not `allowed-tools` (opposite of skills!)
- `disallowedTools` for deny-list
- `permissionMode` field: default, acceptEdits, dontAsk, bypassPermissions, plan
- `maxTurns` exists for agents (not skills)
- `skills` array can preload skills into agent context
- `mcpServers` can be specified per agent
- `memory` field: user, project, local
- `isolation: worktree` for git worktree isolation
- `background: true` for background execution
- MCP tools use format: `mcp__server__tool` or `mcp__server__*`

### 5. Hooks (EXPANDED)

Our original docs mentioned hooks briefly. The actual system is much richer.

**Available hook events** (relevant for PMCopilot):

| Event | Our Use Case |
|-------|-------------|
| `SessionStart` | Check simulator/emulator availability, load project context |
| `PreToolUse` | Validate MCP tool inputs before execution |
| `PostToolUse` | Auto-screenshot after simulator interactions |
| `SubagentStart` | Log which agent is starting a teardown |
| `SubagentStop` | Collect agent results for synthesis |
| `Stop` | Generate summary report when session ends |

**Hook types we should use**:

1. **Command hooks** -- run shell scripts to validate simulator state
2. **Agent hooks** -- spawn verification agents to check teardown quality

**hooks/hooks.json**:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "./hooks/check-simulators.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "mcp__simulator-bridge__tap|mcp__simulator-bridge__swipe|mcp__emulator-bridge__tap|mcp__emulator-bridge__swipe",
        "hooks": [
          {
            "type": "command",
            "command": "./hooks/auto-screenshot.sh"
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "matcher": "app-teardown|web-teardown",
        "hooks": [
          {
            "type": "command",
            "command": "./hooks/collect-teardown-results.sh"
          }
        ]
      }
    ]
  }
}
```

### 6. Tool Access Syntax (CORRECTED)

**MCP tools use namespaced format**:
- `mcp__simulator-bridge__take_screenshot` -- specific tool
- `mcp__simulator-bridge__*` -- all tools from server
- `mcp__app-store-intel__search_app_store` -- specific tool

**Agent spawning from skills**:
- `Agent(app-teardown)` -- specific agent
- `Agent(app-teardown, web-teardown)` -- multiple specific agents
- `Agent` -- any agent

**Skill loading in agents**:
```yaml
skills:
  - app-store-intel
  - pm-frameworks
```

### 7. Memory System (EXPANDED)

Claude Code has a richer memory system than we planned:

**CLAUDE.md** (project instructions we write):
```
pmcopilot/
  CLAUDE.md           <-- top-level project instructions
  .claude/
    CLAUDE.md         <-- alternative location
    rules/
      teardown-quality.md    <-- modular rules
      prd-standards.md
      naming-conventions.md
```

**Auto Memory** (Claude's own notes, persists across sessions):
```
~/.claude/projects/<project>/memory/
  MEMORY.md           <-- index (200 lines, auto-loaded)
  competitors.md      <-- topic-specific (loaded on demand)
  user-preferences.md
```

**For PMCopilot**: Agents with `memory: project` will accumulate knowledge:
- app-teardown remembers previously analyzed apps
- prd-writer learns the team's writing style
- sprint-analyst builds historical velocity data

### 8. Installation (CORRECTED)

**Development mode**:
```bash
claude --plugin-dir ./pmcopilot
```

**Install from marketplace**:
```
/plugin install pmcopilot
```

**Install with scope**:
```
/plugin install pmcopilot --scope project   # project-level
/plugin install pmcopilot --scope user      # user-level (default)
```

**Custom marketplace**:
```
/plugin marketplace add https://github.com/prateekjain/pm-marketplace
/plugin install pmcopilot@pm-marketplace
```

---

## Revised Component Inventory

### Skills (12 total, invoked via `/pmcopilot:skill-name`)

| Skill | Key Tools | context: fork? |
|-------|-----------|---------------|
| `/pmcopilot:competitive-teardown` | Agent(app-teardown, web-teardown, research-synthesizer) | Yes |
| `/pmcopilot:prd` | Agent(prd-writer) | Yes |
| `/pmcopilot:sprint-review` | Agent(sprint-analyst) | Yes |
| `/pmcopilot:market-sizing` | mcp__pm-frameworks__*, WebSearch | No |
| `/pmcopilot:prioritize` | mcp__pm-frameworks__* | No |
| `/pmcopilot:user-research` | Read, Write | No |
| `/pmcopilot:roadmap` | Read, Write | No |
| `/pmcopilot:experiment` | mcp__pm-frameworks__sample_size_calc | No |
| `/pmcopilot:stakeholder-update` | mcp__jira__*, mcp__slack__* | No |
| `/pmcopilot:app-store-intel` | mcp__app-store-intel__* | No |
| `/pmcopilot:launch-checklist` | Read, Write | No |
| `/pmcopilot:metrics-review` | Agent(data-analyst) | Yes |

### Agents (7 total)

| Agent | Model | maxTurns | Key MCP Access |
|-------|-------|----------|---------------|
| app-teardown | opus | 50 | simulator-bridge, emulator-bridge, app-store-intel |
| web-teardown | opus | 40 | playwright or Claude in Chrome |
| research-synthesizer | opus | 30 | Delegates to other agents |
| prd-writer | opus | 20 | None (pure generation) |
| data-analyst | sonnet | 20 | amplitude, mixpanel |
| sprint-analyst | sonnet | 15 | jira, linear |
| ux-reviewer | opus | 15 | None (reviews screenshots) |

### MCP Servers (4 custom)

| Server | Transport | Tools Count |
|--------|-----------|-------------|
| simulator-bridge | STDIO | 15 |
| emulator-bridge | STDIO | 16 |
| app-store-intel | STDIO | 10 |
| pm-frameworks | STDIO | 12 |

### Hooks (3 event types)

| Event | Hook Type | Purpose |
|-------|-----------|---------|
| SessionStart | command | Check simulator/emulator availability |
| PostToolUse (simulator tap/swipe) | command | Auto-screenshot after interactions |
| SubagentStop (teardown agents) | command | Collect and organize results |

---

## Impact on Implementation Roadmap

### Phase 0 adjustments:
- Use `.claude-plugin/plugin.json` for manifest
- Test with `claude --plugin-dir ./pmcopilot`
- Use actual SKILL.md frontmatter format

### Phase 4 adjustments (App Teardown):
- MCP tools namespaced as `mcp__simulator-bridge__take_screenshot`
- Agent uses `tools: mcp__simulator-bridge__*` for wildcard access
- `permissionMode: acceptEdits` so teardown doesn't prompt for every action
- `isolation: worktree` so teardown doesn't pollute main context

### New consideration: Permission modes
- Teardown agents need `permissionMode: acceptEdits` or `bypassPermissions`
- Data agents querying analytics should use `permissionMode: default` (safer)
- PRD writer can use `permissionMode: acceptEdits` (writes files)

### New consideration: Background agents
- Set `background: true` for long-running teardown agents
- User can continue working while teardown runs

---

## Key Takeaway

The Claude Code plugin system is **more capable** than what we originally designed for. The main wins:

1. **Richer hook system** -- we can auto-screenshot, validate, and collect results automatically
2. **Permission modes** -- agents can run autonomously without prompting
3. **Background execution** -- long teardowns don't block the user
4. **Memory persistence** -- agents truly learn over time
5. **Skill-to-agent delegation** -- `context: fork` + `Agent(name)` is clean
6. **Tool namespacing** -- `mcp__server__*` wildcards make access control granular
7. **Rules files** -- modular quality standards in `.claude/rules/`

No fundamental redesign needed. The architecture holds. We just need to use the correct field names and file locations.
