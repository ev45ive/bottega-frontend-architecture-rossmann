import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { listProducts } from "@/api/products";
import { listCategories } from "@/api/categories";
import { setProducts } from "@/store/productsSlice";
import { setCategories } from "@/store/categoriesSlice";
import { useAppSelector } from "@/store/hooks";
import { useLoadList } from "@/store/useLoadList";

// Extraction candidate #1 (Dzień 1, Blok C1) — first screen pulled out into its own remote.
export function ProductsPage() {
  const products = useAppSelector((s) => s.products.items);
  const productsLoaded = useAppSelector((s) => s.products.loaded);
  useLoadList(productsLoaded, listProducts, setProducts);

  const categories = useAppSelector((s) => s.categories.items);
  const categoriesLoaded = useAppSelector((s) => s.categories.loaded);
  useLoadList(categoriesLoaded, listCategories, setCategories);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produkty</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={[
            { key: "sku", header: "SKU", render: (p) => p.sku },
            {
              key: "name",
              header: "Nazwa",
              render: (p) => (
                <Link to={`/products/${p.id}`} className="hover:underline">
                  {p.name}
                </Link>
              ),
            },
            { key: "category", header: "Kategoria", render: (p) => categoryName(p.categoryId) },
            { key: "price", header: "Cena", render: (p) => `${p.price.toFixed(2)} zł` },
            { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
          ]}
          rows={products}
          getRowId={(p) => p.id}
          searchText={(p) => `${p.sku} ${p.name}`}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          bulkActions={
            <Button
              size="sm"
              onClick={() => {
                toast.success(`Dodano ${selectedIds.size} produktów do nowej promocji`);
                setSelectedIds(new Set());
              }}
            >
              Dodaj {selectedIds.size} do promocji
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}
