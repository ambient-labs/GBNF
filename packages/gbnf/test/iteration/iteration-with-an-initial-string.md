```python
import json
import pytest
from gbnf import GBNF, RuleChar, RuleCharExclude, RuleEnd
```

```javascript
import { describe, test, expect } from 'vitest';
import GBNF, { RuleType } from 'gbnf';
```

# Iteration

```python cases
[
# single char rule
('root ::= "foo"', '', [
  { "type": 'char', "value": [ord('f')], },
]),
('root ::= "foo"', 'f', [
  { "type": 'char', "value": [ord('o')], },
]),
('root ::= "foo"', 'fo', [
  { "type": 'char', "value": [ord('o')], },
]),
('root ::= "foo"', 'foo', [
  { "type": 'end' },
]),

# two char rules
('root ::= "foo" | "bar" ', '', [
  { "type": 'char', "value": [ord('f')], },
  { "type": 'char', "value": [ord('b')], },
]),
('root ::= "foo" | "bar" ', 'f', [
  { "type": 'char', "value": [ord('o')], },
]),
('root ::= "foo" | "bar" ', 'fo', [
  { "type": 'char', "value": [ord('o')], },
]),
('root ::= "foo" | "bar" ', 'foo', [
  { "type": 'end' },
]),
('root ::= "foo" | "bar" ', 'b', [
  { "type": 'char', "value": [ord('a')], },
]),
('root ::= "foo" | "bar" ', 'ba', [
  { "type": 'char', "value": [ord('r')], },
]),
('root ::= "foo" | "bar" ', 'bar', [
  { "type": 'end' },
]),

# three char rules
('root ::= "foo" | "bar" | "baz"', 'ba', [
  { "type": 'char', "value": [ord('r')], },
  { "type": 'char', "value": [ord('z')], },
]),

# chars that shadow built-in characters
('root ::= "["', '[', [
  { "type": 'end' },
]),
('root ::= "]"', ']', [
  { "type": 'end' },
]),
('root ::= "[]"', '[]', [
  { "type": 'end' },
]),
('root ::= "{"', '{', [
  { "type": 'end' },
]),
('root ::= "}"', '}', [
  { "type": 'end' },
]),
('root ::= "{}"', '{}', [
  { "type": 'end' },
]),
('root ::= "[{}]"', '[{}]', [
  { "type": 'end' },
]),
# ('root ::= "[{\\"}]"', '[{"}]', [
#   { "type": 'end' },
# ]),

# char not
('root ::= [^f] "o"', '', [
  { "type": 'char_exclude', "value": [ord('f')], },
]),
('root ::= [^f] "o"', 'a', [
  { "type": 'char', "value": [ord('o')], },
]),
('root ::= [^A-Z]', '', [
  {
    "type": 'char_exclude', "value": [
      [
        ord('A'),
        ord('Z'),
      ],
    ],
  },
]),
('root ::= [^A-Z0-9]', '', [
  {
    "type": 'char_exclude', "value": [
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
]),
('root ::= [^A-Z0-9_-]', '', [
  {
    "type": 'char_exclude', "value": [
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
]),

# expressions
('''
root ::= foo
foo ::= "foo"''', '', [
  { "type": 'char', "value": [ord('f')], },
]),
('''root ::= foo
foo ::= "foo"
''', 'f', [
  { "type": 'char', "value": [ord('o')], },
]),
('''
root ::= foo
foo ::= "foo"
''', 'fo', [
  { "type": 'char', "value": [ord('o')], },
]),
(
'''root ::= foo
foo ::= "foo"''', 'foo', [
  { "type": 'end' },
]),
('''root ::= f
f ::= foo
foo ::= "foo"''', '', [
  { "type": 'char', "value": [ord('f')], },
]),

# expression and a char rule
('''
root ::= foo | "bar"
foo ::= "foo"
''', '', [
  { "type": 'char', "value": [ord('f')], },
  { "type": 'char', "value": [ord('b')], },
]),
(
  '''
root ::= foo | "bar"
foo ::= "foo"''', 'f', [
  { "type": 'char', "value": [ord('o')], },
]),
('''root ::= foo | "bar"
foo ::= "foo"''', 'fo', [
  { "type": 'char', "value": [ord('o')], },
]),
('''root ::= foo | "bar"
foo ::= "foo"''', 'foo', [
  { "type": 'end' },
]),
('''root ::= foo | "bar"
foo ::= "foo"''', 'b', [
  { "type": 'char', "value": [ord('a')], },
]),
('''root ::= foo | "bar"
foo ::= "foo"''', 'ba', [
  { "type": 'char', "value": [ord('r')], },
]),
('''root ::= foo | "bar"
foo ::= "foo"''', 'bar', [
  { "type": 'end' },
]),

# two expressions
('''
root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', '', [
  { "type": 'char', "value": [ord('f')], },
  { "type": 'char', "value": [ord('b')], },
]),
('''
root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', 'f', [
  { "type": 'char', "value": [ord('o')], },
]),
('''
root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', 'fo', [
  { "type": 'char', "value": [ord('o')], },
]),
('''
root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', 'foo', [
  { "type": 'end' },
]),
('''
root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', 'b', [
  { "type": 'char', "value": [ord('a')], },
]),
('''
root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', 'ba', [
  { "type": 'char', "value": [ord('r')], },
]),
('''
root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', 'bar', [
  { "type": 'end' },
]),

# nested expressions
('''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', '', [
  { "type": 'char', "value": [ord('f')], },
  { "type": 'char', "value": [ord('b')], },
]),
('''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'f', [
  { "type": 'char', "value": [ord('o')], },
]),
('''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'fo', [
  { "type": 'char', "value": [ord('o')], },
]),
('''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'foo', [
  { "type": 'end' },
]),
('''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'b', [
  { "type": 'char', "value": [ord('a')], },
]),
('''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'ba', [
  { "type": 'char', "value": [ord('r')], },
  { "type": 'char', "value": [ord('z')], },
]),
('''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'bar', [
  { "type": 'end' },
]),
('''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'baz', [
  { "type": 'end' },
]),

# ranges
('root ::= [a-z]', '', [
  { "type": 'char', "value": [[ord('a'), ord('z')]], },
]),
('root ::= [a-zA-Z]', '', [
  { "type": 'char', "value": [[ord('a'), ord('z')], [ord('A'), ord('Z')]], },
]),
('root ::= [a-z]', 'a', [
  { "type": 'end' },
]),
('root ::= [a-z]', 'm', [
  { "type": 'end' },
]),
('root ::= [a-z]', 'z', [
  { "type": 'end' },
]),
('root ::= [a-zA-Z]', 'a', [
  { "type": 'end' },
]),
('root ::= [a-zA-Z]', 'Z', [
  { "type": 'end' },
]),
('root ::= [a-zA-Z0-9]', 'Z', [
  { "type": 'end' },
]),
('root ::= [a-zA-Z0-9]', '0', [
  { "type": 'end' },
]),
('root ::= [a-zA-Z0-9]', '9', [
  { "type": 'end' },
]),

# range with ? modifier
('root ::= [a-z]?', '', [
  { "type": 'char', "value": [[ord('a'), ord('z')]], },
  { "type": 'end', },
]),
('root ::= [a-z]?', 'a', [
  { "type": 'end', },
]),
('root ::= [a-zA-Z]?', 'Z', [
  { "type": 'end', },
]),
('root ::= [a-zA-Z0-9]?', '0', [
  { "type": 'end', },
]),

# range with + modifier
('root ::= [a-z]+', '', [
  { "type": 'char', "value": [[ord('a'), ord('z')]], },
]),
('root ::= [a-z]+', 'l', [
  { "type": 'char', "value": [[ord('a'), ord('z')]], },
  { "type": 'end', },
]),
('root ::= [a-zA-Z]+', 'Z', [
  { "type": 'char', "value": [[ord('a'), ord('z')], [ord('A'), ord('Z')]], },
  { "type": 'end', },
]),
('root ::= [a-zA-Z]+', 'aZ', [
  { "type": 'char', "value": [[ord('a'), ord('z')], [ord('A'), ord('Z')]], },
  { "type": 'end', },
]),
('root ::= [a-zA-Z]+', 'azAZ', [
  { "type": 'char', "value": [[ord('a'), ord('z')], [ord('A'), ord('Z')]], },
  { "type": 'end', },
]),

# range with * modifier
('root ::= [a-z]*', '', [
  { "type": 'char', "value": [[ord('a'), ord('z')]], },
  { "type": 'end', },
]),
('root ::= [a-z]*', 'a', [
  { "type": 'char', "value": [[ord('a'), ord('z')]], },
  { "type": 'end', },
]),
('root ::= [a-zA-Z]+', 'Z', [
  { "type": 'char', "value": [[ord('a'), ord('z')], [ord('A'), ord('Z')]], },
  { "type": 'end', },
]),
('root ::= [a-zA-Z]+', 'abczABCZ', [
  { "type": 'char', "value": [[ord('a'), ord('z')], [ord('A'), ord('Z')]], },
  { "type": 'end', },
]),

# char not with modifiers
('root ::= [^f]+ "o"', 'aaa', [
  { "type": 'char_exclude', "value": [ord('f')], },
  { "type": 'char', "value": [ord('o')], },
]),
('root ::= [^A-Z]+', 'abc', [
  {
    "type": 'char_exclude', "value": [
      [
        ord('A'),
        ord('Z'),
      ],
    ],
  },
  { "type": 'end', },
]),
('root ::= [^A-Z0-9]*', 'abc', [
  {
    "type": 'char_exclude', "value": [
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
  { "type": 'end', },
]),
('root ::= [^A-Z0-9_-]*', 'abc', [
  {
    "type": 'char_exclude', "value": [
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
  { "type": 'end', },
]),

# real world bugs
(
  '''
root ::= [a-z] | xyx
xyx ::= "foo"''',
  'f', [
    { "type": 'end' },
    { "type": 'char', "value": [ord('o')], },
  ]
),
# "baz" and "bazaar" are ambiguous, and a string "bazaa" should not result in an 'a' CHAR rule
(
  'root ::= "foo" | "bar" | "baz" | "bazaar" | "barrington" ',
  'bazaa', [
    { "type": 'char', "value": [ord('r')], },
  ]
),
# should be able to step _into_ a rule, and then continue with the previous rule
(
  'root ::= ("bar" | "foo") "zyx"',
  'bar', [
    { "type": 'char', "value": [ord('z')], },
  ]
),
# should be able to process a rule, then step _into_ a rule, with a pointer to previous rule
(
  'root ::= "z" ("bar" | "foo") "zzzz"',
  'z', [
    { "type": 'char', "value": [ord('b')], },
    { "type": 'char', "value": [ord('f')], },
  ]
),
# should be able to process a rule, then step _into_ a rule, and then continue with the previous rule
(
  'root ::= "z" ("bar" | "foo") "zzz"',
  'zbar', [
    { "type": 'char', "value": [ord('z')], },
  ]
),
(
  '''
root  ::= termz ([-+*/] termz)* 
termz  ::= [0-9]+''',
  '1', [
    { "type": 'char', "value": [[ord('0'), ord('9')]], },
    {
      "type": 'char', "value": [
        ord('-'),
        ord('+'),
        ord('*'),
        ord('/'),
      ],
    },
    { "type": 'end', },
  ]
),
(
  '''
root  ::= expr "=" termy  
expr  ::= termy ([-+*/] termy)*
termy  ::= [0-9]+''',
  '1', [
    { "type": 'char', "value": [[ord('0'), ord('9')]], },
    {
      "type": 'char', "value": [
        ord('-'),
        ord('+'),
        ord('*'),
        ord('/'),
      ],
    },
    {
      "type": 'char', "value": [ord('='),],
    },
  ]
),
(
  '''
root  ::= (expr "=" terma "\n")+
expr  ::= terma ([-+*/] terma)*
terma  ::= [0-9]+''',
  '1', [
    { "type": 'char', "value": [[ord('0'), ord('9')]], },
    {
      "type": 'char', "value": [
        ord('-'),
        ord('+'),
        ord('*'),
        ord('/'),
      ],
    },
    {
      "type": 'char', "value": [ord('='),],
    },
  ]
),
(
  '''root  ::= (expr "=" termb "\n")+
expr  ::= termb ([-+*/] termb)*
termb  ::= [0-9]+''',
  '1+',
  [
    { "type": 'char', "value": [[ord('0'), ord('9')]], },
  ],
),
(
  '''
root  ::= (expr "=" termc "\n")+
expr  ::= termc ([-+*/] termc)*
termc  ::= [0-9]+''',
  '1=', [
    { "type": 'char', "value": [[ord('0'), ord('9')]], },
  ],
),
(
  '''root  ::= (expr "=" termd "\n")+
expr  ::= termd ([-+*/] termd)*
termd  ::= [0-9]+''',
  '1+1', [
    { "type": 'char', "value": [[ord('0'), ord('9')]], },
    { "type": 'char', "value": [ord('-'), ord('+'), ord('*'), ord('/')], },
    { "type": 'char', "value": [ord('=')], },
  ]
),
(
  '''root  ::= (expr "=" term "\n")+
expr  ::= term ([-+*/] term)*
term  ::= [0-9]+''',
  '1=1', [
    { "type": 'char', "value": [[ord('0'), ord('9')]], },
    { "type": 'char', "value": [ord('\n')], },
  ],
),
(
  '''root ::= "\\\"" ( [^\\\"abcdefghA-Z])* ''',
  '''"is not only in its lyrism, its vow to sustin it in its poo-sion, its r,v:l'y, it's tory,''',
  [
   {
     "type": 'char_exclude', "value": [
       ord('"'),
       ord('a'),
       ord('b'),
       ord('c'),
       ord('d'),
       ord('e'),
       ord('f'),
       ord('g'),
       ord('h'),
       [ord('A'), ord('Z')],
     ],
   },
   { "type": 'end', },
  ],
),
# sticking to llama.cpp's implementation, for a char_not rule _and_ a char rule
# side by side, _either_ is valid.
# that means that input explicitly forbidden by char_not can be allowed by the char
# rule.
# it seems weird. but it's the way it is.
# so below, anything in b-z is allowed, because of the second rule. Anything _not_ a-z is
# also allowed, because of the first rule. So really the only character disallowed is 'a'.
(
  'root ::= ( [^abcdefgh] | [b-z])* ',
  'bcdefghzyxw0123ABCZ',
  [
    {
      "type": 'char_exclude', "value": [
        ord('a'),
        ord('b'),
        ord('c'),
        ord('d'),
        ord('e'),
        ord('f'),
        ord('g'),
        ord('h'),
      ],
    },
    {
      "type": 'char', "value": [
        [ord('b'), ord('z')],
      ],
    },
    { "type": 'end', },

  ],
)
]
```

```javascript
test.for($cases as [
  string, 
  string, 
  { 
    type: string; 
    value: number[];
  }[]
][])('It returns parse state for a grammar and initial string (%#): `%s` `%s`', ([grammar, input, expected]) => {
  let state = GBNF(grammar);
  state = state.add(input);
  expect([...state]).toEqual(expected);
});
```


```python
@pytest.mark.parametrize(("grammar", "input_string", "expected"), $cases)
def test_it_returns_parse_state_for_grammar_and_initial_string(grammar, input_string, expected):
  def transformed_expected_dict(e: dict):
    if e['type'] == 'char':
      return RuleChar(e['value'])
    elif e['type'] == 'char_exclude':
      return RuleCharExclude(e['value'])
    elif e['type'] == 'end':
      return RuleEnd()
    else:
      raise Exception(f'Unknown type found in expectation array: {type}')
  state = GBNF(grammar)
  state = state + input_string
  state = [*state]
  expected = [transformed_expected_dict(e) for e in expected]
  state = sorted(state, key=lambda r: json.dumps(r.__dict__))
  expected = sorted(expected, key=lambda r: json.dumps(r.__dict__))
  assert state == expected
```
