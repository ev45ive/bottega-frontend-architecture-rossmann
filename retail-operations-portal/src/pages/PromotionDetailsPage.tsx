import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { PromotionStatusTimeline } from "@/components/PromotionStatusTimeline";
import { ValidationResultsPanel } from "@/components/ValidationResultsPanel";
import { ApprovalActionBar } from "@/components/ApprovalActionBar";
import { AuditTrailList } from "@/components/AuditTrailList";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import {
  runValidation,
  approvePromotion,
  rejectPromotion,
  archivePromotion,
} from "@/api/promotions";
import { listAuditLog } from "@/api/auditLog";
import { setAuditLog } from "@/store/auditLogSlice";
import { upsertPromotion } from "@/store/promotionsSlice";
import { listPromotions } from "@/api/promotions";
import { setPromotions } from "@/store/promotionsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLoadList } from "@/store/useLoadList";

export function PromotionDetailsPage() {
  const { id = "" } = useParams();
  const dispatch = useAppDispatch();
  useLoadList(useAppSelector((s) => s.promotions.loaded), listPromotions, setPromotions);
  const promotion = useAppSelector((s) => s.promotions.items.find((p) => p.id === id));

  const allAuditEntries = useAppSelector((s) => s.auditLog.items);
  const auditEntries = allAuditEntries.filter((a) => a.entityId === id);
  useLoadList(useAppSelector((s) => s.auditLog.loaded), listAuditLog, setAuditLog);

  const [running, setRunning] = useState(false);

  if (!promotion) return <p className="text-muted-foreground">Ładowanie...</p>;

  async function handleRunValidation() {
    setRunning(true);
    const updated = await runValidation(id);
    dispatch(upsertPromotion(updated));
    setRunning(false);
  }

  async function handleApprove() {
    const updated = await approvePromotion(id, "Jan Kowalski");
    dispatch(upsertPromotion(updated));
    toast.success("Promocja zaakceptowana");
  }

  async function handleReject() {
    const updated = await rejectPromotion(id, "Odrzucono na etapie akceptacji");
    dispatch(upsertPromotion(updated));
    toast.error("Promocja odrzucona, wróciła do szkicu");
  }

  async function handleArchive() {
    const updated = await archivePromotion(id);
    dispatch(upsertPromotion(updated));
    toast("Promocja zarchiwizowana");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">{promotion.name}</h1>
        <StatusBadge status={promotion.status} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <PromotionStatusTimeline promotion={promotion} />
        </CardContent>
      </Card>

      {promotion.status === "pending_validation" && (
        <Card>
          <CardHeader>
            <CardTitle>Walidacja</CardTitle>
          </CardHeader>
          <CardContent>
            <ValidationResultsPanel
              validation={promotion.validation}
              onRunValidation={handleRunValidation}
              running={running}
            />
          </CardContent>
        </Card>
      )}

      {promotion.status === "pending_approval" && (
        <Card>
          <CardHeader>
            <CardTitle>Akceptacja</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalActionBar onApprove={handleApprove} onReject={handleReject} />
          </CardContent>
        </Card>
      )}

      {promotion.status === "active" && (
        <Card>
          <CardHeader>
            <CardTitle>Aktywacja / publikacja</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" onClick={handleArchive}>
              Zarchiwizuj
            </Button>
          </CardContent>
        </Card>
      )}

      {promotion.status === "draft" && promotion.validation && !promotion.validation.passed && (
        <Card>
          <CardHeader>
            <CardTitle>Walidacja</CardTitle>
          </CardHeader>
          <CardContent>
            <ValidationResultsPanel
              validation={promotion.validation}
              onRunValidation={handleRunValidation}
              running={running}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <AppErrorBoundary boundaryName="promotion-performance-widget">
            <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Miejsce na widget analityczny — dobudowywany jako remote Vue (Dzień 2, Blok A1).
            </p>
          </AppErrorBoundary>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dziennik zdarzeń</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditTrailList entries={auditEntries} />
        </CardContent>
      </Card>
    </div>
  );
}
