import { describe, test, expect } from "bun:test";
import { weightedScoreTool } from "./weighted-score.js";

describe("weighted_score", () => {
  test("2 features with 3 criteria summing to 100 yield correct weighted sums", async () => {
    const result = JSON.parse(
      await weightedScoreTool.execute({
        features: [
          {
            name: "Feature A",
            scores: { impact: 8, feasibility: 6, strategic_fit: 9 },
          },
          {
            name: "Feature B",
            scores: { impact: 5, feasibility: 9, strategic_fit: 4 },
          },
        ],
        weights: { impact: 50, feasibility: 30, strategic_fit: 20 },
      })
    );

    expect(result.features).toHaveLength(2);
    expect(result.warnings).toBeUndefined();

    // Feature A: (8 * 50/100) + (6 * 30/100) + (9 * 20/100) = 4 + 1.8 + 1.8 = 7.6
    // Feature B: (5 * 50/100) + (9 * 30/100) + (4 * 20/100) = 2.5 + 2.7 + 0.8 = 6.0
    const featureA = result.features.find((f: any) => f.name === "Feature A");
    const featureB = result.features.find((f: any) => f.name === "Feature B");

    expect(featureA.weighted_score).toBeCloseTo(7.6, 1);
    expect(featureB.weighted_score).toBeCloseTo(6.0, 1);

    // Feature A should rank first (higher score)
    expect(result.features[0].name).toBe("Feature A");
    expect(result.features[0].rank).toBe(1);
    expect(result.features[1].rank).toBe(2);
  });

  test("weights not summing to 100 are normalized with warning", async () => {
    const result = JSON.parse(
      await weightedScoreTool.execute({
        features: [
          {
            name: "Feature A",
            scores: { speed: 8, cost: 6 },
          },
        ],
        weights: { speed: 30, cost: 20 },
      })
    );

    expect(result.warnings).toBeDefined();
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain("sum to 50");
    expect(result.warnings[0]).toContain("Normalizing");

    // After normalization: speed = 60%, cost = 40%
    // Score: (8 * 60/100) + (6 * 40/100) = 4.8 + 2.4 = 7.2
    expect(result.features[0].weighted_score).toBeCloseTo(7.2, 1);
  });

  test("single criterion is treated as 100% weight", async () => {
    const result = JSON.parse(
      await weightedScoreTool.execute({
        features: [
          { name: "Feature A", scores: { value: 9 } },
          { name: "Feature B", scores: { value: 4 } },
        ],
        weights: { value: 100 },
      })
    );

    expect(result.features[0].name).toBe("Feature A");
    expect(result.features[0].weighted_score).toBeCloseTo(9.0, 1);
    expect(result.features[1].weighted_score).toBeCloseTo(4.0, 1);
    expect(result.warnings).toBeUndefined();
  });

  test("missing criterion score defaults to 0 with warning", async () => {
    const result = JSON.parse(
      await weightedScoreTool.execute({
        features: [
          { name: "Feature A", scores: { speed: 8 } },
        ],
        weights: { speed: 50, cost: 50 },
      })
    );

    expect(result.warnings).toBeDefined();
    const missingWarning = result.warnings.find((w: string) =>
      w.includes("missing a score for criterion")
    );
    expect(missingWarning).toBeDefined();
  });
});
