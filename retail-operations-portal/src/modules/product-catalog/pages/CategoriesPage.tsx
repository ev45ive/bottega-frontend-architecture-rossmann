import { SimpleListPage } from "@/shared/components/SimpleListPage";
import { listCategories } from "../api/categories";
import { listProducts } from "../api/products";
import { setCategories } from "../store/categoriesSlice";
import { setProducts } from "../store/productsSlice";
import { useAppSelector } from "@/shared/store/hooks";
import { useLoadList } from "@/shared/store/useLoadList";

// Should this be part of Products, or its own module? Left as an open granularity question.
export function CategoriesPage() {
  const categories = useAppSelector((s) => s.categories.items);
  useLoadList(useAppSelector((s) => s.categories.loaded), listCategories, setCategories);
  const products = useAppSelector((s) => s.products.items);
  useLoadList(useAppSelector((s) => s.products.loaded), listProducts, setProducts);

  return (
    <SimpleListPage
      title="Kategorie produktów"
      columns={[
        { key: "name", header: "Nazwa", render: (c) => c.name },
        {
          key: "count",
          header: "Liczba produktów",
          render: (c) => products.filter((p) => p.categoryId === c.id).length,
        },
      ]}
      rows={categories}
      getRowId={(c) => c.id}
      searchText={(c) => c.name}
    />
  );
}
