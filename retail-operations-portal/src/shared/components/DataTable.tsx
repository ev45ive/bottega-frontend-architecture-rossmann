import { useMemo, useState } from "react";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  searchPlaceholder?: string;
  searchText?: (row: T) => string;
  pageSize?: number;
  emptyMessage?: string;
  selectedIds?: Set<string>;
  onSelectedIdsChange?: (ids: Set<string>) => void;
  bulkActions?: React.ReactNode;
}

// Generic table used by every list screen in the app (search + pagination + optional row selection).
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  searchPlaceholder = "Szukaj...",
  searchText,
  pageSize = 8,
  emptyMessage = "Brak danych do wyświetlenia.",
  selectedIds,
  onSelectedIdsChange,
  bulkActions,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!searchText || !query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((row) => searchText(row).toLowerCase().includes(q));
  }, [rows, query, searchText]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  const selectable = Boolean(selectedIds && onSelectedIdsChange);
  const allOnPageSelected =
    selectable && pageRows.length > 0 && pageRows.every((row) => selectedIds!.has(getRowId(row)));

  function toggleRow(id: string) {
    if (!selectedIds || !onSelectedIdsChange) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedIdsChange(next);
  }

  function toggleAllOnPage() {
    if (!selectedIds || !onSelectedIdsChange) return;
    const next = new Set(selectedIds);
    if (allOnPageSelected) pageRows.forEach((row) => next.delete(getRowId(row)));
    else pageRows.forEach((row) => next.add(getRowId(row)));
    onSelectedIdsChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        {searchText ? (
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            className="max-w-xs"
          />
        ) : (
          <div />
        )}
        {selectable && selectedIds!.size > 0 && bulkActions}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-8">
                  <Checkbox checked={allOnPageSelected} onCheckedChange={toggleAllOnPage} />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={col.key}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
            {pageRows.map((row) => {
              const id = getRowId(row);
              return (
                <TableRow key={id}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds!.has(id)}
                        onCheckedChange={() => toggleRow(id)}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.render(row)}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Strona {currentPage + 1} z {pageCount} ({filtered.length} wyników)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Poprzednia
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              Następna
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
