# Validate Grammar

```imports.javascript
import GBNF, { GrammarParseError } from 'gbnf';
```

## It parses a grammar (%#): `%s`

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

```test_body.javascript
async ([_grammar, errorPos, errorReason]) => {
  const grammar = _grammar.trim().split('\\\\n').join('\\n');
  expect(() => {
    GBNF(grammar);
  }).toThrowError(new GrammarParseError(grammar, errorPos, errorReason));
}
```

