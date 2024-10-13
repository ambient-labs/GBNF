import type { RunOptions, RunConsole } from "./types.js";
import { loadPyodide } from 'pyodide';
// import indexURL from 'pyodide/pyodide.asm.js?url';
// console.log('indexURL', indexURL)

import gbnfPythonURL from '../../../../../packages/gbnf/python/dist/gbnf-0.0.5-py3-none-any.whl?url'
// console.log('gbnfPythonURL', gbnfPythonURL)

const _pyodide = loadPyodide({
  // indexURL: `${window.location.origin}${indexURL}`,
  indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',

  // // stdin: window.prompt,
  // stdout: (text) => {
  //   console.log('whatup!', text);
  // },
  // stderr: (text) => {
  //   console.log('whatup!', text);
  // },
});

const getPyodide = async () => {
  const pyodide = await _pyodide;
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install(gbnfPythonURL);
  return pyodide;
}

export const runPython = async (options: RunOptions, console: RunConsole, ...args: unknown[]) => {
  const pyodide = await getPyodide();


  pyodide.setStdout({
    batched: text => {
      console.log(text);
    }
  })

  // const script = [
  //   options.script,
  // ].join('\n');
  await pyodide.runPython(options.script);
  // console.log(result);
  // return result;
}
