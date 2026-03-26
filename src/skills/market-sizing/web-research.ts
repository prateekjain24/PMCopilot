/**
 * Web Research for Market Sizing (PMC-061)
 *
 * Generates search queries, extracts structured market data points from
 * search results, and builds top-down / bottom-up TAM estimates.
 */

import { TAMEstimate } from "./cross-validation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MarketDataPoint {
  /** Name or title of the source (e.g. report name, publication) */
  source: string;
  /** Numeric market size or revenue value */
  value: number;
  /** Currency code (e.g. "USD", "EUR") */
  currency: string;
  /** Year the data point refers to */
  year: number;
  /** Confidence in the data point (0-1) */
  confidence: number;
  /** URL where the data was found */
  url: string;
}

// ---------------------------------------------------------------------------
// Query Generation
// ---------------------------------------------------------------------------

/**
 * Generate a diverse set of search queries for market sizing research.
 *
 * Produces queries targeting:
 *   - Total market size reports
 *   - Revenue forecasts
 *   - Competitive landscape
 *   - Growth rates / CAGR
 *   - Geographic breakdowns
 *
 * @param market     - Market or industry name (e.g. "ride-hailing", "project management SaaS")
 * @param geography  - Target geography (e.g. "global", "Southeast Asia", "US")
 * @returns Array of search query strings
 */
export function formulateQueries(
  market: string,
  geography: string
): string[] {
  const currentYear = new Date().getFullYear();

  const queries: string[] = [
    `${geography} ${market} market size ${currentYear}`,
    `${market} industry revenue forecast ${currentYear} ${currentYear + 5}`,
    `${market} competitive landscape market share`,
    `${market} market CAGR growth rate`,
    `${market} TAM total addressable market`,
    `${geography} ${market} market research report`,
    `${market} industry analysis ${geography} ${currentYear}`,
    `${market} market trends and projections`,
    `${market} number of customers users worldwide`,
    `${market} average revenue per user ARPU`,
  ];

  // Add geography-specific queries if not global
  if (geography.toLowerCase() !== "global") {
    queries.push(
      `${market} market size ${geography} vs global`,
      `${geography} ${market} adoption rate penetration`
    );
  }

  return queries;
}

// ---------------------------------------------------------------------------
// Data Extraction
// ---------------------------------------------------------------------------

/**
 * Regex patterns for extracting monetary values from search result text.
 * Matches forms like "$45.2 billion", "USD 12.3M", "45.2B", etc.
 */
const MONEY_PATTERNS = [
  // "$45.2 billion" or "$45.2B"
  /\$\s*([\d,.]+)\s*(billion|trillion|million|B|T|M)\b/gi,
  // "USD 45.2 billion"
  /USD\s*([\d,.]+)\s*(billion|trillion|million|B|T|M)\b/gi,
  // "EUR 45.2 billion"
  /EUR\s*([\d,.]+)\s*(billion|trillion|million|B|T|M)\b/gi,
];

const YEAR_PATTERN = /\b(20[2-3]\d)\b/g;

const MULTIPLIERS: Record<string, number> = {
  trillion: 1_000_000_000_000,
  t: 1_000_000_000_000,
  billion: 1_000_000_000,
  b: 1_000_000_000,
  million: 1_000_000,
  m: 1_000_000,
};

function parseNumericValue(raw: string): number {
  return parseFloat(raw.replace(/,/g, ""));
}

function detectCurrency(text: string): string {
  if (/EUR/i.test(text)) return "EUR";
  if (/GBP|pound/i.test(text)) return "GBP";
  return "USD";
}

/**
 * Extract structured market data points from raw search result text.
 *
 * Scans each result string for monetary values with magnitude keywords,
 * associates them with nearby year references, and returns structured
 * data points.
 *
 * @param searchResults - Array of text snippets from search results
 * @returns Extracted and structured market data points
 */
export function extractMarketData(
  searchResults: string[]
): MarketDataPoint[] {
  const dataPoints: MarketDataPoint[] = [];

  for (const result of searchResults) {
    const currency = detectCurrency(result);

    // Find all year references in the text
    const years: number[] = [];
    let yearMatch: RegExpExecArray | null;
    const yearRegex = new RegExp(YEAR_PATTERN.source, "g");
    while ((yearMatch = yearRegex.exec(result)) !== null) {
      years.push(parseInt(yearMatch[1], 10));
    }

    // Default to current year if none found
    const bestYear =
      years.length > 0 ? Math.min(...years) : new Date().getFullYear();

    for (const pattern of MONEY_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(result)) !== null) {
        const numericPart = parseNumericValue(match[1]);
        const magnitude = match[2].toLowerCase();
        const multiplier = MULTIPLIERS[magnitude] ?? 1;
        const value = numericPart * multiplier;

        if (isNaN(value) || value <= 0) continue;

        // Confidence heuristic: higher for values with explicit year and source
        let confidence = 0.5;
        if (years.length > 0) confidence += 0.2;
        if (result.length > 200) confidence += 0.1; // More context = more reliable
        confidence = Math.min(confidence, 1.0);

        dataPoints.push({
          source: extractSourceName(result),
          value,
          currency,
          year: bestYear,
          confidence,
          url: extractUrl(result),
        });
      }
    }
  }

  return dataPoints;
}

