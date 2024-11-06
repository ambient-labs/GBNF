import {
  describe,
  test,
  expect,
  vi,
} from 'vitest';
import type * as _formatPython from './format-python.js';
import { formatTest } from './format-test.js';
import { formatPython } from './format-python.js';

vi.mock('./format-python.js', async () => {
  const actual = await vi.importActual<typeof _formatPython>('./format-python.js');
  return {
    ...actual,
    formatPython: vi.fn(),
  };
});

describe('formatTest', () => {
  test('it should format the test', async () => {
    expect(await formatTest('javascript', '  console.log("foo")')).toBe(`console.log('foo');\n`);
  });

  test('it should format the test', async () => {
    const code = 'def foo( ) :\n  print( "bar" )';
    expect(await formatTest('python', code)).toBe(formatPython(code));
    expect(formatPython).toHaveBeenCalledWith(code);
  });
});
