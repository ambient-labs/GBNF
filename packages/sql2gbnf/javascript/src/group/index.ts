import {
  $,
  g,
} from "gbnf/builder";
import {
  asAlias,
  columnNames,
  ws,
  optws,
} from "../constants.js";

export const groupByClause = g`
  ${ws} 
  ${$`GROUP BY`}
  ${ws}
  ${columnNames}
  ${g`${ws} ${asAlias}`.wrap('?')}
  ${g`"," ${optws} ${columnNames}`.wrap('*')}
`;
