import type { Parser, importer, } from "@dbml/core";
/* eslint-disable @typescript-eslint/ban-types */

export type AddRule = (rule: string, symbolName?: string) => string;
export type GetConst = (key: string, opts?: { left?: boolean; right?: boolean }) => string;

export type WhitespaceKind = 'succinct' | 'verbose' | 'default';
export type CaseKind = 'lower' | 'upper' | 'any';
export interface BaseSchemaOpts {
  whitespace?: WhitespaceKind;
  case?: CaseKind;
  // schema?: string;
  // schemaFormat?: Parameters<typeof importer.import>[1];
}

export interface DBMLStringSchema {
  schema: string;
  schemaFormat: Parameters<typeof importer.import>[1];
}

export type Database = ReturnType<typeof Parser.parse>;

export interface DBMLDatabaseSchema {
  schema: Database;
}

export type DBMLSchemaOpts = DBMLStringSchema | DBMLDatabaseSchema | {};
export type SchemaOpts = BaseSchemaOpts;
