import {
  describe,
  test,
  expect,
} from 'vitest';

import { indent } from './indent.js';

describe('indent', () => {
  test('should indent a single line', () => {
    expect(indent('foo')).toEqual(['  foo']);
  });

  test('should indent multiple lines', () => {
    expect(indent(['foo', 'bar'])).toEqual(['  foo', '  bar']);
  });

  test('should indent a string with multiple lines', () => {
    expect(indent('foo\nbar')).toEqual(['  foo', '  bar']);
  });

  test('should indent a string with multiple lines and existing indentation', () => {
    expect(indent('  foo\n  bar\n    baz')).toEqual(['    foo', '    bar', '      baz']);
  });

  test('should indent a string a specific amount', () => {
    expect(indent('foo\nbar', 2, 2)).toEqual(['    foo', '    bar']);
  });
});
