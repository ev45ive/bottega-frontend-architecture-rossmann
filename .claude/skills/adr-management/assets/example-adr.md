<!-- Przykład ilustracyjny — treść fikcyjna, wyłącznie do celów formatu/stylu. -->

# 0099. Przykład: wybór biblioteki do cache'owania zapytań API

## Status

Zaakceptowany

## Kontekst

Każdy zespół domenowy implementował własny sposób cache'owania i odświeżania danych z API (ręczne `useEffect` + `useState`), co prowadziło do niespójnych zachowań (duplikaty zapytań, brak invalidacji po mutacjach) i utrudniało code review między zespołami (driver: autonomia zespołów przy współdzielonym standardzie jakości).

## Decyzja

Przyjmujemy jedną bibliotekę do zarządzania stanem serwera (cache, refetch, invalidacja) jako standard dla wszystkich nowych modułów. Istniejący kod migrowany jest przyrostowo, moduł po module, bez blokowania bieżącego rozwoju.

## Rozważane alternatywy

- **Własne hooki nad `fetch`** — odrzucone: brak wbudowanej invalidacji i deduplikacji, każdy zespół rozwiązywałby to inaczej.
- **Globalny store (Redux) z ręcznym cache'owaniem** — odrzucone: duży narzut boilerplate dla prostego cache'u danych serwerowych.
- **Wybrana biblioteka do zarządzania stanem serwera** — przyjęte: mały narzut wdrożenia, wbudowana invalidacja po mutacjach, dobre wsparcie dla częściowych awarii (osobny stan błędu per zapytanie).

## Konsekwencje

- (+) Spójny wzorzec pobierania/cache'owania danych między zespołami, łatwiejszy code review.
- (+) Częściowa awaria jednego zapytania nie blokuje reszty ekranu (izolowany stan błędu per query).
- (–) Kolejna zależność w `package.json`, którą trzeba utrzymywać i aktualizować.
- (–) Koszt migracji istniejących ekranów korzystających z ręcznego `useEffect`.

## Powiązane

- Driver: autonomia zespołów (por. D2 w [ARCHITECTURE.md](../../../../docs/ARCHITECTURE.md)).
- Driver: resilience przy częściowej awarii (por. D3 w [ARCHITECTURE.md](../../../../docs/ARCHITECTURE.md)).
