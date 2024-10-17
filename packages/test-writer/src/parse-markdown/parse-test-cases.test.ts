import {
  describe,
  test,
  expect,
  vi,
} from 'vitest';
import {
  parseTestCases,
  gatherTestCases,
} from './parse-test-cases.js';
import {
  readFile,
} from 'fs/promises';
import * as _fs from 'fs/promises';

vi.mock('fs/promises', async () => {
  const actual = await vi.importActual<typeof _fs>('fs/promises');
  return {
    ...actual,
    readFile: vi.fn(),
  };
})
// import { runPyodide } from '../pyodide.js';
// import type * as _runPyodide from '../pyodide.js';

// vi.mock('../pyodide.js', async () => {
//   const actual = await vi.importActual<typeof _runPyodide>('../pyodide.js');
//   return {
//     ...actual,
//     runPyodide: vi.fn().mockImplementation(actual.runPyodide),
//   };
// });

describe('gatherTestCases', () => {
  test('it should gather a single test case', () => {
    expect(gatherTestCases('["root ::= \\"foo\\"", "2", "0"]')).toEqual(['["root ::= \\"foo\\"", "2", "0"]']);
  });

  test('it should gather multiple test cases', () => {
    expect(gatherTestCases([
      '["root ::= \\"foo\\"", "2", "0"]',
      '["root ::= \\"bar\\"", "2", "0"]',
    ].join('\n'))).toEqual([
      '["root ::= \\"foo\\"", "2", "0"]',
      '["root ::= \\"bar\\"", "2", "0"]',
    ]);
  });

  test('it should gather test cases with comments', () => {
    expect(gatherTestCases([
      '  \n ',
      '# This is a starting comment',
      "['root ::= \"foo\"',",
      '# This is a comment',
      '"2",',
      '0',
      ']',
      '# This is an ending comment',
    ].join('\n'))).toEqual([
      `['root ::= "foo"',\n# This is a comment\n"2",\n0\n]`,
    ]);
  });

  test('it should gather test cases with multiline strings', () => {
    expect(gatherTestCases([
      `['''`,
      `root ::= "`,
      `]`,
      `"`,
      `''', '2', 0]`,
    ].join('\n'))).toEqual([
      `['''\nroot ::= "\n]\n"\n''', '2', 0]`,
    ]);
  });

  describe('arrays of strings', () => {
    test('it should gather test cases containing single quote strings', () => {
      expect(gatherTestCases([
        `'foo'`,
        `'bar'`,
      ].join('\n'))).toEqual([
        `'foo'`,
        `'bar'`,
      ]);
    });

    test('it should gather test cases containing double quote strings', () => {
      expect(gatherTestCases([
        `"foo"`,
        `"bar"`,
      ].join('\n'))).toEqual([
        `"foo"`,
        `"bar"`,
      ]);
    });

    test('it should gather test cases containing triple single quote strings', () => {
      expect(gatherTestCases([
        `'''foo'''`,
        `'''bar'''`,
      ].join('\n'))).toEqual([
        `'''foo'''`,
        `'''bar'''`,
      ]);
    });

    test('it should gather test cases containing triple double quote strings', () => {
      expect(gatherTestCases([
        `"""foo"""`,
        `"""bar"""`,
      ].join('\n'))).toEqual([
        `"""foo"""`,
        `"""bar"""`,
      ]);
    });

    test('it should gather test cases containing triple single quote strings with new lines', () => {
      expect(gatherTestCases([
        [`'''`, `foo`, `'''`].join('\n'),
        [`'''`, `bar`, `'''`].join('\n'),
      ].join('\n'))).toEqual([
        `'''\nfoo\n'''`,
        `'''\nbar\n'''`,
      ]);
    });

    test('it should gather test cases containing triple double quote strings with new lines', () => {
      expect(gatherTestCases([
        [`"""`, `foo`, `"""`].join('\n'),
        [`"""`, `bar`, `"""`].join('\n'),
      ].join('\n'))).toEqual([
        `"""\nfoo\n"""`,
        `"""\nbar\n"""`,
      ]);
    });

    test('it should gather test cases containing triple single quote strings surrounded by triple double quotes', () => {
      expect(gatherTestCases([
        `"""['''`,
        `root ::= foo`,
        `foo := "foo"`,
        `''', '17', 'Expecting ::= at 17']"""`,
      ].join('\n'))).toEqual([
        `"""['''\nroot ::= foo\nfoo := "foo"\n''', '17', 'Expecting ::= at 17']"""`,
      ]);
    });
  });
});

