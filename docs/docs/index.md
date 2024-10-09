---
title: 'Introduction'
order: 0
---

`GBNF` is a JS / Python library for working with GBNF notation. It can parse and validate GBNF grammars and inputs to those grammars. 

`GBNF` also provides implementations of a [SQL GBNF grammar](sql2gbnf) and a [JSON GBNF grammar](json2gbnf).

## Why

LLMs work by predicting the probability of each possible next token (word or subword), conditioned on the sequence of tokens that came before. They then select the next token by probabilistically sampling from this probability distribution.

| Token   | a     | b     | c     | d     | e     | ...   |
|---------|-------|-------|-------|-------|-------|-------|
| Probability | 0.028   | 0.004   | 0.011  | 0.003  | 0.001  | ...   |

While this approach enables LLMs to generate coherent text, it also means their outputs can sometimes fail to follow a desired format or structure. Constraining an LLM's token outputs alleviates this problem.

### Constraining LLMs

Many LLM libraries offer the ability to modify the tokens the LLMs can produce, and force the LLM to generate output that follows specific syntactical rules.

Say you prompt an LLM with: 

> Convert this address into a JSON object: `1 main st`

In response, an LLM might generate the following probabilities:

| Token   | {     | $     | <     | b     | c     | ...   |
|---------|-------|-------|-------|-------|-------|-------|
| Probability | 0.90   | 0.10   | 0.01  | 0.02  | 0.02  | ...   |

In the example above, most of the time the LLM will choose `{`, which is what we want. Occasionally, though, the LLM will choose a _different_ token, resulting in an invalid output.

However, if we specifically zero out the probabilities of any tokens deemed _invalid_:

<style type="text/css">
  .zeroed td {
    background: yellow;

    &:first-child, &:nth-child(2), &:last-child {
      background: inherit;
    }
  }
  </style>
<table class="zeroed"> <thead> <tr> <th>Token</th> <th>{</th> <th>$</th> <th>&lt;</th> <th>b</th> <th>c</th> <th>...</th> </tr> </thead> <tbody> <tr> <td>Probability</td> <td>0.90</td> <td>0.00</td> <td>0.00</td> <td>0.00</td> <td>0.00</td> <td>...</td> </tr> </tbody> </table>

We can guarantee that every response our LLM provides is syntactically valid.

## Determing valid tokens

The way we determine valid or invalid tokens is by using a grammar.

[Grammars](https://en.wikipedia.org/wiki/Context-free_grammar) can be used to define a set of rules that correspond to a set of possible outputs. 

Grammars are often used to describe programming languages or adjacent domains such as JSON; however, they can be used to describe any set of token output that follows a specific structure.


### GBNF

GBNF is a specific flavor of grammar, officially supported by [llama.cpp](https://github.com/ggerganov/llama.cpp/blob/master/grammars/README.md) and [llamafile](https://github.com/Mozilla-Ocho/llamafile) among others.

`llama.cpp`'s [chess notation grammar](https://github.com/ggerganov/llama.cpp/blob/master/grammars/chess.gbnf) looks like this:

```gbnf
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

Given this grammar, an LLM might produce something like the following:

```
1. a4 b5
2. N7 a6
3. O-O b4
```


## This library

`GBNF` was developed to provide a way to constrain output in LLM libraries that lacked formal support for grammars. 

`GBNF` offers three key features:

1. A validator for both GBNF grammars and input to check against those grammars
2. A set of rules for tracking the current state of the input and the valid set of next characters
3. A set of tools for writing and generating dynamic grammar definitions

By constraining an LLM's output to follow a specific grammar, we can ensure the generated text adheres to a desired format or structure.

## Integrations

`gbnf` was developed alongside [`ziggyllm`](https://ziggyllm.dev), a tool to constrain LLM outputs in the browser.
