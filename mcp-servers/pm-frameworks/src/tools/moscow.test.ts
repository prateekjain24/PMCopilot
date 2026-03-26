import { describe, test, expect } from "bun:test";
import { moscowSortTool } from "./moscow.js";

describe("moscow_sort", () => {
  test("4 features across 4 categories are grouped correctly", async () => {
    const result = JSON.parse(
      await moscowSortTool.execute({
        features: [
          { name: "Authentication", category: "must", effort_estimate: 10 },
          { name: "Dashboard", category: "should", effort_estimate: 5 },
          { name: "Dark Mode", category: "could", effort_estimate: 3 },
          { name: "Gamification", category: "wont", effort_estimate: 8 },
        ],
      })
    );

    expect(result.buckets["Must Have"]).toHaveLength(1);
    expect(result.buckets["Must Have"][0].name).toBe("Authentication");
    expect(result.buckets["Should Have"]).toHaveLength(1);
    expect(result.buckets["Should Have"][0].name).toBe("Dashboard");
    expect(result.buckets["Could Have"]).toHaveLength(1);
    expect(result.buckets["Could Have"][0].name).toBe("Dark Mode");
    expect(result.buckets["Won't Have"]).toHaveLength(1);
    expect(result.buckets["Won't Have"][0].name).toBe("Gamification");
  });

  test("effort allocation within 60% limit produces no warning", async () => {
    // must=60, should=20, could=20 -> must_pct = 60% (exactly at ceiling)
    const result = JSON.parse(
      await moscowSortTool.execute({
        features: [
          { name: "Core API", category: "must", effort_estimate: 60 },
          { name: "Analytics", category: "should", effort_estimate: 20 },
          { name: "Themes", category: "could", effort_estimate: 20 },
        ],
      })
    );

    expect(result.effort_summary.must_pct).toBe(60);
    expect(result.effort_summary.should_pct).toBe(20);
    expect(result.effort_summary.could_pct).toBe(20);
    expect(result.warnings).toBeUndefined();
  });

  test("must exceeding 60% triggers warning", async () => {
    // must=80, should=10, could=10 -> must_pct = 80%
    const result = JSON.parse(
      await moscowSortTool.execute({
        features: [
          { name: "Core API", category: "must", effort_estimate: 80 },
          { name: "Analytics", category: "should", effort_estimate: 10 },
          { name: "Themes", category: "could", effort_estimate: 10 },
        ],
      })
    );

    expect(result.effort_summary.must_pct).toBe(80);
    expect(result.warnings).toBeDefined();
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain("exceeding the recommended 60%");
  });

  test("empty categories are handled gracefully", async () => {
    const result = JSON.parse(
      await moscowSortTool.execute({
        features: [
          { name: "Feature A", category: "must", effort_estimate: 5 },
          { name: "Feature B", category: "must", effort_estimate: 10 },
        ],
      })
    );

    expect(result.buckets["Must Have"]).toHaveLength(2);
    expect(result.buckets["Should Have"]).toHaveLength(0);
    expect(result.buckets["Could Have"]).toHaveLength(0);
    expect(result.buckets["Won't Have"]).toHaveLength(0);
    expect(result.summary).toContain("2 Must Have");
    expect(result.summary).toContain("0 Should Have");
  });

  test("features without effort_estimate default to 0", async () => {
    const result = JSON.parse(
      await moscowSortTool.execute({
        features: [
          { name: "Feature A", category: "must" },
          { name: "Feature B", category: "should" },
        ],
      })
    );

    expect(result.buckets["Must Have"][0].effort_estimate).toBe(0);
    expect(result.buckets["Should Have"][0].effort_estimate).toBe(0);
    // With all zero effort, percentages should be 0
    expect(result.effort_summary.must_pct).toBe(0);
    expect(result.effort_summary.should_pct).toBe(0);
  });
});
