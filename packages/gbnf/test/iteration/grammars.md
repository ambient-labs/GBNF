```python
import pytest
from gbnf import GBNF
```

```javascript
import { describe, test, expect } from 'vitest';
import GBNF from 'gbnf';

const unescape = (str: string) => str.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
```

# Grammars 

```javascript cases_three
Promise.all([
  'node:fs/promises',
  'path',
].map(pathName => import(pathName))).then(async ([
  { 
    glob: globPromise, 
    readFile: _readFile, 
  },
  path,
]) => {
  // console.log('yes!', path.resolve('../test/iteration/grammars'));
  const readFile = (filename) => _readFile(filename, 'utf-8');
  const glob = async (dir) => Array.fromAsync(globPromise(dir));
  const [grammars, grammarTestCases] = await Promise.all([
    glob(path.resolve('../test/iteration/grammars/*.gbnf')),
    glob(path.resolve('../test/iteration/grammars/*.json')),
  ]);
  // console.log(grammars);
  // console.log(grammarTestCases);
  if (grammars.length === 0) {
    throw new Error('No grammars found');
  }
  if (grammarTestCases.length === 0) {
    throw new Error('No grammar test cases found');
  }

  const obj = [
    ...grammars,
    ...grammarTestCases,
  ].reduce((acc, filepath) => {
    const filename = filepath.split('/').pop();
    const parts = filename.split('.');
    const ext = parts.pop();
    const key = parts.join('.');
    return {
      ...acc,
      [key]: {
        ...(acc[key]),
        [ext]: filepath,
      },
    };
  }, {});

  const escape = (str) => str.replace(/\n/g, '\\n').replace(/\t/g, '\\t');

  return (await Promise.all(Object.keys(obj).map((key) => {
    const { gbnf: grammarFilepath, json: testCasesFilepath } = obj[key];

    return Promise.all([
      key,
      readFile(grammarFilepath),
      readFile(testCasesFilepath),
    ]);
  }))).reduce((acc, [key, grammar, testCasesString]) => {
    console.log('key', key)
    const testCases = JSON.parse(testCasesString);
    if (grammar && testCases) {
      // console.log(testCases)
      return [
        ...acc,
        ...testCases.map(testCase => [key, escape(testCase), escape(grammar)]),
      ]
    }
    return acc;
  }, []);
});

```

```javascript
test.for($cases_three as [
  string,
  string,
  string,
][])('It parses a known valid grammar `%s`', async ([_, _testCase, grammar]) => {
  const testCase = unescape(_testCase);

  let state = GBNF(unescape(grammar));

  for (let i = 0; i < testCase.length; i++) {
    state = state.add(testCase[i]);
  }
});
```

