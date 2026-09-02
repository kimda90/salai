# Salai Product Requirements Document

## Status

Living product requirements and success criteria. Current execution is tracked only in [`spike-0e-implementation-plan.md`](spike-0e-implementation-plan.md).

The proposed direct structural-editorial interaction contract is [`editorial-interaction.md`](editorial-interaction.md). Cross-cutting unresolved 0E questions belong only in [`rfcs/0003-semantic-editorial-interaction-model.md`](rfcs/0003-semantic-editorial-interaction-model.md) until accepted.

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
- Cue contains ordered visual/audio ContentBlocks and already supports multiple blocks in each lane.
- Canonical create/update/move/delete operations, `moveBlock`, `splitBeat`, `mergeBeats`, and `trimSourceExcerpt` are the mutation vocabulary before new editorial operations are considered.

### External-agent authoring

Spike 0C is complete/pass.

- An external harness can inspect and mutate the same live Salai project as the UI.
- Human validation using Codex demonstrated that the integration works correctly and materially reduces routine structural bookkeeping.
- Harness-requested mutations go through `SalaiProjectService`, `NarrativeOperation[]`, and `applyOperations()` before project state changes.
- Salai does not require harness conversation/session history to reconstruct the project.
- Salai does not embed model/provider authentication, model routing, chat runtime, or provider SDKs as a product requirement.
- Failed grouped changes do not partially publish live state.
- The first validated machine interface remains CLI-oriented; add another protocol only when a concrete integration requires it.

### Structural-editorial architecture

Spike 0D is closed/mixed.

Validated technically:

- Narrative IR can project into actual time without becoming subordinate to a timeline-engine document;
- Salai can play a rough picture/audio assembly without Resolve;
- Beat/Cue reorder and SourceExcerpt trim can round-trip through canonical operations;
- direct and external-agent temporal edits share one project;
- timeline and playback engines remain replaceable projections/adapters.

Not validated by 0D human testing:

- enough direct editing depth to judge/improve the story inside Salai;
- a meaningful semantic advantage over generic clip-timeline thinking.

0D therefore does not justify moving to production infrastructure yet.

## P0 — Spike 0E requirements

### One context-preserving temporal hierarchy

- The creator can see Section → Beat → Cue → visual/audio/source/missing detail on one shared time axis.
- Parent/child containment remains legible.
- Expanding/collapsing semantic detail does not replace the surrounding temporal context.
- Horizontal viewport zoom and semantic expand/collapse are separate interaction states.
- Selection/focus never changes canonical order.
- Mechanical Story / Moments / Media level switching must not be required to reach ordinary nested editing.

### Canonical timing boundary

For 0E, current Narrative IR timing remains authoritative:

- Cue is the canonical narrative-time interval;
- Beat/Scene/Section/Script duration is derived from descendant Cue duration/order;
- a Cue uses `explicitDurationMs` when present, otherwise the current runtime estimator;
- ordinary ContentBlocks do not gain hidden independent narrative offsets/durations;
- SourceExcerpt keeps its source in/out evidence range;
- order/duration changes ripple later derived start times;
- arbitrary absolute clip placement, overwrite editing, and implicit timeline gaps are not P0 requirements.

If human evidence shows independent within-Cue media placement is required, revise the domain explicitly rather than persisting engine-only state.

### Selection and inspector

- Every visible canonical Section, Scene, Beat, Cue, and ContentBlock can be selected.
- Selection drives one contextual inspector.
- Inspector controls expose semantic properties owned by the selected type, not third-party engine fields.
- SourceExcerpt inspector exposes source identity and source in/out.
- Cue inspector exposes explicit/derived duration plus all contained visual/audio blocks.
- Beat inspector exposes title/summary, Cue structure, and valid split/merge/create-child actions.
- Multi-selection supports additive/range selection and only enables grouped mutations with unambiguous shared meaning.
- One grouped edit publishes one atomic canonical operation batch.

### Creation in time

- The creator can create a Section, Beat, Cue, and type-appropriate ContentBlock from the temporal environment.
- Creation resolves to a valid canonical parent and insertion order before commit.
- Playhead/pixel position may suggest placement but must not silently create destructive hierarchy/reparenting.
- The agent remains available for requests whose structure is easier to express naturally than manually.

### Multiple material per Cue

- Every `visualBlockId` and `audioBlockId` in a Cue is visible/editable, not only one representative block.
- Multiple visual/audio blocks may coexist in one Cue.
- Existing lane ordering is preserved through `moveBlock`.
- 0E does not invent independent within-Cue block timing unless RFC 0003 is explicitly resolved from evidence.

