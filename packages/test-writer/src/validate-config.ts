import path from 'path';
import { getTestSuiteFileContent } from './get-test-suite-file-content.js';
import { writeFile } from './write-file.js';
import {
  isSuiteConfig,
  isTestConfig,
  isTestConfigCollection,
  SuiteConfig,
} from './types.js';

const validateObject = (obj: unknown): obj is object => {
  if (typeof obj !== 'object') {
    throw new Error(`Suite is not an object, it is ${typeof obj}`);
  }
  if (obj === null) {
    throw new Error(`Suite is null`);
  }
  if (Array.isArray(obj)) {
    throw new Error(`Suite is an array, it should be an object: ${JSON.stringify(obj, null, 2)}`);
  }
  return true;
}

export const validateSuiteConfig = (suiteConfig: unknown): suiteConfig is SuiteConfig => {
  if (!isSuiteConfig(suiteConfig)) {
    if (validateObject(suiteConfig)) {
      if (!('tests' in suiteConfig)) {
        throw new Error(`Suite is missing 'tests' property`);
      }
      const tests = suiteConfig['tests'];
      if (!isTestConfigCollection(tests)) {
        if (validateObject(tests)) {
          Object.entries(tests).forEach(([testName, testConfig]) => {
            if (!isTestConfig(testConfig)) {
              if (validateObject(testConfig)) {
                Object.entries(testConfig).forEach(([key, value]) => {
                  if (!('test_cases' in value)) {
                    throw new Error(`Test config "${testName}.${key}" is missing 'test_cases' property. Test config: ${JSON.stringify(value, null, 2)}`);
                  }
                  if (!('javascript' in value)) {
                    throw new Error(`Test config "${testName}.${key}" is missing 'javascript' property. Test config: ${JSON.stringify(value, null, 2)}`);
                  }
                })
              }
              throw new Error(`Test config "${testName}" is not a test config, but we don't know why: ${JSON.stringify(testConfig, null, 2)}`);
            }
          });
          throw new Error(`Suite 'tests' is not a test config collection, but we don't know why: ${JSON.stringify(suiteConfig['tests'], null, 2)}`);
        }
      }
    }
    throw new Error(`Suite failed validation, but we don't know why: ${JSON.stringify(suiteConfig, null, 2)}`);
  }
  return true;
};
