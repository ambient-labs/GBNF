const importRegex = /import(.+?)from(.+?)(\n)/gs;
export function* findAllImportsInScript(script: string) {
  for (const match of script.matchAll(importRegex)) {
    const importName = match[2].trim().replace(/["';]/g, "");
    const source = match[0];
    yield {
      importName,
      source,
      match,
    };
  }
}
