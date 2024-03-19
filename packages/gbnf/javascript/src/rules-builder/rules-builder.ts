import { GrammarParseError, } from "../utils/errors.js";
import { isWordChar, } from "./is-word-char.js";
import { parseChar, } from "./parse-char.js";
import { parseName, } from "./parse-name.js";
import { parseSpace, } from "./parse-space.js";
import { SymbolIds, } from "./symbol-ids.js";
import { InternalRuleType, InternalRuleDef, } from "./types.js";

export class RulesBuilder {
  private pos = 0;
  symbolIds: SymbolIds = new SymbolIds();
  rules: InternalRuleDef[][];
  src: string;
  start: number = performance.now();
  #timeLimit: number;
  constructor(src: string, limit = 1000) {
    this.#timeLimit = limit;
    this.rules = [];
    this.src = src;
    this.parse(src);
  }

  private parse = (src: string) => {
    this.pos = parseSpace(src, 0, true); // move cursor forward until we reach non-whitespace content

    while (this.pos < src.length) {
      this.parseRule(src);
    }


    // Validate the state to ensure that all rules are defined
    for (const rule of this.rules) {
      for (const elem of rule) {
        if (elem.type === InternalRuleType.RULE_REF) {
          // Ensure that the rule at that location exists
          const ruleExists = elem.value < this.rules.length && this.rules[elem.value]?.length > 0;
          if (!ruleExists) {
            const missingRuleName = this.symbolIds.reverseGet(elem.value);
            let missingRulePos = this.symbolIds.getPos(missingRuleName);

            // Skip over the ::= and any whitespace
            while (missingRulePos < src.length && (src[missingRulePos] === ':' || src[missingRulePos] === '=' || /\s/.test(src[missingRulePos]))) {
              missingRulePos++;
            }

            throw new GrammarParseError(src, missingRulePos, `Undefined rule identifier "${missingRuleName}"`);
          }
        }
      }
    }
  };

  private parseRule = (src: string): void => {
    const name = parseName(src, this.pos);
    this.pos = parseSpace(src, this.pos + name.length, false);
    const ruleId: number = this.getSymbolId(name, name.length);

    // Skip over whitespace characters and find the ::= sequence
    this.pos = parseSpace(src, this.pos, true);
    if (!(src[this.pos] === ':' && src[this.pos + 1] === ':' && src[this.pos + 2] === '=')) {
      throw new GrammarParseError(src, this.pos, `Expecting ::= at ${this.pos}`);
    }
    this.pos = parseSpace(src, this.pos + 3, true);

    this.parseAlternates(name, ruleId);

    if (src[this.pos] === '\r') {
      this.pos += src[this.pos + 1] === '\n' ? 2 : 1;
    } else if (src[this.pos] === '\n') {
      this.pos += 1;
    } else if (src[this.pos]) {
      throw new GrammarParseError(src, this.pos, `Expecting newline or end at ${this.pos}`);
    }
    this.pos = parseSpace(src, this.pos, true);
  };

  getSymbolId = (src: string, len: number): number => {
    const nextId: number = this.symbolIds.size;
    const key = src.slice(0, len);
    if (!this.symbolIds.has(key)) {
      this.symbolIds.set(key, nextId, this.pos);
    }
    return this.symbolIds.get(key);
  };

  generateSymbolId = (base_name: string): number => {
    const next_id = this.symbolIds.size;
    this.symbolIds.set(`${base_name}_${next_id}`, next_id, this.pos);
    return next_id;
  };

  addRule = (
    rule_id: number,
    rule: InternalRuleDef[]
  ): void => {
    this.rules[rule_id] = rule;
  };

  checkDuration() {
    if (performance.now() - this.start > this.#timeLimit) {
      throw new GrammarParseError(this.src, this.pos, `duration of ${this.#timeLimit} exceeded:`);
    }
  }

