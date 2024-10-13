import { define } from "../../../utils/define.js";
import { TAG_NAME, CodeEditor } from "./code-editor.js";

define(CodeEditor);

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: CodeEditor;
  }
}
