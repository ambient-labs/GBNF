import { isDBMLStringSchema, } from "./type-guards.js";
import { Parser, importer, } from "@dbml/core";
import type { DBMLSchemaOpts, Database, } from "./types.js";

export const getDBML = (opts: DBMLSchemaOpts): undefined | Database => {
  if (!('schema' in opts)) {
    return;
  }
  if (isDBMLStringSchema(opts)) {
    const dbml = importer.import(opts.schema, opts.schemaFormat);
    return (new Parser()).parse(dbml, 'dbml');
  }

  return opts.schema;
};
