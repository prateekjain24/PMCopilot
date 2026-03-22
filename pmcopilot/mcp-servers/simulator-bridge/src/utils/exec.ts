import { execFile } from "node:child_process";

export interface ExecResult {
  stdout: string;
  stderr: string;
}

/**
 * Promise-based wrapper around child_process.execFile.
 * Default timeout: 30000ms.
 * Rejects with a descriptive error including command, exit code, and stderr.
 */
export function exec(
  cmd: string,
  args: string[],
  options?: { timeout?: number }
): Promise<ExecResult> {
  const timeout = options?.timeout ?? 30000;

  return new Promise((resolve, reject) => {
    execFile(
      cmd,
      args,
      { timeout, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          const exitCode = (error as NodeJS.ErrnoException & { code?: number | string }).code;
          reject(
            new Error(
              `Command failed: ${cmd} ${args.join(" ")}\n` +
                `Exit code: ${exitCode ?? "unknown"}\n` +
                `Stderr: ${stderr || "(empty)"}\n` +
                `Error: ${error.message}`
            )
          );
          return;
        }
        resolve({ stdout: stdout ?? "", stderr: stderr ?? "" });
      }
    );
  });
}

/**
 * Check whether a command-line tool is available on PATH.
 */
export async function isToolAvailable(tool: string): Promise<boolean> {
  try {
    await exec("which", [tool]);
    return true;
  } catch {
    return false;
  }
}
