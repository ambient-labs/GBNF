import {
  $,
  _,
} from "gbnf/builder";
import {
  asAlias,
  equalOps,
  stringWithQuotes,
  numericOps,
  number,
  boolean,
  columnNames,
  ws,
  optws,
} from "../constants.js";

export const havingClause = _`
  ${ws}
  ${$`HAVING`}
  ${ws}
  ${columnNames}
  ${_`${ws} ${asAlias}`.wrap('?')}
  (
    ${_`
      ${ws} 
      ${$`IS`} 
      ${ws} 
      ${_`${$`NOT`} ${ws}`.wrap('?')} 
      ${$`NULL`}
    `}
    | ${_`
      ${optws} 
      ${numericOps} 
      ${optws} 
      ${_`
        ${number} 
        | ${stringWithQuotes}
      `}
    `}
    | ${_`${ws} ${$`LIKE`} ${ws} ${stringWithQuotes}`}
    | ${_`
      ${optws} 
      ${equalOps} 
      ${optws} 
      ${_`
        ${stringWithQuotes} 
        | ${boolean} 
        | ${number}
      `}
    `}
  )
`;
