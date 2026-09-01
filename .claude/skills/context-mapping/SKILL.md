---
name: context-mapping
description: 'Run an interactive DDD Context Mapping workshop and maintain its output as a living map under docs/context-map/. Use when asked to identify bounded contexts, build a context map, define a ubiquitous language glossary, define context boundaries/ownership, or map integrations/relationships between contexts (Partnership, Shared Kernel, Customer/Supplier, Conformist, ACL, OHS, Published Language, Separate Ways). Trigger phrases: mapa kontekstów, context mapping, bounded context, granice kontekstów, słownik dziedzinowy, ubiquitous language, integracje między kontekstami, core domain chart.'
---

# Context Mapping

Runs an interactive DDD Context Mapping workshop with the user and persists the result as a single living markdown document under `docs/context-map/`. One document = one system/product's full context map (unlike Event Storming, which is one file per business process).

## When to Use

- User wants to identify bounded contexts / draw a context map for the system.
- User wants a ubiquitous language glossary per context.
- User wants to define context boundaries, ownership, or data ownership.
- User wants to map relationships/integrations between contexts using DDD patterns.
- User wants to continue, update, or review an existing context map.

## Relationship to other artifacts

Context Mapping sits between Event Storming and ADRs/ARCHITECTURE.md — reuse, don't duplicate:

- **Input from Event Storming** (`docs/event-storming/*.md`): aggregates, commands, and actors are the raw material for candidate bounded contexts. Read existing maps before inventing candidates.
- **Input from [ARCHITECTURE.md](../../../docs/ARCHITECTURE.md):** architectural drivers (D1, D2, ...) justify Core/Supporting/Generic classification; the existing **Ownership map** table may already contain team/domain hints.
- **Output to ARCHITECTURE.md:** once contexts are confirmed, offer to fill in the `Ownership map` table (currently `_TBD_` placeholders) — only after explicit user confirmation, never silently.
- **Output to ADRs** (`docs/adr/`): a confirmed boundary or integration-pattern decision is a candidate ADR (e.g. `0000-podzial-na-moduly-domenowe.md`). Hand off to the adr-management skill/conventions rather than writing ADR prose here.

## Notation

Reuse [ddd-patterns-legend.md](./assets/ddd-patterns-legend.md) in every diagram — it has the `classDef` block, the Core/Supporting/Generic color legend, and the table of DDD relationship patterns (Partnership, Shared Kernel, Customer/Supplier, Conformist, Anticorruption Layer, Open Host Service, Published Language, Separate Ways, Big Ball of Mud).

## Conventions

- Location: `docs/context-map/`.
- Filename: `context-map.md` (single file; ASCII only). If the workspace genuinely has multiple independent systems/products, ask the user and use `<kebab-case-system-name>-context-map.md` instead — do not assume multi-system without confirmation.
- Sections in order: `Wejścia źródłowe`, `Bounded Contexts`, `Mapa kontekstów (diagram)`, `Słownik (Ubiquitous Language)`, `Granice i odpowiedzialności`, `Relacje i integracje`, `Core Domain Chart`, `Open Questions / Hotspots / Inconsistencies`.
- Use [context-map-template.md](./assets/context-map-template.md) as the skeleton for a new map and [example-context-map.md](./assets/example-context-map.md) as an illustrative filled-in example (generic content, not a real project).
- Never invent context boundaries, ownership, glossary definitions, or relationship patterns the user hasn't confirmed — per [CLAUDE.md](../../../CLAUDE.md), ask instead of guessing. Every phase's questions must actually be asked with the ask-questions tool, not assumed. AI may *propose* candidates derived from event storming/code, but the user (someone with domain authority) must confirm before it's written as fact.

## Procedure

### 1. Load or create the map

1. `grep_search`/`file_search` over `docs/context-map/**` for an existing file.
   - **Found:** read the full file, summarize its current state back to the user (contexts identified so far, open hotspots) before continuing.
   - **Not found:** ask the user (ask-questions tool) for the system/product name if the workspace could plausibly have more than one; otherwise create `docs/context-map/context-map.md` from [context-map-template.md](./assets/context-map-template.md).

