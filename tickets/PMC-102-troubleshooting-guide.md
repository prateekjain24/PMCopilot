---
id: PMC-102
title: Write troubleshooting guide
phase: 5 - Polish and Distribution
status: todo
type: docs
estimate: 1
dependencies: [PMC-074, PMC-080]
---

## Description

Write a troubleshooting guide that helps PMs diagnose and resolve common issues when using PMCopilot. This guide should cover problems across all skill categories, with special attention to simulator/emulator issues (which are the most complex) and integration connectivity problems.

The guide should be organized as a searchable FAQ/problem-solution format so users can quickly find their specific issue.

Topics to cover:

- **Installation issues**: Plugin not loading, manifest errors, missing dependencies.
- **Skill errors**: Skills failing to start, unexpected outputs, template rendering issues.
- **Integration connectivity**: MCP servers not connecting, authentication failures, permission errors for Jira/Slack/Amplitude/Mixpanel/Figma.
- **iOS Simulator issues**: Xcode not installed, simulator not booting, screenshot capture failing, app installation failures.
- **Android Emulator issues**: SDK not found, emulator not starting, ADB connection problems, app installation failures.
- **Hook failures**: Hooks blocking unexpectedly, hook scripts not executable, JSON parsing errors.
- **Memory issues**: Agent memory corruption, memory reset procedures, memory size limits.
- **Performance**: Slow MCP server responses, large teardown sessions, screenshot storage growth.

## Acceptance Criteria

- [ ] Guide exists at `docs/troubleshooting.md`
- [ ] Organized in problem/solution format with clear section headers
- [ ] Covers at least 5 common installation and setup issues
- [ ] Covers at least 5 common integration connectivity issues (across Jira, Slack, analytics, Figma)
- [ ] Covers at least 5 iOS Simulator-specific issues with solutions
- [ ] Covers at least 5 Android Emulator-specific issues with solutions
- [ ] Covers hook debugging: how to test hooks manually, read exit codes, and check stderr output
- [ ] Covers agent memory troubleshooting: how to inspect, reset, and manage memory files
- [ ] Each problem entry includes: symptom description, likely cause, and step-by-step fix
- [ ] Includes a "Diagnostic Checklist" section that users can run through systematically
- [ ] Includes a "Getting Help" section with guidance on filing issues
- [ ] Guide is linked from the main README

## Files to Create/Modify

- `docs/troubleshooting.md` -- the troubleshooting guide
