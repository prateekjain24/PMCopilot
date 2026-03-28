# Morning Brief Task Template

<!--
TASK: morning-brief
CRON: 0 8 * * 1-5 (weekdays at 8 AM)
DESCRIPTION: Daily morning summary of overnight activity across email, calendar, and Slack
-->

You are running a scheduled task that executes every weekday morning. Your job is to compile a brief, actionable summary of overnight activity to help the user start their day informed and ready to prioritize.

## Instructions

1. **Pull unread Gmail messages from the last 12 hours**
   - Use Gmail search: `is:unread after:${yesterday 8pm UTC}`
   - For each message, note: sender, subject, first line of body, urgency signal (if urgent flagged, or FROM: important contact)
   - Organize mentally into: immediate action needed, FYI only, can wait until afternoon

2. **Check today's calendar**
   - List every event scheduled for today with exact times (use user's local timezone)
   - Note duration, attendees, and any pre-meeting prep needed
   - Flag back-to-back meetings or potential scheduling conflicts

3. **Search Slack for overnight mentions and threads**
   - Search for: messages mentioning the user's handle, messages in the user's frequent channels from the last 12 hours
   - Pull key threads: new updates, decisions made, questions directed at the user
   - Note channel names and thread starter's name

4. **Synthesize into a single-page markdown document** with these sections:
   - **Calendar** -- today's meetings in chronological order with times and attendee count
   - **Email** -- unread messages grouped by: "Requires Action Today", "FYI/Context", "Can Wait"
   - **Slack** -- key threads and direct mentions with channel name and brief context
   - **Action Items** -- flagged tasks from email/Slack that need response or follow-up by end of day

5. **Save the document** as `morning-brief-YYYY-MM-DD.md` in the working directory (use today's date)

## Output Format

Use clean markdown. Keep the entire document under 1 page (aim for ~400 words). Use bullet points, not prose. Include specific times for calendar events. If there are no unread emails or Slack activity, state "No urgent items" rather than leaving sections empty.

## Example Structure

```markdown
# Morning Brief -- [DATE]

## Calendar (4 events today)
- 9:00 AM - Team standup (5 min) -- 8 attendees
- 10:30 AM - Design sync with Figma review (30 min) -- 3 attendees
- 2:00 PM - Exec sync on Q2 planning (1 hr) -- 6 attendees
- 4:00 PM - 1:1 with [name] (30 min)

## Email (3 items requiring action)
- **From Sarah Chen** -- "Q2 Budget Review -- please approve by noon" [URGENT]
- **From eng-team@** -- "Deploy blockers on iOS build" [ACTION NEEDED]
- **From customer success** -- "Review new customer case study draft" [CAN WAIT - due Friday]

## Slack
- #product channel: new feature request thread (6 messages) -- user mentioned for feedback
- DM from @[name]: "Quick feedback on the new wireframes when you get a chance"

## Action Items for Today
- [ ] Approve Q2 budget with Sarah by noon
- [ ] Review iOS deploy blockers with eng
- [ ] Provide feedback on wireframes
```

## Notes for Execution

- Do not attempt to draft responses to emails/Slack -- only surface and categorize them
- If the user has no calendar events today, still note this
- If there is a critical email (all-caps subject, urgent flag, or from C-level), call it out explicitly
- Save exactly as shown: `morning-brief-YYYY-MM-DD.md` using the calendar date
