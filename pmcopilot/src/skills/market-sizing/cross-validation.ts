/**
 * Market Sizing Cross-Validation (PMC-061)
 *
 * Compares top-down and bottom-up TAM/SAM/SOM estimates and runs
 * sensitivity analysis across low/base/high scenarios.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TAMEstimate {
  /** Total Addressable Market in USD */
  tam: number;
  /** Serviceable Addressable Market in USD */
  sam: number;
  /** Serviceable Obtainable Market in USD */
  som: number;
  /** "top-down" | "bottom-up" | "blended" */
  methodology: string;
  /** Key assumptions made in the estimate */
  assumptions: string[];
  /** Data sources used */
  sources: string[];
}

export interface CrossValidationResult {
  /** Absolute percentage difference between the two TAM estimates */
  deltaPercentage: number;
  /** Whether the two estimates are within acceptable range */
  alignment: "aligned" | "divergent";
  /** Human-readable explanation of the comparison */
  explanation: string;
  /** Top-down estimate reference */
  topDown: TAMEstimate;
  /** Bottom-up estimate reference */
  bottomUp: TAMEstimate;
}

export interface ScenarioValues {
  tam: number;
  sam: number;
  som: number;
}

export interface SensitivityResult {
  /** Pessimistic scenario */
  low: ScenarioValues;
  /** Baseline scenario */
  base: ScenarioValues;
  /** Optimistic scenario */
  high: ScenarioValues;
  /** Range used for SAM variation as a fraction (e.g. 0.2 = +/- 20%) */
  serviceableRange: number;
  /** Range used for SOM variation as a fraction */
  obtainableRange: number;
}

// ---------------------------------------------------------------------------
// Cross-Validation
// ---------------------------------------------------------------------------

/**
 * Compare a top-down and bottom-up TAM estimate.
 *
 * @param topDown    - Estimate derived from industry reports / total market data
 * @param bottomUp   - Estimate derived from unit economics (customers * ARPU * penetration)
 * @param threshold  - Maximum acceptable delta percentage (default 30%)
 * @returns Cross-validation result with alignment assessment
 */
export function crossValidate(
  topDown: TAMEstimate,
  bottomUp: TAMEstimate,
  threshold: number = 30
): CrossValidationResult {
  const avgTAM = (topDown.tam + bottomUp.tam) / 2;

  // Avoid division by zero
  const deltaPercentage =
    avgTAM > 0
      ? (Math.abs(topDown.tam - bottomUp.tam) / avgTAM) * 100
      : 0;

  const alignment: "aligned" | "divergent" =
    deltaPercentage <= threshold ? "aligned" : "divergent";

  const explanation = buildExplanation(topDown, bottomUp, deltaPercentage, alignment, threshold);

  return {
    deltaPercentage: Math.round(deltaPercentage * 100) / 100,
    alignment,
    explanation,
    topDown,
    bottomUp,
  };
}

function buildExplanation(
  topDown: TAMEstimate,
  bottomUp: TAMEstimate,
  delta: number,
  alignment: "aligned" | "divergent",
  threshold: number
): string {
  const lines: string[] = [];

  const fmt = (n: number) =>
    n >= 1_000_000_000
      ? `$${(n / 1_000_000_000).toFixed(1)}B`
      : n >= 1_000_000
        ? `$${(n / 1_000_000).toFixed(1)}M`
        : `$${n.toLocaleString()}`;

  lines.push(
    `Top-down TAM: ${fmt(topDown.tam)} | Bottom-up TAM: ${fmt(bottomUp.tam)}`
  );
  lines.push(`Delta: ${delta.toFixed(1)}% (threshold: ${threshold}%)`);

  if (alignment === "aligned") {
    lines.push(
      "The two estimates are within acceptable range, increasing confidence in the market size."
    );

    // Suggest using the average
    const blendedTAM = (topDown.tam + bottomUp.tam) / 2;
    lines.push(`Recommended blended TAM: ${fmt(blendedTAM)}`);
  } else {
    lines.push(
      "The estimates diverge significantly. Consider reviewing assumptions:"
    );

    if (topDown.tam > bottomUp.tam) {
      lines.push(
        "- Top-down estimate is higher: the industry reports may include adjacent markets, " +
          "or the bottom-up model underestimates the addressable customer base."
      );
    } else {
      lines.push(
        "- Bottom-up estimate is higher: unit economics assumptions (ARPU or customer count) " +
          "may be too aggressive, or the top-down sources exclude emerging segments."
      );
    }

    lines.push("Top-down assumptions: " + topDown.assumptions.join("; "));
    lines.push("Bottom-up assumptions: " + bottomUp.assumptions.join("; "));
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Sensitivity Analysis
// ---------------------------------------------------------------------------

/**
 * Run sensitivity analysis on a TAM estimate, varying the SAM and SOM
 * ratios to produce low/base/high scenarios.
 *
 * @param estimate         - Base TAM estimate
 * @param serviceableRange - Fractional variation for SAM (default 0.2 = +/- 20%)
 * @param obtainableRange  - Fractional variation for SOM (default 0.3 = +/- 30%)
 */
export function sensitivityAnalysis(
  estimate: TAMEstimate,
  serviceableRange: number = 0.2,
  obtainableRange: number = 0.3
): SensitivityResult {
  const { tam, sam, som } = estimate;

  // SAM/TAM and SOM/SAM ratios from the base estimate
  const samRatio = tam > 0 ? sam / tam : 0;
  const somRatio = sam > 0 ? som / sam : 0;

  // Low scenario: reduce both ratios
  const lowSamRatio = Math.max(0, samRatio * (1 - serviceableRange));
  const lowSomRatio = Math.max(0, somRatio * (1 - obtainableRange));
  const lowSam = tam * lowSamRatio;
  const lowSom = lowSam * lowSomRatio;

  // High scenario: increase both ratios (cap at 1.0)
  const highSamRatio = Math.min(1, samRatio * (1 + serviceableRange));
  const highSomRatio = Math.min(1, somRatio * (1 + obtainableRange));
  const highSam = tam * highSamRatio;
  const highSom = highSam * highSomRatio;

  return {
    low: {
      tam,
      sam: Math.round(lowSam),
      som: Math.round(lowSom),
    },
    base: {
      tam,
      sam,
      som,
    },
    high: {
      tam,
      sam: Math.round(highSam),
      som: Math.round(highSom),
    },
    serviceableRange,
    obtainableRange,
  };
}
