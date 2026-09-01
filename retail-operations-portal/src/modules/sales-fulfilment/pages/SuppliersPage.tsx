import { Badge } from "@/shared/components/ui/badge";
import { SimpleListPage } from "@/shared/components/SimpleListPage";
import { listSuppliers } from "../api/suppliers";
import { setSuppliers } from "../store/suppliersSlice";
import { useAppSelector } from "@/shared/store/hooks";
import { useLoadList } from "@/shared/store/useLoadList";

// Extraction candidate #2 (Dzień 1, Blok C4) — or left untouched as D3 kontrprzykład material.
export function SuppliersPage() {
  const suppliers = useAppSelector((s) => s.suppliers.items);
  useLoadList(useAppSelector((s) => s.suppliers.loaded), listSuppliers, setSuppliers);

  return (
    <SimpleListPage
      title="Dostawcy"
      columns={[
        { key: "name", header: "Nazwa", render: (s) => s.name },
        { key: "email", header: "Kontakt", render: (s) => s.contactEmail },
        { key: "country", header: "Kraj", render: (s) => s.country },
        {
          key: "status",
          header: "Status",
          render: (s) => (
            <Badge variant={s.status === "active" ? "default" : "secondary"}>
              {s.status === "active" ? "Aktywny" : "Nieaktywny"}
            </Badge>
          ),
        },
      ]}
      rows={suppliers}
      getRowId={(s) => s.id}
      searchText={(s) => s.name}
    />
  );
}