function extractSourceName(text: string): string {
  // Try to find a source attribution pattern
  const sourcePatterns = [
    /according to\s+([^,.]+)/i,
    /source:\s*([^,.]+)/i,
    /report by\s+([^,.]+)/i,
    /published by\s+([^,.]+)/i,
    /from\s+([\w\s&]+(?:Research|Analytics|Intelligence|Consulting|Group))/i,
  ];

  for (const pattern of sourcePatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }

  // Fallback: use first meaningful words
  const firstWords = text.slice(0, 80).replace(/[^a-zA-Z0-9\s]/g, "").trim();
  return firstWords || "Unknown source";
}

function extractUrl(text: string): string {
  const urlMatch = text.match(/https?:\/\/[^\s)]+/);
  return urlMatch ? urlMatch[0] : "";
}

// ---------------------------------------------------------------------------
// TAM Estimation
// ---------------------------------------------------------------------------

/**
 * Build a top-down TAM estimate from collected data points.
 *
 * Strategy:
 *   1. Filter to the most relevant data points (highest confidence)
 *   2. Use the median value as the TAM
 *   3. Apply standard SAM/SOM ratios if not directly available
 *
 * @param dataPoints - Extracted market data points
 * @returns TAM estimate with methodology details
 */
export function buildTopDownEstimate(
  dataPoints: MarketDataPoint[]
): TAMEstimate {
  if (dataPoints.length === 0) {
    return {
      tam: 0,
      sam: 0,
      som: 0,
      methodology: "top-down",
      assumptions: ["No data points available"],
      sources: [],
    };
  }

  // Sort by confidence descending, take top data points
  const sorted = [...dataPoints].sort(
    (a, b) => b.confidence - a.confidence
  );
  const topPoints = sorted.slice(0, Math.min(5, sorted.length));

  // Use weighted median (by confidence) for TAM
  const values = topPoints.map((p) => p.value);
  values.sort((a, b) => a - b);
  const medianIndex = Math.floor(values.length / 2);
  const tam = values.length % 2 === 0
    ? (values[medianIndex - 1] + values[medianIndex]) / 2
    : values[medianIndex];

  // Standard SAM/SOM ratio assumptions for top-down
  const samRatio = 0.3; // 30% of TAM is serviceable
  const somRatio = 0.1; // 10% of SAM is obtainable
  const sam = Math.round(tam * samRatio);
  const som = Math.round(sam * somRatio);

  const sources = [
    ...new Set(topPoints.map((p) => p.source).filter(Boolean)),
  ];

  return {
    tam: Math.round(tam),
    sam,
    som,
    methodology: "top-down",
    assumptions: [
      `Based on ${topPoints.length} data point(s) from industry reports`,
      `SAM estimated at ${(samRatio * 100).toFixed(0)}% of TAM (serviceable market ratio)`,
      `SOM estimated at ${(somRatio * 100).toFixed(0)}% of SAM (obtainable market ratio)`,
      `Median value used from confidence-ranked data points`,
    ],
    sources,
  };
}

/**
 * Build a bottom-up TAM estimate from unit economics.
 *
 * @param customers   - Total number of potential customers in the market
 * @param arpu        - Average Revenue Per User (annual, in USD)
 * @param penetration - Expected market penetration rate (0-1)
 * @returns TAM estimate with methodology details
 */
export function buildBottomUpEstimate(
  customers: number,
  arpu: number,
  penetration: number
): TAMEstimate {
  const tam = Math.round(customers * arpu);
  const sam = Math.round(tam * penetration);
  // SOM is typically 5-15% of SAM for a new entrant
  const somRatio = 0.1;
  const som = Math.round(sam * somRatio);

  return {
    tam,
    sam,
    som,
    methodology: "bottom-up",
    assumptions: [
      `Total potential customers: ${customers.toLocaleString()}`,
      `Average Revenue Per User (annual): $${arpu.toLocaleString()}`,
      `Market penetration rate: ${(penetration * 100).toFixed(1)}%`,
      `SOM estimated at ${(somRatio * 100).toFixed(0)}% of SAM (new entrant assumption)`,
    ],
    sources: ["Bottom-up unit economics model"],
  };
}
