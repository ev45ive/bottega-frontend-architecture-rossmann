import { createApp, h } from 'vue';
import Widget from './Widget';
import './webComponent';

const root = document.getElementById('root');
if (root) {
  createApp({ render: () => h(Widget) }).mount(root);
}
