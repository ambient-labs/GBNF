import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export const TAG_NAME = 'code-console';

export type LineType = 'info' | 'log' | 'warn' | 'error';
export interface Line {
  type: LineType;
  data: unknown[];
}

export class CodeConsole extends LitElement {
  static metadata = {
    tag: TAG_NAME,
    version: '0.1.0',
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      font-family: monospace;
      font-size: 12px;
      line-height: 1.5;
      background-color: var(--color-code-console-background);
      // border-top: 1px solid var(--color-code-console-border);
      border: 1px solid var(--color-code-console-border);
      // color: #333;
      --inner-padding: calc(var(--padding) * .5);
      padding: 0;
    }

    .line {
      --y-padding: calc(var(--padding) * .25);
      --x-padding: calc(var(--padding) * 1 + var(--inner-padding));
      --extra-padding: calc(var(--padding) * .25);
      padding-top: calc(var(--y-padding) + (var(--extra-padding) * 2));
      padding-right: var(--x-padding);
      padding-bottom: calc(var(--y-padding) + var(--extra-padding));
      padding-left: var(--x-padding);
      border-bottom: 1px solid var(--color-code-console-border);
      white-space: pre;
      border-radius: calc(var(--padding) * .5);
      position: relative;
      margin-bottom: var(--inner-padding);
      white-space: break-spaces;

      &:first-child {
        padding-top: calc(var(--inner-padding) * 2);
      }

      &:last-child {
        border-bottom: none;
        margin-bottom: var(--inner-padding) ;
      }

        sl-icon {
          position: absolute;
          top: calc(var(--padding) * 1);
          left: calc(var(--padding) * .5);
          z-index: 1;
        }

      &.warn {
        background-color: var(--color-code-console-warn-background);
        sl-icon {
          color: var(--color-code-console-warn-color);
        }
      }

      &.error {
        background-color: var(--color-code-console-error-background);
        text-indent: calc(var(--padding) * 2);
        sl-icon {
          color: var(--color-code-console-error-color);
        }
      }
    }

    .item {
      display: inline;
      &.number, &.boolean {
        color: var(--color-code-console-number);
      }
      &.string {
        color: var(--color-code-console-string);
        &.single {
          color: var(--color-code-console-string-single);
        }
      }
      &.null {
        color: var(--color-code-console-null);
      }
    }
  `;

  @property({ type: Array })
  output: Line[] = [];

  renderItem(item: unknown, items: number) {
    return html`<div class=${classMap({
      item: true,
      number: typeof item === 'number',
      string: typeof item === 'string',
      boolean: typeof item === 'boolean',
      null: item === null,
      undefined: item === undefined,
      single: items === 1,
    })}>${renderItem(item, items)}</div>`;
  }

  render() {
    return html`${this.output.map((line) => {
      return html`
      <div class=${classMap({
        line: true,
        [`${line.type}`]: true,
      })}>${getIcon(line.type)}${line.data.map(item => html`${this.renderItem(item, line.data.length)} `)}</div>
    `;
    })}`;
  }
}

const getIcon = (type: LineType) => {
  if (type === 'error') {
    return html`<sl-icon name='x-circle-fill'></sl-icon>`;
  }
  if (type === 'warn') {
    return html`<sl-icon name='exclamation-triangle-fill'></sl-icon>`;
  }
  return '';
  // return html`<sl-icon name='chevron-left'></sl-icon>`;
}

const renderItem = (item: unknown, items: number) => {
  if (typeof item === 'object' && item !== null) {
    return JSON.stringify(item);
  }
  if (item === null) {
    return 'null';
  }
  if (item === undefined) {
    return 'undefined';
  }
  if (typeof item === 'string' && items > 1) {
    return JSON.stringify(item);
  }
  return item;
}
