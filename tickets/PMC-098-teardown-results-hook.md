---
id: PMC-098
title: Create teardown results hook
phase: 5 - Polish and Distribution
status: todo
type: hook
estimate: 1
dependencies: [PMC-004, PMC-091, PMC-053]
---

## Description

Implement a SubagentStop hook that collects and consolidates results when the `app-teardown` or `web-teardown` agent completes its work. The hook runs `collect-teardown-results.sh`, which gathers all artifacts produced during the teardown session -- screenshots, extracted data, analysis notes -- and produces a structured summary.

This ensures teardown outputs are reliably archived and available for downstream skills like `competitive-teardown` and `market-sizing`, even if the agent session ends unexpectedly.

The hook receives JSON on stdin with `session_id`, `hook_event_name`, `tool_name`, and `tool_input`. Exit code 0 allows normal completion; stdout can include the path to the consolidated results file.

## Acceptance Criteria

- [ ] `hooks.json` contains a SubagentStop entry matching `app-teardown` and `web-teardown` agent names
- [ ] `collect-teardown-results.sh` script is created and executable
- [ ] The script aggregates screenshots from `.pmcopilot/screenshots/<session_id>/`
- [ ] The script aggregates extracted data files (HTML extractions, app store data, accessibility dumps)
- [ ] The script produces a consolidated JSON results file at `.pmcopilot/teardowns/<app-or-site-id>/results.json`
- [ ] The results file includes metadata: timestamp, agent type, target app/site, session duration
- [ ] The results file includes a manifest of all collected artifacts with relative paths
- [ ] The script reads hook input JSON from stdin and extracts the session ID and agent name
- [ ] The script exits 0 with the results file path on stdout
- [ ] The script handles partial results gracefully -- if some artifacts are missing, it still produces a valid results file noting what was collected
- [ ] Previously collected teardown results for the same target are preserved (versioned, not overwritten)

## Files to Create/Modify

- `.pmcopilot/hooks.json` -- add SubagentStop hook entry for teardown results collection
- `.pmcopilot/hooks/collect-teardown-results.sh` -- results collection script
