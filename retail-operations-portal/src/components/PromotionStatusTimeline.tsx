import type { Promotion, PromotionStatus } from "@/types";
import { cn } from "@/lib/utils";

const STEPS: { status: PromotionStatus; label: string }[] = [
  { status: "draft", label: "Szkic" },
  { status: "pending_validation", label: "Walidacja" },
  { status: "pending_approval", label: "Akceptacja" },
  { status: "active", label: "Aktywacja" },
];

// Visualizes where a promotion is in the wybór→reguły→walidacja→akceptacja→aktywacja process.
export function PromotionStatusTimeline({ promotion }: { promotion: Promotion }) {
  const archived = promotion.status === "archived";
  const currentIndex = archived
    ? STEPS.length - 1
    : STEPS.findIndex((s) => s.status === promotion.status);

  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, idx) => (
        <div key={step.status} className="flex flex-1 items-center gap-2">
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
              idx <= currentIndex
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground",
            )}
          >
            {idx + 1}
          </div>
          <span className="text-xs text-muted-foreground">{step.label}</span>
          {idx < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
        </div>
      ))}
      {archived && <span className="ml-2 text-xs text-muted-foreground">(zarchiwizowana)</span>}
    </div>
  );
}
