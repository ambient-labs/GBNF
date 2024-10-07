import {
  getSQLGBNF,
} from "./get-sql-gbnf.js";
import type {
  DBMLSchemaOpts,
  SchemaOpts,
} from "./types.js";
import {
  getDBML,
} from "./get-dbml.js";
import {
  getWhitespaceDefs,
} from "./utils/get-whitespace-def.js";
import {
  nroptws,
  optws,
  ws,
} from "./constants.js";
import {
  _,
} from 'gbnf/builder';

export function SQL2GBNF(schemaDef: DBMLSchemaOpts = {}, {
  whitespace = 'default',
  case: caseKind = 'any',
}: SchemaOpts = {}): string {
  const database = getDBML(schemaDef);

  const rules = getWhitespaceDefs(whitespace);

  return getSQLGBNF(database).compile({
    caseKind,
    include: [
      rules.ws.name(ws),
      _`${rules.optRecWS}`.name(optws),
      _`${rules.optNonRecWS}`.name(nroptws),
    ],
  });
};
