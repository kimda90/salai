# Salai Product Requirements Document

## Status

Living product requirements and success criteria. Current execution is tracked only in [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).

## Product goal

Salai lets filmmakers express story/production intent with low interaction overhead while maintaining a durable typed connection among narrative structure, source evidence, production needs, media, alternatives, and downstream Resolve materialization.

> **Express intent naturally; Salai structures it for production. See and reshape that structure through narrative lenses.**

> **Hide structural bookkeeping, not narrative structure.**

## P0 — Spike 0C requirements

### Canonical project

- One Narrative IR is canonical semantic narrative state.
- Structured surfaces keep no independent narrative copies.
- Workspace-only organization remains separate from canonical narrative meaning.
- Stable identity survives ordinary edits/restructuring.
- Authored and source-backed material remain distinct.

### External-agent authoring

- A creator can express rough prose and ordinary revisions in an existing agent harness without manually managing every Section/Scene/Beat/Cue operation.
- The harness can inspect task-relevant current Salai state through one machine interface.
- Harness-requested mutations go through `SalaiProjectService`, `NarrativeOperation[]`, and `applyOperations()` before project state changes.
- Salai does not require harness conversation/session history to reconstruct the project.
- Salai does not embed model/provider authentication, model routing, chat runtime, or a provider SDK for 0C.
- A higher-level Salai command may exist only for a concrete case where Salai must resolve IDs/references/placement the harness should not manufacture.
- Failed grouped changes do not partially publish live state.

### Shared live state

- The external harness and Narrative Lenses operate on the same live Salai project.
- A machine change appears in existing lenses through canonical state, not per-lens synchronization.
- A direct lens edit is visible to the next machine context read.
- The local bridge needed by the current browser prototype must not own another project model or persistence path.

### Grouped trust / recovery

- One user intention may produce several canonical operations but appears as one understandable action.
- The current machine-applied action is immediately revertible while no later canonical or Workspace edit has occurred.
- Any later machine or direct edit invalidates that snapshot-based revert.
- External/destructive effects are outside 0C.

### Source evidence

- SourceExcerpt wording/ranges remain source evidence through machine-mediated changes.
- Raw camera/media originals remain local by default.
- The machine interface returns task-relevant project/source context rather than implicitly exposing arbitrary local files.
- Attachment/reference identity does not imply file-upload permission.

### Narrative Lenses

- Existing structured surfaces remain synchronized Narrative Lenses.
- Direct editing remains first-class when the creator deliberately chooses that representation.
- Lenses expose useful structure without requiring incidental low-level mechanics.

Detailed lens semantics: [`narrative-lenses.md`](narrative-lenses.md).

### Resolve

- Resolve remains the downstream NLE/finishing environment.
- Harness instructions and lens edits change canonical Salai state first.
- Resolve materialization uses an explicit Salai adapter boundary rather than direct conversation-to-Resolve mutation.

## P1 — after 0C passes

- local desktop runtime and persistent project access;
- durable Narrative IR/Workspace/action persistence;
- production graph with ShotIntent, Asset, MediaSegment, realization/provenance relationships;
- Coverage Lens over real production data if validated;
- Resolve handoff through reusable automation infrastructure;
- reverse scripting from real media/transcripts;
- alternative story/source versions;
- generated media as ordinary project assets with provenance.

## Non-goals

Salai is not initially:

- a replacement NLE;
- a screenplay-formatting competitor;
- a cloud MAM;
- a generic chatbot that maps language directly to Resolve commands;
- an unattended autonomous editing agent;
- a standalone GenAI video generator;
- a full VFX/color/audio/delivery environment;
- a graph database or generic node/canvas editor;
- a rich-text document used as canonical project storage;
- a system that hides all narrative structure behind opaque AI output.

## Spike 0C success criteria

### Interaction compression

- one rough script-first story is created without manual Beat/Cue construction;
- one ordinary revision is expressed as one natural instruction in the harness;
- one source-backed task is completed without manual relationship wiring;
- routine tasks require materially fewer explicit user actions than 0B.

### Canonical safety / trust

- machine mutations resolve through typed canonical operations;
- grouped changes publish atomically;
- failed batches leave live state unchanged;
- source identity/ranges survive;
- one current machine action can be immediately reverted without rolling back later edits.

### Structural insight

- existing lenses reflect machine changes automatically;
- at least one lens is opened voluntarily because it exposes/manipulates useful story structure;
- a subsequent harness request sees the direct lens edit through current Salai state.

## Current milestone

**Spike 0C — External-Agent Authoring + Narrative Lenses.**

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md), [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md), and [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).
