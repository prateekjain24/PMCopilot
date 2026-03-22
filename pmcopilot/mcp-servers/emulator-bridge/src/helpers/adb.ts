import { execFile } from "node:child_process";
import { loadConfig } from "../config.js";

const DEFAULT_TIMEOUT = 30_000;

export function adb(
  args: string[],
  options?: { timeout?: number }
): Promise<{ stdout: string; stderr: string }> {
  const { adbPath } = loadConfig();
  const timeout = options?.timeout ?? DEFAULT_TIMEOUT;

  return new Promise((resolve, reject) => {
    execFile(
      adbPath,
      args,
      { timeout, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          const code = (error as NodeJS.ErrnoException).code;
          const exitCode =
            "code" in error && typeof error.code === "number"
              ? error.code
              : undefined;
          reject(
            new Error(
              `adb ${args.join(" ")} failed` +
                (exitCode !== undefined ? ` (exit code ${exitCode})` : "") +
                (code ? ` [${code}]` : "") +
                (stderr ? `\nstderr: ${stderr.trim()}` : "") +
                (error.message ? `\n${error.message}` : "")
            )
          );
          return;
        }
        resolve({ stdout, stderr });
      }
    );
  });
}

export async function adbShell(
  deviceId: string,
  command: string
): Promise<string> {
  const { stdout } = await adb(["-s", deviceId, "shell", command]);
  return stdout.trim();
}
