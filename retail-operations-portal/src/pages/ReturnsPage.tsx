import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { listReturns, updateReturnStatus } from "@/api/returns";
import { listOrders } from "@/api/orders";
import { setReturns, upsertReturn } from "@/store/returnsSlice";
import { setOrders } from "@/store/ordersSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLoadList } from "@/store/useLoadList";

// Fully isolated domain — easy extraction exercise from scratch (unlike Products/Suppliers).
export function ReturnsPage() {
  const dispatch = useAppDispatch();
  const returns = useAppSelector((s) => s.returns.items);
  useLoadList(useAppSelector((s) => s.returns.loaded), listReturns, setReturns);
  const orders = useAppSelector((s) => s.orders.items);
  useLoadList(useAppSelector((s) => s.orders.loaded), listOrders, setOrders);

  const orderNumber = (id: string) => orders.find((o) => o.id === id)?.orderNumber ?? id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zwroty i reklamacje</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={[
            { key: "order", header: "Zamówienie", render: (r) => orderNumber(r.orderId) },
            { key: "reason", header: "Powód", render: (r) => r.reason },
            { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            {
              key: "action",
              header: "",
              render: (r) =>
                r.status === "requested" && (
                  <Button
                    size="sm"
                    onClick={async () =>
                      dispatch(upsertReturn(await updateReturnStatus(r.id, "approved")))
                    }
                  >
                    Zatwierdź
                  </Button>
                ),
            },
          ]}
          rows={returns}
          getRowId={(r) => r.id}
        />
      </CardContent>
    </Card>
  );
}
