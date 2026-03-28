---
description: "Generate a comprehensive, categorized launch checklist for soft, hard, or beta launches"
argument-hint: "[launch-type: soft|hard|beta] [product-name]"
allowed-tools: [Read, Write, Bash, Grep, Glob]
model: sonnet
---

# Launch Checklist

Generate a comprehensive, categorized launch checklist tailored to the type of launch and the product being shipped.

## Launch Types

There are three supported launch types. Choose the one that best fits the release:

### Hard Launch
A full public release with marketing, press, and broad user exposure. Use this for major product launches, v1 releases, or any launch that will reach your entire user base on day one. All 9 checklist categories apply.

### Soft Launch
A controlled release to a subset of users or a specific geography, typically without marketing fanfare. Use this for testing product-market fit, validating infrastructure under real load, or phased geographic rollouts. Detailed Marketing and Legal/Compliance categories are reduced since the blast radius is intentionally limited.

### Beta Launch
An early-access release to a closed group of testers or design partners. Use this for gathering structured feedback before a broader launch. Only Engineering Readiness, QA, Analytics, and Rollout Plan categories apply, since the audience is known, expectations are set, and external-facing concerns (marketing, legal, support) are handled informally.

## Checklist Categories

The full checklist spans 9 categories:

1. **Engineering Readiness** -- Feature-complete, code merged, dependencies resolved, performance benchmarks met, rollback plan documented.
2. **QA** -- Test plans executed, regression suite green, edge cases covered, device/browser matrix validated, known issues triaged.
3. **Design Sign-off** -- Final designs approved, pixel-level QA complete, accessibility audit passed, dark mode / responsive states verified.
4. **Analytics** -- Events instrumented, dashboards built, success metrics defined, A/B test configuration (if applicable), data pipeline validated.
5. **Marketing** -- Launch messaging finalized, landing page live, social/email campaigns scheduled, press/analyst briefings done, app store listing updated.
6. **Support** -- Help docs and FAQs published, support team trained, escalation paths defined, known-issue runbook ready.
7. **Legal/Compliance** -- Privacy review complete, terms of service updated, regulatory requirements met, data processing agreements in place.
8. **Rollout Plan** -- Rollout stages defined (percentage ramp or geo sequence), feature flags configured, monitoring alerts set, rollback criteria documented.
9. **Post-Launch** -- War room schedule, monitoring rotation, Day-1/3/7 review cadence, retrospective scheduled, success criteria evaluation date set.

## Category Applicability by Launch Type

| Category              | Hard | Soft | Beta |
|-----------------------|------|------|------|
| Engineering Readiness | Yes  | Yes  | Yes  |
| QA                    | Yes  | Yes  | Yes  |
| Design Sign-off       | Yes  | Yes  | No   |
| Analytics             | Yes  | Yes  | Yes  |
| Marketing             | Yes  | No   | No   |
| Support               | Yes  | Yes  | No   |
| Legal/Compliance      | Yes  | No   | No   |
| Rollout Plan          | Yes  | Yes  | Yes  |
| Post-Launch           | Yes  | Yes  | No   |

## Clarification Framework

Before generating the checklist, apply Principle #1 ("Clarify before you create"). Check pm-profile.json and _Context.md first -- skip any question already answered there or in the user's prompt.

**Must-know (always ask, block execution until answered):**
- What are you launching and when? (Product/feature name and target date)
- What type of launch: hard (full public), soft (controlled rollout), or beta (closed group)?

**Should-know (ask unless inferable from context):**
- What's the blast radius if something goes wrong? (This shapes how thorough QA and rollback sections need to be)
- Are there regulatory, legal, or compliance requirements for this launch?

**Nice-to-know (skip unless the PM invites depth):**
- Who owns each category (engineering, QA, marketing, support) -- or should I leave owners blank for you to fill?

Ask 2-3 questions conversationally. If the user provides launch type, product, and date in their prompt, proceed directly.

## Process

1. Confirm launch parameters from clarification above:

2. Load the checklist template from `templates/launch-checklist.md`.

3. Adjust the checklist based on launch type:
   - **Hard launch**: Include all 9 categories with every item.
   - **Soft launch**: Include all categories except detailed Marketing and Legal/Compliance. Keep abbreviated versions of those sections with only the most critical items.
   - **Beta launch**: Include only Engineering Readiness, QA, Analytics, and Rollout Plan.

4. For each checklist item, ensure it has:
   - A clear description of what "done" looks like
   - An owner field (to be filled by the user)
   - A due date field (relative to the target launch date)
   - A status indicator (not started / in progress / complete / blocked)

5. Output the completed checklist with a readiness summary showing progress per category.
