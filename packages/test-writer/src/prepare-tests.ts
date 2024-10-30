import path from 'path';
import { getTestSuiteFileContent } from './get-test-suite-file-content.js';
import { writeFile } from './write-file.js';
import { validateSuiteConfig } from './validate-config.js';
import { readFile } from 'fs/promises';
import { glob } from './glob.js';
import { parseMarkdownTestFile } from './parse-markdown/parse-markdown-test-file.js';
import { getTestFilePath } from './get-test-file-path.js';

const writeFailureIfFailedToWriteSuite = (suiteName: string, errorMessage: string) => `
import { describe, test } from 'vitest';
describe('${suiteName}', () => {
  test('Failed to write tests', () => {
    throw new Error(\`Failed to write test file because we encountered an error during transformation:\n\n${errorMessage.replaceAll('`', '\\`')}\`); 
  }); 
});
`.trim();

const writeFailureIfFailedToProcessTestFile = (testFileName: string, errorMessage: string) => `
import { describe, test } from 'vitest';
describe('${testFileName}.test.ts', () => {
  test('Failed to write tests', () => {
    throw new Error(\`Failed to write test file because we encountered an error during reading the file:\n\n${errorMessage.replaceAll('`', '\\`')}\`); 
  }); 
});
`.trim();

export const prepareTest = async (testFile: string, targetDir: string): Promise<string[]> => {
  const contents = await readFile(testFile, 'utf-8');
  try {
    const testSuites = await parseMarkdownTestFile(contents, testFile);
    return Promise.all(Object.entries(testSuites).map(async ([
      suiteName,
      suiteConfig,
    ]): Promise<string> => {
      const testFile = getTestFilePath(suiteName, targetDir);
      if (validateSuiteConfig(suiteConfig)) {
        const { imports, tests } = suiteConfig;
        try {
          const testFileContent = await getTestSuiteFileContent(suiteName, tests, imports?.javascript);
          await writeFile(testFile, testFileContent);
        } catch (err: unknown) {
          const errorMessage = JSON.stringify((err instanceof Error) ? err.message : err);
          await writeFile(testFile, writeFailureIfFailedToWriteSuite(suiteName, errorMessage));
        }
      }
      return testFile;
    }));
  } catch (err: unknown) {
    const errorMessage = JSON.stringify((err instanceof Error) ? err.message : err);
    const originalTestFileName = testFile.split('/').pop()!.split('.').slice(0, -1).join('.');
    const targetTestFileName = getTestFilePath(originalTestFileName, targetDir);
    await writeFile(targetTestFileName, writeFailureIfFailedToProcessTestFile(originalTestFileName, errorMessage));
    return [targetTestFileName];
  }
};

export const prepareTests = async (
  testDirectoryPath: string,
  targetDir: string,
): Promise<string[]> => {
  const testFiles: string[] = await glob(path.join(testDirectoryPath, `**/*.md`));
  const nestedTestFiles: string[][] = await Promise.all(testFiles.map(testFile => prepareTest(testFile, targetDir)));
  return nestedTestFiles.reduce((acc, curr) => [...acc, ...curr], []);
};
