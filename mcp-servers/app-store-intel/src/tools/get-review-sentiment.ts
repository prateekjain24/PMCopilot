import { z } from "zod";
import * as appStore from "../adapters/app-store.js";
import * as playStore from "../adapters/play-store.js";
import { buildCacheKey, get, set } from "../cache.js";
import { analyzeSentiment, extractThemes } from "../helpers/sentiment.js";

interface SentimentReport {
  overall_sentiment: "positive" | "neutral" | "negative";
  sentiment_score: number;
  positive_pct: number;
  negative_pct: number;
  neutral_pct: number;
  top_positive_themes: Array<{ theme: string; count: number }>;
  top_negative_themes: Array<{ theme: string; count: number }>;
  sample_size_actual: number;
}

export const getReviewSentimentTool = {
  name: "get_review_sentiment",
  description:
    "Analyze the sentiment of user reviews for a specific app. Fetches a sample of reviews, " +
    "runs keyword-based sentiment analysis, and extracts common themes. Returns overall " +
    "sentiment breakdown (positive/negative/neutral percentages) and the top themes " +
    "mentioned in positive and negative reviews.",
  parameters: z.object({
    store: z
      .enum(["app_store", "play_store"])
      .describe("Which store to query: app_store or play_store"),
    app_id: z
      .string()
      .describe("App identifier (numeric ID for App Store, package name for Play Store)"),
    sample_size: z
      .number()
      .int()
      .min(10)
      .max(500)
      .default(100)
      .describe("Number of reviews to sample for analysis (10-500, default: 100)"),
  }),
  execute: async (params: {
    store: "app_store" | "play_store";
    app_id: string;
    sample_size: number;
  }) => {
    const { store, app_id, sample_size } = params;

    const cacheKey = buildCacheKey("review_sentiment", { store, app_id, sample_size });
    const cached = get<SentimentReport>(cacheKey);
    if (cached) {
      return JSON.stringify({ source: "cache", ...cached }, null, 2);
    }

    // Fetch reviews
    let reviewTexts: string[] = [];
    let actualSample = 0;

    if (store === "app_store") {
      const pages = Math.ceil(sample_size / 50);
      const allReviews: Array<{ text: string }> = [];

      for (let page = 1; page <= Math.min(pages, 10); page++) {
        const pageReviews = await appStore.getReviews(app_id, "us", page, "mostRecent");
        allReviews.push(...pageReviews);
        if (pageReviews.length < 50) break;
      }

      reviewTexts = allReviews
        .slice(0, sample_size)
        .map((r) => [r.text].filter(Boolean).join(" "))
        .filter((t) => t.length > 0);
    } else {
      try {
        const playReviews = await playStore.getReviews(app_id, "us", sample_size, "newest");
        reviewTexts = playReviews
          .map((r) => [r.title, r.text].filter(Boolean).join(" "))
          .filter((t) => t.length > 0);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return JSON.stringify({ error: true, message }, null, 2);
      }
    }

    actualSample = reviewTexts.length;

    if (actualSample === 0) {
      return JSON.stringify(
        {
          error: false,
          message: "No reviews found for this app.",
          sample_size_actual: 0,
        },
        null,
        2
      );
    }

    // Run sentiment on each review
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    let totalScore = 0;

    for (const text of reviewTexts) {
      const result = analyzeSentiment(text);
      totalScore += result.score;

      if (result.label === "positive") positiveCount++;
      else if (result.label === "negative") negativeCount++;
      else neutralCount++;
    }

    const avgScore = parseFloat((totalScore / actualSample).toFixed(3));

    // Extract themes
    const allThemes = extractThemes(reviewTexts);
    const topPositiveThemes = allThemes
      .filter((t) => t.sentiment === "positive")
      .slice(0, 5)
      .map((t) => ({ theme: t.theme, count: t.count }));

    const topNegativeThemes = allThemes
      .filter((t) => t.sentiment === "negative")
      .slice(0, 5)
      .map((t) => ({ theme: t.theme, count: t.count }));

    let overallSentiment: "positive" | "neutral" | "negative";
    if (avgScore > 0.1) overallSentiment = "positive";
    else if (avgScore < -0.1) overallSentiment = "negative";
    else overallSentiment = "neutral";

    const report: SentimentReport = {
      overall_sentiment: overallSentiment,
      sentiment_score: avgScore,
      positive_pct: parseFloat(((positiveCount / actualSample) * 100).toFixed(1)),
      negative_pct: parseFloat(((negativeCount / actualSample) * 100).toFixed(1)),
      neutral_pct: parseFloat(((neutralCount / actualSample) * 100).toFixed(1)),
      top_positive_themes: topPositiveThemes,
      top_negative_themes: topNegativeThemes,
      sample_size_actual: actualSample,
    };

    set(cacheKey, report);

    return JSON.stringify({ source: "live", ...report }, null, 2);
  },
};
