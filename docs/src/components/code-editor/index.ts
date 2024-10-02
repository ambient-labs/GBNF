import { define } from "../../utils/define.js";
import { TAG_NAME, CodeEditor } from "./code-editor.js";
import './code-mirror/index.js';
import './code-console/index.js';
import './code-editor-actions/index.js';

define(CodeEditor);

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: CodeEditor;
  }
}
