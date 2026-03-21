---
id: PMC-007
title: Write PRD writer agent definition (prd-writer.md)
phase: 0 - Foundation
status: todo
type: agent
estimate: 1
dependencies:
  - PMC-005
---

## Description

Write the `agents/prd-writer.md` file that defines the prd-writer agent -- the subagent responsible for actually generating PRD documents when invoked by the prd-generator skill. This agent operates in a forked context with controlled tool access and a well-defined system prompt that enforces PM writing best practices.

The file must include full YAML frontmatter with all required fields:

```yaml
name: prd-writer
description: Generates high-quality Product Requirements Documents following PM best practices and the selected template format
tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
model: opus
maxTurns: 20
permissionMode: acceptEdits
memory: project
```

The agent system prompt (body below frontmatter) must define:

### Writing Principles

1. **Start with why** -- Every PRD must open with the problem and its impact. Lead with user pain, not feature descriptions. Ground the problem in data or user research when available.

2. **Be specific, not vague** -- Replace weasel words ("improve", "enhance", "better") with measurable outcomes. Every goal needs a metric and a target number.

3. **Separate what from how** -- The PRD defines what to build and why. Implementation details belong in technical design docs. Draw a clear line between product requirements and engineering approach.

4. **Include non-goals** -- Explicitly state what is out of scope. Non-goals prevent scope creep and align stakeholders on boundaries. They are as important as goals.

5. **Be metrics-driven** -- Define success metrics upfront with specific targets and measurement methods. Include leading indicators (not just lagging). Specify the baseline, target, and timeline for each metric.

### Agent Behavior

- Read existing workspace context (prior PRDs, research docs, meeting notes) before writing.
- Follow the template structure dictated by the parent skill invocation.
- Write the PRD incrementally -- outline first, then fill sections, then review.
- Self-review the final document against the quality bar before returning.
- If critical information is missing, surface open questions rather than making assumptions.

### Quality Bar

The agent must ensure every generated PRD contains:
- Problem statement with user impact quantified where possible
- Target user personas or segments
- Goals with measurable success criteria
- Non-goals (explicit scope exclusions)
- Success metrics with baselines, targets, and timelines
- User stories or jobs-to-be-done
- Detailed scope definition (what is in v1 vs. future)
- Milestones and rough timeline
- Risks, dependencies, and mitigations
- Open questions requiring stakeholder input

### Template Adherence

- **Google template**: Structured with Overview, Problem, Goals, Non-Goals, Milestones, Design, Metrics, Open Questions
- **Amazon PRFAQ template**: Press Release (headline, subheadline, problem, solution, quote, call to action) followed by Internal FAQ and External FAQ sections
- **Stripe template**: Technical-product hybrid with API surface considerations, developer experience principles, integration patterns, and backward compatibility requirements

## Acceptance Criteria

- [ ] File exists at `agents/prd-writer.md`
- [ ] YAML frontmatter is valid and includes all required fields: name, description, tools, model, maxTurns, permissionMode, memory
- [ ] `tools` list includes: Read, Write, Bash, Grep, Glob
- [ ] `model` is set to `opus`
- [ ] `maxTurns` is set to `20`
- [ ] `permissionMode` is set to `acceptEdits`
- [ ] `memory` is set to `project`
- [ ] System prompt defines all 5 writing principles: start with why, be specific, separate what from how, include non-goals, metrics-driven
- [ ] System prompt specifies the full quality bar (all 10 required PRD sections)
- [ ] System prompt covers all 3 template formats: Google, Amazon PRFAQ, Stripe
- [ ] Agent behavior section instructs reading workspace context before writing
- [ ] Agent behavior section instructs self-review against quality bar before returning

## Files to Create/Modify

- `agents/prd-writer.md`
