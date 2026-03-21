---
id: PMC-048
title: Add Mixpanel MCP server configuration
phase: 2 - Tool Integrations
status: todo
type: integration
estimate: 1
dependencies: [PMC-002]
---

## Description

Add the Mixpanel analytics MCP server to `.mcp.json` so that PMCopilot can query product analytics data from Mixpanel. This provides an alternative analytics backend for teams that use Mixpanel instead of (or alongside) Amplitude, enabling skills and agents to pull event data, funnels, and user behavior insights.

The server is invoked via `npx @anthropic/mcp-mixpanel` and requires one environment variable: `MIXPANEL_TOKEN`.

## Acceptance Criteria

- [ ] `.mcp.json` contains a `mixpanel` server entry
- [ ] Server command is `npx` with args `["@anthropic/mcp-mixpanel"]`
- [ ] Environment variable `MIXPANEL_TOKEN` is defined as a placeholder
- [ ] Server entry uses STDIO transport
- [ ] Smoke test: invoking the MCP server with a valid token returns a tool list without errors

## Files to Create/Modify

- `.mcp.json` (modify -- add mixpanel server entry)
