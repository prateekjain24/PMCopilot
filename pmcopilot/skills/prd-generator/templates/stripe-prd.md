# PRD: [Product/Feature Name]

**Author:** [Your Name]
**Last Updated:** [Date]
**Status:** Draft | In Review | Approved
**Reviewers:** [List stakeholders]

---

## Problem Statement

*Articulate the customer problem clearly. Who is affected, what is their current experience, what workarounds exist, and what is the cost of inaction? Ground this in data -- support tickets, churn analysis, competitive pressure, or user research.*

### Who is affected?

[Describe the specific customer segments experiencing this problem. Include scale -- how many customers, what percentage of revenue, etc.]

### What is the current experience?

[Walk through the current user journey, highlighting pain points. Be specific about friction, errors, and workarounds.]

### What are the current workarounds?

[Document how customers solve this problem today without your product. Workarounds reveal the true nature of the need.]

### What is the cost of inaction?

[Quantify what happens if you do nothing. Include customer churn risk, competitive disadvantage, revenue impact, or engineering debt accumulation.]

---

## Solution Overview

*Describe the proposed solution at a high level. What are the key design principles? How does the solution map to the problem? What is the core insight that makes this approach the right one?*

### Design Principles

*List 3-5 principles that guide design decisions for this feature. These should help the team make consistent choices when facing trade-offs.*

1. [Principle 1: e.g., "API-first -- every capability is accessible via API before UI"]
2. [Principle 2: e.g., "Backward compatible -- existing integrations must not break"]
3. [Principle 3: e.g., "Idempotent by default -- all operations are safe to retry"]

### Solution Summary

[Describe the solution in 2-3 paragraphs. Focus on what the user can do, not how it is implemented. Explain the key insight that makes this approach better than alternatives.]

---

## User Flows

*Document step-by-step flows for primary and secondary use cases. Include both the happy path and error/edge case paths. Use numbered steps for clarity.*

### Primary Flow: [Main Use Case Name]

*The most common way a user will interact with this feature.*

1. [Step 1: User action]
2. [Step 2: System response]
3. [Step 3: User action]
4. [Step 4: System response / outcome]

### Secondary Flow: [Alternative Use Case Name]

*An important but less common interaction pattern.*

1. [Step 1: User action]
2. [Step 2: System response]
3. [Step 3: User action]
4. [Step 4: System response / outcome]

### Error Flow: [Failure Scenario Name]

*What happens when things go wrong.*

1. [Step 1: User action or system event]
2. [Step 2: Error condition triggered]
3. [Step 3: System error response / recovery path]
4. [Step 4: User recovery action]

---

## API Design

*Define the API surface area. Include endpoints, request/response schemas, authentication, error codes, and versioning considerations. This section is the contract between your product and developers.*

### Endpoints

```
[METHOD] /v1/[resource]
[METHOD] /v1/[resource]/:id
[METHOD] /v1/[resource]/:id/[sub-resource]
```

### Request / Response Schema

```json
// POST /v1/[resource]
// Request
{
  "field_1": "string",
  "field_2": 0,
  "metadata": {}
}

// Response
{
  "id": "res_xxx",
  "object": "[resource]",
  "field_1": "string",
  "field_2": 0,
  "created": 1234567890,
  "metadata": {}
}
```

### Authentication

*Describe the authentication mechanism. Include API key scoping, OAuth flows, or webhook signature verification as applicable.*

[Describe auth approach here]

### Error Codes

| HTTP Status | Error Code | Description | Resolution |
|-------------|-----------|-------------|------------|
| 400 | `invalid_request` | [Description] | [How to fix] |
| 401 | `authentication_failed` | [Description] | [How to fix] |
| 404 | `resource_not_found` | [Description] | [How to fix] |
| 409 | `conflict` | [Description] | [How to fix] |
| 429 | `rate_limit_exceeded` | [Description] | [How to fix] |

### Versioning

*How will you version this API? What is the backward compatibility commitment? How will breaking changes be communicated and migrated?*

[Describe versioning strategy here]

---

## Edge Cases

*Enumerate failure modes, race conditions, backward compatibility issues, and how each is handled. This section separates good PRDs from great ones.*

| # | Scenario | Expected Behavior | Handling |
|---|----------|-------------------|----------|
| EC1 | [e.g., Duplicate request with same idempotency key] | [e.g., Return cached response, do not re-execute] | [Implementation approach] |
| EC2 | [e.g., Request during partial outage] | [e.g., Graceful degradation with clear error] | [Implementation approach] |
| EC3 | [e.g., API version mismatch] | [e.g., Forward-compatible response with deprecation warning] | [Implementation approach] |
| EC4 | [e.g., Race condition on concurrent updates] | [e.g., Last-write-wins with conflict detection] | [Implementation approach] |
| EC5 | [e.g., Webhook delivery failure] | [e.g., Exponential backoff retry for 72 hours] | [Implementation approach] |

---

## Rollout Plan

*Define the phased launch strategy. Include feature flags, beta access, percentage rollouts, monitoring, and rollback criteria. A good rollout plan minimizes blast radius and maximizes learning.*

### Phase 1: Internal Dogfood
- **Audience:** Internal teams only
- **Duration:** [e.g., 1 week]
- **Feature flag:** [Flag name]
- **Success criteria:** [What must be true to proceed]
- **Monitoring:** [What dashboards/alerts to watch]

### Phase 2: Private Beta
- **Audience:** [e.g., 10 selected partners]
- **Duration:** [e.g., 2 weeks]
- **Entry criteria:** [What must be true from Phase 1]
- **Feedback mechanism:** [How you will collect feedback]
- **Success criteria:** [What must be true to proceed]

### Phase 3: Percentage Rollout
- **Ramp schedule:** [e.g., 5% -> 25% -> 50% -> 100%]
- **Duration per step:** [e.g., 48 hours minimum between ramps]
- **Monitoring:** [Latency, error rates, business metrics]
- **Rollback trigger:** [e.g., Error rate > 1% or p95 latency > 500ms]

### Phase 4: General Availability
- **Announcement:** [Blog post, changelog, email]
- **Documentation:** [API docs, guides, migration instructions]
- **Support readiness:** [Runbooks, FAQs, escalation paths]

### Rollback Criteria

*Define the specific conditions that trigger an automatic or manual rollback.*

- [Criterion 1: e.g., Error rate exceeds X% for Y minutes]
- [Criterion 2: e.g., P95 latency exceeds Xms]
- [Criterion 3: e.g., Revenue impact detected exceeding $X]

---

## Success Metrics

*Define quantitative metrics with baselines and targets. Include adoption metrics, quality metrics, and business metrics.*

| Metric | Category | Baseline | Target | Measurement | Timeline |
|--------|----------|----------|--------|-------------|----------|
| [e.g., API adoption rate] | Adoption | [Current] | [Target] | [How measured] | [By when] |
| [e.g., P95 latency] | Quality | [Current] | [Target] | [How measured] | [By when] |
| [e.g., Error rate] | Quality | [Current] | [Target] | [How measured] | [By when] |
| [e.g., Revenue from new API] | Business | [Current] | [Target] | [How measured] | [By when] |
| [e.g., Developer NPS] | Satisfaction | [Current] | [Target] | [How measured] | [By when] |

---

## Open Questions

| # | Question | Owner | Due Date | Status |
|---|----------|-------|----------|--------|
| Q1 | [Unresolved question] | [Who decides] | [By when] | Open |
| Q2 | [Unresolved question] | [Who decides] | [By when] | Open |
