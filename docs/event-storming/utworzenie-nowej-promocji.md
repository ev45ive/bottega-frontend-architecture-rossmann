# Event Storming: Utworzenie nowej promocji

## Kontekst

- **Rola / aktor:** Manager
- **Cel końcowy (end goal):** Nowa promocja jest utworzona i czeka na zatwierdzenie
- **Status:** in-progress
- **Data:** 2026-09-01

> **Uwaga metodologiczna:** ten dokument został wywnioskowany z istniejącego kodu (`PromotionWizardPage.tsx`, `PromotionDetailsPage.tsx`, `api/promotions.ts`, `store/promotionsSlice.ts`, `PromotionStatusTimeline.tsx`, `ApprovalActionBar.tsx`, `ValidationResultsPanel.tsx`), a nie z warsztatu z użytkownikiem. Wymaga potwierdzenia przez osobę merytoryczną (manager/product owner) przed uznaniem za źródło prawdy.

## Big Picture

<!-- Diagram wysokopoziomowy: łańcuch zdarzeń domenowych (E1, E2, ...) w kolejności czasowej.
     Aktualizuj po każdym kroku - dodaj nowy węzeł zdarzenia i połącz go z poprzednim. -->

```mermaid
flowchart LR
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef hotspot fill:#ef4444,stroke:#7f1d1d,color:#fff

  E1{{"Promocja utworzona (draft)"}}:::event --> E2{{"Promocja wysłana do walidacji"}}:::event
  E2 --> E3a{{"Walidacja zakończona pozytywnie"}}:::event
  E2 --> E3b{{"Walidacja wykryła problemy (powrót do draft)"}}:::event
  E3b -.->|manager poprawia dane| E2
  E3a --> E4a{{"Promocja zaakceptowana i aktywowana"}}:::event
  E3a --> E4b{{"Promocja odrzucona (powrót do draft)"}}:::event
  E4b -.->|manager poprawia dane| E2
  E4a --> E5{{"Promocja zarchiwizowana"}}:::event
```

## Kroki

<!-- Jeden ### Step per zdarzenie/decyzja. Skopiuj blok poniżej dla każdego nowego kroku. -->

### Step 1: Promocja utworzona i wysłana do walidacji

```mermaid
flowchart LR
  classDef actor fill:#5eead4,stroke:#0f766e,color:#000
  classDef command fill:#93c5fd,stroke:#1d4ed8,color:#000
  classDef aggregate fill:#fef08a,stroke:#b45309,color:#000
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef policy fill:#d8b4fe,stroke:#6b21a8,color:#000
  classDef view fill:#86efac,stroke:#15803d,color:#000

  Actor((🧑 Manager)):::actor -->|widzi| View1[📺 Kreator promocji: wybór produktów, reguł cenowych, dat]:::view
  Actor -->|wykonuje| Cmd1[Utwórz promocję]:::command
  Cmd1 --> Agg1[(Promotion)]:::aggregate
  Agg1 --> E1{{"Promocja utworzona (draft)"}}:::event
  E1 --> Pol1[/whenever Promocja utworzona<br/>then wyślij do walidacji/]:::policy
  Pol1 --> Cmd2[Wyślij do walidacji]:::command
  Cmd2 --> Agg1
  Agg1 --> E2{{"Promocja wysłana do walidacji"}}:::event
```

- **Widok (view):** Kreator promocji (`PromotionWizardPage`) — zakładki: wybór produktów (`ProductPicker`), reguły cenowe (lista + formularz nowej reguły), oraz informacyjne zakładki walidacji/akceptacji/aktywacji odsyłające do strony szczegółów.
- **Agregat(y):** `Promotion` (nazwa, `productIds`, `pricingRuleIds`, `startDate`, `endDate`, `createdBy`, `status`).
- **Komenda(y):** "Utwórz promocję i wyślij do walidacji" (jeden przycisk w UI wywołuje dwie komendy pod spodem: `createPromotion` → `submitPromotionForValidation`).
- **Reguły / polityki:** Przycisk aktywny tylko gdy podano nazwę, co najmniej 1 produkt oraz obie daty (`canCreate`). Wysłanie do walidacji następuje automatycznie zaraz po utworzeniu, bez odrębnej decyzji managera — modelowane jako polityka.
- **Zmiany stanu:** Nowy `Promotion` powstaje ze statusem `draft`, następnie natychmiast aktualizowany na `pending_validation`.
- **Zdarzenie(a) domenowe:** `Promocja utworzona (draft)`, `Promocja wysłana do walidacji`.

