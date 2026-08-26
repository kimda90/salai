# ADR 0003 — No Graph Database Initially

## Status

Accepted for the initial implementation.

## Context

Salai's domain has graph-like relationships between narrative intent, Cues, ShotIntents, source excerpts, media, generated alternatives, editorial use, and review state.

This makes graph theory a useful conceptual lens, but it does not automatically justify a graph database or generic graph-first domain model.

The current product risk is whether the creative model and workflows are correct, not whether complex graph traversal infrastructure can be built.

## Decision

Initial Salai implementations will use explicit typed domain objects and explicit relationship records with ordinary local persistence.

Spike 0A remains a pure TypeScript model. The later local production graph is expected to use SQLite or another simple local persistence layer before any graph-database technology is considered.

Graph concepts may inform queries and relationships, but the graph must serve the creative workflows rather than drive the product model.

## Alternatives considered

### Graph database as the foundation

Not selected because it introduces schema/query/operational complexity before there is evidence that relational/local persistence cannot support required workflows.

### Fully denormalized document model

Not selected as the long-term assumption because stable cross-domain relationships and source identity are first-class requirements.

## Consequences

Positive:

- lower implementation complexity;
- simpler local packaging and migration;
- easier fixture-driven domain testing;
- avoids over-modeling every concept as a node/edge.

Costs:

- some relationship queries may require explicit indexes/joins/application logic;
- if future workflows need complex traversal at scale, persistence may need to evolve.

## Revisit trigger

Consider graph-specific infrastructure only when measured product requirements demonstrate that ordinary typed relationships and local persistence are materially limiting query complexity, performance, or collaboration—not because the domain can be drawn as a graph.
