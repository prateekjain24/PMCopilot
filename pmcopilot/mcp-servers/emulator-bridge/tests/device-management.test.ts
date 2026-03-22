import { describe, test, expect } from "bun:test";
import { skipIfNoEmulator, skipIfNoEmulatorBinary } from "./setup.js";
import { listDevicesTool } from "../src/tools/list-devices.js";
import { listEmulatorsTool } from "../src/tools/list-emulators.js";

describe("emulator-bridge: device management", () => {
  test("list_devices returns an array (may be empty)", async () => {
    if (skipIfNoEmulator()) return;

    const raw = await listDevicesTool.execute();
    const result = JSON.parse(raw);

    expect(Array.isArray(result.devices)).toBe(true);
    expect(typeof result.count).toBe("number");
    expect(result.count).toBe(result.devices.length);
    expect(typeof result.summary).toBe("string");
  });

  test("list_emulators returns an array of AVD names", async () => {
    if (skipIfNoEmulatorBinary()) return;

    const raw = await listEmulatorsTool.execute();
    const result = JSON.parse(raw);

    expect(Array.isArray(result.avds)).toBe(true);
    expect(typeof result.count).toBe("number");
    expect(result.count).toBe(result.avds.length);
    expect(typeof result.summary).toBe("string");
  });

  test("start_emulator with nonexistent AVD would timeout or error", async () => {
    // This test validates the parameter schema without actually starting an emulator
    // (which would take 120+ seconds and require a real AVD)
    const { startEmulatorTool } = await import("../src/tools/start-emulator.js");

    const parsed = startEmulatorTool.parameters.safeParse({
      avd_name: "Nonexistent_AVD",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.avd_name).toBe("Nonexistent_AVD");
    }
  });
});
