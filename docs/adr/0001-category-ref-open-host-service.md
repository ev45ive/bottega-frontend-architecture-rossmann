# 0001. Ref + Open Host Service jako standardowy wzorzec granic międzymodułowych

## Status

Proponowany

## Kontekst

- Driver D2: moduły/zespoły nie mogą się wzajemnie blokować przy wydaniu.
- [ADR-0000](./0000-podzial-na-moduly-domenowe.md) wprowadził granice modułów, ale odłożył budowę ACL
  między nimi na później, per relacja.
- [Context Map](../context-map/context-map.md) nazywa kilka takich relacji opartych na surowym ID bez
  warstwy tłumaczenia (Catalog→Pricing, Catalog→Promotions, Catalog→Warehouse & Suppliers,
  Pricing→Promotions) — w każdej z nich konsument zależy od pełnego modelu i stanu dostawcy, więc
  zmiana kształtu danych po stronie dostawcy może po cichu złamać konsumenta.
- Pierwszy konkretny przypadek: Pricing zależy dziś bezpośrednio od pełnego modelu `Category` i
  wewnętrznego stanu Catalog.

## Decyzja

Ustanawiamy trwały wzorzec dla **wszystkich** granic międzymodułowych z Context Map (obecnych i
przyszłych): moduł-dostawca publikuje minimalną, tylko-do-odczytu projekcję swojego modelu (**Ref**)
jako Open Host Service — jawny, publiczny kontrakt. Warstwa tłumaczenia zawsze leży po stronie
dostawcy, nie konsumenta; konsument zależy wyłącznie od Ref, nigdy od pełnego modelu ani wewnętrznego
stanu dostawcy.

Pierwsze zastosowanie: Catalog publikuje `CategoryRef` (identyfikator + nazwa), Pricing przestaje
zależeć od pełnego modelu `Category`. Plan wdrożenia i checklist:
[docs/migrations/2026-09-02-category-ref-ohs-handoff.md](../migrations/2026-09-02-category-ref-ohs-handoff.md).

Branding identyfikatorów pozostaje świadomie odłożony jako osobny, niepotwierdzony problem.

## Rozważane alternatywy

- **ACL po stronie konsumenta** — odrzucone: i tak wymaga zależności od pełnego modelu dostawcy, gorzej
  się skaluje niż jeden wzorzec egzekwowany konsekwentnie po stronie dostawcy.
- **Branding identyfikatorów zamiast Ref** — odrzucone: inny problem (unikalność identyfikatorów),
  wyższy koszt, brak potwierdzonej potrzeby biznesowej.
- **Status quo / decyzja per relacja** — odrzucone: to właśnie stan bez wspólnego wzorca jest hotspotem
  sprzecznym z D2, a osobna decyzja dla każdej relacji niepotrzebnie mnoży ADR-y.

## Konsekwencje

Pozytywne:

- Żaden moduł nie zależy od pełnego kształtu modelu innego modułu — zmiany wewnętrzne nie łamią cicho
  konsumentów, dopóki Ref pozostaje stabilny.
- Kontrakty między modułami są jawne, widoczne w publicznym API — zgodnie z zasadą modulith z ADR-0000.
- Jeden wzorzec pokrywa wszystkie hotspoty z Context Map — kolejne relacje wdraża się od razu wg tego
  samego kontraktu.

Negatywne / kompromisy:

- Każda relacja Ref to równoległa kopia fragmentu danych po stronie konsumenta — pogłębia istniejący
  anti-pattern jednego globalnego stanu aplikacji dla wszystkich domen.
- Bez brandingu identyfikatorów system typów nadal nie chroni przed pomyłkowym użyciem identyfikatora
  z innej domeny.
- Wzorzec wymaga konsekwentnego egzekwowania (code review / reguły ESLint) przy każdej nowej granicy —
  ryzyko niespójnego stosowania, jeśli nie będzie pilnowane.

## Powiązane

- [ADR-0000](./0000-podzial-na-moduly-domenowe.md) — fizyczny podział na moduły; ten ADR wypełnia
  treścią odłożone tam ACL.
- [Context Map](../context-map/context-map.md) — hotspoty "surowe ID bez ACL" (Catalog→Pricing,
  Catalog→Promotions, Catalog→Warehouse & Suppliers, Pricing→Promotions), wszystkie objęte tym
  wzorcem.
- Handoff/plan wdrożenia pierwszego zastosowania (Catalog→Pricing):
  [docs/migrations/2026-09-02-category-ref-ohs-handoff.md](../migrations/2026-09-02-category-ref-ohs-handoff.md).
