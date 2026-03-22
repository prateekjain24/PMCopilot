import { describe, test, expect } from "bun:test";
import { tamSamSomTool } from "./tam-sam-som.js";

describe("tam_sam_som", () => {
  test("standard calculation: TAM=1B, serviceable=30%, obtainable=10%", async () => {
    const result = JSON.parse(
      await tamSamSomTool.execute({
        total_market: 1_000_000_000,
        serviceable_pct: 30,
        obtainable_pct: 10,
        methodology: "top_down",
      })
    );

    expect(result.tam).toBe(1_000_000_000);
    expect(result.sam).toBe(300_000_000);
    expect(result.som).toBe(30_000_000);
  });

  test("ratios are calculated correctly", async () => {
    const result = JSON.parse(
      await tamSamSomTool.execute({
        total_market: 1_000_000_000,
        serviceable_pct: 30,
        obtainable_pct: 10,
        methodology: "bottom_up",
      })
    );

    // SAM/TAM = 30%
    expect(result.ratios.sam_to_tam).toBe(30);
    // SOM/SAM = 10%
    expect(result.ratios.som_to_sam).toBe(10);
    // SOM/TAM = 3%
    expect(result.ratios.som_to_tam).toBe(3);
  });

  test("zero total_market produces all zeros", async () => {
    const result = JSON.parse(
      await tamSamSomTool.execute({
        total_market: 0,
        serviceable_pct: 30,
        obtainable_pct: 10,
        methodology: "analogous",
      })
    );

    expect(result.tam).toBe(0);
    expect(result.sam).toBe(0);
    expect(result.som).toBe(0);
  });

  test("100% serviceable and obtainable returns TAM as all values", async () => {
    const result = JSON.parse(
      await tamSamSomTool.execute({
        total_market: 500_000,
        serviceable_pct: 100,
        obtainable_pct: 100,
        methodology: "top_down",
      })
    );

    expect(result.tam).toBe(500_000);
    expect(result.sam).toBe(500_000);
    expect(result.som).toBe(500_000);
  });

  test("summary includes formatted currency values", async () => {
    const result = JSON.parse(
      await tamSamSomTool.execute({
        total_market: 1_000_000_000,
        serviceable_pct: 30,
        obtainable_pct: 10,
        methodology: "top_down",
      })
    );

    expect(result.summary).toContain("$1B");
    expect(result.summary).toContain("$300M");
    expect(result.summary).toContain("$30M");
    expect(result.summary).toContain("top-down");
  });

  test("methodology description is included in summary", async () => {
    const result = JSON.parse(
      await tamSamSomTool.execute({
        total_market: 100_000,
        serviceable_pct: 50,
        obtainable_pct: 20,
        methodology: "bottom_up",
      })
    );

    expect(result.summary).toContain("bottom-up");
    expect(result.summary).toContain("unit economics");
  });
});
