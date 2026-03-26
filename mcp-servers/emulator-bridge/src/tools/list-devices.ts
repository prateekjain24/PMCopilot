import { z } from "zod";
import { adb } from "../helpers/adb.js";

interface AdbDevice {
  device_id: string;
  state: string;
}

/**
 * list_devices tool definition for FastMCP.
 * Lists all connected Android devices/emulators via adb devices.
 */
export const listDevicesTool = {
  name: "list_devices",
  description:
    "List all connected Android devices and emulators via adb. " +
    "Returns an array of objects with device_id and state (device, offline, unauthorized, etc.).",
  parameters: z.object({}),
  execute: async () => {
    const { stdout } = await adb(["devices"]);

    const lines = stdout.split("\n").filter((line) => line.trim().length > 0);

    const devices: AdbDevice[] = [];
    for (const line of lines) {
      // Skip the header line "List of devices attached"
      if (line.startsWith("List of devices")) continue;

      const parts = line.split("\t");
      if (parts.length >= 2) {
        devices.push({
          device_id: parts[0].trim(),
          state: parts[1].trim(),
        });
      }
    }

    const summary =
      devices.length === 0
        ? "No devices or emulators connected."
        : `Found ${devices.length} device(s).`;

    return JSON.stringify(
      {
        devices,
        count: devices.length,
        summary,
      },
      null,
      2
    );
  },
};
