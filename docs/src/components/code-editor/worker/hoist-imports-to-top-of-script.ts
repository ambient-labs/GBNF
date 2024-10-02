import { findAllImportsInScript } from "./find-all-imports-in-script.js";

export const hoistImportsToTopOfScript = async (script: string) => {
  const hoistedImports: string[] = [];

  for (const { source } of findAllImportsInScript(script)) {
    hoistedImports.push(source);
    script = script.replace(source, '');
  }
  return {
    hoistedImports: hoistedImports.map(i => i.trim() + ';'),
    script: script.split('\n').filter(line => line.trim() !== '').join('\n'),
  }
}

