/**
 * Multi-Competitor Comparison Orchestrator (PMC-062)
 *
 * Combines feature merging, pricing normalization, and positioning
 * map generation into a single comparison result.
 */

import { mergeFeatureLists } from "./feature-merger";
import {
  PricingTier,
  NormalizedPricingTable,
  normalizePricing,
  renderPricingTable,
} from "./pricing-normalizer";
import {
  CompetitorData,
  PositionedCompetitor,
  calculatePositions,
  renderAsciiMap,
} from "./positioning-map";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export { CompetitorData } from "./positioning-map";

export interface ComparisonResult {
  /** Deduplicated master list of features across all competitors */
  featureMatrix: {
    /** Canonical feature names */
    features: string[];
    /** Per-competitor: which canonical features they offer */
    competitorFeatures: Record<string, string[]>;
  };
  /** Normalized pricing table aligned on standard buckets */
  pricingTable: NormalizedPricingTable;
  /** Rendered pricing table in markdown */
  pricingTableMarkdown: string;
  /** 2D positioning of competitors */
  positioningMap: PositionedCompetitor[];
  /** ASCII rendering of the positioning map */
  positioningMapAscii: string;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build a comprehensive comparison across multiple competitors.
 *
 * Orchestrates:
 *   1. Feature merging -- deduplicates and aligns feature names
 *   2. Pricing normalization -- maps tiers to standard buckets
 *   3. Positioning map -- calculates 2D positions (price vs features)
 *
 * @param competitors - Array of CompetitorData objects
 * @returns Unified ComparisonResult
 */
export function buildComparison(
  competitors: CompetitorData[]
): ComparisonResult {
  // 1. Feature merging
  const featureInputs = competitors.map((c) => ({
    name: c.name,
    features: c.features,
  }));
  const mergedFeatures = mergeFeatureLists(featureInputs);

  const competitorFeatures: Record<string, string[]> = {};
  for (const comp of competitors) {
    competitorFeatures[comp.name] = comp.features;
  }

  // 2. Pricing normalization
  const pricingInputs = competitors.map((c) => ({
    name: c.name,
    tiers: buildPricingTiers(c),
  }));
  const pricingTable = normalizePricing(pricingInputs);
  const pricingTableMarkdown = renderPricingTable(pricingTable);

  // 3. Positioning map
  const positioningMap = calculatePositions(competitors);
  const positioningMapAscii = renderAsciiMap(positioningMap);

  return {
    featureMatrix: {
      features: mergedFeatures,
      competitorFeatures,
    },
    pricingTable,
    pricingTableMarkdown,
    positioningMap,
    positioningMapAscii,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract PricingTier array from CompetitorData.
 * CompetitorData stores pricing as a simple { monthlyPrice } object,
 * so we construct a minimal tier from it.  If metadata contains richer
 * pricing info (tiers array), that is used instead.
 */
function buildPricingTiers(competitor: CompetitorData): PricingTier[] {
  // Check if metadata contains pre-structured tiers
  const metaTiers = competitor.metadata["tiers"];
  if (Array.isArray(metaTiers)) {
    return metaTiers as unknown as PricingTier[];
  }

  // Fallback: single tier from pricing field
  if (competitor.pricing.monthlyPrice !== null) {
    return [
      {
        name: "Standard",
        monthlyPrice: competitor.pricing.monthlyPrice,
        annualPrice: null,
        perSeat: false,
        features: competitor.features.slice(0, 5),
      },
    ];
  }

  return [];
}
