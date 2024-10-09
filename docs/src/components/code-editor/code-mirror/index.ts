import { define } from "../../../utils/define.js";
import { TAG_NAME, CodeEditorCodeMirror } from "./code-mirror.js";

define(CodeEditorCodeMirror);

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: CodeEditorCodeMirror;
  }
}

