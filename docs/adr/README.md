# Salai Architecture Decision Records

ADRs are the append-only record of accepted architectural decisions.

An ADR should answer:

- What decision was made?
- What context forced the decision?
- What alternatives were considered?
- What consequences/trade-offs follow?

## Rules

1. Do not use ADRs as brainstorming documents; use an RFC when the proposal still needs discussion.
2. Do not rewrite an accepted ADR to make history look cleaner.
3. If a decision changes, create a new ADR with `Supersedes: ADR-NNNN` and mark the old ADR as superseded.
4. Keep ADRs short enough that the actual decision is obvious.

## Template

```markdown
# ADR NNNN — Title

## Status
Accepted | Superseded

## Context
...

## Decision
...

## Alternatives considered
...

## Consequences
...
```

## Current records

- [`0001-resolve-remains-the-nle.md`](0001-resolve-remains-the-nle.md) — Salai is a companion; Resolve remains the downstream editing/finishing environment.
- [`0002-local-first-desktop-runtime.md`](0002-local-first-desktop-runtime.md) — Salai is local-first and uses an Electron/React desktop shell with a local Python service for the broader application.
- [`0003-no-graph-database-initially.md`](0003-no-graph-database-initially.md) — use explicit domain types/relationships and ordinary local persistence before considering graph-database infrastructure.
- [`0004-cutmaster-default-resolve-boundary.md`](0004-cutmaster-default-resolve-boundary.md) — use a Salai-owned adapter over CutMaster as the default Resolve automation boundary, with direct Resolve scripting only for unsupported/unsuitable capabilities.

The proposed Narrative IR/workspace architecture is currently RFC 0001 and should not receive an accepted ADR until that RFC is accepted/validated.
