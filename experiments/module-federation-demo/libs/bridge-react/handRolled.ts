



import { createElement, type ComponentType } from 'react';
import { createRoot, type Root } from 'react-dom/client';

// Hand-rolled route: mounts a React tree inside a custom element.
// Simplified vs. the well-known lib: no per-prop patching (whole tree re-renders on
// any attribute change), no non-string prop types, no React Context bridging.
export function defineReactWebComponentHandRolled<P extends Record<string, string>>(
  tagName: string,
  Component: ComponentType<P>,
  observedAttrs: (keyof P & string)[] = [],
) {
  if (customElements.get(tagName)) return;

  class HandRolledElement extends HTMLElement {
    static get observedAttributes() {
      return observedAttrs;
    }

    private root: Root | null = null;

    connectedCallback() {
      this.root = createRoot(this);
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    disconnectedCallback() {
      this.root?.unmount();
      this.root = null;
    }

    private render() {
      if (!this.root) return;
      const props = observedAttrs.reduce((acc, attr) => {
        acc[attr] = (this.getAttribute(attr) ?? '') as P[typeof attr];
        return acc;
      }, {} as P);
      this.root.render(createElement(Component, props));
    }
  }

  customElements.define(tagName, HandRolledElement);
}
