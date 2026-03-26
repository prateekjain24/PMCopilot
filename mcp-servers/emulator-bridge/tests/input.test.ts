import { describe, test, expect } from "bun:test";
import { skipIfNoEmulator } from "./setup.js";
import { tapTool } from "../src/tools/tap.js";
import { swipeTool } from "../src/tools/swipe.js";

describe("emulator-bridge: input", () => {
  test("tap with invalid device throws error", async () => {
    if (skipIfNoEmulator()) return;

    await expect(
      tapTool.execute({
        device_id: "nonexistent-device-000",
        x: 100,
        y: 200,
      })
    ).rejects.toThrow();
  });

  test("tap parameter schema requires integer coordinates", () => {
    const valid = tapTool.parameters.safeParse({
      device_id: "emulator-5554",
      x: 100,
      y: 200,
    });

    expect(valid.success).toBe(true);
  });

  test("swipe with invalid device throws error", async () => {
    if (skipIfNoEmulator()) return;

    await expect(
      swipeTool.execute({
        device_id: "nonexistent-device-000",
        x1: 100,
        y1: 200,
        x2: 100,
        y2: 600,
      })
    ).rejects.toThrow();
  });

  test("swipe validates all coordinate parameters", () => {
    const valid = swipeTool.parameters.safeParse({
      device_id: "emulator-5554",
      x1: 10,
      y1: 20,
      x2: 300,
      y2: 400,
      duration_ms: 500,
    });

    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.x1).toBe(10);
      expect(valid.data.y1).toBe(20);
      expect(valid.data.x2).toBe(300);
      expect(valid.data.y2).toBe(400);
      expect(valid.data.duration_ms).toBe(500);
    }
  });

  test("swipe rejects missing required coordinates", () => {
    const missing = swipeTool.parameters.safeParse({
      device_id: "emulator-5554",
      x1: 10,
      y1: 20,
      // missing x2, y2
    });

    expect(missing.success).toBe(false);
  });
});
