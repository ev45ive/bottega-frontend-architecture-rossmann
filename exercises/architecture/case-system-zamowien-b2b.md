# Case: system zamówień B2B

Założenia:

- backoffice B2B, 500 firm-klientów,
- 20 000 zamówień dziennie,
- integracja z ERP,
- częste zmiany cenników,
- część klientów wymaga indywidualnych reguł,
- zespół: 12 developerów, wdrożenia kilka razy w tygodniu.

**Pytanie:** Jakie informacje są jeszcze potrzebne, zanim zaczniemy projektować architekturę?


## Z perspektywy interesariuszy

### 1. Biznes / właściciel produktu

**Wymaganie**
- backoffice B2B dla 500 firm-klientów
- obsługa częstych zmian cenników i indywidualnych reguł dla części klientów

**Driver**
- usprawnić proces składania i obsługi zamówień
- ograniczyć ręczną pracę i liczbę błędów w ofercie

**Constraint**
- integracja z ERP
- częste wdrożenia przy małym zespole

**Assumption**
- obecny wolumen 20 000 zamówień dziennie będzie rósł podobnym tempem
- większość procesów biznesowych da się ujednolicić mimo wyjątków dla części klientów

**Risk**
- zbyt dużo wyjątków biznesowych może doprowadzić do skomplikowanej i trudnej w utrzymaniu architektury
- zmiany cenników mogą powodować błędy w zamówieniach, jeśli nie będzie jasnej odpowiedzialności za dane

**O co warto zapytać**
- Jaki jest główny cel biznesowy: wzrost sprzedaży, skrócenie czasu obsługi czy redukcja kosztów?
- Jakie KPI mają potwierdzić, że system działa dobrze?

### 2. Użytkownik backoffice / dział obsługi

**Wymaganie**
- wygodna obsługa zamówień, wyszukiwanie klientów i produktów, weryfikacja statusów
- możliwość obsługi wyjątków i indywidualnych reguł

**Driver**
- mniej kliknięć i mniej pracy ręcznej
- szybsza obsługa zamówień i mniejsza liczba pomyłek

**Constraint**
- proces musi być zgodny z rolami i uprawnieniami użytkowników
- część decyzji może wymagać ręcznej akceptacji

**Assumption**
- użytkownicy będą pracować głównie w przeglądarce
- znają podstawowy proces obsługi zamówień i cenników

**Risk**
- zbyt skomplikowany interfejs może obniżyć adopcję systemu
- brak jasnych ścieżek wyjątków może blokować pracę operacyjną

**O co warto zapytać**
- Jak wygląda najczęstszy scenariusz pracy operatora krok po kroku?
- Które wyjątki trzeba obsługiwać ręcznie, a które powinny być automatyczne?

### 3. Integracja / ERP / partnerzy

**Wymaganie**
- integracja z ERP
- synchronizacja zamówień, cenników, statusów i ewentualnie danych klientów

**Driver**
- jedno źródło prawdy dla danych biznesowych
- ograniczenie ręcznych synchronizacji i rozjazdów danych

**Constraint**
- ograniczenia API ERP, limity, okna serwisowe, formaty danych
- możliwa zależność od dostępności systemu zewnętrznego

**Assumption**
- ERP ma stabilne API i zdefiniowane zasady wymiany danych
- opóźnienia integracji są akceptowalne dla części procesów

**Risk**
- zmiana API lub awaria ERP może zatrzymać proces zamówień
- niejednoznaczny podział odpowiedzialności za dane może prowadzić do konfliktów i błędów

**O co warto zapytać**
- Który system jest źródłem prawdy dla cen, zamówień i kartoteki klienta?
- Czy integracja ma być synchroniczna, czy wystarczy model wsadowy?

### 4. Security / compliance / IT

**Wymaganie**
- bezpieczne uwierzytelnianie i autoryzacja
- ochrona danych handlowych i osobowych
- możliwość audytu działań użytkowników

**Driver**
- ograniczyć ryzyko incydentów i spełnić wymagania prawne
- zapewnić zgodność z politykami firmy i partnerów

**Constraint**
- wymagania bezpieczeństwa, polityki IT, SSO, zasady przechowywania danych
- możliwe ograniczenia dotyczące hostingu, logowania i dostępu do środowisk

**Assumption**
- model ról i uprawnień jest znany lub da się go szybko ustalić
- wymagania prawne i audytowe są jasno zdefiniowane

**Risk**
- wyciek danych lub nieuprawniony dostęp
- brak zgodności z politykami IT albo regulacjami

**O co warto zapytać**
- Jakie wymagania prawne i bezpieczeństwa są obowiązkowe?
- Jakie dane można logować, przechowywać i przez jaki czas?

### 5. Zespół delivery / utrzymanie

**Wymaganie**
- system łatwy do rozwijania przez 12-osobowy zespół
- możliwość częstych wdrożeń kilka razy w tygodniu

**Driver**
- szybkie dostarczanie zmian biznesowych
- utrzymanie wysokiej jakości mimo częstych release’ów

**Constraint**
- ograniczona pojemność zespołu
- konieczność posiadania testów, monitoringu i procesu release

**Assumption**
- zespół będzie utrzymywał cały system end-to-end
- CI/CD i środowiska testowe są dostępne na tyle stabilnie, żeby wspierać częste wdrożenia

**Risk**
- architektura może stać się zbyt ciężka jak na wielkość zespołu
- brak automatyzacji może spowolnić wdrożenia i zwiększyć liczbę błędów

**O co warto zapytać**
- Jak wygląda obecny proces wdrożeń, testów i rollbacku?
- Kto będzie odpowiedzialny za utrzymanie i monitorowanie produkcji?

## Pytania przekrojowe, które warto zadać na start

- Co jest najważniejsze: szybkość dostarczania zmian, niezawodność, koszt utrzymania czy elastyczność reguł?
- Jakie są wymagania niefunkcjonalne: wydajność, dostępność, bezpieczeństwo, audyt, skalowalność?
- Które dane są krytyczne i skąd pochodzą: ERP, backoffice, a może inne systemy?
- Jakie są granice odpowiedzialności między zespołem, biznesem i dostawcą ERP?
- Co może się zmieniać często, a co musi pozostać stabilne?
