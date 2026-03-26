import { describe, test, expect } from "bun:test";
import { kanoClassifyTool, kanoBatchTool } from "./kano.js";

describe("kano_classify", () => {
  test("(like, dislike) -> One-dimensional", async () => {
    const result = JSON.parse(
      await kanoClassifyTool.execute({
        functional: "like",
        dysfunctional: "dislike",
      })
    );

    expect(result.category).toBe("One-dimensional");
  });

  test("(like, neutral) -> Attractive", async () => {
    const result = JSON.parse(
      await kanoClassifyTool.execute({
        functional: "like",
        dysfunctional: "neutral",
      })
    );

    expect(result.category).toBe("Attractive");
  });

  test("(expect, dislike) -> Must-be", async () => {
    const result = JSON.parse(
      await kanoClassifyTool.execute({
        functional: "expect",
        dysfunctional: "dislike",
      })
    );

    expect(result.category).toBe("Must-be");
  });

  test("(neutral, neutral) -> Indifferent", async () => {
    const result = JSON.parse(
      await kanoClassifyTool.execute({
        functional: "neutral",
        dysfunctional: "neutral",
      })
    );

    expect(result.category).toBe("Indifferent");
  });

  test("(dislike, like) -> Reverse", async () => {
    const result = JSON.parse(
      await kanoClassifyTool.execute({
        functional: "dislike",
        dysfunctional: "like",
      })
    );

    expect(result.category).toBe("Reverse");
  });

  test("(like, like) -> Questionable", async () => {
    const result = JSON.parse(
      await kanoClassifyTool.execute({
        functional: "like",
        dysfunctional: "like",
      })
    );

    expect(result.category).toBe("Questionable");
  });

  test("description is included in result", async () => {
    const result = JSON.parse(
      await kanoClassifyTool.execute({
        functional: "like",
        dysfunctional: "neutral",
      })
    );

    expect(result.description).toBeDefined();
    expect(result.description).toContain("Delighter");
  });
});

describe("kano_batch", () => {
  test("batch with multiple respondents returns dominant category and distribution", async () => {
    const result = JSON.parse(
      await kanoBatchTool.execute({
        features: [
          {
            name: "Dark Mode",
            responses: [
              { functional: "like", dysfunctional: "neutral" },    // Attractive
              { functional: "like", dysfunctional: "live_with" },  // Attractive
              { functional: "like", dysfunctional: "dislike" },    // One-dimensional
              { functional: "like", dysfunctional: "neutral" },    // Attractive
              { functional: "expect", dysfunctional: "dislike" },  // Must-be
            ],
          },
        ],
      })
    );

    expect(result.features).toHaveLength(1);
    const feature = result.features[0];
    expect(feature.name).toBe("Dark Mode");
    expect(feature.dominant_category).toBe("Attractive");
    expect(feature.respondent_count).toBe(5);

    // Distribution: 3 Attractive (60%), 1 One-dimensional (20%), 1 Must-be (20%)
    expect(feature.distribution["Attractive"]).toBe(60);
    expect(feature.distribution["One-dimensional"]).toBe(20);
    expect(feature.distribution["Must-be"]).toBe(20);

    // Confidence: 60% is exactly the boundary, so should be "Moderate" (>= 40 and not > 60)
    expect(feature.confidence).toBe("Moderate");
  });

  test("strong confidence when dominant category exceeds 60%", async () => {
    const result = JSON.parse(
      await kanoBatchTool.execute({
        features: [
          {
            name: "SSO Login",
            responses: [
              { functional: "expect", dysfunctional: "dislike" }, // Must-be
              { functional: "expect", dysfunctional: "dislike" }, // Must-be
              { functional: "expect", dysfunctional: "dislike" }, // Must-be
              { functional: "neutral", dysfunctional: "dislike" }, // Must-be
            ],
          },
        ],
      })
    );

    const feature = result.features[0];
    expect(feature.dominant_category).toBe("Must-be");
    expect(feature.confidence).toBe("Strong");
  });
});
