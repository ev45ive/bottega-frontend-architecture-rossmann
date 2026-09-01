import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProduct, updateProduct } from "@/api/products";
import { getStockForProduct } from "@/api/warehouse";
import type { Product, WarehouseStock } from "@/types";

// Deliberately bypasses the Redux store and calls the API directly — inconsistent with ProductsPage.
export function ProductDetailsPage() {
  const { id = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [stock, setStock] = useState<WarehouseStock[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProduct(id).then((p) => {
      setProduct(p);
      if (p) {
        setName(p.name);
        setPrice(String(p.price));
      }
    });
    getStockForProduct(id).then(setStock);
  }, [id]);

  if (!product) return <p className="text-muted-foreground">Ładowanie...</p>;

  async function handleSave() {
    setSaving(true);
    const updated = await updateProduct(id, { name, price: Number(price) });
    setProduct(updated);
    setSaving(false);
  }

  return (
    <div className="max-w-xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {product.sku} · {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="product-name">Nazwa</Label>
            <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="product-price">Cena</Label>
            <Input
              id="product-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Zapisywanie..." : "Zapisz"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stany magazynowe</CardTitle>
        </CardHeader>
        <CardContent>
          {stock.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak danych magazynowych.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {stock.map((s) => (
                <li key={s.id} className="flex justify-between">
                  <span>{s.location}</span>
                  <span>
                    {s.quantity - s.reserved} dostępne ({s.reserved} zarezerwowane)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
