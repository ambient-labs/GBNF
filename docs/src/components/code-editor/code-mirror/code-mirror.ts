import {
  LitElement,
  PropertyValueMap,
  PropertyValues,
  css,
  html,
  unsafeCSS
} from 'lit';
import {
  Ref,
  createRef,
  ref
} from 'lit/directives/ref.js';
import {
  property,
  state,
} from 'lit/decorators.js';
import 'https://cdn.jsdelivr.net/npm/@vanillawc/wc-codemirror@2.1.0/index.min.js';
import 'https://cdn.jsdelivr.net/npm/@vanillawc/wc-codemirror@2.1.0/mode/javascript/javascript.js';
import { emit } from '../../../utils/emit.js';
import style from './code-mirror.css?raw';
import { THEMES } from './themes.js';
import { SlottedTextObserverController } from '../slot-controller.js';

export const TAG_NAME = 'code-editor-wc-codemirror';

interface WCCodeMirror extends HTMLElement {
  value: string;
  editor: any;
}

export class CodeEditorCodeMirror extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static styles = unsafeCSS(style);

  static readonly metadata = {
    version: '0.1.0',
    tag: TAG_NAME,
  };

  ref: Ref<WCCodeMirror> = createRef();

  private slottedTextObserver = new SlottedTextObserverController(this, (target) => {
    const childNodes = target.assignedNodes({ flatten: true });
    this.script = childNodes.map((node) => {
      if (typeof node === 'string') {
        return node;
      }
      return node.textContent ?? '';
    }).join('');
  });

  @state()
  script = '';

  @property({ type: String })
  theme?: string;

  get codeMirror(): WCCodeMirror {
    const codeMirror = this.ref.value;
    if (!codeMirror) {
      throw new Error('CodeMirror not found');
    }
    return codeMirror;
  }

  protected updated(_changedProperties: PropertyValues): void {
    if (_changedProperties.has('script') && this.script !== this.codeMirror.value) {
      this.codeMirror.value = this.script;
    }
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    const { codeMirror } = this;
    const editor = codeMirror.editor;
    editor.keyMap = 'vim';
    editor.on('change', () => {
      const value = editor.getValue();
      this.script = value;
      emit(this, 'change', { value });
    });
  }

  protected render() {
    const { theme } = this;
    return html`
      <wc-codemirror 
        mode="javascript" 
        theme="${theme}" 
        ${ref(this.ref)}
      >
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vanillawc/wc-codemirror/theme/${theme}.css">
        ${THEMES.map((theme) => html`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vanillawc/wc-codemirror/theme/${theme}.css">`)}
        <slot></slot>
      </wc-codemirror>
    `;
  }
}

