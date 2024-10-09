
import { define } from "../../../utils/define.js";
import { TAG_NAME, CodeConsole } from "./code-console.js";

define(CodeConsole);

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: CodeConsole;
  }
}

