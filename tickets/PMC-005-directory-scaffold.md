---
id: PMC-005
title: Create full directory structure scaffold
phase: 0 - Foundation
status: todo
type: setup
estimate: 1
dependencies:
  - PMC-001
---

## Description

Create the complete directory tree for the PMCopilot plugin so that all subsequent tickets have the correct filesystem layout to write into. This scaffold establishes the canonical structure that the plugin manifest, skills, agents, MCP servers, hooks, and templates all depend on.

The full directory structure to create:

```
pmcopilot/
  .claude-plugin/
  skills/
    prd-generator/
    roadmap-planner/
    competitive-analysis/
    user-research/
    metrics-definition/
    sprint-planning/
    stakeholder-communication/
    prioritization/
    market-sizing/
    feature-spec/
    launch-planning/
    retro-analysis/
  agents/
  mcp-servers/
    simulator-bridge/
      src/
    emulator-bridge/
      src/
    app-store-intel/
      src/
    pm-frameworks/
      src/
  hooks/
  templates/
    prd/
    roadmap/
    research/
    communication/
  settings.json  (file, not directory)
```

Each skill directory should also contain a placeholder for template files where applicable. The MCP server directories each have a `src/` subdirectory for TypeScript source files.

Use `mkdir -p` to create all directories in a single pass. Add `.gitkeep` files to empty directories so they are tracked in version control.

## Acceptance Criteria

- [ ] `.claude-plugin/` directory exists
- [ ] `skills/` directory exists with all 12 subdirectories: prd-generator, roadmap-planner, competitive-analysis, user-research, metrics-definition, sprint-planning, stakeholder-communication, prioritization, market-sizing, feature-spec, launch-planning, retro-analysis
- [ ] `agents/` directory exists
- [ ] `mcp-servers/` directory exists with 4 subdirectories, each containing a `src/` subdirectory: simulator-bridge, emulator-bridge, app-store-intel, pm-frameworks
- [ ] `hooks/` directory exists
- [ ] `templates/` directory exists with 4 subdirectories: prd, roadmap, research, communication
- [ ] Empty directories contain `.gitkeep` files for version control tracking
- [ ] Directory structure matches the plugin architecture document exactly

## Files to Create/Modify

- `.claude-plugin/`
- `skills/prd-generator/`
- `skills/roadmap-planner/`
- `skills/competitive-analysis/`
- `skills/user-research/`
- `skills/metrics-definition/`
- `skills/sprint-planning/`
- `skills/stakeholder-communication/`
- `skills/prioritization/`
- `skills/market-sizing/`
- `skills/feature-spec/`
- `skills/launch-planning/`
- `skills/retro-analysis/`
- `agents/`
- `mcp-servers/simulator-bridge/src/`
- `mcp-servers/emulator-bridge/src/`
- `mcp-servers/app-store-intel/src/`
- `mcp-servers/pm-frameworks/src/`
- `hooks/`
- `templates/prd/`
- `templates/roadmap/`
- `templates/research/`
- `templates/communication/`
