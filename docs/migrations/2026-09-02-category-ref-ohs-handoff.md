# Handoff: Category → CategoryRef OHS export (Catalog → Pricing decoupling)

> Status: Phase 1, 2, 3 done.
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

## Phase 2 — DONE

Gave `product-pricing` its own slice for `CategoryRef`, decoupled from Catalog's `categoriesSlice`
in the global store:

1. Created [product-pricing/store/categoryRefsSlice.ts](../../retail-operations-portal/src/modules/product-pricing/store/categoryRefsSlice.ts):
   `createListSlice<CategoryRef>("categoryRefs")`, exports `setCategoryRefs` (mirrors the pattern in
   `product-catalog/store/categoriesSlice.ts`).
2. [product-pricing/index.ts](../../retail-operations-portal/src/modules/product-pricing/index.ts) — exports the new slice/action.
3. [app/store.ts](../../retail-operations-portal/src/app/store.ts) — registered `categoryRefs: categoryRefsSlice.reducer` (imported from
   `@/modules/product-pricing`). The existing `categories: categoriesSlice.reducer` entry was kept
   — still owned/used by Catalog's own pages (`CategoriesPage.tsx`, `ProductsPage.tsx`).

## Phase 3 — DONE

Switched the two `product-pricing` consumers from `Category`/`listCategories`/`s.categories.items`
to `CategoryRef`/`listCategoryRefs`/`s.categoryRefs.items`:

1. [product-pricing/components/PricingRuleForm.tsx](../../retail-operations-portal/src/modules/product-pricing/components/PricingRuleForm.tsx) — prop type `categories: Category[]` →
   `categories: CategoryRef[]`; swapped the `Category` import for `CategoryRef`.
2. [product-pricing/pages/PricingRulesPage.tsx](../../retail-operations-portal/src/modules/product-pricing/pages/PricingRulesPage.tsx) — swapped `listCategories`/`setCategories` (from
   `@/modules/product-catalog`) for `listCategoryRefs` (from `@/modules/product-catalog`) /
   `setCategoryRefs` (new slice, from local `../store/categoryRefsSlice`); swapped
   `useAppSelector(s => s.categories.items)` for `useAppSelector(s => s.categoryRefs.items)`.
3. [product-pricing/pages/PromotionWizardPage.tsx](../../retail-operations-portal/src/modules/product-pricing/pages/PromotionWizardPage.tsx) — same swap as step 2 (it loads categories only
   to pass into the embedded `PricingRuleForm` "new rule" dialog).

`PricingRule.categoryId` field type is unchanged (`ID`, unbranded) — no edits needed there.

## Verification checklist for Phase 2/3 — completed

1. `npm run lint` — 0 errors (4 pre-existing `react-refresh` warnings in unrelated `shared/components/ui`
   files). `boundaries/dependencies` rule passes.
2. `npx tsc --noEmit -p tsconfig.app.json` — no errors.
3. Manual verification via dev server + browser: `/pricing-rules` table and its "Nowa reguła"
   dialog category dropdown populate correctly; `/promotions/new` step 2 (Reguły/ceny) and its
   embedded "Nowa reguła" dialog category dropdown also populate correctly.
4. Grepped `product-pricing` for `Category(?!Ref)` — only `categoryId`/`categoryName` (the unbranded
   `ID` field/local var) remain, no `Category` aggregate type import. Full-aggregate dependency is gone.

## Known trade-off (flagged, not resolved)

Phase 2 introduces a second in-memory copy of category id/name (Catalog's `categoriesSlice` +
Pricing's new `categoryRefsSlice`) inside the same global Redux store — the store's own code
comment already calls the global-store pattern an "intentional anti-pattern". Accepted as a
reasonable cost for module decoupling; not addressed further here.
