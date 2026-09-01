# Raport analizy architektury frontendu

## Metadane raportu

- **Data analizy:** 2026-09-01
- **Tryb analizy:** pełna
- **Zakres:** cały projekt `retail-operations-portal/`
- **Autor:** Mateusz Kulesza <ev45ive@gmail.com>
- **Model AI:** Claude Sonnet 5
- **Powiązany wcześniejszy raport (jeśli aktualizacja):** brak — analiza wykonana od zera, niezależnie od [2026-09-01_analiza-pelna-retail-operations-portal.md](./2026-09-01_analiza-pelna-retail-operations-portal.md)

## 1. Kontekst i cel

Projekt nie dokumentuje własnego kontekstu w README (`retail-operations-portal/README.md` to niezmieniony szablon Vite/React). Kontekst biznesowy pochodzi z [docs/ARCHITECTURE.md](../ARCHITECTURE.md): „Retail Operations Portal — system back-office do obsługi produktów, zamówień oraz procesu promocji handlowej”, z listą driverów (D1–D4) i mapą ownership, które w większości pól mają wartość `_TBD_`.

Kod źródłowy w licznych komentarzach jawnie opisuje siebie jako materiał warsztatowy/ćwiczeniowy dot. przyszłego podziału na moduły/mikrofrontendy, np.:
- [src/store/store.ts](../../retail-operations-portal/src/store/store.ts) linia 17: „One store for every domain — intentional 'global store as the app's database' anti-pattern.”
- [src/types.ts](../../retail-operations-portal/src/types.ts) linia 1: „Shared DTOs used across every domain — intentionally one flat file (brownfield anti-pattern).”
- [src/pages/ProductsPage.tsx](../../retail-operations-portal/src/pages/ProductsPage.tsx) linia 15: „Extraction candidate #1 (Dzień 1, Blok C1)”.
- [src/pages/SuppliersPage.tsx](../../retail-operations-portal/src/pages/SuppliersPage.tsx) linia 8: „Extraction candidate #2 (Dzień 1, Blok C4)”.

Powiązany ADR [0000-podzial-na-moduly-domenowe.md](../docs/adr/0000-podzial-na-moduly-domenowe.md) ma status „Proponowany”, ale wszystkie jego sekcje (Kontekst, Decyzja, Alternatywy, Konsekwencje, Powiązane) są nadal pustymi placeholderami z szablonu — decyzja nie jest jeszcze udokumentowana.

## 2. Stack technologiczny

**Stan obecny:**

- Framework: React 19.2 (`react`, `react-dom` ^19.2.8) + TypeScript ~6.0.2, budowany Vite 8.2 ([package.json](../../retail-operations-portal/package.json)).
- Routing: `react-router-dom` ^7.18.3, konfiguracja w [src/routes.tsx](../../retail-operations-portal/src/routes.tsx) przez `createBrowserRouter`.
- Stan globalny: `@reduxjs/toolkit` ^2.12.0 + `react-redux` ^9.3.0.
- UI: `shadcn` ^4.19.0 na bazie `@base-ui/react` ^1.7.0 (nie Radix), Tailwind CSS 4.3 (`@tailwindcss/vite`), `lucide-react`, `class-variance-authority`, `tailwind-merge`, `next-themes`, `sonner` (toasty).
- Brak dedykowanej biblioteki formularzy/walidacji (np. react-hook-form, zod) w zależnościach.
- Linter: `oxlint` ^1.79.0, konfiguracja [.oxlintrc.json](../../retail-operations-portal/.oxlintrc.json) z pluginami `react`, `typescript`, `oxc`.
- Brak frameworka testowego w `devDependencies` (brak vitest/jest/testing-library).

**Skrypty i automatyzacje:**

| Skrypt/polecenie | Źródło | Opis |
| --- | --- | --- |
| `npm run dev` | `retail-operations-portal/package.json#scripts.dev` | `vite` — serwer deweloperski |
| `npm run build` | `retail-operations-portal/package.json#scripts.build` | `tsc -b && vite build` — typecheck + build produkcyjny |
| `npm run lint` | `retail-operations-portal/package.json#scripts.lint` | `oxlint` |
| `npm run preview` | `retail-operations-portal/package.json#scripts.preview` | `vite preview` |
| `npm test` (root) | `package.json#scripts.test` (root repo) | placeholder: `echo "Error: no test specified" && exit 1` |

