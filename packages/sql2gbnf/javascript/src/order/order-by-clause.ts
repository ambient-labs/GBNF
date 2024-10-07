import {
  $,
  g,
} from "gbnf/builder";
import {
  asAlias,
  columnNames,
  direction,
  ws,
  optws,
} from "../constants.js";

export const orderByClause = g`
  ${ws} ${$`ORDER BY`}
  ${ws}
  ${columnNames}
  ${g`${ws} ${asAlias}`.wrap('?')}
  ${g`${direction}`.wrap('?')}
  ${g`
    "," 
    ${optws} 
    ${columnNames} 
    ${direction.wrap('?')}
  `.wrap('*')}
`;
