# Przypisz stwierdzenie do rodzaju.

AI: "Podziel - dopisz pytania które warto zadać bizesowi"

## Wymaganie

- „System ma pozwalać na filtrowanie transakcji po statusie”
	- Jakie statusy mają być dostępne do filtrowania?
	- Czy filtrowanie ma działać też łącznie z innymi filtrami?

- „Użytkownik może zresetować hasło przez e-mail”
	- Jak ma wyglądać proces resetu i ważność linku?
	- Czy wymagane są dodatkowe zabezpieczenia, np. captcha lub OTP?

- „Raport dzienny musi być gotowy do 8:00”
	- Kiedy raport zaczyna się generować i jak duże mogą być opóźnienia?
	- Co powinno się stać, jeśli dane nie są gotowe na czas?

- „Operator może eksportować dane do CSV”
	- Jakie dane mają trafić do eksportu i w jakim formacie kolumn?
	- Czy eksport ma mieć limity liczby rekordów lub uprawnienia?

## Driver

- „Chcemy skrócić czas obsługi zgłoszenia o 30%”
	- Jaki jest punkt startowy i jak mierzymy czas obsługi?
	- W jakim horyzoncie czasowym chcemy osiągnąć ten wynik?

- „Zależy nam na szybszym uruchamianiu nowych partnerów”
	- Co dokładnie oznacza „szybciej” i jakie są obecne czasy wdrożenia?
	- Które etapy uruchomienia dziś najbardziej spowalniają proces?

- „Celem jest ograniczenie kosztów wsparcia”
	- Które koszty wsparcia są największe i jak je dziś liczymy?
	- Czy celem jest redukcja jednorazowa czy stałe obniżenie kosztów?

- „Musimy zwiększyć liczbę samodzielnych operacji użytkownika”
	- Jakie operacje mają być wykonywane samodzielnie przez użytkownika?
	- Jak zmierzymy wzrost samoobsługi?

## Constraint

- „Dane osobowe muszą być przetwarzane wyłącznie w UE”
	- Czy są dopuszczalne wyjątki dla kopii zapasowych lub narzędzi zewnętrznych?
	- Czy dotyczy to także środowisk testowych i logów?

- „Integracja musi działać z istniejącym systemem SSO”
	- Jakie protokoły i wersje obsługuje obecny SSO?
	- Czy możemy zmienić coś po stronie SSO, czy tylko po naszej stronie?

- „Nie możemy używać technologii niewspieranych przez dział IT”
	- Jaka jest aktualna lista technologii wspieranych przez IT?
	- Czy istnieje proces akceptacji dla nowych technologii?

- „System musi działać w przeglądarkach wspieranych przez firmę”
	- Które przeglądarki i wersje są formalnie wspierane?
	- Czy wymagane jest pełne wsparcie funkcjonalne, czy tylko podstawowe?

## Assumption

- „większość użytkowników korzysta z telefonu”
	- Skąd pochodzi ta informacja i jak świeże są dane?
	- Czy to dotyczy wszystkich użytkowników, czy tylko wybranego segmentu?

- „partner udostępni stabilne środowisko testowe”
	- Czy mamy potwierdzenie terminu i zakresu tego środowiska?
	- Kto odpowiada za utrzymanie i dostępność środowiska?

## Risk

- „Partner może zmieniać API bez wcześniejszego ostrzeżenia”
	- Jak często zdarzały się takie zmiany i czy są planowane?
	- Czy mamy mechanizmy wersjonowania lub monitorowania zmian?

- „Szczytowe obciążenie może przekroczyć nasze założenia”
	- Jakie są prognozy ruchu i kiedy spodziewamy się szczytu?
	- Czy system ma bufor wydajności lub skalowanie awaryjne?

- „Migracja danych może ujawnić błędy jakości danych”
	- Jakie typy błędów danych są najbardziej prawdopodobne?
	- Czy mamy plan czyszczenia i walidacji danych przed migracją?

- „Opóźnienie decyzji biznesowych może zablokować termin wdrożenia”
	- Jakie decyzje są krytyczne i do kiedy muszą zapaść?
	- Jaki jest plan awaryjny, jeśli decyzje się opóźnią?