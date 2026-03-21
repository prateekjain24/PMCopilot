# 01 - Plugin Architecture

## Plugin Manifest (plugin.json)

```json
{
  "name": "pmcopilot",
  "version": "0.1.0",
  "description": "AI-powered copilot for Product Managers. Competitive teardowns via simulators and browsers, PRD generation, sprint analysis, market sizing, and more.",
  "author": {
    "name": "PMCopilot Team",
    "url": "https://github.com/pmcopilot/pmcopilot"
  },
  "license": "MIT",
  "keywords": [
    "product-management",
    "competitive-analysis",
    "prd",
    "roadmap",
    "sprint",
    "prioritization",
    "market-sizing",
    "app-teardown"
  ],
  "skills": "./skills/",
  "agents": "./agents/",
  "mcpServers": "./.mcp.json",
  "hooks": "./hooks/hooks.json"
}
```

---

## Directory Structure (Full)

```
pmcopilot/
|
|-- .claude-plugin/
|   +-- plugin.json
|
|-- skills/
|   |-- competitive-teardown/
|   |   |-- SKILL.md
|   |   |-- templates/
|   |   |   |-- teardown-report.md
|   |   |   +-- feature-matrix.md
|   |   +-- examples/
|   |       +-- grab-vs-gojek.md
|   |
|   |-- prd-generator/
|   |   |-- SKILL.md
|   |   |-- templates/
|   |   |   |-- amazon-prfaq.md
|   |   |   |-- google-prd.md
|   |   |   +-- stripe-prd.md
|   |   +-- examples/
|   |
|   |-- sprint-review/
|   |   +-- SKILL.md
|   |
|   |-- market-sizing/
|   |   |-- SKILL.md
|   |   +-- templates/
|   |       +-- tam-sam-som.md
|   |
|   |-- prioritize/
|   |   |-- SKILL.md
|   |   +-- frameworks/
|   |       |-- rice.md
|   |       |-- ice.md
|   |       |-- kano.md
|   |       +-- moscow.md
|   |
|   |-- user-research/
|   |   |-- SKILL.md
|   |   +-- templates/
|   |       |-- persona.md
|   |       |-- interview-guide.md
|   |       +-- jtbd-canvas.md
|   |
|   |-- roadmap/
|   |   |-- SKILL.md
|   |   +-- templates/
|   |       |-- now-next-later.md
|   |       +-- outcome-based.md
|   |
|   |-- experiment-design/
|   |   |-- SKILL.md
|   |   +-- templates/
|   |       +-- ab-test-plan.md
|   |
|   |-- stakeholder-update/
|   |   |-- SKILL.md
|   |   +-- templates/
|   |       |-- weekly-update.md
|   |       +-- executive-summary.md
|   |
|   |-- app-store-intel/
|   |   +-- SKILL.md
|   |
|   |-- launch-checklist/
|   |   |-- SKILL.md
|   |   +-- templates/
|   |       +-- launch-checklist.md
|   |
|   +-- metrics-review/
|       +-- SKILL.md
|
|-- agents/
|   |-- app-teardown.md
|   |-- web-teardown.md
|   |-- research-synthesizer.md
|   |-- prd-writer.md
|   |-- data-analyst.md
|   |-- sprint-analyst.md
|   +-- ux-reviewer.md
|
|-- mcp-servers/
|   |-- simulator-bridge/
|   |   |-- package.json
|   |   +-- src/
|   |       +-- index.ts            # iOS Simulator MCP (simctl + idb)
|   |
|   |-- emulator-bridge/
|   |   |-- package.json
|   |   +-- src/
|   |       +-- index.ts            # Android Emulator MCP (adb)
|   |
|   |-- app-store-intel/
|   |   |-- package.json
|   |   +-- src/
|   |       +-- index.ts            # App Store + Play Store data
|   |
|   +-- pm-frameworks/
|       |-- package.json
|       +-- src/
|           +-- index.ts            # RICE, ICE, Kano calculators
|
|-- .mcp.json                       # MCP server configurations
|
|-- hooks/
|   +-- hooks.json
|
|-- templates/
|   |-- prd/
|   |-- roadmap/
|   |-- research/
|   +-- communication/
|
+-- settings.json
```

---

## Installation Methods

### Via Marketplace (Recommended)
```bash
# Add the PMCopilot marketplace
/plugin marketplace add pmcopilot/pmcopilot-marketplace

# Install the plugin
/plugin install pmcopilot --scope project
```

### Via Git Repository
```bash
# Install directly from GitHub
/plugin install pmcopilot/pmcopilot --scope user
```

### Via Local Development
```bash
# During development, use --plugin-dir for live reload
claude --plugin-dir ./pmcopilot
```

---

## Configuration Scopes

| Scope | File Location | Use Case |
|-------|--------------|----------|
| User | `~/.claude/settings.json` | Personal PM workflows across all projects |
| Project | `.claude/settings.json` | Team-shared PM workflows (committed to git) |
| Local | `.claude/settings.local.json` | Personal overrides (gitignored) |
| Managed | Server-controlled | Org-wide PM standards |

