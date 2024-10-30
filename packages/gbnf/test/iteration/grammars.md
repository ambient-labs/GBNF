# Grammars 

```imports.javascript
import GBNF from 'gbnf';

const grammars: Record<string, string> = import.meta.glob('../../../test/iteration/grammars/*.gbnf', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const grammarTestCases: Record<string, string[]> = import.meta.glob('../../../test/iteration/grammars/*.json', {
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
  const grammar = grammars[`../../../test/iteration/grammars/${key}.gbnf`];
  const testCases = grammarTestCases[`../../../test/iteration/grammars/${key}.json`];
  if (grammar && testCases) {
    for (const testCase of testCases) {
      const testDef: TestDef = [key, escape(testCase), escape(grammar)];
      testDefs.push(testDef);
    }
  }
}
if (testDefs.length === 0) {
  throw new Error('Failed to build test definitions');
}
```

## (%#) It parses a known valid grammar `%s`

```test_cases
<!-- raw -->
testDefs
```

```test_body.javascript
async ([_, _testCase, grammar]) => {
  const testCase = unescape(_testCase);

  let state = GBNF(unescape(grammar));

  for (let i = 0; i < testCase.length; i++) {
    state = state.add(testCase[i]);
  }
}
```