### 2. Gather inputs (before inventing candidates)

1. `grep_search`/`file_search` over `docs/event-storming/**` and read any existing maps — extract aggregates, commands, and actors as candidate context seeds.
2. Read [ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) for drivers and the existing Ownership map.
3. Present the candidate list (grounded in what was actually found) to the user and confirm/correct it via ask-questions — do not silently commit unconfirmed candidates to the table.

### 3. Identify Bounded Contexts

For each candidate context, ask (ask-questions tool):
1. **Responsibility** — one-sentence purpose.
2. **Owner** — team/person responsible.
3. **Boundary test** — is there a term that means something different here than in a neighboring context? (a "yes" is a strong signal the boundary is real; a "no" may mean two candidates should merge)

Update the `Bounded Contexts` table and the `Mapa kontekstów` diagram (add a node per confirmed context, no edges yet).

### 4. Build the Glossary (Ubiquitous Language)

For each confirmed context, ask the user for 2-5 key domain terms and their definitions **as used in that context specifically**. Cross-check against other contexts' glossary entries for the same word — if found, add a note under "Uwagi" describing the homonym/synonym. Update the `Słownik` table.

### 5. Define boundaries and ownership

For each context, ask:
1. **W zakresie** — what it does.
2. **Poza zakresem** — what it explicitly does NOT do (common confusion points first).
3. **Dane własne** — which aggregates/data it owns.

Add/update the context's subsection under `Granice i odpowiedzialności`. If scope is disputed or unclear, add a hotspot instead of guessing a resolution.

### 6. Map relationships between contexts

For each pair of contexts that actually communicate (confirm the pair exists — don't assume all contexts talk to each other), ask:
1. Who depends on whom (which side would break if the other changed its model)?
2. Present the relevant DDD patterns from [ddd-patterns-legend.md](./assets/ddd-patterns-legend.md) as options and ask the user to pick (or confirm your proposal) rather than asserting one.

Add an edge to the `Mapa kontekstów` diagram with the pattern label, and a row to `Relacje i integracje` (mechanism/contract columns filled in step 7).

### 7. Document integration mechanisms

For each relationship row, ask:
1. **Mechanizm** — sync REST/GraphQL, async event, shared state/store, Module Federation remote, in-process import, props/callbacks (frontend-specific options).
2. **Kontrakt / format** — schema name/location, who versions it.
3. **Zachowanie przy awarii** — degradation behavior, tie back to resilience drivers (e.g. D3 in this project) if relevant.

### 8. Classify Core / Supporting / Generic (Core Domain Chart)

For each context, ask the user to classify it as Core (competitive advantage, invest most), Supporting (necessary, not differentiating), or Generic (solved problem, buy/reuse candidate), with a one-line rationale tied to a driver if possible. Update `Core Domain Chart` and the node's `classDef` in the diagram.

### 9. Hotspots

Throughout steps 3-8, whenever something is ambiguous, disputed, has no clear owner, or the user is unsure, add a bullet to `Open Questions / Hotspots / Inconsistencies` referencing the context/relationship. Also carry over any unresolved Event Storming hotspots that turned out to be boundary-related.

### 10. Finalize and sync

When the user stops or a full pass is done:

1. Do a consistency pass: every context in the diagram has a matching row in `Bounded Contexts` and a `Granice i odpowiedzialności` subsection; every diagram edge has a matching row in `Relacje i integracje`.
2. Ask the user whether to sync confirmed contexts into the [ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) `Ownership map` table (replacing `_TBD_` placeholders). Only edit ARCHITECTURE.md after explicit confirmation.
3. Ask the user whether any confirmed boundary/relationship decision should become (or update) an ADR under `docs/adr/` — if yes, follow the adr-management skill's conventions rather than writing ADR content here.
4. Format the changed file(s):

```
npx prettier --write docs/context-map/<changed-file>.md
```
