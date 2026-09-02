# Salai MVP and Validation Roadmap

## Status

Living validation sequence.

This document owns **when** major product and technical risks are tested. It does not own detailed implementation task numbering. Narrative semantics remain authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md), and the product/editorial boundary remains [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md).

Current validation priority: **Spike 0E — Semantic Editorial Interaction Depth, implementation starting at 0E.0.**

Current accepted interaction documents:

- [`rfcs/0003-semantic-editorial-interaction-model.md`](rfcs/0003-semantic-editorial-interaction-model.md)
- [`editorial-interaction.md`](editorial-interaction.md)
- [`spike-0e-implementation-plan.md`](spike-0e-implementation-plan.md)

## MVP goal

Validate that Salai can carry durable narrative intent from low-friction authoring into a playable structural audiovisual edit while preserving stable identity, source evidence, and a clean path to real media, production intent, alternatives, generation, and optional downstream finishing.

The MVP should ultimately prove that:

1. one semantic narrative model can represent script-first and footage-first work;
2. stable narrative identity can retain source evidence and production intent through restructuring;
3. ordinary creative intent can be expressed with substantially less interaction than manual model management requires;
4. an external agent can operate the same canonical project without becoming a second source of truth;
5. semantic structure remains useful when the story is represented and played in actual time;
6. direct structural editorial and agent-mediated changes share one canonical project;
7. captured and generated media can participate in the same realization/assembly flow;
8. specialist NLEs can receive deliberate downstream materialization without owning Salai project truth.

# Phase 0 — Narrative, interaction, and editorial foundation

## Spike 0A — Narrative IR

**Status: complete / pass.**

Validated Script / Section / optional Scene / Beat / Cue / ContentBlock structure, stable identity, authored/source-backed content, source/ShotIntent references, typed operations, validation, serialization, runtime estimation, and representative script-first/footage-first fixtures.

See [`narrative-ir-spec.md`](narrative-ir-spec.md) and [`spike-0a-assessment.md`](spike-0a-assessment.md).

## Spike 0B — Structured authoring UX

**Status: closed / mixed.**

0B proved that Story Wall, Outline, AV Script, and Paper/Radio Edit can manipulate one canonical Narrative IR while preserving stable identity, Workspace isolation, source semantics, and cross-surface propagation.

Human testing found routine direct structured manipulation too interaction-heavy to be the default path. Structured representations remain useful as deliberate Narrative Lenses.

See [`spike-0b-assessment.md`](spike-0b-assessment.md).

## Spike 0C — External-Agent Authoring + Narrative Lenses

**Status: complete / pass.**

Human validation using Codex demonstrated that routine structural manipulation can remain low-friction while Salai stays the source of truth.

Validated:

- external harness ↔ live `SalaiProjectService` boundary;
- narrow CLI-oriented machine interface;
- typed canonical operation batches;
- grouped apply/revert;
- source-backed semantics through the machine boundary;
- direct UI and machine interaction sharing one project;
- materially lower routine structural interaction than 0B;
- no Salai-owned provider auth, sessions, model routing, or agent runtime.

See [`spike-0c-assessment.md`](spike-0c-assessment.md) and [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md).

## Spike 0D — Semantic Editorial Environment

**Status: closed / mixed. Technical architecture passes; human interaction gate does not.**

0D proved that Narrative IR can drive a playable temporal audiovisual assembly, direct timeline gestures can round-trip through canonical operations, and external-agent and direct temporal changes can share one live project.

Human validation found that the implemented timeline was too shallow and fragmented to demonstrate a meaningful semantic advantage or replace a conventional editor for structural judgment.

Validated technically:

- semantic timeline derived from canonical Narrative IR;
- Section/Beat/Cue timing on an actual temporal surface;
- playable picture/audio rough assembly without Resolve;
- direct Beat/Cue reorder and SourceExcerpt trim through canonical operations;
- explicit missing/unsupported material;
- agent-mediated timing/structure changes through the validated 0C boundary;
- direct timeline changes visible to the next agent context read;
- timeline/rendering engines remain replaceable projections.

Human failures/findings:

- spacebar transport missing;
- placeholder audio distracting;
- too few selected-item editing capabilities;
- no useful creation of Beats/Cues/material in temporal context;
- multiple visual/audio material in a Cue not exposed naturally;
- Story/Moments/Media switching lost context;
- no multi-selection;
- insufficient source I/O and split/blade grammar;
- rough story could not be meaningfully judged/improved inside Salai alone.

Key interpretation:

> **Semantic visibility without enough direct editing power is insufficient.**

See [`spike-0d-assessment.md`](spike-0d-assessment.md).

## Spike 0E — Semantic Editorial Interaction Depth

**Status: current validation priority; shaping accepted, implementation starts at 0E.0.**

### Validation question

> **If Salai provides one context-preserving hierarchical timeline plus the minimum useful canonical rough-editing grammar, do its semantic objects materially improve structural editing compared with generic clip manipulation?**

### Accepted interaction direction

RFC 0003 was accepted on September 2, 2026. 0E uses one temporal context with nested semantic depth:

