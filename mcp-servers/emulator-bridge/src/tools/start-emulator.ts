import { z } from "zod";
import { spawn } from "node:child_process";
import { adb } from "../helpers/adb.js";
import { loadConfig } from "../config.js";

/**
 * start_emulator tool definition for FastMCP.
 * Starts an Android emulator by AVD name and waits until it is fully booted.
 */
export const startEmulatorTool = {
  name: "start_emulator",
  description:
    "Start an Android emulator by AVD name. Spawns the emulator process detached and polls " +
    "adb devices every 2 seconds until the new device appears with state 'device', " +
    "or times out after 120 seconds. Returns the device_id once ready.",
  parameters: z.object({
    avd_name: z
      .string()
      .describe("Name of the AVD to start (from list_emulators)"),
    no_snapshot: z
      .boolean()
      .optional()
      .describe("If true, cold-boot without loading a snapshot (default: false)"),
    wipe_data: z
      .boolean()
      .optional()
      .describe("If true, wipe user data before starting (default: false)"),
  }),
  execute: async (params: {
    avd_name: string;
    no_snapshot?: boolean;
    wipe_data?: boolean;
  }) => {
    const { avd_name, no_snapshot = false, wipe_data = false } = params;
    const { emulatorPath } = loadConfig();

    // Capture existing device IDs before launch
    const existingDevices = await getConnectedDeviceIds();

    // Build emulator command args
    const args = ["-avd", avd_name];
    if (no_snapshot) args.push("-no-snapshot-load");
    if (wipe_data) args.push("-wipe-data");

    // Spawn emulator process detached so it outlives this call
    const child = spawn(emulatorPath, args, {
      stdio: "ignore",
      detached: true,
    });

    child.unref();

    child.on("error", (err) => {
      console.error(
        `[emulator-bridge] Failed to start emulator ${avd_name}: ${err.message}`
      );
    });

    // Poll for new device appearing with state "device"
    const timeoutMs = 120_000;
    const pollIntervalMs = 2_000;
    const deadline = Date.now() + timeoutMs;

    let newDeviceId: string | null = null;

    while (Date.now() < deadline) {
      await sleep(pollIntervalMs);

      const currentDevices = await getConnectedDeviceIds();

      // Find a device ID that was not present before and is in "device" state
      for (const id of currentDevices) {
        if (!existingDevices.has(id)) {
          // Verify it is fully booted by checking state
          const state = await getDeviceState(id);
          if (state === "device") {
            newDeviceId = id;
            break;
          }
        }
      }

      if (newDeviceId) break;
    }

    if (!newDeviceId) {
      throw new Error(
        `Timed out after ${timeoutMs / 1000}s waiting for emulator "${avd_name}" to boot. ` +
          "Check that the AVD name is correct and the emulator binary is functional."
      );
    }

    return JSON.stringify(
      {
        device_id: newDeviceId,
        avd_name,
        state: "device",
        message: `Emulator "${avd_name}" started successfully with device ID ${newDeviceId}.`,
      },
      null,
      2
    );
  },
};

async function getConnectedDeviceIds(): Promise<Set<string>> {
  const { stdout } = await adb(["devices"]);
  const ids = new Set<string>();
  for (const line of stdout.split("\n")) {
    const parts = line.split("\t");
    if (parts.length >= 2 && parts[0].trim().length > 0) {
      ids.add(parts[0].trim());
    }
  }
  return ids;
}

async function getDeviceState(deviceId: string): Promise<string> {
  try {
    const { stdout } = await adb(["-s", deviceId, "get-state"]);
    return stdout.trim();
  } catch {
    return "unknown";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
