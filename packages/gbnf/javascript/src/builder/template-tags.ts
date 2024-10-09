import { GBNFRule, } from "./gbnf-rule.js";
import {
  StringGBNFRule,
} from './string-gbnf-rule.js';

export const g = GBNFRule.templateTag();
export const $ = StringGBNFRule.templateTag();
