# MCP Servers Directory

Four custom STDIO MCP servers, all TypeScript + Node.js using FastMCP, plus three external HTTP MCP servers.

## Standard Directory Layout

```
mcp-servers/<name>/
├── src/
│   ├── index.ts          # Server entry point (FastMCP setup)
│   ├── tools/            # One file per tool + index.ts barrel
│   ├── helpers/ or utils/ # Shared utilities
│   ├── types.ts          # Shared type definitions
│   └── config.ts         # Constants and configuration (optional)
├── tests/                # Unit tests
├── package.json
├── tsconfig.json
└── dist/                 # Build output (gitignored)
```

## Build & Test

```bash
cd mcp-servers/<server-name>
bun install
bun run build    # compiles to dist/index.js
bun test         # run tests (pm-frameworks has co-located tests)
```

## Tool Definition Pattern

```typescript
import { z } from "zod";

export const myTool = {
  name: "tool_name",
  description: "What this tool does",
  parameters: z.object({
    param1: z.string().describe("Description"),
    param2: z.number().optional().describe("Optional param"),
  }),
  handler: async ({ param1, param2 }) => {
    // implementation
    return { result: "..." };
  },
};
```

## Tool Naming Convention

Tools are namespaced: `mcp__<server-name>__<tool-name>`
- Specific: `mcp__simulator-bridge__take_screenshot`
- Wildcard: `mcp__simulator-bridge__*` (all tools from that server)

## Registration in .mcp.json

```json
{
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["mcp-servers/server-name/dist/index.js"],
      "env": { "SCREENSHOT_DIR": "..." }
    }
  }
}
```

## Environment Variables

| Variable | Used By | Purpose |
|----------|---------|---------|
| `SCREENSHOT_DIR` | simulator-bridge, emulator-bridge | Screenshot output path |
| `VIDEO_DIR` | simulator-bridge, emulator-bridge | Video recording path |
| `ANDROID_HOME` | emulator-bridge | Android SDK location |
| `CACHE_DIR` | app-store-intel | Cached API responses |

## Design Decisions

- Web teardown: 2-second delay between navigations, max 50 pages per competitor
- Always respect `robots.txt` (see `src/cache/robots-parser.ts`)
- Competitive intel cached for 7 days; screenshots cached indefinitely
- All teardown data persisted in `${CLAUDE_PLUGIN_DATA}/teardowns/`

## Current Servers

| Server | Tools | Purpose |
|--------|-------|---------|
| simulator-bridge | 15 | iOS Simulator via `xcrun simctl` + `idb` |
| emulator-bridge | 16 | Android Emulator via `adb` |
| app-store-intel | 10 | App Store + Play Store data extraction |
| pm-frameworks | 12 | Prioritization, experimentation, market sizing |

## External HTTP MCP Servers

Three external HTTP MCPs are registered in `.mcp.json` and used by agents:

| Server | URL | Used By |
|--------|-----|---------|
| amplitude | `https://mcp.amplitude.com/mcp` | data-analyst agent |
| mixpanel | `https://mcp.mixpanel.com/mcp` | data-analyst agent |
| figma | `https://mcp.figma.com/mcp` | prd command, ux-reviewer agent |

Reference: `docs/design/02-MCP-SERVERS.md`
