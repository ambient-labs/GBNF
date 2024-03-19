import {
  $,
  _,
} from "gbnf/builder";
import {
  asAlias,
  columnNames,
  direction,
  ws,
  optws,
} from "../constants.js";

export const orderByClause = _`
  ${ws} ${$`ORDER BY`}
  ${ws}
  ${columnNames}
  ${_`${ws} ${asAlias}`.wrap('?')}
  ${_`${direction}`.wrap('?')}
  ${_`
    "," 
    ${optws} 
    ${columnNames} 
    ${direction.wrap('?')}
  `.wrap('*')}
`;
