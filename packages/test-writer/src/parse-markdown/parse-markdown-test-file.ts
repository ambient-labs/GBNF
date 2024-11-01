// parse-markdown-test-file.ts
import { marked } from 'marked';
import { parseTestCases } from './parse-test-cases.js';

export const parseMarkdownTestFile = async (contents: string, testFile = '') => {
  const tokens = marked.lexer(contents);
  const testSuites: Record<string, any> = {};
  let currentSuiteName = '';
  let currentTestName = '';

  for (const token of tokens) {
    if (token.type === 'heading') {
      if (token.depth === 1) {
        currentSuiteName = token.text;
        testSuites[currentSuiteName] = {
          imports: {},
          tests: {},
        };
      } else if (token.depth === 2) {
        currentTestName = token.text;
        testSuites[currentSuiteName].tests[currentTestName] = {};
      }
    }

    if (token.type === 'code') {
      const lang = token.lang.split('.');
      if (lang[0] === 'imports') {
        testSuites[currentSuiteName].imports[lang[1]] = token.text;
      } else if (lang[0] === 'test_cases') {
        const RAW_STRING = '<!-- raw -->';

        const text = token.text;
        const raw = text.trim().startsWith(RAW_STRING);
        if (raw) {
          testSuites[currentSuiteName].tests[currentTestName].test_cases = text.split(RAW_STRING).pop()?.trim() as string;
        } else {
          testSuites[currentSuiteName].tests[currentTestName].test_cases = await parseTestCases(text, testFile);
        }

      } else if ([
        'test_cases_type',
        'test_body',
        'test_name',
        'test_body_args',
        'test_cases_names',
      ].includes(lang[0])) {
        if (!testSuites[currentSuiteName].tests[currentTestName]) {
          testSuites[currentSuiteName].tests[currentTestName] = {};
        }
        testSuites[currentSuiteName].tests[currentTestName][lang[0]] = {
          [lang[1]]: token.text,
        };
      } else {
        throw new Error(`Unknown key: "${lang[0]}" with text "${token.text}"`);
      }
    }
  }

  return testSuites;
};
