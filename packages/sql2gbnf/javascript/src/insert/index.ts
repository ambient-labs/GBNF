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

const listOfStrings = (value: GBNFRule | string) => _` 
  "(" 
    ${nroptws} 
    ${value} 
    ${_`
      "," 
      ${optws} 
      ${value}
    `.wrap('*')} 
    ${nroptws} 
  ")" 
`;

export const insertRule = _`
  ${$`INSERT`}
  ${ws}
  ${$`INTO`}
  ${ws}
  ${tableName}
  ${_`${ws} ${validAlias}`.wrap("?")}
  ${optws}
  ${listOfStrings(columnName)}
  ${optws}
  ${$`VALUES`}
  ${optws}
  ${listOfStrings(_`
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
