import { getTestSuiteFileContent } from './get-test-suite-file-content.js';
import { writeFile } from './write-file.js';
import { validateSuiteConfig } from './validate-config.js';
import { readFile } from 'fs/promises';
import { parseMarkdownTestFile } from './parse-markdown/parse-markdown-test-file.js';
import { getTestFilePath } from './get-test-file-path.js';
import type { Language } from './types.js';
import {
  writeFailure,
} from './write-failures.js';

const getTestFileName = (testFile: string): string => {
  const fileName = testFile.split('/').pop()!;
  return fileName.split('.').slice(0, -1).join('.');
};

export const prepareTest = async (testFile: string, targetDir: string, language: Language): Promise<string[]> => {
  const contents = await readFile(testFile, 'utf-8');
  const originalTestFileName = getTestFileName(testFile);
  try {
    const testSuites = await parseMarkdownTestFile(contents, testFile);
    return Promise.all(Object.entries(testSuites).map(async ([
      _,
      // suiteName,
      suiteConfig,
    ]): Promise<string> => {
      const suiteName = originalTestFileName;
      const targetTestFilePath = getTestFilePath(suiteName, targetDir, language);
      if (validateSuiteConfig(suiteConfig)) {
        const { imports, tests } = suiteConfig;
        try {
          const testFileContent = await getTestSuiteFileContent(suiteName, tests, language, imports);
          await writeFile(targetTestFilePath, testFileContent);
        } catch (err: unknown) {
          const errorMessage = JSON.stringify((err instanceof Error) ? err.message : err);
          await writeFile(
            targetTestFilePath,
            writeFailure(
              suiteName,
              errorMessage,
              language,
              `Failed to write test file "${suiteName}" because we encountered an error during transformation:`,
            ),
          );
        }
      }
      return targetTestFilePath;
    }));
  } catch (err: unknown) {
    const errorMessage = JSON.stringify((err instanceof Error) ? err.message : err);
    const targetTestFileName = getTestFilePath(originalTestFileName, targetDir, language);
    await writeFile(
      targetTestFileName,
      writeFailure(
        originalTestFileName,
        errorMessage,
        language,
        `Failed to write test file "${originalTestFileName}" because we encountered an error during reading the file:`,
      ),
    );
    return [targetTestFileName];
  }
};
