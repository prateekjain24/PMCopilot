---
description: "Generate concise stakeholder updates from Jira and Slack data in weekly, monthly, or exec-summary format"
argument-hint: "[format: weekly|monthly|exec-summary] [--period YYYY-MM-DD:YYYY-MM-DD]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
  - slack_send_message
  - slack_search_public_and_private
  - slack_create_canvas
  - slack_schedule_message
  - searchJiraIssuesUsingJql
  - getJiraIssue
  - createConfluencePage
  - gmail_create_draft
model: sonnet
---

# Stakeholder Update

Generate concise, action-oriented stakeholder updates by pulling data from Jira and Slack, then formatting into one of three standard templates.

## Input

Parse the format from `$ARGUMENTS[0]`. Supported values:

- `weekly` (default if not specified)
- `monthly`
- `exec-summary`

If `--period` is provided, use the specified date range in `YYYY-MM-DD:YYYY-MM-DD` format. Otherwise, default to:

- **weekly**: last 7 days
- **monthly**: last 30 days
- **exec-summary**: last 30 days

## Formats

### Weekly Update

| Section | Description |
|---------|-------------|
| TL;DR | 3 bullets max -- the most important things leadership needs to know |
| What shipped this week | Completed tickets, merged PRs, launched features |
| Key metrics movement | Numbers that moved meaningfully (up or down) |
| Blockers / needs from leadership | Anything stalled that requires escalation or a decision |
| Next week focus | Top 3-5 priorities for the coming week |

Best for: keeping the team and stakeholders aligned on short-term progress.

### Monthly Review

| Section | Description |
|---------|-------------|
| Month in review | Narrative summary of what happened and why it matters |
| OKR progress | Red / yellow / green status for each active objective and key result |
| Key wins and learnings | What went well and what the team learned from setbacks |
| Risks and mitigations | Current risks ranked by severity, with proposed mitigations |
| Next month priorities | Top priorities and expected outcomes for the upcoming month |

Best for: leadership reviews, monthly business reviews.

### Executive Summary

| Section | Description |
|---------|-------------|
| One-paragraph summary | A single paragraph capturing the overall state of the product or initiative |
| Metrics dashboard | Key numbers only -- revenue, adoption, retention, or whatever matters most |
| Strategic decisions needed | Decisions that require executive input, framed as clear options |
| Resource asks | Headcount, budget, or tooling requests with justification |

Best for: C-suite updates, board prep, investor communications.

## Clarification Framework

Before drafting the update, apply Principle #1 ("Clarify before you create"). Check pm-profile.json and _Context.md first -- skip any question already answered there or in the user's prompt.

**Must-know (always ask, block execution until answered):**
- Who is the audience for this update, and what do they care about most? (Your team cares about different things than your VP.)
- Which format: weekly, monthly, or exec-summary?

**Should-know (ask unless inferable from context):**
- What period should this cover? (Default: last 7 days for weekly, 30 days for monthly/exec)
- Are there specific wins, blockers, or decisions you want highlighted?

**Nice-to-know (skip unless the PM invites depth):**
- How should this be delivered -- Slack, email draft, Confluence, or just a local file?
- Any tone preferences? (e.g., "keep it optimistic" or "be direct about risks")

Ask 2-3 questions conversationally. If the user says "weekly update for my team," that answers format and gives a strong audience signal -- confirm and proceed.

## Process

1. **Read settings** -- Look for the Jira project key in `${CLAUDE_PLUGIN_DATA}/settings.json` or prompt the user if not found.
2. **Pull recent sprint data from Jira** -- Use `searchJiraIssuesUsingJql` to fetch completed issues, in-progress work, and blockers for the relevant period.
3. **Pull relevant Slack context** -- Use `slack_search_public_and_private` to find key decisions, announcements, and discussion threads from the period.
4. **Fallback to manual input** -- If Jira or Slack are not connected or return no data, ask the user to provide the raw information (shipped items, metrics, blockers, priorities).
5. **Draft the update** -- Assemble the content into the chosen format. Keep the tone concise and action-oriented. Avoid filler language. Every sentence should inform or prompt action.

## Output

Save the generated update to:

```
docs/updates/{format}-{YYYY-MM-DD}.md
```

Where `{format}` is one of `weekly`, `monthly`, or `exec-summary`, and `{YYYY-MM-DD}` is today's date.

## Delivery Options

After generating the update, offer these delivery methods:

### Send to Slack (`--slack-channel CHANNEL_NAME`)
Post the update directly to a Slack channel using `slack_send_message`.
For rich formatting, use `slack_create_canvas` to create a linkable canvas.

### Schedule for Later (`--schedule DATETIME`)
Schedule the update for future delivery using `slack_schedule_message`.
Useful for Monday morning status updates drafted on Friday.

### Draft Email (`--email-draft RECIPIENTS`)
Create a Gmail draft with the update content using `gmail_create_draft`.
The subject line is derived from the format and date (e.g., "Weekly Update - 2026-03-22").
Confirms draft creation with subject, recipients, and draft ID.

### Publish to Confluence
Archive the update as a Confluence page using `createConfluencePage`.

All delivery options are additive -- the local markdown file is always generated first.
If no delivery options are specified, only the local file is created.

## Graceful Degradation

This skill works best with Slack, Gmail, Jira, and Confluence connected but functions without them:

- **Jira unavailable**: The user is prompted to provide shipped items, blockers, and priorities manually. The update is drafted from user-supplied data.
- **Slack unavailable**: The `--slack-channel` and `--schedule` delivery options are disabled. The update is saved as a local markdown file only.
- **Gmail unavailable**: The `--email-draft` delivery option is disabled. The user can copy the generated markdown into an email manually.
- **Confluence unavailable**: The Confluence publishing option is disabled. The local markdown file serves as the archive.
- All fallbacks prompt the user for manual input with clear instructions.
