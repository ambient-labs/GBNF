import {
  describe,
  test,
  expect
} from 'vitest';
import {
  parseMarkdownTestFile,
} from './parse-markdown-test-file.js';

const getFixture = ({
  testSuiteName = 'Test Suite',
  testName = 'It reports an error for an invalid input (%#): `%s`',
  imports = [
    'import GBNF, {',
    '  InputParseError',
    '} from "../../src/index.js";',
    'import { expect } from "vitest";',
  ].join('\n'),
  testCases = [],
}: {
  testSuiteName?: string;
  testName?: string;
  imports?: string;
  testCases?: string[];
} = {}) => {
  return [
    `# ${testSuiteName}`,
    '',
    '```imports.javascript',
    imports,
    '```',
    `## ${testName}`,
    '',
    '```test_cases',
    testCases.join('\n'),
    '```',
    '',
    '```test_cases_type.javascript',
    '[string, string, number][]',
    '```',
    '',
    '```test_body.javascript',
    'async ([_grammar, input, errorPos]) => {',
    '  const error = new InputParseError(input, errorPos, \'\');',
    '  const grammar = _grammar.split(\'\\\\n\').join(\'\\n\');',
    '  expect(() => {',
    '    const graph = GBNF(grammar);',
    '    graph.add(input);',
    '  }).toThrowError(error);',
    '}',
    '```',
  ].join('\n');
};

const getExpectation = ({
  testSuiteName = 'Test Suite',
  testName = 'It reports an error for an invalid input (%#): `%s`',
  imports = [
    'import GBNF, {',
    '  InputParseError',
    '} from "../../src/index.js";',
    'import { expect } from "vitest";',
  ].join('\n'),
  testCases = [],
}: {
  testSuiteName?: string;
  testName?: string;
  imports?: string;
  testCases?: (unknown)[];
} = {}) => {
  return {
    [testSuiteName]: {
      imports: {
        javascript: imports,
      },
      tests: {
        [testName]: {
          test_cases: testCases,
          test_cases_type: {
            javascript: '[string, string, number][]',
          },
          test_body: {
            javascript: [
              'async ([_grammar, input, errorPos]) => {',
              '  const error = new InputParseError(input, errorPos, \'\');',
              '  const grammar = _grammar.split(\'\\\\n\').join(\'\\n\');',
              '  expect(() => {',
              '    const graph = GBNF(grammar);',
              '    graph.add(input);',
              '  }).toThrowError(error);',
              '}',
            ].join('\n'),
          },
        },
      },
    },
  }
};

describe('parseMarkdownTestFile', () => {
  test('should parse a markdown test file', async () => {
    expect(await parseMarkdownTestFile(getFixture({
      testCases: [
        '["root ::= \\"foo\\"", "2", "0"]',
      ],
    }))).toEqual(getExpectation({
      testCases: [
        ['root ::= "foo"', "2", "0"],
      ],
    }));
  });
});