describe('parseTestCases', () => {
  test('it should parse a single test case', async () => {
    expect(await parseTestCases('["root ::= \\"foo\\"", "2", "0"]')).toEqual([['root ::= "foo"', "2", "0"]]);
  });

  test('it should parse multiple test cases', async () => {
    expect(await parseTestCases([
      '["root ::= \\"foo\\"", "2", "0"]',
      '["root ::= \\"bar\\"", "2", "0"]',
    ].join('\n'))).toEqual([
      ['root ::= "foo"', "2", "0"],
      ['root ::= "bar"', "2", "0"],
    ]);
  });

  test('it should parse a test case with single quotes', async () => {
    expect(await parseTestCases("['root ::= \"foo\"', '2', '0']")).toEqual([['root ::= "foo"', "2", "0"]]);
  });

  test('it should parse a test case with comments', async () => {
    expect(await parseTestCases([
      '# This is a starting comment',
      "['root ::= \"foo\"',",
      '# This is a comment',
      '"2",',
      '0',
      ']',
      '# This is an ending comment',
    ].join('\n'))).toEqual([['root ::= "foo"', "2", 0]]);
  });

  test('it should parse a test case with triple single quotes', async () => {
    expect(await parseTestCases([
      `['''`,
      `root ::= foo`,
      `foo ::= "foo"`,
      `''', '2', 0]`,
    ].join('\n'))).toEqual([['\nroot ::= foo\nfoo ::= "foo"\n', '2', 0]]);
  });

  test('it should parse a test case with triple double quotes', async () => {
    expect(await parseTestCases([
      `["""`,
      `root ::= foo`,
      `foo ::= "foo"`,
      `""", '2', 0]`,
    ].join('\n'))).toEqual([['\nroot ::= foo\nfoo ::= "foo"\n', '2', 0]]);
  });

  test('it should parse a test case with brackets', async () => {
    expect(await parseTestCases("['root ::= [a-z]', '2', 0]")).toEqual([['root ::= [a-z]', '2', 0]]);
  });

  test('it should parse a test case with a single closing bracket', async () => {
    expect(await parseTestCases(`['root ::= "]"', '2', 0]`)).toEqual([[`root ::= "]"`, '2', 0]]);
  });

  test('it should parse a test case with a single closing bracket at the end of a line', async () => {
    expect(await parseTestCases([
      `['''`,
      `root ::= "`,
      `]`,
      `"`,
      `''', '2', 0]`,
    ].join('\n'))).toEqual([[`\nroot ::= "\n]\n"\n`, '2', 0]]);
  });

  test('should parse brackets with triple quoted strings', async () => {
    const input = `
[
  '''
  foo
  []
''',
  'f', 
  []
]
      `;
    expect(await parseTestCases(input)).toEqual([['\n  foo\n  []\n', 'f', []]]);
  });

  describe.only('<%', () => {
    test('should parse <% %>', async () => {
      expect(await parseTestCases(`<% return "'foo'" %>`)).toEqual(['foo']);
    });

    test('should eval contents of <% %>', async () => {
      vi.mocked(readFile).mockImplementation(async () => '"foo"');
      expect(await parseTestCases(`<% 
        const file = await readFile('package.json', 'utf8');
        return file;
      %>`)).toEqual(['foo']);
      expect(readFile).toHaveBeenCalledWith('package.json', 'utf-8')
    });
  });
});


