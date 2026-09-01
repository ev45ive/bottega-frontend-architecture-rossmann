import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImportWidget } from "@/components/FileImportWidget";
import { importProductsFromCsv, exportProducts } from "@/api/products";

// Is this a domain, or a shared platform capability? Good candidate for a Web Component (Dzień 2 A3).
export function ImportExportPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import / eksport danych</CardTitle>
      </CardHeader>
      <CardContent>
        <FileImportWidget
          onImport={importProductsFromCsv}
          onExport={() => exportProducts().then(() => {})}
        />
      </CardContent>
    </Card>
  );
}
