import { z } from "zod";
import { validatePositive, roundTo } from "../utils/validation.js";

/**
 * cost_of_delay tool definition for FastMCP.
 */
export const costOfDelayTool = {
  name: "cost_of_delay",
  description:
    "Calculate Cost of Delay Divided by Duration (CD3) for WSJF-style prioritization. " +
    "Cost of Delay = revenue_lost + churn_risk + competitive_erosion + regulatory_risk (all per week). " +
    "CD3 = Cost of Delay / duration_weeks. Features are ranked by CD3 descending (highest urgency first).",
  parameters: z.object({
    features: z
      .array(
        z.object({
          name: z.string().describe("Feature name"),
          duration_weeks: z
            .number()
            .describe("Estimated duration in weeks (must be > 0)"),
          revenue_lost: z
            .number()
            .min(0)
            .optional()
            .describe("Revenue lost per week of delay in dollars (default 0)"),
          churn_risk: z
            .number()
            .min(0)
            .optional()
            .describe("Churn risk cost per week in dollars (default 0)"),
          competitive_erosion: z
            .number()
            .min(0)
            .optional()
            .describe("Competitive erosion cost per week in dollars (default 0)"),
          regulatory_risk: z
            .number()
            .min(0)
            .optional()
            .describe("Regulatory risk cost per week in dollars (default 0)"),
        })
      )
      .min(1)
      .describe("Array of features to prioritize"),
  }),
  execute: async (params: {
    features: Array<{
      name: string;
      duration_weeks: number;
      revenue_lost?: number;
      churn_risk?: number;
      competitive_erosion?: number;
      regulatory_risk?: number;
    }>;
  }) => {
    const { features } = params;

    const scored = features.map((f) => {
      validatePositive(f.duration_weeks, `duration_weeks for "${f.name}"`);

      const revenueLost = f.revenue_lost ?? 0;
      const churnRisk = f.churn_risk ?? 0;
      const competitiveErosion = f.competitive_erosion ?? 0;
      const regulatoryRisk = f.regulatory_risk ?? 0;

      const costOfDelay = revenueLost + churnRisk + competitiveErosion + regulatoryRisk;
      const cd3 = roundTo(costOfDelay / f.duration_weeks, 2);

      return {
        name: f.name,
        cost_of_delay: roundTo(costOfDelay, 2),
        duration_weeks: f.duration_weeks,
        cd3,
        cost_breakdown: {
          revenue_lost: revenueLost,
          churn_risk: churnRisk,
          competitive_erosion: competitiveErosion,
          regulatory_risk: regulatoryRisk,
        },
      };
    });

    // Sort descending by CD3
    scored.sort((a, b) => b.cd3 - a.cd3);

    // Assign ranks
    const ranked = scored.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));

    const topFeature = ranked[0];
    const summary =
      `Ranked ${ranked.length} features by CD3 (Cost of Delay / Duration). ` +
      `Highest urgency: "${topFeature.name}" with CD3 of ${topFeature.cd3} ` +
      `($${topFeature.cost_of_delay}/week delay cost over ${topFeature.duration_weeks} weeks).`;

    return JSON.stringify(
      {
        features: ranked,
        summary,
      },
      null,
      2
    );
  },
};