### Minimum direct editing grammar

P0 requires a fair structural-editorial test, not a specialist NLE.

- Space toggles play/pause except during text editing or when a focused control consumes Space.
- Seek/scrub shares one viewer playhead.
- Section/Beat/Cue/ContentBlock reorder/reparent maps to the existing `move*` operations where valid.
- Cue duration edit maps to `updateCue` explicit duration.
- SourceExcerpt edge trim/source I/O maps to `trimSourceExcerpt`.
- Beat split at a Cue boundary maps to `splitBeat`.
- Beat merge maps to `mergeBeats`.
- Delete maps to canonical delete operations.
- Unsupported timeline-engine gestures are disabled/reverted rather than published as shadow state.
- Cue split, SourceExcerpt split, and generic ContentBlock razor behavior are not P0 until RFC 0003 resolves their semantics.

### Empty/missing states

- A Cue with no audio may intentionally play silence.
- A Cue with no visual content shows absence instead of invented media.
- Known unsupported visual realization remains explicit as missing.
- A generic free-positioned timeline gap is not 0E canonical state.
- Intentional black versus missing realization remains a scoped RFC question, not a silently invented field.

### Timeline/playback state ownership

- Narrative IR remains canonical semantic state.
- Timeline viewport, selection, playhead, and hierarchy expansion/collapse remain non-canonical UI/Workspace state as appropriate.
- Timeline-editor documents and Elah projects remain derived materialization/projection state only.
- Third-party timeline/rendering serialization is not Salai project persistence.

### Agent ↔ temporal UI continuity

- External-agent changes appear through canonical state only.
- Direct timeline edits are visible to the next machine context read.
- No second agent/project/editing model is introduced for temporal work.
- Existing grouped-action/revert semantics remain available where one temporal action produces grouped canonical operations.

### Product/editorial boundary

- Salai owns structural editorial needed to construct, play, judge, and revise the story.
- Specialist-NLE capabilities such as advanced precision trim, multicam, compositing, color, full audio post, mastering, and delivery remain non-goals.
- DaVinci Resolve and other NLEs are optional downstream targets, not runtime dependencies.

## P1 — after 0E passes

- local desktop runtime and persistent project/media access;
- durable Narrative IR/Workspace/validated structural-editorial persistence;
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
- a generic chatbot mapping language directly to timeline-engine commands;
- an unattended autonomous editing agent;
- a standalone GenAI video generator;
- a full VFX/color/audio-finishing/delivery environment;
- a graph database or generic node/canvas editor;
- a rich-text document used as canonical project storage;
- a system that hides all narrative structure behind opaque AI output;
- a project whose truth is stored in a third-party timeline/rendering engine format.

## Spike 0E success criteria

### Semantic value in time

- nested semantic structure remains visible without mechanical level switching;
- the creator can navigate from whole story to nested Cue/material detail without losing temporal context;
- the hierarchy changes at least one real structural/editorial decision compared with generic clip thinking.

### Editing depth

- selected items expose useful type-appropriate editing;
- Beats/Cues/visual/audio material can be created in temporal context;
- multiple visual/audio blocks per Cue work naturally;
- multi-selection enables at least one useful grouped canonical edit;
- transport, reorder, Cue duration, SourceExcerpt source I/O, and Beat split/merge provide enough direct grammar to make the comparison meaningful.

### State safety

- every committed edit resolves through canonical operation(s);
- third-party state stays derived/replaceable;
- unsupported engine changes do not publish divergent state;
- agent and direct temporal edits share one live project.

### Human gate

- the representative rough story can be judged and improved without Resolve for the tested structural task;
- at least one creative decision is materially helped by semantic hierarchy rather than merely decorated by labels.

If those human conditions still fail after 0E reaches the interaction contract, reassess ADR 0009's direct-editor product boundary instead of automatically adding more NLE surface area.

## Current milestone

**Spike 0E — Semantic Editorial Interaction Depth, shaping before implementation.**

Read [`rfcs/0003-semantic-editorial-interaction-model.md`](rfcs/0003-semantic-editorial-interaction-model.md), [`editorial-interaction.md`](editorial-interaction.md), [`spike-0e-implementation-plan.md`](spike-0e-implementation-plan.md), and [`spike-0d-assessment.md`](spike-0d-assessment.md) before building.
