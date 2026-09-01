# Raport analizy architektury frontendu

> Sekcje nieistotne dla danego trybu/zakresu analizy pozostają w dokumencie, a ich treść zastępuje się znacznikiem `--- POMINIĘTO ---` (nie usuwać nagłówka).

## Metadane raportu

- **Data analizy:** 2026-09-01
- **Tryb analizy:** pełna / wstępna analiza całego projektu (brak wcześniejszego raportu w `docs/`)
- **Zakres:** `retail-operations-portal/` (cały projekt frontendowy w repozytorium)
- **Autor:** Mateusz Kulesza <ev45ive@gmail.com> (z `git config user.*`)
- **Model AI:** Claude Sonnet 4.5
- **Powiązany wcześniejszy raport (jeśli aktualizacja):** brak

## 1. Kontekst i cel

Pierwsza pełna analiza architektury `retail-operations-portal`. `docs/ARCHITECTURE.md` (kanoniczne źródło decyzji wg [CLAUDE.md](../../CLAUDE.md)) jest obecnie puste/nieuzupełnione. Zakres obejmuje cały projekt frontendowy zgodnie z wyborem użytkownika (tryb pełny).

## 2. Stack technologiczny

Z [package.json](../../retail-operations-portal/package.json):

- **Framework/UI:** React 19.2.8 + React DOM 19.2.8.
- **Bundler:** Vite 8.2.2, plugin `@vitejs/plugin-react`, `@tailwindcss/vite`.
- **Język:** TypeScript ~6.0.2, build przez `tsc -b && vite build`.
- **Routing:** `react-router-dom` 7.18.3 — `createBrowserRouter` w [routes.tsx](../../retail-operations-portal/src/routes.tsx).
- **Stan globalny:** `@reduxjs/toolkit` 2.12 + `react-redux` 9.3.
- **UI kit:** `shadcn` 4.19 zbudowany na `@base-ui/react` 1.7 (nie Radix), `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss` 4.3, `lucide-react` (ikony), `sonner` (toasty).
- **Formularze/walidacja:** brak dedykowanej biblioteki (nie ma `react-hook-form`, `zod`, `yup` w zależnościach) — formularze oparte o `useState` (np. [PromotionWizardPage.tsx](../../retail-operations-portal/src/pages/PromotionWizardPage.tsx)).
- **Linter:** `oxlint` 1.79 (`.oxlintrc.json`), brak ESLint/Prettier w zależnościach.
- **Testy:** brak frameworka testowego w `devDependencies`.

## 3. Struktura katalogów i konwencje

Podział warstwowy (layer-based), nie feature-based: jeden katalog na typ artefaktu (`api/`, `components/`, `layout/`, `lib/`, `mock-data/`, `pages/`, `store/`), a każda z ~14 domen (products, promotions, pricing-rules, orders, warehouse, categories, customer-segments, returns, suppliers, users, audit-log, notifications, feature-flags) ma swój plik w każdym z tych katalogów.

`src/types.ts` to jeden płaski plik ze wszystkimi DTO, z jawnym komentarzem w kodzie: *"Shared DTOs used across every domain — intentionally one flat file (brownfield anti-pattern)"* ([types.ts](../../retail-operations-portal/src/types.ts) linia 1). Podobnie `store/store.ts` linia 1: *"One store for every domain — intentional 'global store as the app's database' anti-pattern"*. Repozytorium zawiera też `exercises/` i `docs/ai-sessions/` oraz komentarze w kodzie typu "Dzień 3", "Tier 2/3" (np. [currentUserSlice.ts](../../retail-operations-portal/src/store/currentUserSlice.ts), [UserMenu.tsx](../../retail-operations-portal/src/components/UserMenu.tsx)) — wskazuje to na projekt szkoleniowy/ćwiczeniowy, w którym niektóre anti-patterny są celowe.

## 4. Warstwa danych/API

Spójny wzorzec w każdym pliku `src/api/<domena>.ts`: import danych z `src/mock-data/<domena>.json`, budowa `Map` jako fałszywej bazy w pamięci, funkcje `list*/get*/update*` symulujące async przez `delay()` z [delay.ts](../../retail-operations-portal/src/api/delay.ts) (`setTimeout` 200 ms domyślnie). Przykład: [products.ts](../../retail-operations-portal/src/api/products.ts). Brak realnego klienta HTTP (fetch/axios). Import CSV jest zaślepką — `importProductsFromCsv` w `products.ts` zwraca zawsze `{ imported: 0 }` bez realnego parsowania.

## 5. Zarządzanie stanem

Jeden globalny Redux store ([store.ts](../../retail-operations-portal/src/store/store.ts)) z 14 slice'ami, każdy budowany generyczną fabryką [createListSlice.ts](../../retail-operations-portal/src/store/createListSlice.ts) (`{ items, loaded }` + reduktory `setItems`/`upsertItem`). Pobieranie danych ujednolicone przez współdzielony hook [useLoadList.ts](../../retail-operations-portal/src/store/useLoadList.ts) (fetch raz, gdy `!loaded`). `currentUserSlice` zawiera zahardkodowanego użytkownika (`hardcodedUser`, rola `admin`) — brak faktycznego logowania/auth flow.

## 6. Routing i nawigacja

Jednopoziomowe drzewo tras przez `createBrowserRouter` ([routes.tsx](../../retail-operations-portal/src/routes.tsx)): wszystkie strony importowane statycznie (brak `React.lazy`/code-splitting per trasa), jeden `AppLayout` (Header + Sidebar + `Outlet`). Brak guardów/autoryzacji na poziomie routera — ewentualna kontrola dostępu jest robiona ad hoc wewnątrz komponentów (patrz sekcja 11).

