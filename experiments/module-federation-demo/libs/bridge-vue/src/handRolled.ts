import { createApp, h, type Component, type App } from 'vue';

// Hand-rolled route: mounts a plain Vue app inside a custom element.
// Simplified vs. defineCustomElement: no shadow DOM, no reactive prop/attribute
// binding, and the whole app remounts on every observed attribute change.
export function defineVueWebComponentHandRolled(
  tagName: string,
  component: Component,
  observedAttrs: string[] = [],
) {
  if (customElements.get(tagName)) return;

  class HandRolledElement extends HTMLElement {
    static get observedAttributes() {
      return observedAttrs;
    }

    private app: App | null = null;
    private mountPoint: HTMLDivElement | null = null;

    connectedCallback() {
      this.mountPoint = document.createElement('div');
      this.appendChild(this.mountPoint);
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    disconnectedCallback() {
      this.app?.unmount();
      this.app = null;
    }

    private render() {
      if (!this.mountPoint) return;
      this.app?.unmount();
      const props = observedAttrs.reduce((acc: Record<string, string | null>, attr) => {
        acc[attr] = this.getAttribute(attr);
        return acc;
      }, {});
      this.app = createApp({ render: () => h(component, props) });
      this.app.mount(this.mountPoint);
    }
  }

  customElements.define(tagName, HandRolledElement);
}
