---
name: sprint-review
description: >
  Analyze sprint performance by pulling data from Jira, computing velocity trends,
  categorizing work, identifying risks, and drafting a review with talking points
  for the PM to present during the sprint review meeting.
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
  - Agent(sprint-analyst)
  - searchJiraIssuesUsingJql
  - getJiraIssue
  - gcal_list_events
  - slack_search_public_and_private
  - list_meetings
  - get_meeting_transcript
---

# Sprint Review

You are a senior PM preparing for a sprint review meeting. Your job is to pull sprint data, analyze it, and produce a comprehensive review document with actionable talking points.

## Input

Sprint: $ARGUMENTS[0] (a sprint ID, sprint name, or "current" to use the active sprint; defaults to "current")
Project: Parse `--project JIRA_KEY` from arguments. If not provided, check `${CLAUDE_PLUGIN_DATA}/settings.json` for `jira_project_key`. If still not found, prompt the user.

## Process

### Step 1 -- Pull Sprint Data

Use Jira MCP tools to retrieve all issues belonging to the target sprint:

- `searchJiraIssuesUsingJql` to query issues by sprint ID or sprint name within the specified project.
- For each issue, capture: key, summary, status, story points (or estimate), assignee, labels, issue type, epic link, resolution date, and any carry-over flags.
- `getJiraIssue` for detailed data on specific tickets when needed (e.g., blockers, linked issues, comments).

Delegate the bulk data pulling and initial analysis to `Agent(sprint-analyst)`.

**Fallback**: If Jira MCP is not connected or returns no data, ask the user to provide sprint data manually -- a list of tickets with their status, story points, and assignees. Proceed with whatever data is available.

#### Calendar Context (Optional)

If Google Calendar MCP is available, use `gcal_list_events` to pull
calendar events for the sprint date range. This adds context about:
- Team ceremonies (standups, retros, planning sessions held vs. skipped)
- Meeting load (total meeting hours during the sprint)
- Ad-hoc meetings (unplanned discussions that may indicate blockers or scope changes)

Include a brief "Team Ceremonies" section in the final review if calendar data is available.
If Google Calendar is not connected, skip this step silently.

#### Slack Context (Optional)

If Slack MCP is available, use `slack_search_public_and_private` to search
for sprint-related discussions during the sprint date range. Look for:
- Blockers raised and how they were resolved
- Key decisions made in channels
- Team sentiment and morale signals

#### Meeting Notes (Optional)

If Granola MCP is available, use `list_meetings` and
`get_meeting_transcript` to pull transcripts from sprint ceremonies
(standups, planning, retro) during the sprint window. Extract:
- Key decisions made during ceremonies
- Action items and their owners
- Recurring discussion themes across standups

### Step 2 -- Analyze Velocity

Calculate and compare velocity metrics:

- **Committed vs. Completed**: Total story points committed at sprint start vs. points actually completed (status = Done).
- **Completion Rate**: Percentage of committed points delivered.
- **Trend Analysis**: Compare against the last 3-5 sprints (pull historical sprint data via JQL if available). Identify whether velocity is trending up, down, or stable.
- **Anomaly Detection**: Flag any sprint where velocity deviates more than 20% from the rolling average. Note possible causes (holidays, team changes, scope additions).

### Step 3 -- Categorize Work

Break down completed and in-progress work by:

- **Type**: Features (new user-facing functionality), Bugs (defect fixes), Tech Debt (refactoring, infrastructure, upgrades), Chores (process, documentation, tooling).
- **Team or Squad**: Group by assignee team if labels or components indicate squad membership.
- **Epic Alignment**: Map completed items to their parent epics to show progress toward larger initiatives.

Present this as a breakdown table with both item counts and story point totals per category.

### Step 4 -- Identify Risks

Scan for warning signs:

- **Carry-over Items**: Issues that were in the sprint but not completed. List each with its remaining estimate and reason for carry-over if available in comments.
- **Missed Estimates**: Tickets where actual effort significantly exceeded the original estimate. Highlight patterns (e.g., a specific type of work is consistently underestimated).
- **Bottlenecks**: Tickets that spent disproportionate time in a single status (e.g., stuck in Code Review or QA). Identify systemic bottlenecks.
- **Scope Creep Indicators**: Issues added to the sprint after it started. Count them and note their total story points relative to the original commitment.

### Step 5 -- Draft Review

Assemble the final sprint review document with these sections:

**Sprint Summary Stats**
| Metric | Value |
|--------|-------|
| Sprint Name | ... |
| Duration | ... |
| Committed Points | ... |
| Completed Points | ... |
| Completion Rate | ... |
| Items Completed / Total | ... |
| Carry-over Items | ... |

**Velocity Trend**
Table or chart showing committed vs. completed points over the last 3-5 sprints with the current sprint highlighted.

**Work Breakdown**
| Category | Items | Points | % of Total |
|----------|-------|--------|------------|
| Features | ... | ... | ... |
| Bugs | ... | ... | ... |
| Tech Debt | ... | ... | ... |
| Chores | ... | ... | ... |

**Epic Progress**
Summary of how each active epic advanced during this sprint.

**Carry-over List**
| Ticket | Summary | Points | Reason |
|--------|---------|--------|--------|

**Risks and Observations**
Bulleted list of risks identified in Step 4, each with a brief explanation and suggested mitigation.

**Team Highlights**
Notable accomplishments, shout-outs, or particularly impactful deliveries worth calling out in the meeting.

**Talking Points for Sprint Review**
A numbered list of 5-8 concise talking points the PM can use to guide the sprint review meeting. These should cover: what was delivered and its user impact, what did not get done and why, velocity health, key risks to flag, and priorities for the next sprint.

## Output

Save the sprint review to:

```
docs/sprint-reviews/sprint-review-{sprint-id}-{YYYY-MM-DD}.md
```

Create the `docs/sprint-reviews/` directory if it does not exist.

## Next Steps

After generating the review, suggest:

- Update carry-over Jira tickets with revised estimates and move them to the next sprint.
- Share the review with the team via Slack using `/pmcopilot:stakeholder-update`.
- Feed velocity trends and risk patterns into roadmap planning with `/pmcopilot:roadmap`.
- Run `/pmcopilot:metrics-review` to check whether shipped features moved product metrics.

## Graceful Degradation

This skill works best with Jira, Slack, Granola, and Google Calendar connected but functions without them:

- **Jira unavailable**: The user is prompted to provide sprint data manually -- a list of tickets with status, story points, and assignees. Velocity trend analysis is limited to the current sprint only.
- **Slack unavailable**: The Slack context step is skipped silently. Blocker and decision context is omitted from the review.
- **Granola unavailable**: Meeting transcript analysis is skipped. Ceremony insights are omitted from the review.
- **Google Calendar unavailable**: The Team Ceremonies section is omitted. Meeting load analysis is skipped.
- All fallbacks prompt the user for manual input with clear instructions.

## Execution Protocol

1. **Context first.** Read `_Context.md` in the working folder if it exists. Respect its read/skip directives -- do not read files it tells you to skip.
2. **Profile first.** Read `${CLAUDE_PLUGIN_DATA}/pm-profile.json` if it exists. Use the user's name, role, company, and output preferences to tailor the output.
3. **Plan before execution.** Present a short plan (sources you will read, structure of the deliverable, key assumptions) and wait for the user to approve before producing the artifact.
4. **Cite sources.** When synthesizing across documents, cite the source filename for every claim (e.g., "per roadmap-h1.md" or "from GRAB-1234").
5. **Accumulate knowledge.** If prior outputs from this skill exist in the folder, reference them. Show what changed rather than starting from scratch.
