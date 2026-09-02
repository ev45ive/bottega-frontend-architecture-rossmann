import { defineCustomElement, type Component } from 'vue';

// Well-known route: Vue's built-in helper handles props, emits, slots and
// shadow-DOM encapsulation out of the box.
export function defineVueWebComponent(tagName: string, component: Component) {
  if (customElements.get(tagName)) return;
  const CE = defineCustomElement(component);
  customElements.define(tagName, CE);
}
