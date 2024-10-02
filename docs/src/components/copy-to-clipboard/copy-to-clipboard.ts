import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { css as emotionCSS } from '@emotion/css';
import { classMap } from 'lit/directives/class-map.js';
export const TAG_NAME = 'copy-to-clipboard';


const ANIMATION_DURATION = 1000;

export class CopyToClipboard extends LitElement {
  static metadata = {
    tag: TAG_NAME,
    version: '0.1.0',
  };

  static styles = css`
    #container {
      position: relative;
    }

    sl-button {
      position: absolute;
      bottom: 4px;
      right: 4px;
    }

    svg {
      cursor: pointer;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -8px;
      margin-top: -7px;
    }

    #copy,
    #check {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: var(--sl-color-neutral-500);
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 50;
      transition: all 300ms ease-in-out;
    }

    #copy {
      stroke-dashoffset: 0;
      &.copied {
        stroke-dashoffset: -50;
      }
    }

    #check {
      stroke: var(--sl-color-success-700);
      stroke-dashoffset: -50;

      &.copied {
        stroke-dashoffset: 0;
      }
    }
  `;

  @state() copied = false;

  timer: number | undefined;

  disconnectedCallback(): void {
    clearTimeout(this.timer);
  }

  copy(e: Event) {
    e.preventDefault();
    const text = this.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text);

    this.copied = true;

    clearTimeout(this.timer);

    // Remove the animation class after the animation is completed
    this.timer = setTimeout(() => {
      this.copied = false;
    }, ANIMATION_DURATION);
  }

  renderCopy() {
    return html`
      <svg id="copy" class=${classMap({ copied: this.copied })} >
        <path d="M5.75 4.75H10.25V1.75H5.75V4.75Z" />
        <path d="M3.25 2.88379C2.9511 3.05669 2.75 3.37987 2.75 3.75001V13.25C2.75 13.8023 3.19772 14.25 3.75 14.25H12.25C12.8023 14.25 13.25 13.8023 13.25 13.25V3.75001C13.25 3.37987 13.0489 3.05669 12.75 2.88379" />
      </svg>
    `;
  }

  renderCheck() {
    return html`
      <svg id="check" class=${classMap({ copied: this.copied })} >
        <path d="M13.25 4.75L6 12L2.75 8.75" />
      </svg>
    `;
  }


  renderButton() {
    return html`<sl-button @click=${this.copy} circle size="small">${this.renderCheck()}${this.renderCopy()}</sl-button>`;
  }

  render() {
    return html`
      <div id="container">
        <slot></slot>
        ${this.renderButton()}
      </div>
    `;
  }
}

