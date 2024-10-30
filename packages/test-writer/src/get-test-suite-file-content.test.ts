import { vi, describe, expect, test } from 'vitest';
import type * as _prettier from 'prettier';
import { getTestSuiteFileContent } from './get-test-suite-file-content.js';

vi.mock('prettier', async () => {
  const actual = await vi.importActual('prettier') as typeof _prettier;
  return {
    ...actual,
    format: vi.fn(str => str),
  };
});

describe('getTestSuiteFileContent', () => {
  test('parses test content without imports', async () => {
    expect(await getTestSuiteFileContent('Validation', {
      'It parses a grammar `%s`': {
        test_cases: [['foo', 'foo']],
        test_body: {
          javascript: [
            '(input, expectation) => {',
            'expect(input).toBe(expectation)',
            '}',
          ].join('\n')
        }
      }
    })).toEqual([
      `import { expect, describe, test } from 'vitest';`,
      ``,
      `describe('Validation', () => {`,
      `test.for([["foo","foo"]])('It parses a grammar \`%s\`', (input, expectation) => {`,
      `expect(input).toBe(expectation)`,
      `});`,
      `});`,
    ].join('\n'));
  });

  test('parses test content with imports', async () => {
    expect(await getTestSuiteFileContent('Validation', {
      'It parses a grammar `%s`': {
        test_cases: [['foo', 'foo']],
        test_body: {
          javascript: [
            '(input, expectation) => {',
            'expect(input).toBe(expectation)',
            '}',
          ].join('\n')
        }
      }
    },
      'import GBNF from "gbnf"',
    )).toEqual([
      `import { expect, describe, test } from 'vitest';`,
      `import GBNF from "gbnf";`,
      ``,
      `describe('Validation', () => {`,
      `test.for([["foo","foo"]])('It parses a grammar \`%s\`', (input, expectation) => {`,
      `expect(input).toBe(expectation)`,
      `});`,
      `});`,
    ].join('\n'));
  });

  test('it automatically handles new lines', async () => {
    expect(await getTestSuiteFileContent('Validation', {
      'It parses a grammar `%s`': {
        test_cases: [[[`foo`, `bar`].join('\n'), 'foo']],
        test_body: {
          javascript: [
            '(input, expectation) => {',
            'expect(input).toBe(expectation)',
            '}',
          ].join('\n')
        }
      }
    },
      'import GBNF from "gbnf"',
    )).toEqual([
      `import { expect, describe, test } from 'vitest';`,
      `import GBNF from "gbnf";`,
      ``,
      `describe('Validation', () => {`,
      `test.for([["foo\\nbar","foo"]])('It parses a grammar \`%s\`', (input, expectation) => {`,
      `expect(input).toBe(expectation)`,
      `});`,
      `});`,
    ].join('\n'));
  });
});


