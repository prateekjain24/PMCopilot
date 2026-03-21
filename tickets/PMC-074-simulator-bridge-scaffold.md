---
id: PMC-074
title: Simulator Bridge MCP Server Scaffold
phase: 4 - App Teardown Engine
status: todo
type: mcp-scaffold
estimate: 1
dependencies: [PMC-002]
---

## Description

Scaffold the simulator-bridge MCP server, a new TypeScript + Node.js MCP server that wraps Apple `xcrun simctl` and Facebook `idb` (iOS Development Bridge) to give Claude Code direct control over iOS Simulators. This enables PMs to automate app teardowns, capture screenshots, record user flows, and interact with apps running in the Simulator -- all from within Claude Code.

The server communicates over STDIO and is located at `mcp-servers/simulator-bridge/`. It uses the following environment variables for file storage:
- `SCREENSHOT_DIR` - defaults to `${CLAUDE_PLUGIN_DATA}/screenshots/ios`
- `VIDEO_DIR` - defaults to `${CLAUDE_PLUGIN_DATA}/videos/ios`

This ticket covers only the project scaffold and server bootstrap. Individual tools are implemented in subsequent tickets (PMC-075 through PMC-079).

**Scaffold contents:**
- `package.json` with name, scripts (build, dev, test), dependencies (@modelcontextprotocol/sdk, zod), and devDependencies (typescript, vitest, @types/node)
- `tsconfig.json` configured for Node.js ESM output
- `src/index.ts` with MCP server initialization, STDIO transport setup, and environment variable configuration for SCREENSHOT_DIR and VIDEO_DIR
- `src/utils/exec.ts` - Utility wrapper around `child_process.execFile` that returns a typed Promise with stdout/stderr, used by all tool implementations to invoke `xcrun simctl` and `idb` CLI commands
- Registration in the top-level `mcp.json` configuration (from PMC-002) so Claude Code discovers this server

## Acceptance Criteria

- [ ] Directory created at `mcp-servers/simulator-bridge/`
- [ ] `package.json` includes name `@pmcopilot/simulator-bridge`, build/dev/test scripts, and correct dependencies
- [ ] `tsconfig.json` targets ES2022, module NodeNext, with strict mode enabled
- [ ] `src/index.ts` initializes the MCP server with name "simulator-bridge" and version, connects STDIO transport
- [ ] `src/index.ts` reads `SCREENSHOT_DIR` and `VIDEO_DIR` from environment with defaults based on `CLAUDE_PLUGIN_DATA`
- [ ] `src/index.ts` ensures SCREENSHOT_DIR and VIDEO_DIR directories exist on startup (creates them if missing)
- [ ] `src/utils/exec.ts` exports a typed `exec` helper that wraps `child_process.execFile` as a Promise, returning `{ stdout, stderr }`
- [ ] `src/utils/exec.ts` includes a configurable timeout (default 30 seconds) and throws a descriptive error on timeout or non-zero exit
- [ ] Server entry is added to the top-level `mcp.json` with the correct command and env configuration
- [ ] `bun install` and `bun run build` succeed without errors
- [ ] Unit test for the exec utility covers success, non-zero exit code, and timeout scenarios

## Files to Create/Modify

- `mcp-servers/simulator-bridge/package.json` - Package manifest
- `mcp-servers/simulator-bridge/tsconfig.json` - TypeScript configuration
- `mcp-servers/simulator-bridge/src/index.ts` - Server entry point
- `mcp-servers/simulator-bridge/src/utils/exec.ts` - CLI execution utility
- `mcp-servers/simulator-bridge/src/utils/exec.test.ts` - Exec utility tests
- `mcp.json` - Add simulator-bridge server entry
