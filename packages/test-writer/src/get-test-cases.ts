import type { Language } from './types.js';

export const getTestCases = (language: Language, testCases: unknown[], testCasesType: Record<string, string> = {}) => {
  if (language === 'javascript') {
    return `${JSON.stringify(testCases)}${testCasesType[language] ? ` as ${testCasesType[language]}` : ''}`;
  }

  return JSON.stringify(testCases, null, 2);
};
