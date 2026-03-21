---
name: stakeholder-update
model: sonnet
effort: medium
context: fork
agent: general-purpose
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
  - mcp__claude_ai_Slack__*
  - mcp__claude_ai_Atlassian__*
argument-hint: "[format: weekly|monthly|exec-summary] [--period YYYY-MM-DD:YYYY-MM-DD]"
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

## Process

1. **Read settings** -- Look for the Jira project key in `${CLAUDE_PLUGIN_DATA}/settings.json` or prompt the user if not found.
2. **Pull recent sprint data from Jira** -- Use `mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql` to fetch completed issues, in-progress work, and blockers for the relevant period.
3. **Pull relevant Slack context** -- Use `mcp__claude_ai_Slack__slack_search_public_and_private` to find key decisions, announcements, and discussion threads from the period.
4. **Fallback to manual input** -- If Jira or Slack are not connected or return no data, ask the user to provide the raw information (shipped items, metrics, blockers, priorities).
5. **Draft the update** -- Assemble the content into the chosen format. Keep the tone concise and action-oriented. Avoid filler language. Every sentence should inform or prompt action.

## Output

Save the generated update to:

```
docs/updates/{format}-{YYYY-MM-DD}.md
```

Where `{format}` is one of `weekly`, `monthly`, or `exec-summary`, and `{YYYY-MM-DD}` is today&apos;s date.

## Next Steps

After generating the update, offer the user these options:

- **Send via Slack** -- Post the update to a chosen channel using `mcp__claude_ai_Slack__slack_send_message`.
- **Draft email via Gmail** -- Create a draft email with the update content for the user to review and send.
- **Post to Confluence** -- Publish the update as a Confluence page using `mcp__claude_ai_Atlassian__createConfluencePage` for long-term archival.
