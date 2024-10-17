import { format } from 'prettier';
import type { TestConfigCollection } from './types.js';

const getTestCases = (testCases: unknown[], testCasesType?: string) => {
  return `${JSON.stringify(testCases)}${testCasesType ? ` as ${testCasesType}` : ''}`;
};

const getFailureIfFailedToWriteTest = (testName: string) => `test('${testName}', () => { throw new Error('No test cases found for test name: "${testName}"') });`;

export const getTestSuiteFileContent = (suiteName: string, tests: TestConfigCollection, imports: string = '') => formatTest([
  writeImports(imports),
  '',
  `describe('${suiteName}', () => {`,
  Object.entries(tests).map(([testName, { test_cases: testCases, test_body, test_cases_type }]) => {
    if (typeof testCases === 'string') {
      if (test_cases_type) {
        throw new Error('You provided a string, test_cases_type is invalid and should be omitted.')
      }
      return `test.for(${testCases})('${testName}', ${test_body?.javascript});`;
    } else {
      if (testCases.length === 0) {
        return getFailureIfFailedToWriteTest(testName);
      }
      return `test.for(${getTestCases(testCases, test_cases_type?.javascript)})('${testName}', ${test_body?.javascript});`;
    }
  }).join('\n'),
  `});`,
].join('\n'));

export const formatTest = (str: string) => format(str, {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  parser: 'typescript',
});

const writeImports = (imports: string) => [
  `import { expect, describe, test } from 'vitest'`,
  imports,
].filter(Boolean).map(line => line.endsWith(';') ? line : `${line};`).join('\n');
