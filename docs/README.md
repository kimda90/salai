# Salai Documentation Map

This directory separates product intent, discovery evidence, implementation contracts, architecture, proposals, accepted decisions, and execution tracking so the same information does not drift across several files.

## Canonical ownership rule

Each kind of information has one authoritative home:

| Information | Canonical source |
| --- | --- |
| Product/domain term definitions | [`glossary.md`](glossary.md) |
| Product requirements / success criteria | [`prd.md`](prd.md) |
| Discovery observations | [`research-notes.md`](research-notes.md) |
| Creative workflow behavior | [`workflows.md`](workflows.md) |
| Spike 0A types, invariants, operations, fixtures/tests | [`narrative-ir-spec.md`](narrative-ir-spec.md) |
| Spike 0A result / resolved implementation questions | [`spike-0a-assessment.md`](spike-0a-assessment.md) |
| Historical Spike 0B structured-authoring contract | [`authoring-ux-spec.md`](authoring-ux-spec.md) |
| Spike 0B task breakdown / implementation evidence | [`spike-0b-implementation-plan.md`](spike-0b-implementation-plan.md) |
| Spike 0B result / human creative-friction finding | [`spike-0b-assessment.md`](spike-0b-assessment.md) |
| Historical 0B human-test procedure / outcome | [`spike-0b-human-test-plan.md`](spike-0b-human-test-plan.md) |
| Active Spike 0C agent-mediated authoring contract | [`agent-mediated-authoring.md`](agent-mediated-authoring.md) |
| Spike 0C task breakdown / completion status | [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md) |
| System/runtime/persistence architecture | [`architecture.md`](architecture.md) |
| Validation/implementation sequence | [`mvp.md`](mvp.md) |
| Current work ordering | [`backlog.md`](backlog.md) |
| Major proposal under discussion | [`rfcs/`](rfcs/) |
| Accepted architectural decision | [`adr/`](adr/) |

Other documents may summarize these concepts for context, but should **link to the canonical source rather than copy implementation lists, invariants, exact definitions, or task status**.

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
| [`workflows.md`](workflows.md) | Agent-mediated primary workflow plus specialized structured views | Living |
| [`narrative-ir-spec.md`](narrative-ir-spec.md) | Authoritative TDD / implementation contract for Spike 0A | Implemented baseline; revise when evidence changes contract |
| [`spike-0a-assessment.md`](spike-0a-assessment.md) | Spike 0A result and resolutions | Completed assessment |
| [`authoring-ux-spec.md`](authoring-ux-spec.md) | Structured authoring/Workspace technical design tested by 0B | Historical contract |
| [`spike-0b-implementation-plan.md`](spike-0b-implementation-plan.md) | Detailed 0B task execution/evidence record | Historical execution tracker |
| [`spike-0b-assessment.md`](spike-0b-assessment.md) | 0B model/view result and creative-friction finding | Closed assessment |
| [`spike-0b-human-test-plan.md`](spike-0b-human-test-plan.md) | 0B human procedure and finding that superseded local UX questions | Closed/historical |
| [`agent-mediated-authoring.md`](agent-mediated-authoring.md) | 0C free-form text/chat/media normalization and trust contract | Active validation contract |
| [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md) | 0C executable tasks, gates, and implementation evidence | Active execution tracker |

## Architecture and engineering decisions

| Document | Role | Status |
| --- | --- | --- |
| [`architecture.md`](architecture.md) | System Architecture Document: boundaries, runtime, agent normalization, persistence, integrations | Living SAD |
| [`rfcs/0001-one-narrative-ir-multiple-workflows.md`](rfcs/0001-one-narrative-ir-multiple-workflows.md) | One canonical IR / synchronized view proposal with 0B evidence | Proposed; interaction assumption amended |
| [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) | Agent-mediated primary authoring proposal | Proposed / active review |
| [`rfcs/`](rfcs/) | RFC process and proposals | Proposed / accepted / rejected |
| [`adr/`](adr/) | Append-only records of accepted architectural decisions | Append-only |

## Review records

| Document | Role |
| --- | --- |
| [`review-response-2026-08.md`](review-response-2026-08.md) | Resolution record for the August 2026 documentation feedback pass |

# Document lifecycle

## Discovery notes

`research-notes.md` records observed workflow evidence. Observation does not automatically become requirement or architecture. Promote it explicitly when evidence supports doing so.

The first 0B human UX test is now a key discovery input: direct structured manipulation requires too much interaction for the primary creative flow.

## PRD / backlog / product / architecture docs

Living documents. They should stay at their own abstraction level and link to deeper canonical documents rather than duplicating them.

## Technical Design Documents

A TDD/spec is written before or during a complex implementation spike and acts as its contract. When implementation evidence changes the direction, preserve the old contract as historical evidence and create/update the next active contract rather than rewriting the experiment as if it had tested something else.

Current example:

- `authoring-ux-spec.md` records what 0B tested;
- `spike-0b-assessment.md` records why that primary UX was rejected;
- `agent-mediated-authoring.md` defines what 0C will test next.

## Execution trackers

Implementation trackers break an accepted spike/phase contract into executable tasks and record completion evidence. A closed tracker's unchecked product gates can remain as evidence of why the direction changed; do not force a failed discovery spike to look like a pass.

For the current milestone, `spike-0c-implementation-plan.md` is the canonical task tracker.

## RFCs

Use an RFC for a major proposal whose consequences deserve discussion before commitment.

```text
Draft → Proposed → Accepted / Rejected / Superseded
```

The PR containing an RFC is the discussion surface.

RFC 0002 is the current product/architecture proposal created from 0B human evidence.

## ADRs

ADRs record accepted decisions. Do not rewrite history; supersede old ADRs with new ones.

```text
Accepted → Superseded
```

# Current development focus

**Spike 0A — Narrative IR: complete/pass.**

**Spike 0B — Structured Authoring UX: closed/mixed.** The one-IR/multiple-view architecture works, but direct manipulation of those views failed the human creative-friction test.

**Current milestone: Spike 0C — Agent-Mediated Authoring.**

The goal is to test whether filmmakers can write, talk, and provide media naturally while Salai normalizes that input into grouped, validated, reversible canonical project changes.

The structured 0B surfaces remain in the prototype as specialized inspection/precision views.

Start with:

- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — active implementation/UX contract;
- [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md) — executable task tracker;
- [`spike-0b-assessment.md`](spike-0b-assessment.md) — evidence that caused the direction change;
- [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) — architectural proposal;
- [`mvp.md`](mvp.md) and [`backlog.md`](backlog.md) — current execution order.
