import path from 'path';
import { glob } from './glob.js';
import type { Language } from './types.js';
import { prepareTest } from './prepare-test.js';

export const prepareTests = async (
  testDirectoryPath: string,
  targetDir: string,
  language: Language,
): Promise<string[]> => {
  const testFiles: string[] = await glob(path.join(testDirectoryPath, `**/*.md`));
  const nestedTestFiles: string[][] = await Promise.all(testFiles.map(testFile => prepareTest(testFile, targetDir, language)));
  return nestedTestFiles.reduce((acc, curr) => [...acc, ...curr], []);
};
