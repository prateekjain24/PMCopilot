# TAM / SAM / SOM Analysis

| Field              | Value                          |
|--------------------|--------------------------------|
| **Market**         | {{market_description}}         |
| **Geography**      | {{geographic_scope}}           |
| **Time Horizon**   | {{time_horizon_years}} years   |
| **Analysis Date**  | {{date}}                       |
| **Author**         | {{author}}                     |

---

## 1. TAM -- Total Addressable Market

The total annual revenue opportunity assuming 100% market share within the defined market boundaries.

| Dimension          | Value                          |
|--------------------|--------------------------------|
| **Market Definition** | {{definition_of_what_counts}} |
| **Geographic Scope**  | {{countries_or_regions}}      |
| **Annual Revenue**    | ${{tam_value}}                |
| **CAGR**              | {{cagr_percentage}}%          |
| **Projected Value ({{end_year}})** | ${{projected_tam}} |
| **Confidence Level**  | {{low / mid / high}}          |

**Key Data Sources:**
- {{source_1_with_date}}
- {{source_2_with_date}}

**Assumptions:**
- {{tam_assumption_1}}
- {{tam_assumption_2}}

---

## 2. SAM -- Serviceable Addressable Market

The portion of TAM that your business model, go-to-market strategy, and operational reach can realistically serve.

| Dimension            | Value                          |
|----------------------|--------------------------------|
| **% of TAM**        | {{sam_percentage}}%            |
| **Annual Revenue**   | ${{sam_value}}                 |
| **Confidence Level** | {{low / mid / high}}           |

**Filtering Criteria:**
- **Reachability:** {{which_segments_can_you_reach}}
- **Business Model Fit:** {{pricing_model_constraints}}
- **Go-to-Market:** {{channel_and_distribution_constraints}}
- **Geographic Limits:** {{any_regions_excluded_from_tam}}

**Assumptions:**
- {{sam_assumption_1}}
- {{sam_assumption_2}}

---

## 3. SOM -- Serviceable Obtainable Market

The realistic near-term revenue capture based on current competitive positioning, resources, and execution capacity.

| Dimension            | Value                          |
|----------------------|--------------------------------|
| **% of SAM**        | {{som_percentage}}%            |
| **Annual Revenue**   | ${{som_value}}                 |
| **Timeline**         | {{capture_timeline}}           |
| **Confidence Level** | {{low / mid / high}}           |

**Competitive Positioning:**
- Current market share: {{current_share}}
- Key competitors and their shares: {{competitor_landscape}}
- Differentiation basis: {{why_you_win}}

**Assumptions:**
- {{som_assumption_1}}
- {{som_assumption_2}}

---

## 4. Methodology

### Top-Down Approach

Start with the total industry revenue and narrow by applying filters.

1. Total industry revenue: ${{industry_total}}
2. Geographic filter ({{geography}}): ${{after_geo_filter}}
3. Segment filter ({{segment}}): ${{after_segment_filter}}
4. Business model filter: ${{after_model_filter}}

**Key Assumptions:**
- {{top_down_assumption_1}}
- {{top_down_assumption_2}}

### Bottom-Up Approach

Build from unit economics to total opportunity.

1. Total potential customers: {{customer_count}}
2. Average revenue per user (ARPU): ${{arpu}}
3. Realistic penetration rate: {{penetration_rate}}%
4. Bottom-up estimate: {{customer_count}} x ${{arpu}} x {{penetration_rate}}% = ${{bottom_up_total}}

**Key Assumptions:**
- {{bottom_up_assumption_1}}
- {{bottom_up_assumption_2}}

### Analogous Market Approach

Reference a comparable market to triangulate.

- **Comparable market:** {{analogous_market_name}}
- **Comparable market size:** ${{analogous_value}}
- **Scaling factor:** {{scaling_rationale}}
- **Analogous estimate:** ${{analogous_result}}

---

## Cross-Validation Summary

| Approach     | Estimate       | Notes                          |
|-------------|----------------|--------------------------------|
| Top-Down    | ${{top_down}}  | {{brief_note}}                 |
| Bottom-Up   | ${{bottom_up}} | {{brief_note}}                 |
| Analogous   | ${{analogous}} | {{brief_note}}                 |
| **Variance (Top-Down vs Bottom-Up)** | {{variance_percentage}}% | {{acceptable / needs_investigation}} |

**Reconciliation:** {{explanation_of_how_final_numbers_were_derived}}

---

## Confidence Ranges

| Tier | Low Estimate | Mid Estimate | High Estimate | Confidence |
|------|-------------|-------------|--------------|------------|
| TAM  | ${{tam_low}} | ${{tam_mid}} | ${{tam_high}} | {{low / mid / high}} |
| SAM  | ${{sam_low}} | ${{sam_mid}} | ${{sam_high}} | {{low / mid / high}} |
| SOM  | ${{som_low}} | ${{som_mid}} | ${{som_high}} | {{low / mid / high}} |

---

## Sources

| # | Data Point | Source | URL | Date Accessed | Confidence |
|---|-----------|--------|-----|---------------|------------|
| 1 | {{data_point}} | {{source_name}} | {{url}} | {{date}} | {{low / mid / high}} |
| 2 | {{data_point}} | {{source_name}} | {{url}} | {{date}} | {{low / mid / high}} |
| 3 | {{data_point}} | {{source_name}} | {{url}} | {{date}} | {{low / mid / high}} |
| 4 | {{data_point}} | {{source_name}} | {{url}} | {{date}} | {{low / mid / high}} |
