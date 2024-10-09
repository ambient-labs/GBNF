---
title: 'Iteration'
order: 3
---

`gbnf` offers a set of rules for describing the valid next characters for a state representing a given GBNF grammar and input. These rules can be used to constrain the possible set of tokens an LLM may produce.

## Iterating through input rules

The output of `GBNF` is a state object, representing the given grammar and any input provided so far. Iterating through it will produce [a set of rules](#rule-types).

```javascript
import GBNF from 'gbnf'
const grammar = GBNF(`root ::= "foo" | "bar" | "baz"`)
for (const rule of grammar) {
  console.log(rule)
}
```

[`value` can be a code point or a range of code points.](#input-rule-types)

To update the state, call `add` with a new string; the resultant set of rules will reflect the new state:

```javascript
import GBNF from 'gbnf'
let state = GBNF(`root ::= "foo" | "bar" | "baz"`)
state = state('ba') // this is identical to `state.add('ba')`
for (const rule of state) {
  console.log(rule)
}
```

An invalid string will raise an error:

```javascript
import GBNF from 'gbnf'
let state = GBNF(`root ::= "foo" | "bar" | "baz"`)
state = state('baf')
```

## Input rule types

Rules can have one of the following three types:

- [Iterating through input rules](#iterating-through-input-rules)
- [Input rule types](#input-rule-types)
  - [`CHAR`](#char)
  - [`CHAR_EXCLUDE`](#char_exclude)
  - [`END`](#end)

### `CHAR`

`CHAR` rules define valid next characters.

The type definition of a `CHAR` rule is:

```typescript
{
  type: RuleType.CHAR;
  value: (number | [number, number])[];
}
```

`value` can either be a single number (denoting a single codepoint), or a range (two numbers, inclusive, denoting a range of code points.)

Code points can be translated back into characters with:

```javascript
String.fromCodePoint(codePoint)
```

`CHAR` rules are generated from GBNF like:

```gbnf
root ::= "foo"
```

Or, for ranges:

```gbnf
root ::= [a-z]
```

### `CHAR_EXCLUDE`

`CHAR_EXCLUDE` rules define invalid next characters.

The type definition of a `CHAR_EXCLUDE` rule is:

```typescript
{
  type: RuleType.CHAR_EXCLUDE;
  value: (number | [number, number])[];
}
```

`value` can either be a single number (denoting a single codepoint), or a range (two numbers, inclusive, denoting a range of code points.)

Code points can be translated back into characters with:

```javascript
String.fromCodePoint(codePoint)
```

`CHAR_EXCLUDE` rules are generated from GBNF like:

```gbnf
root ::= ^[a-f]
```

**NOTE**
It can be possible to receive both `CHAR` and `CHAR_EXCLUDE` rules. Consider the following grammar:

```gbnf
root ::= ("bar") | ("ba" ^r)
```

Input `ba` would produce the following two valid rules:

```javascript
[
  {
    type: RuleType.CHAR,
    value: "r".codePointAt(0),
  },
  {
    type: RuleType.CHAR_EXCLUDE,
    value: "r".codePointAt(0),
  }
]
```

It is up to you how to interpret this.

### `END`

An `END` rule defines a valid stopping point.

The type definition of an `END` rule is:

```typescript
{
  type: RuleType.END;
}
```


`END` rules are generated from the end of a grammar. For example:

```javascript
import GBNF from 'gbnf'
const grammar = GBNF(`root ::= "foo"`, "foo")
console.log([...grammar])
```

Will produce an end rule.

More commonly, an `END` rule will appear alongside an array of valid other rules:

```javascript
import GBNF from 'gbnf'
const grammar = GBNF(`
# a list of characters separated by commas
root ::= any_character ("," any_character)*
any_character ::= [a-z]
`)
grammar.add('a,b,c')
console.log([...grammar])
```

Here, we will receive an END rule as well as a "comma" rule.

**NOTE**
The above example introduced the concept of rule refs, or rules that reference other defined rules. Rule refs are common for any sufficiently advanced grammar.

`GBNF` automatically resolves rule refs to their eventual definitions, and are not exposed in the parse state.
