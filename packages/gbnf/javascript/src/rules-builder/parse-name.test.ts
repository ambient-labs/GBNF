import {
  describe,
  test,
  expect,
} from 'vitest';
import { GrammarParseError } from '../utils/errors.js';
import {
  GET_INVALID_CHAR_ERROR,
  PARSE_NAME_ERROR,
  parseName
} from './parse-name.js';

describe('parseName', () => {
  test.each([
    'v',
    'valid',
    'valid-name',
    'valid-name-foo',
    'validName',
    'validName-foo',
  ])('should return correct position when encountering a valid name "%s"', (src) => {
    const name = parseName(src, 0);
    expect(name).toEqual(src);
  });

  test.each([
    ['123valid', 3, 'valid'],
    ['123valid-name', 3, 'valid-name'],
    ['123valid _Name', 3, 'valid'],
    ['123valid\\n_Name', 3, 'valid'],
    ['123valid\\t_Name', 3, 'valid'],
    ['123valid\\r_Name', 3, 'valid'],
  ])('should return correct position when encountering a valid name "%s" starting at a non-zero position', (src, position, expectation) => {
    const name = parseName(src.split('\\n').join('\n'), position);
    expect(name).toEqual(expectation);
  });

  test.each([
    ['123', new GrammarParseError('123', 0, PARSE_NAME_ERROR)],
    ['valid_name', new GrammarParseError('valid_name', 5, GET_INVALID_CHAR_ERROR('_'))],
    ['valid123', new GrammarParseError('valid123', 5, GET_INVALID_CHAR_ERROR('1'))],
    // ['validName', new GrammarParseError('validName', 5, GET_INVALID_CHAR_ERROR('N'))],
  ])('should throw an error when encountering an invalid name "%s"', (src, error) => {
    expect(() => {
      parseName(src, 0);
    }).toThrow(error);
  });
});
