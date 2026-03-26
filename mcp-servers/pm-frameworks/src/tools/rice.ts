import { z } from "zod";
import { validatePositive, validateRange, validateScale, roundTo } from "../utils/validation.js";

const STANDARD_IMPACT_SCALE = [0.25, 0.5, 1, 2, 3];

const IMPACT_LABELS: Record<number, string> = {
  0.25: "minimal",
  0.5: "low",
  1: "medium",
  2: "high",
  3: "massive",
};

function getImpactLabel(impact: number): string {
  return IMPACT_LABELS[impact] ?? `custom (${impact})`;
}

function computeRice(
  reach: number,
  impact: number,
  confidence: number,
  effort: number
): number {
  return (reach * impact * (confidence / 100)) / effort;
}

/**
 * rice_score tool definition for FastMCP.
 */
export const riceScoreTool = {
  name: "rice_score",
  description:
    "Calculate a RICE prioritization score. RICE = (Reach * Impact * Confidence%) / Effort. " +
    "Standard impact scale: 0.25 (minimal), 0.5 (low), 1 (medium), 2 (high), 3 (massive). " +
    "Confidence is a percentage (0-100). Effort is in person-months (must be > 0).",
  parameters: z.object({
    reach: z
      .number()
      .min(0)
      .describe("Number of users/customers reached per time period (>= 0)"),
    impact: z
      .number()
      .describe(
        "Expected impact per user. Standard scale: 0.25 (minimal), 0.5 (low), 1 (medium), 2 (high), 3 (massive)"
      ),
    confidence: z
      .number()
      .min(0)
      .max(100)
      .describe("Confidence percentage (0-100)"),
    effort: z
      .number()
      .describe("Effort in person-months (must be > 0)"),
  }),
  execute: async (params: {
    reach: number;
    impact: number;
    confidence: number;
    effort: number;
  }) => {
    const { reach, impact, confidence, effort } = params;

    // Validate inputs
    validateRange(confidence, 0, 100, "confidence");
    validatePositive(effort, "effort");

    // Warn if impact is not on the standard scale (but still proceed)
    const warnings: string[] = [];
    if (!STANDARD_IMPACT_SCALE.includes(impact)) {
      warnings.push(
        `Impact value ${impact} is not in the standard RICE scale [${STANDARD_IMPACT_SCALE.join(", ")}]. Calculating anyway.`
      );
    }

    const score = roundTo(computeRice(reach, impact, confidence, effort), 2);
    const impactLabel = getImpactLabel(impact);

    let summary = `RICE score of ${score}: Reaches ${reach} users with ${impactLabel} impact (${impact}) at ${confidence}% confidence for ${effort} person-months of effort.`;

    if (warnings.length > 0) {
      summary += " Warning: " + warnings.join(" ");
    }

    return JSON.stringify(
      {
        score,
        reach,
        impact,
        confidence,
        effort,
        summary,
        ...(warnings.length > 0 ? { warnings } : {}),
      },
      null,
      2
    );
  },
};

/**
 * rice_batch tool definition for FastMCP.
 */
export const riceBatchTool = {
  name: "rice_batch",
  description:
    "Calculate RICE scores for multiple features and return them ranked. " +
    "Provides scores sorted descending with summary statistics (mean, median, min, max).",
  parameters: z.object({
    features: z
      .array(
        z.object({
          name: z.string().describe("Feature name"),
          reach: z.number().min(0).describe("Users reached per time period"),
          impact: z
            .number()
            .describe("Impact per user (standard: 0.25, 0.5, 1, 2, 3)"),
          confidence: z.number().min(0).max(100).describe("Confidence % (0-100)"),
          effort: z.number().describe("Effort in person-months (> 0)"),
        })
      )
      .min(1)
      .describe("Array of features to score"),
  }),
  execute: async (params: {
    features: Array<{
      name: string;
      reach: number;
      impact: number;
      confidence: number;
      effort: number;
    }>;
  }) => {
    const { features } = params;
    const warnings: string[] = [];

    // Score each feature
    const scored = features.map((f) => {
      validatePositive(f.effort, `effort for "${f.name}"`);
      validateRange(f.confidence, 0, 100, `confidence for "${f.name}"`);

      if (!STANDARD_IMPACT_SCALE.includes(f.impact)) {
        warnings.push(
          `Impact value ${f.impact} for "${f.name}" is not in the standard RICE scale.`
        );
      }

      const score = roundTo(
        computeRice(f.reach, f.impact, f.confidence, f.effort),
        2
      );

      return {
        name: f.name,
        score,
        params: {
          reach: f.reach,
          impact: f.impact,
          confidence: f.confidence,
          effort: f.effort,
        },
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // Assign ranks
    const ranked = scored.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    // Compute stats
    const scores = ranked.map((r) => r.score);
    const sortedScores = [...scores].sort((a, b) => a - b);
    const mean = roundTo(
      scores.reduce((sum, s) => sum + s, 0) / scores.length,
      2
    );
    const median =
      scores.length % 2 === 0
        ? roundTo(
            (sortedScores[scores.length / 2 - 1] +
              sortedScores[scores.length / 2]) /
              2,
            2
          )
        : sortedScores[Math.floor(scores.length / 2)];
    const min = sortedScores[0];
    const max = sortedScores[sortedScores.length - 1];

    const topFeature = ranked[0];
    const summary = `Ranked ${ranked.length} features by RICE score. Top recommendation: "${topFeature.name}" with a score of ${topFeature.score}. Score range: ${min} - ${max}, mean: ${mean}, median: ${median}.`;

    return JSON.stringify(
      {
        features: ranked,
        stats: { mean, median, min, max },
        summary,
        ...(warnings.length > 0 ? { warnings } : {}),
      },
      null,
      2
    );
  },
};
