# Event Storming: Zwrot towaru przez klienta (przykład ilustracyjny)

> Przykład generyczny — nie odzwierciedla rzeczywistego procesu w projekcie. Służy jako wzór formatu.

## Kontekst

- **Rola / aktor:** Klient (przez konsultanta obsługi w portalu)
- **Cel końcowy (end goal):** Klient odzyskuje zwrot pieniędzy za wadliwy produkt, a stan magazynowy jest poprawiony
- **Status:** in-progress
- **Data:** 2026-09-01

## Big Picture

```mermaid
flowchart LR
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef hotspot fill:#ef4444,stroke:#7f1d1d,color:#fff

  E1{{"Return Requested"}}:::event --> E2{{"Return Approved"}}:::event --> E3{{"Refund Issued"}}:::event
  E2 -.-> H1((⚠ kto akceptuje zwroty > 500 zł?)):::hotspot
```

## Kroki

### Step 1: Return Requested

```mermaid
flowchart LR
  classDef actor fill:#5eead4,stroke:#0f766e,color:#000
  classDef command fill:#93c5fd,stroke:#1d4ed8,color:#000
  classDef aggregate fill:#fef08a,stroke:#b45309,color:#000
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef view fill:#86efac,stroke:#15803d,color:#000

  Actor((🧑 Konsultant)):::actor -->|widzi| View1[📺 Szczegóły zamówienia]:::view
  Actor -->|wykonuje| Cmd1[Zgłoś zwrot]:::command
  Cmd1 --> Agg1[(Return)]:::aggregate
  Agg1 --> E1{{"Return Requested"}}:::event
```

- **Widok (view):** Szczegóły zamówienia z listą pozycji kwalifikujących się do zwrotu.
- **Agregat(y):** `Return` (nowy, powiązany z `Order`).
- **Komenda(y):** `Zgłoś zwrot` (RequestReturn).
- **Reguły / polityki:** brak na tym etapie.
- **Zmiany stanu:** utworzony nowy agregat `Return` w statusie `Requested`.
- **Zdarzenie(a) domenowe:** `Return Requested`.

### Step 2: Return Approved

```mermaid
flowchart LR
  classDef actor fill:#5eead4,stroke:#0f766e,color:#000
  classDef command fill:#93c5fd,stroke:#1d4ed8,color:#000
  classDef aggregate fill:#fef08a,stroke:#b45309,color:#000
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef policy fill:#d8b4fe,stroke:#6b21a8,color:#000
  classDef hotspot fill:#ef4444,stroke:#7f1d1d,color:#fff

  E1{{"Return Requested"}}:::event --> Pol1[/whenever Return Requested then notify approver/]:::policy
  Pol1 --> Cmd2[Zatwierdź zwrot]:::command
  Cmd2 --> Agg2[(Return)]:::aggregate
  Agg2 --> E2{{"Return Approved"}}:::event
  Cmd2 -.-> H1((⚠ próg kwotowy do eskalacji?)):::hotspot
```

- **Widok (view):** Kolejka zwrotów oczekujących na zatwierdzenie.
- **Agregat(y):** `Return`.
- **Komenda(y):** `Zatwierdź zwrot` (ApproveReturn).
- **Reguły / polityki:** whenever `Return Requested` then powiadom osobę zatwierdzającą.
- **Zmiany stanu:** `Return` przechodzi w status `Approved`.
- **Zdarzenie(a) domenowe:** `Return Approved`.

### Step 3: Refund Issued

```mermaid
flowchart LR
  classDef command fill:#93c5fd,stroke:#1d4ed8,color:#000
  classDef aggregate fill:#fef08a,stroke:#b45309,color:#000
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef policy fill:#d8b4fe,stroke:#6b21a8,color:#000
  classDef external fill:#f9a8d4,stroke:#9d174d,color:#000

  E2{{"Return Approved"}}:::event --> Pol2[/whenever Return Approved then issue refund/]:::policy
  Pol2 --> Cmd3[Wystaw zwrot płatności]:::command
  Cmd3 --> Ext{{Payment Gateway}}:::external
  Cmd3 --> Agg3[(Return)]:::aggregate
  Agg3 --> E3{{"Refund Issued"}}:::event
```

- **Widok (view):** Historia płatności zamówienia (potwierdzenie zwrotu środków).
- **Agregat(y):** `Return`.
- **Komenda(y):** `Wystaw zwrot płatności` (IssueRefund), wywołanie zewnętrznego `Payment Gateway`.
- **Reguły / polityki:** whenever `Return Approved` then wystaw zwrot automatycznie.
- **Zmiany stanu:** `Return` przechodzi w status `Refunded`.
- **Zdarzenie(a) domenowe:** `Refund Issued`.

## Open Questions / Hotspots / Inconsistencies

- [ ] Kto zatwierdza zwroty powyżej 500 zł — konsultant czy manager? — krok: Step 2
- [ ] Czy `Refund Issued` powinno też aktualizować stan magazynowy, czy to osobny proces (`Restock`)? — krok: Step 3
