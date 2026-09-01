import { Badge } from "@/shared/components/ui/badge";

const LABELS: Record<string, string> = {
  // promotions
  draft: "Szkic",
  pending_validation: "Do walidacji",
  pending_approval: "Do akceptacji",
  active: "Aktywna",
  archived: "Zarchiwizowana",
  // orders
  new: "Nowe",
  approved: "Zaakceptowane",
  shipped: "Wysłane",
  cancelled: "Anulowane",
  // returns
  requested: "Zgłoszony",
  rejected: "Odrzucony",
  refunded: "Zwrócono środki",
  // generic
  inactive: "Nieaktywny",
};

const VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary",
  pending_validation: "outline",
  pending_approval: "outline",
  active: "default",
  archived: "secondary",
  new: "outline",
  approved: "default",
  shipped: "default",
  cancelled: "destructive",
  requested: "outline",
  rejected: "destructive",
  refunded: "secondary",
  inactive: "secondary",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={VARIANTS[status] ?? "outline"}>{LABELS[status] ?? status}</Badge>;
}
