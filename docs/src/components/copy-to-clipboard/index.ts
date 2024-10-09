import { define } from "../../utils/define.js";
import { TAG_NAME, CopyToClipboard } from "./copy-to-clipboard.js";

define(CopyToClipboard);

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: CopyToClipboard;
  }
}


