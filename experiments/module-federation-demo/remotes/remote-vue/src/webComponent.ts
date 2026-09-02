import Widget from './Widget';
import { defineVueWebComponent, defineVueWebComponentHandRolled } from '@mfe/bridge-vue';

// Well-known bridge: Vue's built-in defineCustomElement, shadow DOM included.
defineVueWebComponent('remote-vue-widget', Widget);

// Hand-rolled bridge kept side by side for comparison.
defineVueWebComponentHandRolled('remote-vue-widget-simple', Widget, []);
