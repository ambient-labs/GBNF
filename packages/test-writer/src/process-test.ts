import path from 'path';
import { writeFile, } from './write-file.js';
import { getTestFilePath, } from './get-test-file-path.js';
import type { Language, } from './types.js';
import { parseMarkdown, } from './parse-markdown/parse-markdown.js';
import { formatTest, } from './format-test.js';
import { log, } from './log.js';

const getTestFileName = (testFile: string, sourceDir: string): [string, string] => {
  const fullFilePath = testFile.split(`${sourceDir}`).pop();
  const parts = fullFilePath!.split('/').filter(Boolean);
  const fileName = parts.pop()!;
  const folderPath = parts.join('/');
  return [
    fileName.split('.').slice(0, -1).join('.'),
    folderPath,
  ];
};

export const processTest = async (testFile: string, sourceDir: string, targetDir: string, language: Language): Promise<string[]> => {
  const testContents = await parseMarkdown(testFile, language);
  const [originalTestFileName, folderPath,] = getTestFileName(testFile, sourceDir);
  const formattedTest = await formatTest(language, testContents, testFile);
  const testName = getTestFilePath(originalTestFileName, language);
  const targetTestFilePath = path.join(targetDir, folderPath, testName);
  await writeFile(targetTestFilePath, formattedTest);
  return [targetTestFilePath,];
};

