import { z } from "zod";
import { getRatingHistory } from "../helpers/rating-store.js";

export const trackRatingHistoryTool = {
  name: "track_rating_history",
  description:
    "Retrieve historical rating data points for a specific app. Rating snapshots are " +
    "automatically recorded whenever get_app_details is called for the app. Over time " +
    "this builds a trend of how the app rating and review count change. Returns data " +
    "points within the requested period.",
  parameters: z.object({
    store: z
      .enum(["app_store", "play_store"])
      .describe("Which store: app_store or play_store"),
    app_id: z
      .string()
      .describe("App identifier (numeric ID for App Store, package name for Play Store)"),
    period: z
      .enum(["7d", "30d", "90d", "all"])
      .default("30d")
      .describe("Time period to retrieve: 7d, 30d, 90d, or all (default: 30d)"),
  }),
  execute: async (params: {
    store: "app_store" | "play_store";
    app_id: string;
    period: "7d" | "30d" | "90d" | "all";
  }) => {
    const { store, app_id, period } = params;

    const dataPoints = getRatingHistory(store, app_id, period);

    if (dataPoints.length === 0) {
      return JSON.stringify(
        {
          store,
          app_id,
          period,
          data_points: [],
          count: 0,
          message:
            "No rating history found. Rating snapshots are recorded automatically " +
            "when get_app_details is called. Call get_app_details for this app first " +
            "to start tracking.",
        },
        null,
        2
      );
    }

    // Compute trend
    const first = dataPoints[0];
    const last = dataPoints[dataPoints.length - 1];
    const ratingDelta = parseFloat((last.rating - first.rating).toFixed(3));
    const countDelta = last.rating_count - first.rating_count;

    return JSON.stringify(
      {
        store,
        app_id,
        period,
        data_points: dataPoints,
        count: dataPoints.length,
        trend: {
          rating_change: ratingDelta,
          rating_count_change: countDelta,
          direction: ratingDelta > 0 ? "improving" : ratingDelta < 0 ? "declining" : "stable",
        },
      },
      null,
      2
    );
  },
};
