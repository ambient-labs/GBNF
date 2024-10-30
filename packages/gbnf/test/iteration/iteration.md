# Iteration

```imports.javascript
import GBNF, { RuleType } from 'gbnf';
```

## It returns parse state for a grammar (%#): `%s`

```test_cases
# single char rule
['root ::= "foo"', [
  { "type": "char", "value": [ord('f')], },
]]

# two char rules
['root ::= "foo" | "bar" ', [
  { "type": "char", "value": [ord('f')], },
  { "type": "char", "value": [ord('b')], },
]]

# three char rules
['root ::= "foo" | "bar" | "gaz"', [
  { "type": "char", "value": [ord('f')], },
  { "type": "char", "value": [ord('b')], },
  { "type": "char", "value": [ord('g')], },
]]
['root ::= "foo" | "bar" | "baz"', [
  { "type": "char", "value": [ord('f')], },
  { "type": "char", "value": [ord('b')], },
]]

# char not
['root ::= [^x]', [
  { "type": "char_exclude", "value": [ord('x')], },
]]
['root ::= [^f] "o"', [
  { "type": "char_exclude", "value": [ord('f')], },
]]
['root ::= [^A-Z]', [
  {
    "type": "char_exclude", "value": [
      [
        ord('A'),
        ord('Z'),
      ],
    ],
  },
]]
['root ::= [^A-Z0-9]', [
  {
    "type": "char_exclude", "value": [
      [
        ord('A'),
        ord('Z'),
      ],
      [
        ord('0'),
        ord('9'),
      ],
    ],
  },
]]
['root ::= [^A-Z0-9_-]', [
  {
    "type": "char_exclude", "value": [
      [
        ord('A'),
        ord('Z'),
      ],
      [
        ord('0'),
        ord('9'),
      ],
      ord('_'),
      ord('-'),
    ],
  },
]]

# expressions
['''
root ::= foo
foo ::= "foo"
''', [
  { "type": "char", "value": [ord('f')], },
]]
['''
root ::= f
f ::= foo
foo ::= "foo"
''', [
  { "type": "char", "value": [ord('f')], },
]]

# expression and a char rule
['''
root ::= foo | "bar"
foo ::= "foo"''', [
  { "type": "char", "value": [ord('f')], },
  { "type": "char", "value": [ord('b')], },
]]

# two expressions
['''
root ::= foo | bar
foo ::= "foo"
bar ::= "bar"
''', [
  { "type": "char", "value": [ord('f')], },
  { "type": "char", "value": [ord('b')], },
]]

# nested expressions
['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"
''', [
  { "type": "char", "value": [ord('f')], },
  { "type": "char", "value": [ord('b')], },
]]

# ranges
['root ::= [a-z]', [
  { "type": "char", "value": [[ord('a'), ord('z')]], },
]]
['root ::= [a-zA-Z]', [
  { "type": "char", "value": [[ord('a'), ord('z')],[ord('A'), ord('Z')]], },
]]

# range with ? modifier
['root ::= [a-z]?', [
  { "type": "char", "value": [[ord('a'), ord('z')]], },
  { "type": "end", },
]]

# range with + modifier
['root ::= [a-z]+', [
  { "type": "char", "value": [[ord('a'), ord('z')]], },
]]

# range with * modifier
['root ::= [a-z]*', [
  { "type": "char", "value": [[ord('a'), ord('z')]], },
  { "type": "end", },
]]

# rules that aren't used are silently ignored
['''
root ::= "foo"
foo ::= "foo"''', [
  { "type": "char", "value": [ord('f')], },
]]

# real world use cases
# arithmetic
[
'''
root  ::= (expr "=" term "\\n")+
expr  ::= term ([-+*/] term)*
term  ::= [0-9]+
''', [
  { "type": 'char', "value": [[ord('0'), ord('9')]] },
]]
```

```test_cases_type.javascript
[string, { "type": string; "value": number[] }[]][]
```

```test_body.javascript
async ([grammar, expected]) => {
  let state = GBNF(grammar);
  expect([...state]).toEqual(expected);
}
```
