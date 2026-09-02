import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Provider } from "react-redux";

import { store } from "@mfe/shared-store";
import { queryClient } from "@mfe/shared-query";

interface AppProps {
  // Loaded at runtime via loadRemote() — never imported statically, since
  // this shell has no build-time `remotes` map for webpack to resolve.
  CartPanel: React.ComponentType<{ message: string }>;
}

export function App({ CartPanel }: AppProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <CartPanel message="" />
      </QueryClientProvider>
    </Provider>
  );
}