### Step 2: Walidacja promocji

```mermaid
flowchart LR
  classDef actor fill:#5eead4,stroke:#0f766e,color:#000
  classDef command fill:#93c5fd,stroke:#1d4ed8,color:#000
  classDef aggregate fill:#fef08a,stroke:#b45309,color:#000
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef view fill:#86efac,stroke:#15803d,color:#000
  classDef hotspot fill:#ef4444,stroke:#7f1d1d,color:#fff

  Actor((🧑 Manager)):::actor -->|widzi| View2[📺 Panel wyników walidacji]:::view
  Actor -->|wykonuje| Cmd3[Uruchom walidację]:::command
  Cmd3 --> Agg1[(Promotion)]:::aggregate
  Agg1 --> E3a{{"Walidacja zakończona pozytywnie"}}:::event
  Agg1 --> E3b{{"Walidacja wykryła problemy"}}:::event
  H1{{"Brak jasnej ścieżki powrotu do kreatora po niepowodzeniu"}}:::hotspot
  E3b -.-> H1
```

- **Widok (view):** `ValidationResultsPanel` na stronie szczegółów promocji (`PromotionDetailsPage`) — widoczny gdy status to `pending_validation` lub `draft` z nieudaną walidacją.
- **Agregat(y):** `Promotion` (pole `validation: { passed, issues, checkedAt }`).
- **Komenda(y):** "Uruchom walidację" (`runValidation`).
- **Reguły / polityki:** Naiwna reguła: brak wybranych produktów → issue "Brak wybranych produktów"; brak reguły cenowej → issue "Brak reguły cenowej". Walidacja przechodzi tylko gdy `issues` jest puste.
- **Zmiany stanu:** `Promotion.validation` ustawiany zawsze; `status` → `pending_approval` (sukces) lub z powrotem → `draft` (niepowodzenie).
- **Zdarzenie(a) domenowe:** `Walidacja zakończona pozytywnie`, `Walidacja wykryła problemy`.

### Step 3: Akceptacja i aktywacja promocji

```mermaid
flowchart LR
  classDef actor fill:#5eead4,stroke:#0f766e,color:#000
  classDef command fill:#93c5fd,stroke:#1d4ed8,color:#000
  classDef aggregate fill:#fef08a,stroke:#b45309,color:#000
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef view fill:#86efac,stroke:#15803d,color:#000
  classDef hotspot fill:#ef4444,stroke:#7f1d1d,color:#fff

  Actor((🧑 Manager/Admin)):::actor -->|widzi| View3[📺 Pasek akcji akceptacji]:::view
  Actor -->|wykonuje| Cmd4[Zaakceptuj promocję]:::command
  Actor -->|wykonuje| Cmd5[Odrzuć promocję]:::command
  Cmd4 --> Agg1[(Promotion)]:::aggregate
  Cmd5 --> Agg1
  Agg1 --> E4a{{"Promocja zaakceptowana i aktywowana"}}:::event
  Agg1 --> E4b{{"Promocja odrzucona"}}:::event
  H2{{"Akceptacja od razu aktywuje promocję, activatedAt nieustawiane"}}:::hotspot
  E4a -.-> H2
```

- **Widok (view):** `ApprovalActionBar` na stronie szczegółów promocji — widoczny gdy status to `pending_approval`. Widoczny/aktywny tylko dla ról `admin` lub `manager`.
- **Agregat(y):** `Promotion` (pola `status`, `approvedBy`, `activatedAt`).
- **Komenda(y):** "Zaakceptuj" (`approvePromotion`), "Odrzuć" (`rejectPromotion`).
- **Reguły / polityki:** Rola musi być `admin` lub `manager`, inaczej widok informuje "Twoja rola nie pozwala na akceptację" i akcje są niedostępne.
- **Zmiany stanu:** Akceptacja → `status: active`, `approvedBy` ustawiony, `activatedAt` jawnie ustawiany na `undefined`. Odrzucenie → `status: draft` (powrót do szkicu, bez zapisania powodu w modelu poza toastem).
- **Zdarzenie(a) domenowe:** `Promocja zaakceptowana i aktywowana`, `Promocja odrzucona`.

