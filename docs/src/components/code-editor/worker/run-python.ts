import type { RunOptions, RunConsole } from "./types.js";
import { loadPyodide } from 'pyodide';

const _pyodide = loadPyodide({
  // indexURL: `${window.location.origin}${indexURL}`,
  indexURL: `https://cdn.jsdelivr.net/pyodide/v${import.meta.env.PYODIDE_VERSION}/full/`,
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
  return 'foobar!';
  const pyodide = await getPyodide(dependencies);

  pyodide.setStdout({
    batched: text => {
      console.log(text);
    }
  })

  await pyodide.runPython(options.script);
}
