# Salai Product Requirements Document

## Status

Living product requirements and success criteria. Current execution is tracked only in [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).

## Product goal

Salai lets filmmakers express story/production intent with low interaction overhead while maintaining a durable typed connection among narrative structure, source evidence, production needs, media, alternatives, and the active structural audiovisual edit.

> **Express intent naturally; Salai structures it for production and structural editorial. See, play, and reshape the same story through semantic creative surfaces.**

> **Hide structural bookkeeping, not narrative structure.**

## Validated foundation

### Narrative/project semantics

- One Narrative IR is canonical semantic narrative state.
- Stable identity survives ordinary edits/restructuring.
- Authored and source-backed material remain distinct.
- Structured views keep no independent narrative copies.
- Workspace-only organization remains separate from canonical narrative meaning.

### External-agent authoring

Spike 0C is complete/pass.

- An external harness can inspect and mutate the same live Salai project as the UI.
- Human validation using Codex demonstrated that the integration works correctly and materially reduces routine structural bookkeeping.
- Harness-requested mutations go through `SalaiProjectService`, `NarrativeOperation[]`, and `applyOperations()` before project state changes.
- Salai does not require harness conversation/session history to reconstruct the project.
- Salai does not embed model/provider authentication, model routing, chat runtime, or a provider SDK as a requirement of the product architecture.
- Failed grouped changes do not partially publish live state.
- The first validated machine interface remains CLI-oriented; add another protocol only when a concrete integration requires it.

See [`spike-0c-assessment.md`](spike-0c-assessment.md) and [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md).

## P0 — Spike 0D requirements

### Structural editorial

- Salai can represent the current story in actual time while retaining Section/Beat/Cue identity.
- Salai can play a deterministic rough audiovisual assembly without requiring Resolve.
- The creator can scrub/seek and understand the relationship between narrative structure and current media realization.
- Direct temporal structural edits must change Salai canonical state rather than a third-party engine-owned shadow timeline.
- The representative spike supports narrative reorder, Cue movement, and SourceExcerpt trimming through existing canonical operations.
- Missing/unsupported visual moments remain explicit rather than being replaced with invented media.

### Timeline/playback state ownership

- Narrative IR remains canonical semantic state.
- Timeline viewport/selection/focus remain UI/Workspace state as appropriate.
- Timeline-editor documents and Elah projects are derived materialization/projection state only.
- Third-party timeline/rendering serialization is not Salai project persistence.
- Engine-specific edits that cannot map safely to Salai semantics must be rejected/disabled rather than silently diverging.

### Timeline implementation

- Use `@moritzbrantner/timeline-editor` as the first controlled React timeline interaction layer for 0D.
- Use `@elah/core` as the first playback/materialization adapter for 0D.
- Keep both behind Salai-owned adapters so either can be replaced without project migration.
- Do not add a direct Mediabunny dependency unless Elah fails to expose a required spike capability.

### Agent ↔ temporal UI continuity

- External-agent changes appear on the semantic timeline through canonical state only.
- A direct semantic-timeline edit is visible to the next machine context read.
- No second agent/project/editing model is introduced for temporal work.
- Existing grouped-action/revert semantics remain available where one temporal user action produces grouped canonical operations.

### Source evidence

- SourceExcerpt wording/ranges remain source evidence through playback and temporal editing.
- Raw camera/media originals remain local by default.
- The machine interface returns task-relevant project/source/timing context rather than implicitly exposing arbitrary local files.

### Product/editorial boundary

- Salai owns structural editorial needed to construct, play, judge, and revise the story.
- Specialist NLE capabilities such as advanced precision trim, multicam, compositing, color, full audio post, mastering, and delivery are non-goals for the structural-editorial surface.
- DaVinci Resolve and other NLEs are optional downstream targets, not required runtime dependencies.

See [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md).

## P1 — after 0D passes

- local desktop runtime and persistent project/media access;
- durable Narrative IR/Workspace/structural-editorial persistence;
- local media lifecycle sufficient for validated workflows;
- production graph with ShotIntent, Asset, MediaSegment, and evidence-backed realization/provenance relationships;
- real missing-coverage reasoning and a Coverage representation if validated;
- reverse scripting from real media/transcripts;
- alternatives/versioning/review tied to stable narrative/media identity;
- downstream interchange/materialization to specialist NLEs;
- generated media as ordinary project assets with provenance.

## Non-goals

Salai is not initially:

- a full professional finishing NLE;
- a screenplay-formatting competitor;
- a cloud MAM;
- a generic chatbot that maps language directly to timeline-engine commands;
- an unattended autonomous editing agent;
- a standalone GenAI video generator;
- a full VFX/color/audio-finishing/delivery environment;
- a graph database or generic node/canvas editor;
- a rich-text document used as canonical project storage;
- a system that hides all narrative structure behind opaque AI output;
- a project whose truth is stored in a third-party timeline/rendering engine format.

## Spike 0D success criteria

### Semantic value in time

- Section/Beat/Cue timing is legible on a real temporal surface;
- semantic zoom reveals deeper audiovisual structure without losing stable Salai identity;
- the user can identify a story/timing or realization problem by watching the Salai assembly;
- human evidence shows that semantic structure changes the usefulness of the timeline rather than merely decorating a conventional clip editor.

### Structural editorial

- the fixture can be played and scrubbed without Resolve;
- direct Beat/Cue ordering changes resolve through Salai operations;
- SourceExcerpt trimming preserves source identity/ranges;
- playback immediately reflects canonical changes.

### State safety

- third-party timeline/rendering state is derived and replaceable;
- failed/unsupported temporal changes do not publish divergent canonical state;
- agent and direct temporal edits share one live project.

### Scope discipline

- no specialist-NLE feature set is required to pass the spike;
- no second agent runtime/protocol is introduced without evidence;
- no full production graph or canvas system is added solely to make the demo look complete.

## Current milestone

**Spike 0D — Semantic Editorial Environment.**

See [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md), [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md), and [`spike-0c-assessment.md`](spike-0c-assessment.md).
