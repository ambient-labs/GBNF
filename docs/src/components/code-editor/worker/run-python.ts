import type { RunOptions, RunConsole } from "./types.js";
import { loadPyodide } from 'pyodide';

const _pyodide = loadPyodide({
  // indexURL: `${window.location.origin}${indexURL}`,
  indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
});

const getPyodide = async () => {
  const pyodide = await _pyodide;
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  // await micropip.install(gbnfPythonURL);
  await micropip.install('gbnf-0.0.5-py3-none-any.whl');
  return pyodide;
}

export const runPython = async (options: RunOptions, console: RunConsole, ...args: unknown[]) => {
  const pyodide = await getPyodide();

  pyodide.setStdout({
    batched: text => {
      console.log(text);
    }
  })

  await pyodide.runPython(options.script);
}
