import path from 'path';
import { glob, } from './glob.js';
import type { Language, } from './types.js';
import { processTest, } from './process-test.js';

export const processTests = async (
  testDirectoryPath: string,
  targetDir: string,
  language: Language,
  includedTests: string[],
): Promise<{
  tests: string[];
  errors: string[];
}> => {
  // const foundTests = await glob(path.join(testDirectoryPath, `**/*.md`));
  const testFiles: string[] = (await glob(path.join(testDirectoryPath, `**/*.md`))).filter(testFile => {
    if (includedTests.length === 0) {
      return true;
    }
    return includedTests.some(includedTest => testFile.includes(includedTest));
  });
  if (testFiles.length === 0) {
    throw new Error(`No test files found for ${includedTests.join(', ')}`);
  }
  const errors: string[] = [];
  const promises = testFiles.map(testFile => {
    try {
      return processTest(
        testFile,
        testDirectoryPath,
        targetDir,
        language,
      );
    } catch (err: unknown) {
      errors.push([
        `[processTest] Error processing test "${testFile}".`,
        err instanceof Error ? err.message : JSON.stringify(err),
      ].join('\n\n'));
      return [];
    }
  });
  const nestedTestFiles: string[] = (await Promise.all(promises)).flat();
  return {
    tests: nestedTestFiles,
    errors,
  };
};
