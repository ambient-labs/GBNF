import {
  describe,
  expect,
  test,
} from 'vitest';
import { getTestFilePath } from './get-test-file-path.js';

describe('getTestFilePath', () => {
  describe('javascript', () => {
    const language = 'javascript';
    test('returns the correct path', () => {
      expect(getTestFilePath('suite', language)).toBe('suite.test.ts');
    });

    test('replaces spaces with hyphens', () => {
      expect(getTestFilePath('suite name', language)).toBe('suite-name.test.ts');
    });

    test('replaces underscores with hyphens', () => {
      expect(getTestFilePath('suite_name', language)).toBe('suite-name.test.ts');
    });

    test('replaces multiple spaces with hyphens', () => {
      expect(getTestFilePath('suite   name   with   ______ spaces', language)).toBe('suite-name-with-spaces.test.ts');
    });
  });

  describe('python', () => {
    const language = 'python';
    test('returns the correct path', () => {
      expect(getTestFilePath('suite', language)).toBe('suite_test.py');
    });

    test('replaces spaces with underscores', () => {
      expect(getTestFilePath('suite name', language)).toBe('suite_name_test.py');
    });

    test('replaces hyphens with underscores', () => {
      expect(getTestFilePath('suite-name', language)).toBe('suite_name_test.py');
    });

    test('replaces multiple spaces with underscores', () => {
      expect(getTestFilePath('suite   name   with   ------- spaces', language)).toBe('suite_name_with_spaces_test.py');
    });
  });
});
