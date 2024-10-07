import {
  g,
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
): GBNFRule => g`
  ${nroptws}
  ${g`
    ${selectRule}
    | ${insertRule} 
    | ${deleteRule}
    | ${updateRule}
  `.wrap()}
  ${g`
    ${nroptws} 
    ";"
  `.wrap('?')}
`;
