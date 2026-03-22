import { describe, test, expect } from "bun:test";
import { skipIfNoSimulator } from "./setup.js";
import { takeScreenshotTool } from "../src/tools/take-screenshot.js";

describe("simulator-bridge: screenshot", () => {
  test("take_screenshot with invalid device returns error", async () => {
    if (skipIfNoSimulator()) return;

    await expect(
      takeScreenshotTool.execute({
        device_id: "00000000-0000-0000-0000-000000000000",
      })
    ).rejects.toThrow();
  });

  test("take_screenshot with invalid device and custom path returns error", async () => {
    if (skipIfNoSimulator()) return;

    await expect(
      takeScreenshotTool.execute({
        device_id: "00000000-0000-0000-0000-000000000000",
        output_path: "/tmp/test-screenshot.png",
        format: "png",
      })
    ).rejects.toThrow();
  });
});
