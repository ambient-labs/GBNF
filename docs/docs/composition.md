---
title: 'Composition'
order: 4
---

`GBNF` offers mechanisms for concisely writing new GBNF grammars.

(This does not cover the specifics of writing GBNF; for that, view the original spec in llama.cpp.)

## `g` template tag

`GBNF` offers a `g` template tag for writing rules:

```javascript
import { g } from 'gbnf'

const grammar = g`"foo"`
console.log(grammar.toString()) // `root ::= "foo"
```

`GBNF` handles rule names automatically. The root rule is automatically `root`.

Rules can be defined separately and included:

```javascript
import { g } from 'gbnf'

const foo = g`"foo"`
const bar = g`"bar"`
const baz = g`"baz"`
const grammar = g`${foo} | ${bar} | ${baz}`
console.log(grammar.toString())
```

Rules don't have to be explicitly defined as variables to be included; you can also define them inline:

```javascript
import { g } from 'gbnf'

const grammar = g` [a-z] ${g` \n\t[A-Z]`} ${g`[A-Z] \n\t`}`
console.log(grammar.toString())
```

`GBNF` automatically finds duplicate rules and combines them.

Sometimes a rule needs explicit name. A common case is when a rule references itself. You can define a custom rule name with `name`:

```javascript
import { g } from 'gbnf'

const lowerchar = g`[a-z] (lowerchar)*`.key('lowerchar')
console.log(g`${lowerchar}`.toString())
```



### Whitespace

Multiple whitespaces automatically resolve to a single whitespace:

```javascript
import { g } from 'gbnf'

console.log(g`
"foo"
      "bar"
"baz"
`.toString())
```

This enables fluid formatting of complicated GBNF definitions.

If you need to maintain whitespace, use `raw`:

```javascript
import { g } from 'gbnf'

console.log(g`
"foo"
      "bar"
"baz"
`.raw.toString())
```

### Arrays

Arrays can be provided, and are automatically joined into whitespace-separated definitions:

```javascript
import { g } from 'gbnf'

console.log(g`${["a", "a", "a"]}`.toString())
```

Arrays can contain rules too:

```javascript
import { g } from 'gbnf'

const a = g`"a"`
console.log(g`${[a, a, a]}`.toString())
```

You can also specify that an array be joined with a specific character. For example, you may want to join with a `|`:

```javascript
import { g } from 'gbnf'

console.log(g`${["foo", "bar"]}`.join(' | ').toString())
```

Joins apply to _all_ arrays contained within a rule. If you need different behavior per array, wrap each array in its own rule.

### Undefined, null, and booleans

`undefined`, `null`, and `boolean` values are all ignored:

```javascript
import { g } from 'gbnf'

console.log(g`"foo" ${undefined} ${true} "bar" ${false} ${null} "baz"`.toString())
```

### Wrap

You can wrap a rule with parantheses, which affects rule execution order

You can manually wrap a rule yourself, or you can leverage `.wrap()`:

```javascript
import { g } from 'gbnf'

const foo = g`"bar"`
const grammar = g`${foo.wrap()}`
console.log(grammar.toString())
```

You can also provide a modifier for a wrapped rule:

```javascript
import { g } from 'gbnf'

const foo = g`"bar"`
const grammar = g`${foo.wrap('?')}`
console.log(grammar.toString())
```

Modifiers can be:

- `?` - optional
- `*` - repeated invocations, 0 or more
- `+` - repeated invocations, 1 or more

## Extending template tags

You can provide your own grammar builders that implement custom grammar logic.

As an example, consider the `StringRule` that handles string case from the `sql2gbnf` package. SQL can support both lowercase and uppercase words, and we want to provide an option for our users to decide the case at runtime:

```sql
SELECT * FROM table; -- this is valid
select * from table; -- this is also valid
SeLeCt * FrOm table; -- even this is valid!
```

To implement this rule, we:

1. Define our arguments - `caseKind`
2. Implement `toString()` to determine what comes out

We want to provide a rule that enables the case of the string to be set at runtime. The below implements the behavior:

```javascript
import { GBNFRule } from 'gbnf'

const getStringValue = (value, caseKind) => ([
  '"',
  ...value.map((val) => {
    if (caseKind === 'default') {
      return val;
    } else if (caseKind === 'lower') {
      return val.toLowerCase();
    } else if (caseKind === 'upper') {
      return val.toUpperCase();
    } else { // any
      return `[${char.toLowerCase()}${char.toUpperCase()}]`;
    }
  }),
  '"',
].join(' '));

class StringGBNFRule extends GBNFRule {
  renderStrings = (
    strings,
    args,
  ) => {
    console.log(strings, args)
    return strings.map(string => getStringValue(string, args));
  };

  // get separator() {
  //   const { _separator: separator, } = this;
  //   return separator ? ` ${separator} ` : ' ';
  // }
}

const s = StringGBNFRule.templateTag();

console.log(s`select`.toString({ caseKind: 'upper' }))
```
