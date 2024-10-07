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

export const havingClause = g`
  ${ws}
  ${$`HAVING`}
  ${ws}
  ${columnNames}
  ${g`${ws} ${asAlias}`.wrap('?')}
  (
    ${g`
      ${ws} 
      ${$`IS`} 
      ${ws} 
      ${g`${$`NOT`} ${ws}`.wrap('?')} 
      ${$`NULL`}
    `}
    | ${g`
      ${optws} 
      ${numericOps} 
      ${optws} 
      ${g`
        ${number} 
        | ${stringWithQuotes}
      `}
    `}
    | ${g`${ws} ${$`LIKE`} ${ws} ${stringWithQuotes}`}
    | ${g`
      ${optws} 
      ${equalOps} 
      ${optws} 
      ${g`
        ${stringWithQuotes} 
        | ${boolean} 
        | ${number}
      `}
    `}
  )
`;
