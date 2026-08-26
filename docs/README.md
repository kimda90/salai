# Salai Documentation Map

This directory separates product intent, implementation planning, architecture, proposals, and accepted decisions so the same information is not duplicated across several documents.

## Product and strategy

| Document | Role | Status |
| --- | --- | --- |
| [`product-brief.md`](product-brief.md) | Concise product thesis, target users, product boundary, and current direction | Living |
| [`prd.md`](prd.md) | Product Requirements Document: what Salai must accomplish, for whom, why, scope, requirements, and success criteria | Living |
| [`backlog.md`](backlog.md) | User stories and ordered product/engineering backlog | Living |
| [`service-levels.md`](service-levels.md) | SLA applicability and future reliability/support commitments | Living; no external SLA yet |
| [`mvp.md`](mvp.md) | Validation sequence and staged implementation plan | Living |

## Product model and workflows

| Document | Role | Status |
| --- | --- | --- |
| [`scripting.md`](scripting.md) | Narrative model concepts and scripting research | Living |
| [`workflows.md`](workflows.md) | Familiar creative working surfaces: Story Wall, AV Script, Paper/Radio Edit, Outline, boards, and projections | Living |
| [`narrative-ir-spec.md`](narrative-ir-spec.md) | Technical Design Document for Spike 0A Narrative IR | Draft / implementation contract |

## Architecture and engineering decisions

| Document | Role | Status |
| --- | --- | --- |
| [`architecture.md`](architecture.md) | System Architecture Document: system boundaries, major components, data flows, runtime topology, and technology direction | Living SAD |
| [`rfcs/`](rfcs/) | Major proposals that need review before they become commitments | Proposed / accepted / rejected |
| [`adr/`](adr/) | Append-only Architecture Decision Records for accepted technical decisions | Append-only |

## Document lifecycle

### PRD / backlog / architecture / product docs

These are living documents and should be updated as the product changes.

### Technical Design Documents

A TDD/spec is written before implementing a sufficiently complex feature or subsystem. It should describe the implementation contract and unresolved trade-offs for that feature. Once implementation diverges materially, update the spec or explicitly supersede it.

### RFCs

Use an RFC when a proposal changes shared architecture, domain semantics, a major dependency, or a team-wide engineering convention and benefits from discussion before commitment.

Typical lifecycle:

```text
Draft → Proposed → Accepted / Rejected / Superseded
```

The pull request containing an RFC is the discussion surface.

### ADRs

ADRs record decisions after they are accepted. Do not rewrite history. If a decision changes, add a new ADR that supersedes the previous one.

Typical status:

```text
Accepted → Superseded
```

## Current development focus

The current implementation target is **Spike 0A — Narrative IR**.

Before coding, the Narrative IR spec should define:

- domain terms;
- invariants;
- operation semantics;
- serialization/versioning;
- fixture expectations;
- pass/fail criteria.

The purpose of the spike is to validate the semantic model before UI, Resolve, persistence, or AI integration make changes expensive.
