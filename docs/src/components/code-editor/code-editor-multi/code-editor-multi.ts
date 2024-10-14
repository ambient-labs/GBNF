import {
  LitElement,
  PropertyValues,
  css,
  html,
  unsafeCSS
} from 'lit';
import {
  property,
  state,
} from 'lit/decorators.js';
import 'https://cdn.jsdelivr.net/npm/@vanillawc/wc-codemirror@2.1.0/index.min.js';
import 'https://cdn.jsdelivr.net/npm/@vanillawc/wc-codemirror@2.1.0/mode/javascript/javascript.js';
import 'https://cdn.jsdelivr.net/npm/@vanillawc/wc-codemirror@2.1.0/mode/python/python.js';
import style from './code-editor-multi.css?raw';
import { broadcast, persist } from '../persist.js';
import { SlottedTextObserverController } from '../slot-controller.js';
export const TAG_NAME = 'code-editor-multi';
import { getTemplates } from './get-templates.js';
import type { Templates } from './types.js';

export class CodeEditorMulti extends LitElement {
  static styles = unsafeCSS(style);

  static readonly metadata = {
    version: '0.1.0',
    tag: TAG_NAME,
  };

  @state() templates: Templates = {};
  @property() language: string = '';
  @property({ type: Boolean }) autorun = false;

  selectLanguage = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const language = target.value;
    this.language = language;
    persist('language', language, TAG_NAME);
  }

  private slottedTextObserver = new SlottedTextObserverController(this, async () => {
    this.templates = getTemplates(this);
  });


  get languages() {
    return Object.keys(this.templates);
  }

  get script() {
    return this.templates[this._language];
  }

  get _language() {
    return this.languages.includes(this.language) ? this.language : this.languages[0];
  }

  protected render() {
    const { languages, _language: language, script, autorun, } = this;
    if (!language) {
      return html`<slot></slot>`;
    }
    return html`
      <code-editor 
      ?autorun=${autorun} 
      language="${language}"><sl-select slot="left" size="small" value="${language}" @sl-change=${this.selectLanguage}>
          ${languages.map((lang) => html`<sl-option value="${lang}">${lang}</sl-option>`)}
        </sl-select>${script}</code-editor>
      <slot></slot>
    `;
  }
}
