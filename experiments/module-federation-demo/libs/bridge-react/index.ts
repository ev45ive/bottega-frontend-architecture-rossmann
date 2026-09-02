import r2wc from '@r2wc/react-to-web-component';
import type { ComponentType } from 'react';

type PropTypeMap<P> = Partial<Record<keyof P, 'string' | 'number' | 'boolean' | 'function' | 'json'>>;

// Well-known route: delegates prop diffing, attribute reflection and unmount
// lifecycle to a battle-tested library instead of reimplementing them.
export function defineReactWebComponent<P extends Record<string, unknown>>(
  tagName: string,
  Component: ComponentType<P>,
  props?: PropTypeMap<P>,
) {
  if (customElements.get(tagName)) return;
  const WebComponent = r2wc(Component, { props } as never);
  customElements.define(tagName, WebComponent);
}
