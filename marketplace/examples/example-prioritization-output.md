# Example: RICE Prioritization Output

Below is a sample of what `/pmcopilot:prioritize "Q3 feature backlog"` produces when using the RICE framework.

---

## RICE Prioritization: Q3 Feature Backlog

### Ranked Features

| Rank | Feature | Reach | Impact | Confidence | Effort | RICE Score |
|---|---|---|---|---|---|---|
| 1 | One-tap checkout | 45,000 | 3 (massive) | 85% | 3 mo | 38,250 |
| 2 | Smart search with filters | 30,000 | 2 (high) | 75% | 2 mo | 22,500 |
| 3 | Push notification preferences | 60,000 | 1 (medium) | 90% | 4 mo | 13,500 |
| 4 | Social sharing integration | 20,000 | 2 (high) | 50% | 3 mo | 6,667 |
| 5 | Dark mode | 15,000 | 0.5 (low) | 80% | 1 mo | 6,000 |
| 6 | PDF export for reports | 5,000 | 1 (medium) | 70% | 2 mo | 1,750 |

### Summary Statistics

- **Mean score**: 14,778
- **Median score**: 10,084
- **Range**: 1,750 - 38,250

### Recommendation

Top recommendation: **One-tap checkout** with a RICE score of 38,250. This feature reaches 45,000 users per quarter with massive impact at 85% confidence, requiring 3 person-months of effort.

The top 3 features (one-tap checkout, smart search, push notification preferences) account for 83% of the total weighted impact. Consider allocating Q3 engineering capacity to these three items and deferring social sharing and PDF export to Q4.

---

*The prioritize skill also supports ICE, MoSCoW, Kano, Weighted Scoring, Opportunity Scoring, and Cost of Delay frameworks. Run with a framework flag to compare: `/pmcopilot:prioritize --framework ice "Q3 feature backlog"`.*
