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
  const grammar = grammars[`./grammars/${key}.gbnf`];
  const testCases = grammarTestCases[`./grammars/${key}.json`];
  if (grammar && testCases) {
    for (const testCase of testCases) {
      const testDef: TestDef = [key, escape(testCase), escape(grammar)];
      testDefs.push(testDef);
    }
  }
}
```

## (%#) It parses a known valid grammar `%s`

```test_cases
<% 
/*
const files = await glob('./grammars/**/*.json');
const results = await Promise.all(files.map(async filepath => {
  const grammarFile = filepath.split('/grammars/').pop().split('.').slice(0, -1).join('.');
  const [
    testCases,
    gbnfContents,
  ] = await Promise.all([
    JSON.parse(await readFile(`./grammars/${grammarFile}.json`)),
    readFile(`./grammars/${grammarFile}.gbnf`),
  ]);
  return testCases.map((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      const entry = `['${grammarFile}', '''# ${JSON.stringify(grammarFile)}
${gbnfContents}
''', '''${line}''']`;
      return entry;
    }
    return undefined;
  }).filter(Boolean);
}));
return results.reduce((acc, testCases) => {
  return acc.concat(testCases);
}, []).slice(224, 225).join('\n');
*/
%>
'"testDefs"'
```

```test_cases_type.javascript
[string, string, string][]
```

```test_body.javascript
async ([_, grammar, testCase]) => {
  let state = GBNF(grammar);

  for (let i = 0; i < testCase.length; i++) {
    state = state.add(testCase[i]);
  }
}
```

