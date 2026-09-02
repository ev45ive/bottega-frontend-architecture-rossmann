import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DataTable } from "@/shared/components/DataTable";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { listPromotions, runValidation } from "../api/promotions";
import { setPromotions, upsertPromotion } from "../store/promotionsSlice";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { useLoadList } from "@/shared/store/useLoadList";

// Shared workflow queue — same "walidacja" mechanism could later be reused by other domains (e.g. orders).
export function ValidationQueuePage() {
  const dispatch = useAppDispatch();
  const allPromotions = useAppSelector((s) => s.promotions.items);
  const promotions = allPromotions.filter((p) => p.status === "pending_validation");
  useLoadList(useAppSelector((s) => s.promotions.loaded), listPromotions, setPromotions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kolejka walidacji</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={[
            {
              key: "name",
              header: "Promocja",
              render: (p) => (
                <Link to={`/promotions/${p.id}`} className="hover:underline">
                  {p.name}
                </Link>
              ),
            },
            { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
            {
              key: "action",
              header: "",
              render: (p) => (
                <Button
                  size="sm"
                  onClick={async () => {
                    const updated = await runValidation(p.id);
                    dispatch(upsertPromotion(updated));
                  }}
                >
                  Uruchom walidację
                </Button>
              ),
            },
          ]}
          rows={promotions}
          getRowId={(p) => p.id}
          emptyMessage="Brak pozycji do walidacji."
        />
      </CardContent>
    </Card>
  );
}
