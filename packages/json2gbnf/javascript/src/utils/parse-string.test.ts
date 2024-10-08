import { describe, it, expect, test } from 'vitest';
import { parseString } from './parse-string.js';
import GBNF, {
  InputParseError
} from 'gbnf';
import {
  g,
} from 'gbnf/builder';
import { getInputAsCodePoints } from '../../../../gbnf/javascript/src/grammar-graph/get-input-as-code-points.js';

describe('parseString', () => {
  test.each([
    [{}, 'foo',],
    [{
      minLength: 2,
    }, 'fo',],
    [{
      minLength: 2,
    }, 'fooooo',],
    [{
      maxLength: 2,
    }, 'f',],
    [{
      maxLength: 2,
    }, 'fo',],
    [{
      minLength: 0,
    }, '',],
    [{
      maxLength: 0,
    }, '',],
    [{
      minLength: 2,
      maxLength: 2,
    }, 'fo',],
    [{
      minLength: 2,
      maxLength: 5,
    }, 'fo',],
    [{
      minLength: 2,
      maxLength: 5,
    }, 'foo',],
    [{
      minLength: 2,
      maxLength: 5,
    }, 'foooo',],

  ])(`should process schema '%s' and initial string '%s'`, (schema, initial) => {
    expect(() => {
      const grammar = parseString({
        type: 'string',
        ...schema,
      }).toString();
      return GBNF(
        grammar,
        JSON.stringify(initial),
      );
    }).not.toThrow();
  });

  test.each([
    ['pattern is defined', { pattern: '^[a-z]+$', }, 'pattern is not supported',],
    ['format is defined', { format: 'email' }, 'format is not supported'],
    ['minLength is greater than maxLength', { minLength: 5, maxLength: 3 }, 'minLength must be less than or equal to maxLength'],
  ])('should throw an error when %s', (_s, schema, error) => {
    expect(() => parseString({
      type: 'string',
      ...schema,
    })).toThrowError(error);
  });

  test.each([
    [{ minLength: 2, maxLength: 3 }, `f`, 2],
    [{ minLength: 2, maxLength: 4 }, `foooo'`, 5],
  ])('should throw an error when %s', (schema, _initial, errorPos) => {
    const initial = JSON.stringify(_initial);
    const error = new InputParseError(initial, errorPos);
    expect(() => {
      const grammar = g`${parseString({
        type: 'string',
        ...schema,
      })} `;
      return GBNF(grammar, initial,
      );
    }).toThrowError(error);
  });

});
