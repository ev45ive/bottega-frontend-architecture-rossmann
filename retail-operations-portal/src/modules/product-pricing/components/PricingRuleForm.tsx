import { useState } from "react";
import type { PricingRule } from "../types";
import type { Category } from "@/modules/product-catalog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface PricingRuleFormProps {
  categories: Category[];
  initial?: Partial<PricingRule>;
  onSubmit: (rule: Omit<PricingRule, "id">) => void;
  submitLabel?: string;
}

// Used standalone on /pricing-rules AND embedded in the promotion wizard (step 2) — same widget, two owners.
export function PricingRuleForm({
  categories,
  initial,
  onSubmit,
  submitLabel = "Zapisz regułę",
}: PricingRuleFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<PricingRule["type"]>(initial?.type ?? "percentage");
  const [value, setValue] = useState(String(initial?.value ?? 10));
  const [categoryId, setCategoryId] = useState<string | undefined>(initial?.categoryId);
  const [active, setActive] = useState(initial?.active ?? true);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, type, value: Number(value), categoryId, active });
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="rule-name">Nazwa reguły</Label>
        <Input id="rule-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Typ</Label>
          <Select value={type} onValueChange={(v) => setType(v as PricingRule["type"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Procentowa</SelectItem>
              <SelectItem value="fixed">Kwota stała</SelectItem>
              <SelectItem value="bundle">Pakiet (bundle)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rule-value">Wartość</Label>
          <Input
            id="rule-value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Kategoria (opcjonalnie)</Label>
        <Select
          value={categoryId ?? "none"}
          onValueChange={(v) => setCategoryId(v === "none" || v == null ? undefined : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wszystkie kategorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Wszystkie kategorie</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="rule-active"
          checked={active}
          onCheckedChange={(v) => setActive(Boolean(v))}
        />
        <Label htmlFor="rule-active">Reguła aktywna</Label>
      </div>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
