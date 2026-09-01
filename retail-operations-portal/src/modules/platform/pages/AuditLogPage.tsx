import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { AuditTrailList } from "../components/AuditTrailList";
import { listAuditLog } from "../api/auditLog";
import { setAuditLog } from "../store/auditLogSlice";
import { useAppSelector } from "@/shared/store/hooks";
import { useLoadList } from "@/shared/store/useLoadList";

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
