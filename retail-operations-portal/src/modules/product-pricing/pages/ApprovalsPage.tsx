import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DataTable } from "@/shared/components/DataTable";
import { ApprovalActionBar } from "../components/ApprovalActionBar";
import { listPromotions, approvePromotion, rejectPromotion } from "../api/promotions";
import { setPromotions, upsertPromotion } from "../store/promotionsSlice";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { useLoadList } from "@/shared/store/useLoadList";

// Route guard target for Dzień 3 (Blok A2) — only admin/manager can act here.
export function ApprovalsPage() {
  const dispatch = useAppDispatch();
  const allPromotions = useAppSelector((s) => s.promotions.items);
  const promotions = allPromotions.filter((p) => p.status === "pending_approval");
  useLoadList(useAppSelector((s) => s.promotions.loaded), listPromotions, setPromotions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kolejka akceptacji</CardTitle>
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
            { key: "createdBy", header: "Utworzył", render: (p) => p.createdBy },
            {
              key: "action",
              header: "",
              render: (p) => (
                <ApprovalActionBar
                  onApprove={async () => {
                    const updated = await approvePromotion(p.id, "Jan Kowalski");
                    dispatch(upsertPromotion(updated));
                    toast.success(`Zaakceptowano "${p.name}"`);
                  }}
                  onReject={async () => {
                    const updated = await rejectPromotion(p.id, "Odrzucono w kolejce akceptacji");
                    dispatch(upsertPromotion(updated));
                    toast.error(`Odrzucono "${p.name}"`);
                  }}
                />
              ),
            },
          ]}
          rows={promotions}
          getRowId={(p) => p.id}
          emptyMessage="Brak pozycji do akceptacji."
        />
      </CardContent>
    </Card>
  );
}
