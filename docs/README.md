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
| Narrative Lens product/UX semantics | [`narrative-lenses.md`](narrative-lenses.md) |
| Spike 0A types, invariants, operations, fixtures/tests | [`narrative-ir-spec.md`](narrative-ir-spec.md) |
| Spike 0A result | [`spike-0a-assessment.md`](spike-0a-assessment.md) |
| Historical Spike 0B structured-authoring contract | [`authoring-ux-spec.md`](authoring-ux-spec.md) |
| Spike 0B task/evidence record | [`spike-0b-implementation-plan.md`](spike-0b-implementation-plan.md) |
| Spike 0B result / human findings | [`spike-0b-assessment.md`](spike-0b-assessment.md) |
| Historical 0B human-test procedure | [`spike-0b-human-test-plan.md`](spike-0b-human-test-plan.md) |
| Active Spike 0C agent/free-form contract | [`agent-mediated-authoring.md`](agent-mediated-authoring.md) |
| Spike 0C task breakdown / completion status | [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md) |
| System/runtime/persistence architecture | [`architecture.md`](architecture.md) |
| Validation/implementation sequence | [`mvp.md`](mvp.md) |
| Current work ordering | [`backlog.md`](backlog.md) |

Other documents may summarize these concepts for context, but should **link to the canonical source rather than copy implementation lists, invariants, exact definitions, or task status**.

In particular, the Narrative IR operation vocabulary must only be maintained in `narrative-ir-spec.md`.

# Product and strategy

| Document | Role | Status |
| --- | --- | --- |
| [`product-brief.md`](product-brief.md) | Concise product thesis / positioning | Living |
| [`prd.md`](prd.md) | Product requirements / success criteria | Living |
| [`competitive-landscape.md`](competitive-landscape.md) | Adjacent products / positioning pressure tests | Living |
| [`research-notes.md`](research-notes.md) | Discovery evidence and observed workflow facts | Living |
| [`glossary.md`](glossary.md) | Canonical product/domain terminology | Living |
| [`scripting.md`](scripting.md) | Conceptual rationale and scripting research | Living |
| [`workflows.md`](workflows.md) | Agent-mediated workflow + Narrative Lens behavior | Living |
| [`narrative-lenses.md`](narrative-lenses.md) | Canonical creative role/requirements of structured lenses | Living / active 0C concept |

# Validation contracts and assessments

| Document | Role | Status |
| --- | --- | --- |
| [`narrative-ir-spec.md`](narrative-ir-spec.md) | Authoritative Spike 0A TDD / implementation contract | Implemented baseline |
| [`spike-0a-assessment.md`](spike-0a-assessment.md) | Spike 0A result and resolved questions | Completed |
| [`authoring-ux-spec.md`](authoring-ux-spec.md) | Structured authoring/Workspace design tested by 0B | Historical |
| [`spike-0b-implementation-plan.md`](spike-0b-implementation-plan.md) | Detailed 0B task/evidence record | Historical |
| [`spike-0b-assessment.md`](spike-0b-assessment.md) | 0B semantic result, interaction-friction finding, Narrative Lens follow-up interpretation | Closed assessment |
| [`spike-0b-human-test-plan.md`](spike-0b-human-test-plan.md) | 0B test procedure | Closed/historical |
| [`agent-mediated-authoring.md`](agent-mediated-authoring.md) | 0C free-form/agent/trust contract | Active |
| [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md) | 0C executable tasks/gates/evidence | Active |

# Architecture and engineering decisions

| Document | Role | Status |
| --- | --- | --- |
| [`architecture.md`](architecture.md) | System Architecture Document: boundaries, agent normalization, Narrative Lenses, persistence, integrations | Living SAD |
| [`rfcs/0001-one-narrative-ir-multiple-workflows.md`](rfcs/0001-one-narrative-ir-multiple-workflows.md) | One canonical IR / synchronized views proposal with 0B evidence | Proposed; interaction assumption amended |
| [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) | Agent-mediated authoring + Narrative Lenses proposal | Proposed / active review |
| [`rfcs/`](rfcs/) | RFC process and proposals | Proposed / accepted / rejected |
| [`adr/`](adr/) | Append-only accepted architecture decisions | Append-only |

# Document lifecycle

## Discovery notes

`research-notes.md` records observations. Observation does not automatically become requirement or architecture.

The 0B evidence now contains two linked observations:

1. routine direct structured authoring creates too much interaction burden; and
2. structured views remain useful when deliberately used to perceive/manipulate the narrative system.

## Technical Design Documents / spike contracts

A spike contract records what an experiment is trying to prove. When evidence changes the direction, preserve the old contract as historical evidence and create/update the next active contract.

Current chain:

- `authoring-ux-spec.md` records what 0B tested;
- `spike-0b-assessment.md` records what 0B taught us;
- `agent-mediated-authoring.md` defines the low-friction part of 0C;
- `narrative-lenses.md` defines the structured-perception/direct-manipulation part of 0C.

## Execution trackers

Implementation trackers break an active spike contract into executable tasks and record evidence.

For the current milestone, `spike-0c-implementation-plan.md` is the canonical task tracker.

It must track both:

- interaction-compression work; and
- Narrative Lens integration/validation.

## RFCs

RFC lifecycle:

```text
Draft → Proposed → Accepted / Rejected / Superseded
```

The PR containing an RFC is the discussion surface.

RFC 0002 is the current proposal created from 0B human evidence and follow-up interpretation.

## ADRs

ADRs record accepted decisions. Do not rewrite history; supersede old ADRs with new ones.

# Current development focus

**Spike 0A — Narrative IR: complete/pass.**

**Spike 0B — Structured Authoring UX: closed/mixed.** The one-IR/multiple-view architecture works; routine direct manipulation is too interaction-heavy; structured views remain promising as Narrative Lenses.

**Current milestone: Spike 0C — Agent-Mediated Authoring + Narrative Lenses.**

The goal is to test whether filmmakers can:

- write, talk, and provide media naturally;
- let Salai perform routine normalization into grouped, validated, reversible canonical changes;
- deliberately open structured Narrative Lenses when those representations help them understand or reshape the story;
- move between agent-mediated and direct-lens work without losing canonical continuity.

Start with:

- [`agent-mediated-authoring.md`](agent-mediated-authoring.md);
- [`narrative-lenses.md`](narrative-lenses.md);
- [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md);
- [`spike-0b-assessment.md`](spike-0b-assessment.md);
- [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md);
- [`mvp.md`](mvp.md) and [`backlog.md`](backlog.md).