## 7. Komponenty i UI

`src/components/ui/` zawiera 18 prymitywów shadcn (button, dialog, table, tabs, dropdown-menu, itd.) na bazie `@base-ui/react`. Współdzielone komponenty złożone — [DataTable.tsx](../../retail-operations-portal/src/components/DataTable.tsx) (wyszukiwanie, paginacja `pageSize=8`, opcjonalna selekcja wierszy) i [SimpleListPage.tsx](../../retail-operations-portal/src/components/SimpleListPage.tsx) (cienka otoczka nad `DataTable` dla "Tier 2" ekranów) — są reużywane w większości stron listowych. Komponenty domenowe (`PricingRuleForm`, `ProductPicker`, `PromotionStatusTimeline`, `ApprovalActionBar`, `AuditTrailList`, `ValidationResultsPanel`) odwzorowują pojedyncze przepływy biznesowe. Podział prezentacyjne/kontenerowe jest luźny — strony (np. `PromotionWizardPage`) same pobierają dane (`useLoadList`) i renderują UI.

## 8. Typowanie i jakość kodu

`tsconfig.app.json` włącza część opcji jakościowych (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`), ale **nie ustawia jawnie `"strict": true"`** ani w [tsconfig.json](../../retail-operations-portal/tsconfig.json), ani w [tsconfig.app.json](../../retail-operations-portal/tsconfig.app.json) — TS działa więc w trybie nie-strict domyślnym. Lintowanie wyłącznie przez `oxlint` ([.oxlintrc.json](../../retail-operations-portal/.oxlintrc.json)): pluginy `react`, `typescript`, `oxc`, tylko 2 skonfigurowane reguły (`react/rules-of-hooks`, `react/only-export-components`); tryb `typeAware` (reguły wymagające informacji o typach) nie jest włączony, mimo że README projektu opisuje jak to zrobić. Brak konfiguracji Prettier.

## 9. Testowanie

Brak frameworka testowego w `devDependencies`, brak plików `*.test.*`/`*.spec.*` oraz brak konfiguracji Vitest/Jest w repozytorium — projekt obecnie nie ma żadnych zautomatyzowanych testów.

## 10. Wydajność

Wszystkie strony w `routes.tsx` są importowane statycznie (brak `React.lazy`/`Suspense` per trasa) — brak code-splittingu na poziomie routingu mimo rosnącej liczby stron (20+ tras). `DataTable` implementuje wyłącznie paginację/filtrowanie po stronie klienta bez wirtualizacji list — przy danych mockowych nieistotne, ale stanowiłoby wąskie gardło przy realnych, większych zbiorach danych.

## 11. Bezpieczeństwo

Brak uwierzytelniania: `currentUserSlice` zwraca zahardkodowanego użytkownika, opcja "Wyloguj" w [UserMenu.tsx](../../retail-operations-portal/src/components/UserMenu.tsx) jest zablokowana (`disabled`, komentarz "Dzień 3"). Autoryzacja jest realizowana wyłącznie po stronie UI — [ApprovalActionBar.tsx](../../retail-operations-portal/src/components/ApprovalActionBar.tsx) sprawdza `role === "admin" || role === "manager"` z Redux store i warunkowo ukrywa przyciski akcji. To **nie jest granica bezpieczeństwa** — przy podpięciu prawdziwego backendu wymagałoby wymuszenia autoryzacji po stronie serwera/API, bo obecny check jest trywialny do obejścia (np. przez modyfikację stanu w devtools). [FileImportWidget.tsx](../../retail-operations-portal/src/components/FileImportWidget.tsx) ogranicza wybór plików do `.csv` atrybutem `accept`, co jest wyłącznie podpowiedzią UI, nie kontrolą bezpieczeństwa — obecnie nieistotne, bo parsowanie CSV jest zaślepką (`importProductsFromCsv` nic nie robi z zawartością pliku). Nie znaleziono użycia `dangerouslySetInnerHTML` w przeglądanych plikach.

## 12. Skalowalność i utrzymywalność

Repozytorium samo dokumentuje kilka anti-patternów jako zamierzone (komentarze w `types.ts`, `store.ts`) — wskazuje to na cel szkoleniowy/ćwiczeniowy (potwierdzone też przez `exercises/` i `docs/ai-sessions/`, poza zakresem analizy wg [CLAUDE.md](../../CLAUDE.md)). Dodanie nowej domeny biznesowej wymaga dotknięcia ok. 5 miejsc (`api/*`, `mock-data/*`, slice w `store/*`, strona w `pages/*`, wpis w `routes.tsx`) — powtarzalne, ale spójne dzięki współdzielonym abstrakcjom (`createListSlice`, `useLoadList`, `DataTable`, `SimpleListPage`), co ogranicza ryzyko niespójności między domenami.

## 13. Rekomendacje

- **Krytyczne:** przed jakimkolwiek podpięciem prawdziwego backendu — zastąpić `currentUserSlice` realnym mechanizmem uwierzytelniania i przenieść egzekwowanie autoryzacji (np. logika z `ApprovalActionBar`) na stronę serwera/API; obecny check roli po stronie klienta nie jest zabezpieczeniem.
- **Ważne:** dodać framework testowy (naturalny wybór to Vitest przy Vite) zanim liczba domen/funkcji dalej wzrośnie; rozważyć code-splitting tras (`React.lazy`) w `routes.tsx` przy dalszym wzroście liczby stron; jeśli projekt ma ewoluować w stronę produkcyjną — rozbić `types.ts` na moduły per domena.
- **Opcjonalne:** włączyć tryb `typeAware` w `oxlint` (instrukcja już opisana w README projektu); dodać konfigurację formattera (Prettier) dla spójności stylu.
