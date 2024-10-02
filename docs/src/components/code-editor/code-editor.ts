import {
  LitElement,
  PropertyValues,
  css,
  html,
  unsafeCSS
} from 'lit';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import {
  state,
} from 'lit/decorators.js';
import 'https://cdn.jsdelivr.net/npm/@vanillawc/wc-codemirror@2.1.0/index.min.js';
import 'https://cdn.jsdelivr.net/npm/@vanillawc/wc-codemirror@2.1.0/mode/javascript/javascript.js';
import { CodeEditorCodeMirror } from './code-mirror/code-mirror.js';
import style from './code-editor.css?raw';
import type { CodeConsole } from './code-console/code-console.js';
import { AbortError, ScriptWorker } from './worker/script-worker.js';

export const TAG_NAME = 'code-editor';

import gbnfURL from 'gbnf?url';
import { findAllImportsInScript } from './worker/find-all-imports-in-script.js';
import { property } from 'lit/decorators/property.js';
const IMPORT_MAP: Record<string, string> = {
  'gbnf': `${window.location.origin}${gbnfURL}`,
};

const GET_SCRIPT_TIMEOUT = 2000;
export class CodeEditor extends LitElement {
  static styles = unsafeCSS(style);

  static readonly metadata = {
    version: '0.1.0',
    tag: TAG_NAME,
  };

  worker = new ScriptWorker(new URL('./worker/worker.ts', import.meta.url).href, this);

  getHTMLMode = () => {
    const html = document.getElementsByTagName('html')[0];
    return html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  constructor() {
    super();

    const html = document.getElementsByTagName('html')[0];
    this.observer = new MutationObserver((mutations) => mutations.forEach(() => {
      this.mode = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }));
    this.observer.observe(html, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }


  @state()
  protected mode?: 'light' | 'dark' = this.getHTMLMode();

  @property({ type: Boolean })
  autorun = false;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.autorun) {
      this.execute();
    }
  }

  get script() {
    return new Promise<string>(async (resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Could not get script in ${GET_SCRIPT_TIMEOUT}ms`));
      }, GET_SCRIPT_TIMEOUT);
      const wait = (dur: number) => new Promise((resolve) => setTimeout(resolve, dur));

      let script = this.ref.value?.script;
      while (!script) {
        script = this.ref.value?.script;
        await wait(10);
      }
      clearTimeout(timer);
      resolve(script);
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observer.disconnect();
  }

  observer: MutationObserver;

  handleSubmit = (e: Event) => {
    e.preventDefault();
    this.execute();
  };

  handleKeydown = (e: KeyboardEvent) => {
    if (e.code === 'Enter' && e.metaKey) {
      this.execute();
    }
  }

  @state()
  public output: ({ type: 'log' | 'error', data: unknown[] })[] = [];

  @state()
  protected running = false;

  execute = async () => {
    if (this.running) {
      this.running = false;
      this.worker.abort();
    } else {
      this.running = true;
      // this.output = [];
      try {
        const script = await this.script;
        await this.worker.run(prepareScript(script));
      } catch (e) {
        if (!(e instanceof AbortError)) {
          console.error('error', e);
        }
      } finally {
        this.running = false;
      }
    }
  }

  @state()
  protected hover = false;

  mouseover = () => {
    if (this.running) {
      this.hover = true;
    }
  }
  mouseout = () => {
    this.hover = false;
  }

  ref: Ref<CodeEditorCodeMirror> = createRef();
  codeConsole: Ref<CodeConsole> = createRef();
  container: Ref<HTMLDivElement> = createRef();

  @state()
  protected fullscreen = false;
  toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      this.container.value?.requestFullscreen().then(() => {
        this.fullscreen = true;
      }).catch((err) => {
        alert(
          `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`,
        );
      });
    } else {
      document.exitFullscreen();
      this.fullscreen = false;
    }
  }

  @state()
  protected theme: string = localStorage.getItem('chosenTheme') ?? 'Default';

  handleThemeChange({ detail: { theme } }: CustomEvent<{ theme: string }>) {
    this.theme = theme;
  }

  protected updated(_changedProperties: PropertyValues): void {
    if (_changedProperties.has('theme')) {
      this.persistTheme(this.theme);
    }
  }

  persistTheme = (theme: string) => {
    if (theme === 'Default') {
      localStorage.removeItem('chosenTheme');
    } else {
      localStorage.setItem('chosenTheme', theme);
    }
    window.document.querySelectorAll('code-editor').forEach((editor) => {
      editor.theme = theme;
    });
  }

  get codemirrorTheme() {
    const { tempTheme, theme, mode } = this;
    if (tempTheme) {
      if (tempTheme === 'Default') {
        return mode === 'dark' ? 'seti' : 'solarized';
      }
      return tempTheme;
    }
    if (theme === 'Default') {
      return mode === 'dark' ? 'seti' : 'solarized';
    }
    return theme;
  }

  @state()
  protected tempTheme?: string;

  handleHoverTheme = ({ detail: { theme } }: CustomEvent<{ theme: string }>) => {
    this.tempTheme = theme;
  }

  clearConsole = () => {
    this.output = [];
  }

  protected render() {
    const { output, fullscreen, theme, codemirrorTheme } = this;
    return html`
      <div id="container" class="${fullscreen ? 'fullscreen' : ''}" @keydown=${this.handleKeydown} ${ref(this.container)}>
      <code-editor-actions 
        .theme=${theme || 'Default'} 
        .fullscreen=${fullscreen} 
        @hover-theme=${this.handleHoverTheme}
        @select-theme=${this.handleThemeChange} 
        @toggle-fullscreen=${this.toggleFullscreen}
      ></code-editor-actions>
        <div id="codemirror-container">
          <code-editor-wc-codemirror
          theme="${codemirrorTheme}"
          ${ref(this.ref)}
        >
            <slot></slot>
          </code-editor-wc-codemirror>
        </div>
        <div id="output" class="${output.length || this.running ? 'active' : ''}">

          <form @submit=${this.handleSubmit}>
            <sl-icon-button name='slash-circle' @click=${this.clearConsole}></sl-icon-button>
            <sl-button 
              type="submit"
              variant="default" 
              id="run" 
              size="small"
              @mouseover=${this.mouseover}
              @mouseout=${this.mouseout}
            >${this.running ? html`Abort` : html`Run <span>(⌘+⏎)</span>`}</sl-button>
          </form>
          <code-console ${ref(this.codeConsole)} .output=${output}>
          </code-console>
        </div>
      `;

  }
}

const prepareScript = (script: string = '') => {
  for (const { source, importName } of findAllImportsInScript(script)) {
    if (IMPORT_MAP[importName]) {
      script = script.replace(source, source.replace(importName, IMPORT_MAP[importName]));
    }
  }
  return script;
}
