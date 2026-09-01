import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { listPromotions } from "@/api/promotions";
import { setPromotions } from "@/store/promotionsSlice";
import { useAppSelector } from "@/store/hooks";
import { useLoadList } from "@/store/useLoadList";

export function PromotionsPage() {
  const promotions = useAppSelector((s) => s.promotions.items);
  const loaded = useAppSelector((s) => s.promotions.loaded);
  useLoadList(loaded, listPromotions, setPromotions);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Promocje</CardTitle>
        <Button
          size="sm"
          nativeButton={false}
          render={<Link to="/promotions/new">Nowa promocja</Link>}
        />
      </CardHeader>
      <CardContent>
        <DataTable
          columns={[
            {
              key: "name",
              header: "Nazwa",
              render: (p) => (
                <Link to={`/promotions/${p.id}`} className="hover:underline">
                  {p.name}
                </Link>
              ),
            },
            { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
            { key: "start", header: "Start", render: (p) => p.startDate },
            { key: "end", header: "Koniec", render: (p) => p.endDate },
            { key: "owner", header: "Utworzył", render: (p) => p.createdBy },
          ]}
          rows={promotions}
          getRowId={(p) => p.id}
          searchText={(p) => p.name}
        />
      </CardContent>
    </Card>
  );
}
