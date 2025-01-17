```python
import json
import pytest
from gbnf import GBNF, InputParseError, RuleChar, RuleCharExclude, RuleEnd
```

```javascript
import { describe, test, expect } from 'vitest';
import GBNF, {
  RuleType,
  InputParseError,
} from 'gbnf';
```

# Iteration

```python cases_one
[
# single char rule
['root ::= "foo"', 'f', '1'],
['root ::= "foo"', 'f', 'b'],
['root ::= "foo"', 'f', 'o1'],
['root ::= "foo"', 'f', 'ooo'],
['root ::= "foo"', 'f', 'ooooooo'],

# two char rules
['root ::= "foo" | "bar"', 'f', '1'],
['root ::= "foo" | "bar"', 'b', '1'],
['root ::= "foo" | "bar"', 'f', 'o1'],
['root ::= "foo" | "bar"', 'b', 'a1'],
['root ::= "foo" | "bar"', 'f', 'ooo'],
['root ::= "foo" | "bar"', 'b', 'arrr'],

# three char rules
['root ::= "foo" | "bar" | "baz"', 'f', '1'],
['root ::= "foo" | "bar" | "baz"', 'f', 'z'],
['root ::= "foo" | "bar" | "baz"', 'b', 'b1'],
['root ::= "foo" | "bar" | "baz"', 'f', 'o1'],
['root ::= "foo" | "bar" | "baz"', 'b', 'al'],
['root ::= "foo" | "bar" | "baz"', 'f', 'ooo'],
['root ::= "foo" | "bar" | "baz"', 'b', 'azrr'],

# expressions
['''root ::= foo
foo ::="foo"''', 'f', '1'],
['''root ::= foo
foo ::="foo"''', 'f', 'b'],
['''root ::= foo
foo ::="foo"''', 'f', 'o1'],
['''root ::= foo
foo ::="foo"''', 'f', 'ooo'],

# expression and a char rule
['''root::=foo|"bar"
foo::="foo"''', 'f', '1'],
['''root::=foo|"bar"
foo::="foo"''', 'f', 'z'],
['''root::=foo|"bar"
foo::="foo"''', 'b', 'b1'],
['''root::=foo|"bar"
foo::="foo"''', 'f', 'o1'],
['''root::=foo|"bar"
foo::="foo"''', 'f', 'ooo'],
['''root::=foo|"bar"
foo::="foo"''', 'b', 'arr'],

# two expressions
['''root::= foo | bar
 foo::="foo"
 bar::="bar"''', 'f', '1'],
['''root::= foo | bar
 foo::="foo"
 bar::="bar"''', 'f', 'z'],
['''root::= foo | bar
 foo::="foo"
 bar::="bar"''', 'b', '1'],
['''root::= foo | bar
 foo::="foo"
 bar::="bar"''', 'f', 'o1'],
['''root::= foo | bar
 foo::="foo"
 bar::="bar"''', 'f', 'ooo'],
['''root::= foo | bar
 foo::="foo"
 bar::="bar"''', 'b', 'arr'],

# nested expressions
['''root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'f', '1'],
['''root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'f', 'z'],
['''root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'b', '1'],
['''root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'f', 'o1'],
['''root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'f', 'ooo'],
['''root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'b', 'arr'],
['''root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'b', 'azr'],

# ranges
['root ::= [a-z]', 'a', 'A'],
['root ::= [a-z]', 'a', '0'],
['root ::= [a-z]', 'a', 'az'],

# range with ? modifier
['root ::= [a-z]?', 'a', 'A'],
['root ::= [a-z]?', 'a', '0'],
['root ::= [a-z]?', 'a', 'az'],

# range with + modifier
['root ::= [a-z]+', 'a', 'A'],
['root ::= [a-z]+', 'a', '0'],
['root ::= [a-z]+', 'a', 'z0'],

# range with * modifier
['root ::= [a-z]*', 'a', 'A'],
['root ::= [a-z]*', 'a', '0'],
['root ::= [a-z]*', 'a', 'z0']
]
```

```javascript
test.for($cases_one as [
  string, 
  string, 
  string,
][])('(%#) It throws if encountering a grammar `%s` with starting `%s` and additional `%s`', ([grammar, starting, additional]) => {
  const graph = GBNF(grammar, starting);
  expect(() => {
    graph.add(additional);
  }).toThrow();
});
```

```python
@pytest.mark.parametrize(("grammar", "starting", "additional"), $cases_one)
def test_it_raises_if_encountering_grammar_with_starting_s_and_additional_s(grammar, starting, additional):
  state = GBNF(grammar, starting)
  with pytest.raises(InputParseError) as e:
    state + additional
```

