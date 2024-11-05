import { processTests } from './process-tests.js';
import { removeUnwantedFiles } from './remove-unwanted-files.js';
import type { Language } from './types.js';

export const writeAllTests = async (testDir: string, targetDir: string, language: Language) => {
  const start = performance.now();
  const tests = await processTests(testDir, targetDir, language);
  await removeUnwantedFiles(targetDir, tests);
  return {
    duration: performance.now() - start,
    tests,
  };
};
