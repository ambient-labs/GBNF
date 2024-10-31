import type { RunOptions, RunConsole } from "./types.js";
import { loadPyodide } from 'pyodide';
// import path from 'path';
// import * as url from 'url';

// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// const NODE_MODULES_DIR = path.resolve(__dirname, '../node_modules');
// const _pyodide = loadPyodide({
//   indexURL: path.resolve(NODE_MODULES_DIR, 'pyodide'),
// });

const _pyodide = loadPyodide({
  // indexURL: `${window.location.origin}${indexURL}`,
  indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.3/full/',
});

const getPyodide = async (dependencies: string[] = []) => {
  const pyodide = await _pyodide;
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  // await micropip.install(gbnfPythonURL);
  await micropip.install(dependencies);
  return pyodide;
}

export interface RunPythonOptions {
  dependencies: string[];
}

export const runPython = async (options: RunOptions, console: RunConsole, { dependencies }: RunPythonOptions) => {
  const pyodide = await getPyodide(dependencies);

  pyodide.setStdout({
    batched: text => {
      console.log(text);
    }
  })

  await pyodide.runPython(options.script);
}
