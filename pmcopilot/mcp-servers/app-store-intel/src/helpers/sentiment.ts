// -------------------------------------------------------------------
// Simple keyword-based sentiment analyzer
// -------------------------------------------------------------------

const POSITIVE_WORDS = new Set([
  "love", "great", "awesome", "excellent", "amazing", "fantastic",
  "perfect", "wonderful", "best", "good", "helpful", "useful",
  "easy", "fast", "smooth", "beautiful", "intuitive", "clean",
  "reliable", "solid", "superb", "brilliant", "outstanding",
  "impressive", "recommend", "enjoy", "favorite", "convenient",
  "simple", "elegant", "responsive", "polished", "delightful",
  "efficient", "powerful", "seamless", "top-notch", "flawless",
]);

const NEGATIVE_WORDS = new Set([
  "bad", "terrible", "horrible", "awful", "worst", "hate",
  "crash", "crashes", "crashing", "bug", "buggy", "bugs",
  "slow", "lag", "laggy", "freeze", "freezes", "freezing",
  "hang", "hangs", "hanging", "broken", "error", "errors",
  "annoying", "frustrating", "useless", "waste", "scam",
  "spam", "ads", "expensive", "overpriced", "glitch", "glitchy",
  "confusing", "complicated", "ugly", "clunky", "unreliable",
  "disappointing", "disappointed", "unresponsive", "unusable",
  "drains", "battery", "malware", "virus", "subscription",
]);

// Theme groupings: multiple words map to a canonical theme
const THEME_GROUPS: Record<string, string[]> = {
  stability: ["crash", "crashes", "crashing", "freeze", "freezes", "freezing", "hang", "hangs", "hanging"],
  performance: ["slow", "lag", "laggy", "fast", "smooth", "responsive", "unresponsive"],
  usability: ["easy", "intuitive", "simple", "confusing", "complicated", "clunky", "convenient"],
  design: ["beautiful", "clean", "elegant", "ugly", "polished", "delightful"],
  bugs: ["bug", "buggy", "bugs", "error", "errors", "glitch", "glitchy", "broken"],
  pricing: ["expensive", "overpriced", "scam", "subscription", "free", "waste"],
  ads: ["ads", "spam", "annoying"],
  reliability: ["reliable", "solid", "unreliable"],
};

// Invert the theme groups: word -> theme
const WORD_TO_THEME: Record<string, string> = {};
for (const [theme, words] of Object.entries(THEME_GROUPS)) {
  for (const word of words) {
    WORD_TO_THEME[word] = theme;
  }
}

export interface SentimentResult {
  score: number;
  label: "positive" | "neutral" | "negative";
}

export interface ThemeResult {
  theme: string;
  count: number;
  sentiment: "positive" | "neutral" | "negative";
}

/**
 * Analyze the sentiment of a single piece of text.
 * Returns a score between -1 (very negative) and +1 (very positive)
 * along with a label.
 */
export function analyzeSentiment(text: string): SentimentResult {
  const words = text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) positiveCount++;
    if (NEGATIVE_WORDS.has(word)) negativeCount++;
  }

  const total = positiveCount + negativeCount;
  if (total === 0) {
    return { score: 0, label: "neutral" };
  }

  const score = parseFloat(((positiveCount - negativeCount) / total).toFixed(3));
  let label: SentimentResult["label"];

  if (score > 0.1) {
    label = "positive";
  } else if (score < -0.1) {
    label = "negative";
  } else {
    label = "neutral";
  }

  return { score, label };
}

/**
 * Extract common themes from a set of review texts.
 * Groups related words and counts occurrences.
 */
export function extractThemes(reviews: string[]): ThemeResult[] {
  const themeCounts: Record<string, { positive: number; negative: number; total: number }> = {};

  for (const review of reviews) {
    const words = review.toLowerCase().replace(/[^a-z0-9\s-]/g, "").split(/\s+/);
    const seenThemes = new Set<string>();

    for (const word of words) {
      const theme = WORD_TO_THEME[word];
      if (!theme || seenThemes.has(theme)) continue;

      seenThemes.add(theme);

      if (!themeCounts[theme]) {
        themeCounts[theme] = { positive: 0, negative: 0, total: 0 };
      }

      themeCounts[theme].total++;

      if (POSITIVE_WORDS.has(word)) {
        themeCounts[theme].positive++;
      } else if (NEGATIVE_WORDS.has(word)) {
        themeCounts[theme].negative++;
      }
    }
  }

  const results: ThemeResult[] = Object.entries(themeCounts)
    .map(([theme, counts]) => {
      let sentiment: ThemeResult["sentiment"];
      if (counts.positive > counts.negative) {
        sentiment = "positive";
      } else if (counts.negative > counts.positive) {
        sentiment = "negative";
      } else {
        sentiment = "neutral";
      }

      return { theme, count: counts.total, sentiment };
    })
    .sort((a, b) => b.count - a.count);

  return results;
}
