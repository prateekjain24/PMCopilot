---
id: PMC-080
title: Scaffold emulator-bridge MCP server
phase: 4 - App Teardown Engine
status: done
type: mcp-scaffold
estimate: 1
dependencies: [PMC-002]
---

## Description

Scaffold the `emulator-bridge` MCP server at `mcp-servers/emulator-bridge/`. This server wraps Android Debug Bridge (adb) and the Android emulator CLI to give Claude Code full programmatic control over Android emulators -- launching devices, installing APKs, capturing screenshots/video, sending input, and inspecting UI state.

The server uses TypeScript + Node.js with STDIO transport, following the same project conventions established in PMC-002.

**Environment variables:**
- `ANDROID_HOME` -- path to Android SDK (required)
- `SCREENSHOT_DIR` -- defaults to `${CLAUDE_PLUGIN_DATA}/screenshots/android`
- `VIDEO_DIR` -- defaults to `${CLAUDE_PLUGIN_DATA}/videos/android`

The scaffold must validate that `adb` and `emulator` binaries are reachable via `ANDROID_HOME` at startup and return a clear error if they are not. It should also ensure `SCREENSHOT_DIR` and `VIDEO_DIR` exist (creating them if needed).

## Acceptance Criteria

- [ ] `mcp-servers/emulator-bridge/` directory created with `package.json`, `tsconfig.json`, and entry point
- [ ] TypeScript project compiles and runs with STDIO transport
- [ ] Environment variables `ANDROID_HOME`, `SCREENSHOT_DIR`, `VIDEO_DIR` are read and validated at startup
- [ ] `SCREENSHOT_DIR` and `VIDEO_DIR` are auto-created if they do not exist
- [ ] Startup fails with a descriptive error when `adb` or `emulator` binaries are not found
- [ ] Shared helper module for executing adb/emulator commands with proper error handling and timeout support
- [ ] Server registers with MCP and responds to `initialize` handshake
- [ ] Unit tests cover environment validation and helper utilities
- [ ] `bun install` resolves all dependencies

## Files to Create/Modify

- `mcp-servers/emulator-bridge/package.json`
- `mcp-servers/emulator-bridge/tsconfig.json`
- `mcp-servers/emulator-bridge/src/index.ts`
- `mcp-servers/emulator-bridge/src/config.ts`
- `mcp-servers/emulator-bridge/src/helpers/adb.ts`
- `mcp-servers/emulator-bridge/src/helpers/emulator.ts`
- `mcp-servers/emulator-bridge/tests/config.test.ts`
- `mcp-servers/emulator-bridge/tests/helpers/adb.test.ts`
