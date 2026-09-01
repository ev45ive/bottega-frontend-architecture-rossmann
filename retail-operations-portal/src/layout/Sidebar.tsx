import { NavLink } from "react-router-dom";
import { cn } from "@/shared/lib/utils";

const CORE_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/products", label: "Produkty" },
  { to: "/promotions", label: "Promocje" },
  { to: "/pricing-rules", label: "Reguły cenowe" },
  { to: "/validation-queue", label: "Kolejka walidacji" },
  { to: "/approvals", label: "Kolejka akceptacji" },
  { to: "/reports", label: "Raporty" },
];

const BUFFER_LINKS = [
  { to: "/suppliers", label: "Dostawcy" },
  { to: "/orders", label: "Zamówienia" },
  { to: "/warehouse", label: "Magazyn" },
  { to: "/categories", label: "Kategorie" },
  { to: "/customer-segments", label: "Segmenty klientów" },
  { to: "/returns", label: "Zwroty i reklamacje" },
  { to: "/import-export", label: "Import / Eksport" },
  { to: "/notifications", label: "Powiadomienia" },
  { to: "/audit-log", label: "Dziennik zdarzeń" },
  { to: "/settings/users", label: "Użytkownicy i role" },
];

function NavSection({ title, links }: { title: string; links: typeof CORE_LINKS }) {
  return (
    <div className="space-y-1">
      <p className="px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </p>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/"}
          className={({ isActive }) =>
            cn(
              "block rounded-md px-2 py-1.5 text-sm hover:bg-muted",
              isActive && "bg-muted font-medium text-foreground",
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 space-y-6 border-r p-4">
      <NavSection title="Proces promocji" links={CORE_LINKS} />
      <NavSection title="Pozostałe domeny" links={BUFFER_LINKS} />
    </aside>
  );
}
