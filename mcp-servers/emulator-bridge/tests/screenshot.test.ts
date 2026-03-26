import { describe, test, expect } from "bun:test";
import { skipIfNoEmulator } from "./setup.js";
import { takeScreenshotTool } from "../src/tools/take-screenshot.js";

describe("emulator-bridge: screenshot", () => {
  test("take_screenshot with invalid device returns error", async () => {
    if (skipIfNoEmulator()) return;

    await expect(
      takeScreenshotTool.execute({
        device_id: "nonexistent-device-000",
      })
    ).rejects.toThrow();
  });

  test("take_screenshot parameter schema accepts optional output_path", () => {
    const withPath = takeScreenshotTool.parameters.safeParse({
      device_id: "emulator-5554",
      output_path: "/tmp/test-screenshot.png",
    });

    expect(withPath.success).toBe(true);

    const withoutPath = takeScreenshotTool.parameters.safeParse({
      device_id: "emulator-5554",
    });

    expect(withoutPath.success).toBe(true);
  });

  test("take_screenshot parameter schema rejects missing device_id", () => {
    const parsed = takeScreenshotTool.parameters.safeParse({});

    expect(parsed.success).toBe(false);
  });
});
