---
id: PMC-050
title: Wire analytics MCPs into metrics-review skill and data-analyst agent
phase: 2 - Tool Integrations
status: done
type: integration
estimate: 1
dependencies: [PMC-034, PMC-037, PMC-047]
---

## Description

Wire the Amplitude MCP (and optionally Mixpanel MCP) into the metrics-review skill and the data-analyst agent so they can query live analytics data. Currently these components define what metrics to track and how to analyze them, but they lack direct access to the analytics platforms. This ticket connects the plumbing.

The metrics-review skill needs its `allowed-tools` updated to include Amplitude and Mixpanel MCP tool wildcards. The data-analyst agent needs the same MCP tool wildcards in its tools list, plus updated prompt instructions explaining how to use `query_events`, `get_retention`, `get_funnel`, and `get_revenue` to pull real data during analysis.

The agent should:
1. Check `settings.json` for which analytics platform is configured (amplitude, mixpanel, or both)
2. Use the appropriate MCP tools to pull event data, funnels, retention, and revenue
3. Present findings in structured markdown with charts described in text tables
4. Fall back gracefully if no analytics credentials are configured (provide guidance on setup)

## Acceptance Criteria

- [ ] Metrics-review skill `allowed-tools` includes `mcp__amplitude__*` and `mcp__mixpanel__*`
- [ ] Data-analyst agent tools list includes `mcp__amplitude__*` and `mcp__mixpanel__*`
- [ ] Data-analyst agent prompt includes instructions for querying events, retention, funnels, and revenue
- [ ] Agent checks `settings.json` for analytics platform preference
- [ ] Agent gracefully handles missing credentials with a setup guide message
- [ ] Smoke test: agent can invoke Amplitude tools and return formatted metrics

## Files to Create/Modify

- `skills/metrics-definition/SKILL.md` (modify -- update allowed-tools)
- `agents/data-analyst.md` (modify -- add MCP tools and prompt instructions)
