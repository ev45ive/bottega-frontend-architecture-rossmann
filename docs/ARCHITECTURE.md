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

| Krok procesu           | Domena                     | Zespół        | Pakiet |
| ---------------------- | -------------------------- | ------------- | ------ |
| Wybór produktów        | Catalog                    | Catalog Team  | _TBD_  |
| Reguły i ceny          | Pricing & Promotions       | Pricing Team  | _TBD_  |
| Walidacja → akceptacja | Pricing & Promotions       | Pricing Team  | _TBD_  |
| Aktywacja/publikacja   | Pricing & Promotions       | Pricing Team  | _TBD_  |
| Raportowanie           | Platform / Shared Services | Platform Team | _TBD_  |

> Pełny podział na bounded context (14) i domeny (4) z uzasadnieniem: [docs/context-map/context-map.md](./context-map/context-map.md).

# Decyzje Architektoniczne (ADR)

- [Index decyzji architektonicznych](./docs/adr/index.md)
