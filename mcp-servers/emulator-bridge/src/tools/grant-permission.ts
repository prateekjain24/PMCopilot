import { z } from "zod";
import { adbShell } from "../helpers/adb.js";

/**
 * grant_permission tool definition for FastMCP.
 * Grants a runtime permission to an app on a connected Android device/emulator.
 */
export const grantPermissionTool = {
  name: "grant_permission",
  description:
    "Grant a runtime permission to an installed app on a connected Android device or emulator. " +
    "Uses adb shell pm grant. Common permissions include: " +
    "android.permission.CAMERA, android.permission.READ_CONTACTS, " +
    "android.permission.ACCESS_FINE_LOCATION, android.permission.RECORD_AUDIO, " +
    "android.permission.READ_EXTERNAL_STORAGE, android.permission.WRITE_EXTERNAL_STORAGE.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
    package: z
      .string()
      .describe("Package name of the app (e.g. com.example.app)"),
    permission: z
      .string()
      .describe(
        "Full Android permission string (e.g. android.permission.CAMERA)"
      ),
  }),
  execute: async (params: {
    device_id: string;
    package: string;
    permission: string;
  }) => {
    const { device_id, package: pkg, permission } = params;

    const output = await adbShell(
      device_id,
      `pm grant ${pkg} ${permission}`
    );

    // pm grant returns empty string on success; errors contain "Exception" or "Unknown permission"
    if (output.includes("Exception") || output.includes("Unknown permission")) {
      throw new Error(
        `Failed to grant permission ${permission} to ${pkg} on device ${device_id}: ${output}`
      );
    }

    return JSON.stringify(
      {
        device_id,
        package: pkg,
        permission,
        message: `Permission ${permission} granted to ${pkg} on device ${device_id}.`,
      },
      null,
      2
    );
  },
};
