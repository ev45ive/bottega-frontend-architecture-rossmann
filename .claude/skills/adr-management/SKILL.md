---
name: adr-management
description: 'Create, update, review, summarize, and search Architecture Decision Records (ADR). Use when asked to write a new ADR, update an existing ADR, list/search/summarize ADRs, or check consistency between docs/adr/index.md and the ADR files. Trigger phrases: nowy ADR, dodaj ADR, zaktualizuj ADR, przeglądaj ADR, podsumuj ADR, szukaj ADR, spójność indeksu ADR, architecture decision record.'
---

# ADR Management

Manages Architecture Decision Records under `docs/adr/` — creating, updating, reviewing/summarizing, searching, and keeping [index.md](../../../docs/adr/index.md) in sync with the actual ADR files.

## When to Use

- User wants a new ADR created for a decision.
- User wants an existing ADR updated (status transition, content revision).
- User wants ADRs listed, searched, or summarized.
- User wants to check/fix consistency between the index and the ADR files.

## Conventions

- Location: `docs/adr/`.
- Filenames: `NNNN-kebab-case-title.md` — zero-padded 4-digit sequential number, ASCII only (no Polish diacritics, no spaces).
- Index: [index.md](../../../docs/adr/index.md), a single markdown table with columns `Nr | Tytuł | Status | Data`. Links must be real markdown links (`[text](./file.md)`) — never wrapped in backticks.
- Status values: `Proponowany`, `Zaakceptowany`, `Odrzucony`, `Zastąpiony przez ADR-NNNN`, `Wycofany`.
- Individual ADR sections (in order): `Status`, `Kontekst`, `Decyzja`, `Rozważane alternatywy`, `Konsekwencje`, `Powiązane`. See [adr-template.md](./assets/adr-template.md).
- One ADR = one decision. ADRs are immutable once `Zaakceptowany` — a changed decision becomes a new ADR that supersedes the old one, not an edit of the old one.
- Level of detail & style:
  - Write at architecture/business level, not implementation level — no file names, function/variable
    names, or specific library/framework mechanics (e.g. Redux slices) in `Kontekst`, `Decyzja`, or
    `Konsekwencje`. That detail belongs in a separate migration/handoff doc under `docs/migrations/`,
    linked from `Powiązane` if/when it exists — the migration doc can be created after the ADR, so
    don't require the link to exist upfront.
  - Domain/ubiquitous-language names (e.g. `Category`, `CategoryRef`) are fine; code-level identifiers
    are not.
  - If a decision establishes a pattern meant to apply to multiple future cases, state it in `Decyzja`
    as a standing policy, not just a one-off migration — name the first concrete application
    separately.
  - Alternatives belong only in `Rozważane alternatywy` — never re-introduce or reference them in
    `Decyzja` or `Konsekwencje`.
  - Be concise and scannable: no repetition across sections, ~3-5 bullets per section, short
    sentences, bold names for alternatives, `Konsekwencje` always split into Pozytywne / Negatywne.
  - Every claim in `Kontekst` should link to its source (Context Map, an ARCHITECTURE.md driver,
    another ADR) instead of re-explaining it.
- See [example-adr.md](./assets/example-adr.md) for a fully filled-in illustrative ADR (generic content, not a real project decision).

## Procedures

### Create a new ADR

1. Read [index.md](../../../docs/adr/index.md) to find the next free number (highest existing `Nr` + 1, zero-padded to 4 digits).
2. Ask the user (ask-questions tool) for the title and, if not already clear from the conversation, the driving context/problem — do not guess or invent decision content, per project rules in [CLAUDE.md](../../../CLAUDE.md).
3. Create `docs/adr/NNNN-<slug>.md` from [adr-template.md](./assets/adr-template.md), filling in known sections and leaving the rest as HTML-comment placeholders for the user to complete.
4. Add a row to the table in [index.md](../../../docs/adr/index.md) with status `Proponowany` and today's date.
5. Run [Format](#format-always-after-generatingediting-adr-content).

### Update an existing ADR

1. Locate the file (see [Search](#search-adrs)).
2. Confirm the change with the user if ambiguous (status transition vs. content edit).
3. If the status changes to `Zastąpiony przez ADR-NNNN`: add a `Zastępuje ADR-MMMM` line to the new ADR's `Powiązane` section, and update both rows in the index.
4. Run [Format](#format-always-after-generatingediting-adr-content).

### Review / summarize ADRs

- Single ADR: read the file, summarize `Kontekst` / `Decyzja` / `Konsekwencje` in 3-6 bullets — do not add claims not present in the file.
- All ADRs: read [index.md](../../../docs/adr/index.md), then each linked file; group the summary output by `Status`.

### Search ADRs

- Use grep_search over `docs/adr/**` for keywords, driver IDs (e.g. `D1`, from [ARCHITECTURE.md](../../../docs/ARCHITECTURE.md)), or decision topics.

### Check/fix consistency between index and documents

Verify each item below, report every mismatch found, and only apply fixes after confirming with the user when the fix is destructive (e.g. removing a row/file):

1. Every row in [index.md](../../../docs/adr/index.md) links to a file that exists at that relative path, via a real markdown link.
2. Every `NNNN-*.md` file under `docs/adr/` (excluding `index.md`) has a matching row in the index.
3. The `Status` column in the index matches the `## Status` section inside the corresponding ADR file.
4. Numbering has no gaps or duplicates; each filename's leading number matches its `Nr` column.
5. The `Tytuł` column reflects the ADR file's `# NNNN. <Title>` heading.

### Format (always after generating/editing ADR content)

After creating or modifying any ADR file or the index, run Prettier on exactly the changed file(s):

```
npx prettier --write docs/adr/index.md docs/adr/<changed-file>.md
```

The root `package.json` already has `prettier` as a devDependency, so `npx prettier` uses the local install without a download prompt.
