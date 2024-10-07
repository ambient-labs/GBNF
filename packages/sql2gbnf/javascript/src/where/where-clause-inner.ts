import {
  g,
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

export const whereClauseInner = g`
  ${columnName}
  ${g`
    ${g`
      ${optws} 
      ${equalOps}
      ${optws}
      ${g`
        ${columnName}
        | ${positiveInteger}
        | ${stringWithQuotes}
      `}
    `}
    | ${g`
      ${optws} 
      ${numericOps}
      ${optws}
      ${g` ${number} | ${dateDef} `}
    `}
    | ${g`
      ${optws} 
      ${$`LIKE`}
      ${optws}
      ${stringWithQuotes}
    `}
    | ${g`
      ${optws} 
      ${$`BETWEEN`}
      ${ws}
      ${g`
        ${g` ${number} ${ws} ${$`AND`} ${ws} ${number} `}
        | ${g` ${stringWithQuotes} ${ws} ${$`AND`} ${ws} ${stringWithQuotes} `}
      `}
    `}
    |
    ${g`
      ${ws} 
      ${$`IN`}
      ${ws}
      "("
        ${optws}
        ${stringWithQuotes}
        ${g`
          ","
          ${optws}
          ${stringWithQuotes}
        `.wrap('*')}
        ${nroptws}
      ")"
    `}
  `}
`;
