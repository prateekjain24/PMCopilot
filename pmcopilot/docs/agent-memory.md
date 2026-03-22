# Agent Memory Configuration

This document describes how memory is configured for PMCopilot agents and what each agent retains across sessions.

## How Agent Memory Works

When an agent has `memory: project` in its frontmatter, Claude Code persists context about the agent's interactions within the current project. This means the agent can recall prior analyses, reference previous findings, and build cumulative knowledge over time.

Memory is scoped to the project directory. Agents working on the same project share the same memory store, but agents running in different projects have separate memory.

Key behaviors of project memory:

- The agent remembers previous invocations and their results within the same project.
- Memory persists across sessions -- closing and reopening Claude Code does not clear it.
- Agents can reference prior work to track changes over time (e.g., comparing a competitor teardown from last month to today).
- Memory does not leak between unrelated projects.

## Agent Memory Map

| Agent | Memory Setting | What It Remembers |
|-------|---------------|-------------------|
| app-teardown | `memory: project` | Previously analyzed apps, screen inventories, navigation maps. When re-analyzing an app, it can highlight what changed since the last teardown (new screens, removed features, UI updates). |
| web-teardown | `memory: project` | Previously analyzed competitor websites, pricing snapshots, feature lists, technical stack observations. Enables tracking of competitor website evolution over time. |
| research-synthesizer | `memory: project` | Past competitive research briefs and synthesis reports. Builds cumulative competitive intelligence, referencing prior findings and noting what has shifted in the competitive landscape. |
| prd-writer | `memory: project` | Previously written PRDs, template preferences, product context, and recurring stakeholders. Can maintain consistency across related PRDs and reference prior product decisions. |
| sprint-analyst | `memory: project` | Historical sprint velocity data, team capacity patterns, recurring blockers, and carry-over trends. Enables multi-sprint trend analysis and identification of systemic issues. |
| data-analyst | None | Stateless. Each analytics query is independent. No prior query context is retained. |
| ux-reviewer | None | Stateless. Each UX review is performed fresh without reference to prior reviews. |

## When Memory Matters

Memory is most valuable for agents that perform longitudinal analysis:

- **Competitive intelligence** (app-teardown, web-teardown, research-synthesizer): Tracking how competitors evolve over weeks and months. A single teardown is useful; a series of teardowns showing trajectory is powerful.
- **Sprint analysis** (sprint-analyst): Velocity trends and team health patterns only emerge over multiple sprints. Memory enables the agent to maintain a rolling baseline.
- **PRD writing** (prd-writer): Consistent terminology, referencing prior product decisions, and maintaining alignment across a suite of related PRDs.

## Agents Without Memory

The data-analyst and ux-reviewer agents are intentionally stateless:

- **data-analyst**: Each analytics query should stand on its own. The user provides the query context, and the agent returns results. Stale cached assumptions about metric definitions or dashboard configurations could lead to errors.
- **ux-reviewer**: Each review should be an independent assessment. Prior review context could introduce anchoring bias, causing the reviewer to overlook issues it previously dismissed or to focus disproportionately on previously flagged patterns.
