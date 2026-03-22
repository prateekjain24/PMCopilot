import { z } from "zod";
import { validateRange, roundTo } from "../utils/validation.js";

const METHODOLOGIES = ["top_down", "bottom_up", "analogous"] as const;
type Methodology = (typeof METHODOLOGIES)[number];

const METHODOLOGY_DESCRIPTIONS: Record<Methodology, string> = {
  top_down:
    "Starting from total industry data and narrowing down to addressable segments.",
  bottom_up:
    "Building up from unit economics, pricing, and customer counts.",
  analogous:
    "Estimating based on comparable markets, geographies, or products.",
};

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${roundTo(value / 1_000_000_000, 2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${roundTo(value / 1_000_000, 2)}M`;
  }
  if (value >= 1_000) {
    return `$${roundTo(value / 1_000, 2)}K`;
  }
  return `$${roundTo(value, 2)}`;
}

/**
 * tam_sam_som tool definition for FastMCP.
 */
export const tamSamSomTool = {
  name: "tam_sam_som",
  description:
    "Calculate TAM (Total Addressable Market), SAM (Serviceable Addressable Market), and " +
    "SOM (Serviceable Obtainable Market) from a total market size, serviceable percentage, " +
    "and obtainable percentage. Supports top-down, bottom-up, and analogous methodologies.",
  parameters: z.object({
    total_market: z
      .number()
      .min(0)
      .describe("Total Addressable Market in dollars ($)"),
    serviceable_pct: z
      .number()
      .min(0)
      .max(100)
      .describe("Percentage of TAM that is serviceable (0-100)"),
    obtainable_pct: z
      .number()
      .min(0)
      .max(100)
      .describe("Percentage of SAM that is realistically obtainable (0-100)"),
    methodology: z
      .enum(METHODOLOGIES)
      .describe("Market sizing methodology: top_down, bottom_up, or analogous"),
  }),
  execute: async (params: {
    total_market: number;
    serviceable_pct: number;
    obtainable_pct: number;
    methodology: Methodology;
  }) => {
    const { total_market, serviceable_pct, obtainable_pct, methodology } = params;

    validateRange(serviceable_pct, 0, 100, "serviceable_pct");
    validateRange(obtainable_pct, 0, 100, "obtainable_pct");

    const tam = total_market;
    const sam = roundTo(total_market * (serviceable_pct / 100), 2);
    const som = roundTo(sam * (obtainable_pct / 100), 2);

    const samToTam = roundTo((sam / tam) * 100, 2);
    const somToSam = sam > 0 ? roundTo((som / sam) * 100, 2) : 0;
    const somToTam = tam > 0 ? roundTo((som / tam) * 100, 2) : 0;

    const summary =
      `Market sizing (${methodology.replace("_", "-")} methodology): ` +
      `TAM ${formatCurrency(tam)}, SAM ${formatCurrency(sam)} (${samToTam}% of TAM), ` +
      `SOM ${formatCurrency(som)} (${somToSam}% of SAM, ${somToTam}% of TAM). ` +
      METHODOLOGY_DESCRIPTIONS[methodology];

    return JSON.stringify(
      {
        tam,
        sam,
        som,
        methodology,
        ratios: {
          sam_to_tam: samToTam,
          som_to_sam: somToSam,
          som_to_tam: somToTam,
        },
        summary,
      },
      null,
      2
    );
  },
};
