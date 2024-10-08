import {
  describe,
  test,
  expect
} from 'vitest';
import {
  buildErrorPosition,
} from './build-error-position';

describe('buildErrorPosition', () => {
  test.each([
    [
      'root ::= "foo"',
      1,
      [
        'root ::= "foo"',
        ' ^',
      ],
    ],
    [
      'root ::= "foo"',
      5,
      [
        'root ::= "foo"',
        '     ^',
      ],
    ],
    // multi line grammars with pos on first line
    [
      'aa\\nbb',
      1,
      [
        'aa',
        ' ^',
      ],
    ],
    // multi line grammars with pos on second line, first character
    [
      'aa\\nbb',
      2,
      [
        'aa\\nbb',
        '^',
      ],
    ],
    // multi line grammars with pos on second line, second character
    [
      'aa\\nbb',
      2 + 1,
      [
        'aa\\nbb',
        ' ^',
      ],
    ],
    // multi line grammars beyond error with pos on second line
    [
      'aa\\nbb\\ncc',
      2 + 1,
      [
        'aa\\nbb',
        ' ^',
      ],
    ],
    // multi line grammars beyond error with pos on third line, first char
    [
      'aa\\nbb\\ncc',
      2 + 2 + 0,
      [
        'aa\\nbb\\ncc',
        '^',
      ],
    ],
    // multi line grammars beyond error with pos on third line, second char
    [
      'aa\\nbb\\ncc',
      2 + 2 + 1,
      [
        'aa\\nbb\\ncc',
        ' ^',
      ],
    ],
    // multi line grammars beyond error with pos on fourth line, first char
    [
      'aa\\nbb\\ncc\\ndd',
      2 + 2 + 2 + 0,
      [
        'bb\\ncc\\ndd',
        '^',
      ],
    ],
    // multi line grammars beyond error with pos on fifth line, second char
    [
      'aa\\nbb\\ncc\\ndd\\nee',
      2 + 2 + 2 + 2 + 1,
      [
        'cc\\ndd\\nee',
        ' ^',
      ],
    ],
  ])('it correctly shows position for %s', (grammar, pos, [grammarOut, posOut,]) => {
    const result = buildErrorPosition(grammar.split('\\n').join('\n'), pos);
    expect(result).toEqual([
      ...grammarOut.split('\\n'),
      posOut,
    ]);
  });

  test('it renders a message for empty input', () => {
    const result = buildErrorPosition('', 0);
    expect(result).toEqual(["No input provided"]);
  });
});
