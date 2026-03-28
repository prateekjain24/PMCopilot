# Competitive Pulse Task Template

<!--
TASK: competitive-pulse
CRON: 0 9 * * 1 (Monday at 9 AM)
DESCRIPTION: Weekly competitive intelligence check on app ratings, reviews, and sentiment shifts
-->

You are running a scheduled competitive intelligence task every Monday morning. Your job is to check the latest app store data for key competitors, identify notable changes from the prior week, and flag anything that signals market movement or product changes.

## Instructions

1. **Locate the competitor list**
   - Look for a file named `_Context.md` in the working directory
   - This file should contain: list of tracked competitors, their app names, iOS App Store IDs, and Android Play Store package names
   - If the file does not exist, create a simple template and note that it needs to be populated
   - Extract the competitor list -- you will need this for each check below

2. **For each competitor app, gather current data using app-store-intel tools**
   - Current rating (both iOS and Android if available)
   - Review count (total)
   - Version number and release date (most recent)
   - Sentiment from reviews (look for positive, negative, neutral theme distribution if available)
   - Top recent reviews from last 7 days (pull 5-10 reviews)

3. **Compare to prior week's pulse (if available)**
   - Look for `competitive-pulse-YYYY-MM-DD.md` files in the working directory from the prior 1-2 weeks
   - For each competitor, note: rating change (delta), new reviews count, version changes, sentiment shift
   - Flag if anything moved more than 0.1 rating points (e.g., 4.5 -> 4.4)

4. **Identify notable changes and themes**
   - Rating drops > 0.1: flag as potential quality issue
   - New major version: flag for feature analysis (check reviews for what changed)
   - Sentiment shift: if reviews turned negative, identify the theme (e.g., bugs, pricing, feature request)
   - New features mentioned in reviews: note for product planning
   - Competitor outages or service issues: pull mentions from review text

5. **Synthesize into structured markdown document**
   - Organized by competitor
   - Each competitor: current rating, change from last week, version, 1-2 sentence summary of sentiment/themes
   - Separate section: "Notable Changes & Flags"
   - Separate section: "Key Themes Across Competitors"

6. **Save the document** as `competitive-pulse-YYYY-MM-DD.md` in the working directory (use today's date, Monday)

## Output Format

Use markdown with clear headers. Aim for 1-2 pages (~600-800 words). Use tables for comparison. Be specific about numbers and quotes from reviews where relevant.

## Example Structure

```markdown
# Competitive Pulse -- [DATE]

## Competitor Overview (Current Week)

| Competitor | iOS Rating | Android Rating | Latest Version | Release Date |
|------------|-----------|----------------|---|---|
| Competitor A | 4.6 | 4.5 | 3.2.1 | Mon, Mar 24 |
| Competitor B | 4.3 | 4.2 | 2.8.0 | Wed, Mar 19 |
| Competitor C | 4.7 | 4.6 | 4.1.0 | Fri, Mar 21 |

## Week-over-Week Changes

### Competitor A
- **Rating:** 4.6 (was 4.6 last week) -- stable
- **New version:** 3.2.1 released Mon -- minor bug fixes and performance improvements
- **Review sentiment:** Mostly positive. 2-3 reviews mentioning "faster performance" suggest version resonating.
- **Theme:** Users praising speed improvements; no major complaints.

### Competitor B
- **Rating:** 4.3 (was 4.5 last week) -- **DROP 0.2 POINTS** -- investigate
- **New reviews (last 7 days):** 87 reviews, predominantly negative
- **Top complaint theme:** Paywall moved higher in user journey; users frustrated with upsell timing
- **Notable quote:** "Love the features but the paywall appears too early. Uninstalling." (3.2 stars, Wed)
- **Version:** No change (still 2.8.0) -- suggests issue is not technical but UX/monetization related

### Competitor C
- **Rating:** 4.7 (was 4.6 last week) -- slight uptick
- **New version:** 4.1.0 released Fri -- major feature release (AI-powered recommendations)
- **Review sentiment:** Very positive. Users excited about new AI features.
- **Notable quote:** "The AI recommendations are eerily accurate. Best update yet." (5 stars, Fri)
- **Theme:** Users requesting more customization options for recommendations.

## Notable Changes & Flags

1. **Competitor B Rating Drop** -- 0.2 point drop in iOS rating. Cause appears to be monetization UX change, not product quality. Could represent user churn if not resolved. Monitor for further decline next week.

2. **Competitor C Feature Parity Risk** -- AI recommendations launching is a significant feature. If this is on our roadmap, consider priority. Early reviews are positive -- early adopter satisfaction is high.

3. **Competitor A Stability** -- Version 3.2.1 is resonating positively. Performance optimization trend across market.

## Key Themes Across All Competitors

- **Performance focus:** All three competitors are optimizing for speed. Users notice and reward it.
- **AI/personalization:** Competitor C's AI feature is generating buzz. Customer expectations shifting toward recommendation engines.
- **Monetization sensitivity:** Competitor B's paywall timing is causing churn. Market is sensitive to when upsells appear.
- **Review velocity:** Total reviews increasing across board -- market is active and engaged.

## Recommendations for This Week

- Analyze Competitor B's paywall UX change -- what specifically triggered the 0.2 drop? (Potential case study for our monetization strategy)
- Audit Competitor C's AI recommendations feature -- pull user feedback, identify what's working
- Benchmark our performance metrics against Competitor A's optimizations
- Confirm AI recommendations timeline on our roadmap given market momentum

## Data Collection Notes

- Data pulled via app-store-intel tools on [DATE] at [TIME]
- iOS App Store, Android Play Store, review sentiment analysis (if available)
- Prior week comparison based on competitive-pulse-[PRIOR DATE].md
```

## Notes for Execution

- If competitor list is not in _Context.md, create a blank template with headers "Competitor Name | iOS App ID | Android Package | Notes"
- Use app-store-intel tool calls to pull live data -- do not estimate or guess ratings
- If a competitor has dropped from the market or app is no longer available, note this change
- Compare rating deltas: anything > 0.1 is worth flagging; small changes (< 0.05) are normal variance
- Pull actual review quotes to support sentiment analysis -- this gives the user concrete evidence
- If version number hasn't changed but rating dropped, the issue is likely UX or service, not a technical bug
- Save exactly as: `competitive-pulse-YYYY-MM-DD.md` using Monday's date

## Field Notes for Future Runs

- This task is designed to run every Monday morning
- Accumulated pulse files create a time series -- future analysis can spot trends
- If you see a consistent pattern (e.g., Competitor X always drops on Thursdays), note it for the user to investigate
