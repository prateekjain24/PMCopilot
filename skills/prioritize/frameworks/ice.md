# ICE Scoring Framework

ICE is a lightweight prioritization framework that scores features on three dimensions -- Impact, Confidence, and Ease -- each on a 1-10 scale. It is simpler and faster than RICE, making it ideal for rapid triage.

## Formula

```
ICE Score = Impact x Confidence x Ease
```

**Score range:** 1 (lowest) to 1,000 (highest)

## Parameters

### Impact (1-10)

How much this feature will move the target metric or improve the user experience.

| Score | Meaning |
|-------|---------|
| 10 | Transformative -- fundamentally changes the product or market position |
| 8-9 | Major -- significant improvement that users will talk about |
| 5-7 | Moderate -- noticeable improvement for engaged users |
| 3-4 | Minor -- small quality-of-life improvement |
| 1-2 | Negligible -- barely perceptible change |

Anchor your impact assessment to a specific metric (e.g., conversion rate, retention, NPS) whenever possible.

### Confidence (1-10)

How confident you are in your Impact and Ease estimates.

| Score | Meaning |
|-------|---------|
| 10 | Certain -- backed by A/B test data or production metrics |
| 8-9 | High -- strong user research, competitive precedent, or analogous data |
| 5-7 | Medium -- informed product intuition, some supporting signals |
| 3-4 | Low -- mostly assumptions, limited data |
| 1-2 | Guess -- pure speculation, no supporting evidence |

Confidence is the honesty check. If you lack data for Impact or Ease, reflect that here rather than inflating the other scores.

### Ease (1-10)

How easy and fast this feature is to implement.

| Score | Meaning |
|-------|---------|
| 10 | Trivial -- configuration change, a few hours of work |
| 8-9 | Easy -- a couple of days, well-understood problem |
| 5-7 | Moderate -- 1-2 weeks, some unknowns but manageable |
| 3-4 | Hard -- multi-week effort, significant unknowns or dependencies |
| 1-2 | Very hard -- months of work, major technical risk or cross-team coordination |

Consider: engineering complexity, design effort, QA burden, dependencies on other teams, and deployment risk.

## Worked Example

Evaluating three features for a mobile app:

| Feature | Impact | Confidence | Ease | ICE Score |
|---------|--------|------------|------|----------:|
| Push notification personalization | 8 | 7 | 6 | **336** |
| Dark mode | 5 | 9 | 8 | **360** |
| Advanced search filters | 7 | 5 | 4 | **140** |

**Analysis:**
- **Dark mode** scores highest (360) -- moderate impact but very high confidence and ease. A known, well-scoped feature that users consistently request.
- **Push notification personalization** is close behind (336) -- high impact potential but lower confidence in the estimates and moderate implementation effort.
- **Advanced search filters** ranks last (140) -- decent impact but low confidence and significant effort.

## When to Use

- **Rapid prioritization** when you need a quick gut-check ranking in a meeting or brainstorm
- **Early-stage products** where you lack the reach data required for RICE
- **Hackathon or sprint planning** where speed of decision matters more than precision
- **When comparing dissimilar features** that are hard to quantify on absolute scales

## Limitations

- **Subjectivity**: 1-10 scales are inherently subjective; different people will score the same feature differently. Mitigate by scoring as a group and discussing disagreements.
- **Score inflation**: Teams tend to cluster scores in the 6-8 range. Force yourself to use the full range -- if everything is a 7, nothing is differentiated.
- **No normalization**: Unlike RICE, ICE has no built-in mechanism to account for different scales of reach or effort. A feature that helps 100 users and one that helps 100,000 might score the same.
- **Lacks nuance**: Three dimensions may not capture strategic importance, urgency, or regulatory requirements. Supplement with qualitative discussion.
- **Anchoring bias**: The first feature scored often anchors the scale for subsequent features. Consider scoring all features simultaneously rather than sequentially.
