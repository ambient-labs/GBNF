import {
  describe,
  expect,
  test,
} from 'vitest';
import {
  getStringValue
} from './get-string-value';
import { CaseKind } from './types';

describe('getStringValue', () => {
  test.each([
    ['', '', 'default'],
    ['SELect', '"SELect"', 'default'],
    ['SELect', '"select"', 'lower'],
    ['SELect', '"SELECT"', 'upper'],
    [' foo  bar  ', '" foo  bar  "', 'default'],
    ['SELect', '[sS] [eE] [lL] [eE] [cC] [tT]', 'any'],
    ['-SELect-', '"-" [sS] [eE] [lL] [eE] [cC] [tT] "-"', 'any'],
    ['---SELect-', '"---" [sS] [eE] [lL] [eE] [cC] [tT] "-"', 'any'],
    ['---SEL---ect---', '"---" [sS] [eE] [lL] "---" [eE] [cC] [tT] "---"', 'any'],
    ['SEL\\nect', '"SEL\\nect"', 'default'],
    ['SEL\\n\\n\\nect', '"SEL\\n\\n\\nect"', 'default'],
  ] as [string, string, CaseKind][])(`'%s' should be '%s'`, (value, expectation, caseKind) => {
    expect(getStringValue(value.split('\\n').join('\n'), caseKind)).toBe(expectation);
  });
});
