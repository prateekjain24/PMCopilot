---
id: PMC-103
title: Write pm-frameworks unit tests
phase: 5 - Polish and Distribution
status: done
type: test
estimate: 1
dependencies: [PMC-064, PMC-065, PMC-066, PMC-067, PMC-068, PMC-069, PMC-070, PMC-071, PMC-072, PMC-073]
---

## Description

Write comprehensive unit tests for all calculation tools in the pm-frameworks MCP server. These tools implement well-defined mathematical formulas, making them ideal candidates for thorough unit testing with known inputs and expected outputs.

Each tool must be tested for:
- **Correctness**: Known input/output pairs validated against manual calculations.
- **Edge cases**: Zero values, negative numbers, extremely large numbers, missing optional fields.
- **Input validation**: Invalid types, missing required fields, out-of-range values.
- **Output format**: Correct JSON structure, proper field names, appropriate numeric precision.

Tools to test:

| Tool | Key validation |
|------|---------------|
| RICE score | reach * impact * confidence / effort |
| ICE score | impact * confidence * ease |
| Kano classify | Proper categorization into Must-be, One-dimensional, Attractive, Indifferent, Reverse |
| MoSCoW sort | Correct bucketing and ordering within buckets |
| TAM/SAM/SOM | Cascading market size calculations, SAM <= TAM, SOM <= SAM |
| Weighted score | Correct weight normalization and weighted sum |
| Opportunity score | importance + (importance - satisfaction) formula |
| Cost of Delay | CD3 = cost_of_delay / job_duration |
| Sample size | Statistical power calculation accuracy |
| Significance test | p-value and confidence interval calculations |

## Acceptance Criteria

- [ ] Test file exists at `tests/pm-frameworks/` with test files for each tool
- [ ] RICE score tool: at least 5 test cases including edge cases (zero effort, max values)
- [ ] ICE score tool: at least 5 test cases including boundary values
- [ ] Kano classify tool: at least one test case per Kano category plus ambiguous inputs
- [ ] MoSCoW sort tool: tests for correct bucketing, ordering, and handling of empty categories
- [ ] TAM/SAM/SOM tool: tests for cascading constraints (SAM <= TAM, SOM <= SAM) and validation of invalid hierarchies
- [ ] Weighted score tool: tests for weight normalization, zero weights, and single-criterion input
- [ ] Opportunity score tool: tests for standard formula and edge cases where satisfaction exceeds importance
- [ ] Cost of Delay tool: tests for CD3 calculation, zero duration handling, and priority ordering
- [ ] Sample size calculator: tests validated against known statistical tables for common alpha/beta/MDE combinations
- [ ] Significance test tool: tests with known datasets where the outcome (significant/not significant) is predetermined
- [ ] All tests pass in CI with `bun test` or equivalent
- [ ] Tests include input validation cases: missing fields return appropriate errors, invalid types are rejected
- [ ] Test coverage report shows >= 90% line coverage for all pm-frameworks tools

## Files to Create/Modify

- `tests/pm-frameworks/rice.test.ts` -- RICE score tests
- `tests/pm-frameworks/ice.test.ts` -- ICE score tests
- `tests/pm-frameworks/kano.test.ts` -- Kano classification tests
- `tests/pm-frameworks/moscow.test.ts` -- MoSCoW sorting tests
- `tests/pm-frameworks/tam-sam-som.test.ts` -- Market sizing tests
- `tests/pm-frameworks/weighted.test.ts` -- Weighted scoring tests
- `tests/pm-frameworks/opportunity.test.ts` -- Opportunity scoring tests
- `tests/pm-frameworks/cost-of-delay.test.ts` -- Cost of Delay tests
- `tests/pm-frameworks/sample-size.test.ts` -- Sample size calculator tests
- `tests/pm-frameworks/significance.test.ts` -- Significance test tests
- `tests/pm-frameworks/setup.ts` -- Shared test utilities and fixtures
