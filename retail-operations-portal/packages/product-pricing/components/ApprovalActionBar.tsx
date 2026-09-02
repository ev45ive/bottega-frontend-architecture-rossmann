import { Button } from "@/shared/components/ui/button";
import { useAppSelector } from "@/shared/store/hooks";

interface ApprovalActionBarProps {
  onApprove: () => void;
  onReject: () => void;
  disabled?: boolean;
}

// Role-gated: only admin/manager can approve or reject (Dzień 3 auth/permissions material).
export function ApprovalActionBar({ onApprove, onReject, disabled }: ApprovalActionBarProps) {
  const role = useAppSelector((s) => s.currentUser.role);
  const canDecide = role === "admin" || role === "manager";

  if (!canDecide) {
    return <p className="text-sm text-muted-foreground">Twoja rola nie pozwala na akceptację.</p>;
  }

  return (
    <div className="flex gap-2">
      <Button onClick={onApprove} disabled={disabled}>
        Zaakceptuj
      </Button>
      <Button variant="outline" onClick={onReject} disabled={disabled}>
        Odrzuć
      </Button>
    </div>
  );
}
