# Validate Input

```imports.javascript
import GBNF, { InputParseError } from 'gbnf';
```

## It reports an error for an invalid input (%#): `%s`

```test_cases
['root ::= "foo"', '2', 0]
['root ::= "foo"', 'b', 0]
['root ::= "foo"', 'f1', 1]
['root ::= "foo"', 'fo1', 2]
['root ::= "foo"', 'fooo', 3]
['root ::= "foo"', 'fooooooo', 3]

['root ::= "foo" | "bar"', '1', 0]
['root ::= "foo" | "bar"', 'z', 0]
['root ::= "foo" | "bar"', 'f1', 1]
['root ::= "foo" | "bar"', 'b1', 1]
['root ::= "foo" | "bar"', 'fo1', 2]
['root ::= "foo" | "bar"', 'ba1', 2]
['root ::= "foo" | "bar"', 'fooo', 3]
['root ::= "foo" | "bar"', 'barrr', 3]

['root ::= "foo" | "bar" | "baz"', '1', 0]
['root ::= "foo" | "bar" | "baz"', 'z', 0]
['root ::= "foo" | "bar" | "baz"', 'f1', 1]
['root ::= "foo" | "bar" | "baz"', 'b1', 1]
['root ::= "foo" | "bar" | "baz"', 'fo1', 2]
['root ::= "foo" | "bar" | "baz"', 'bal', 2]
['root ::= "foo" | "bar" | "baz"', 'fooo', 3]
['root ::= "foo" | "bar" | "baz"', 'bazrr', 3]

['root ::= [^a]', 'a', 0]
['root ::= [^abc]', 'b', 0]
['root ::= [^a-z]', 'z', 0]
['root ::= [^a-zA-Z]', 'X', 0]
['root ::= [^a-zA-Z0-9]', '8', 0]
['''
root ::= foo
foo ::= "foo"''', '1', 0]

['''
root ::= foo
foo ::= "foo"''', 'b', 0]

['''
root ::= foo
foo ::= "foo"''', 'f1', 1]

['''
root ::= foo
foo ::= "foo"''', 'fo1', 2]

['''
root ::= foo
foo ::= "foo"''', 'fooo', 3]

['''
root::=foo|"bar"
foo::="foo"''', '1', 0]

['''
root::=foo|"bar"
foo::="foo"''', 'z', 0]

['''
root::=foo|"bar"
foo::="foo"''', 'f1', 1]

['''
root::=foo|"bar"
foo::="foo"''', 'b1', 1]

['''
root::=foo|"bar"
foo::="foo"''', 'fo1', 2]

['''
root::=foo|"bar"
foo::="foo"''', 'fooo', 3]

['''
root::=foo|"bar"
foo::="foo"''', 'barr', 3]

['''
root::= foo | bar
 foo::="foo"
 bar::="bar"''', '1', 0]
 
['''
root::= foo | bar
 foo::="foo"
 bar::="bar"''', 'z', 0]
 
['''
root::= foo | bar
 foo::="foo"
 bar::="bar"''', 'f1', 1]
 
['''
root::= foo | bar
 foo::="foo"
 bar::="bar"''', 'b1', 1]
 
['''
root::= foo | bar
 foo::="foo"
 bar::="bar"''', 'fo1', 2]
 
['''
root::= foo | bar
 foo::="foo"
 bar::="bar"''', 'fooo', 3]
 
['''
root::= foo | bar
 foo::="foo"
 bar::="bar"''', 'barr', 3]

['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"
''', '1', 0]


['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'z', 0]

['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'f1', 1]

['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'b1', 1]

['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'fo1', 2]

['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'fooo', 3]

['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'barr', 3]

['''
root ::= f | b
f ::= fo
b ::= ba
fo ::= foo
ba ::= bar | baz
foo ::= "foo"
bar ::= "bar"
baz ::= "baz"''', 'bazr', 3]

['root ::= [a-z]', 'A', 0]
['root ::= [a-z]', '0', 0]
['root ::= [a-z]', 'az', 1]
['root ::= [a-z]?', 'A', 0]
['root ::= [a-z]?', '0', 0]
['root ::= [a-z]?', 'az', 1]
['root ::= [a-z]+', 'A', 0]
['root ::= [a-z]+', '0', 0]
['root ::= [a-z]+', 'az0', 2]
['root ::= [a-z]*', 'A', 0]
['root ::= [a-z]*', '0', 0]
['root ::= [a-z]*', 'az0', 2]

# sticking to llama.cpp's implementation, for a char_not rule _and_ a char rule
# side by side, _either_ is valid.
# that means that input explicitly forbidden by char_not can be allowed by the char
# rule.
# it seems weird. but it's the way it is.
# so below, anything in b-z is allowed, because of the second rule. Anything _not_ a-z is
# also allowed, because of the first rule. So really the only character disallowed is 'a'.
['root ::= ( [^abcdefgh] | [b-z])*', 'a', 0]
```

```test_cases_type.javascript
[string, string, number][]
```

```test_body.javascript
async ([grammar, input, errorPos]) => {
  const error = new InputParseError(input, errorPos, '');
  // const grammar = _grammar.split('\\\\n').join('\\n');
  expect(() => {
    const graph = GBNF(grammar);
    graph.add(input);
  }).toThrowError(error);
}
```