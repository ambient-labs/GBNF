import { getInputAsString, } from "./get-input-as-string.js";
import { buildErrorPosition, } from "./build-error-position.js";
import type { ValidInput, } from "../../grammar-graph/types.js";

export const INPUT_PARSER_ERROR_HEADER_MESSAGE = `Failed to parse input string:`;

export class InputParseError extends Error {
  name = 'InputParseError';
  constructor(private mostRecentInput: ValidInput, private pos: number, private previousInput: ValidInput = '') {
    super([
      INPUT_PARSER_ERROR_HEADER_MESSAGE,
      '',
      ...buildErrorPosition(`${getInputAsString(previousInput)}${getInputAsString(mostRecentInput)}`,
        pos + getInputAsString(previousInput).length),
    ].join('\n'));
  }

  get src() {
    return `${getInputAsString(this.previousInput)}${getInputAsString(this.mostRecentInput)}`;
  }

  get errorForMostRecentInput() {
    return [
      INPUT_PARSER_ERROR_HEADER_MESSAGE,
      '',
      ...buildErrorPosition(getInputAsString(this.mostRecentInput), this.pos),
    ].join('\n');
  }
}
