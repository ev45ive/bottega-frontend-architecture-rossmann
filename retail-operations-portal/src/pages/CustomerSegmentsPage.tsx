import { SimpleListPage } from "@/components/SimpleListPage";
import { listCustomerSegments } from "@/api/customerSegments";
import { setCustomerSegments } from "@/store/customerSegmentsSlice";
import { useAppSelector } from "@/store/hooks";
import { useLoadList } from "@/store/useLoadList";

// Ownership/Conway's Law material: conceptually owned by Marketing, not Merchandising.
export function CustomerSegmentsPage() {
  const segments = useAppSelector((s) => s.customerSegments.items);
  useLoadList(
    useAppSelector((s) => s.customerSegments.loaded),
    listCustomerSegments,
    setCustomerSegments,
  );

  return (
    <SimpleListPage
      title="Segmenty klientów"
      columns={[
        { key: "name", header: "Nazwa", render: (s) => s.name },
        { key: "description", header: "Opis", render: (s) => s.description },
        { key: "criteria", header: "Kryterium", render: (s) => s.criteria },
      ]}
      rows={segments}
      getRowId={(s) => s.id}
      searchText={(s) => s.name}
    />
  );
}
