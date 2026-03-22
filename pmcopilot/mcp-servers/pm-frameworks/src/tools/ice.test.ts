import { describe, test, expect } from "bun:test";
import { iceScoreTool } from "./ice.js";

describe("ice_score", () => {
  test("standard ICE calculation", async () => {
    const result = JSON.parse(
      await iceScoreTool.execute({
        impact: 8,
        confidence: 6,
        ease: 10,
      })
    );

    expect(result.score).toBe(480);
    expect(result.tier).toBe("Medium Priority");
    expect(result.impact).toBe(8);
    expect(result.confidence).toBe(6);
    expect(result.ease).toBe(10);
  });

  test("max scores yield 1000 and High Priority", async () => {
    const result = JSON.parse(
      await iceScoreTool.execute({
        impact: 10,
        confidence: 10,
        ease: 10,
      })
    );

    expect(result.score).toBe(1000);
    expect(result.tier).toBe("High Priority");
  });

  test("min scores yield 1 and Deprioritize", async () => {
    const result = JSON.parse(
      await iceScoreTool.execute({
        impact: 1,
        confidence: 1,
        ease: 1,
      })
    );

    expect(result.score).toBe(1);
    expect(result.tier).toBe("Deprioritize");
  });

  test("boundary: score=100 is Low Priority", async () => {
    // 5 * 4 * 5 = 100
    const result = JSON.parse(
      await iceScoreTool.execute({
        impact: 5,
        confidence: 4,
        ease: 5,
      })
    );

    expect(result.score).toBe(100);
    expect(result.tier).toBe("Low Priority");
  });

  test("boundary: score=400 is Medium Priority", async () => {
    // 8 * 5 * 10 = 400
    const result = JSON.parse(
      await iceScoreTool.execute({
        impact: 8,
        confidence: 5,
        ease: 10,
      })
    );

    expect(result.score).toBe(400);
    expect(result.tier).toBe("Medium Priority");
  });

  test("boundary: score=700 is High Priority", async () => {
    // 10 * 10 * 7 = 700
    const result = JSON.parse(
      await iceScoreTool.execute({
        impact: 10,
        confidence: 10,
        ease: 7,
      })
    );

    expect(result.score).toBe(700);
    expect(result.tier).toBe("High Priority");
  });

  test("non-integer 7.6 rounds to 8 with warning", async () => {
    const result = JSON.parse(
      await iceScoreTool.execute({
        impact: 7.6,
        confidence: 5,
        ease: 5,
      })
    );

    // 7.6 rounds to 8, so score = 8 * 5 * 5 = 200
    expect(result.impact).toBe(8);
    expect(result.score).toBe(200);
    expect(result.warnings).toBeDefined();
    expect(result.warnings).toContainEqual(
      expect.stringContaining("Rounding to 8")
    );
  });
});
