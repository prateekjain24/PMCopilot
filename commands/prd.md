---
description: "Generate a Product Requirements Document using Amazon PRFAQ, Google PRD, or Stripe PRD templates"
argument-hint: "[feature name] [--template amazon|google|stripe]"
allowed-tools: [Read, Write, Bash, Grep, Glob, "Agent(prd-writer)", "createJiraIssue", "createConfluencePage", "mcp__figma__*"]
model: opus
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

## Clarification Framework

Before writing the PRD, apply Principle #1 ("Clarify before you create"). Check pm-profile.json and _Context.md first -- skip any question already answered there or in the user's prompt.

**Must-know (always ask, block execution until answered):**
- What user problem does this solve, and how do you know it's real? (evidence: user research, support tickets, data)
- If this ships and succeeds, what single metric changes and by how much?
- Who is the target user -- and who is explicitly NOT the target?

**Should-know (ask unless inferable from context):**
- What's the timeline pressure -- is there a hard deadline or external dependency?
- What has been tried before, and why didn't it work (or why isn't it enough)?
- Are there technical, regulatory, or organizational constraints that shape the solution space?

**Nice-to-know (skip unless the PM invites depth):**
- Which PRD template do you prefer (Amazon PRFAQ, Google, Stripe)?
- Who will review this PRD and what do they care about most?

Ask 2-3 questions conversationally, not as a form. If the user's prompt already answers most must-know questions, acknowledge what you understood and confirm before proceeding.

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
