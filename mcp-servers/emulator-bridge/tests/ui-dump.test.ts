import { describe, test, expect } from "bun:test";
import { skipIfNoEmulator } from "./setup.js";
import { dumpUiTool } from "../src/tools/dump-ui.js";

describe("emulator-bridge: UI dump", () => {
  test("dump_ui with invalid device throws error", async () => {
    if (skipIfNoEmulator()) return;

    await expect(
      dumpUiTool.execute({
        device_id: "nonexistent-device-000",
      })
    ).rejects.toThrow();
  });

  test("dump_ui parameter schema requires device_id", () => {
    const valid = dumpUiTool.parameters.safeParse({
      device_id: "emulator-5554",
    });

    expect(valid.success).toBe(true);

    const invalid = dumpUiTool.parameters.safeParse({});

    expect(invalid.success).toBe(false);
  });
});
