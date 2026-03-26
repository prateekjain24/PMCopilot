# PRD: [Product/Feature Name]

**Author:** [Your Name]
**Last Updated:** [Date]
**Status:** Draft | In Review | Approved
**Reviewers:** [List stakeholders]

---

## Overview

*Summarize the product or feature in 2-3 sentences. What is it, who is it for, and why does it matter? A reader should understand the essence of the proposal from this section alone.*

[Write overview here]

---

## Goals and Non-Goals

### Goals

*List the specific, measurable outcomes this product/feature aims to achieve. Each goal should be verifiable -- you should be able to look at data after launch and confirm whether the goal was met.*

| # | Goal | Success Metric | Target |
|---|------|---------------|--------|
| G1 | [Goal description] | [How you will measure it] | [Specific target number] |
| G2 | [Goal description] | [How you will measure it] | [Specific target number] |
| G3 | [Goal description] | [How you will measure it] | [Specific target number] |

### Non-Goals

*Explicitly state what this product/feature will NOT do. Non-goals are just as important as goals -- they prevent scope creep and align stakeholders on boundaries. Include things that are related but intentionally excluded from this effort.*

- [Non-goal 1: what is explicitly out of scope and why]
- [Non-goal 2: what is explicitly out of scope and why]
- [Non-goal 3: what is explicitly out of scope and why]

---

## User Stories

*Write user stories in the standard format. Each story should represent a distinct user need. Include both primary (happy path) and secondary (edge case) stories. Think about different user personas and their unique needs.*

| # | Persona | Story | Priority |
|---|---------|-------|----------|
| US1 | As a [persona] | I want [action] so that [outcome] | P0 |
| US2 | As a [persona] | I want [action] so that [outcome] | P0 |
| US3 | As a [persona] | I want [action] so that [outcome] | P1 |
| US4 | As a [persona] | I want [action] so that [outcome] | P1 |
| US5 | As a [persona] | I want [action] so that [outcome] | P2 |

---

## Detailed Requirements

### Functional Requirements

*Break down the specific behaviors and capabilities the product must have. Be precise -- avoid ambiguity. Each requirement should be testable.*

| # | Requirement | Details | Priority |
|---|------------|---------|----------|
| FR1 | [Requirement name] | [Detailed description of expected behavior] | P0 |
| FR2 | [Requirement name] | [Detailed description of expected behavior] | P0 |
| FR3 | [Requirement name] | [Detailed description of expected behavior] | P1 |

### Non-Functional Requirements

*Define the quality attributes: performance, security, accessibility, scalability, reliability. Include specific thresholds where possible.*

| # | Category | Requirement | Target |
|---|----------|------------|--------|
| NFR1 | Performance | [e.g., Page load time] | [e.g., < 2s at p95] |
| NFR2 | Security | [e.g., Data encryption] | [e.g., AES-256 at rest] |
| NFR3 | Accessibility | [e.g., WCAG compliance] | [e.g., Level AA] |
| NFR4 | Scalability | [e.g., Concurrent users] | [e.g., 10K concurrent] |

---

## Design Considerations

*Document technical constraints, UX considerations, dependencies on other teams, and open design decisions. This section bridges the PRD and the technical design doc.*

### Technical Constraints
- [Constraint 1: e.g., Must integrate with existing auth system]
- [Constraint 2: e.g., Must support offline mode on mobile]

### UX Considerations
- [Consideration 1: e.g., Must be accessible without onboarding]
- [Consideration 2: e.g., Mobile-first responsive design]

### Dependencies
- [Dependency 1: Team/system and what is needed]
- [Dependency 2: Team/system and what is needed]

### Open Design Decisions
- [Decision 1: What needs to be decided, options, and owner]
- [Decision 2: What needs to be decided, options, and owner]

---

## Metrics and Success Criteria

*Define how you will measure success. Include the current baseline (if known), the target, the measurement method, and when you expect to hit the target. Include both leading indicators (early signals) and lagging indicators (ultimate outcomes).*

| Metric | Type | Baseline | Target | Method | Timeline |
|--------|------|----------|--------|--------|----------|
| [Metric name] | Leading | [Current value] | [Target value] | [How measured] | [By when] |
| [Metric name] | Leading | [Current value] | [Target value] | [How measured] | [By when] |
| [Metric name] | Lagging | [Current value] | [Target value] | [How measured] | [By when] |
| [Metric name] | Guardrail | [Current value] | [Must not exceed] | [How measured] | [Ongoing] |

---

## Timeline

*Define the key milestones and phases. Include target dates and what "done" looks like for each milestone. Be realistic about dependencies and lead times.*

| Phase | Milestone | Target Date | Deliverable | Dependencies |
|-------|-----------|-------------|-------------|--------------|
| Phase 1 | [Milestone name] | [Date] | [What is delivered] | [Blockers] |
| Phase 2 | [Milestone name] | [Date] | [What is delivered] | [Blockers] |
| Phase 3 | [Milestone name] | [Date] | [What is delivered] | [Blockers] |
| Launch | [GA / Full rollout] | [Date] | [What is delivered] | [Blockers] |

---

## Risks and Mitigations

*Identify what could go wrong and how you plan to address it. Include technical risks, market risks, resourcing risks, and dependency risks.*

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk description] | High/Med/Low | High/Med/Low | [How to address] |
| [Risk description] | High/Med/Low | High/Med/Low | [How to address] |

---

## Open Questions

*Capture unresolved decisions that need stakeholder input. Assign an owner and a target resolution date for each question.*

| # | Question | Owner | Due Date | Status |
|---|----------|-------|----------|--------|
| Q1 | [Unresolved question] | [Who decides] | [By when] | Open |
| Q2 | [Unresolved question] | [Who decides] | [By when] | Open |
| Q3 | [Unresolved question] | [Who decides] | [By when] | Open |
