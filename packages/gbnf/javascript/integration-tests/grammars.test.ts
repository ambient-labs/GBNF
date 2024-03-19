import { describe, test, expect } from 'vitest';
import GBNF from '../src/index.js';
/**
 * For this test, we take the grammar files from llama.cpp, and for each one,
 * prompt llama.cpp with an appropriate prompt to generate sample output for some length n.
 * 
 * We then take each of those outputs and turn it into a test case. 
 * 
 * GBNF should correctly parse every test case for every grammar, since by definition they
 * are all valid outputs of the grammar parser implemented by llama.cpp.
 */
const grammars: Record<string, string> = import.meta.glob('./grammars/*.gbnf', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const grammarTestCases: Record<string, string[]> = import.meta.glob('./grammars/*.json', {
  eager: true,
  import: 'default',
});

const escape = (str: string) => str.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
const unescape = (str: string) => str.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
const getKeys = (obj: Record<string, any>) => Array.from(Object.keys(obj).map(key => {
  const parts = key.split('grammars/')[1].split('.');
  parts.pop();
  return parts.join('.');
}));
const keys = new Set([...getKeys(grammars), ...getKeys(grammarTestCases)]);
type TestDef = [string, string, string];
const testDefs: TestDef[] = [];
for (const key of keys) {
  const grammar = grammars[`./grammars/${key}.gbnf`];
  const testCases = grammarTestCases[`./grammars/${key}.json`];
  if (grammar && testCases) {
    for (const testCase of testCases) {
      const testDef: TestDef = [key, escape(testCase), escape(grammar)];
      testDefs.push(testDef);
    }
  }
}

describe('Grammars', () => {
  test.each(testDefs)(`%s %s`, (_, _testCase, grammar,) => {
    const testCase = unescape(_testCase);

    let state = GBNF(unescape(grammar));

    for (let i = 0; i < testCase.length; i++) {
      state = state.add(testCase[i]);
    }
  });
});
