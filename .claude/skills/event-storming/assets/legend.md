# Event Storming Notation

Standard Event Storming sticky-note colors, mapped to mermaid node shapes/classes. Paste the `classDef` block at the top of every diagram that uses these concepts; only declare the classes actually used in that diagram.

```mermaid
flowchart LR
  classDef actor fill:#5eead4,stroke:#0f766e,color:#000
  classDef command fill:#93c5fd,stroke:#1d4ed8,color:#000
  classDef aggregate fill:#fef08a,stroke:#b45309,color:#000
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef policy fill:#d8b4fe,stroke:#6b21a8,color:#000
  classDef view fill:#86efac,stroke:#15803d,color:#000
  classDef external fill:#f9a8d4,stroke:#9d174d,color:#000
  classDef hotspot fill:#ef4444,stroke:#7f1d1d,color:#fff

  Actor((🧑 Actor)):::actor
  Cmd[Command]:::command
  Agg[(Aggregate)]:::aggregate
  Evt{{Event happened}}:::event
  Pol[/Policy: whenever...then.../]:::policy
  View[📺 Read model / view]:::view
  Ext{{External system}}:::external
  Hot((⚠ Hotspot)):::hotspot
```

## Node shape conventions

| Concept | Shape | Example |
|---|---|---|
| Actor | circle, 🧑 prefix | `Actor((🧑 Customer)):::actor` |
| Command | rectangle, imperative verb | `Cmd[Place Order]:::command` |
| Aggregate | rounded/cylinder, noun | `Agg[(Order)]:::aggregate` |
| Domain Event | hexagon, past tense | `Evt{{Order Placed}}:::event` |
| Policy | parallelogram, "whenever/then" | `Pol[/whenever Order Placed then Reserve Stock/]:::policy` |
| View / read model | rectangle, 📺 prefix | `View[📺 Order Summary]:::view` |
| External system | hexagon, name | `Ext{{Payment Gateway}}:::external` |
| Hotspot | circle, ⚠ prefix | `Hot((⚠ who owns retries?)):::hotspot` |

## Wiring pattern for a single step

```mermaid
flowchart LR
  classDef actor fill:#5eead4,stroke:#0f766e,color:#000
  classDef command fill:#93c5fd,stroke:#1d4ed8,color:#000
  classDef aggregate fill:#fef08a,stroke:#b45309,color:#000
  classDef event fill:#fdba74,stroke:#c2410c,color:#000
  classDef policy fill:#d8b4fe,stroke:#6b21a8,color:#000
  classDef view fill:#86efac,stroke:#15803d,color:#000

  Actor((🧑 Actor)):::actor -->|sees| View[📺 View]:::view
  Actor -->|issues| Cmd[Command]:::command
  Cmd --> Agg[(Aggregate)]:::aggregate
  Agg --> Evt{{Event}}:::event
  Evt --> Pol[/Policy/]:::policy
  Pol -.triggers.-> NextCmd[Next Command]:::command
```

Only include the branches (view/command/aggregate/event/policy) that actually apply to the step — don't force every step to have all of them.
