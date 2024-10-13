import type { RunOptions, RunConsole } from "./types.js";
import { runJavascript } from "./run-javascript.js";
import { runPython } from "./run-python.js";


export const run = async (options: RunOptions, console: RunConsole, ...args: unknown[]) => {
  if (options.kernel === 'javascript') {
    return runJavascript(options, console, ...args);
  } else if (options.kernel === 'python') {
    return runPython(options, console, ...args);
  } else {
    throw new Error(`Unknown kernel: ${options.kernel}`);
  }
}