  parseSequence = (
    rule_name: string,
    outElements: InternalRuleDef[],
    depth = 0,
  ): void => {
    const isNested = depth !== 0;
    const src = this.src;
    let lastSymStart: number = outElements.length;
    while (src[this.pos]) {
      if (src[this.pos] === '"') {
        this.pos += 1;
        lastSymStart = outElements.length;
        while (src[this.pos] !== '"') {
          this.checkDuration();
          const [value, incPos,] = parseChar(src, this.pos);
          outElements.push({ type: InternalRuleType.CHAR, value: [value,], });
          this.pos += incPos; // Adjusting pos by the length of parsed characters
        }
        this.pos = parseSpace(src, this.pos + 1, isNested);
      } else if (src[this.pos] === '[') {
        this.pos += 1;
        let startType: InternalRuleType = InternalRuleType.CHAR;
        if (src[this.pos] === '^') {
          this.pos += 1;
          startType = InternalRuleType.CHAR_NOT;
        }
        lastSymStart = outElements.length;
        while (src[this.pos] !== ']') {
          this.checkDuration();
          const type = lastSymStart < outElements.length ? InternalRuleType.CHAR_ALT : startType;
          const [startcharValue, incPos,] = parseChar(src, this.pos);
          this.pos += incPos;
          if (type === InternalRuleType.CHAR || type === InternalRuleType.CHAR_NOT) {
            outElements.push({ type, value: [startcharValue,], });
          } else {
            outElements.push({ type, value: startcharValue, });
          }

          if (src[this.pos] === '-' && src[this.pos + 1] !== ']') {
            this.pos += 1;
            const [endcharValue, incPos,] = parseChar(src, this.pos);
            outElements.push({ type: InternalRuleType.CHAR_RNG_UPPER, value: endcharValue, });
            this.pos += incPos;
          }
        }
        this.pos = parseSpace(src, this.pos + 1, isNested);
      } else if (isWordChar(src[this.pos])) {
        const name = parseName(src, this.pos);
        const refRuleId: number = this.getSymbolId(name, name.length);
        this.pos += name.length;
        this.pos = parseSpace(src, this.pos, isNested);

        lastSymStart = outElements.length;
        outElements.push({ type: InternalRuleType.RULE_REF, value: refRuleId, });
      } else if (src[this.pos] === '(') {
        this.pos = parseSpace(src, this.pos + 1, true);
        const subRuleId: number = this.generateSymbolId(rule_name);
        this.parseAlternates(rule_name, subRuleId, depth + 1);
        lastSymStart = outElements.length;
        outElements.push({ type: InternalRuleType.RULE_REF, value: subRuleId, });
        if (src[this.pos] !== ')') {
          throw new GrammarParseError(src, this.pos, `Expecting ')' at ${this.pos}`);
        }
        this.pos = parseSpace(src, this.pos + 1, isNested);
      } else if (src[this.pos] === '*' || src[this.pos] === '+' || src[this.pos] === '?') {
        if (lastSymStart === outElements.length) {
          throw new GrammarParseError(src, this.pos, `Expecting preceding item to */+/? at ${this.pos}`);
        }
        const subRuleId: number = this.generateSymbolId(rule_name);
        const subRule: InternalRuleDef[] = outElements.slice(lastSymStart);
        if (src[this.pos] === '*' || src[this.pos] === '+') {
          subRule.push({ type: InternalRuleType.RULE_REF, value: subRuleId, });
        }
        subRule.push({ type: InternalRuleType.ALT, });
        if (src[this.pos] === '+') {
          subRule.push(...outElements.slice(lastSymStart));
        }
        subRule.push({ type: InternalRuleType.END, });
        this.addRule(subRuleId, subRule);
        outElements.splice(lastSymStart);
        outElements.push({ type: InternalRuleType.RULE_REF, value: subRuleId, });
        this.pos = parseSpace(src, this.pos + 1, isNested);
      } else {
        break;
      }
    }
  };

  parseAlternates = (
    rule_name: string,
    rule_id: number,
    depth = 0,
  ): void => {
    const src = this.src;
    const rule: InternalRuleDef[] = [];
    this.parseSequence(rule_name, rule, depth);
    while (src[this.pos] === '|') {
      this.checkDuration();
      rule.push({ type: InternalRuleType.ALT, });
      this.pos = parseSpace(src, this.pos + 1, true);
      this.parseSequence(rule_name, rule, depth);
    }
    rule.push({ type: InternalRuleType.END, });
    this.addRule(rule_id, rule);
  };
}

