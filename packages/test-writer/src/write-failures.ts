import { parsePythonTestName } from "./parse-python-test-name.js";
import type { Language } from "./types.js";

export const writeFailure = (
  suiteName: string,
  errorMessage: string,
  language: Language,
  text: string,
) => {
  const error = errorMessage.replaceAll('`', '\\`');
  if (language === 'javascript') {
    return `
import { describe, test } from 'vitest';
describe('${suiteName}', () => {
  test('Failed to write tests', () => {
    throw new Error(\`${text}\n\n${error}\`); 
  }); 
});
`.trim();
  }

  return `
def describe_${parsePythonTestName(suiteName)}():
  def test_failed_to_write_tests():
    raise Exception('''${text}\n\n${error}''');
  `;
}

export const writeFailureIfFailedToWriteSuite = (
  suiteName: string,
  errorMessage: string,
  language: Language,
) => writeFailure(suiteName, errorMessage, language, 'Failed to write test file because we encountered an error during transformation:');

export const getFailureIfFailedToWriteTest = (language: Language, testName: string) => {
  if (language === 'javascript') {
    return `test('${testName}', () => { throw new Error('No test cases found for test name: "${testName}"') });`;
  }

  return `def test_${testName}():\n\traise Exception(\`No test cases found for test name: "${testName}"\`)`;
};
