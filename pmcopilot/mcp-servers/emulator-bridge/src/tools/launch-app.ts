import { z } from "zod";
import { adbShell } from "../helpers/adb.js";

/**
 * launch_app tool definition for FastMCP.
 * Launches an Android app by package name and activity on a connected device/emulator.
 */
export const launchAppTool = {
  name: "launch_app",
  description:
    "Launch an Android app on a connected device or emulator using am start. " +
    "Requires both the package name and the fully qualified activity name. " +
    "Example: package='com.example.app', activity='com.example.app.MainActivity'.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
    package: z
      .string()
      .describe("Package name of the app (e.g. com.example.app)"),
    activity: z
      .string()
      .describe(
        "Fully qualified activity name to launch (e.g. com.example.app.MainActivity)"
      ),
  }),
  execute: async (params: {
    device_id: string;
    package: string;
    activity: string;
  }) => {
    const { device_id, package: pkg, activity } = params;

    const component = `${pkg}/${activity}`;
    const output = await adbShell(device_id, `am start -n ${component}`);

    const hasError =
      output.includes("Error") || output.includes("does not exist");

    if (hasError) {
      throw new Error(
        `Failed to launch ${component} on device ${device_id}: ${output}`
      );
    }

    return JSON.stringify(
      {
        device_id,
        package: pkg,
        activity,
        message: `Launched ${component} on device ${device_id}.`,
        output,
      },
      null,
      2
    );
  },
};
