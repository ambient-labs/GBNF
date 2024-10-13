import { define } from "../../../utils/define.js";
import { TAG_NAME, CodeEditorMulti } from "./code-editor-multi.js";

define(CodeEditorMulti);

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: CodeEditorMulti;
  }
}
