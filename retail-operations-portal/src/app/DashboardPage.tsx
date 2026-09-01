import { Link } from "react-router-dom";
import { KpiCard } from "@/shared/components/KpiCard";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { listPromotions, setPromotions } from "@/modules/product-pricing";
import { listOrders, listWarehouseStock, setOrders, setWarehouseStock } from "@/modules/sales-fulfilment";
import { useAppSelector } from "@/shared/store/hooks";
import { useLoadList } from "@/shared/store/useLoadList";

// Intentional "god component": reads Promotions + Orders + Warehouse state directly, no facade (A3 material).
export function DashboardPage() {
  const promotions = useAppSelector((s) => s.promotions.items);
  const promotionsLoaded = useAppSelector((s) => s.promotions.loaded);
  useLoadList(promotionsLoaded, listPromotions, setPromotions);

  const orders = useAppSelector((s) => s.orders.items);
  const ordersLoaded = useAppSelector((s) => s.orders.loaded);
  useLoadList(ordersLoaded, listOrders, setOrders);

  const warehouse = useAppSelector((s) => s.warehouse.items);
  const warehouseLoaded = useAppSelector((s) => s.warehouse.loaded);
  useLoadList(warehouseLoaded, listWarehouseStock, setWarehouseStock);

  const activePromotions = promotions.filter((p) => p.status === "active").length;
  const pendingApproval = promotions.filter((p) => p.status === "pending_approval").length;
  const newOrders = orders.filter((o) => o.status === "new").length;
  const lowStock = warehouse.filter((w) => w.quantity - w.reserved < 20).length;

  const recentPromotions = [...promotions]
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Aktywne promocje" value={activePromotions} />
        <KpiCard label="Promocje do akceptacji" value={pendingApproval} />
        <KpiCard label="Nowe zamówienia" value={newOrders} />
        <KpiCard label="Niski stan magazynowy" value={lowStock} hint="< 20 szt. dostępnych" />
      </div>

      <div className="rounded-md border p-4">
        <h2 className="mb-3 font-medium">Ostatnie promocje</h2>
        <ul className="space-y-2">
          {recentPromotions.map((p) => (
            <li key={p.id} className="flex items-center justify-between text-sm">
              <Link to={`/promotions/${p.id}`} className="hover:underline">
                {p.name}
              </Link>
              <StatusBadge status={p.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
