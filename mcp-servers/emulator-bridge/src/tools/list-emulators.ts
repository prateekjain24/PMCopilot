import { z } from "zod";
import { listAvds } from "../helpers/emulator.js";

/**
 * list_emulators tool definition for FastMCP.
 * Lists all available Android Virtual Devices (AVDs) via emulator -list-avds.
 */
export const listEmulatorsTool = {
  name: "list_emulators",
  description:
    "List all available Android Virtual Devices (AVDs) configured on this system. " +
    "Returns an array of AVD names that can be used with start_emulator.",
  parameters: z.object({}),
  execute: async () => {
    const avds = await listAvds();

    const summary =
      avds.length === 0
        ? "No AVDs found on this system. Create one with Android Studio AVD Manager or avdmanager CLI."
        : `Found ${avds.length} AVD(s).`;

    return JSON.stringify(
      {
        avds,
        count: avds.length,
        summary,
      },
      null,
      2
    );
  },
};
