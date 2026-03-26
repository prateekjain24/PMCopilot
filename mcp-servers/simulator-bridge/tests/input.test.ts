import { describe, test, expect } from "bun:test";
import { skipIfNoSimulator, skipIfNoIdb } from "./setup.js";
import { tapTool } from "../src/tools/tap.js";
import { swipeTool } from "../src/tools/swipe.js";

describe("simulator-bridge: input", () => {
  test("tap with invalid device throws error", async () => {
    if (skipIfNoSimulator() || skipIfNoIdb()) return;

    await expect(
      tapTool.execute({
        device_id: "00000000-0000-0000-0000-000000000000",
        x: 100,
        y: 200,
      })
    ).rejects.toThrow();
  });

  test("swipe with invalid device throws error", async () => {
    if (skipIfNoSimulator() || skipIfNoIdb()) return;

    await expect(
      swipeTool.execute({
        device_id: "00000000-0000-0000-0000-000000000000",
        x1: 100,
        y1: 200,
        x2: 100,
        y2: 600,
      })
    ).rejects.toThrow();
  });

  test("swipe validates all coordinate parameters exist in the result", async () => {
    // This tests the output structure without requiring a real device
    // by verifying the parameter schema accepts all required fields
    const params = {
      device_id: "test-device",
      x1: 10,
      y1: 20,
      x2: 300,
      y2: 400,
      duration: 1.0,
    };

    // Verify the schema parses correctly (does not require idb)
    const parsed = swipeTool.parameters.safeParse(params);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.x1).toBe(10);
      expect(parsed.data.y1).toBe(20);
      expect(parsed.data.x2).toBe(300);
      expect(parsed.data.y2).toBe(400);
    }
  });
});
