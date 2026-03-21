---
id: PMC-092
title: UX reviewer agent
phase: 4 - App Teardown Engine
status: todo
type: agent
estimate: 1
dependencies: [PMC-005]
---

## Description

Implement the `ux-reviewer` agent that evaluates an app teardown report (or set of screenshots and UI dumps) against established UX criteria and produces a scored review with actionable recommendations.

**Agent configuration:**
- Model: `opus`
- Tools: `Read`, `Write`, `Bash`, `Glob`, `Grep`
- Max turns: 15
- Permission mode: `acceptEdits`

**Review criteria:**

The agent evaluates against three frameworks:

1. **Nielsen&apos;s 10 Usability Heuristics:**
   - Visibility of system status
   - Match between system and the real world
   - User control and freedom
   - Consistency and standards
   - Error prevention
   - Recognition rather than recall
   - Flexibility and efficiency of use
   - Aesthetic and minimalist design
   - Help users recognize, diagnose, and recover from errors
   - Help and documentation

2. **Accessibility:**
   - Touch target sizes (minimum 48x48dp)
   - Color contrast ratios
   - Screen reader compatibility (content-desc coverage)
   - Text sizing and readability
   - Alternative text for images

3. **Mobile-specific criteria:**
   - Thumb-zone optimization
   - Loading state feedback
   - Offline handling
   - Deep linking support
   - Gesture discoverability
   - Navigation pattern consistency (tabs, drawers, back behavior)

**Output format:**
- Overall UX score: 1-10
- Strengths: list of things done well
- Issues: list with severity (critical / major / minor / cosmetic), affected screens, description
- Recommendations: prioritized list of improvements with effort estimate (low / medium / high)

## Acceptance Criteria

- [ ] Agent definition file created with specified model, tools, maxTurns, permissionMode
- [ ] Agent accepts a teardown report path (or directory of screenshots + UI dumps) as input
- [ ] Agent evaluates against all 10 Nielsen heuristics with specific findings per heuristic
- [ ] Agent evaluates accessibility criteria including touch targets, contrast, screen reader support
- [ ] Agent evaluates mobile-specific criteria including thumb zones, loading states, navigation patterns
- [ ] Agent produces overall UX score on 1-10 scale with justification
- [ ] Agent lists strengths with specific examples from the app
- [ ] Agent lists issues with severity classification (critical/major/minor/cosmetic) and affected screens
- [ ] Agent provides prioritized recommendations with effort estimates (low/medium/high)
- [ ] Output is a structured markdown report
- [ ] Agent handles incomplete teardown data gracefully (reviews what is available, notes gaps)
- [ ] System prompt includes all evaluation criteria, scoring rubric, and output format template
- [ ] Integration test verifies agent definition loads correctly

## Files to Create/Modify

- `agents/ux-reviewer/agent.yaml`
- `agents/ux-reviewer/system-prompt.md`
- `agents/ux-reviewer/templates/ux-review-report.md`
- `agents/ux-reviewer/criteria/nielsen-heuristics.md`
- `agents/ux-reviewer/criteria/accessibility.md`
- `agents/ux-reviewer/criteria/mobile-specific.md`
- `agents/ux-reviewer/tests/agent-definition.test.ts`
