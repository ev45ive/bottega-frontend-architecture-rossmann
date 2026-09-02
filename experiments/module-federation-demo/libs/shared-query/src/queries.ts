import { fetchProducts, fetchUserProfile } from './mockApi';

// Framework-agnostic query descriptors: React/Vue adapters just plug these into
// their own useQuery/useMutation hooks so the query key + fetcher stay single-sourced.
export const productsQuery = {
  queryKey: ['products'] as const,
  queryFn: fetchProducts,
};

export const userProfileQuery = {
  queryKey: ['user-profile'] as const,
  queryFn: fetchUserProfile,
};
