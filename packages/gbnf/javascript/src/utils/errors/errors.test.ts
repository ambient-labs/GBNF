import { describe, test, expect } from 'vitest';
import {
  GRAMMAR_PARSER_ERROR_HEADER_MESSAGE,
  GrammarParseError,
  INPUT_PARSER_ERROR_HEADER_MESSAGE,
  InputParseError,
  buildErrorPosition,
} from './errors.js';

describe('errors', () => {
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
  });

  test('it renders a message for empty input', () => {
    const result = buildErrorPosition('', 0);
    expect(result).toEqual(["No input provided"]);
  });

  describe('GrammarParseError', () => {
    test('it renders a message', () => {
      const grammar = 'aa\\nbb\\ncc\\ndd\\nee';
      const pos = 5;
      const reason = 'reason';
      const err = new GrammarParseError(grammar.split('\\n').join('\n'), pos, reason);
      expect(err.message).toEqual([
        GRAMMAR_PARSER_ERROR_HEADER_MESSAGE(reason),
        '',
        'aa',
        'bb',
        'cc',
        ' ^',
      ].join('\n'));
    });
  });

  describe('InputParseError', () => {
    test('it renders a message', () => {
      const input = 'some input';
      const pos = 1;
      const err = new InputParseError(input.split('\\n').join('\n'), pos);
      expect(err.message).toEqual([
        INPUT_PARSER_ERROR_HEADER_MESSAGE,
        '',
        input,
        ' ^',
      ].join('\n'));
    });

    test('it renders a message for code point', () => {
      const pos = 0;
      const err = new InputParseError(97, pos);
      expect(err.message).toEqual([
        INPUT_PARSER_ERROR_HEADER_MESSAGE,
        '',
        'a',
        '^',
      ].join('\n'));
    });

    test('it renders a message for code points', () => {
      const pos = 2;
      const err = new InputParseError([97, 98, 99, 100], pos);
      expect(err.message).toEqual([
        INPUT_PARSER_ERROR_HEADER_MESSAGE,
        '',
        'abcd',
        '  ^',
      ].join('\n'));
    });
  });

});
