import { describe, test, expect } from "bun:test";
import { riceScoreTool, riceBatchTool } from "./rice.js";

describe("rice_score", () => {
  test("standard RICE calculation", async () => {
    const result = JSON.parse(
      await riceScoreTool.execute({
        reach: 15000,
        impact: 2,
        confidence: 80,
        effort: 4,
      })
    );

    expect(result.score).toBe(6000);
    expect(result.reach).toBe(15000);
    expect(result.impact).toBe(2);
    expect(result.confidence).toBe(80);
    expect(result.effort).toBe(4);
    expect(result.summary).toContain("6000");
  });

  test("minimal impact calculation", async () => {
    const result = JSON.parse(
      await riceScoreTool.execute({
        reach: 1000,
        impact: 0.25,
        confidence: 50,
        effort: 1,
      })
    );

    expect(result.score).toBe(125);
    expect(result.summary).toContain("minimal");
  });

  test("zero reach returns score of 0", async () => {
    const result = JSON.parse(
      await riceScoreTool.execute({
        reach: 0,
        impact: 2,
        confidence: 80,
        effort: 4,
      })
    );

    expect(result.score).toBe(0);
  });

  test("zero effort throws division by zero error", async () => {
    await expect(
      riceScoreTool.execute({
        reach: 15000,
        impact: 2,
        confidence: 80,
        effort: 0,
      })
    ).rejects.toThrow();
  });

  test("non-standard impact value includes warning", async () => {
    const result = JSON.parse(
      await riceScoreTool.execute({
        reach: 1000,
        impact: 1.5,
        confidence: 100,
        effort: 1,
      })
    );

    expect(result.score).toBe(1500);
    expect(result.warnings).toBeDefined();
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain("not in the standard RICE scale");
  });
});

describe("rice_batch", () => {
  test("3 features are sorted descending and stats are correct", async () => {
    const result = JSON.parse(
      await riceBatchTool.execute({
        features: [
          { name: "Feature A", reach: 1000, impact: 1, confidence: 100, effort: 1 },
          { name: "Feature B", reach: 5000, impact: 2, confidence: 80, effort: 2 },
          { name: "Feature C", reach: 500, impact: 0.5, confidence: 50, effort: 1 },
        ],
      })
    );

    // Feature B: (5000 * 2 * 0.8) / 2 = 4000
    // Feature A: (1000 * 1 * 1.0) / 1 = 1000
    // Feature C: (500 * 0.5 * 0.5) / 1 = 125
    expect(result.features).toHaveLength(3);
    expect(result.features[0].name).toBe("Feature B");
    expect(result.features[0].score).toBe(4000);
    expect(result.features[0].rank).toBe(1);
    expect(result.features[1].name).toBe("Feature A");
    expect(result.features[1].score).toBe(1000);
    expect(result.features[1].rank).toBe(2);
    expect(result.features[2].name).toBe("Feature C");
    expect(result.features[2].score).toBe(125);
    expect(result.features[2].rank).toBe(3);

    // Stats verification
    // Sorted ascending: [125, 1000, 4000]
    // Mean: (4000 + 1000 + 125) / 3 = 1708.33
    // Median: 1000 (middle of 3 sorted values)
    // Min: 125, Max: 4000
    expect(result.stats.mean).toBeCloseTo(1708.33, 1);
    expect(result.stats.median).toBe(1000);
    expect(result.stats.min).toBe(125);
    expect(result.stats.max).toBe(4000);
  });
});
