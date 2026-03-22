import { describe, test, expect } from "bun:test";
import { openUrlTool } from "../src/tools/open-url.js";

describe("simulator-bridge: accessibility and URL", () => {
  test("open_url rejects URL without scheme", async () => {
    await expect(
      openUrlTool.execute({
        device_id: "test-device",
        url: "example.com/path",
      })
    ).rejects.toThrow("must include a scheme");
  });

  test("open_url accepts URL with https scheme (schema validation)", () => {
    const parsed = openUrlTool.parameters.safeParse({
      device_id: "test-device",
      url: "https://example.com",
    });

    expect(parsed.success).toBe(true);
  });

  test("open_url accepts deep link URL (schema validation)", () => {
    const parsed = openUrlTool.parameters.safeParse({
      device_id: "test-device",
      url: "myapp://settings/profile",
    });

    expect(parsed.success).toBe(true);
  });

  test("open_url rejects missing device_id", () => {
    const parsed = openUrlTool.parameters.safeParse({
      url: "https://example.com",
    });

    expect(parsed.success).toBe(false);
  });
});
