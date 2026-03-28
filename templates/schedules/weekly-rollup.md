# Weekly Rollup Task Template

<!--
TASK: weekly-rollup
CRON: 0 17 * * 5 (Friday at 5 PM)
DESCRIPTION: End-of-week synthesis across all work streams with forward planning
-->

You are running a scheduled task on Friday evening. Your job is to synthesize the entire work week across all communication channels and systems, document key decisions and progress, and highlight priorities for the coming week.

## Instructions

1. **Synthesize email from the entire work week**
   - Pull emails from Monday 8 AM through Friday 5 PM
   - Identify key decisions, commitments made, and major topics discussed
   - Note any unresolved conversations that carry into next week
   - Flag any patterns or themes (e.g., multiple people asking about the same feature)

2. **Synthesize Slack from the entire work week**
   - Review the user's frequent channels and DMs from Monday through Friday
   - List decisions made in Slack
   - Identify cross-channel themes or topics that came up repeatedly
   - Note any escalations or conflicts that emerged
   - Surface key unresolved threads

3. **Review calendar for the week**
   - Summarize major meetings held: sprint planning, stakeholder syncs, 1:1s
   - Note any significant outcomes or decisions from meetings
   - Identify any recurring patterns in how the week unfolded

4. **Check Jira/Linear sprint progress (if connected)**
   - Pull current sprint: tickets completed, in progress, blocked
   - Calculate approximate % complete for the sprint
   - Note any at-risk tickets or major blockers
   - If not connected, note "Jira data not available -- manually review sprint dashboard"

5. **Synthesize into key sections** with 1-2 page limit:
   - **Key Decisions Made** -- bullets of major calls, who made them, impact
   - **Open Items (Carrying to Next Week)** -- unresolved items with owner and target date if known
   - **Stakeholder Interactions** -- any major asks, feedback, or escalations
   - **Sprint/Project Progress** -- if Jira available: % complete, blockers, velocity trend
   - **Suggested Priorities for Monday** -- top 3-5 things to focus on immediately

6. **Save the document** as `weekly-rollup-YYYY-MM-DD.md` in the working directory (use Friday's date)

## Output Format

Use markdown with clear headers. Aim for 1-2 pages (~800-1000 words). Use bullets, not prose. Be specific: names, dates, and outcomes. Keep language concise and punchy.

## Example Structure

```markdown
# Weekly Rollup -- Week of [MON DATE] to [FRI DATE]

## Key Decisions Made
- **Q2 headcount plan approved** (Wed, exec sync) -- greenlit 3 eng, 1 design, 1 PM contractor role. Budget owner: CFO. Implementation starts next week.
- **Feature X timeline committed** (Thu, email from product) -- promised GA by end of Q2. Communicated to 3 customers. Eng to own timeline accountability.
- **Vendor Y contract signed** (Fri morning) -- partnership locked in for analytics platform. Goes live in 2 weeks. Partnerships team owns onboarding.

## Open Items (Carrying Into Next Week)
- [ ] **Design review for mobile v2** -- scheduled Mon 10 AM with design lead. Blocking final implementation decision.
- [ ] **Customer X feedback on roadmap** -- waiting for response from customer success. Due next Wed.
- [ ] **Engineering estimate for Feature Y** -- eng lead said "early next week" -- follow up Tue morning if not received.
- [ ] **Marketing plan for Q2 launch** -- draft due from marketing by Wed. Needs review and sign-off.

## Stakeholder Interactions
- **CFO (budget conversation)**: Positive. Got everything we asked for. Confidence high for Q2 plans.
- **Customer success team**: Flagged 2 new customer requests for consideration. Both added to backlog. No commitment made on timeline.
- **Exec team (Q2 planning)**: Aligned on OKRs. Minor pushback on one metric -- resolved with data. Team energized for the quarter.

## Sprint Progress (Week 4 of Sprint 1)
- **% Complete:** ~65% (19 of 29 tickets done)
- **Velocity:** On track (similar to prior weeks)
- **Blockers:** One iOS integration test environment issue -- eng assigned, expected resolution by Mon
- **At Risk:** Feature X mobile component -- designer marked as "waiting on design review feedback"; can unblock with Mon review

## Suggested Priorities for Monday
1. **Unblock design review** -- 10 AM sync is critical path for Feature X implementation
2. **Follow up on eng estimate** -- confirm ETA for Feature Y; customer communication depends on this
3. **Review marketing draft** -- need early sight to spot any messaging risks
4. **Customer feedback synthesis** -- identify patterns across the 2 new requests; triage for Q2 vs. backlog
5. **Roadmap communication** -- schedule customer X call for Wed to gather their feedback formally

## Notes
- Week was heavy on planning/decision-making. Light on actual implementation. Next week should shift toward execution.
- No major fires. All escalations resolved smoothly.
- Team morale is high. Good energy going into Q2.
```

## Notes for Execution

- If Jira is not connected, manually review the sprint board visible in Slack/email summaries
- Be generous with context -- another Claude session reading this next week should understand the full picture
- Use names where you know them; use role titles if not (e.g., "eng lead", "design partner")
- If there were disagreements or conflicts, note them factually without taking sides
- The "Suggested Priorities" section is advice to the user -- be specific enough to act on
- Save exactly as: `weekly-rollup-YYYY-MM-DD.md` using Friday's date