```python cases_two
# single char rule
[
['root ::= "foo"', '', 'f', [
  { "type": "char", "value": [ord('o')], },
]],
['root ::= "foo"', 'f', 'o', [
  { "type": "char", "value": [ord('o')], },
]],
['root ::= "foo"', 'fo', 'o', [
  { "type": "end" },
]],

# two char rules
['root ::= "foo" | "bar" ', '', 'f', [
  { "type": "char", "value": [ord('o')], },
]],
['root ::= "foo" | "bar" ', 'f', 'o', [
  { "type": "char", "value": [ord('o')], },
]],
['root ::= "foo" | "bar" ', 'fo', 'o', [
  { "type": "end" },
]],
['root ::= "foo" | "bar" ', '', 'b', [
  { "type": "char", "value": [ord('a')], },
]],
['root ::= "foo" | "bar" ', 'b', 'a', [
  { "type": "char", "value": [ord('r')], },
]],
['root ::= "foo" | "bar" ', 'ba', 'r', [
  { "type": "end" },
]],

# three char rules
['root ::= "foo" | "bar" | "baz"', 'b', 'a', [
  { "type": "char", "value": [ord('r')], },
  { "type": "char", "value": [ord('z')], },
]],

# char not
['root ::= [^f] "o"', 'g', 'o', [
  { "type": "end" },
]],
['root ::= [^A-Z]', '', 'a', [
  { "type": "end" },
]],
['root ::= [^A-Z0-9]', '', 'a', [
  { "type": "end" },
]],
['root ::= [^A-Z0-9_-]', '', 'a', [
  { "type": "end" },
]],

# expressions
['''root ::= foo
foo ::= "foo"''', '', 'f', [
  { "type": "char", "value": [ord('o')], },
]],
['''root ::= foo
foo ::= "foo"''', 'f', 'o', [
  { "type": "char", "value": [ord('o')], },
]],
['''root ::= foo
foo ::= "foo"''', 'fo', 'o', [
  { "type": "end" },
]],

# expression and a char rule
['''root ::= foo | "bar"
foo ::= "foo"''', '', 'f', [
  { "type": "char", "value": [ord('o')], },
]],
['''root ::= foo | "bar"
foo ::= "foo"''', 'f', 'o', [
  { "type": "char", "value": [ord('o')], },
]],
['''root ::= foo | "bar"
foo ::= "foo"''', 'fo', 'o', [
  { "type": "end" },
]],
['''root ::= foo | "bar"
foo ::= "foo"''', '', 'b', [
  { "type": "char", "value": [ord('a')], },
]],
['''root ::= foo | "bar"
foo ::= "foo"''', 'b', 'a', [
  { "type": "char", "value": [ord('r')], },
]],
['''root ::= foo | "bar"
foo ::= "foo"''', 'ba', 'r', [
  { "type": "end" },
]],

# two expressions
['''root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', '', 'f', [
  { "type": "char", "value": [ord('o')], },
]],
['''
root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', 'f', 'o', [
  { "type": "char", "value": [ord('o')], },
]],
['''
root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', 'fo', 'o', [
  { "type": "end" },
]],
['''root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', '', 'b', [
  { "type": "char", "value": [ord('a')], },
]],
['''root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', 'b', 'a', [
  { "type": "char", "value": [ord('r')], },
]],
['''root ::= foo | bar
foo ::= "foo"
bar ::= "bar"''', 'ba', 'r', [
  { "type": "end" },
]],

# nested expressions
['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', '', 'f', [
  { "type": "char", "value": [ord('o')], },
]],
['''root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'f', 'o', [
  { "type": "char", "value": [ord('o')], },
]],
['''root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'fo', 'o', [
  { "type": "end" },
]],
['''root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', '', 'b', [
  { "type": "char", "value": [ord('a')], },
]],
['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'b', 'a', [
  { "type": "char", "value": [ord('r')], },
  { "type": "char", "value": [ord('z')], },
]],
['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'ba', 'r', [
  { "type": "end" },
]],
['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'ba', 'z', [
  { "type": "end" },
]],

# ranges
['root ::= [a-z]', '', 'a', [
  { "type": "end" },
]],
['root ::= [a-z]', '', 'm', [
  { "type": "end" },
]],
['root ::= [a-z]', '', 'z', [
  { "type": "end" },
]],
['root ::= [a-zA-Z]', '', 'a', [
  { "type": "end" },
]],
['root ::= [a-zA-Z]', '', 'Z', [
  { "type": "end" },
]],
['root ::= [a-zA-Z0-9]', '', 'Z', [
  { "type": "end" },
]],
['root ::= [a-zA-Z0-9]', '', '0', [
  { "type": "end" },
]],
['root ::= [a-zA-Z0-9]', '', '9', [
  { "type": "end" },
]],

# range with ? modifier
['root ::= [a-z]?', '', 'a', [
  { "type": "end", },
]],
['root ::= [a-zA-Z]?', '', 'Z', [
  { "type": "end", },
]],
['root ::= [a-zA-Z0-9]?', '', '0', [
  { "type": "end", },
]],

# range with + modifier
['root ::= [a-z]+', '', 'a', [
  { "type": "char", "value": [[ord('a'), ord('z')]], },
  { "type": "end", },
]],
['root ::= [a-zA-Z]+', '', 'Z', [
  { "type": "char", "value": [[ord('a'), ord('z')], [ord('A'), ord('Z')]], },
  { "type": "end", },
]],
['root ::= [a-zA-Z]+', 'azA', 'Z', [
  { "type": "char", "value": [[ord('a'), ord('z')], [ord('A'), ord('Z')]], },
  { "type": "end", },
]],

# range with * modifier
['root ::= [a-z]*', '', 'a', [
  { "type": "char", "value": [[ord('a'), ord('z')]], },
  { "type": "end", },
]],
['root ::= [a-zA-Z]+', '', 'Z', [
  { "type": "char", "value": [[ord('a'), ord('z')], [ord('A'), ord('Z')]], },
  { "type": "end", },
]],
['root ::= [a-zA-Z]+', 'acczABC', 'Z', [
  { "type": "char", "value": [[ord('a'), ord('z')], [ord('A'), ord('Z')]], },
  { "type": "end", },
]],
['root ::= "foo" | "bar" | "baz" | "bazaar" | "barrington" ', 'baza', 'a', [
  { "type": "char", "value": [ord('r')], },
]],

# char not with modifiers
['root ::= [^f]+ "o"', 'aaa', 'a', [
  { "type": "char_exclude", "value": [ord('f')], },
  { "type": "char", "value": [ord('o')], },
]],
['root ::= [^A-Z]+', 'abc', 'd', [
  {
    "type": "char_exclude", "value": [
      [
        ord('A'),
        ord('Z'),
      ],
    ],
  },
  { "type": "end", },
]],
['root ::= [^A-Z0-9]*', 'abc', 'd', [
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
  { "type": "end", },
]],
['root ::= [^A-Z0-9_-]*', 'abc', 'd', [
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
  { "type": "end", },
]],
]
```


