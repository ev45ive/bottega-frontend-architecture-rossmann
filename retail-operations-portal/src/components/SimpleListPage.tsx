import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/DataTable";

interface SimpleListPageProps<T> {
  title: string;
  description?: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  searchText?: (row: T) => string;
  headerAction?: React.ReactNode;
}

// Thin, shared shell for Tier 2 buffer screens (read + at most one action) — not a full page each time.
export function SimpleListPage<T>({
  title,
  description,
  columns,
  rows,
  getRowId,
  searchText,
  headerAction,
}: SimpleListPageProps<T>) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {headerAction}
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} rows={rows} getRowId={getRowId} searchText={searchText} />
      </CardContent>
    </Card>
  );
}
