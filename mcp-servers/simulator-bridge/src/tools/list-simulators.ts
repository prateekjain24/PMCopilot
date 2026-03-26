import { z } from "zod";
import { exec } from "../utils/exec.js";

interface SimDevice {
  udid: string;
  name: string;
  state: string;
  runtime: string;
  isAvailable: boolean;
}

interface SimctlDevice {
  udid: string;
  name: string;
  state: string;
  isAvailable: boolean;
  availabilityError?: string;
}

/**
 * list_simulators tool definition for FastMCP.
 * Lists all iOS Simulator devices via xcrun simctl list devices --json.
 */
export const listSimulatorsTool = {
  name: "list_simulators",
  description:
    "List all iOS Simulator devices with their UDID, name, state, runtime, and availability. " +
    "Optionally filter by name, runtime, or state substring.",
  parameters: z.object({
    filter: z
      .string()
      .optional()
      .describe(
        "Optional filter string to match against device name, runtime, or state (case-insensitive)"
      ),
  }),
  execute: async (params: { filter?: string }) => {
    const { filter } = params;

    const { stdout } = await exec("xcrun", [
      "simctl",
      "list",
      "devices",
      "--json",
    ]);

    const parsed = JSON.parse(stdout) as {
      devices: Record<string, SimctlDevice[]>;
    };

    const devices: SimDevice[] = [];

    for (const [runtimeId, runtimeDevices] of Object.entries(parsed.devices)) {
      // Convert runtime identifier to a friendlier name
      // e.g. "com.apple.CoreSimulator.SimRuntime.iOS-17-4" -> "iOS 17.4"
      const runtime = runtimeId
        .replace("com.apple.CoreSimulator.SimRuntime.", "")
        .replace(/-/g, ".")
        .replace(/\.(\d)/, " $1");

      for (const device of runtimeDevices) {
        devices.push({
          udid: device.udid,
          name: device.name,
          state: device.state,
          runtime,
          isAvailable: device.isAvailable,
        });
      }
    }

    // Apply filter if provided
    let filtered = devices;
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      filtered = devices.filter(
        (d) =>
          d.name.toLowerCase().includes(lowerFilter) ||
          d.runtime.toLowerCase().includes(lowerFilter) ||
          d.state.toLowerCase().includes(lowerFilter)
      );
    }

    const summary =
      filtered.length === 0
        ? filter
          ? `No simulators found matching "${filter}".`
          : "No simulators found on this system."
        : `Found ${filtered.length} simulator(s)${filter ? ` matching "${filter}"` : ""}.`;

    return JSON.stringify(
      {
        devices: filtered,
        count: filtered.length,
        summary,
      },
      null,
      2
    );
  },
};
