---
id: PMC-001
title: Create plugin manifest (plugin.json)
phase: 0 - Foundation
status: todo
type: setup
estimate: 1
dependencies: []
---

## Description

Create the `.claude-plugin/plugin.json` manifest file that registers PMCopilot as a Claude Code plugin. This is the entry point that Claude Code reads to discover the plugin&apos;s capabilities, metadata, and configuration. Without this file, none of the other plugin components (skills, agents, MCP servers, hooks) will be recognized.

The manifest must declare all top-level fields: `name`, `version`, `description`, `author`, `license`, `keywords`, `skills`, `agents`, `hooks`, and `mcpServers`. The `skills` array should reference the 12 skill directories under `skills/`. The `agents` array should reference agent definitions under `agents/`. The `hooks` field should point to `hooks/hooks.json`. The `mcpServers` field should reference the `.mcp.json` configuration file.

Key values:
- **name**: `pmcopilot`
- **version**: `0.1.0`
- **description**: A Claude Code plugin for Product Managers -- provides PRD generation, roadmap planning, competitive intel, prioritization frameworks, and more.
- **author**: PMCopilot
- **license**: MIT
- **keywords**: `["product-management", "prd", "roadmap", "competitive-intel", "prioritization"]`

## Acceptance Criteria

- [ ] File exists at `.claude-plugin/plugin.json`
- [ ] File is valid JSON (passes `json` lint)
- [ ] All required manifest fields are present: name, version, description, author, license, keywords, skills, agents, hooks, mcpServers
- [ ] Running `claude --plugin-dir ./pmcopilot` loads without errors
- [ ] `/pmcopilot:` autocomplete appears in the Claude Code CLI after plugin load
- [ ] Version follows semver format (`0.1.0`)

## Files to Create/Modify

- `.claude-plugin/plugin.json`
