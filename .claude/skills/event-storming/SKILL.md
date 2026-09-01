---
name: event-storming
description: 'Run an interactive Event Storming workshop and maintain its output as a living map of mermaid diagrams under docs/event-storming/. Use when asked to do event storming, map domain events, model a business process (actors, commands, aggregates, policies, views, domain events), or update/continue an existing event storming map. Trigger phrases: event storming, mapa zdarzeń domenowych, warsztat event storming, domain events mapping, big picture, zamodeluj proces biznesowy.'
---

# Event Storming

Runs an interactive Event Storming workshop with the user and persists the result as a living markdown document with mermaid diagrams under `docs/event-storming/`. One document = one business process/flow.

## When to Use

- User wants to event-storm / map a business process, feature, or flow.
- User wants to continue, update, or review an existing event storming map.
- User is defining domain events, aggregates, commands, policies, or read models for a process.

## Notation (Event Storming color legend)

Reuse this `classDef` block in every mermaid diagram in a map (see [legend.md](./assets/legend.md) for the full reference and node-shape conventions):

| Concept | Color | Meaning |
|---|---|---|
| Actor / Role | teal (circle) | Who triggers a command |
| Command | blue | An intent / action a user or system requests |
| Aggregate | mustard | Entity/cluster enforcing invariants, handles commands |
| Domain Event | orange | "X happened" — fact, past tense |
| Policy | lilac | Reactive rule: "whenever `<event>` then `<command>`" |
| Read Model / View | green | What the user sees on screen, derived from events |
| External System | pink | Third-party / other bounded context |
| Hotspot | red | Open question, conflict, or inconsistency |

## Conventions

- Location: `docs/event-storming/`.
- Filename: `<kebab-case-process-name>.md` (ASCII only, no diacritics — matches ADR filename convention).
- One file per business process/flow. A file contains: context header, one **Big Picture** overview diagram, one small mermaid diagram per step, and a trailing **Open Questions / Hotspots / Inconsistencies** list.
- Overview diagram nodes and per-step diagram event nodes share the same IDs (`E1`, `E2`, ...) so the big picture and the zoomed-in steps stay traceable to each other.
- Use [map-template.md](./assets/map-template.md) as the skeleton for a new map and [example-map.md](./assets/example-map.md) as an illustrative filled-in example (generic content, not a real project process).
- Never invent actors, rules, or events the user hasn't stated — per [CLAUDE.md](../../../CLAUDE.md), ask instead of guessing. Every step's questions must actually be asked with the ask-questions tool, not assumed.

## Procedure

### 1. Load or create the map

1. Ask the user (ask-questions tool) which process/flow to storm, unless already stated.
2. `grep_search`/`file_search` over `docs/event-storming/**` for a matching filename or heading.
   - **Found:** read the full file, summarize its current state back to the user (steps so far, last event reached, open hotspots) before continuing.
   - **Not found:** create `docs/event-storming/<slug>.md` from [map-template.md](./assets/map-template.md).

### 2. Capture context (new maps only, or if missing)

Ask the user for:
- **Role / actor** — who initiates this process.
- **End goal** — what business outcome the process should achieve.

Fill these into the map's `## Kontekst` section.

### 3. Iterate step by step

Repeat for each step until the user says to stop. For every step, ask each question below explicitly (ask-questions tool, one question at a time or grouped — do not assume answers):

1. **View** — what does the user need to see at this point (read model)?
2. **Aggregate(s)** — what data/entity is involved?
3. **Command(s)** — what action(s) can the user (or system) take?
4. **Policy / rules** — any automatic reaction ("whenever `<event>` then `<command>`") or business rule that constrains this step?
5. **State changes** — which aggregate(s)/view(s) get created or updated as a result?
6. **Domain event(s)** — what fact gets published once the command succeeds?

Then:

1. Add/update a `### Step N: <event name>` section with a small mermaid flowchart wiring Actor → View, Actor → Command → Aggregate → Event → Policy → next Command (only include the elements that actually apply to this step).
2. Add a bullet list under the diagram restating the answers to the 6 questions in prose.
3. Update the **Big Picture** overview diagram: append the new event node (`E<N>`) connected to the previous one.
4. If anything surfaced is ambiguous, contradicts an earlier step, has no clear owner, or the user is unsure — add a red `hotspot` node in the step diagram AND a bullet under **Open Questions / Hotspots / Inconsistencies** (reference the step).
5. Ask the user whether to continue to the next step or stop.

### 4. Stop and finalize

When the user stops:

1. Do a consistency pass: every event in the Big Picture has a matching `### Step` section; every command in a step diagram connects to an aggregate; every policy references the event that triggers it and the command it invokes.
2. Report any newly found inconsistencies by adding them to the Open Questions list (do not silently fix content decisions — only fix structural/diagram wiring).
3. Format the file:

```
npx prettier --write docs/event-storming/<changed-file>.md
```
