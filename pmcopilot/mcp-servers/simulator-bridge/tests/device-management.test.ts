import { describe, test, expect } from "bun:test";
import { skipIfNoSimulator } from "./setup.js";
import { listSimulatorsTool } from "../src/tools/list-simulators.js";
import { bootSimulatorTool } from "../src/tools/boot-simulator.js";
import { shutdownSimulatorTool } from "../src/tools/shutdown-simulator.js";

describe("simulator-bridge: device management", () => {
  test("list_simulators returns an array (may be empty)", async () => {
    if (skipIfNoSimulator()) return;

    const raw = await listSimulatorsTool.execute({});
    const result = JSON.parse(raw);

    expect(Array.isArray(result.devices)).toBe(true);
    expect(typeof result.count).toBe("number");
    expect(result.count).toBe(result.devices.length);
    expect(typeof result.summary).toBe("string");
  });

  test("list_simulators with filter narrows results", async () => {
    if (skipIfNoSimulator()) return;

    const allRaw = await listSimulatorsTool.execute({});
    const all = JSON.parse(allRaw);

    // Filter for a string unlikely to match everything
    const filteredRaw = await listSimulatorsTool.execute({
      filter: "NONEXISTENT_DEVICE_NAME_12345",
    });
    const filtered = JSON.parse(filteredRaw);

    expect(filtered.count).toBe(0);
    expect(filtered.summary).toContain("No simulators found matching");
  });

  test("boot_simulator with invalid ID returns error", async () => {
    if (skipIfNoSimulator()) return;

    await expect(
      bootSimulatorTool.execute({ device_id: "00000000-0000-0000-0000-000000000000" })
    ).rejects.toThrow();
  });

  test("shutdown_simulator with invalid ID returns error", async () => {
    if (skipIfNoSimulator()) return;

    await expect(
      shutdownSimulatorTool.execute({
        device_id: "00000000-0000-0000-0000-000000000000",
      })
    ).rejects.toThrow();
  });
});
