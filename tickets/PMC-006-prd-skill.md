---
id: PMC-006
title: Write PRD generator skill definition (SKILL.md)
phase: 0 - Foundation
status: todo
type: skill
estimate: 1
dependencies:
  - PMC-005
---

## Description

Write the `skills/prd-generator/SKILL.md` file that defines the PRD generation skill for PMCopilot. This is the first and most critical skill -- it enables Product Managers to generate comprehensive Product Requirements Documents from a brief description or problem statement.

The file must include full YAML frontmatter with all required fields:

```yaml
name: prd-generator
description: Generate comprehensive Product Requirements Documents from a problem statement or feature brief
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
  - mcp__pm-frameworks__*
context: fork
agent: prd-writer
model: opus
effort: high
argument-hint: "Describe the product or feature you want a PRD for"
```

The skill body (below the frontmatter) must include complete process instructions covering:

1. **Template selection** -- Support 3 PRD templates: Google (default, structured with goals/non-goals/milestones), Amazon PRFAQ (press release + FAQ format for working-backwards approach), and Stripe (technical-product hybrid with API considerations). The skill should read `settings.json` for the default template but allow the user to override via argument.

2. **Information gathering** -- Before generating, the skill should ask clarifying questions if the input is too vague: target users, problem being solved, success metrics, constraints, timeline.

3. **Agent delegation** -- Invoke `Agent(prd-writer)` to perform the actual document generation. Pass the gathered context, selected template, and any existing research/docs found in the workspace.

4. **Output handling** -- Write the generated PRD to a sensible location (e.g., `docs/prds/PRD-{feature-name}.md`), confirm with the user, and suggest next steps (stakeholder review, metrics definition, sprint breakdown).

5. **Quality bar** -- The generated PRD must include: problem statement, target users, goals, non-goals, success metrics with targets, user stories/jobs-to-be-done, scope definition, milestones, risks and mitigations, and open questions.

## Acceptance Criteria

- [ ] File exists at `skills/prd-generator/SKILL.md`
- [ ] YAML frontmatter is valid and includes all required fields: name, description, disable-model-invocation, user-invocable, allowed-tools, context, agent, model, effort, argument-hint
- [ ] `agent` field references `prd-writer` (matching the agent defined in PMC-007)
- [ ] `model` is set to `opus`
- [ ] `context` is set to `fork`
- [ ] `effort` is set to `high`
- [ ] Skill body documents support for 3 templates: Google, Amazon PRFAQ, Stripe
- [ ] Skill body includes complete process instructions (gathering, delegation, output, quality)
- [ ] Skill body specifies the quality bar for generated PRDs (all required sections listed)
- [ ] `argument-hint` provides clear guidance to the user on what input to provide

## Files to Create/Modify

- `skills/prd-generator/SKILL.md`
