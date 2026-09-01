# Salai MVP and Validation Roadmap

## Status

Living validation sequence.

This document owns **when** major product and technical risks are tested. It does not own detailed implementation task numbering. Narrative semantics remain authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md), and the product/editorial boundary remains [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md).

Current validation priority: **Spike 0E — Semantic Editorial Interaction Depth**.

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

Human testing found that routine direct structured manipulation requires too much interaction to be creatively useful. Structured representations remain useful as deliberate Narrative Lenses.

See [`spike-0b-assessment.md`](spike-0b-assessment.md).

## Spike 0C — External-Agent Authoring + Narrative Lenses

**Status: complete / pass.**

Human validation using Codex as the external harness demonstrated that routine structural manipulation can remain low-friction while Salai stays the source of truth.

Validated:

- external harness ↔ live `SalaiProjectService` boundary;
- one narrow CLI-oriented machine interface;
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

### Technical results

Validated:

- semantic timeline derived from canonical Narrative IR;
- Section/Beat/Cue timing on an actual temporal surface;
- playable picture/audio rough assembly without Resolve;
- direct Beat/Cue reorder and SourceExcerpt trim through canonical operations;
- missing/unsupported material explicit;
- agent-mediated timing/structure changes through the validated 0C boundary;
- direct timeline changes visible to the next agent context read;
- timeline/rendering engines remain replaceable projections.

### Human findings

- playback itself worked;
- external harness behavior worked correctly;
- spacebar transport was missing;
- fixed-frequency placeholder audio was distracting;
- too few timeline items/properties could be edited;
- new Beats/Cues/audiovisual material could not be created in temporal context;
- multiple visual/audio material inside a Cue was not exposed as independently manipulable;
- Story / Moments / Media tab switching fragmented context;
- multi-selection was missing;
- baseline structural editing operations such as trim, split/blade, and source in/out were insufficient;
- the user could not meaningfully judge and improve the rough story in Salai alone.

The key interpretation is:

> **Semantic visibility without enough direct editing power is insufficient.**

The result does not invalidate Narrative IR or Salai-owned structural editorial. It shows that the interaction experiment was underpowered.

See [`spike-0d-assessment.md`](spike-0d-assessment.md) and [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).

## Spike 0E — Semantic Editorial Interaction Depth

**Status: current validation priority.**

### Validation question

> **If Salai provides one context-preserving hierarchical timeline plus a minimum useful rough-editing grammar, do its semantic objects materially improve structural editing compared with generic clip manipulation?**

### Why this spike exists

0D intentionally avoided building an NLE, but the boundary was drawn too narrowly to produce meaningful human evidence. 0E should add only the interaction depth necessary to test the same semantic-editorial thesis fairly.

The main interaction hypothesis is a **flamegraph-like hierarchical temporal view** that keeps the whole story visible while exposing nested semantic detail:

```text
Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Beat ━━━━━━━━━━━━━━━  Beat ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Cue ━━━━━ Cue ━━━      Cue ━━━━━━━━━━━━━ Cue ━━━━━━━━━━━
      visual ━━━━━━━        visual ━━━━━━━   missing ━━━━━━━
      audio  ━━━━━━━━━       source ━━━━━━━━━━━━━━━━━━━━━━━━━
```

The exact visual form is not predetermined. The required property is preserving global temporal context while drilling into Section → Beat → Cue → content/media.

### Minimum proof

0E must demonstrate:

- one context-preserving hierarchical temporal surface rather than mechanical Story/Moments/Media tab switching;
- contextual editing/inspector for the selected semantic object;
- creation of Beats, Cues, and appropriate visual/audio content from temporal context;
- multiple visual/audio blocks within a Cue visible and independently selectable;
- selection and multi-selection;
- standard spacebar play/pause;
- reorder/move;
- source/media edge trim;
- source in/out adjustment;
- the smallest semantically correct split/blade behavior;
- grouped canonical action + revert for direct editing;
- non-distracting validation media;
- external harness continuity through the existing 0C/0D machine interface without a new agent path.

### 0E boundaries

0E is **not** a full NLE implementation.

Do not add unless directly required by the validation task:

- color grading;
- compositing/VFX;
- keyframe/effects systems;
- multicam;
- advanced trim modes;
- full audio post/mixing;
- mastering/delivery;
- production graph;
- real Resolve integration;
- GenAI execution;
- Story Spine/canvas;
- second machine protocol or Salai-owned model runtime.

### 0E exit gate

Proceed only if human evidence shows both:

1. the hierarchical semantic timeline changes at least one real structural/editorial decision compared with generic clip thinking; and
2. the minimum editing grammar is sufficient to judge and improve the representative rough story without requiring Resolve for that structural task.

If this still fails, reassess whether Salai should own the direct temporal editor at all rather than continuing to add NLE surface area by default.

# Phase 1 — Local production application

Proceed only after 0E validates the structural-editorial interaction.

Introduce the local-first production runtime needed for real projects: desktop shell/runtime, durable canonical/Workspace/editorial persistence, project folders, local/NAS media access, recovery/history sufficient for production use, and the validated semantic timeline/playback adapters.

See [`adr/0002-local-first-desktop-runtime.md`](adr/0002-local-first-desktop-runtime.md) and [`architecture.md`](architecture.md).

# Phase 2 — Production graph and real media relationships

Introduce durable production relationships around the validated narrative/editorial model: ShotIntent, real Asset / MediaSegment identity, evidence-backed realization alternatives, provenance, and missing-coverage reasoning over real project data.

Build a dedicated Coverage representation only if the workflow demonstrates that a separate view adds value beyond timeline/other semantic overlays.

# Phase 3 — Reverse scripting with real media

Replace fixture-backed source data with real media-derived data using commodity tools where appropriate. Validate that real transcripts, source ranges, thumbnails/waveforms, and media metadata preserve the Narrative IR/source semantics already proven by fixtures.

# Phase 4 — Alternatives, review, and editorial comparison

Validate story-level and realization alternatives without duplicating the entire project unnecessarily. Preserve tried/rejected material, compare alternatives, review the playable assembly, and keep annotations tied to stable narrative/media identity rather than fragile timeline timecodes.

Introduce new version/editorial-plan domain types only if this phase demonstrates a concrete need.

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

Generation should occur in story context rather than through a parallel canonical AI project model.

# Conditional / later work

Introduce only when validated workflows require it: collaboration/sync, hosted review, richer screenplay interchange, Story Spine/mixed-media spatial exploration, continuity/world constraints, broader asset-management interoperability, and additional machine protocols.

# Current gate

Work only on **Spike 0E — Semantic Editorial Interaction Depth** until the timeline interaction question is answered.

Do not pull Phase 1 desktop/persistence, Production Graph, Story Spine canvas, real GenAI execution, Resolve integration, specialist finishing features, or a second agent protocol/runtime into 0E unless the smallest possible piece is necessary to answer the pass/fail question.
