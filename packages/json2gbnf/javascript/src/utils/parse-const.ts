import {
  _,
  GBNFRule,
} from "gbnf/builder";
import type {
  JSONSchemaObjectValueConst,
} from "../types.js";
import {
  quoteRule,
} from '../constants.js';

export const parseConst = (value: JSONSchemaObjectValueConst): GBNFRule => _`
  ${quoteRule} 
  "${value.const}"
  ${quoteRule}
`;
