import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ProductPicker, listProducts, listCategories, setProducts, setCategories } from "@/modules/product-catalog";
import { PricingRuleForm } from "../components/PricingRuleForm";
import { listPricingRules, addPricingRule } from "../api/pricingRules";
import { createPromotion, submitPromotionForValidation } from "../api/promotions";
import { setPricingRules, upsertPricingRule } from "../store/pricingRulesSlice";
import { upsertPromotion } from "../store/promotionsSlice";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { useLoadList } from "@/shared/store/useLoadList";

// Maps 1:1 onto the promotion process: wybór produktów → reguły/ceny → walidacja → akceptacja → aktywacja.
export function PromotionWizardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const products = useAppSelector((s) => s.products.items);
  useLoadList(useAppSelector((s) => s.products.loaded), listProducts, setProducts);
  const categories = useAppSelector((s) => s.categories.items);
  useLoadList(useAppSelector((s) => s.categories.loaded), listCategories, setCategories);
  const pricingRules = useAppSelector((s) => s.pricingRules.items);
  useLoadList(useAppSelector((s) => s.pricingRules.loaded), listPricingRules, setPricingRules);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [selectedRuleIds, setSelectedRuleIds] = useState<Set<string>>(new Set());
  const [newRuleOpen, setNewRuleOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function toggleRule(id: string) {
    setSelectedRuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleCreate() {
    setSubmitting(true);
    const created = await createPromotion({
      name,
      productIds: [...selectedProductIds],
      pricingRuleIds: [...selectedRuleIds],
      startDate,
      endDate,
      createdBy: "Jan Kowalski",
    });
    const submitted = await submitPromotionForValidation(created.id);
    dispatch(upsertPromotion(submitted));
    setSubmitting(false);
    toast.success("Promocja utworzona i wysłana do walidacji");
    navigate(`/promotions/${submitted.id}`);
  }

  const canCreate = name.trim().length > 0 && selectedProductIds.size > 0 && startDate && endDate;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold">Nowa promocja</h1>

      <Card>
        <CardContent className="grid grid-cols-3 gap-3 pt-6">
          <div className="space-y-1.5">
            <Label htmlFor="promo-name">Nazwa promocji</Label>
            <Input id="promo-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="promo-start">Start</Label>
            <Input
              id="promo-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="promo-end">Koniec</Label>
            <Input
              id="promo-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="step1">
        <TabsList>
          <TabsTrigger value="step1">1. Produkty</TabsTrigger>
          <TabsTrigger value="step2">2. Reguły/ceny</TabsTrigger>
          <TabsTrigger value="step3">3. Walidacja</TabsTrigger>
          <TabsTrigger value="step4">4. Akceptacja</TabsTrigger>
          <TabsTrigger value="step5">5. Aktywacja</TabsTrigger>
        </TabsList>

        <TabsContent value="step1">
          <Card>
            <CardHeader>
              <CardTitle>Wybór produktów</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductPicker
                products={products}
                selectedIds={selectedProductIds}
                onSelectedIdsChange={setSelectedProductIds}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reguły cenowe</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setNewRuleOpen(true)}>
                Nowa reguła
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {pricingRules.map((rule) => (
                <label key={rule.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedRuleIds.has(rule.id)}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  {rule.name} ({rule.type === "percentage" ? `${rule.value}%` : rule.value} zł)
                </label>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step3">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Walidacja uruchamia się automatycznie po utworzeniu promocji — wynik zobaczysz na
              stronie szczegółów promocji.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step4">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Akceptacja odbywa się na stronie szczegółów promocji, po pozytywnej walidacji.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step5">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Aktywacja / publikacja odbywa się na stronie szczegółów promocji, po akceptacji.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleCreate} disabled={!canCreate || submitting}>
        {submitting ? "Tworzenie..." : "Utwórz promocję i wyślij do walidacji"}
      </Button>

      <Dialog open={newRuleOpen} onOpenChange={setNewRuleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nowa reguła cenowa</DialogTitle>
          </DialogHeader>
          <PricingRuleForm
            categories={categories}
            onSubmit={async (rule) => {
              const created = await addPricingRule(rule);
              dispatch(upsertPricingRule(created));
              setSelectedRuleIds((prev) => new Set(prev).add(created.id));
              setNewRuleOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
