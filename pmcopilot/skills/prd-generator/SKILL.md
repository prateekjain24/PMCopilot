---
name: prd-generator
description: >
  Generate a Product Requirements Document (PRD) for a new feature or product.
  Supports multiple templates: Amazon PRFAQ, Google PRD, Stripe PRD, or custom.
  Can incorporate competitive research, user research, and analytics data.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Bash, Grep, Glob, Agent(prd-writer)
context: fork
agent: general-purpose
model: opus
effort: high
argument-hint: "[feature name] [--template amazon|google|stripe]"
---

# PRD Generator

You are a senior PM writing a Product Requirements Document.

## Input

Feature or product: $ARGUMENTS[0]
Template (optional): $ARGUMENTS[1] (defaults to project setting or "google")

## Available Templates

### Google PRD Format
Sections: Overview, Goals & Non-Goals, User Stories, Detailed Requirements,
Design Considerations, Metrics & Success Criteria, Open Questions, Timeline.
Best for: most product teams, structured requirements, milestone-driven planning.
Template file: `templates/google-prd.md`

### Amazon PRFAQ Format
Sections: Press Release (future-back), FAQ (External), FAQ (Internal),
Appendix with detailed requirements.
Best for: new products, working-backwards approach, customer-centric framing.
Template file: `templates/amazon-prfaq.md`

### Stripe PRD Format
Sections: Problem Statement, Solution Overview, User Flows, API Design,
Edge Cases, Rollout Plan, Success Metrics.
Best for: API-first products, platform features, developer-facing tools.
Template file: `templates/stripe-prd.md`

## Process

1. **Read settings**: Check `settings.json` for `default_prd_template` to determine the
   default template if none is specified via argument. Parse $ARGUMENTS for `--template`
   flag to allow override.

2. **Gather context**: Search the workspace for existing materials that can inform the PRD:
   - Prior PRDs in `docs/prds/`
   - Competitive research or teardown reports
   - User research artifacts (personas, interview notes, JTBD canvases)
   - Analytics data or metrics definitions
   - Related Jira/Linear tickets (via connected MCP if available)

3. **Ask clarifying questions** if the input is too vague. Before drafting, ensure you have:
   - Who are the target users?
   - What problem are we solving and why now?
   - What does success look like (key metrics)?
   - What are the constraints (timeline, technical, regulatory)?
   - What is explicitly out of scope?

4. **Delegate to prd-writer agent**: Invoke `Agent(prd-writer)` with:
   - The gathered context and user responses
   - The selected template format
   - Any existing research or data found in the workspace
   - Instructions to follow the template structure strictly

5. **Output**: Save the generated PRD to `docs/prds/PRD-{feature-name}.md`.
   Create the `docs/prds/` directory if it does not exist.

6. **Next steps**: After the PRD is written, suggest:
   - Share with stakeholders for review
   - Run `/pmcopilot:prioritize` to score the feature
   - Run `/pmcopilot:metrics-review` to validate success metrics
   - Run `/pmcopilot:experiment` to design validation experiments
   - Create Jira/Linear tickets from the PRD milestones

## Quality Bar

Every generated PRD must include these sections with substantive content (no placeholders):

1. **Problem statement** with user impact quantified where possible
2. **Target users** with personas or segments defined
3. **Goals** with measurable success criteria
4. **Non-goals** with explicit scope exclusions
5. **Success metrics** with baselines, targets, and timelines
6. **User stories** or jobs-to-be-done
7. **Detailed scope** definition (what is in v1 vs. future)
8. **Milestones** and rough timeline
9. **Risks**, dependencies, and mitigations
10. **Open questions** requiring stakeholder input
