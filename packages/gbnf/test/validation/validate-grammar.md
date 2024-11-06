```python
import pytest
from gbnf import GBNF
```

```javascript
import { describe, test, expect } from 'vitest';
import GBNF, { GrammarParseError } from 'gbnf';
```

# Validate Grammar

```python cases_positive
[
  '''root ::= "foo"''',
  '''root ::= "foo" | "bar"''',
  '''root ::= ("foo" | "bar")''',
  '''root ::= ("foo" | "bar")?''',
  '''root ::= ("foo" | "bar")*''',
  '''root ::= ("foo" | "bar")+''',
  '''root ::= [a-z]''',
  '''root ::= [a-zA-Z]''',
  '''root ::= [a-zA-Z0-9]''',
  '''root ::= [a-zA-Z0-9]*''',
  '''root ::= [a-zA-Z0-9]?''',
  '''root ::= [a-zA-Z0-9]+''',
  '''root ::= ([a-zA-Z0-9])*''',
  '''root ::= ([a-zA-Z0-9])?''',
  '''root ::= ([a-zA-Z0-9])+''',
  '''
  root ::= foo
  foo ::= "foo"''',
  '''
  root ::= foo
  foo ::= "foo" | "bar" | ([a-z])?
  ''',
]
```

```javascript
test.for($cases_positive)('It parses a grammar (%#): `%s`', (grammar) => {
  expect(GBNF(grammar)).toBeTruthy();
});
```

```python
@pytest.mark.parameterize(("grammar"), $cases_positive)
def test_it_parses_a_grammar(grammar):
  graph = GBNF(grammar)
  assert graph
```


```python cases_negative
[
  ['', 0, 'No rules were found'],
  ['root = "foo"', 5, 'Expecting ::= at 5'],
  ['''root ::= foo
foo := "foo"
  ''', 17, 'Expecting ::= at 17'],
  ['root ::= foo', 9, 'Undefined rule identifier "foo"'],
  ['''root ::= foo
bar ::= "bar"
  ''', 9, 'Undefined rule identifier "foo"'],
  ['''root ::= foo
foo ::= baz
bar ::= "bar"
  ''', 21, 'Undefined rule identifier "baz"'],
  ['root ::= foo ::= bar', 13, 'Expecting newline or end at 13'],
  ['''root ::= ([a-z]
foo ::= "foo"
  ''', 20, "Expecting ')' at 20"],
]
```

```javascript
test.for($cases_negative as [string, number, string][])('It reports an error for an invalid grammar (%#): `%s`', ([grammar, errorPos, errorReason]) => {
  expect(() => {
    GBNF(grammar);
  }).toThrowError(new GrammarParseError(grammar, errorPos, errorReason));
});
```

```python
@pytest.mark.parameterize(("grammar", "error_pos", "error_reason"), $cases_negative)
def test_it_reports_an_error_for_an_invalid_grammar(grammar, error_pos, error_reason):
  graph = GBNF(grammar)
  with pytest.raises(InputParseError) as e:
    graph.add(input)

  assert e.input == input
  assert e.error_pos = error_pos
```
