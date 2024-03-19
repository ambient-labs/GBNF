# JSON2GBNF

<a href="https://www.npmjs.com/package/json2gbnf"><img alt="Latest json2gbnf NPM Version" src="https://badge.fury.io/js/json2gbnf.svg" /></a>
<a href="https://github.com/ambient-labs/json2gbnf/blob/master/packages/json2gbnf/LICENSE"><img alt="License for json2gbnf" src="https://img.shields.io/npm/l/json2gbnf" /></a>
<a href="https://www.npmjs.com/package/json2gbnf"><img alt="Downloads per week on NPM for json2gbnf" src="https://img.shields.io/npm/dw/json2gbnf" /></a>
<a href="https://github.com/ambient-labs/GBNF/actions/workflows/tests.yml"><img src="https://github.com/ambient-labs/GBNF/actions/workflows/tests.yml/badge.svg" alt="Status of tests for json2gbnf repository" /></a>
<a href="https://codecov.io/gh/ambient-labs/GBNF"><img alt="Code Coverage for json2gbnf" src="https://img.shields.io/codecov/c/github/ambient-labs/GBNF" /></a>
<a href="https://deepsource.io/gh/ambient-labs/GBNF/?ref=repository-badge"><img alt="DeepSource issues for json2gbnf" src="https://deepsource.io/gh/ambient-labs/GBNF.svg/?label=active+issues&show_trend=true" /></a>

A library for parsing JSON schema definitions into  `.gbnf` grammar files in Javascript.

## Install

```bash
npm install json2gbnf
```

## Usage

```
import JSON2GBNF from 'json2gbnf';

const grammar = JSON2GBNF({
  type: 'object',
  properties: {
    number: { type: 'number' },
    street_name: { type: 'string' },
    street_type: { enum: ['Street', 'Avenue', 'Boulevard'] },

  },
});

console.log(grammar); // GBNF grammar
```
