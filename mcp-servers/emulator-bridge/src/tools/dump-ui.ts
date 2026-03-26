import { z } from "zod";
import { adb, adbShell } from "../helpers/adb.js";
import { parseUiDump } from "../helpers/xml-parser.js";

/**
 * dump_ui tool definition for FastMCP.
 * Dumps the current UI hierarchy from an Android device/emulator using uiautomator.
 */
export const dumpUiTool = {
  name: "dump_ui",
  description:
    "Dump the current UI hierarchy from a connected Android device or emulator. " +
    "Uses uiautomator to capture the view tree and parses it into structured JSON. " +
    "Each node includes class, text, contentDesc, resourceId, bounds, and interaction flags.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
  }),
  execute: async (params: { device_id: string }) => {
    const { device_id } = params;

    const devicePath = "/sdcard/ui_dump.xml";

    try {
      // Dump UI hierarchy on device
      await adbShell(device_id, `uiautomator dump ${devicePath}`);

      // Pull the XML content
      const xml = await adbShell(device_id, `cat ${devicePath}`);

      // Clean up device file
      await adbShell(device_id, `rm -f ${devicePath}`);

      // Parse the XML into structured nodes
      const nodes = parseUiDump(xml);

      return JSON.stringify(
        {
          device_id,
          node_count: countNodes(nodes),
          ui_tree: nodes,
          message: `UI dump captured with ${countNodes(nodes)} node(s) from device ${device_id}.`,
        },
        null,
        2
      );
    } catch (error) {
      // Attempt cleanup on failure
      try {
        await adbShell(device_id, `rm -f ${devicePath}`);
      } catch {
        // Ignore cleanup errors
      }
      throw error;
    }
  },
};

function countNodes(
  nodes: ReturnType<typeof parseUiDump>
): number {
  let count = 0;
  for (const node of nodes) {
    count += 1 + countNodes(node.children);
  }
  return count;
}