Brak katalogu `.github/workflows` lub innej konfiguracji CI w repozytorium (potwierdzone listingiem katalogu głównego).

**Uwagi:**

- Brak narzędzia testowego i brak CI oznacza, że `npm run build`/`lint` nie są automatycznie egzekwowane przy zmianach.
- `shadcn` na `@base-ui/react` zamiast Radix ma odmienne API (`render` zamiast `asChild`) — istotne przy dalszej rozbudowie komponentów `ui/`.

## 3. Struktura katalogów i konwencje

**Stan obecny:**

- Organizacja warstwowa (layer-based), nie feature-based: `src/api/`, `src/components/` (w tym `components/ui/` jako warstwa design-systemu shadcn), `src/layout/`, `src/pages/`, `src/store/`, `src/mock-data/`.
- 19 stron w `src/pages/` odpowiada 1:1 trasom w [routes.tsx](../../retail-operations-portal/src/routes.tsx) (Products, Promotions, PricingRules, ValidationQueue, Approvals, Reports, Suppliers, Orders, Warehouse, Categories, CustomerSegments, Returns, ImportExport, Notifications, AuditLog, Users, + szczegóły/wizard).
- Alias importów `@/*` → `./src/*` skonfigurowany w [tsconfig.app.json](../../retail-operations-portal/tsconfig.app.json) i [tsconfig.json](../../retail-operations-portal/tsconfig.json).
- Każda domena ma równoległy zestaw plików: `api/<domena>.ts`, `store/<domena>Slice.ts`, `mock-data/<domena>.json`, `pages/<Domena>Page.tsx` — konwencja konsekwentna we wszystkich 14 domenach.
- Typy wszystkich domen scentralizowane w jednym pliku [src/types.ts](../../retail-operations-portal/src/types.ts) (opisane w kodzie jako celowy anti-pattern, patrz sekcja 1).

**Uwagi:**

- Struktura layer-based (zamiast feature/domain folders) sprawia, że zmiana jednej domeny dotyka plików rozproszonych w 4 różnych katalogach top-level — zgodnie z zamierzonym celem ćwiczenia (materiał pod ekstrakcję modułów).

## 4. Warstwa danych/API

**Stan obecny:**

- Wzorzec API klienta jednolity dla wszystkich 13 plików w `src/api/`: import danych z `mock-data/*.json`, budowa `Map` w pamięci jako „bazy” (np. [src/api/products.ts](../../retail-operations-portal/src/api/products.ts) linia 4: `const db = new Map(...)`), funkcje `list*/get*/update*` zwracające `Promise` opóźniony przez wspólny helper [src/api/delay.ts](../../retail-operations-portal/src/api/delay.ts) (`setTimeout` domyślnie 200 ms).
- Brak realnego klienta HTTP (fetch/axios) — cała warstwa działa wyłącznie na mockach w pamięci przeglądarki; stan resetuje się przy odświeżeniu strony.
- Import/eksport CSV jest zaślepiony: [src/api/products.ts](../../retail-operations-portal/src/api/products.ts) `importProductsFromCsv` zawsze zwraca `{ imported: 0 }` bez parsowania pliku.
- Brak warstwy cache/fetching (np. React Query, SWR) — pobieranie i zapis do store realizowane ręcznie przez hook [src/store/useLoadList.ts](../../retail-operations-portal/src/store/useLoadList.ts).

**Uwagi:**

- Ujednolicony wzorzec API ułatwia mechaniczną podmianę na realny HTTP klient per-domena bez zmiany konsumentów, o ile kontrakt (`list*/get*`) zostanie zachowany.
- `importProductsFromCsv` bez faktycznej logiki to funkcjonalny placeholder — do zaadresowania przed jakimkolwiek demo/testem tej ścieżki.

## 5. Zarządzanie stanem

**Stan obecny:**

