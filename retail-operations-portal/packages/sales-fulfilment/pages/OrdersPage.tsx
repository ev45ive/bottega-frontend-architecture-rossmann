import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DataTable } from "@/shared/components/DataTable";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { listOrders, approveOrder, cancelOrder } from "../api/orders";
import { setOrders, upsertOrder } from "../store/ordersSlice";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { useLoadList } from "@/shared/store/useLoadList";

// CRUD vs CQRS buffer material: approveOrder/cancelOrder are intentional commands, not a generic PATCH.
export function OrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((s) => s.orders.items);
  useLoadList(useAppSelector((s) => s.orders.loaded), listOrders, setOrders);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zamówienia</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={[
            { key: "number", header: "Numer", render: (o) => o.orderNumber },
            { key: "customer", header: "Klient", render: (o) => o.customerName },
            { key: "total", header: "Kwota", render: (o) => `${o.total.toFixed(2)} zł` },
            { key: "status", header: "Status", render: (o) => <StatusBadge status={o.status} /> },
            {
              key: "actions",
              header: "",
              render: (o) =>
                o.status === "new" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={async () => dispatch(upsertOrder(await approveOrder(o.id)))}
                    >
                      Zaakceptuj
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () =>
                        dispatch(upsertOrder(await cancelOrder(o.id, "Anulowano ręcznie")))
                      }
                    >
                      Anuluj
                    </Button>
                  </div>
                ),
            },
          ]}
          rows={orders}
          getRowId={(o) => o.id}
          searchText={(o) => `${o.orderNumber} ${o.customerName}`}
        />
      </CardContent>
    </Card>
  );
}
