import { z } from "zod";
import { roundTo } from "../utils/validation.js";

const RESPONSE_VALUES = ["like", "expect", "neutral", "live_with", "dislike"] as const;
type KanoResponse = (typeof RESPONSE_VALUES)[number];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Attractive":
    "Delighters that increase satisfaction when present but do not cause dissatisfaction when absent.",
  "One-dimensional":
    "Performance attributes where satisfaction scales linearly with fulfillment.",
  "Must-be":
    "Basic expectations that cause dissatisfaction when missing but do not increase satisfaction when fulfilled.",
  "Indifferent":
    "Features that have no meaningful effect on satisfaction either way.",
  "Reverse":
    "Features where the presence actually causes dissatisfaction -- the opposite of what was intended.",
  "Questionable":
    "Contradictory response -- the respondent may have misunderstood the question.",
};

/**
 * 5x5 Kano evaluation table.
 * Rows = functional response, Columns = dysfunctional response.
 * Order: like, expect, neutral, live_with, dislike
 */
const KANO_TABLE: Record<KanoResponse, Record<KanoResponse, string>> = {
  like: {
    like: "Questionable",
    expect: "Attractive",
    neutral: "Attractive",
    live_with: "Attractive",
    dislike: "One-dimensional",
  },
  expect: {
    like: "Reverse",
    expect: "Indifferent",
    neutral: "Indifferent",
    live_with: "Indifferent",
    dislike: "Must-be",
  },
  neutral: {
    like: "Reverse",
    expect: "Indifferent",
    neutral: "Indifferent",
    live_with: "Indifferent",
    dislike: "Must-be",
  },
  live_with: {
    like: "Reverse",
    expect: "Indifferent",
    neutral: "Indifferent",
    live_with: "Indifferent",
    dislike: "Must-be",
  },
  dislike: {
    like: "Reverse",
    expect: "Reverse",
    neutral: "Reverse",
    live_with: "Reverse",
    dislike: "Questionable",
  },
};

function classify(functional: KanoResponse, dysfunctional: KanoResponse): string {
  return KANO_TABLE[functional][dysfunctional];
}

const responseEnum = z.enum(RESPONSE_VALUES);

/**
 * kano_classify tool definition for FastMCP.
 */
export const kanoClassifyTool = {
  name: "kano_classify",
  description:
    "Classify a single Kano model response pair. Given a functional response (how the user feels " +
    "if the feature IS present) and a dysfunctional response (how the user feels if it IS NOT present), " +
    "returns the Kano category: Attractive, One-dimensional, Must-be, Indifferent, Reverse, or Questionable.",
  parameters: z.object({
    functional: responseEnum.describe(
      "User response to the functional question (feature IS present): like, expect, neutral, live_with, dislike"
    ),
    dysfunctional: responseEnum.describe(
      "User response to the dysfunctional question (feature IS NOT present): like, expect, neutral, live_with, dislike"
    ),
  }),
  execute: async (params: {
    functional: KanoResponse;
    dysfunctional: KanoResponse;
  }) => {
    const { functional, dysfunctional } = params;
    const category = classify(functional, dysfunctional);
    const description = CATEGORY_DESCRIPTIONS[category];

    return JSON.stringify(
      {
        category,
        functional,
        dysfunctional,
        description,
      },
      null,
      2
    );
  },
};

/**
 * kano_batch tool definition for FastMCP.
 */
export const kanoBatchTool = {
  name: "kano_batch",
  description:
    "Classify multiple Kano model responses across multiple features. For each feature, " +
    "provide an array of respondent answers. Returns the dominant category per feature with " +
    "distribution percentages and confidence level.",
  parameters: z.object({
    features: z
      .array(
        z.object({
          name: z.string().describe("Feature name"),
          responses: z
            .array(
              z.object({
                functional: responseEnum.describe("Functional response"),
                dysfunctional: responseEnum.describe("Dysfunctional response"),
              })
            )
            .min(1)
            .describe("Array of respondent answers for this feature"),
        })
      )
      .min(1)
      .describe("Array of features with respondent data"),
  }),
  execute: async (params: {
    features: Array<{
      name: string;
      responses: Array<{
        functional: KanoResponse;
        dysfunctional: KanoResponse;
      }>;
    }>;
  }) => {
    const { features } = params;

    const results = features.map((feature) => {
      const counts: Record<string, number> = {
        "Attractive": 0,
        "One-dimensional": 0,
        "Must-be": 0,
        "Indifferent": 0,
        "Reverse": 0,
        "Questionable": 0,
      };

      for (const response of feature.responses) {
        const category = classify(response.functional, response.dysfunctional);
        counts[category]++;
      }

      const respondentCount = feature.responses.length;

      // Calculate distribution as percentages
      const distribution: Record<string, number> = {};
      for (const [cat, count] of Object.entries(counts)) {
        distribution[cat] = roundTo((count / respondentCount) * 100, 1);
      }

      // Find dominant category (highest count)
      let dominantCategory = "Indifferent";
      let maxCount = 0;
      for (const [cat, count] of Object.entries(counts)) {
        if (count > maxCount) {
          maxCount = count;
          dominantCategory = cat;
        }
      }

      const dominantPct = roundTo((maxCount / respondentCount) * 100, 1);
      let confidence: string;
      if (dominantPct > 60) {
        confidence = "Strong";
      } else if (dominantPct >= 40) {
        confidence = "Moderate";
      } else {
        confidence = "Weak";
      }

      return {
        name: feature.name,
        dominant_category: dominantCategory,
        distribution,
        confidence,
        respondent_count: respondentCount,
      };
    });

    return JSON.stringify({ features: results }, null, 2);
  },
};
