import type { ValidInput, } from "../../grammar-graph/types.js";
import { getInputAsString, } from "./get-input-as-string.js";
import { buildErrorPosition, } from "./build-error-position.js";

export const INPUT_PARSER_ERROR_HEADER_MESSAGE = `Failed to parse input string:`;

export class InputParseError extends Error {
  _src: ValidInput;
  pos: number;
  constructor(src: ValidInput, pos: number) {
    super([
      INPUT_PARSER_ERROR_HEADER_MESSAGE,
      '',
      ...buildErrorPosition(getInputAsString(src), pos),
    ].join('\n'));
    this._src = src;
    this.pos = pos;
    this.name = 'InputParseError';
  }

  get src() {
    return getInputAsString(this._src);
  }
}
