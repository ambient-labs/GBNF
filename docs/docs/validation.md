---
title: 'Validation'
order: 2
---

You can validate [grammar](grammar) and [inputs](inputs).

## Validating Grammars

`gbnf` accepts [GBNF grammars as defined in llama.cpp](https://github.com/ggerganov/llama.cpp/blob/master/grammars/README.md). 

Validate a grammar by providing it to `gbnf`. If the provided grammar is invalid, `gbnf` will throw an error containing information about that error:

```javascript
import GBNF from 'gbnf'

try {
  GBNF('root ::= "foo"') // if grammar is valid, no errors
  console.log('this passes fine')
  GBNF('root := "foo"') // if grammar is invalid, errors
} catch(err) {
  console.error(err.message)
}
```

## Validating Input

Once you have a valid grammar, you can test it against incoming input. If passed invalid input, `GBNF` will throw an error indicating where the input is bad:

```javascript
import GBNF from 'gbnf'

try {
  let grammar = GBNF('root ::= "foo"')
  grammar.add('foo') // if input is valid, no errors
  console.log('this passes fine')
  grammar.add('bar') // if input is invalid, errors
} catch(err) {
  console.error(err.message)
}
```

You can also pass input during grammar instantiation:

```javascript
import GBNF from 'gbnf'
try {
  const grammar = GBNF(`root ::= "foo" | "bar"`, 'baz')
} catch(err) {
  console.error(err.message)
}
```

You can iteratively pass input to grammar state objects:

```javascript
import GBNF from 'gbnf'
try {
  let grammar = GBNF(`root ::= "foo" | "bar"`)
  grammar = grammar.add('b')
  grammar = grammar.add('a')
  grammar = grammar.add('z') // this input is invalid
} catch(err) {
  console.error(err.message)
}
```

By default the error message will only contain the most recent string provided; alternatively, you can view the full input so far:

```javascript
import GBNF from 'gbnf'
try {
  let grammar = GBNF(`root ::= "foo" | "bar"`)
  grammar = grammar.add('b')
  grammar = grammar.add('a')
  grammar = grammar.add('z') // this input is invalid
} catch(err) {
  console.error(err.messageExpanded)
}
```
