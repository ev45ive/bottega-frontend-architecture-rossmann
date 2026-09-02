# Handoff: Category → CategoryRef OHS export (Catalog → Pricing decoupling)

> Status: Phase 1 done. Phases 2–3 not started.
> Related: [ADR-0001](../adr/0001-category-ref-open-host-service.md), [ADR-0000](../adr/0000-podzial-na-moduly-domenowe.md), [context-map.md](../context-map/context-map.md) (hotspot: Catalog→Pricing raw ID, no ACL).

## Goal

Stop `product-pricing` from depending on Catalog's full `Category` aggregate. `product-catalog`
publishes a minimal `CategoryRef { id, name }` as an Open Host Service (OHS) export; `product-pricing`
consumes only that projection.

Branded/nominal ID types were explicitly **deferred** (out of scope) — `categoryId` stays a plain
`ID` (string) alias. See conversation history for the reasoning (Ref DTOs alone satisfy the
ADR-0000 "no ACL" concern; branding solves a separate, unrelated id-mixup risk).

## Phase 1 — DONE

Implemented as a **separate ACL mapper file**, without touching existing internal module code
(`types.ts`, `api/categories.ts` untouched):

- Created [product-catalog/acl/categoryRef.ts](../../retail-operations-portal/src/modules/product-catalog/acl/categoryRef.ts):
  - `CategoryRef { id: ID; name: string }` — the published-language projection of `Category`.
  - `toCategoryRef(category: Category): CategoryRef` — private mapper.
  - `listCategoryRefs(): Promise<CategoryRef[]>` — calls existing `listCategories()` and maps results.
- Updated [product-catalog/index.ts](../../retail-operations-portal/src/modules/product-catalog/index.ts) to export
  `CategoryRef` (type) and `listCategoryRefs`.
- Verified: `npm run lint` (0 errors) and no TS errors on the two touched files.

Nothing else was changed — `product-pricing`'s pages still read the full `Category` type and
Catalog's own `categoriesSlice` directly (this is what Phase 3 fixes).

## Phase 2 — NOT STARTED

Give `product-pricing` its own slice for `CategoryRef`, decoupled from Catalog's `categoriesSlice`
in the global store:

1. New file `product-pricing/store/categoryRefsSlice.ts`:
   `createListSlice<CategoryRef>("categoryRefs")`, export `setCategoryRefs` (mirror the pattern in
   `product-catalog/store/categoriesSlice.ts`).
2. `product-pricing/index.ts` — export the new slice/action.
3. `app/store.ts` — register `categoryRefs: categoryRefsSlice.reducer` (import from
   `@/modules/product-pricing`). **Do not remove** the existing `categories: categoriesSlice.reducer`
   entry — it's still owned/used by Catalog's own pages (`CategoriesPage.tsx`, `ProductsPage.tsx`).

## Phase 3 — NOT STARTED

Switch the two `product-pricing` consumers from `Category`/`listCategories`/`s.categories.items`
to `CategoryRef`/`listCategoryRefs`/`s.categoryRefs.items`:

1. `product-pricing/components/PricingRuleForm.tsx` — prop type `categories: Category[]` →
   `categories: CategoryRef[]`; swap the `Category` import for `CategoryRef`.
2. `product-pricing/pages/PricingRulesPage.tsx` — swap `listCategories`/`setCategories` (from
   `@/modules/product-catalog`) for `listCategoryRefs`/`setCategoryRefs` (new slice, from
   `@/modules/product-pricing`); swap `useAppSelector(s => s.categories.items)` for
   `useAppSelector(s => s.categoryRefs.items)`.
3. `product-pricing/pages/PromotionWizardPage.tsx` — same swap as step 2 (it loads categories only
   to pass into the embedded `PricingRuleForm` "new rule" dialog).

`PricingRule.categoryId` field type is unchanged (`ID`, unbranded) — no edits needed there.

## Verification checklist for Phase 2/3

1. `npm run lint` — `boundaries/dependencies` rule must still pass (product-pricing only imports
   from product-catalog's public `index.ts`).
2. Type-check — no errors after the prop/type swaps.
3. Manual: `/pricing-rules` and `/promotions/new` — category dropdown + column still populate and
   filter correctly.
4. Grep `product-pricing` for `Category` (not `CategoryRef`) — should return zero matches once
   Phase 3 is done, confirming the full-aggregate import is gone.

## Known trade-off (flagged, not resolved)

Phase 2 introduces a second in-memory copy of category id/name (Catalog's `categoriesSlice` +
Pricing's new `categoryRefsSlice`) inside the same global Redux store — the store's own code
comment already calls the global-store pattern an "intentional anti-pattern". Accepted as a
reasonable cost for module decoupling; not addressed further here.
