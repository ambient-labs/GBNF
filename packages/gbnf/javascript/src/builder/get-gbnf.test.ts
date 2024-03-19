import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  _
} from './template-tags.js';
import {
  getGBNF
} from './get-gbnf.js';

describe('getGBNF', () => {
  test('it gets gbnf', () => {
    expect(getGBNF(
      ['foo '],
      ['bar ', 'baz'],
      { raw: true },
    )).toEqual('bar foo baz');
  });

  test('it gets gbnf if not raw', () => {
    expect(getGBNF(
      ['foo '],
      ['"bar" ', '"baz"'],
      { raw: true },
    )).toEqual('"bar" foo "baz"');
  });

  test('it gets equal number of rules and strings', () => {
    expect(getGBNF(
      ['foo ', 'qux'],
      ['bar ', 'baz '],
      { raw: true },
    )).toEqual('bar foo baz qux');
  });

  test.each([
    '?',
    '*',
    '+',
  ])('it wraps gbnf with "%s"', (wrapped) => {
    expect(getGBNF(
      ['foo '],
      ['bar ', 'baz'],
      { raw: true, wrapped, },
    )).toEqual(`(bar foo baz)${wrapped}`);
  });

  test('it gets separated gbnf', () => {
    expect(getGBNF(
      ['foo'],
      ['bar', 'baz'],
      { raw: true, separator: ' | ' },
    )).toEqual('bar | foo | baz');
  });

});
