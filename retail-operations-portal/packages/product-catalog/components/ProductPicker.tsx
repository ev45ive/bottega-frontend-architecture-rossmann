import type { Product } from "../types";
import { DataTable } from "@/shared/components/DataTable";
import { StatusBadge } from "@/shared/components/StatusBadge";

interface ProductPickerProps {
  products: Product[];
  selectedIds: Set<string>;
  onSelectedIdsChange: (ids: Set<string>) => void;
}

// Reused inside the promotion wizard (step 1) — same table as /products, in "picker" mode.
export function ProductPicker({ products, selectedIds, onSelectedIdsChange }: ProductPickerProps) {
  return (
    <DataTable
      columns={[
        { key: "sku", header: "SKU", render: (p) => p.sku },
        { key: "name", header: "Nazwa", render: (p) => p.name },
        { key: "price", header: "Cena", render: (p) => `${p.price.toFixed(2)} zł` },
        { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
      ]}
      rows={products}
      getRowId={(p) => p.id}
      searchText={(p) => `${p.sku} ${p.name}`}
      selectedIds={selectedIds}
      onSelectedIdsChange={onSelectedIdsChange}
    />
  );
}