- Jeden globalny store Redux Toolkit ([src/store/store.ts](../../retail-operations-portal/src/store/store.ts)) z 14 reducerami — po jednym na domenę, w tym `currentUser` i `featureFlags`.
- Generyczna fabryka slice'ów [src/store/createListSlice.ts](../../retail-operations-portal/src/store/createListSlice.ts): każdy slice domenowy to `{ items: T[], loaded: boolean }` z akcjami `setItems`/`upsertItem` (np. [src/store/productsSlice.ts](../../retail-operations-portal/src/store/productsSlice.ts) to 3-linijkowy plik wywołujący fabrykę).
- Ładowanie danych ujednolicone przez hook [src/store/useLoadList.ts](../../retail-operations-portal/src/store/useLoadList.ts): fetch przy pierwszym użyciu strony, jeśli `!loaded`.
- `currentUser` to hardkodowany użytkownik ([src/store/currentUserSlice.ts](../../retail-operations-portal/src/store/currentUserSlice.ts) — komentarz: „No login screen yet (Tier 3, added Day 3)”), reducers puste — brak akcji logowania/wylogowania.
- [src/components/GlobalSearch.tsx](../../retail-operations-portal/src/components/GlobalSearch.tsx) czyta bezpośrednio ze store'ów trzech różnych domen (`products`, `promotions`, `orders`) — jawnie skomentowane jako „deliberate cross-domain coupling (API composition topic)”.

**Uwagi:**

- Jeden store „jako baza danych aplikacji” to świadomy anti-pattern celem ćwiczenia migracji na architekturę modułową; w obecnym stanie każda domena jest jednak łatwo separowalna dzięki jednolitej fabryce slice'ów.
- Bezpośrednie odczyty cross-domenowe w `GlobalSearch` są punktem, który będzie wymagał przeprojektowania (np. przez zdarzenia/API kompozycji) przy podziale na moduły.

## 6. Routing i nawigacja

**Stan obecny:**

- Pojedyncza konfiguracja routera w [src/routes.tsx](../../retail-operations-portal/src/routes.tsx) przez `createBrowserRouter`, jeden layout `AppLayout` z zagnieżdżonymi trasami (`Outlet`).
- Brak lazy loading (`React.lazy`/`import()`) — wszystkie strony importowane statycznie na starcie.
- Brak guardów/autoryzacji na poziomie routingu — kontrola dostępu (patrz sekcja 11) realizowana punktowo w komponentach (np. `ApprovalActionBar`), nie na poziomie tras.
- [src/layout/Sidebar.tsx](../../retail-operations-portal/src/layout/Sidebar.tsx) dzieli linki na dwie sekcje: „Proces promocji” (`CORE_LINKS`, 7 tras) i „Pozostałe domeny” (`BUFFER_LINKS`, 10 tras) — podział wizualny odzwierciedlający priorytet procesu promocji nad resztą.

**Uwagi:**

- Brak code-splittingu przy 19 stronach oznacza jeden duży bundle JS ładowany na starcie (patrz też sekcja 10).
- Brak guardów tras: strona `settings/users` (zarządzanie rolami) jest dostępna pod tym samym adresem niezależnie od roli zalogowanego użytkownika — kontrola dostępu jest wyłącznie kosmetyczna wewnątrz konkretnych komponentów.

## 7. Komponenty i UI

**Stan obecny:**

- Design system: `src/components/ui/` — 18 komponentów shadcn (`button`, `card`, `dialog`, `select`, `table`, `tabs`, `checkbox`, `sonner` itd.), oparte o `@base-ui/react` (nie Radix).
- Komponenty domenowo-niezależne wielokrotnego użytku w `src/components/`: `DataTable.tsx` (generyczna tabela z wyszukiwaniem, paginacją, selekcją wierszy i akcjami masowymi — używana przez większość stron list, np. [ProductsPage.tsx](../../retail-operations-portal/src/pages/ProductsPage.tsx), [UsersPage.tsx](../../retail-operations-portal/src/pages/UsersPage.tsx)), `StatusBadge`, `ConfirmationModal`, `KpiCard`, `FileImportWidget`, `ApprovalActionBar`, `ValidationResultsPanel`, `PromotionStatusTimeline`, `AuditTrailList`, `ProductPicker`, `PricingRuleForm`.
- `AppErrorBoundary` ([src/components/AppErrorBoundary.tsx](../../retail-operations-portal/src/components/AppErrorBoundary.tsx)) — class component izolujący awarię sekcji; jedyne użycie w kodzie to [src/pages/PromotionDetailsPage.tsx](../../retail-operations-portal/src/pages/PromotionDetailsPage.tsx) linia 137, wokół widgetu wydajności promocji.
- `cn()` helper ([src/lib/utils.ts](../../retail-operations-portal/src/lib/utils.ts)) łączy `clsx` + `tailwind-merge`, standardowy wzorzec shadcn.

