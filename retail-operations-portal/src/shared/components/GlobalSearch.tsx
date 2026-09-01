import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/shared/components/ui/input";
import { useAppSelector } from "@/shared/store/hooks";

interface SearchResult {
  id: string;
  label: string;
  href: string;
  kind: string;
}

// Reaches directly into Products/Promotions/Orders state — deliberate cross-domain coupling (API composition topic).
export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const enabled = useAppSelector(
    (s) => s.featureFlags.items.find((f) => f.key === "global-search")?.enabled ?? true,
  );
  const products = useAppSelector((s) => s.products.items);
  const promotions = useAppSelector((s) => s.promotions.items);
  const orders = useAppSelector((s) => s.orders.items);

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return [
      ...products
        .filter((p) => p.name.toLowerCase().includes(q))
        .map((p) => ({ id: p.id, label: p.name, href: `/products/${p.id}`, kind: "Produkt" })),
      ...promotions
        .filter((p) => p.name.toLowerCase().includes(q))
        .map((p) => ({ id: p.id, label: p.name, href: `/promotions/${p.id}`, kind: "Promocja" })),
      ...orders
        .filter((o) => o.orderNumber.toLowerCase().includes(q))
        .map((o) => ({ id: o.id, label: o.orderNumber, href: "/orders", kind: "Zamówienie" })),
    ].slice(0, 8);
  }, [query, products, promotions, orders]);

  if (!enabled) return null;

  return (
    <div className="relative w-64">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj produktów, promocji, zamówień..."
      />
      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
          {results.map((r) => (
            <Link
              key={`${r.kind}-${r.id}`}
              to={r.href}
              className="block rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
              onClick={() => setQuery("")}
            >
              <span className="text-muted-foreground">{r.kind}:</span> {r.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
