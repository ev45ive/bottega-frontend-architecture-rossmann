import type { AuditLogEntry } from "@/types";

// Used by both PromotionDetailsPage (filtered to one entity) and the full /audit-log page.
export function AuditTrailList({ entries }: { entries: AuditLogEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak zdarzeń.</p>;
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li key={entry.id} className="border-b pb-2 text-sm last:border-0">
          <span className="font-medium">{entry.action}</span>{" "}
          <span className="text-muted-foreground">
            · {entry.entityType} {entry.entityId} · {entry.actor} ·{" "}
            {new Date(entry.timestamp).toLocaleString("pl-PL")}
          </span>
          {entry.details && <div className="text-muted-foreground">{entry.details}</div>}
        </li>
      ))}
    </ul>
  );
}
