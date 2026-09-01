---
name: frontend-architecture-analysis
description: 'Analyze and document frontend project architecture. Use when asked to analyze, audit, or report on frontend architecture, produce or update an architecture report, or do a deep-dive on a specific feature/module/domain. Trigger phrases: analiza architektury, raport architektury, audyt frontendu, aktualizacja analizy, architecture review, architecture audit, architecture report.'
---

# Frontend Architecture Analysis

Produces a structured architecture report for a frontend project (or a scoped part of it), following a fixed checklist and template so reports stay comparable over time.

## When to Use

- User asks to analyze/audit/review frontend architecture.
- User asks to create or update an architecture report.
- User asks for a deep-dive analysis of one feature/module/domain.

## Process

### Step 1 — Determine analysis mode (ask the user)

Before exploring the codebase, ask the user (via the ask-questions tool) which mode applies:

- **Pełna/wstępna analiza całego projektu** — no existing report, or a from-scratch full review.
- **Aktualizacja istniejącej analizy** — a report already exists and needs to be refreshed against current code.
- **Szczegółowa analiza wybranego modułu/funkcji/domeny** — scoped deep-dive; if chosen, also ask *which* module/feature/domain (freeform answer).

Do not guess the mode — always confirm it first, per project rules in [CLAUDE.md](../../../CLAUDE.md) (no assumptions without confirmation).

### Step 2 — Resolve report metadata (author + model)

- **Autor:** run `git config user.name` and `git config user.email`. If both resolve, use `Name <email>` as the author. If either is missing/empty, ask the user for their name (via ask-questions tool) instead of guessing.
- **Model AI:** record the exact model identifier currently in use for this session (as stated in your own system context) — never a generic placeholder like "AI" or "Copilot".

### Step 3 — Gather context (depends on mode)

- **Full analysis**: read `package.json` (stack/deps), top-level `src/` structure, [routes.tsx](../../../retail-operations-portal/src/routes.tsx), and check for `docs/ARCHITECTURE.md` as the canonical source of prior decisions.
- **Update**: locate the existing report file(s) first (ask the user for the path if not obvious), then diff its claims against current code — only re-verify sections likely to have changed.
- **Module/domain deep-dive**: scope reading to files tied to that domain only (matching page in `src/pages/`, matching API client in `src/api/`, related components, mock data, store slice). Do not read unrelated modules.

### Step 4 — Walk the checklist

Go section by section using the checklist below. For each section, note concrete evidence (file paths, line refs) — do not state conclusions you can't point to in code.

1. **Kontekst i cel** — scope of this report, what triggered it, analysis mode used.
2. **Stack technologiczny** — framework, bundler, language, major deps (routing, state, UI kit, forms/validation) — from `package.json`.
3. **Struktura katalogów i konwencje** — folder organization (feature vs layer based), naming conventions, module boundaries.
4. **Warstwa danych/API** — API client pattern (`src/api/*`), mocking strategy (`src/mock-data/*`), caching/fetching approach.
5. **Zarządzanie stanem** — global store (`src/store/`), local component state, data flow patterns.
6. **Routing i nawigacja** — route structure (`routes.tsx`), lazy loading, guards/authorization.
7. **Komponenty i UI** — presentational vs. container split, design system usage (`src/components/ui/`), reuse.
8. **Typowanie i jakość kodu** — TypeScript usage/strictness, linter/formatter config, type conventions.
9. **Testowanie** — unit/integration/e2e coverage, tooling.
10. **Wydajność** — bundle size, code splitting, lazy loading, obvious bottlenecks.
11. **Bezpieczeństwo** — auth/authorization handling, input validation, XSS/CSRF exposure.
12. **Skalowalność i utrzymywalność** — ease of extending, technical debt, risk areas.
13. **Rekomendacje** — concrete, prioritized (krytyczne/ważne/opcjonalne).

Sections not applicable to the current scope/mode are still listed in the output — mark their body with `--- POMINIĘTO ---` instead of removing the heading (see template).

### Step 5 — Fill the report template

Use [report template](./assets/report-template.md) as the exact skeleton. Every one of the 13 sections (+ metadata header) must appear in the output, in order, either filled in or marked `--- POMINIĘTO ---`.

### Step 6 — Check tone/format against the example

Before finalizing, compare against [example report](./assets/example-report.md) — concise, evidence-based (file refs), no filler, opinions clearly marked as such.
