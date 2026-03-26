# pm-frameworks MCP Server

12 pure-computation tools for PM frameworks. No external dependencies, no API calls — all calculations run locally.

## Tools

### Prioritization (7)
| Tool | Formula / Method |
|------|-----------------|
| `rice` | Score = (Reach x Impact x Confidence%) / Effort |
| `ice` | Score = Impact x Confidence x Ease (each 1-10 scale) |
| `moscow` | Categorize into Must/Should/Could/Won't |
| `kano` | Classify as Must-be/One-dimensional/Attractive/Indifferent/Reverse |
| `weighted_score` | Weighted sum of custom criteria |
| `opportunity_score` | Importance + (Importance - Satisfaction) |
| `cost_of_delay` | CD3 = Cost of Delay / Job Duration |

### Experimentation (2)
| Tool | Purpose |
|------|---------|
| `sample_size_calc` | Minimum sample size for given MDE, alpha, power |
| `significance_test` | Chi-squared or Z-test on A/B results |

### Market Sizing (1 + batch)
| Tool | Purpose |
|------|---------|
| `tam_sam_som` | Calculate TAM, SAM, SOM from inputs |

Batch variants available for RICE and ICE (score multiple items at once).

## Code Layout

```
src/
├── index.ts                  # FastMCP server setup, registers all tools
├── types.ts                  # Shared types (RICEInput, ICEInput, etc.)
├── utils/validation.ts       # Input validation helpers
└── tools/
    ├── rice.ts               # Tool implementation
    ├── rice.test.ts          # Co-located test
    ├── ice.ts
    ├── ice.test.ts
    ├── ... (one pair per tool)
    └── index.ts              # Barrel export
```

## Testing

```bash
bun test                      # Runs all co-located .test.ts files
```

Every tool has a co-located test file. Tests cover edge cases (zero values, boundary conditions, invalid inputs).

## Key Implementation Notes

- All inputs validated via Zod schemas before calculation
- Confidence in RICE is a percentage (0-100), divided by 100 in formula
- ICE scores are 1-10 integers
- Kano classification uses functional/dysfunctional question matrix
- Batch tools accept arrays and return scored + sorted results
