import { z } from "zod";
import { validateRange, roundTo } from "../utils/validation.js";

function classifyOpportunity(score: number): string {
  if (score > 15) return "Underserved";
  if (score >= 12) return "Appropriately Served";
  return "Overserved";
}

/**
 * opportunity_score tool definition for FastMCP.
 */
export const opportunityScoreTool = {
  name: "opportunity_score",
  description:
    "Calculate Outcome-Driven Innovation (ODI) opportunity scores. " +
    "Formula: score = importance + max(importance - satisfaction, 0). " +
    "Classification: >15 Underserved, 12-15 Appropriately Served, <12 Overserved. " +
    "Returns features ranked by opportunity score descending.",
  parameters: z.object({
    features: z
      .array(
        z.object({
          name: z.string().describe("Feature or job-to-be-done name"),
          importance: z
            .number()
            .min(1)
            .max(10)
            .describe("How important is this outcome to the user (1-10)"),
          satisfaction: z
            .number()
            .min(1)
            .max(10)
            .describe("How satisfied are users with current solutions (1-10)"),
        })
      )
      .min(1)
      .describe("Array of features to evaluate"),
  }),
  execute: async (params: {
    features: Array<{
      name: string;
      importance: number;
      satisfaction: number;
    }>;
  }) => {
    const { features } = params;

    const scored = features.map((f) => {
      validateRange(f.importance, 1, 10, `importance for "${f.name}"`);
      validateRange(f.satisfaction, 1, 10, `satisfaction for "${f.name}"`);

      const gap = Math.max(f.importance - f.satisfaction, 0);
      const score = roundTo(f.importance + gap, 2);
      const classification = classifyOpportunity(score);

      return {
        name: f.name,
        importance: f.importance,
        satisfaction: f.satisfaction,
        gap: roundTo(gap, 2),
        score,
        classification,
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // Assign ranks
    const ranked = scored.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));

    const underserved = ranked.filter((r) => r.classification === "Underserved");
    const topFeature = ranked[0];
    const summary =
      `Ranked ${ranked.length} features by ODI opportunity score. ` +
      `Top opportunity: "${topFeature.name}" with a score of ${topFeature.score} (${topFeature.classification}). ` +
      `${underserved.length} feature(s) classified as Underserved.`;

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
