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

- [`0001-resolve-remains-the-nle.md`](0001-resolve-remains-the-nle.md) — **Superseded by ADR 0009.** Historical decision that Salai would remain a Resolve companion and delegate all timeline editing/playback downstream.
- [`0002-local-first-desktop-runtime.md`](0002-local-first-desktop-runtime.md) — Salai is local-first and uses a desktop/runtime boundary for the broader application.
- [`0003-no-graph-database-initially.md`](0003-no-graph-database-initially.md) — use explicit domain types/relationships and ordinary local persistence before considering graph-database infrastructure.
- [`0004-cutmaster-default-resolve-boundary.md`](0004-cutmaster-default-resolve-boundary.md) — when Resolve integration is used, keep a Salai-owned adapter over CutMaster as the default automation boundary, with direct Resolve scripting only for unsupported/unsuitable capabilities.
- [`0005-one-narrative-ir-multiple-views.md`](0005-one-narrative-ir-multiple-views.md) — keep one canonical Narrative IR; Projections/Workspaces/Lenses must not introduce shadow narrative truth.
- [`0006-codex-runtime-behind-salai-agent-seam.md`](0006-codex-runtime-behind-salai-agent-seam.md) — **Superseded by ADR 0007.** Historical Spike 0C plan to use Codex app-server behind an agent-runtime seam.
- [`0007-project-service-is-the-human-machine-boundary.md`](0007-project-service-is-the-human-machine-boundary.md) — **Superseded by ADR 0008.** Established the project-service boundary but paired it with a backendless embedded-model 0C path.
- [`0008-external-harness-owns-agent-runtime.md`](0008-external-harness-owns-agent-runtime.md) — external harness owns model/session behavior; Salai exposes one narrow machine interface over `SalaiProjectService`. Human-validated in Spike 0C using Codex.
- [`0009-salai-owns-structural-editorial.md`](0009-salai-owns-structural-editorial.md) — **Current product/editorial boundary.** Salai owns narrative construction plus structural editorial/playback; Resolve and other specialist NLEs are optional downstream precision/finishing targets.
