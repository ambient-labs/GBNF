import {
  type GBNFRule,
  _,
} from "gbnf/builder";

export const WS = 'ws';
export const OPT_WS = 'opt-ws';
export const NR_OPT_WS = 'non-rec-opt-ws';
export const VALUE = 'value';

const baseNumRule = g`"-"? ${g`[0-9] | ([1-9] [0-9]*)`}`.key('base-num');
export const quoteRule = g`"\\""`.key('quote');
export const numRule = g`
  ${baseNumRule} 
  ${g`
    "." 
    [0-9]+
  `.wrap('?')} 
  ${g`
    [eE] 
    [-+]? 
    [0-9]+
  `.wrap('?')}
`.key('number');
export const intRule = g`
  ${baseNumRule} 
  ${g`
    "." 
    [0]+
  `.wrap('?')}
`.key('integer');
export const boolRule = g`
  "true" 
  | "false"
`.key('boolean');
export const nullRule = g`"null"`.key('null');
export const charRule = g`[^"']`;
// export const char = g`[^"'\\n\\r\\t]`;
export const strRule = g`
  ${quoteRule} 
  ${charRule.wrap('*')} 
  ${quoteRule}
  `.key('string');
export const arrRule = (value: GBNFRule | string = VALUE) => g`
  "[" 
  ${g`
    ${value}
    ${g`
      "," 
      ${OPT_WS}
      ${value}
    `.wrap('*')}
  `.wrap('?')}
  "]" 
`.key('array');
export const objRule = (value: GBNFRule | string = VALUE) => {
  const propertyKeyPair = g`
      ${strRule}
    ":" 
    ${OPT_WS}
    ${value}
  `;
  return g`
  "{" 
  ${g`
    ${propertyKeyPair}
    ${g`
      "," 
      ${OPT_WS}
      ${propertyKeyPair}
    `.wrap('*')
      }`.wrap('?')} 
  "}"
`.key('object');
};

export const value = g`
  ${numRule} | ${boolRule} | ${nullRule} | ${strRule} | ${arrRule()} | ${objRule()}
`.key(VALUE);

