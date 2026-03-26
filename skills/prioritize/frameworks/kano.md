# Kano Model Framework

The Kano Model is a qualitative prioritization framework that classifies features based on how they affect customer satisfaction. Unlike scoring frameworks (RICE, ICE), Kano uses survey-based classification to understand the relationship between feature presence and customer delight.

## The Five Categories

### Must-be (Basic Expectations)

Features customers **expect** as a baseline. Their presence does not increase satisfaction, but their absence causes strong dissatisfaction.

- Example: A banking app must have login security. Users won't praise it, but they'll leave without it.
- **Priority**: Must build. These are table stakes.

### One-dimensional (Performance)

Features where satisfaction scales **linearly** with fulfillment. More is better, less is worse.

- Example: Page load speed. Faster = happier. Slower = more frustrated.
- **Priority**: Build to compete. These are the features where you differentiate on execution quality.

### Attractive (Delighters)

Features that customers **don't expect**. Their absence doesn't cause dissatisfaction, but their presence creates disproportionate delight.

- Example: Spotify Wrapped. Nobody expected it, but it became a viral moment of delight.
- **Priority**: Build to differentiate. These create loyalty and word-of-mouth.

### Indifferent

Features that have **no significant effect** on satisfaction regardless of presence or absence.

- Example: Changing the color of an internal admin button that nobody notices.
- **Priority**: Deprioritize. Effort here is wasted.

### Reverse

Features that cause **dissatisfaction when present** for some users. These are features that some user segments actively dislike.

- Example: Forced social features in a productivity app. Power users may find them distracting.
- **Priority**: Avoid, or make optional with an off switch.

## Survey Method

Kano analysis requires paired questions for each feature:

### Question Format

For each feature, ask two questions:

1. **Functional question**: "How would you feel if [feature] were present?"
2. **Dysfunctional question**: "How would you feel if [feature] were absent?"

### Answer Options (for both questions)

1. I would **like** it
2. I **expect** it
3. I am **neutral**
4. I can **live with** it
5. I **dislike** it

## Classification Evaluation Table

Cross-reference the functional and dysfunctional answers to classify each feature:

| | **Dysfunctional: Like** | **Dysfunctional: Expect** | **Dysfunctional: Neutral** | **Dysfunctional: Live with** | **Dysfunctional: Dislike** |
|---|---|---|---|---|---|
| **Functional: Like** | Questionable | Attractive | Attractive | Attractive | One-dimensional |
| **Functional: Expect** | Reverse | Indifferent | Indifferent | Indifferent | Must-be |
| **Functional: Neutral** | Reverse | Indifferent | Indifferent | Indifferent | Must-be |
| **Functional: Live with** | Reverse | Indifferent | Indifferent | Indifferent | Must-be |
| **Functional: Dislike** | Reverse | Reverse | Reverse | Reverse | Questionable |

**Questionable** responses indicate the respondent may have misunderstood the question or the feature description. Discard or follow up.

## Aggregating Multiple Respondents

When surveying multiple users:

1. **Tally** the classification for each feature across all respondents
2. **Majority rules**: The category with the most responses wins
3. **Report the distribution**: e.g., "Feature X: 60% Must-be, 25% One-dimensional, 15% Indifferent"
4. **Watch for splits**: If a feature is roughly split between categories, it may serve different segments differently -- investigate further
5. **Minimum sample**: Aim for 20-30 respondents per user segment for reliable classification

## When to Use

- **Understanding customer sentiment** about proposed features before building
- **Validating assumptions** about what users want vs. what they expect
- **When you have access to users** for survey data (user research, beta testers, customer advisory boards)
- **Feature planning for new products** where you need to distinguish table stakes from differentiators
- **Complementing quantitative frameworks**: Use Kano to understand *why* a feature matters, then RICE/ICE to decide *when* to build it

## Limitations

- **Requires user research effort**: You need to design, distribute, and analyze a survey, which takes time and resources
- **Categories shift over time**: What is "Attractive" today becomes "Must-be" tomorrow as user expectations evolve (e.g., dark mode was a delighter in 2018, now it's expected)
- **Sample bias**: Survey respondents may not represent your full user base. Power users and vocal minorities tend to over-respond.
- **Feature framing matters**: How you describe a feature in the survey significantly affects how people respond. Vague descriptions lead to unreliable classifications.
- **Does not produce a ranking**: Kano tells you the *type* of value, not the *magnitude*. You'll still need a scoring framework (RICE, ICE) to rank features within a category.
