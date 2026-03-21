---
id: PMC-099
title: Add graceful degradation
phase: 5 - Polish and Distribution
status: todo
type: infra
estimate: 1
dependencies: [PMC-006, PMC-011, PMC-032, PMC-035]
---

## Description

Ensure all PMCopilot skills and agents work reliably when external integrations are partially or fully unavailable. PMs use diverse toolchains -- some have Jira, others do not; some run macOS with Xcode, others do not. PMCopilot must never hard-fail due to a missing integration. Instead, it should gracefully fall back to manual input or reduced functionality with clear messaging.

Key degradation scenarios:

- **No Jira**: Sprint review, prioritization, and PRD skills accept manual input for backlog items, velocity data, and ticket references.
- **No Slack**: Stakeholder update skill outputs to local files instead of posting to channels.
- **No analytics (Amplitude/Mixpanel)**: Metrics review skill prompts for manual data entry or CSV upload.
- **No Figma**: UX reviewer and PRD skills skip design references, noting the gap.
- **Simulator/emulator crashes**: App teardown agent catches crashes, preserves partial results, and reports the failure clearly.
- **No simulator/emulator installed**: App teardown gracefully skips device-based analysis and focuses on app store data and screenshots from other sources.
- **Missing CLI tools**: Skills detect missing dependencies (e.g., `xcrun`, `adb`, `jq`) at invocation time and report exactly what is needed.

## Acceptance Criteria

- [ ] Every skill that uses an external MCP server checks for server availability before calling tools
- [ ] When an MCP server is unavailable, skills fall back to manual input prompts with clear instructions
- [ ] Error messages for missing dependencies include the exact install command (e.g., `brew install jq`, `xcode-select --install`)
- [ ] Sprint review skill works with manually provided velocity and backlog data when Jira is unavailable
- [ ] Prioritization skill works with manually provided feature lists when Jira is unavailable
- [ ] Stakeholder update skill writes to a local markdown file when Slack is unavailable
- [ ] Metrics review skill accepts manual data entry or CSV when analytics MCPs are unavailable
- [ ] App teardown agent catches simulator/emulator crashes and preserves partial results
- [ ] App teardown agent produces a useful (if limited) report when no simulator/emulator is available
- [ ] A dependency check command (`pmcopilot doctor` or equivalent) reports the status of all optional integrations
- [ ] All degradation paths are documented in the troubleshooting guide
- [ ] No skill exits with an unhandled error due to a missing external tool or service

## Files to Create/Modify

- `.pmcopilot/skills/prd.md` -- add fallback logic for missing Jira/Confluence/Figma
- `.pmcopilot/skills/prioritize.md` -- add fallback logic for missing Jira
- `.pmcopilot/skills/sprint-review.md` -- add fallback logic for missing Jira/GCal
- `.pmcopilot/skills/stakeholder-update.md` -- add fallback logic for missing Slack/Gmail
- `.pmcopilot/skills/metrics-review.md` -- add fallback logic for missing analytics
- `.pmcopilot/skills/competitive-teardown.md` -- add fallback logic for missing simulators
- `.pmcopilot/skills/app-store-intel.md` -- add fallback logic for missing MCP
- `.pmcopilot/agents/app-teardown.yml` -- add crash recovery and partial-result handling
- `.pmcopilot/hooks/check-dependencies.sh` -- dependency health check script