```javascript
test.for($cases_two as [
  string, 
  string, 
  string,
  { "type": string; "value": number[] }[],
][])('(%#) It parses a grammar `%s` with starting `%s` and additional `%s`', async ([grammar, starting, additional, expected]) => {
    let state = GBNF(grammar, starting);
    state = state.add(additional);
    expect([...state]).toEqual(expected);
});
```

```python
@pytest.mark.parametrize(("grammar", "starting", "additional", "expected"), $cases_two)
def test_it_parses_a_grammar_with_starting_and_additional(grammar, starting, additional, expected):
  def transformed_expected_dict(e: dict):
    if e['type'] == 'char':
      return RuleChar(e['value'])
    elif e['type'] == 'char_exclude':
      return RuleCharExclude(e['value'])
    elif e['type'] == 'end':
      return RuleEnd()
    else:
      raise Exception(f'Unknown type found in expectation array: {type}')
  state = GBNF(grammar, starting)
  state = state + additional
  expected = [transformed_expected_dict(e) for e in expected]
  state = sorted(state, key=lambda r: json.dumps(r.__dict__))
  expected = sorted(expected, key=lambda r: json.dumps(r.__dict__))
  assert state == expected
```

```python cases_three
[
  False,
  True
]
```

```javascript
test.for($cases_three as boolean[])('(%#) It throws a particular error', async (errorForMostRecentInput) => {
  const grammar = 'root ::= "bar"';
  let state = GBNF(grammar);
  state = state.add('b');
  state = state.add('a')
  try {
    state.add('z');
    throw new Error('Expected an error to be thrown');
  } catch (err) {
    if (!(err instanceof InputParseError)) {
      throw new Error('Expected an error of type InputParseError to be thrown');
    }
    const expectedErr = new InputParseError('z', 0, 'ba');
    if (errorForMostRecentInput) {
      expect(err.errorForMostRecentInput).toEqual(expectedErr.errorForMostRecentInput);
    } else {
      expect(err.message).toEqual(expectedErr.message);
    }
  }
});
```

```python
@pytest.mark.parametrize(("error_for_most_recent_input"), $cases_three)
def test_it_raises_a_particular_error(error_for_most_recent_input):
  grammar = 'root ::= "bar"'
  state = GBNF(grammar)
  state = state.add('b')
  state = state.add('a')
  with pytest.raises(InputParseError) as e:
    state.add('z')
  err = e.value
  expected_error = InputParseError('z', 0, 'ba')
  if error_for_most_recent_input:
    assert err.error_for_most_recent_input == expected_error.error_for_most_recent_input
  else:
    assert str(err) == str(expected_error)
```
