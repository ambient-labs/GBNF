import { esm } from "../build-esm.js";
import { hoistImportsToTopOfScript } from "./hoist-imports-to-top-of-script.js";
import type { RunOptions, RunConsole } from "./types.js";
export const runJavascript = async (options: RunOptions, console: RunConsole, ...args: unknown[]) => {
  const { hoistedImports, script: scriptBody } = await hoistImportsToTopOfScript(options.script);
  const finalScript = [
    ...hoistedImports,
    `export default async function fn(console) { 
      try {
        ${scriptBody}
      } catch(err) {
        console.error(err);

      }
    }
  `,
  ].join('\n').trim();
  const fn = esm`${finalScript}`;
  const namespaceObject = await import(/* @vite-ignore */ fn)
  URL.revokeObjectURL(fn);
  const anonymousFunction = namespaceObject.default;
  return await anonymousFunction(console, ...args);
};

