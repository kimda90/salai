# Salai MVP and Validation Roadmap

## Status

Living validation sequence.

This document owns **when** major product and technical risks are tested. It does not own implementation task numbering. The canonical active task tracker is [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).

Narrative semantics remain authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md). The current product/editorial boundary is [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md).

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

Human testing also found:

> **Using direct structured manipulation as the routine path requires too much interaction to be creatively useful.**

The architectural result remains valid; the four surfaces are evidence for multiple coherent views, not a commitment to the final top-level UI.

See [`spike-0b-assessment.md`](spike-0b-assessment.md).

## Spike 0C — External-Agent Authoring + Narrative Lenses

**Status: complete / pass.**

Human validation was completed using Codex as the external harness. The integration operated the live Salai project correctly and demonstrated the convenience of keeping an agent in the loop for routine structural manipulation.

Validated:

- external harness ↔ live `SalaiProjectService` boundary;
- one narrow CLI-oriented machine interface;
- agent changes through typed canonical operations;
- grouped apply/revert mechanics;
- source-backed semantics through the machine boundary;
- direct UI and machine interaction sharing one project;
- materially lower routine structural interaction than the 0B direct-authoring path;
- no need for Salai-owned provider auth, sessions, model routing, or general agent runtime.

See [`spike-0c-assessment.md`](spike-0c-assessment.md) and [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md).

## Spike 0D — Semantic Editorial Environment

**Status: current validation priority.**

ADR 0009 superseded the original Resolve-only editorial boundary. Salai now owns structural editorial; specialist NLEs are optional downstream precision/finishing targets.

### Validation question

Can the existing Salai semantic model drive a playable audiovisual assembly where narrative meaning, source evidence, and temporal/media structure remain connected enough to make direct and agent-mediated structural editing more useful than a conventional clip timeline?

### Minimum proof

0D must demonstrate:

- a semantic timeline derived from the canonical project;
- Section/Beat/Cue timing on an actual temporal surface;
- playable picture/audio rough assembly without Resolve;
- direct Beat/Cue reorder and SourceExcerpt trim through canonical operations;
- missing/unsupported material remaining explicit;
- agent-mediated timing/structure changes through the validated 0C machine boundary;
- one direct timeline edit visible to the next agent context read;
- human evidence that semantic structure helps identify or solve a story/timing problem.

### 0D implementation boundary

Use replaceable off-the-shelf infrastructure:

- `@moritzbrantner/timeline-editor` for the first controlled React timeline interaction;
- `@elah/core` for the first playback/materialization adapter.

Neither third-party document/project model is canonical Salai state.

### 0D exit gate

Proceed only if:

1. Narrative IR remains canonical;
2. timeline/rendering state is derived and replaceable;
3. the representative story can be played inside Salai without Resolve;
4. semantic timing visibly connects Beat/Cue meaning to source/media realization;
5. direct temporal edits resolve through Salai operations;
6. SourceExcerpt provenance survives temporal editing;
7. external-agent and direct temporal edits share one live project;
8. human evidence shows that the semantic layer changes the usefulness of the timeline rather than merely decorating a normal NLE UI;
9. no specialist-NLE feature set is required to make the spike pass.

The executable tasks and evidence live only in [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).

# Phase 1 — Local production application

Proceed only after 0D validates the structural-editorial interaction.

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

Work only on **Spike 0D — Semantic Editorial Environment** until its semantic-timeline/playback question is answered.

Do not pull a full production graph, Story Spine canvas, real GenAI execution, specialist NLE feature set, second agent protocol/runtime, or broad desktop infrastructure into 0D unless the smallest possible piece is necessary to answer its pass/fail question.
