import { describe, test, expect } from "bun:test";
import { costOfDelayTool } from "./cost-of-delay.js";

describe("cost_of_delay", () => {
  test("single feature with revenue_lost=10000, duration=2 -> cd3=5000", async () => {
    const result = JSON.parse(
      await costOfDelayTool.execute({
        features: [
          {
            name: "Payment Integration",
            duration_weeks: 2,
            revenue_lost: 10000,
          },
        ],
      })
    );

    const feature = result.features[0];
    expect(feature.cost_of_delay).toBe(10000);
    expect(feature.cd3).toBe(5000);
    expect(feature.duration_weeks).toBe(2);
    expect(feature.cost_breakdown.revenue_lost).toBe(10000);
    expect(feature.cost_breakdown.churn_risk).toBe(0);
    expect(feature.cost_breakdown.competitive_erosion).toBe(0);
    expect(feature.cost_breakdown.regulatory_risk).toBe(0);
  });

  test("multiple features are ordered by CD3 descending (WSJF)", async () => {
    const result = JSON.parse(
      await costOfDelayTool.execute({
        features: [
          {
            name: "Feature A",
            duration_weeks: 4,
            revenue_lost: 8000,
            // CD3 = 8000 / 4 = 2000
          },
          {
            name: "Feature B",
            duration_weeks: 1,
            revenue_lost: 5000,
            // CD3 = 5000 / 1 = 5000
          },
          {
            name: "Feature C",
            duration_weeks: 2,
            revenue_lost: 3000,
            churn_risk: 1000,
            // CD3 = 4000 / 2 = 2000
          },
        ],
      })
    );

    expect(result.features[0].name).toBe("Feature B");
    expect(result.features[0].cd3).toBe(5000);
    expect(result.features[0].rank).toBe(1);

    // Features A and C both have cd3=2000; order depends on original array position
    expect(result.features[1].rank).toBe(2);
    expect(result.features[2].rank).toBe(3);
  });

  test("zero duration throws error", async () => {
    await expect(
      costOfDelayTool.execute({
        features: [
          {
            name: "Bad Feature",
            duration_weeks: 0,
            revenue_lost: 5000,
          },
        ],
      })
    ).rejects.toThrow();
  });

  test("all cost components zero -> cd3=0", async () => {
    const result = JSON.parse(
      await costOfDelayTool.execute({
        features: [
          {
            name: "Low Priority",
            duration_weeks: 3,
          },
        ],
      })
    );

    const feature = result.features[0];
    expect(feature.cost_of_delay).toBe(0);
    expect(feature.cd3).toBe(0);
  });

  test("all cost components are summed correctly", async () => {
    const result = JSON.parse(
      await costOfDelayTool.execute({
        features: [
          {
            name: "Compliance",
            duration_weeks: 5,
            revenue_lost: 2000,
            churn_risk: 1000,
            competitive_erosion: 500,
            regulatory_risk: 3000,
          },
        ],
      })
    );

    const feature = result.features[0];
    // Cost of delay = 2000 + 1000 + 500 + 3000 = 6500
    // CD3 = 6500 / 5 = 1300
    expect(feature.cost_of_delay).toBe(6500);
    expect(feature.cd3).toBe(1300);
  });
});
