---
id: PMC-091
title: App teardown agent
phase: 4 - App Teardown Engine
status: done
type: agent
estimate: 1
dependencies: [PMC-005, PMC-074, PMC-080]
---

## Description

Implement the `app-teardown` agent that autonomously navigates and documents a mobile app running in an Android emulator. This agent is the core of Phase 4 -- it installs an app, systematically explores every screen, captures screenshots, maps the navigation graph, and produces a comprehensive teardown report.

**Agent configuration:**
- Model: `opus`
- Tools: `Read`, `Write`, `Bash`, `Glob`, simulator-bridge MCP tools (wildcard), emulator-bridge MCP tools (wildcard), app-store-intel MCP tools (wildcard)
- Max turns: 50
- Permission mode: `acceptEdits`
- Memory: `project`
- Isolation: `worktree`
- Background: `true`

**Navigation strategy:**
1. Use `dump_ui` to get the accessibility tree as the primary method for understanding screen content
2. Fall back to coordinate-based interaction when accessibility tree elements are not tappable or lack sufficient metadata
3. **Screen deduplication**: if >80% of UI elements overlap between two dumps, consider them the same screen (avoid revisiting)

**Teardown workflow:**
1. Boot emulator (or use existing running device)
2. Install APK and launch the app
3. Fetch app metadata from app-store-intel for context
4. Systematically explore: start from main screen, tap every interactive element, record each new screen
5. For each screen: capture screenshot, dump UI hierarchy, note the activity name, document interactive elements
6. Build a navigation graph (screen -> action -> screen)
7. Document onboarding flow, key user journeys, permission prompts, error states
8. Produce a structured teardown report as a markdown file with embedded screenshot references

## Acceptance Criteria

- [ ] Agent definition file created with specified model, tools, maxTurns, permissionMode, memory, isolation, background settings
- [ ] Agent boots or connects to an Android emulator automatically
- [ ] Agent installs and launches the target APK
- [ ] Agent fetches app metadata from app-store-intel for context enrichment
- [ ] Agent uses `dump_ui` (accessibility tree) as primary navigation method
- [ ] Agent falls back to coordinate-based taps when accessibility data is insufficient
- [ ] Screen deduplication implemented: >80% element overlap = same screen (skipped)
- [ ] Agent captures screenshot for every unique screen discovered
- [ ] Agent builds a navigation graph mapping screens to transitions
- [ ] Agent handles common interruptions: permission dialogs, system popups, crash dialogs
- [ ] Agent produces a structured markdown teardown report with: app overview, screen inventory, navigation map, onboarding analysis, key observations
- [ ] Agent respects maxTurns limit and produces partial report if exploration is incomplete
- [ ] Agent cleans up (clears app data) after teardown if configured to do so
- [ ] System prompt includes navigation strategy, dedup rules, and output format instructions
- [ ] Integration test verifies agent definition loads and tool references resolve

## Files to Create/Modify

- `agents/app-teardown/agent.yaml`
- `agents/app-teardown/system-prompt.md`
- `agents/app-teardown/helpers/screen-dedup.ts`
- `agents/app-teardown/helpers/nav-graph.ts`
- `agents/app-teardown/templates/teardown-report.md`
- `agents/app-teardown/tests/screen-dedup.test.ts`
- `agents/app-teardown/tests/nav-graph.test.ts`
