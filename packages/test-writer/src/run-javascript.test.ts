import {
  describe,
  test,
  expect,
  // vi,
  // afterEach,
} from 'vitest';
import { runJavascript } from './run-javascript.js';

describe('runJavascript', () => {
  test('should return the result of the script', async () => {
    const result = await runJavascript('1 + 1');
    expect(result).toBe(2);
  });

  test('should use dynamic imports', async () => {
    const result = await runJavascript(`import("node:fs").then(({readFile}) => typeof readFile)`);
    expect(result).toBe('function');
  });
});
