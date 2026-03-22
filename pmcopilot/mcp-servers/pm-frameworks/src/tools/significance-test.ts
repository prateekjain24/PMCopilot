import { z } from "zod";
import { validatePositive, roundTo } from "../utils/validation.js";

/**
 * Approximate the standard normal CDF using the Abramowitz and Stegun approximation.
 * Accurate to about 1e-5.
 */
function normalCDF(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * absX);
  const poly = t * (a1 + t * (a2 + t * (a3 + t * (a4 + t * a5))));
  const cdf = 1.0 - poly * Math.exp(-absX * absX / 2);

  return 0.5 * (1.0 + sign * cdf);
}

/**
 * significance_test tool definition for FastMCP.
 */
export const significanceTestTool = {
  name: "significance_test",
  description:
    "Run a two-proportion z-test on A/B experiment results. Provide control and variant " +
    "visitor counts and conversion counts. Returns z-score, p-value, whether the result is " +
    "statistically significant, relative and absolute lift, and a 95% confidence interval on the difference.",
  parameters: z.object({
    control_visitors: z
      .number()
      .int()
      .min(1)
      .describe("Number of visitors in the control group"),
    control_conversions: z
      .number()
      .int()
      .min(0)
      .describe("Number of conversions in the control group"),
    variant_visitors: z
      .number()
      .int()
      .min(1)
      .describe("Number of visitors in the variant group"),
    variant_conversions: z
      .number()
      .int()
      .min(0)
      .describe("Number of conversions in the variant group"),
    significance_level: z
      .number()
      .min(0.001)
      .max(0.5)
      .optional()
      .describe("Significance level / alpha (default 0.05, i.e. 95% confidence)"),
  }),
  execute: async (params: {
    control_visitors: number;
    control_conversions: number;
    variant_visitors: number;
    variant_conversions: number;
    significance_level?: number;
  }) => {
    const {
      control_visitors,
      control_conversions,
      variant_visitors,
      variant_conversions,
    } = params;
    const significanceLevel = params.significance_level ?? 0.05;

    validatePositive(control_visitors, "control_visitors");
    validatePositive(variant_visitors, "variant_visitors");

    if (control_conversions > control_visitors) {
      throw new Error(
        `control_conversions (${control_conversions}) cannot exceed control_visitors (${control_visitors}).`
      );
    }
    if (variant_conversions > variant_visitors) {
      throw new Error(
        `variant_conversions (${variant_conversions}) cannot exceed variant_visitors (${variant_visitors}).`
      );
    }

    const p1 = control_conversions / control_visitors;
    const p2 = variant_conversions / variant_visitors;
    const pPool =
      (control_conversions + variant_conversions) /
      (control_visitors + variant_visitors);

    const se = Math.sqrt(
      pPool * (1 - pPool) * (1 / control_visitors + 1 / variant_visitors)
    );

    let zScore: number;
    let pValue: number;
    if (se === 0) {
      zScore = 0;
      pValue = 1;
    } else {
      zScore = roundTo((p2 - p1) / se, 4);
      // Two-tailed p-value
      pValue = roundTo(2 * (1 - normalCDF(Math.abs(zScore))), 6);
    }

    const significant = pValue < significanceLevel;
    const absoluteLift = roundTo(p2 - p1, 6);
    const relativeLift = p1 > 0 ? roundTo(((p2 - p1) / p1) * 100, 2) : p2 > 0 ? Infinity : 0;

    // 95% CI on the difference (p2 - p1) using unpooled SE
    const seUnpooled = Math.sqrt(
      (p1 * (1 - p1)) / control_visitors +
        (p2 * (1 - p2)) / variant_visitors
    );
    const zCritical = 1.96; // 95% CI
    const ciLower = roundTo((p2 - p1) - zCritical * seUnpooled, 6);
    const ciUpper = roundTo((p2 - p1) + zCritical * seUnpooled, 6);

    let interpretation: string;
    if (significant && p2 > p1) {
      interpretation =
        `The variant outperforms the control with a ${relativeLift}% relative lift ` +
        `(${roundTo(p1 * 100, 2)}% -> ${roundTo(p2 * 100, 2)}%), ` +
        `and the result is statistically significant (p=${pValue}).`;
    } else if (significant && p2 < p1) {
      interpretation =
        `The variant underperforms the control by ${Math.abs(relativeLift)}% ` +
        `(${roundTo(p1 * 100, 2)}% -> ${roundTo(p2 * 100, 2)}%), ` +
        `and the result is statistically significant (p=${pValue}). Consider rolling back.`;
    } else {
      interpretation =
        `No statistically significant difference detected (p=${pValue}, threshold=${significanceLevel}). ` +
        `Control: ${roundTo(p1 * 100, 2)}%, Variant: ${roundTo(p2 * 100, 2)}%. ` +
        `The test may need more traffic to reach significance.`;
    }

    return JSON.stringify(
      {
        control_rate: roundTo(p1, 6),
        variant_rate: roundTo(p2, 6),
        relative_lift: relativeLift,
        absolute_lift: absoluteLift,
        z_score: zScore,
        p_value: pValue,
        significant,
        confidence_interval: {
          lower: ciLower,
          upper: ciUpper,
        },
        interpretation,
      },
      null,
      2
    );
  },
};
