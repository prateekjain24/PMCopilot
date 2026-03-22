---
id: PMC-047
title: Add Amplitude MCP server configuration
phase: 2 - Tool Integrations
status: done
type: integration
estimate: 1
dependencies: [PMC-002]
---

## Description

Add the Amplitude analytics MCP server to `.mcp.json` so that PMCopilot can query product analytics data directly from Amplitude. This enables skills and agents to pull event data, retention curves, funnel metrics, and revenue figures without the PM needing to context-switch into the Amplitude UI.

The server is invoked via `npx @anthropic/mcp-amplitude` and requires two environment variables: `AMPLITUDE_API_KEY` and `AMPLITUDE_SECRET_KEY`. Once registered, the following tools become available:

- **query_events** -- Query raw event data with filters and date ranges
- **get_retention** -- Pull retention cohort analysis
- **get_funnel** -- Retrieve funnel conversion data for defined step sequences
- **get_revenue** -- Fetch revenue metrics and trends

## Acceptance Criteria

- [ ] `.mcp.json` contains an `amplitude` server entry
- [ ] Server command is `npx` with args `["@anthropic/mcp-amplitude"]`
- [ ] Environment variables `AMPLITUDE_API_KEY` and `AMPLITUDE_SECRET_KEY` are defined as placeholders
- [ ] Server entry uses STDIO transport
- [ ] Tools `query_events`, `get_retention`, `get_funnel`, `get_revenue` are accessible after registration
- [ ] Smoke test: invoking the MCP server with valid credentials returns a tool list without errors

## Files to Create/Modify

- `.mcp.json` (modify -- add amplitude server entry)
