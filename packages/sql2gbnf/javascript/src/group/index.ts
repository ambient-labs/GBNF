import {
  $,
  _,
} from "gbnf/builder";
import {
  asAlias,
  columnNames,
  ws,
  optws,
} from "../constants.js";

export const groupByClause = _`
  ${ws} 
  ${$`GROUP BY`}
  ${ws}
  ${columnNames}
  ${_`${ws} ${asAlias}`.wrap('?')}
  ${_`"," ${optws} ${columnNames}`.wrap('*')}
`;
