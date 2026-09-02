import type { ValidationResult } from "../types";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";

interface ValidationResultsPanelProps {
  validation?: ValidationResult;
  onRunValidation: () => void;
  running?: boolean;
}

export function ValidationResultsPanel({
  validation,
  onRunValidation,
  running,
}: ValidationResultsPanelProps) {
  return (
    <div className="space-y-3">
      <Button onClick={onRunValidation} disabled={running}>
        {running ? "Walidacja w toku..." : "Uruchom walidację"}
      </Button>
      {validation && (
        <Alert variant={validation.passed ? "default" : "destructive"}>
          <AlertTitle>
            {validation.passed ? "Walidacja zakończona pomyślnie" : "Walidacja wykryła problemy"}
          </AlertTitle>
          <AlertDescription>
            {validation.issues.length > 0 ? (
              <ul className="list-disc pl-4">
                {validation.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            ) : (
              "Brak zastrzeżeń."
            )}
            <div className="mt-1 text-xs text-muted-foreground">
              Sprawdzono: {new Date(validation.checkedAt).toLocaleString("pl-PL")}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
