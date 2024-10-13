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
import 'https://cdn.jsdelivr.net/npm/@vanillawc/wc-codemirror@2.1.0/mode/python/python.js';
import { CodeEditorCodeMirror } from '../code-mirror/code-mirror.js';
import { AbortError, ScriptWorker } from '../worker/script-worker.js';
import { getLocalItem, persist } from '../persist.js';
import { getScript } from './get-script.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import { prepareScript } from './prepare-script.js';
import { getHTML, getHTMLMode } from './get-html-mode.js';
import type { CodeConsole } from '../code-console/code-console.js';
import style from './code-editor.css?raw';
import { getVisibleTheme } from './get-visible-theme.js';
import {
  isMode,
  type SupportedLanguage,
  type Mode,
  isSupportedLanguage
} from './types.js';

export const TAG_NAME = 'code-editor';

const workerPath = new URL('../worker/worker.ts', import.meta.url).href;

export class CodeEditor extends LitElement {
  static styles = unsafeCSS(style);

  static readonly metadata = {
    version: '0.1.0',
    tag: TAG_NAME,
  };

  worker = new ScriptWorker(workerPath, data => {
    this.output.push(data);
    this.requestUpdate();
    this.codeConsole.value?.requestUpdate();
  });

  @property({ type: Boolean })
  autorun = false;

  @property({ type: String })
  protected theme: string = getLocalItem('theme') ?? 'Default';

  @property({ type: String })
  language: string = getLocalItem('language') || 'javascript';

  @state()
  protected mode: string = getHTMLMode();

  @state()
  public output: ({ type: 'log' | 'error', data: unknown[] })[] = [];

  @state()
  protected running = false;

  @state()
  protected hover = false;

  @state()
  protected fullscreen = false;

  @state()
  protected tempTheme?: string;

  // @state()
  // providedScript?: string;

  get _language(): SupportedLanguage {
    const { language } = this;
    if (language === '') {
      throw new Error('Language is a required property');
    }
    if (isSupportedLanguage(language)) {
      return language;
    }
    throw new Error(`Unsupported language: ${language}. Only javascript and python are supported.`);
  }

  get _mode(): Mode {
    const { mode } = this;
    if (isMode(mode)) {
      return mode;
    }
    console.warn(`Unsupported mode: ${mode}. Only dark and light are supported.`);
    return 'light';
  }

  set _mode(mode: Mode) {
    this.mode = mode;
  }

  constructor() {
    super();

    this.observer = new MutationObserver((mutations) => mutations.forEach(() => {
      this._mode = getHTMLMode();
    }));
    this.observer.observe(getHTML(), {
      attributes: true,
      attributeFilter: ['data-theme'],
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

  execute = async () => {
    if (this.running) {
      this.running = false;
      this.worker.abort();
    } else {
      this.running = true;
      // this.output = [];
      try {
        await this.worker.run(prepareScript(await getScript(this)), this._language);
      } catch (e) {
        if (!(e instanceof AbortError)) {
          console.error('error', e);
        }
      } finally {
        this.running = false;
      }
    }
  }

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

  handleThemeChange({ detail: { theme } }: CustomEvent<{ theme: string }>) {
    this.theme = theme;
  }

  protected updated(_changedProperties: PropertyValues): void {
    if (_changedProperties.has('theme')) {
      persist('theme', this.theme, TAG_NAME);
    }
    if (_changedProperties.has('language')) {
      this._language; // call the getter to ensure a valid language
      if (this.autorun) {
        if (this.running) {
          this.running = false;
          this.worker.abort();
        }
        this.execute();
      }
    }
  }

  handleHoverTheme = ({ detail: { theme } }: CustomEvent<{ theme: string }>) => this.tempTheme = theme;
  clearConsole = () => this.output = [];

  protected render() {
    const { output, language, fullscreen, theme, tempTheme, mode } = this;
    const codemirrorTheme = getVisibleTheme(mode, theme, tempTheme);
    return html`
      <div id="container" class="${fullscreen ? 'fullscreen' : ''}" @keydown=${this.handleKeydown} ${ref(this.container)}>
        <code-editor-actions 
          .theme=${theme || 'Default'} 
          .fullscreen=${fullscreen} 
          .language=${language}
          @hover-theme=${this.handleHoverTheme}
          @select-theme=${this.handleThemeChange} 
          @toggle-fullscreen=${this.toggleFullscreen}
        >
          <slot name="left" slot="left"><label>${language}</label></slot>

          </code-editor-actions>
          <div id="codemirror-container">
            <code-editor-wc-codemirror
            theme="${codemirrorTheme}"
            ${ref(this.ref)}
          ><slot></slot></code-editor-wc-codemirror>
        </div>
        <div id="output" class="${classMap({ 'active': output.length || this.running, })}">
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
          <code-console ${ref(this.codeConsole)} .output=${output}></code-console>
        </div>
      `;

  }
}
