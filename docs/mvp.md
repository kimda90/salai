# Salai MVP and Validation Roadmap

## Status

Living validation sequence.

This document owns **when** major product and technical risks are tested. It does not own implementation task numbering. The canonical active task tracker is [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).

Narrative semantics remain authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md). Current interaction contracts are [`agent-mediated-authoring.md`](agent-mediated-authoring.md) and [`narrative-lenses.md`](narrative-lenses.md).

## MVP goal

Validate Salai's narrative/production model and primary creative interaction before investing heavily in desktop/runtime infrastructure, Resolve automation, real media analysis, or GenAI execution.

The MVP should ultimately prove that:

1. one semantic narrative model can represent script-first and footage-first work;
2. stable narrative identity can retain source evidence and production intent through restructuring;
3. ordinary creative intent can be expressed with substantially less interaction than manual model management requires;
4. structured Narrative Lenses can reveal useful story properties and support direct manipulation when that representation helps the creator think;
5. agent-mediated authoring and direct lens editing can share one canonical project without document drift;
6. Resolve can consume normalized downstream choices without Salai becoming an NLE or chat-controlled command shell;
7. captured and generated media can later participate in the same production flow.

# Phase 0 — Narrative and authoring foundation

## Spike 0A — Narrative IR

**Status: complete / pass.**

Validated:

- Script / Section / optional Scene / Beat / Cue / ContentBlock structure;
- stable identity;
- authored vs source-backed content;
- source/ShotIntent relationship stubs;
- typed structural operations;
- validation and relationship consequences;
- serialization/versioning;
- approximate runtime;
- script-first, interview/corporate, and footage-first fixtures.

See [`narrative-ir-spec.md`](narrative-ir-spec.md) and [`spike-0a-assessment.md`](spike-0a-assessment.md).

## Spike 0B — Structured authoring UX

**Status: closed / mixed.**

0B proved that Story Wall, Outline, AV Script, and Paper/Radio Edit can manipulate one canonical Narrative IR while preserving stable identity, Workspace isolation, source semantics, and cross-surface propagation.

The first human UX test also found:

> **Using direct structured manipulation as the routine path requires too much interaction to be creatively useful.**

That is an interaction failure, not a failure of the Narrative IR.

The same structured views remain valuable when deliberately used to perceive or reshape the story, so they continue as **Narrative Lenses**.

See [`spike-0b-assessment.md`](spike-0b-assessment.md).

## Spike 0C — Agent-Mediated Authoring + Narrative Lenses

**Status: current validation priority.**

### Validation question

Can a filmmaker express ordinary creative intent through free-form writing, conversation, and supplied media while Salai performs routine structural normalization, and can the same creator deliberately use Narrative Lenses when structured perception or direct manipulation is creatively useful?

0C must prove both **interaction compression** and **structural insight**.

### Minimum proof

0C should stay narrow. It needs to demonstrate:

- one script-first authoring/revision flow;
- one footage/source-backed flow using mocked or fixture-backed attachment metadata;
- one atomic multi-operation agent change with understandable summary and one-step revert;
- source evidence preserved through agent-mediated changes;
- one meaningful direct-lens edit that is visible to the next agent request;
- existing lenses remaining synchronized with canonical state;
- human evidence that routine interaction is lower than 0B and at least one lens adds structural insight.

Coverage **reasoning** may be tested with mocked relationships, but a new Coverage Lens belongs to the later production-graph phase.

### 0C exit gate

Proceed only if:

1. representative routine tasks require materially less incidental interaction than 0B;
2. agent output resolves through validated typed canonical operations;
3. failed grouped changes do not partially publish live state;
4. source-backed content remains source-backed;
5. grouped changes are understandable and revertible;
6. direct lens edits and agent changes share one canonical project;
7. at least one existing Narrative Lens provides useful structural insight in human testing;
8. no second canonical chat/document/lens model is required.

The executable tasks and evidence live only in [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).

# Phase 1 — Local production application

Proceed only after 0C validates the interaction model.

Introduce the accepted local-first desktop/runtime direction: Electron/React shell, local filesystem/process access, a local service boundary where justified, durable project persistence, and recovery/history sufficient for production use.

See [`adr/0002-local-first-desktop-runtime.md`](adr/0002-local-first-desktop-runtime.md) and [`architecture.md`](architecture.md).

# Phase 2 — Production graph and Coverage Lens

Introduce durable production relationships around the validated narrative model: ShotIntent, real Asset / MediaSegment identity, realization alternatives, provenance, missing-coverage reasoning over real project data, and Coverage as a first-class Narrative Lens if the workflow proves useful.

# Phase 3 — Resolve vertical slice

Prove the downstream boundary:

```text
Salai canonical state
        ↓
materialization decision
        ↓
Salai Resolve adapter
        ↓
CutMaster
        ↓
DaVinci Resolve
```

Agent requests and lens edits must change canonical Salai state before Resolve materialization.

# Phase 4 — Reverse scripting with real media

Replace mocked 0C attachment evidence with real media-derived data using commodity tools where appropriate. Validate that real transcripts, source ranges, and media metadata preserve the same Narrative IR/source semantics already proven by fixtures.

# Phase 5 — Alternatives / editorial materialization

Validate story-level alternatives independent from a Resolve timeline. Preserve tried/rejected material, compare alternatives, estimate runtime, and choose materialization targets. Introduce new version/editorial-plan domain types only if this phase demonstrates a concrete need.

# Phase 6 — GenAI / previs

Add generation only after ordinary ShotIntent/media relationships work. Generated output should enter the same Asset/provenance flow as captured material and remain downstream of narrative/production intent.

# Conditional / later work

Introduce only when validated workflows require it: collaboration/sync, hosted review, richer screenplay interchange, optional mixed-media spatial lenses/workspaces, OpenAssetIO interoperability, and richer generation operations.

# Current gate

Work only on **Spike 0C — Agent-Mediated Authoring + Narrative Lenses** until its interaction-compression and structural-insight questions are answered.

Do not pull desktop packaging, durable persistence, real Resolve execution, full media analysis, a new Coverage Lens, GenAI execution, a canonical rich-text model, or a general agent framework into 0C unless the smallest possible mock is necessary to answer its pass/fail question.