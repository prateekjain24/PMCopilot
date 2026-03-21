# MoSCoW Prioritization Framework

MoSCoW is a categorical prioritization framework that sorts features into four buckets based on necessity and stakeholder agreement. It is widely used in Agile and timeboxed delivery contexts where the goal is to define a viable scope for a fixed timeline.

## The Four Categories

### Must Have

Non-negotiable requirements. The release **fails** without these. If a Must Have is not delivered, the product should not ship.

- These are the features that define the minimum viable release
- Ask: "Would we delay the launch if this wasn't ready?" -- if yes, it's a Must Have
- Must Haves should be verifiable: you can objectively confirm they are done

### Should Have

Important but not critical. Painful to leave out, but the release is **still viable** without them.

- These significantly improve the product but have workarounds
- Ask: "Can users accomplish their core goal without this?" -- if yes (with friction), it's a Should Have
- Should Haves are strong candidates for a fast-follow release

### Could Have

Desirable nice-to-haves. Included if time and budget allow, **dropped first** when scope pressure hits.

- These improve polish, delight, or convenience but are not essential
- Ask: "Would anyone notice if this was missing at launch?" -- if most users wouldn't, it's a Could Have
- Could Haves are the scope buffer that protects Must Haves and Should Haves

### Won't Have (This Time)

Explicitly out of scope for **this iteration**. Not rejected permanently -- acknowledged and deferred.

- These are features the team agrees are valuable but not for now
- Ask: "Is this important for this release, or for a future one?" -- if future, it's a Won't Have
- Won't Haves prevent scope creep by making exclusions explicit and agreed-upon

## Effort Allocation Rule of Thumb

| Category | Target Effort Allocation |
|----------|------------------------|
| Must Have | ~60% of total effort |
| Should Have | ~20% of total effort |
| Could Have | ~20% of total effort |
| Won't Have | 0% (deferred) |

**Why this ratio matters:**
- If Must Haves consume more than 60% of effort, the scope is too ambitious -- re-examine what is truly "Must"
- The 20% Could Have buffer provides contingency. When unexpected work arises (and it always does), Could Haves can be dropped without compromising the release
- If Must Haves consume 100% of effort, there is no room for error and the plan is fragile

## Facilitation Guide

### Running a MoSCoW Session

1. **Set the context**: Define the timebox (sprint, release, quarter) and the total available effort. MoSCoW only works against a fixed constraint.

2. **List all candidate features**: Start with a flat, unordered list. No pre-classification.

3. **Classify independently first**: Have each stakeholder classify features silently before discussion. This prevents anchoring.

4. **Discuss disagreements**: Focus on features where stakeholders disagree. The conversation is the value -- it forces alignment on what "Must" really means.

5. **Apply the effort check**: After classification, estimate effort per category. If Must Haves exceed 60%, something in that bucket isn't truly a Must. Challenge it.

6. **Document rationale**: For each Must Have, record *why* it's a Must. This prevents re-litigation in future discussions.

### Handling Common Pitfalls

- **"Everything is a Must"**: Push back. Ask "What happens if we ship without this?" If the answer is "users are slightly annoyed" rather than "the product is broken," it's a Should.
- **Stakeholder politics**: Use effort data as an objective constraint. "We have capacity for 60% Must -- which of these 15 items are the 9 most critical?"
- **Vague features**: Break large features into smaller pieces. "User management" might contain Must Haves (login) and Could Haves (profile customization).

## Worked Example

Sprint planning for a mobile banking app release:

| Category | Feature | Rationale |
|----------|---------|-----------|
| **Must Have** | Account balance display | Core functionality -- app is useless without it |
| **Must Have** | Fund transfers | Primary user need; users will abandon the app without it |
| **Must Have** | Transaction history | Required for financial transparency and user trust |
| **Should Have** | Push notifications for transactions | Important for security and awareness, but SMS fallback exists |
| **Should Have** | Biometric login (Face ID / fingerprint) | Strong user expectation, but PIN login works as fallback |
| **Could Have** | Spending insights / analytics | Nice-to-have that enhances the experience but isn't core |
| **Could Have** | Dark mode | Frequently requested, improves comfort but not functionality |
| **Won't Have** | Investment portfolio tracking | Valuable future feature, but out of scope for banking v1 |

## When to Use

- **Timeboxed releases** where you must define scope against a fixed deadline
- **Stakeholder negotiation** when different teams disagree on priorities
- **Scope definition** at the start of a project or sprint
- **When effort is constrained** and you need a simple, communicable framework
- **Cross-functional alignment** where technical and business stakeholders need a shared language

## Limitations

- **"Must" becomes a dumping ground**: Without strong facilitation, teams classify too many features as Must Have, defeating the purpose of prioritization
- **No numeric ranking within categories**: All Must Haves are equal -- you can't distinguish between the most important Must and the least important one. Pair with RICE or ICE to rank within categories.
- **Requires strong facilitation**: MoSCoW sessions without a skilled facilitator often devolve into lobbying. The facilitator must enforce the effort constraint.
- **Binary thinking**: Features are either in or out of a category. There's no room for "this is 70% Must" nuance. Accept this as a feature, not a bug -- the simplicity is the value.
- **Context-dependent**: A feature that's "Won't Have" for v1 might be "Must Have" for v2. Re-run MoSCoW for each planning cycle.
