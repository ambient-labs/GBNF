export interface TestConfig {
  test_cases: unknown[] | string;
  test_cases_type?: Record<string, string>;
  test_body?: Record<string, string>;
  test_name?: Record<string, string>;
  test_cases_names?: Record<string, string>;
  test_body_args?: Record<string, string>;
}

export type TestConfigCollection = Record<string, TestConfig>;

export type SuiteConfig = {
  imports?: Record<string, string>;
  tests: TestConfigCollection;
};
export type Language = 'javascript' | 'python';

const isObj = (config: unknown): config is Record<string, unknown> => typeof config === 'object' && config !== null;
export const isTestConfigCollection = (config: unknown): config is TestConfigCollection => isObj(config) && Object.values(config).every(isTestConfig);
export const isTestConfig = (config: unknown): config is TestConfig => isObj(config) && 'test_cases' in config && 'test_body' in config;
export const isSuiteConfig = (config: unknown): config is SuiteConfig => isObj(config) && 'tests' in config && isTestConfigCollection(config['tests']);
export const isLanguage = (language: unknown): language is Language => typeof language === 'string' && ['javascript', 'python',].includes(language);
export const isTestFiles = (testFiles: unknown): testFiles is string[] => Array.isArray(testFiles) && testFiles.every((file) => typeof file === 'string');
