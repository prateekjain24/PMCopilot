---
id: PMC-094
title: Enable agent memory config
phase: 5 - Polish and Distribution
status: todo
type: infra
estimate: 1
dependencies: [PMC-007, PMC-036, PMC-091]
---

## Description

Configure persistent memory for key PMCopilot agents so they accumulate project-specific knowledge across sessions. Agents with `memory: project` retain context that improves their outputs over time:

- **prd-writer** learns the user&apos;s writing style, preferred section ordering, and recurring stakeholders so future PRDs require fewer edits.
- **sprint-analyst** accumulates velocity data, sprint-over-sprint trends, and team capacity patterns for increasingly accurate forecasts.
- **app-teardown** remembers previously analyzed apps, their UX patterns, and identified issues so repeat analyses highlight deltas rather than re-stating known findings.

Memory must be scoped per project directory so that different products do not leak context into each other.

## Acceptance Criteria

- [ ] Each agent definition (prd-writer, sprint-analyst, app-teardown) includes `memory: project` in its YAML configuration
- [ ] Memory files are stored under `.pmcopilot/memory/<agent-name>/` within the project root
- [ ] Memory persists across Claude Code sessions for the same project directory
- [ ] Memory is isolated per project -- switching project directories yields a clean memory namespace
- [ ] prd-writer memory captures writing style preferences (tone, section order, terminology)
- [ ] sprint-analyst memory captures historical velocity data and capacity trends
- [ ] app-teardown memory captures previously analyzed app identifiers and key findings
- [ ] A `--reset-memory <agent>` flag or command is available to clear an agent&apos;s accumulated memory
- [ ] Memory files do not exceed a configurable size limit (default 100 KB per agent) with automatic summarization when approaching the limit
- [ ] Documentation in agent files explains what each agent remembers and how to reset it

## Files to Create/Modify

- `.pmcopilot/agents/prd-writer.yml` -- add `memory: project` and memory schema
- `.pmcopilot/agents/sprint-analyst.yml` -- add `memory: project` and memory schema
- `.pmcopilot/agents/app-teardown.yml` -- add `memory: project` and memory schema
- `.pmcopilot/memory/` -- directory scaffold for per-agent memory storage
- `docs/agent-memory.md` -- internal documentation on the memory system
