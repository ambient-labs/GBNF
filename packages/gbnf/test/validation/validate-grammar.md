# Validate Grammar

```imports.javascript
import GBNF, { GrammarParseError } from 'gbnf';
```

```imports.python
import pytest
```

## It parses a grammar

```test_name.javascript
It parses a grammar (%#): `%s`
```

```test_name.python
it_parses_a_grammar
```

```test_cases
'''root ::= "foo"'''
'''root ::= "foo" | "bar"'''
'''root ::= ("foo" | "bar")'''
'''root ::= ("foo" | "bar")?'''
'''root ::= ("foo" | "bar")*'''
'''root ::= ("foo" | "bar")+'''
'''root ::= [a-z]'''
'''root ::= [a-zA-Z]'''
'''root ::= [a-zA-Z0-9]'''
'''root ::= [a-zA-Z0-9]*'''
'''root ::= [a-zA-Z0-9]?'''
'''root ::= [a-zA-Z0-9]+'''
'''root ::= ([a-zA-Z0-9])*'''
'''root ::= ([a-zA-Z0-9])?'''
'''root ::= ([a-zA-Z0-9])+'''
'''
root ::= foo
foo ::= "foo"'''
'''
root ::= foo
foo ::= "foo" | "bar" | ([a-z])?
'''
```

```test_cases_names.python
("grammar")
```

```test_body_args.python
(grammar)
```

```test_body.python
graph = GBNF(grammar)
assert graph
```

```test_body.javascript
(_grammar) => {
   const grammar = _grammar.trim().split('\\\\n').join('\\n');
  expect(GBNF(grammar)).toBeTruthy();
}
```


## It reports an error for an invalid grammar (%#): `%s`

```test_cases
['', 0, 'No rules were found']
['root = "foo"', 5, 'Expecting ::= at 5']
['''
root ::= foo
foo := "foo"
''', 17, 'Expecting ::= at 17']
['root ::= foo', 9, 'Undefined rule identifier "foo"']
['''
root ::= foo
bar ::= "bar"
''', 9, 'Undefined rule identifier "foo"']
['''
root ::= foo
foo ::= baz
bar ::= "bar"
''', 21, 'Undefined rule identifier "baz"']
['root ::= foo ::= bar', 13, 'Expecting newline or end at 13']
['''
root ::= ([a-z]
foo ::= "foo"
''', 20, "Expecting ')' at 20"]
```

```test_cases_type.javascript
[string, number, string][]
```

```test_cases_type.python
(grammar, error_pos, error_reason)
```


```test_body.python
graph = GBNF(grammar)
with pytest.raises(InputParseError) as e:
  graph.add(input)

assert e.input == input
assert e.error_pos = error_pos
```

```test_body.javascript
async ([_grammar, errorPos, errorReason]) => {
  const grammar = _grammar.trim().split('\\\\n').join('\\n');
  expect(() => {
    GBNF(grammar);
  }).toThrowError(new GrammarParseError(grammar, errorPos, errorReason));
}
```
