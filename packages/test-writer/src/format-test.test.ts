import {
  describe,
  test,
  expect,
  vi,
} from 'vitest';
import type * as _formatPython from './format-python.js';
import type * as _formatJavascript from './format-javascript.js';
import { formatTest } from './format-test.js';
import { formatPython } from './format-python.js';
import { formatJavascript } from './format-javascript.js';

vi.mock('./format-javascript.js', async () => {
  const actual = await vi.importActual('./format-javascript.js') as typeof _formatJavascript;
  return {
    ...actual,
    formatJavascript: vi.fn(),
  };
});

vi.mock('./format-python.js', async () => {
  const actual = await vi.importActual('./format-python.js') as typeof _formatPython;
  return {
    ...actual,
    formatPython: vi.fn(),
  };
});

describe('formatTest', () => {
  test('it should format a javascript test', async () => {
    await formatTest('javascript', '  console.log("foo")', 'test.js');
    expect(formatJavascript).toHaveBeenCalledWith('  console.log("foo")');
  });

  test('it should format a python test', async () => {
    const code = 'def foo( ) :\n  print( "bar" )';
    await formatTest('python', code, 'test.py');
    expect(formatPython).toHaveBeenCalledWith(code);
  });
});
