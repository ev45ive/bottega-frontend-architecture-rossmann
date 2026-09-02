import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

// Deliberately thin — this is the slot for the greenfield remote built live on Dzień 1 (Blok D2).
export function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Raporty i analityka</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">
          Raporty pojawią się tutaj jako nowy, samodzielny remote (Dzień 1, Blok D2).
        </p>
      </CardContent>
    </Card>
  );
}
