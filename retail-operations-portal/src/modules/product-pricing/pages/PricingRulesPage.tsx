import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { DataTable } from "@/shared/components/DataTable";
import { PricingRuleForm } from "../components/PricingRuleForm";
import { listPricingRules, addPricingRule } from "../api/pricingRules";
import { listCategoryRefs } from "@/modules/product-catalog";
import { setPricingRules, upsertPricingRule } from "../store/pricingRulesSlice";
import { setCategoryRefs } from "../store/categoryRefsSlice";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { useLoadList } from "@/shared/store/useLoadList";

const TYPE_LABELS = { percentage: "Procentowa", fixed: "Kwota stała", bundle: "Pakiet" };

export function PricingRulesPage() {
  const dispatch = useAppDispatch();
  const rules = useAppSelector((s) => s.pricingRules.items);
  useLoadList(useAppSelector((s) => s.pricingRules.loaded), listPricingRules, setPricingRules);
  const categories = useAppSelector((s) => s.categoryRefs.items);
  useLoadList(useAppSelector((s) => s.categoryRefs.loaded), listCategoryRefs, setCategoryRefs);

  const [open, setOpen] = useState(false);
  const categoryName = (id?: string) => categories.find((c) => c.id === id)?.name ?? "Wszystkie";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reguły cenowe</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}>
          Nowa reguła
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={[
            { key: "name", header: "Nazwa", render: (r) => r.name },
            { key: "type", header: "Typ", render: (r) => TYPE_LABELS[r.type] },
            {
              key: "value",
              header: "Wartość",
              render: (r) => (r.type === "percentage" ? `${r.value}%` : `${r.value} zł`),
            },
            { key: "category", header: "Kategoria", render: (r) => categoryName(r.categoryId) },
            {
              key: "active",
              header: "Aktywna",
              render: (r) => <Badge variant={r.active ? "default" : "secondary"}>{r.active ? "Tak" : "Nie"}</Badge>,
            },
          ]}
          rows={rules}
          getRowId={(r) => r.id}
          searchText={(r) => r.name}
        />
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nowa reguła cenowa</DialogTitle>
          </DialogHeader>
          <PricingRuleForm
            categories={categories}
            onSubmit={async (rule) => {
              const created = await addPricingRule(rule);
              dispatch(upsertPricingRule(created));
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
