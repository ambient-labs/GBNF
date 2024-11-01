import path from 'path';
import { vi, describe, expect, test, afterEach, beforeEach } from 'vitest';
import { parseMarkdownTestFile } from './parse-markdown/parse-markdown-test-file.js';
import type * as _parseMarkdownTestFile from './parse-markdown/parse-markdown-test-file.js';
import { getTestSuiteFileContent } from './get-test-suite-file-content.js';
import type * as _getTestSuiteFileContent from './get-test-suite-file-content.js';
import { prepareTests } from './prepare-tests.js';
import { writeFile } from './write-file.js';
import type * as _writeFile from './write-file.js';
import type * as _rimraf from 'rimraf';
import type * as fsPromises from 'fs/promises';
import { glob } from './glob.js';
import type * as _glob from './glob.js';
import { readFile } from 'fs/promises';

vi.mock('./glob.js', async () => {
  const actual = await vi.importActual('./glob.js') as typeof _glob;
  return {
    ...actual,
    glob: vi.fn().mockImplementation(actual.glob),
  };
});

vi.mock('fs/promises', async () => {
  const actual = await vi.importActual('fs/promises') as typeof fsPromises;
  return {
    ...actual,
    readFile: vi.fn(),
  };
});

vi.mock('rimraf', async () => {
  const actual = await vi.importActual('rimraf') as typeof _rimraf;
  return {
    ...actual,
    rimraf: vi.fn(),
  };
});

vi.mock('./write-file.js', async () => {
  const actual = await vi.importActual('./write-file.js') as typeof _writeFile;
  return {
    ...actual,
    writeFile: vi.fn(),
  };
});

vi.mock('./parse-markdown/parse-markdown-test-file.js', async () => {
  const actual = await vi.importActual('./parse-markdown/parse-markdown-test-file.js') as typeof _parseMarkdownTestFile;
  return {
    ...actual,
    parseMarkdownTestFile: vi.fn(actual.parseMarkdownTestFile),
  };
});

vi.mock('./get-test-suite-file-content.js', async () => {
  const actual = await vi.importActual('./get-test-suite-file-content.js') as typeof _getTestSuiteFileContent;
  return {
    ...actual,
    getTestSuiteFileContent: vi.fn(actual.getTestSuiteFileContent),
  };
});

describe('prepareTests', () => {
  test.only('writes tests', async () => {
    vi.mocked(parseMarkdownTestFile).mockResolvedValue({
      Validation: {
        imports: { javascript: 'import GBNF from "gbnf"' },
        tests: {
          'It parses a grammar `%s`': {
            test_body: { javascript: '(input, expectation) => { expect(input).toEqual(expectation); } ' },
            test_cases: [
              ['foo', 'foo',],
            ],
          },
        },
      },
    });
    const mockTestSuiteFileContent = 'fake getTestSuiteFileContent';
    vi.mocked(getTestSuiteFileContent).mockImplementation(async () => mockTestSuiteFileContent);
    const mockFileContents = 'mockFileContents';
    vi.mocked(readFile).mockResolvedValue(mockFileContents);
    vi.mocked(glob).mockResolvedValue(['testFile.md']);

    const configPath = 'configPath';
    const targetDir = '/targetDir';
    await prepareTests(configPath, targetDir, 'javascript');
    expect(parseMarkdownTestFile).toBeCalledWith(mockFileContents, 'testFile.md');
    expect(getTestSuiteFileContent).toBeCalledWith('testFile',
      {
        'It parses a grammar `%s`': { test_cases: [['foo', 'foo',]], test_body: { javascript: '(input, expectation) => { expect(input).toEqual(expectation); } ' } },
      },
      'javascript',
      { 'javascript': 'import GBNF from "gbnf"' },
    );
    expect(writeFile).toBeCalledWith(path.join(targetDir, 'testfile.test.ts'), mockTestSuiteFileContent);
  });
});

