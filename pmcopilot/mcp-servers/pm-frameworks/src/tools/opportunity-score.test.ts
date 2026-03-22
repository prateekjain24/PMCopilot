import { describe, test, expect } from "bun:test";
import { opportunityScoreTool } from "./opportunity-score.js";

describe("opportunity_score", () => {
  test("importance=9, satisfaction=3 -> Underserved", async () => {
    const result = JSON.parse(
      await opportunityScoreTool.execute({
        features: [
          { name: "Fast checkout", importance: 9, satisfaction: 3 },
        ],
      })
    );

    const feature = result.features[0];
    // gap = max(9 - 3, 0) = 6
    // score = 9 + 6 = 15
    expect(feature.gap).toBe(6);
    expect(feature.score).toBe(15);
    // Score 15 is in the "Appropriately Served" range (12-15), not >15 for Underserved
    expect(feature.classification).toBe("Appropriately Served");
  });

  test("high importance low satisfaction is Underserved", async () => {
    const result = JSON.parse(
      await opportunityScoreTool.execute({
        features: [
          { name: "Reliability", importance: 10, satisfaction: 2 },
        ],
      })
    );

    const feature = result.features[0];
    // gap = max(10 - 2, 0) = 8
    // score = 10 + 8 = 18
    expect(feature.gap).toBe(8);
    expect(feature.score).toBe(18);
    expect(feature.classification).toBe("Underserved");
  });

  test("importance=5, satisfaction=8 -> Overserved", async () => {
    const result = JSON.parse(
      await opportunityScoreTool.execute({
        features: [
          { name: "Reporting", importance: 5, satisfaction: 8 },
        ],
      })
    );

    const feature = result.features[0];
    // gap = max(5 - 8, 0) = 0
    // score = 5 + 0 = 5
    expect(feature.gap).toBe(0);
    expect(feature.score).toBe(5);
    expect(feature.classification).toBe("Overserved");
  });

  test("importance=7, satisfaction=5 -> classification check", async () => {
    const result = JSON.parse(
      await opportunityScoreTool.execute({
        features: [
          { name: "Search", importance: 7, satisfaction: 5 },
        ],
      })
    );

    const feature = result.features[0];
    // gap = max(7 - 5, 0) = 2
    // score = 7 + 2 = 9
    expect(feature.gap).toBe(2);
    expect(feature.score).toBe(9);
    expect(feature.classification).toBe("Overserved");
  });

  test("multiple features are ranked by score descending", async () => {
    const result = JSON.parse(
      await opportunityScoreTool.execute({
        features: [
          { name: "Feature A", importance: 5, satisfaction: 8 }, // score = 5
          { name: "Feature B", importance: 10, satisfaction: 2 }, // score = 18
          { name: "Feature C", importance: 7, satisfaction: 5 }, // score = 9
        ],
      })
    );

    expect(result.features[0].name).toBe("Feature B");
    expect(result.features[0].rank).toBe(1);
    expect(result.features[1].name).toBe("Feature C");
    expect(result.features[1].rank).toBe(2);
    expect(result.features[2].name).toBe("Feature A");
    expect(result.features[2].rank).toBe(3);
  });
});
