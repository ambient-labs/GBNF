import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  flatten,
} from './flatten.js';

describe('flatten', () => {
  test.each([
    [['foo', 'bar'], ['foo', 'bar']],
    [[['foo'], 'bar'], ['foo', 'bar']],
    [[['foo'], ['bar']], ['foo', 'bar']],
    [[[['foo']], [['bar']]], ['foo', 'bar']],
    [[[[['foo'], 'bar'], 'baz'], 'qux'], ['foo', 'bar', 'baz', 'qux']],
  ])('it flattens', (input, expectation) => {
    expect(flatten(input)).toEqual(expectation)
  });
});
