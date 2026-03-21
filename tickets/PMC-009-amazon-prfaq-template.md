---
id: PMC-009
title: Amazon PRFAQ Template
phase: 1 - Core Skills
status: done
type: template
estimate: 1
dependencies: [PMC-006]
---

## Description

Create the Amazon-style PRFAQ template at `skills/prd-generator/templates/amazon-prfaq.md`. The PRFAQ (Press Release / Frequently Asked Questions) format is Amazon&apos;s "working backwards" approach to product definition. Instead of starting with requirements, it begins with a hypothetical press release announcing the finished product, then answers stakeholder questions. This forces clarity on customer value before any implementation detail. The template must guide the PM through writing a future-dated press release and two FAQ sections (external customer-facing and internal stakeholder-facing).

## Acceptance Criteria

- [ ] File created at `skills/prd-generator/templates/amazon-prfaq.md`
- [ ] Contains **Press Release** section written in future-back style, with guidance and placeholders for:
  - Headline (one sentence, customer benefit focused)
  - Sub-headline (target customer and value proposition)
  - Date and location line
  - Problem paragraph (the customer pain being solved)
  - Solution paragraph (how the product solves it)
  - Quote from company leadership (placeholder)
  - How-it-works paragraph (brief mechanics)
  - Customer quote (placeholder, expressing delight)
  - Call to action / availability paragraph
- [ ] Contains **FAQ - External** section with guidance on writing 5-10 customer-facing questions covering pricing, availability, getting started, and differentiation, with placeholder Q&A pairs
- [ ] Contains **FAQ - Internal** section with guidance on writing 5-10 internal stakeholder questions covering business model, cost structure, dependencies, risks, and success metrics, with placeholder Q&A pairs
- [ ] Contains **Appendix** section with guidance on including supporting data, mockups, competitive analysis, and financial projections
- [ ] Every section includes guidance text explaining the purpose and how to fill it in
- [ ] Template uses markdown formatting consistent with other PMCopilot templates

## Files to Create/Modify

- `skills/prd-generator/templates/amazon-prfaq.md`