**Uwagi:**

- `AppErrorBoundary` istnieje jako wzorzec, ale jest użyty tylko w jednym miejscu — pozostałe strony/sekcje nie mają izolacji awarii.
- Podział prezentacyjne/kontenerowe nie jest ściśle rozdzielony: strony (np. `ProductsPage`) łączą pobieranie danych (przez hooki store'owe), logikę selekcji i renderowanie w jednym pliku.

## 8. Typowanie i jakość kodu

**Stan obecny:**

- TypeScript ~6.0.2 ze ścisłymi opcjami w [tsconfig.app.json](../../retail-operations-portal/tsconfig.app.json): `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`, `erasableSyntaxOnly`; brak `baseUrl` (tylko `paths`, zgodnie z TS 5.x/6.x deprecацją top-level `baseUrl`).
- `moduleResolution: "bundler"`, `noEmit: true` — typecheck oddzielony od budowania (build = `tsc -b && vite build`).
- Lintowanie przez `oxlint` ([.oxlintrc.json](../../retail-operations-portal/.oxlintrc.json)) z regułami `react/rules-of-hooks: error` i `react/only-export-components: warn`; brak włączonego `typeAware` (opcja opisana w README jako opcjonalna, niewłączona).
- Typy domenowe scentralizowane w jednym pliku [src/types.ts](../../retail-operations-portal/src/types.ts) (~110 linii, wszystkie interfejsy domen).

**Uwagi:**

- Brak type-aware lint rules (`options.typeAware`) ogranicza wykrywanie błędów związanych z typami (np. niebezpieczne rzutowania) — w [src/api/products.ts](../../retail-operations-portal/src/api/products.ts) linia 4 widoczne jest rzutowanie `p as Product` bez walidacji runtime.
- Jeden plik `types.ts` dla wszystkich domen jest świadomie oznaczony w kodzie jako do zmiany przy podziale modułowym.

## 9. Testowanie

**Stan obecny:**

- Brak jakiegokolwiek frameworka testowego w zależnościach (`retail-operations-portal/package.json` — brak vitest/jest/@testing-library/playwright/cypress).
- Skrypt `test` w root [package.json](../../package.json) to nieaktywny placeholder (`echo "Error: no test specified" && exit 1`), nie dotyczy `retail-operations-portal/`.
- Brak katalogów `__tests__`, plików `*.test.tsx`/`*.spec.tsx` w `retail-operations-portal/src/`.

**Uwagi:**

- Zerowe pokrycie testami dla 19 stron, 14 domen store'a/API i ~30 komponentów — każda zmiana wymaga ręcznej weryfikacji manualnej.

## 10. Wydajność

**Stan obecny:**

- Brak code-splittingu tras (statyczne importy wszystkich 19 stron w [routes.tsx](../../retail-operations-portal/src/routes.tsx)) i brak `React.lazy` gdziekolwiek w `src/`.
- Symulowane opóźnienie sieciowe jest stałe i niewielkie (`delay()` domyślnie 200 ms, [src/api/delay.ts](../../retail-operations-portal/src/api/delay.ts)) — nie odzwierciedla realnych warunków sieciowych.
- Dane trzymane w całości w pamięci (`Map` per domena) — brak paginacji po stronie „API”, cała lista ładowana naraz; paginacja (`DataTable`, `pageSize=8`) jest wyłącznie kliencka.

**Uwagi:**

- Brak lazy loading tras przy 19 stronach i rosnącej liczbie zależności UI (shadcn/base-ui) będzie zwiększać rozmiar początkowego bundla wraz z rozwojem projektu.

## 11. Bezpieczeństwo

**Stan obecny:**

- Brak ekranu logowania — `currentUser` to zawsze hardkodowany admin ([src/store/currentUserSlice.ts](../../retail-operations-portal/src/store/currentUserSlice.ts)), brak mechanizmu autentykacji.
- Kontrola dostępu oparta o rolę realizowana wyłącznie w warstwie prezentacji, po stronie klienta: [src/components/ApprovalActionBar.tsx](../../retail-operations-portal/src/components/ApprovalActionBar.tsx) linia 13 (`role === "admin" || role === "manager"`) ukrywa przyciski, ale nie blokuje żadnego wywołania API — nie ma serwera/backendu egzekwującego uprawnienia (cała warstwa `api/*` operuje na mockach w pamięci bez żadnej weryfikacji roli).
- Strona `settings/users` (zmiana ról, [src/pages/UsersPage.tsx](../../retail-operations-portal/src/pages/UsersPage.tsx)) nie jest w żaden sposób ograniczona trasą ani rolą.
- Brak walidacji danych wejściowych po stronie klienta poza prostymi sprawdzeniami wymagalności (np. `canCreate` w [PromotionWizardPage.tsx](../../retail-operations-portal/src/pages/PromotionWizardPage.tsx)) — brak biblioteki walidacyjnej (zod/yup).
- Nie znaleziono użyć `dangerouslySetInnerHTML`, `localStorage`/`sessionStorage` do przechowywania danych wrażliwych, ani ręcznego wstrzykiwania HTML.

**Uwagi:**

- Autoryzacja wyłącznie po stronie klienta (bez backendu) jest oczekiwana w projekcie mockowym/warsztatowym, ale stanowi wzorzec do jawnego oznaczenia jako „nieprodukcyjny” — przy podłączeniu realnego API każdy endpoint musi dodatkowo weryfikować rolę serwerowo.
- Brak walidacji wejścia (np. dat w kreatorze promocji, pliku CSV) zwiększa ryzyko błędów danych przy podłączeniu realnego backendu.

## 12. Skalowalność i utrzymywalność

**Stan obecny:**

- Konsekwentny wzorzec „domena = api + slice + mock-data + strona” powtórzony 14×, co ułatwia mechaniczne odseparowanie pojedynczej domeny do osobnego modułu/pakietu.
- Świadomie oznaczone w kodzie punkty sprzężenia międzydomenowego: `GlobalSearch` (sekcja 5), pojedynczy store (`store.ts`), pojedynczy plik typów (`types.ts`) — wszystkie trzy są jawnie wskazane komentarzami jako materiał do refaktoryzacji.
- ADR [0000-podzial-na-moduly-domenowe.md](../docs/adr/0000-podzial-na-moduly-domenowe.md) i [docs/ARCHITECTURE.md](../ARCHITECTURE.md) (Ownership map) dokumentują zamiar podziału na moduły, ale kluczowe pola (`Kontekst`, `Decyzja`, domeny w Ownership map) pozostają nieuzupełnione (`_TBD_`).

**Uwagi:**

- Ryzyko: dokumentacja architektoniczna (ADR, Ownership map) jest w stanie szkieletowym — decyzje o podziale modułowym nie są jeszcze podjęte formalnie, mimo że kod już zawiera przygotowane „punkty cięcia”.
- Dobra izolacja wzorca per-domenowego obniża koszt ewentualnej migracji do osobnych pakietów/modułów, o ile sprzężenia (`GlobalSearch`, wspólny store, wspólny plik typów) zostaną zaadresowane w pierwszej kolejności.

## 13. Rekomendacje

- **Krytyczne:** żadne w zakresie samej architektury frontendowej nie blokują bieżącego działania aplikacji (projekt działa w całości na mockach); brak testów i brak CI to jednak krytyczny brak zabezpieczenia przed regresją przy dalszym rozwoju.
- **Ważne:**
  - Uzupełnić ADR 0000 (Kontekst/Decyzja/Alternatywy/Konsekwencje) zanim rozpocznie się faktyczny podział na moduły — obecnie brak formalnej decyzji mimo przygotowanego kodu.
  - Dodać minimalny framework testowy (np. Vitest + Testing Library) i pipeline CI (`.github/workflows`) wykonujący `lint` + `build` + testy.
  - Rozwiązać jawnie oznaczone sprzężenia międzydomenowe (`GlobalSearch`, wspólny `store.ts`, wspólny `types.ts`) przed lub w trakcie ekstrakcji pierwszych modułów.
- **Opcjonalne:**
  - Wprowadzić lazy loading tras (`React.lazy`) w [routes.tsx](../../retail-operations-portal/src/routes.tsx) dla stron spoza „core” procesu promocji.
  - Rozszerzyć użycie `AppErrorBoundary` na więcej sekcji niż tylko widget wydajności promocji.
  - Włączyć `options.typeAware` w `.oxlintrc.json` dla lintowania świadomego typów.
