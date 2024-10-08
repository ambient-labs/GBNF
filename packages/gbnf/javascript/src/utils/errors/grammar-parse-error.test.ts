import { describe, test, expect } from 'vitest';
import {
  GRAMMAR_PARSER_ERROR_HEADER_MESSAGE,
  GrammarParseError,
} from './grammar-parse-error.js';

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
