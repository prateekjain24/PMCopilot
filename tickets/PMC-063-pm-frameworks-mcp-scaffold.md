---
id: PMC-063
title: PM Frameworks MCP Server Scaffold
phase: 4 - App Teardown Engine
status: todo
type: mcp-scaffold
estimate: 1
dependencies: [PMC-002]
---

## Description
Scaffold the pm-frameworks MCP server that will expose product management prioritization and analysis frameworks as tools callable by Claude Code. This server is the foundation for all Phase 4 framework tools (RICE, ICE, Kano, MoSCoW, TAM/SAM/SOM).

The MCP server uses:
- **Runtime**: TypeScript + Node.js
- **Transport**: STDIO (standard input/output, suitable for Claude Code plugin integration)
- **SDK**: FastMCP (the TypeScript MCP SDK for building MCP servers)
- **Location**: `mcp-servers/pm-frameworks/`

The scaffold must set up the complete project structure so that subsequent tickets (PMC-064 through PMC-068) can add individual tools by simply creating new tool definition files and registering them in the entry point.

The entry point (`src/index.ts`) should initialize the FastMCP server with STDIO transport, register all tools from a tools directory, and handle graceful shutdown. The architecture should use a convention-based tool registration pattern where each tool file exports a standard shape that the entry point auto-discovers and registers.

## Acceptance Criteria
- [ ] Directory `mcp-servers/pm-frameworks/` created with standard Node.js/TypeScript project layout
- [ ] `package.json` configured with name `@pmcopilot/pm-frameworks`, TypeScript build scripts, FastMCP dependency, and `bin` entry pointing to compiled output
- [ ] `tsconfig.json` configured for Node.js with strict mode, ES2022 target, module NodeNext, and output to `dist/`
- [ ] `src/index.ts` entry point initializes FastMCP server with STDIO transport and server metadata (name: "pm-frameworks", version: "0.1.0")
- [ ] Tool registration pattern: entry point auto-discovers and registers all tool modules exported from `src/tools/index.ts`
- [ ] `src/tools/index.ts` barrel file that re-exports all tool definitions (initially empty, ready for PMC-064 through PMC-068)
- [ ] Shared types file `src/types.ts` with common interfaces (e.g., `ToolDefinition`, score result types)
- [ ] Shared validation utilities in `src/utils/validation.ts` for parameter range checking (1-10 scales, percentage 0-100, positive numbers)
- [ ] Build script (`bun run build`) compiles TypeScript to `dist/` and produces a runnable entry point
- [ ] Dev script (`bun run dev`) runs the server in watch mode for local development
- [ ] Server starts successfully via STDIO, responds to MCP `initialize` handshake, and reports empty tool list
- [ ] `.gitignore` excludes `node_modules/`, `dist/`, and `.env`
- [ ] README with basic setup and development instructions

## Files to Create/Modify
- `mcp-servers/pm-frameworks/package.json` - Package manifest with dependencies and scripts
- `mcp-servers/pm-frameworks/tsconfig.json` - TypeScript configuration
- `mcp-servers/pm-frameworks/src/index.ts` - FastMCP server entry point with STDIO transport
- `mcp-servers/pm-frameworks/src/tools/index.ts` - Tool barrel file (initially empty exports)
- `mcp-servers/pm-frameworks/src/types.ts` - Shared type definitions
- `mcp-servers/pm-frameworks/src/utils/validation.ts` - Parameter validation helpers
- `mcp-servers/pm-frameworks/.gitignore` - Git ignore rules
