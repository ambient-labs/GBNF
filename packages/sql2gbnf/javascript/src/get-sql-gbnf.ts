import {
  _,
  GBNFRule,
} from "gbnf/builder";
import {
  selectRule,
} from "./select/index.js";
import type {
  Database,
} from "./types.js";
import {
  insertRule,
} from "./insert/index.js";
import {
  deleteRule,
} from "./delete/index.js";
import {
  updateRule,
} from "./update/index.js";
import {
  nroptws,
} from "./constants.js";

export const getSQLGBNF = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  database?: Database,
  // schema?: string,
): GBNFRule => _`
  ${nroptws}
  ${_`
    ${selectRule}
    | ${insertRule} 
    | ${deleteRule}
    | ${updateRule}
  `.wrap()}
  ${_`
    ${nroptws} 
    ";"
  `.wrap('?')}
`;
