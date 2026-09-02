import { init, registerRemotes, loadRemote } from '@module-federation/enhanced/runtime';

// import { store, cartSelectors } from '@mfe/shared-store';

// function renderCartBadge() {
//   const badge = document.getElementById('cart-count');
//   if (!badge) return;
//   const items = cartSelectors.selectAll(store.getState().cart);
//   badge.textContent = String(items.reduce((sum, item) => sum + item.qty, 0));
// }

async function mountRemotes() {
  // Dynamic strategy: URLs come from a runtime-fetched config (could just as
  // easily be an API response), not from webpack.config.js.
  const remoteUrls: Record<string, string> = await fetch('/remotes.config.json').then((res) => res.json());

  init({ name: 'shellDynamic', remotes: [] });
  registerRemotes(Object.entries(remoteUrls).map(([name, entry]) => ({ name, entry })));

  await Promise.all([
    loadRemote('remoteJs/Widget'),
    loadRemote('remoteReact/Widget'),
    // loadRemote('remoteVue/WebComponent'),
  ]);

  const container = document.getElementById('remotes');
  if (!container) return;
  container.innerHTML = `
    <remote-js-widget label="From shell-dynamic"></remote-js-widget>
    <div>
      <p><strong>React bridge:</strong> well-known vs. hand-rolled</p>
      <remote-react-widget></remote-react-widget>
      <remote-react-widget-simple></remote-react-widget-simple>
    </div>
    <div>
      <p><strong>Vue bridge:</strong> well-known vs. hand-rolled</p>
      <remote-vue-widget></remote-vue-widget>
      <remote-vue-widget-simple></remote-vue-widget-simple>
    </div>
  `;
}

mountRemotes();

// store.subscribe(renderCartBadge);
// renderCartBadge();
