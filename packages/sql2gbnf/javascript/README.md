# SQL2GBNF

<a href="https://www.npmjs.com/package/sql2gbnf"><img alt="Latest sql2gbnf NPM Version" src="https://badge.fury.io/js/sql2gbnf.svg" /></a>
<a href="https://github.com/ambient-labs/sql2gbnf/blob/master/packages/sql2gbnf/LICENSE"><img alt="License for sql2gbnf" src="https://img.shields.io/npm/l/sql2gbnf" /></a>
<a href="https://www.npmjs.com/package/sql2gbnf"><img alt="Downloads per week on NPM for sql2gbnf" src="https://img.shields.io/npm/dw/sql2gbnf" /></a>
<a href="https://github.com/ambient-labs/GBNF/actions/workflows/tests.yml"><img src="https://github.com/ambient-labs/GBNF/actions/workflows/tests.yml/badge.svg" alt="Status of tests for sql2gbnf repository" /></a>
<a href="https://codecov.io/gh/ambient-labs/GBNF"><img alt="Code Coverage for sql2gbnf" src="https://img.shields.io/codecov/c/github/ambient-labs/GBNF" /></a>
<a href="https://deepsource.io/gh/ambient-labs/GBNF/?ref=repository-badge"><img alt="DeepSource issues for sql2gbnf" src="https://deepsource.io/gh/ambient-labs/GBNF.svg/?label=active+issues&show_trend=true" /></a>

A library for parsing JSON schema definitions into  `.gbnf` grammar files in Javascript.

## Install

```bash
npm install sql2gbnf
```

## Usage

```
import SQL2GBNF from 'sql2gbnf';

const grammar = SQL2GBNF({
  type: 'object',
  properties: {
    number: { type: 'number' },
    street_name: { type: 'string' },
    street_type: { enum: ['Street', 'Avenue', 'Boulevard'] },

  },
});

console.log(grammar); // GBNF grammar
```