### Step 4: Archiwizacja promocji

```mermaid
flowchart LR
  classDef actor fill:#5eead4,stroke:#0f766e,color:#000
  classDef command fill:#93c5fd,stroke:#1d4ed8,color:#000
  classDef aggregate fill:#fef08a,stroke:#b45309,color:#000
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef view fill:#86efac,stroke:#15803d,color:#000

  Actor((🧑 Manager)):::actor -->|widzi| View4[📺 Karta Aktywacja / publikacja]:::view
  Actor -->|wykonuje| Cmd6[Zarchiwizuj promocję]:::command
  Cmd6 --> Agg1[(Promotion)]:::aggregate
  Agg1 --> E5{{"Promocja zarchiwizowana"}}:::event
```

- **Widok (view):** Karta "Aktywacja / publikacja" na stronie szczegółów promocji, widoczna gdy status to `active`; zawiera jedynie przycisk "Zarchiwizuj".
- **Agregat(y):** `Promotion` (`status`).
- **Komenda(y):** "Zarchiwizuj" (`archivePromotion`).
- **Reguły / polityki:** Brak dodatkowych reguł widocznych w kodzie (brak potwierdzenia, brak roli-gate).
- **Zmiany stanu:** `status` → `archived`.
- **Zdarzenie(a) domenowe:** `Promocja zarchiwizowana`.

## Open Questions / Hotspots / Inconsistencies

<!-- Lista otwartych pytań, hotspotów i niespójności napotkanych podczas warsztatu.
     Każdy wpis odnosi się do kroku, w którym się pojawił. -->

- [ ] Kreator (`canCreate`) nie wymaga wybrania reguły cenowej, a walidacja w Step 2 zgłasza jej brak jako błąd — niespójność między warunkiem utworzenia a warunkiem przejścia walidacji. — krok: Step 1
- [ ] Po nieudanej walidacji promocja wraca do statusu `draft`, ale w UI brak jest jawnej ścieżki powrotu do kreatora (`PromotionWizardPage`), by uzupełnić brakujące produkty/reguły — jedyna dostępna akcja to ponowne "Uruchom walidację" na tych samych (niezmienionych) danych. — krok: Step 2
- [ ] `approvePromotion` łączy akceptację z natychmiastową aktywacją (`status: active`) i jawnie ustawia `activatedAt: undefined`. Osobne funkcje `activatePromotion`/`deactivatePromotion` w `api/promotions.ts` faktycznie zapisują `activatedAt`, ale nie są wywoływane z żadnego UI — sugeruje to niedokończony lub porzucony, odrębny krok "aktywacji" po akceptacji. — krok: Step 3
- [ ] Żadna z komend (utworzenie, walidacja, akceptacja, odrzucenie, archiwizacja) nie wywołuje `addAuditLogEntry` — sekcja "Dziennik zdarzeń" na stronie szczegółów promocji czyta wyłącznie statyczne dane mockowe (`auditLog.json`) i nigdy nie jest aktualizowana w wyniku akcji w tym procesie. — krok: Step 1-4
- [ ] Ograniczenie roli (`admin`/`manager`) egzekwowane jest tylko przy akceptacji/odrzuceniu (`ApprovalActionBar`); tworzenie promocji, uruchamianie walidacji i archiwizacja nie mają analogicznego sprawdzenia roli w UI — niespójne pokrycie autoryzacji w procesie. — krok: Step 1, Step 2, Step 4
- [ ] Funkcja `selectProductsForPromotion` w `api/promotions.ts` istnieje, ale nie jest wywoływana z żadnego UI — nieużywany kod, potencjalnie ślad po innej wersji przepływu (edycja produktów po utworzeniu promocji?). — krok: Step 1
