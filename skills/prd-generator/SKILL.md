---
name: prd-generator
description: >
  Generate a Product Requirements Document (PRD) for a new feature or product.
  Supports multiple templates: Amazon PRFAQ, Google PRD, Stripe PRD, or custom.
  Can incorporate competitive research, user research, and analytics data.
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
  - Agent(prd-writer)
  - createJiraIssue
  - createConfluencePage
  - mcp__figma__*
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
   - Figma designs: If a Figma file URL is provided (via `--figma URL`), use
     `mcp__figma__*` tools to pull relevant frames and incorporate design references
     into the PRD. Reference specific frame names and embed exported image URLs.

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

6. **Publish options** (optional):
   - `--publish-confluence`: Create a Confluence page with the PRD content using
     `createConfluencePage`. Ask the user for the target
     Confluence space key if not specified.
   - `--create-jira`: Create a Jira epic or story for the PRD using
     `createJiraIssue`. Link it to the Confluence page
     if one was created. Use the PRD title as the issue summary.
   - These options are additive -- the local markdown file is always generated first.

7. **Next steps**: After the PRD is written, suggest:
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

## Graceful Degradation

This skill works best with Jira, Confluence, and Figma connected but functions without them:

- **Jira unavailable**: Skip backlog context gathering. The PRD is written from user-provided inputs and workspace files only.
- **Confluence unavailable**: The PRD is saved as a local markdown file. The `--publish-confluence` option is disabled with a note to the user.
- **Figma unavailable**: Design references are omitted. The PRD includes placeholder sections for design links that the user can fill in manually.
- All fallbacks prompt the user for manual input with clear instructions.

## Execution Protocol

1. **Context first.** Read `_Context.md` in the working folder if it exists. Respect its read/skip directives -- do not read files it tells you to skip.
2. **Profile first.** Read `${CLAUDE_PLUGIN_DATA}/pm-profile.json` if it exists. Use the user's name, role, company, and output preferences to tailor the output.
3. **Plan before execution.** Present a short plan (sources you will read, structure of the deliverable, key assumptions) and wait for the user to approve before producing the artifact.
4. **Cite sources.** When synthesizing across documents, cite the source filename for every claim (e.g., "per roadmap-h1.md" or "from GRAB-1234").
5. **Accumulate knowledge.** If prior outputs from this skill exist in the folder, reference them. Show what changed rather than starting from scratch.