```text
Script  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━ Section ━━━━━━━━━━━━━━━━━
  Beat  ━━━━━━━━━━━ Beat ━━━━━━━━━   Beat ━━━━━━━━━━━━━━━━━
    Cue ━━━━━ Cue ━   Cue ━━━━━━━     Cue ━━━━━ Cue ━━━━━━━
      V ━━━━  V ━━     V ━━━━━          V ━━━━   missing ━━
      A ━━━━━━━       source ━━━━━       A ━━━━━━━━━━━━━━━━━
```

The design reference may resemble a flamegraph, but the product requirement is context preservation, not a specific drawing style.

Accepted semantic constraints:

- Cue is the canonical narrative-time interval;
- all visual/audio ContentBlocks inside a Cue are exposed;
- ordinary ContentBlocks do not gain hidden independent narrative offsets/durations;
- SourceExcerpt source I/O remains evidence state distinct from Cue duration;
- canonical order/duration changes ripple later derived time;
- selection/multi-selection, hierarchy expansion, viewport, and playhead are non-canonical interaction state;
- direct actions compile to current Narrative IR operations/batches where possible;
- timeline/playback engines remain replaceable;
- external harness boundary remains unchanged.

Five questions remain deliberately deferred in RFC 0003 and must not be implemented implicitly: Cue split, SourceExcerpt split, independent within-Cue timing, intentional black-vs-missing identity, and broad cross-parent grouped moves.

### Minimum proof

0E must demonstrate:

- one context-preserving hierarchical temporal surface;
- useful type-appropriate inspector editing;
- creation of Sections/Beats/Cues/visual/audio content in semantic temporal context;
- every visual/audio block in a Cue available for direct work;
- additive/range multi-selection and at least one useful grouped canonical edit;
- familiar spacebar transport;
- Section/Beat/Cue/block movement/reorder;
- Cue narrative-duration editing;
- SourceExcerpt source I/O editing;
- Beat split/merge through accepted canonical semantics;
- grouped action/revert;
- non-distracting validation media;
- unchanged external-harness continuity.

### 0E exit gate

Proceed only if human evidence shows both:

1. semantic hierarchy materially changes at least one real structural/editorial decision compared with generic clip thinking; and
2. the minimum editing grammar is sufficient to judge/improve the representative rough story without Resolve for that structural task.

If those still fail after the accepted interaction is implemented, reassess whether Salai should own the direct temporal editor instead of automatically adding more NLE surface area.

# Phase 1 — Local production application

Proceed only after 0E validates structural-editorial interaction.

Introduce the local-first production runtime needed for real projects: desktop shell/runtime, durable canonical/Workspace/editorial persistence, project folders, local/NAS media access, recovery/history sufficient for production use, and the validated semantic timeline/playback adapters.

See [`adr/0002-local-first-desktop-runtime.md`](adr/0002-local-first-desktop-runtime.md) and [`architecture.md`](architecture.md).

# Phase 2 — Production graph and real media relationships

Introduce durable production relationships around the validated narrative/editorial model: ShotIntent, real Asset / MediaSegment identity, evidence-backed realization alternatives, provenance, and missing-coverage reasoning over real project data.

Build a dedicated Coverage representation only if workflow evidence shows a separate view adds value beyond temporal/other semantic overlays.

# Phase 3 — Reverse scripting with real media

Replace fixture-backed source data with real media-derived data using commodity tools where appropriate. Validate that real transcripts, source ranges, thumbnails/waveforms, and media metadata preserve Narrative IR/source semantics.

# Phase 4 — Alternatives, review, and editorial comparison

Validate story-level and realization alternatives without duplicating entire projects unnecessarily. Preserve tried/rejected material, compare alternatives, review the playable assembly, and keep annotations tied to stable narrative/media identity.

# Phase 5 — Downstream NLE interchange / finishing handoff

Prove the optional downstream boundary:

```text
Salai canonical state
        ↓
structural assembly / materialization decision
        ↓
interchange / Salai NLE adapter
        ↓
Resolve or another specialist NLE
```

Resolve remains an important target. When Resolve automation is used, ADR 0004 still applies to the CutMaster boundary.

OpenTimelineIO and other interchange formats may be introduced here if they materially reduce adapter-specific coupling.

# Phase 6 — GenAI / previs / generative realization

Add generation after ordinary media/realization relationships work. Generated output should enter the same Asset/provenance/assembly flow as captured material and remain downstream of narrative/production intent.

# Conditional / later work

Introduce only when validated workflows require it: collaboration/sync, hosted review, richer screenplay interchange, Story Spine/mixed-media spatial exploration, continuity/world constraints, broader asset-management interoperability, and additional machine protocols.

# Current gate

Work only on **Spike 0E — Semantic Editorial Interaction Depth**, starting with **0E.0 — Interaction foundation and evaluation noise**.

Do not pull Phase 1 persistence, Production Graph, Story Spine, real GenAI, Resolve integration, specialist finishing features, or a second agent protocol/runtime into 0E. Do not implement the five deferred RFC 0003 questions unless a later slice explicitly resolves one first.