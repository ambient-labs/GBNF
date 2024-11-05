import {
  describe,
  expect,
  test,
} from 'vitest';
import { getTestFilePath } from './get-test-file-path.js';

describe('getTestFilePath', () => {
  test('returns the correct path', () => {
    expect(getTestFilePath('suite', 'javascript')).toBe('suite.test.ts');
  });

  test('replaces spaces with hyphens', () => {
    expect(getTestFilePath('suite name', 'javascript')).toBe('suite-name.test.ts');
  });

  test('replaces underscores with hyphens', () => {
    expect(getTestFilePath('suite_name', 'javascript')).toBe('suite-name.test.ts');
  });

  test('replaces multiple spaces with hyphens', () => {
    expect(getTestFilePath('suite   name   with   ______ spaces', 'javascript')).toBe('suite-name-with-spaces.test.ts');
  });

  test('maintains file path', () => {
    expect(getTestFilePath('Path/To/Some/Suite', 'javascript')).toBe('Path/To/Some/Suite.test.ts');
  });
});
