# Project Architecture

> **Living document.** Aktualizowany na żywo w trakcie warsztatu, nie jest dokumentem końcowym.
> **Właściciel:** cały zespół warsztatowy (rotacyjnie, blok po bloku).
> **Stan na:**: 2026-09-01

# Kontekst biznesowy

Retail Operations Portal — system back-office do obsługi produktów, zamówień, oraz procesu promocji handlowej

# Drivery architektoniczne

| ID  | Driver                                                                              | Kategoria          | Źródło        |
| --- | ----------------------------------------------------------------------------------- | ------------------ | ------------- |
| D1  | Czas wdrożenia zmiany w regułach promocji musi spaść z ~3 tyg. do < 3 dni           | Time-to-market     | Product Owner |
| D2  | Zespoły Pricing i Catalog nie mogą wzajemnie blokować się przy wydaniu              | Autonomia zespołów | Tech Lead     |
| D3  | Częściowa awaria (np. serwis rekomendacji) nie może blokować całego ekranu promocji | Resilience         | Operacje      |
| D4  | Nowi dostawcy frontendu (zespół B2B) muszą móc dołączyć bez przepisywania shella    | Rozszerzalność     | Architekt     |

# Ownership map

| Krok procesu           | Domena                     | Zespół        | Pakiet                          |
| ---------------------- | -------------------------- | ------------- | -------------------------------- |
| Wybór produktów        | Catalog                    | Catalog Team  | `packages/product-catalog`       |
| Reguły i ceny          | Pricing & Promotions       | Pricing Team  | `packages/product-pricing`       |
| Walidacja → akceptacja | Pricing & Promotions       | Pricing Team  | `packages/product-pricing`       |
| Aktywacja/publikacja   | Pricing & Promotions       | Pricing Team  | `packages/product-pricing`       |
| Raportowanie           | Platform / Shared Services | Platform Team | `packages/platform`              |

> Pełny podział na bounded context (14) i domeny (4) z uzasadnieniem: [docs/context-map/context-map.md](./context-map/context-map.md).

# Struktura modułów i aliasy

- 4 moduły domenowe: `product-catalog`,
  `product-pricing`, `sales-fulfilment`, `platform`.
- Fizyczna lokalizacja: `retail-operations-portal/packages/<moduł>`, obok
  `retail-operations-portal/src/` (app/layout/shared).
- Publiczne API modułu = jego `index.ts`.
- Egzekwowanie granic: `boundaries/dependencies` w
  [eslint.config.js](../retail-operations-portal/eslint.config.js); pliki graniczne chronione w
  [CODEOWNERS](../.github/CODEOWNERS).

**Aliasy** (spójne w `tsconfig.app.json`, `tsconfig.json`, `vite.config.ts`):

| Alias                 | Cel                          | Użycie                              |
| --------------------- | ---------------------------- | ------------------------------------ |
| `@/*`                 | `src/*`                       | reszta appki (app/layout/shared)     |
| `@/modules/*`         | `packages/*`                  | import cross-module, np. `@/modules/product-catalog` |
| `@ross-org/<moduł>`   | `packages/<moduł>/index.ts`   | jawny, org-scoped alias na publiczne API modułu  |

# Decyzje Architektoniczne (ADR)

- [Index decyzji architektonicznych](./adr/index.md)
