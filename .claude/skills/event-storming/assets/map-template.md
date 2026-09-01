# Event Storming: <Nazwa procesu>

## Kontekst

- **Rola / aktor:** <kto inicjuje proces>
- **Cel końcowy (end goal):** <jaki rezultat biznesowy proces ma osiągnąć>
- **Status:** in-progress
- **Data:** <YYYY-MM-DD>

## Big Picture

<!-- Diagram wysokopoziomowy: łańcuch zdarzeń domenowych (E1, E2, ...) w kolejności czasowej.
     Aktualizuj po każdym kroku - dodaj nowy węzeł zdarzenia i połącz go z poprzednim. -->

```mermaid
flowchart LR
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef hotspot fill:#ef4444,stroke:#7f1d1d,color:#fff

  E1{{"<Zdarzenie 1>"}}:::event
```

## Kroki

<!-- Jeden ### Step per zdarzenie/decyzja. Skopiuj blok poniżej dla każdego nowego kroku. -->

### Step 1: <nazwa kroku / zdarzenia>

```mermaid
flowchart LR
  classDef actor fill:#5eead4,stroke:#0f766e,color:#000
  classDef command fill:#93c5fd,stroke:#1d4ed8,color:#000
  classDef aggregate fill:#fef08a,stroke:#b45309,color:#000
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef policy fill:#d8b4fe,stroke:#6b21a8,color:#000
  classDef view fill:#86efac,stroke:#15803d,color:#000

  Actor((🧑 <Aktor>)):::actor -->|widzi| View1[📺 <Widok>]:::view
  Actor -->|wykonuje| Cmd1[<Komenda>]:::command
  Cmd1 --> Agg1[(<Agregat>)]:::aggregate
  Agg1 --> E1{{"<Zdarzenie 1>"}}:::event
```

- **Widok (view):** <co użytkownik widzi>
- **Agregat(y):** <jakie dane/encje>
- **Komenda(y):** <jakie akcje>
- **Reguły / polityki:** <whenever ... then ...>
- **Zmiany stanu:** <jakie agregaty/widoki są aktualizowane>
- **Zdarzenie(a) domenowe:** <co zostało opublikowane>

## Open Questions / Hotspots / Inconsistencies

<!-- Lista otwartych pytań, hotspotów i niespójności napotkanych podczas warsztatu.
     Każdy wpis odnosi się do kroku, w którym się pojawił. -->

- [ ] <pytanie/hotspot> — krok: Step 1
