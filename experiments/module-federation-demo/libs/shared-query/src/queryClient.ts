import { QueryClient } from '@tanstack/query-core';

// Module singleton: shared as a Module Federation singleton so host + every
// remote read/write the exact same cache instead of each holding its own copy.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});
