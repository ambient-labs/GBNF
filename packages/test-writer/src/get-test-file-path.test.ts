import {
  describe,
  expect,
  test,
} from 'vitest';
import { getTestFilePath } from './get-test-file-path.js';

describe('getTestFilePath', () => {
  test('returns the correct path', () => {
    expect(getTestFilePath('Suite', 'targetDir')).toBe('targetDir/suite.test.ts');
  });

  test('replaces spaces with hyphens', () => {
    expect(getTestFilePath('Suite Name', 'targetDir')).toBe('targetDir/suite-name.test.ts');
  });

  test('converts to lowercase', () => {
    expect(getTestFilePath('SUITE NAME', 'targetDir')).toBe('targetDir/suite-name.test.ts');
  });

  test('replaces underscores with hyphens', () => {
    expect(getTestFilePath('SUITE_NAME', 'targetDir')).toBe('targetDir/suite-name.test.ts');
  });

  test('replaces multiple spaces with hyphens', () => {
    expect(getTestFilePath('SUITE   NAME   WITH   ______ SPACES', 'targetDir')).toBe('targetDir/suite-name-with-spaces.test.ts');
  });
});
