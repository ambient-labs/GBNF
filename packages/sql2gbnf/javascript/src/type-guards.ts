import { DBMLSchemaOpts, DBMLStringSchema, } from "./types.js";

export const isString = (value: unknown) => typeof value === 'string';
export const isDBMLStringSchema = (opts: DBMLSchemaOpts): opts is DBMLStringSchema => 'schema' in opts && isString(opts.schema);
