# Sprint Digest Task Template

<!--
TASK: sprint-digest
CRON: 0 9 * * 1-5 (weekdays at 9 AM)
DESCRIPTION: Quick daily snapshot of sprint health, progress, and blockers
-->

You are running a scheduled task every weekday morning. Your job is to pull live sprint data and produce a quick 10-15 line digest that gives the user an instant view of sprint health, progress, and anything that needs attention today.

## Instructions

1. **Locate the Jira project key**
   - Look for a file named `_Context.md` in the working directory
   - This file should contain: Jira project key (e.g., "PROD", "ENG", "MARS"), current sprint number/name
   - If the file does not exist, note that Jira configuration is needed
   - Extract the project key and sprint identifier -- you will need this for the API calls

2. **Pull current sprint data from Jira**
   - Query the active sprint for the project
   - Get ticket count by status: "To Do", "In Progress", "In Review", "Done"
   - Pull all "In Progress" tickets: assignee, title, status time (how long has it been in this status)
   - Pull all "Blocked" tickets: assignee, title, blocker reason if available
   - Get story points: total planned, completed to date

3. **Analyze sprint health metrics**
   - Days remaining in sprint (assume 2-week sprints by default; adjust if known)
   - Calculate % complete: (story points done / total story points) x 100
   - Calculate burn rate: (story points done this week / days elapsed in sprint)
   - Extrapolate: will the sprint finish on time at current burn rate?
   - Identify "stalled" tickets: In Progress or In Review for 2+ days with no recent update

4. **Highlight at-risk items**
   - Blocked tickets: reason for block, who owns unblocking
   - Stalled tickets: why is this not moving? Who is assigned?
   - High-complexity tickets still in To Do: need to be pulled in early or will slip

5. **Synthesize into compact digest** (10-15 lines max)
   - Daily snapshot format: one sentence per status
   - Include: total tickets, % complete, days remaining, burn rate verdict
   - Call out: blockers by name, stalled tickets, anything shipping today/tomorrow
   - Format as easy-to-scan bullet list or short paragraph

6. **Save the document** as `sprint-digest-YYYY-MM-DD.md` in the working directory (use today's date)

## Output Format

Keep it SHORT. This is a daily briefing, not a comprehensive report. Aim for 15-20 lines absolute max (excluding this header). Use bullets. Be direct: issue-per-line format.

## Example Structure

```markdown
# Sprint Digest -- [DATE] | [SPRINT NAME/NUMBER]

## Overview
- **Sprint:** PROD Sprint 12 (Mar 24 -- Apr 6)
- **Days Remaining:** 7 days
- **Progress:** 42/78 story points complete (54%)
- **Burn Rate:** On track (6 points/day, need 5.1/day to finish)

## Status Snapshot
- **To Do:** 12 tickets (18 points)
- **In Progress:** 8 tickets (16 points) -- all moving
- **In Review:** 5 tickets (8 points)
- **Done:** 19 tickets (42 points)

## Blockers
- **Ticket PROD-342** (iOS auth integration) -- blocked on API keys from infra team. Owner: @eng-lead. Unblock target: today.
- **Ticket PROD-289** (payment flow) -- QA env down. Owner: @qa-lead. Unblock target: tomorrow AM.

## At-Risk / Stalled
- **Ticket PROD-251** (analytics dashboard) -- In Progress for 3 days, no recent activity. Assigned to @dev-x. Check in today -- may need help.
- **Ticket PROD-267** (new feature UI) -- still in To Do, high complexity (8 points). Needs to move to In Progress today or will slip.

## Shipping This Sprint Cycle
- **Today:** Merge iOS build (pending code review, expecting sign-off by EOD)
- **Tomorrow:** Deploy to staging for customer testing
- **This week:** GA release (on track)

## Quick Verdict
Green status. On pace. Two blockers being actively resolved. One stalled ticket needs a check-in. No slippage risk at this moment.
```

## Notes for Execution

- Use Jira API or direct tool calls to pull live data -- do not rely on cached dashboards
- Be direct and factual: "In Progress for 3 days" is better than "seems slow"
- If a ticket is stalled, the user needs to know: who is assigned, what's the blocker, and suggested action (pair, escalate, reassign)
- Burn rate calculation: if 7 days remain and 36 points left, need 36/7 = 5.1 points/day. If current rate is 6/day, we're ahead -- call it "on track"
- "Blockers" section: only external or hard blockers (infrastructure down, missing approval). If it's just "waiting for feedback", that goes in "at-risk"
- If sprint is looking to slip (burn rate < required rate), flag immediately and note by how much
- Save exactly as: `sprint-digest-YYYY-MM-DD.md` using today's date

## Field Notes for Future Runs

- This task runs every weekday at 9 AM
- Use this to track daily sprint momentum; combine with eod-brief for full picture
- If the same ticket is "stalled" on consecutive days, that's a signal to escalate or reassign
- Over time, team's burn rate will stabilize -- this baseline helps spot anomalies
