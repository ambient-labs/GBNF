import { esm } from "../build-esm.js";
import { hoistImportsToTopOfScript } from "./hoist-imports-to-top-of-script.js";

export interface RunOptions {
  script: string;
}

export interface RunConsole {
  info: typeof console.info;
  log: typeof console.log;
  warn: typeof console.warn;
  error: typeof console.error;
}

export const run = async (options: RunOptions, console: RunConsole, ...args: unknown[]) => {
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
