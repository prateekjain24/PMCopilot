---
id: PMC-049
title: Add Figma MCP server configuration
phase: 2 - Tool Integrations
status: todo
type: integration
estimate: 1
dependencies: [PMC-002]
---

## Description

Add the Figma MCP server to `.mcp.json` so that PMCopilot can read design files, inspect specific nodes, export images, and retrieve design comments directly from Figma. This unlocks design-aware workflows for PRD generation, UX review, and stakeholder communication -- PMs can reference live designs without manually exporting screenshots.

The server is invoked via `npx @anthropic/mcp-figma` and requires one environment variable: `FIGMA_TOKEN`. Once registered, the following tools become available:

- **get_file** -- Fetch the full structure of a Figma file
- **get_file_nodes** -- Retrieve specific nodes/frames within a Figma file
- **get_images** -- Export rendered images of selected frames or components
- **get_comments** -- Read comment threads on a Figma file

## Acceptance Criteria

- [ ] `.mcp.json` contains a `figma` server entry
- [ ] Server command is `npx` with args `["@anthropic/mcp-figma"]`
- [ ] Environment variable `FIGMA_TOKEN` is defined as a placeholder
- [ ] Server entry uses STDIO transport
- [ ] Tools `get_file`, `get_file_nodes`, `get_images`, `get_comments` are accessible after registration
- [ ] Smoke test: invoking the MCP server with a valid token returns a tool list without errors

## Files to Create/Modify

- `.mcp.json` (modify -- add figma server entry)
