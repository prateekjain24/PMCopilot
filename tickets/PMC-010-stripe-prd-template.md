---
id: PMC-010
title: Stripe PRD Template
phase: 1 - Core Skills
status: todo
type: template
estimate: 1
dependencies: [PMC-006]
---

## Description

Create the Stripe-style PRD template at `skills/prd-generator/templates/stripe-prd.md`. The Stripe PRD format is tailored for API-first and platform products, emphasizing developer experience, user flows, API design, and edge case handling. It is particularly well-suited for technical products where the interface is an API or SDK, and where rollout strategy and operational readiness are critical. The template must guide the PM through each section with clear instructions and placeholder structure.

## Acceptance Criteria

- [ ] File created at `skills/prd-generator/templates/stripe-prd.md`
- [ ] Contains **Problem Statement** section with guidance on articulating the customer problem, who is affected, current workarounds, and the cost of inaction
- [ ] Contains **Solution Overview** section with guidance on describing the proposed solution at a high level, key design principles, and how it maps to the problem
- [ ] Contains **User Flows** section with guidance on documenting step-by-step flows for primary and secondary use cases, with placeholder flow diagrams or numbered step lists
- [ ] Contains **API Design** section with guidance on defining endpoints, request/response schemas, authentication, error codes, and versioning considerations, with placeholder code block skeletons
- [ ] Contains **Edge Cases** section with guidance on enumerating failure modes, race conditions, backward compatibility issues, and how each is handled, with a table or list skeleton
- [ ] Contains **Rollout Plan** section with guidance on phased launch strategy including feature flags, beta access, percentage rollouts, monitoring, and rollback criteria
- [ ] Contains **Success Metrics** section with guidance on defining quantitative metrics (adoption, latency, error rates, revenue) with baselines and targets in a table format
- [ ] Every section includes guidance text explaining what belongs there and how to approach it
- [ ] Template uses markdown formatting consistent with other PMCopilot templates

## Files to Create/Modify

- `skills/prd-generator/templates/stripe-prd.md`
