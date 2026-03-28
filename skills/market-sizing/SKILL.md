---
name: market-sizing
description: >
  Produce a rigorous TAM/SAM/SOM analysis for a given market or product opportunity
  using top-down and bottom-up methodologies with cross-validation.
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
  - mcp__pm-frameworks__*
---

# Market Sizing

Produce a rigorous TAM/SAM/SOM analysis for a given market or product opportunity. Combine web research, quantitative modeling, and the pm-frameworks MCP to deliver a defensible market size estimate with confidence ranges.

## Process

### Step 1: Define the Market

Prompt the user for:
- **Market or product description**: What market are we sizing? Be as specific as possible.
- **Geography**: Target region (global, North America, EU, APAC, specific country, etc.). Default: global.
- **Time horizon**: How many years forward to project (1, 3, 5, 10). Default: 5 years.
- **Known data points**: Any existing data the user already has (revenue figures, user counts, industry reports, etc.).

Clarify the market boundaries before proceeding. A well-defined market is the foundation of a credible estimate.

### Step 2: Top-Down Analysis

Research industry-level data to establish the total addressable market:
- Search for industry reports, analyst estimates, and public filings.
- Identify the broadest relevant revenue pool (the total spend in the category).
- Apply geographic and segment filters to narrow to the target market.
- Document CAGR (compound annual growth rate) from credible sources.
- Note the confidence level of each data point: high (primary source, recent), medium (secondary source or older), low (estimate or extrapolation).

### Step 3: Bottom-Up Analysis

Build an independent estimate from unit economics:
- Identify the total number of potential customers (individuals, businesses, or accounts).
- Estimate average revenue per user/account (ARPU).
- Estimate realistic penetration rate based on comparable products or markets.
- Calculate: Customers x ARPU x Penetration Rate = Bottom-up market size.
- Document all assumptions explicitly.

### Step 4: Cross-Validation

Compare the top-down and bottom-up estimates:
- Calculate the variance between the two approaches.
- If variance exceeds 30%, investigate the gap. Common causes: market definition mismatch, ARPU assumptions, penetration rate.
- Consider an analogous market approach as a third reference point: find a comparable market (different geography, adjacent category) and scale proportionally.
- Reconcile to a final estimate with a confidence range (low / mid / high).

### Step 5: TAM/SAM/SOM Calculation

Use the `mcp__pm-frameworks__tam_sam_som` tool to compute the final figures:
- **TAM**: Total addressable market -- the full revenue opportunity if 100% market share were achieved.
- **SAM**: Serviceable addressable market -- the portion of TAM reachable given your business model, go-to-market, and geographic constraints.
- **SOM**: Serviceable obtainable market -- the realistic near-term capture (typically 1-3 years) given competitive positioning and current resources.

### Output

Load the template from `templates/tam-sam-som.md` and populate it with:
- All three estimates (TAM, SAM, SOM) with confidence ranges.
- Methodology details for both top-down and bottom-up approaches.
- Cross-validation summary with variance analysis.
- Complete source table with URLs and access dates.
- Clear statement of all assumptions.

## Guidance

- **Cite every data point.** Every number should have a source. If a number is your estimate, say so explicitly and explain the reasoning.
- **Use confidence ranges.** Never present a single number as the answer. Provide low, mid, and high estimates for each tier.
- **Handle limited data honestly.** If reliable data is scarce, say so. Use triangulation (multiple weak signals) rather than fabricating precision. Flag where the user should invest in primary research.
- **Prefer recent data.** Data older than 2 years should be flagged and adjusted for known trends.
- **Make assumptions explicit.** Every assumption should be stated, justified, and marked as adjustable so the user can run sensitivities.
