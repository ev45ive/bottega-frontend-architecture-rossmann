# 0000. Podział na moduły domenowe

## Status

Proponowany

## Kontekst

- Driver D2 (ARCHITECTURE.md): zespoły Pricing i Catalog nie mogą się wzajemnie blokować przy wydaniu.
- Driver D4: nowi dostawcy frontendu (zespół B2B) muszą móc dołączyć bez przepisywania shella — wymaga docelowo wydzielonych, niezależnie wdrażanych modułów (np. Module Federation), do czego obecna struktura nie jest przygotowana.
- Driver D1: czas wdrożenia zmiany w regułach promocji musi spaść z ~3 tyg. do < 3 dni — wymaga możliwości niezależnego wdrażania zmian w module Pricing/Promotions.
- Context Map ([context-map.md](../context-map/context-map.md)) identyfikuje hotspot: `types.ts` to jeden płaski plik DTO dla wszystkich 14 bounded contexts ("brownfield anti-pattern" — komentarz wprost w kodzie), a `Promotion.productIds`/`Promotion.pricingRuleIds`/`WarehouseStock.productId` referują Catalog/Pricing przez surowe ID bez żadnej warstwy tłumaczenia (ACL) — sprzeczne z D2, bo zmiana kształtu modelu w jednym module może po cichu złamać inny.
- Dziś repozytorium (`retail-operations-portal`) to pojedyncza aplikacja bez wewnętrznych granic modułów — kod zorganizowany płasko wg typu pliku (`api/`, `store/`, `pages/`), nie wg domeny.

## Decyzja

Wprowadzamy podział kodu aplikacji na 4 moduły domenowe (modulith), odzwierciedlające 4 domeny z [context-map.md](../context-map/context-map.md):

- **`product-catalog`** — konteksty Catalog, Import/Export.
- **`product-pricing`** — konteksty Pricing, Promotions, Customer Segments, Validation Queue, Approvals.
- **`sales-fulfilment`** — konteksty Orders & Returns, Warehouse & Suppliers.
- **`platform/shared`** — konteksty Reports, Notifications, Audit Log, Identity/Users, Feature Flags.

Podział jest fizyczny w ramach jednej aplikacji (jeden `package.json`, bez npm/pnpm workspaces na tym etapie): każdy moduł to folder z jawnym publicznym API (np. `index.ts`) i prywatną implementacją; dostęp między modułami wyłącznie przez publiczne API, egzekwowany regułami ESLint (zakaz głębokich importów poza publiczne API innego modułu).

Granice modułów mają stopniowo adresować hotspot D2 (referencje przez surowe ID bez ACL) — nie wszystkie relacje muszą dostać pełną warstwę ACL od razu; priorytetem tego ADR jest sama granica fizyczna/importowa między modułami, tłumaczenie modelu (ACL) wprowadzane jest stopniowo, per relacja, w kolejnych krokach.

## Rozważane alternatywy

- **Pozostać przy płaskiej strukturze** (`api/`, `store/`, `pages/` wg typu pliku, nie wg domeny) — odrzucone: brak wymuszonej granicy, sprzeczne z D2, utrudnia realizację D4.
- **Pełny monorepo z osobnymi pakietami npm (workspaces) od razu** — odrzucone na tym etapie jako przedwczesne; brak dziś potrzeby osobnego wersjonowania/publikowania modułów.
- **Pełne Module Federation / osobne aplikacje per moduł od razu** — odrzucone jako przedwczesne wobec D4 (rozszerzalność to wymaganie na przyszłość, nie natychmiastowe); modulith traktowany jako krok pośredni ułatwiający późniejsze wydzielenie.

## Konsekwencje

Pozytywne:

- Granice modułów odzwierciedlają ownership map w [ARCHITECTURE.md](../ARCHITECTURE.md) (Catalog Team, Pricing Team, Sales & Fulfillment Team, Platform Team).
- Fundament pod przyszłe wydzielenie modułów jako niezależnie wdrażanych jednostek (realizuje D4 stopniowo, bez przedwczesnej inwestycji w Module Federation).
- Łatwiej wymusić brak przypadkowych zależności międzydomenowych (reguły ESLint) niż w płaskiej strukturze.

Negatywne / kompromisy:

- Wymaga migracji istniejącego kodu (`api/`, `store/`, `pages/`, `types.ts`) do nowej struktury folderów — ryzyko regresji.
- Współdzielony `types.ts` trzeba rozbić per moduł, co ujawni dziś ukryte zależności (np. `Promotion.productIds`/`pricingRuleIds`) i może wymagać wprowadzenia ACL lub świadomej duplikacji typów.
- Dopóki nie powstanie pełny ACL między modułami, granica jest częściowa — ryzyko "modulith na papierze", jeśli reguły ESLint nie będą konsekwentnie egzekwowane.
- Nazwa `platform/shared` łączy w jednym module potencjalnie dwa różne pojęcia (platforma vs. rzeczy współdzielone) — może wymagać doprecyzowania w przyszłości.

## Powiązane

- Context Map: [context-map.md](../context-map/context-map.md) — pełny podział na 14 bounded contexts / 4 domeny, w tym hotspoty "surowe ID bez ACL" (Catalog→Pricing/Promotions/Warehouse) i propozycja rozdzielenia Validation Queue/Approvals na własne agregaty — powiązane, ale nieadresowane w całości przez to ADR.
- Ownership map i drivery D1, D2, D4 w [ARCHITECTURE.md](../ARCHITECTURE.md).
