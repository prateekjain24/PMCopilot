import { z } from "zod";
import { roundTo } from "../utils/validation.js";

const MOSCOW_CATEGORIES = ["must", "should", "could", "wont"] as const;
type MoscowCategory = (typeof MOSCOW_CATEGORIES)[number];

const CATEGORY_LABELS: Record<MoscowCategory, string> = {
  must: "Must Have",
  should: "Should Have",
  could: "Could Have",
  wont: "Won't Have",
};

/**
 * moscow_sort tool definition for FastMCP.
 */
export const moscowSortTool = {
  name: "moscow_sort",
  description:
    "Categorize features into MoSCoW priority buckets (Must Have, Should Have, Could Have, " +
    "Won't Have). Validates the 60/20/20 effort distribution rule and warns if Must Have " +
    "items consume more than 60% of total effort.",
  parameters: z.object({
    features: z
      .array(
        z.object({
          name: z.string().describe("Feature name"),
          category: z
            .enum(MOSCOW_CATEGORIES)
            .describe("MoSCoW category: must, should, could, wont"),
          effort_estimate: z
            .number()
            .min(0)
            .optional()
            .describe("Effort estimate in person-days (optional, defaults to 0)"),
        })
      )
      .min(1)
      .describe("Array of features to categorize"),
  }),
  execute: async (params: {
    features: Array<{
      name: string;
      category: MoscowCategory;
      effort_estimate?: number;
    }>;
  }) => {
    const { features } = params;
    const warnings: string[] = [];

    // Group features by category
    const buckets: Record<MoscowCategory, Array<{ name: string; effort_estimate: number }>> = {
      must: [],
      should: [],
      could: [],
      wont: [],
    };

    for (const f of features) {
      buckets[f.category].push({
        name: f.name,
        effort_estimate: f.effort_estimate ?? 0,
      });
    }

    // Calculate effort per bucket (exclude wont from percentage calc)
    const effortByBucket: Record<MoscowCategory, number> = {
      must: 0,
      should: 0,
      could: 0,
      wont: 0,
    };

    for (const cat of MOSCOW_CATEGORIES) {
      effortByBucket[cat] = buckets[cat].reduce(
        (sum, item) => sum + item.effort_estimate,
        0
      );
    }

    // Total effort excluding wont for percentage calculation
    const activeEffort =
      effortByBucket.must + effortByBucket.should + effortByBucket.could;

    const effortSummary: Record<string, number> = {
      must_pct: activeEffort > 0 ? roundTo((effortByBucket.must / activeEffort) * 100, 1) : 0,
      should_pct: activeEffort > 0 ? roundTo((effortByBucket.should / activeEffort) * 100, 1) : 0,
      could_pct: activeEffort > 0 ? roundTo((effortByBucket.could / activeEffort) * 100, 1) : 0,
    };

    // Validate 60/20/20 rule
    if (effortSummary.must_pct > 60) {
      warnings.push(
        `Must Have items consume ${effortSummary.must_pct}% of effort, exceeding the recommended 60% ceiling. ` +
        `Consider moving lower-priority Must Have items to Should Have.`
      );
    }

    // Format buckets for output
    const formattedBuckets: Record<string, Array<{ name: string; effort_estimate: number }>> = {};
    for (const cat of MOSCOW_CATEGORIES) {
      formattedBuckets[CATEGORY_LABELS[cat]] = buckets[cat];
    }

    const summary =
      `Sorted ${features.length} features into MoSCoW buckets: ` +
      `${buckets.must.length} Must Have, ${buckets.should.length} Should Have, ` +
      `${buckets.could.length} Could Have, ${buckets.wont.length} Won't Have. ` +
      `Effort split (Must/Should/Could): ${effortSummary.must_pct}%/${effortSummary.should_pct}%/${effortSummary.could_pct}%.`;

    return JSON.stringify(
      {
        buckets: formattedBuckets,
        effort_summary: effortSummary,
        summary,
        ...(warnings.length > 0 ? { warnings } : {}),
      },
      null,
      2
    );
  },
};
