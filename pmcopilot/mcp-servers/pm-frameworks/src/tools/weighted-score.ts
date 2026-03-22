import { z } from "zod";
import { roundTo } from "../utils/validation.js";

/**
 * weighted_score tool definition for FastMCP.
 */
export const weightedScoreTool = {
  name: "weighted_score",
  description:
    "Calculate weighted prioritization scores using custom criteria. Each feature is scored " +
    "against named criteria, and each criterion has a weight (0-100). Weights should sum to 100; " +
    "if they do not, they will be normalized with a warning. Returns features ranked by weighted score.",
  parameters: z.object({
    features: z
      .array(
        z.object({
          name: z.string().describe("Feature name"),
          scores: z
            .record(z.string(), z.number())
            .describe(
              "Scores per criterion as { criterion_name: score_value }. Use consistent criteria across features."
            ),
        })
      )
      .min(1)
      .describe("Array of features to score"),
    weights: z
      .record(z.string(), z.number())
      .describe(
        "Criteria weights as { criterion_name: weight }. Weights should sum to 100."
      ),
  }),
  execute: async (params: {
    features: Array<{ name: string; scores: Record<string, number> }>;
    weights: Record<string, number>;
  }) => {
    const { features, weights } = params;
    const warnings: string[] = [];

    // Calculate weight sum
    const weightEntries = Object.entries(weights);
    const weightSum = weightEntries.reduce((sum, [, w]) => sum + w, 0);

    // Normalize if weights do not sum to 100
    let effectiveWeights: Record<string, number> = { ...weights };
    if (Math.abs(weightSum - 100) > 0.01) {
      warnings.push(
        `Weights sum to ${weightSum}, not 100. Normalizing weights proportionally.`
      );
      effectiveWeights = {};
      for (const [criterion, weight] of weightEntries) {
        effectiveWeights[criterion] = (weight / weightSum) * 100;
      }
    }

    // Score each feature
    const scored = features.map((feature) => {
      const breakdown: Record<string, { score: number; weight: number; weighted: number }> = {};
      let weightedSum = 0;

      for (const [criterion, weight] of Object.entries(effectiveWeights)) {
        const score = feature.scores[criterion] ?? 0;
        if (feature.scores[criterion] === undefined) {
          warnings.push(
            `Feature "${feature.name}" is missing a score for criterion "${criterion}". Defaulting to 0.`
          );
        }
        const weighted = roundTo(score * (weight / 100), 4);
        weightedSum += weighted;
        breakdown[criterion] = {
          score,
          weight: roundTo(weight, 2),
          weighted: roundTo(weighted, 4),
        };
      }

      return {
        name: feature.name,
        weighted_score: roundTo(weightedSum, 2),
        per_criteria_breakdown: breakdown,
      };
    });

    // Sort descending by weighted score
    scored.sort((a, b) => b.weighted_score - a.weighted_score);

    // Assign ranks
    const ranked = scored.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));

    const topFeature = ranked[0];
    const summary =
      `Ranked ${ranked.length} features by weighted score across ${weightEntries.length} criteria. ` +
      `Top recommendation: "${topFeature.name}" with a weighted score of ${topFeature.weighted_score}.`;

    return JSON.stringify(
      {
        features: ranked,
        criteria_weights: effectiveWeights,
        summary,
        ...(warnings.length > 0 ? { warnings } : {}),
      },
      null,
      2
    );
  },
};
