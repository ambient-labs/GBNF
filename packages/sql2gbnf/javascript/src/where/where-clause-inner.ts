import {
  _,
  $,
} from "gbnf/builder";
import {
  columnName,
  positiveInteger,
  stringWithQuotes,
  numericOps,
  number,
  equalOps,
  dateDef,
  ws,
  optws,
  nroptws,
} from "../constants.js";

export const whereClauseInner = _`
  ${columnName}
  ${_`
    ${_`
      ${optws} 
      ${equalOps}
      ${optws}
      ${_`
        ${columnName}
        | ${positiveInteger}
        | ${stringWithQuotes}
      `}
    `}
    | ${_`
      ${optws} 
      ${numericOps}
      ${optws}
      ${_` ${number} | ${dateDef} `}
    `}
    | ${_`
      ${optws} 
      ${$`LIKE`}
      ${optws}
      ${stringWithQuotes}
    `}
    | ${_`
      ${optws} 
      ${$`BETWEEN`}
      ${ws}
      ${_`
        ${_` ${number} ${ws} ${$`AND`} ${ws} ${number} `}
        | ${_` ${stringWithQuotes} ${ws} ${$`AND`} ${ws} ${stringWithQuotes} `}
      `}
    `}
    |
    ${_`
      ${ws} 
      ${$`IN`}
      ${ws}
      "("
        ${optws}
        ${stringWithQuotes}
        ${_`
          ","
          ${optws}
          ${stringWithQuotes}
        `.wrap('*')}
        ${nroptws}
      ")"
    `}
  `}
`;
