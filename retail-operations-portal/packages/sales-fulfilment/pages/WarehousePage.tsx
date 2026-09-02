import { SimpleListPage } from "@/shared/components/SimpleListPage";
import { listWarehouseStock } from "../api/warehouse";
import { listProducts, setProducts } from "@/modules/product-catalog";
import { setWarehouseStock } from "../store/warehouseSlice";
import { useAppSelector } from "@/shared/store/hooks";
import { useLoadList } from "@/shared/store/useLoadList";

// Referenced from ProductDetailsPage — same data shown two ways (cross-domain coupling material).
export function WarehousePage() {
  const stock = useAppSelector((s) => s.warehouse.items);
  useLoadList(useAppSelector((s) => s.warehouse.loaded), listWarehouseStock, setWarehouseStock);
  const products = useAppSelector((s) => s.products.items);
  useLoadList(useAppSelector((s) => s.products.loaded), listProducts, setProducts);

  const productName = (id: string) => products.find((p) => p.id === id)?.name ?? id;

  return (
    <SimpleListPage
      title="Stany magazynowe"
      columns={[
        { key: "product", header: "Produkt", render: (w) => productName(w.productId) },
        { key: "location", header: "Lokalizacja", render: (w) => w.location },
        { key: "quantity", header: "Ilość", render: (w) => w.quantity },
        { key: "reserved", header: "Zarezerwowane", render: (w) => w.reserved },
        { key: "available", header: "Dostępne", render: (w) => w.quantity - w.reserved },
      ]}
      rows={stock}
      getRowId={(w) => w.id}
      searchText={(w) => productName(w.productId)}
    />
  );
}
