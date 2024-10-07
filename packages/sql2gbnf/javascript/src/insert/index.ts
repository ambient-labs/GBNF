import {
  $,
  GBNFRule,
  _,
} from "gbnf/builder";
import {
  selectRule,
} from '../select/index.js';
import {
  stringWithQuotes,
  number,
  boolean,
  tableName,
  columnName,
  validAlias,
  ws,
  optws,
  nroptws,
} from "../constants.js";

const listOfStrings = (value: GBNFRule | string) => g` 
  "(" 
    ${nroptws} 
    ${value} 
    ${g`
      "," 
      ${optws} 
      ${value}
    `.wrap('*')} 
    ${nroptws} 
  ")" 
`;

export const insertRule = g`
  ${$`INSERT`}
  ${ws}
  ${$`INTO`}
  ${ws}
  ${tableName}
  ${g`${ws} ${validAlias}`.wrap("?")}
  ${optws}
  ${listOfStrings(columnName)}
  ${optws}
  ${$`VALUES`}
  ${optws}
  ${listOfStrings(g`
    ${stringWithQuotes} 
    | ${number} 
    | ${boolean} 
    | ${$`NULL`} 
    | ${selectRule} 
    | "(" 
        ${nroptws} 
        ${selectRule} 
        ${nroptws} 
      ")"
  `.wrap())}
`;
