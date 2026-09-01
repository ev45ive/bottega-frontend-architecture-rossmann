import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditTrailList } from "@/components/AuditTrailList";
import { listAuditLog } from "@/api/auditLog";
import { setAuditLog } from "@/store/auditLogSlice";
import { useAppSelector } from "@/store/hooks";
import { useLoadList } from "@/store/useLoadList";

// Aggregates events across every domain — an API composition / BFF discussion example.
export function AuditLogPage() {
  const entries = useAppSelector((s) => s.auditLog.items);
  useLoadList(useAppSelector((s) => s.auditLog.loaded), listAuditLog, setAuditLog);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dziennik zdarzeń</CardTitle>
      </CardHeader>
      <CardContent>
        <AuditTrailList entries={entries} />
      </CardContent>
    </Card>
  );
}
