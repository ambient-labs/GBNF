import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import React, { ComponentClass, FunctionComponent } from 'react';
import { createRoot } from 'react-dom/client';

export const TAG_NAME = 'react-wrapper';
type ReactComponent = string | FunctionComponent<Record<string, unknown>> | ComponentClass<Record<string, unknown>, any>;

export class ReactWrapper extends LitElement {
  static metadata = {
    tag: TAG_NAME,
    version: '0.1.0',
  };

  @property({ type: Object })
  reactComponent?: ReactComponent;

  @property({ type: Object })
  props: Record<string, unknown> = {};

  firstUpdated() {
    this.renderReactComponent();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('reactProps')) {
      this.renderReactComponent();
    }
  }

  renderReactComponent() {
    if (this.shadowRoot && this.reactComponent) {
      const root = createRoot(this.shadowRoot);
      root.render(React.createElement(this.reactComponent, this.props));
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    alert('disconnectedCallback');
    // if (this.root) {
    //   this.root.unmount();
    // }
  }

  render() {
    return html``;
  }
}
