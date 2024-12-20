import path from 'path';
import { glob, } from './glob.js';
import type { Language, } from './types.js';
import { processTest, } from './process-test.js';

export const processTests = async (
  testDirectoryPath: string,
  targetDir: string,
  language: Language,
  includedTests: string[],
): Promise<string[]> => {
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
  const nestedTestFiles: string[] = (await Promise.all(testFiles.map(testFile => processTest(
    testFile,
    testDirectoryPath,
    targetDir,
    language,
  )))).flat();
  console.log('wrote:', nestedTestFiles);
  return nestedTestFiles;
};
