import { execFile } from "node:child_process";
import { loadConfig } from "../config.js";

const DEFAULT_TIMEOUT = 30_000;

export function emulatorCmd(
  args: string[],
  options?: { timeout?: number }
): Promise<{ stdout: string; stderr: string }> {
  const { emulatorPath } = loadConfig();
  const timeout = options?.timeout ?? DEFAULT_TIMEOUT;

  return new Promise((resolve, reject) => {
    execFile(
      emulatorPath,
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
              `emulator ${args.join(" ")} failed` +
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

export async function listAvds(): Promise<string[]> {
  const { stdout } = await emulatorCmd(["-list-avds"]);
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
