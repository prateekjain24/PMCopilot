# End-of-Day Brief Task Template

<!--
TASK: eod-brief
CRON: 0 18 * * 1-5 (weekdays at 6 PM)
DESCRIPTION: Daily summary of decisions, actions, and open items from today
-->

You are running a scheduled task at end of day. Your job is to synthesize the day's activity, document what moved forward, identify what's still open, and flag anything that needs attention tomorrow morning.

## Instructions

1. **Summarize today's email activity**
   - Pull emails from last 8 hours (since morning)
   - List decisions communicated via email
   - Note any emails that generated open items or blockers
   - Identify threads that remain unresolved

2. **Review Slack activity from today**
   - Scan the user's frequent channels and DMs from today (last 8 hours)
   - Note decisions made in Slack
   - List any action items that came up (tag with assignee if clear)
   - Identify unresolved threads that could wait until tomorrow vs. need closure today

3. **Check calendar against outcomes**
   - Review what was scheduled for today
   - Note: which meetings had clear decisions/outcomes, which were exploratory, which need follow-up
   - Flag if any meeting attendee said "let me follow up with X" -- mark as open item

4. **Draft follow-up messages (but do not send)**
   - Identify situations where a follow-up message would be useful (closing a decision thread, thanking someone for a decision, summarizing action items)
   - Write 2-3 short message templates (email or Slack) as suggestions
   - Include: who it should go to, subject/channel, and brief body (2-3 sentences)
   - Label as "[DRAFT - for review, not sent]"

5. **Highlight forward-looking items**
   - What absolutely cannot wait until tomorrow
   - What should be priority Monday
   - Any blockers that prevent other work from proceeding

6. **Save the document** as `eod-brief-YYYY-MM-DD.md` in the working directory (use today's date)

## Output Format

Use markdown. Keep to 1-1.5 pages (~600 words max). Use short bullet points and headers. Be specific about who, what, and when. Include time references where relevant.

## Example Structure

```markdown
# End-of-Day Brief -- [DATE]

## Decisions Made Today
- Q2 budget approved (email from Sarah Chen, 11:30 AM) -- full allocation granted
- iOS deploy blockers resolved in standup -- eng team can proceed with release
- Design feedback on new wireframes finalized (Slack #design) -- ready for implementation

## Open Items / Carried Forward
- [ ] Schedule kick-off meeting for Q3 planning (assign to [name])
- [ ] Review and approve customer case study (due Friday -- can wait)
- [ ] Follow up with partnerships team on vendor contract (no update since yesterday)

## Unresolved Threads
- **#product channel** -- Feature request from customer still being discussed; consensus TBD
- **Email from [name]** -- Asked for timeline on feature; response pending engineering estimate

## Draft Follow-Up Messages
### Message 1 -- Email to Sarah Chen
- **To:** sarah.chen@company.com
- **Subject:** RE: Q2 Budget Review -- Approved
- **Body:** Sarah, thanks for the quick turnaround. I've reviewed and approved the Q2 budget allocation as discussed. I'll follow up with the financial team to confirm processing.

### Message 2 -- Slack to #design
- **To:** #design (or @[name])
- **Body:** Great feedback session today on the wireframes. The team has direction -- I'll make sure implementation stays true to the vision. Thanks for the thorough review.

## Critical for Tomorrow
- **Do not delay:** Schedule Q3 planning kick-off (send calendar invite by 9 AM)
- **Waiting on:** Engineering estimate for feature timeline (needed for customer communication)
- **Nice to have:** Approve case study so customer success can launch

## Day Summary
Solid day -- 3 key decisions moved forward. Two open items to drive tomorrow morning. No critical blockers.
```

## Notes for Execution

- Write drafts in a neutral, professional tone
- Do not actually send any messages -- only include as suggestions
- If there are no open items, note "All deliverables closed out for today"
- If a thread is complex or has multiple opinions, note that and suggest who should make the call
- Be brief on the day summary -- 1-2 sentences max
- Save exactly as: `eod-brief-YYYY-MM-DD.md`
