import { z } from "zod";
import { exec, isToolAvailable } from "../utils/exec.js";

interface AccessibilityElement {
  type: string;
  label: string | null;
  frame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  value: string | null;
  traits: string[];
}

/**
 * get_accessibility_tree tool definition for FastMCP.
 * Retrieves the full accessibility tree of the current screen.
 */
export const getAccessibilityTreeTool = {
  name: "get_accessibility_tree",
  description:
    "Retrieve the full accessibility tree of the current screen on a booted simulator device. " +
    "Returns all UI elements with their type, label, frame (position and size), value, and traits. " +
    "This is the primary method for understanding on-screen elements for navigation. " +
    "Requires idb (Facebook iOS Development Bridge) to be installed.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("UDID of the simulator device"),
  }),
  execute: async (params: { device_id: string }) => {
    const { device_id } = params;

    if (!(await isToolAvailable("idb"))) {
      throw new Error(
        "idb (iOS Development Bridge) is not installed or not on PATH. " +
          "Install it with: brew install idb-companion && pip install fb-idb"
      );
    }

    const { stdout } = await exec(
      "idb",
      ["ui", "describe-all", "--udid", device_id, "--json"],
      { timeout: 15000 }
    );

    // Parse the JSON output from idb
    let rawElements: unknown[];
    try {
      const parsed = JSON.parse(stdout);
      rawElements = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // If JSON parsing fails, return the raw output for debugging
      return JSON.stringify(
        {
          device_id,
          raw_output: stdout,
          error: "Failed to parse accessibility tree as JSON. Raw output included.",
        },
        null,
        2
      );
    }

    // Normalize elements into a consistent structure
    const elements: AccessibilityElement[] = rawElements.map((el: any) => ({
      type: el.type ?? el.AXType ?? "Unknown",
      label: el.label ?? el.AXLabel ?? null,
      frame: {
        x: el.frame?.x ?? el.AXFrame?.x ?? 0,
        y: el.frame?.y ?? el.AXFrame?.y ?? 0,
        width: el.frame?.width ?? el.AXFrame?.width ?? 0,
        height: el.frame?.height ?? el.AXFrame?.height ?? 0,
      },
      value: el.value ?? el.AXValue ?? null,
      traits: el.traits ?? el.AXTraits ?? [],
    }));

    return JSON.stringify(
      {
        device_id,
        elements,
        count: elements.length,
        summary: `Found ${elements.length} accessibility element(s) on screen.`,
      },
      null,
      2
    );
  },
};
