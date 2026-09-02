import {
  init,
  registerRemotes,
  loadRemote,
} from "@module-federation/enhanced/runtime";

// import { store, cartSelectors } from '@mfe/shared-store';

// function renderCartBadge() {
//   const badge = document.getElementById('cart-count');
//   if (!badge) return;
//   const items = cartSelectors.selectAll(store.getState().cart);
//   badge.textContent = String(items.reduce((sum, item) => sum + item.qty, 0));
// }
import React from "react";
import { createRoot } from "react-dom/client";

async function mountRemotes() {
  // Dynamic strategy: URLs come from a runtime-fetched config (could just as
  // easily be an API response), not from webpack.config.js.
  const remoteUrls: Record<string, string> = await fetch(
    "/remotes.config.json",
  ).then((res) => res.json());

  init({ name: "shellDynamic", remotes: [] });
  registerRemotes(
    Object.entries(remoteUrls).map(([name, entry]) => ({ name, entry })),
  );

  const container = document.getElementById("remotes");

  // const { mount } = await loadRemote("remoteJs/Widget");

  const { CartPanel } = await loadRemote("remoteReact/Widget");

  if (container) {
    createRoot(container).render(
      React.createElement(CartPanel, {
        message: "banana",
      }),
    );
  }

  // const { default: WebComponent } = await loadRemote("remoteReact/WebComponent");
  // if (!container) return;
  // container.innerHTML = `
  //   <div>
  //     <p><strong>React bridge:</strong>
  //     <remote-react-widget message="Hey from shell"></remote-react-widget>
  //   </div>
  //   <div>
  //     <p><strong>Vue bridge:</strong> well-known vs. hand-rolled</p>
  //     <remote-vue-widget></remote-vue-widget>
  //     <remote-vue-widget-simple></remote-vue-widget-simple>
  //   </div>
  // `;
}

mountRemotes();

// store.subscribe(renderCartBadge);
// renderCartBadge();
