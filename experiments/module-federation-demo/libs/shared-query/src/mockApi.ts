export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface UserProfileDto {
  id: string;
  name: string;
  email: string;
}

// Stand-in backend latency so loading/error states are actually observable in the demo.
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Mechanical Keyboard', price: 129 },
  { id: 'p2', name: 'Ultrawide Monitor', price: 449 },
  { id: 'p3', name: 'USB-C Dock', price: 89 },
];

const PROFILE: UserProfileDto = { id: 'u1', name: 'Ada Lovelace', email: 'ada@example.com' };

export async function fetchProducts(): Promise<Product[]> {
  await delay(400);
  return PRODUCTS;
}

export async function fetchUserProfile(): Promise<UserProfileDto> {
  await delay(250);
  return PROFILE;
}
