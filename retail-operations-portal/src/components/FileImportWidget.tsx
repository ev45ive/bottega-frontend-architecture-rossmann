import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface FileImportWidgetProps {
  onImport: (file: File) => Promise<{ imported: number }>;
  onExport?: () => void;
}

// Small and self-contained — another good candidate for a Web Component comparison (Dzień 2 A3).
export function FileImportWidget({ onImport, onExport }: FileImportWidgetProps) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleImport() {
    if (!file) return;
    setBusy(true);
    setResult(null);
    try {
      const { imported } = await onImport(file);
      setResult(`Zaimportowano ${imported} rekordów.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="max-w-xs"
        />
        <Button onClick={handleImport} disabled={!file || busy}>
          Importuj
        </Button>
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            Eksportuj
          </Button>
        )}
      </div>
      {busy && <Progress value={null} className="w-64" />}
      {result && <p className="text-sm text-muted-foreground">{result}</p>}
    </div>
  );
}
