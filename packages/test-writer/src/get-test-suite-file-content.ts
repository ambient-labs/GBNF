import type { Language, TestConfigCollection } from './types.js';
import { getFailureIfFailedToWriteTest } from './write-failures.js';
import { formatTest } from './format-test.js';
import { writeImports } from './write-imports.js';
import { getTestCases } from './get-test-cases.js';
import { parsePythonTestName } from './parse-python-test-name.js';
import { indent } from './indent.js';

const getDescribeBlock = (language: Language, suiteName: string, contents: string[]): string[] => {
  if (language === 'javascript') {
    return [
      `describe('${suiteName}', () => {`,
      ...contents,
      `});`,
    ];
  }

  return [
    `def describe_${parsePythonTestName(suiteName)}():`,
    ...contents,
  ];
};

const getTestBlock = (
  language: Language,
  testCases: string,
  testName: string,
  testBody: Record<string, string> = {},
  testCasesNames: Record<string, string> = {},
  testBodyArgs: Record<string, string> = {},
): string => {
  const body = testBody[language];
  if (!body) {
    throw new Error(`No test body in ${JSON.stringify(testName)} found for language: ${language}`);
  }

  if (language === 'javascript') {
    return `test.for(${testCases})('${testName}', ${body});`;
  }


  return [
    `@pytest.mark.parametrize(${testCasesNames[language]}, ${testCases})`,
    `def test_${parsePythonTestName(testName)}${testBodyArgs[language]}:`,
    ...indent(body),
    '',
  ].join('\n');
};

export const getTestSuiteFileContent = (
  suiteName: string,
  tests: TestConfigCollection,
  language: Language,
  imports: Record<string, string> = {},
) => {
  const describeBlock = getDescribeBlock(language, suiteName,
    Object.entries(tests).map(([_testName, { test_cases, test_body, test_cases_type, test_name, test_cases_names, test_body_args }]) => {
      console.log(test_cases_names);
      let testName = test_name?.[language] || _testName;
      if (typeof test_cases === 'string') {
        if (test_cases_type) {
          throw new Error('You provided a string, test_cases_type is invalid and should be omitted.')
        }
      } else {
        if (test_cases.length === 0) {
          return getFailureIfFailedToWriteTest(language, testName);
        }
      }
      const testCases = typeof test_cases === 'string' ? test_cases : getTestCases(language, test_cases, test_cases_type);
      return indent(getTestBlock(language, testCases, testName, test_body, test_cases_names, test_body_args), language === 'python' ? 2 : 0).join('\n');
    }),
  );
  return formatTest(language, [
    writeImports(language, imports[language]),
    '',
    ...describeBlock,
  ].join('\n'));
};


