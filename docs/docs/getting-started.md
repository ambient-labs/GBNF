---
title: 'Getting Started'
order: 1
---


```multiple
javascript: ./foo.js
python: ./foo.py
```

## Installation

You can install `gbnf` with:

```bash
npm install gbnf
```

You can also use `GBNF` directly in your browser:

```html
<script src='https://cdn.jsdelivr.net/npm/gbnf@latest/+esm'></script>
<script type="text/javascript">
console.log(GBNF)
</script>
```

## Quick Start

`GBNF` exposes a default export for [validating grammars and inputs](validations/grammar), and [retrieving rules](state-rules):

```javascript
import GBNF from 'gbnf'

const grammar = GBNF('root ::= "foo" | "bar" | "baz"') // throws if invalid grammar
const state = grammar('ba') // throws if invalid input
console.log([...grammar]) // get rules
```

`GBNF` also provides a convenience template tag for [building grammars](writing):

```javascript
import { g } from 'gbnf'

const grammar = g`"foo" | "bar" | "baz"`
console.log(grammar)
```

## Usage

### Get a list of valid rules for the next input

For any given valid string, you can get a list of valid next inputs that can be provided:

```javascript
import GBNF from 'gbnf'

let grammar = GBNF('root ::= "foo" | "bar" | "baz"')
console.log([...grammar]) // get a list of valid input rules before we've added any text
grammar = grammar.add('b')
console.log([...grammar]) // get a list of valid input rules after we've added some text'
```

### Build grammars on the fly

Instead of writing this:

```gbnf
// https://github.com/ggerganov/llama.cpp/blob/master/grammars/chess.gbnf
# Specifies chess moves as a list in algebraic notation, using PGN conventions

# Force first move to "1. ", then any 1-2 digit number after, relying on model to follow the pattern
root    ::= "1. " move " " move "\n" ([1-9] [0-9]? ". " move " " move "\n")+
move    ::= (pawn | nonpawn | castle) [+#]?

# piece type, optional file/rank, optional capture, dest file & rank
nonpawn ::= [NBKQR] [a-h]? [1-8]? "x"? [a-h] [1-8]

# optional file & capture, dest file & rank, optional promotion
pawn    ::= ([a-h] "x")? [a-h] [1-8] ("=" [NBKQR])?

castle  ::= "O-O" "-O"?
```

Write this:

```javascript
import { g } from 'gbnf'

// Specifies chess moves as a list in algebraic notation, using PGN conventions
const castle = g`"O-O" "-O"?`.key('castle');

// optional file & capture, dest file & rank, optional promotion
const pawn = g`([a-h] "x")? [a-h] [1-8] ("=" [NBKQR])?`.key('pawn');

// piece type, optional file/rank, optional capture, dest file & rank
const nonpawn = g`[NBKQR] [a-h]? [1-8]? "x"? [a-h] [1-8]`.key('nonpawn');

const move = g` (${pawn} | ${nonpawn} | ${castle}) [+#]? `.key('move');
const turn = g`${move} " " ${move} "\n" `.key('turn');

// Force first move to "1. ", then any 1-2 digit number after, relying on model to follow the pattern
const root = g`"1. " ${turn} ([1-9] [0-9]? ". " ${turn})+`;

console.log(root.toString());
```
