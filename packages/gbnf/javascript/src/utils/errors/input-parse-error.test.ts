import { describe, test, expect } from 'vitest';
import {
  INPUT_PARSER_ERROR_HEADER_MESSAGE,
  InputParseError,
} from './input-parse-error.js';

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
