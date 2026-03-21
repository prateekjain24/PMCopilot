---
id: PMC-002
title: Create .mcp.json with 4 custom MCP server registrations
phase: 0 - Foundation
status: todo
type: setup
estimate: 1
dependencies:
  - PMC-001
---

## Description

Create the `.mcp.json` file at the plugin root that registers the 4 custom MCP servers PMCopilot relies on. This file tells Claude Code how to spawn and communicate with each server. All servers use STDIO transport and are implemented in TypeScript/Node.js.

The 4 MCP servers to register:

1. **simulator-bridge** -- Bridges to iOS/Android simulators for screenshot capture and UI interaction during app reviews.
2. **emulator-bridge** -- Bridges to device emulators for cross-platform testing workflows.
3. **app-store-intel** -- Fetches app metadata, ratings, reviews, and competitive data from App Store and Google Play.
4. **pm-frameworks** -- Provides structured access to PM frameworks (RICE, MoSCoW, Kano, etc.) for prioritization and analysis.

Each server entry must specify:
- `command`: `node` (or `npx tsx`)
- `args`: path to the server entry point using `${CLAUDE_PLUGIN_ROOT}` for portability (e.g., `${CLAUDE_PLUGIN_ROOT}/mcp-servers/simulator-bridge/src/index.ts`)
- `transport`: `stdio`
- `env`: any required environment variables (API keys as placeholders, NODE_ENV, etc.)

## Acceptance Criteria

- [ ] File exists at `.mcp.json` in the plugin root
- [ ] File is valid JSON
- [ ] All 4 MCP servers are listed: `simulator-bridge`, `emulator-bridge`, `app-store-intel`, `pm-frameworks`
- [ ] Each server entry uses `${CLAUDE_PLUGIN_ROOT}` for path references (no hardcoded absolute paths)
- [ ] Each server entry specifies STDIO transport
- [ ] Each server entry has a `command` and `args` array pointing to the correct `src/index.ts` entry point
- [ ] Environment variable placeholders are defined where needed (e.g., `APP_STORE_API_KEY`, `GOOGLE_PLAY_API_KEY`)

## Files to Create/Modify

- `.mcp.json`
