import { z } from "zod";
import { validateRange, roundTo } from "../utils/validation.js";

/**
 * Z-score lookup table for common significance and power levels.
 */
const Z_SCORES: Record<number, number> = {
  0.80: 0.842,
  0.85: 1.036,
  0.90: 1.282,
  0.95: 1.645,
  0.975: 1.960,
  0.99: 2.326,
  0.995: 2.576,
};

function getZScore(level: number, label: string): number {
  const z = Z_SCORES[level];
  if (z === undefined) {
    const available = Object.keys(Z_SCORES).join(", ");
    throw new Error(
      `No z-score available for ${label} = ${level}. Supported values: ${available}.`
    );
  }
  return z;
}

/**
 * sample_size_calc tool definition for FastMCP.
 */
export const sampleSizeCalcTool = {
  name: "sample_size_calc",
  description:
    "Calculate the required sample size per variant for an A/B test using a two-proportion z-test. " +
    "Provide the baseline conversion rate, minimum detectable effect (relative), and optionally " +
    "significance level (default 0.95) and power (default 0.80).",
  parameters: z.object({
    baseline_rate: z
      .number()
      .describe("Baseline conversion rate (0-1, e.g. 0.05 for 5%)"),
    mde: z
      .number()
      .describe(
        "Minimum detectable effect as a relative change (e.g. 0.10 for a 10% relative lift)"
      ),
    significance: z
      .number()
      .optional()
      .describe(
        "Significance level (default 0.95). Supported: 0.80, 0.85, 0.90, 0.95, 0.975, 0.99, 0.995"
      ),
    power: z
      .number()
      .optional()
      .describe(
        "Statistical power (default 0.80). Supported: 0.80, 0.85, 0.90, 0.95, 0.975, 0.99, 0.995"
      ),
  }),
  execute: async (params: {
    baseline_rate: number;
    mde: number;
    significance?: number;
    power?: number;
  }) => {
    const { baseline_rate, mde } = params;
    const significance = params.significance ?? 0.95;
    const power = params.power ?? 0.80;

    validateRange(baseline_rate, 0, 1, "baseline_rate");

    // Two-sided test: alpha/2
    const alphaLevel = 1 - (1 - significance) / 2;
    const zAlpha = getZScore(alphaLevel, "significance (alpha/2)");
    const zBeta = getZScore(power, "power");

    const p1 = baseline_rate;
    const p2 = baseline_rate * (1 + mde);

    if (p2 > 1 || p2 < 0) {
      throw new Error(
        `Expected variant rate ${p2} is out of range [0, 1]. ` +
        `Check that baseline_rate (${baseline_rate}) and mde (${mde}) produce a valid rate.`
      );
    }

    const delta = p2 - p1;
    if (Math.abs(delta) < 1e-10) {
      throw new Error(
        "Minimum detectable effect results in zero absolute difference. Increase mde."
      );
    }

    const pBar = (p1 + p2) / 2;
    const numerator = Math.pow(
      zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) +
        zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)),
      2
    );
    const denominator = Math.pow(delta, 2);

    const sampleSizePerVariant = Math.ceil(numerator / denominator);
    const totalSampleSize = sampleSizePerVariant * 2;

    const absoluteEffect = roundTo(p2 - p1, 6);

    const summary =
      `A/B test requires ${sampleSizePerVariant.toLocaleString()} visitors per variant ` +
      `(${totalSampleSize.toLocaleString()} total) to detect a ${roundTo(mde * 100, 2)}% relative lift ` +
      `from a ${roundTo(baseline_rate * 100, 2)}% baseline (${roundTo(p1 * 100, 2)}% -> ${roundTo(p2 * 100, 2)}%) ` +
      `at ${roundTo(significance * 100, 1)}% significance with ${roundTo(power * 100, 1)}% power.`;

    return JSON.stringify(
      {
        sample_size_per_variant: sampleSizePerVariant,
        total_sample_size: totalSampleSize,
        baseline_rate: p1,
        expected_variant_rate: roundTo(p2, 6),
        absolute_effect: absoluteEffect,
        significance,
        power,
        summary,
      },
      null,
      2
    );
  },
};
