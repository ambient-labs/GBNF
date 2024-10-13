import GBNF from 'gbnf'

const grammar = GBNF('root ::= "foo" | "bar" | "baz"') // throws if invalid grammar
const state = grammar('ba') // throws if invalid input
console.log([...grammar]) // get rules
