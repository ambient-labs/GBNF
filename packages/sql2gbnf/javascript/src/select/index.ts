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

export const selectRule = g`
  ${fullSelectQuery}
  ${g`
    ${ws} 
    ${$`UNION`} 
    ${ws} 
    ${g`
      ${$`ALL`} 
      ${ws}
    `.wrap('?')} 
    ${fullSelectQuery}
  `.wrap('*')
  }
`;
