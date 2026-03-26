import { z } from "zod";
import path from "node:path";
import { spawn } from "node:child_process";
import { exec } from "../utils/exec.js";

// Store active recording processes by device_id
const activeRecordings = new Map<
  string,
  { process: ReturnType<typeof spawn>; outputPath: string }
>();

/**
 * record_video tool definition for FastMCP.
 * Starts or stops video recording on a simulator device.
 */
export const recordVideoTool = {
  name: "record_video",
  description:
    "Start or stop video recording on a booted simulator device. " +
    "Use action 'start' to begin recording and 'stop' to end it. " +
    "When starting, an output_path can be provided or one will be auto-generated.",
  parameters: z.object({
    device_id: z.string().describe("UDID of the simulator device"),
    action: z
      .enum(["start", "stop"])
      .describe("Action to perform: start or stop recording"),
    output_path: z
      .string()
      .optional()
      .describe(
        "Optional file path for the video (used with start action). Auto-generated if omitted."
      ),
  }),
  execute: async (params: {
    device_id: string;
    action: "start" | "stop";
    output_path?: string;
  }) => {
    const { device_id, action } = params;

    if (action === "start") {
      // Check if already recording
      if (activeRecordings.has(device_id)) {
        return JSON.stringify(
          {
            device_id,
            action: "start",
            status: "already_recording",
            message: `Video recording is already in progress on simulator ${device_id}.`,
          },
          null,
          2
        );
      }

      const videoDir =
        process.env.VIDEO_DIR ?? path.join(process.cwd(), "videos");

      let outputPath = params.output_path;
      if (!outputPath) {
        const timestamp = new Date()
          .toISOString()
          .replace(/[:.]/g, "-");
        outputPath = path.join(
          videoDir,
          `recording-${device_id.slice(0, 8)}-${timestamp}.mp4`
        );
      }

      // Spawn the recording process (it runs until terminated)
      const child = spawn(
        "xcrun",
        ["simctl", "io", device_id, "recordVideo", outputPath],
        {
          stdio: "ignore",
          detached: false,
        }
      );

      child.on("error", (err) => {
        activeRecordings.delete(device_id);
        console.error(
          `Recording process error for ${device_id}: ${err.message}`
        );
      });

      child.on("exit", () => {
        activeRecordings.delete(device_id);
      });

      activeRecordings.set(device_id, { process: child, outputPath });

      return JSON.stringify(
        {
          device_id,
          action: "start",
          status: "recording",
          output_path: outputPath,
          pid: child.pid,
          message: `Video recording started on simulator ${device_id}. Output: ${outputPath}`,
        },
        null,
        2
      );
    } else {
      // Stop recording
      const recording = activeRecordings.get(device_id);
      if (!recording) {
        return JSON.stringify(
          {
            device_id,
            action: "stop",
            status: "not_recording",
            message: `No active video recording found for simulator ${device_id}.`,
          },
          null,
          2
        );
      }

      // Send SIGINT to gracefully stop the recording (simctl expects this)
      recording.process.kill("SIGINT");
      activeRecordings.delete(device_id);

      // Give the process a moment to finalize the video file
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return JSON.stringify(
        {
          device_id,
          action: "stop",
          status: "stopped",
          output_path: recording.outputPath,
          message: `Video recording stopped on simulator ${device_id}. Saved to ${recording.outputPath}.`,
        },
        null,
        2
      );
    }
  },
};
