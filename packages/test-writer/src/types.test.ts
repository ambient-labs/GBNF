import { describe, test, expect, afterEach, vi } from 'vitest';
import {
  isTestConfig,
  isTestConfigCollection,
  isSuiteConfig
} from './types';

describe('isTestConfig', () => {
  test('returns true for a valid test config', () => {
    expect(isTestConfig({ test_cases: [], test_body: { javascript: '' } })).toBe(true);
  });
  test('returns false for an invalid test config', () => {
    expect(isTestConfig({})).toBe(false);
  });
});

describe('isTestConfigCollection', () => {
  test('returns true for a valid test config collection', () => {
    expect(isTestConfigCollection({ foo: { test_cases: [], test_body: { javascript: '' } } })).toBe(true);
  });
  test('returns false for an invalid test config collection', () => {
    expect(isTestConfigCollection({ foo: {} })).toBe(false);
  });
});

describe('isSuiteConfig', () => {
  test('returns true for a valid suite config', () => {
    expect(isSuiteConfig({ tests: { 'foo': { test_cases: [], test_body: { javascript: '' } } } })).toBe(true);
  });
  test('returns true for a valid suite config with imports', () => {
    expect(isSuiteConfig({ imports: { javascript: ['import foo from "foo"'] }, tests: { 'foo': { test_cases: [], test_body: { javascript: '' } } } })).toBe(true);
  });
  test('returns false for an invalid suite config', () => {
    expect(isSuiteConfig({})).toBe(false);
    expect(isSuiteConfig({ tests: { foo: 'bar' } })).toBe(false);
  });
});
