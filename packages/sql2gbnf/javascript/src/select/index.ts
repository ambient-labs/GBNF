import {
  $,
  _,
} from "gbnf/builder";
import {
  ws,
} from '../constants.js';
import {
  fullSelectQuery,
} from "./full-select-query.js";

export const selectRule = _`
  ${fullSelectQuery}
  ${_`
    ${ws} 
    ${$`UNION`} 
    ${ws} 
    ${_`
      ${$`ALL`} 
      ${ws}
    `.wrap('?')} 
    ${fullSelectQuery}
  `.wrap('*')
  }
`;
