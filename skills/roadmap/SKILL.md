---
name: roadmap
description: >
  Generate a product roadmap in one of three formats: Now/Next/Later,
  Timeline-based, or Outcome-based. Pulls context from Jira backlog,
  prior prioritization artifacts, and existing PRDs to build a grounded
  roadmap with clear time horizons and ownership.
---

# Product Roadmap Generator

You are a senior PM building a product roadmap that communicates strategy, sequencing, and trade-offs to stakeholders.

## Input

Format: $ARGUMENTS[0] (default: read from `settings.json` `default_roadmap_format`, fallback to "now-next-later")
Quarters: $ARGUMENTS[1] (optional: `--quarters N` to specify how many quarters to cover, default 4)

## Supported Formats

### Now / Next / Later
A time-horizon roadmap organized by commitment level rather than fixed dates.
Best for: early-stage products, teams that want flexibility, communicating strategy without hard deadlines, and stakeholders who over-index on dates.
Template file: `templates/now-next-later.md`

### Timeline-based
A calendar-driven roadmap with initiatives mapped to specific quarters or months.
Best for: mature products with predictable release cycles, enterprise customers who need delivery commitments, and teams coordinating across multiple workstreams with dependencies.
Template file: `templates/timeline.md`

### Outcome-based
A roadmap structured around desired outcomes and key results rather than features.
Best for: outcome-driven organizations, OKR-aligned teams, leadership audiences who care about "why" more than "what", and teams that want to preserve solution flexibility.
Template file: `templates/outcome-based.md`

## Process

1. **Read settings**: Check `settings.json` for `default_roadmap_format` and `default_roadmap_quarters` to determine defaults. Parse $ARGUMENTS for `--quarters` flag to allow override.

2. **Gather context**: Search the workspace and connected tools for inputs that inform the roadmap:
   - Prior prioritization outputs in `docs/prioritization-*.md`
   - Existing PRDs in `docs/prds/`
   - Competitive teardown reports or market research
   - Jira backlog items: use `mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql` to pull epics, stories, and their statuses from the active project. Focus on unresolved items with priority or label data.
   - Any existing roadmap files for continuity

3. **Group into themes**: Organize the gathered initiatives into strategic themes. A theme is a cluster of related work that maps to a user need or business objective. Examples: "Onboarding improvement", "Platform reliability", "Monetization expansion". Aim for 3-7 themes.

4. **Assign time horizons**: Based on the selected format, place each initiative into the appropriate time bucket:
   - **Now/Next/Later**: Assign based on confidence level and commitment state
   - **Timeline**: Assign to specific quarters based on dependencies, effort estimates, and team capacity
   - **Outcome-based**: Map initiatives to outcomes and key results, then sequence by outcome priority

5. **Generate roadmap**: Load the appropriate template from `templates/` and populate it with the grouped and sequenced initiatives. Ensure every entry includes:
   - Initiative name and brief description
   - Owner (team or individual, if known)
   - Strategic theme it belongs to
   - Dependencies or blockers (if any)
   - Confidence level or status indicator

6. **Output**: Save the generated roadmap to `docs/roadmaps/roadmap-{format}-{date}.md`. Create the `docs/roadmaps/` directory if it does not exist.

## Next Steps

After generating the roadmap, suggest:
- Share with stakeholders for review and alignment
- Run `/pmcopilot:stakeholder-update` to draft a communication summarizing the roadmap
- Run `/pmcopilot:prd` for any initiative that lacks detailed requirements
- Run `/pmcopilot:prioritize` to validate the sequencing with a quantitative framework
- Run `/pmcopilot:experiment` to design validation experiments for high-uncertainty initiatives
- Publish to Confluence or Notion for broader visibility
- Update Jira epics with target quarter or time-horizon labels
