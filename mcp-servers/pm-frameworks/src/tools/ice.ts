import { z } from "zod";
import { validateRange, roundTo } from "../utils/validation.js";

interface TierInfo {
  tier: string;
  minScore: number;
  maxScore: number;
}

const TIERS: TierInfo[] = [
  { tier: "High Priority", minScore: 700, maxScore: 1000 },
  { tier: "Medium Priority", minScore: 400, maxScore: 699 },
  { tier: "Low Priority", minScore: 100, maxScore: 399 },
  { tier: "Deprioritize", minScore: 1, maxScore: 99 },
];

function classifyTier(score: number): string {
  for (const t of TIERS) {
    if (score >= t.minScore && score <= t.maxScore) {
      return t.tier;
    }
  }
  return "Deprioritize";
}

/**
 * ice_score tool definition for FastMCP.
 */
export const iceScoreTool = {
  name: "ice_score",
  description:
    "Calculate an ICE prioritization score. ICE = Impact * Confidence * Ease. " +
    "All three parameters are rated on a 1-10 scale. " +
    "Tiers: 700-1000 High Priority, 400-699 Medium Priority, 100-399 Low Priority, 1-99 Deprioritize.",
  parameters: z.object({
    impact: z
      .number()
      .min(1)
      .max(10)
      .describe("Impact score (1-10). How much will this move the target metric?"),
    confidence: z
      .number()
      .min(1)
      .max(10)
      .describe(
        "Confidence score (1-10). How confident are you in impact and ease estimates?"
      ),
    ease: z
      .number()
      .min(1)
      .max(10)
      .describe(
        "Ease score (1-10). How easy is this to implement? 10 = trivial, 1 = extremely hard."
      ),
  }),
  execute: async (params: {
    impact: number;
    confidence: number;
    ease: number;
  }) => {
    let { impact, confidence, ease } = params;
    const warnings: string[] = [];

    // Round non-integers with a warning
    if (!Number.isInteger(impact)) {
      warnings.push(
        `Impact ${impact} is not an integer. Rounding to ${Math.round(impact)}.`
      );
      impact = Math.round(impact);
    }
    if (!Number.isInteger(confidence)) {
      warnings.push(
        `Confidence ${confidence} is not an integer. Rounding to ${Math.round(confidence)}.`
      );
      confidence = Math.round(confidence);
    }
    if (!Number.isInteger(ease)) {
      warnings.push(
        `Ease ${ease} is not an integer. Rounding to ${Math.round(ease)}.`
      );
      ease = Math.round(ease);
    }

    // Validate 1-10 range after rounding
    validateRange(impact, 1, 10, "impact");
    validateRange(confidence, 1, 10, "confidence");
    validateRange(ease, 1, 10, "ease");

    const score = impact * confidence * ease;
    const tier = classifyTier(score);

    let summary = `ICE score of ${score} (${tier}): Impact ${impact}/10, Confidence ${confidence}/10, Ease ${ease}/10`;

    if (warnings.length > 0) {
      summary += ". Note: " + warnings.join(" ");
    }

    return JSON.stringify(
      {
        score,
        impact,
        confidence,
        ease,
        tier,
        summary,
        ...(warnings.length > 0 ? { warnings } : {}),
      },
      null,
      2
    );
  },
};
