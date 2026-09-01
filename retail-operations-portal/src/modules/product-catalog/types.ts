import type { ID } from "@/shared/types";

export interface Category {
  id: ID;
  name: string;
}

export interface Product {
  id: ID;
  sku: string;
  name: string;
  categoryId: ID;
  price: number;
  unit: string;
  status: "active" | "inactive";
}
