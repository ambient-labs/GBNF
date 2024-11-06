import path from 'path';
import { glob } from './glob.js';
import type { Language } from './types.js';
import { processTest } from './process-test.js';

export const processTests = async (
  testDirectoryPath: string,
  targetDir: string,
  language: Language,
): Promise<string[]> => {
  const testFiles: string[] = await glob(path.join(testDirectoryPath, `**/*.md`));
  const nestedTestFiles: string[] = (await Promise.all(testFiles.map(testFile => processTest(
    testFile,
    testDirectoryPath,
    targetDir,
    language,
  )))).flat();
  console.log('wrote:', nestedTestFiles);
  return nestedTestFiles;
};
