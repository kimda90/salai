# Salai Documentation Map

This directory separates product intent, discovery evidence, implementation contracts, architecture, proposals, and accepted decisions so the same information does not drift across several files.

## Canonical ownership rule

Each kind of information has one authoritative home:

| Information | Canonical source |
| --- | --- |
| Product/domain term definitions | [`glossary.md`](glossary.md) |
| Product requirements / success criteria | [`prd.md`](prd.md) |
| Discovery observations | [`research-notes.md`](research-notes.md) |
| Spike 0A types, invariants, operations, fixtures/tests | [`narrative-ir-spec.md`](narrative-ir-spec.md) |
| Spike 0A result / resolved implementation questions | [`spike-0a-assessment.md`](spike-0a-assessment.md) |
| Creative workflow behavior | [`workflows.md`](workflows.md) |
| System/runtime/persistence architecture | [`architecture.md`](architecture.md) |
| Validation/implementation sequence | [`mvp.md`](mvp.md) |
| Current work ordering | [`backlog.md`](backlog.md) |
| Major proposal under discussion | [`rfcs/`](rfcs/) |
| Accepted architectural decision | [`adr/`](adr/) |

Other documents may summarize these concepts for context, but should **link to the canonical source rather than copy implementation lists, invariants, or exact definitions**.

In particular, the Narrative IR operation vocabulary must only be maintained in `narrative-ir-spec.md`.

## Product and strategy

| Document | Role | Status |
| --- | --- | --- |
| [`product-brief.md`](product-brief.md) | Concise product thesis, audience, boundary, positioning, and current direction | Living |
| [`prd.md`](prd.md) | Product Requirements Document: what/why/scope/success criteria | Living |
| [`competitive-landscape.md`](competitive-landscape.md) | Named adjacent products and positioning pressure tests | Living research |
| [`backlog.md`](backlog.md) | NOW/NEXT/LATER product/engineering backlog | Living |
| [`research-notes.md`](research-notes.md) | Concrete workflow observations; evidence rather than decisions | Living research record |
| [`service-levels.md`](service-levels.md) | SLA applicability and future reliability/support commitments | Living; no external SLA yet |
| [`mvp.md`](mvp.md) | Validation sequence and staged implementation plan | Living |

## Product model and workflows

| Document | Role | Status |
| --- | --- | --- |
| [`glossary.md`](glossary.md) | Canonical product/domain terminology | Living |
| [`scripting.md`](scripting.md) | Conceptual rationale and scripting research | Living |
| [`workflows.md`](workflows.md) | Familiar working surfaces: Story Wall, AV Script, Paper/Radio Edit, Outline, boards, and projections | Living |
| [`narrative-ir-spec.md`](narrative-ir-spec.md) | Authoritative TDD / implementation contract for Spike 0A | Implemented baseline; revise when evidence changes contract |
| [`spike-0a-assessment.md`](spike-0a-assessment.md) | Spike 0A result and resolutions of implementation questions | Completed assessment |

## Architecture and engineering decisions

| Document | Role | Status |
| --- | --- | --- |
| [`architecture.md`](architecture.md) | System Architecture Document: boundaries, runtime, persistence ownership, infrastructure | Living SAD |
| [`rfcs/`](rfcs/) | Major proposals that need review before commitment | Proposed / accepted / rejected |
| [`adr/`](adr/) | Append-only records of accepted architectural decisions | Append-only |

## Review records

| Document | Role |
| --- | --- |
| [`review-response-2026-08.md`](review-response-2026-08.md) | Resolution record for the August 2026 documentation feedback pass |

# Document lifecycle

## Discovery notes

`research-notes.md` records observed workflow evidence. Observation does not automatically become requirement or architecture. Promote it explicitly when evidence supports doing so.

## PRD / backlog / product / architecture docs

Living documents. They should stay at their own abstraction level and link to deeper canonical documents rather than duplicating them.

## Technical Design Documents

A TDD/spec is written before or during a complex implementation spike and acts as its contract. When implementation evidence changes the contract, update the TDD and record the result rather than leaving contradictory summary docs behind.

## RFCs

Use an RFC for a major proposal whose consequences deserve discussion before commitment.

```text
Draft → Proposed → Accepted / Rejected / Superseded
```

The PR containing an RFC is the discussion surface.

## ADRs

ADRs record accepted decisions. Do not rewrite history; supersede old ADRs with new ones.

```text
Accepted → Superseded
```

# Current development focus

**Spike 0A — Narrative IR is implemented and assessed as a pass.**

See [`spike-0a-assessment.md`](spike-0a-assessment.md) for the evidence and resolved open questions.

The next validation milestone is **Spike 0B — Authoring UX**, which will test Story Wall, Outline, AV Script, and Paper/Radio Edit over the same IR and define the minimum in-memory Workspace/Board model before Phase 2 persistence.
