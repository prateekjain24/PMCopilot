import { describe, test, expect } from "bun:test";
import { significanceTestTool } from "./significance-test.js";

describe("significance_test", () => {
  test("clear winner: control 1000/10000, variant 1200/10000 -> significant positive lift", async () => {
    const result = JSON.parse(
      await significanceTestTool.execute({
        control_visitors: 10000,
        control_conversions: 1000,
        variant_visitors: 10000,
        variant_conversions: 1200,
      })
    );

    expect(result.control_rate).toBeCloseTo(0.10, 4);
    expect(result.variant_rate).toBeCloseTo(0.12, 4);
    expect(result.significant).toBe(true);
    expect(result.relative_lift).toBeGreaterThan(0);
    expect(result.relative_lift).toBeCloseTo(20, 0); // 20% relative lift
    expect(result.absolute_lift).toBeCloseTo(0.02, 4);
    expect(result.p_value).toBeLessThan(0.05);
    expect(result.z_score).toBeGreaterThan(0);
    expect(result.interpretation).toContain("outperforms");
  });

  test("no significant difference: control 500/10000, variant 505/10000", async () => {
    const result = JSON.parse(
      await significanceTestTool.execute({
        control_visitors: 10000,
        control_conversions: 500,
        variant_visitors: 10000,
        variant_conversions: 505,
      })
    );

    expect(result.significant).toBe(false);
    expect(result.p_value).toBeGreaterThan(0.05);
    expect(result.interpretation).toContain("No statistically significant");
  });

  test("negative result: control 500/10000, variant 400/10000 -> significant negative lift", async () => {
    const result = JSON.parse(
      await significanceTestTool.execute({
        control_visitors: 10000,
        control_conversions: 500,
        variant_visitors: 10000,
        variant_conversions: 400,
      })
    );

    expect(result.significant).toBe(true);
    expect(result.relative_lift).toBeLessThan(0);
    expect(result.absolute_lift).toBeLessThan(0);
    expect(result.interpretation).toContain("underperforms");
  });

  test("p-value and confidence interval are reasonable", async () => {
    const result = JSON.parse(
      await significanceTestTool.execute({
        control_visitors: 5000,
        control_conversions: 250,
        variant_visitors: 5000,
        variant_conversions: 300,
      })
    );

    // p-value should be between 0 and 1
    expect(result.p_value).toBeGreaterThanOrEqual(0);
    expect(result.p_value).toBeLessThanOrEqual(1);

    // CI should bracket the absolute lift
    expect(result.confidence_interval.lower).toBeLessThanOrEqual(result.absolute_lift);
    expect(result.confidence_interval.upper).toBeGreaterThanOrEqual(result.absolute_lift);
  });

  test("equal conversion rates produce non-significant result", async () => {
    const result = JSON.parse(
      await significanceTestTool.execute({
        control_visitors: 10000,
        control_conversions: 1000,
        variant_visitors: 10000,
        variant_conversions: 1000,
      })
    );

    expect(result.significant).toBe(false);
    expect(result.relative_lift).toBe(0);
    expect(result.absolute_lift).toBe(0);
    expect(result.z_score).toBe(0);
    expect(result.p_value).toBe(1);
  });

  test("custom significance level", async () => {
    const result = JSON.parse(
      await significanceTestTool.execute({
        control_visitors: 10000,
        control_conversions: 500,
        variant_visitors: 10000,
        variant_conversions: 530,
        significance_level: 0.01,
      })
    );

    // With a stricter threshold, borderline results may not be significant
    expect(typeof result.significant).toBe("boolean");
    expect(result.p_value).toBeDefined();
  });
});