---

## Environment Variables

The plugin uses two key environment variables throughout:

| Variable | Resolves To | Use Case |
|----------|------------|----------|
| `${CLAUDE_PLUGIN_ROOT}` | Plugin install directory | Reference bundled MCP servers, templates, scripts |
| `${CLAUDE_PLUGIN_DATA}` | `~/.claude/plugins/data/pmcopilot/` | Persistent cache (competitive intel DB, screenshots) |

---

## Settings (settings.json)

```json
{
  "default_prd_template": "google",
  "default_roadmap_format": "now-next-later",
  "default_prioritization": "rice",
  "competitive_intel_cache_days": 7,
  "auto_screenshot_resolution": "1284x2778",
  "default_market": "SEA",
  "jira_project_key": "",
  "figma_team_id": "",
  "analytics_platform": "amplitude",
  "preferred_frameworks": {
    "prioritization": "rice",
    "roadmap": "now-next-later",
    "metrics": "north-star",
    "research": "jtbd"
  }
}
```

---

## Hooks (hooks.json)

Hooks use matchers with the `mcp__server__tool` namespacing format. Four hook types are available: `command`, `http`, `prompt` (single-turn LLM check), and `agent` (multi-turn verification).

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/check-simulators.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate-prd-structure.sh"
          }
        ]
      },
      {
        "matcher": "mcp__simulator-bridge__tap|mcp__simulator-bridge__swipe|mcp__emulator-bridge__tap|mcp__emulator-bridge__swipe",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/auto-screenshot.sh"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "mcp__simulator-bridge__.*|mcp__emulator-bridge__.*",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/check-simulator-running.sh"
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
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/collect-teardown-results.sh"
          }
        ]
      }
    ]
  }
}
```

### Hook Event Reference (PMCopilot-relevant)

| Event | Fires When | Can Block | Our Use |
|-------|-----------|-----------|---------|
| `SessionStart` | Session begins | Yes | Check simulator availability |
| `PreToolUse` | Before tool runs | Yes | Validate simulator is running |
| `PostToolUse` | After tool succeeds | No | Auto-screenshot, validate PRD structure |
| `SubagentStart` | Agent spawned | Yes | Log teardown start |
| `SubagentStop` | Agent finishes | No | Collect results |
| `Stop` | Claude finishes | Yes | Generate summary |

### Hook Input/Output

Hooks receive JSON on stdin with context about the event:
```json
{
  "session_id": "abc123",
  "hook_event_name": "PostToolUse",
  "tool_name": "mcp__simulator-bridge__tap",
  "tool_input": {"device_id": "...", "x": 200, "y": 400}
}
```

Exit codes: 0 = allow (optionally write context to stdout), 2 = block (reason on stderr).

---

## Namespacing

All plugin components are automatically namespaced:

- **Skills**: `/pmcopilot:prd`, `/pmcopilot:competitive-teardown`, etc.
- **Agents**: Referenced by name in agent definitions (e.g., `app-teardown`)
- **MCP tools**: `mcp__simulator-bridge__take_screenshot` (double underscore format)
- **Wildcard access**: `mcp__simulator-bridge__*` (all tools from a server)

This prevents conflicts with other plugins and keeps the command space clean.

---

## Permission Modes (for Agents)

| Mode | Behavior | Use Case |
|------|----------|----------|
| `default` | Interactive prompts for each action | Data queries, analytics |
| `acceptEdits` | Auto-accept file writes | PRD writer, report generator |
| `dontAsk` | Auto-deny permission prompts | Read-only research |
| `bypassPermissions` | Skip all permission checks | Autonomous teardown agents |
| `plan` | Read-only, no writes | Planning and analysis |

---

## Background Execution

Agents with `background: true` in their frontmatter run without blocking the user's main conversation. This is critical for long-running teardown agents that may take 5-10 minutes.

```yaml
# In agent definition
background: true  # User can keep working while this runs
```

---

## Plugin Caching and Persistence

When installed via marketplace, the plugin is cached to `~/.claude/plugins/cache/pmcopilot/`. Important implications:

- **Templates and scripts** bundled with the plugin are available via `${CLAUDE_PLUGIN_ROOT}`
- **Competitive intelligence data**, screenshots, and cached research are stored in `${CLAUDE_PLUGIN_DATA}` and survive plugin updates
- **MCP servers** are spawned from cached location, so all dependencies must be self-contained

---

## Security Model

| Component | Permission Level | Notes |
|-----------|-----------------|-------|
| Skills (read-only) | Low risk | Just text instructions, no code execution |
| Skills (with Bash) | Medium risk | Validated via hooks |
| MCP servers | Medium risk | Sandboxed subprocess, validated inputs |
| Simulator/Emulator access | High risk | Requires explicit user approval |
| Chrome automation | High risk | Requires explicit user approval |
| Analytics API access | Medium risk | Read-only by default |
| Jira/Confluence write | Medium risk | Requires user confirmation for writes |
