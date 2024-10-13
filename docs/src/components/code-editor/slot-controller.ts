import { ReactiveController, LitElement } from 'lit';
import { waitFor } from './wait-for.js';

const SLOT_TIMEOUT = 2000;

export class SlottedTextObserverController implements ReactiveController {
  private host: LitElement;
  private observer: MutationObserver;

  constructor(host: LitElement, protected callback: (slot: HTMLSlotElement) => (void | Promise<void>)) {
    this.host = host;
    this.observer = new MutationObserver(this.handleMutation.bind(this));
    host.addController(this);
  }

  hostConnected() {
    waitFor(() => !!this.slot, SLOT_TIMEOUT).then(() => {
      this.observeSlottedContent();
      this.slot.addEventListener('slotchange', this.handleSlotChange.bind(this));
      this.callback(this.slot);
    }).catch((e) => {
      console.error(e)
      console.error(`Did not find slot for element ${this.host.tagName} in ${SLOT_TIMEOUT}ms`);
    });
  }

  hostDisconnected() {
    this.observer.disconnect();
    this.slot.removeEventListener('slotchange', this.handleSlotChange.bind(this));
  }

  get slot() {
    const slot = this.host.shadowRoot?.querySelector('slot');
    if (!slot) {
      throw new Error(`Slot not found for element ${this.host.tagName}`);
    }
    return slot;
  }

  private observeSlottedContent() {
    const slottedNodes = this.slot.assignedNodes({ flatten: true });
    slottedNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        this.observer.observe(node, { characterData: true });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        this.observer.observe(node, { characterData: true, subtree: true });
      }
    });
  }

  private handleMutation(mutations: MutationRecord[]) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData') {
        this.callback(this.slot);
      }
    });
  }

  private handleSlotChange() {
    this.observer.disconnect();
    this.observeSlottedContent();
    this.callback(this.slot);
  }
}
