import { LitElement, RenderOptions, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { emit } from '../../../utils/emit.js';
import { THEMES } from '../code-mirror/themes.js';

export const TAG_NAME = 'code-editor-actions';

export class CodeEditorActions extends LitElement {
  static styles = css`
  sl-button {
    cursor: pointer;
  }

  #check {
    color: var(--sl-color-success-300);

    position: absolute;
    left: 5px;
    top: 10px;
  }
  `;
  static metadata = {
    tag: TAG_NAME,
    version: '0.1.0',
  };

  @property({ type: Boolean }) fullscreen = false;
  @property({ type: String }) theme?: string;

  toggleFullscreen = async () => {
    emit(this, 'toggle-fullscreen');
  }

  renderThemes = () => html`
      ${[
      'Default',
      ...THEMES,
    ].map((theme) => html`
        <sl-menu-item @click=${() => this.selectTheme(theme)} @mouseover=${() => this.selectTempTheme(theme)} @mouseout=${() => this.selectTempTheme(undefined)}>
          ${theme === this.theme ? html`<sl-icon id="check" size="small" name="check-lg"></sl-icon>` : ''} 
          ${theme || 'Default'}
        </sl-menu-item>
      `)}
    `;

  selectTheme = (theme?: string) => {
    emit(this, 'select-theme', { theme });
  }

  selectTempTheme = (theme?: string) => {
    emit(this, 'hover-theme', { theme });
  }

  render() {
    const { fullscreen } = this;
    const fullScreenIcon = fullscreen ? 'fullscreen-exit' : 'arrows-fullscreen';
    return html`
      <sl-button-group label="Code Editor Actions">
        <sl-button size="small"id="fullscreen" @click=${this.toggleFullscreen}>
          <sl-icon size="small" name="${fullScreenIcon}"></sl-icon>
        </sl-button>
        <sl-dropdown>
          <sl-button size="small" id="settings" slot="trigger" caret>
            <sl-icon size="small" name="palette"></sl-icon>
          </sl-button>
          <sl-menu>
            ${this.renderThemes()}
          </sl-menu>
        </sl-dropdown>
      </sl-button-group>
    `;
  }
}

