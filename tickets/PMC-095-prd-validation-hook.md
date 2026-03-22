---
id: PMC-095
title: Create PRD validation hook
phase: 5 - Polish and Distribution
status: done
type: hook
estimate: 1
dependencies: [PMC-004]
---

## Description

Implement a PostToolUse hook that automatically validates PRD structure whenever a PRD file is written or edited. The hook triggers on `Write` and `Edit` tool invocations, runs `validate-prd-structure.sh`, and ensures every PRD contains the required sections before the workflow continues.

Hook mechanics follow the standard convention:
- **Exit code 0**: validation passes; optional context written to stdout is injected into the session.
- **Exit code 2**: validation fails; the reason is written to stderr, blocking the operation so the agent can fix the issue.

The hook receives JSON on stdin containing `session_id`, `hook_event_name`, `tool_name`, and `tool_input`.

## Acceptance Criteria

- [ ] `hooks.json` contains a PostToolUse entry that matches `Write` and `Edit` tool names targeting PRD files
- [ ] `validate-prd-structure.sh` script is created and executable
- [ ] The script checks for required PRD sections: Problem Statement, Goals, User Stories, Success Metrics, Scope, and Timeline
- [ ] Validation passes (exit 0) when all required sections are present, with a summary written to stdout
- [ ] Validation fails (exit 2) when sections are missing, with a clear error on stderr listing which sections are absent
- [ ] The script reads hook input JSON from stdin and extracts the file path from `tool_input`
- [ ] The hook only fires for files matching PRD naming patterns (e.g., `*prd*`, `*PRD*`, `*product-requirements*`)
- [ ] Non-PRD file writes/edits are ignored (exit 0, no output)
- [ ] The script handles edge cases: empty files, binary files, files without markdown structure

## Files to Create/Modify

- `.pmcopilot/hooks.json` -- add PostToolUse hook entry for PRD validation
- `.pmcopilot/hooks/validate-prd-structure.sh` -- validation script
