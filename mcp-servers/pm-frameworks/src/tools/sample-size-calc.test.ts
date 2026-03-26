import { describe, test, expect } from "bun:test";
import { sampleSizeCalcTool } from "./sample-size-calc.js";

describe("sample_size_calc", () => {
  test("baseline=0.10, mde=0.10, significance=0.95, power=0.80 yields reasonable sample size", async () => {
    const result = JSON.parse(
      await sampleSizeCalcTool.execute({
        baseline_rate: 0.10,
        mde: 0.10,
        significance: 0.95,
        power: 0.80,
      })
    );

    // Expected variant rate: 0.10 * 1.10 = 0.11
    expect(result.baseline_rate).toBe(0.10);
    expect(result.expected_variant_rate).toBeCloseTo(0.11, 4);
    expect(result.significance).toBe(0.95);
    expect(result.power).toBe(0.80);

    // Sample size per variant should be in the 14000-15000 range for this scenario
    expect(result.sample_size_per_variant).toBeGreaterThan(13000);
    expect(result.sample_size_per_variant).toBeLessThan(16000);

    // Total is 2x per-variant
    expect(result.total_sample_size).toBe(result.sample_size_per_variant * 2);
  });

  test("baseline=0.50, mde=0.05 requires larger sample", async () => {
    const result = JSON.parse(
      await sampleSizeCalcTool.execute({
        baseline_rate: 0.50,
        mde: 0.05,
      })
    );

    // Default significance=0.95, power=0.80
    expect(result.significance).toBe(0.95);
    expect(result.power).toBe(0.80);

    // Expected variant rate: 0.50 * 1.05 = 0.525
    expect(result.expected_variant_rate).toBeCloseTo(0.525, 4);

    // This is a small relative lift on a high baseline, so needs large sample
    expect(result.sample_size_per_variant).toBeGreaterThan(5000);
  });

  test("very small MDE requires very large sample size", async () => {
    const result = JSON.parse(
      await sampleSizeCalcTool.execute({
        baseline_rate: 0.05,
        mde: 0.01,
      })
    );

    // 1% relative lift on 5% baseline -> extremely small absolute difference
    // Should require a very large sample
    expect(result.sample_size_per_variant).toBeGreaterThan(100000);
  });

  test("summary is descriptive", async () => {
    const result = JSON.parse(
      await sampleSizeCalcTool.execute({
        baseline_rate: 0.10,
        mde: 0.10,
      })
    );

    expect(result.summary).toContain("visitors per variant");
    expect(result.summary).toContain("10%");
    expect(result.summary).toContain("baseline");
  });

  test("absolute effect is calculated correctly", async () => {
    const result = JSON.parse(
      await sampleSizeCalcTool.execute({
        baseline_rate: 0.20,
        mde: 0.25,
      })
    );

    // Expected variant rate: 0.20 * 1.25 = 0.25
    // Absolute effect: 0.25 - 0.20 = 0.05
    expect(result.absolute_effect).toBeCloseTo(0.05, 4);
  });
});
