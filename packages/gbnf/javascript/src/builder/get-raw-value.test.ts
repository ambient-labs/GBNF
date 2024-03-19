import {
  describe,
  test,
  expect,
} from 'vitest';

import {
  getRawValue,
} from './get-raw-value.js';

const n = (str: string) => str.split('\\n').join('\n');

describe('getRawValue', () => {
  test.each([
    ['foo', 'foo'],
    [' foo ', ' foo '],
    ['  foo  ', ' foo '],
    ['  \\n\\nfoo  \\n\\n', ' foo '],
    ['foo bar', 'foo bar'],
    [' foo bar ', ' foo bar '],
    ['  foo   bar  ', ' foo bar '],
    ['  \\n\\nfoo   \\n\\nbar  \\n\\n', ' foo bar '],
    ['"foo"', '"foo"'],
    [' "foo" ', ' "foo" '],
    [' " foo " ', ' " foo " '],
    [' "  foo  " ', ' "  foo  " '],
    ['  "  foo  "  ', ' "  foo  " '],
    ['  \\n\\n"  \\n\\nfoo  "  ', ' "  \\n\\nfoo  " '],
    ['"\\"foo\\""', '"\\"foo\\""'],
    ['" \\"foo\\" "', '" \\"foo\\" "'],
    ['" \\" foo \\" "', '" \\" foo \\" "'],
    ['"  \\"  foo  \\"  "', '"  \\"  foo  \\"  "'],
    ['"  \\"  \\"foo\\"  \\"  "', '"  \\"  \\"foo\\"  \\"  "'],
    [' [a-z]  [a-z] "  \\nfoo\\n  "', ' [a-z] [a-z] "  \\nfoo\\n  "'],
    [`\\n SELECTY\\n FROM \\n `, ' SELECTY FROM '],
  ])(`it gets value '%s'`, (val, expectation) => {
    expect(getRawValue(n(val))).toEqual({
      str: expectation,
      inQuote: false,
    });
  });

  test.each([
    [
      '  foo"',
      {
        str: ' foo"',
        inQuote: true,
      },
      false,
    ],
    [
      '  foo"',
      {
        str: '  foo"',
        inQuote: false,
      },
      true,
    ],
  ])(`it passes inQuote '%s'`, (val, expectation, inQuote) => {
    expect(getRawValue(n(val), inQuote)).toEqual(expectation);
  });

});
