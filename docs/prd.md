# Salai Product Requirements Document

## Status

Living product requirements and success criteria.

This document owns **what the product must accomplish**, not detailed implementation tasks. Current execution is tracked in [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).

## Product goal

Salai should let filmmakers express story/production intent with low interaction overhead while maintaining a durable, typed connection among narrative structure, source evidence, production needs, media, alternatives, and downstream Resolve materialization.

Current interaction hypothesis:

> **Express intent naturally; Salai structures it for production. See and reshape that structure through narrative lenses.**

Core rule:

> **Hide structural bookkeeping, not narrative structure.**

## P0 requirements — current validation milestone

### Canonical project

- One Narrative IR remains the canonical semantic narrative state.
- Structured surfaces must not keep independent narrative copies.
- Workspace-only organization remains separate from canonical narrative meaning.
- Stable identity survives ordinary edits/restructuring.
- Authored and source-backed material remain distinct.

### Low-friction authoring

- A creator can enter rough prose/notes without classifying every line as Section/Scene/Beat/Cue.
- A creator can express an ordinary story revision in natural language rather than manually performing several structural UI actions.
- A creator can provide mocked/fixture-backed media/source context without manually wiring every canonical relationship first.
- Conversation/working text are context and interaction surfaces, not canonical story storage.

### Agent normalization

- Agent output must resolve to the public canonical operation boundary before project state changes.
- Existing `NarrativeOperation[]` / `applyOperations()` should be reused wherever sufficient.
- Higher-level Salai agent commands may exist only for concrete cases where Salai must resolve IDs, relative placement, or similar mechanics the model should not manufacture.
- Failed grouped changes must not partially publish live state.
- SourceExcerpt semantics must remain strict through agent-mediated changes.

### Grouped trust / recovery

- One user intention may produce several canonical operations but should appear as one understandable action.
- The last successful agent-applied action must be revertible during 0C.
- Clarification should be reserved for material creative ambiguity, not ordinary domain bookkeeping.
- External/destructive effects require a later explicit boundary and are not part of 0C execution.

### Narrative Lenses

- Existing structured surfaces remain available as synchronized Narrative Lenses.
- Direct editing remains first-class when the creator deliberately chooses that representation.
- Lenses expose useful structure without requiring incidental low-level mechanics.
- Direct lens edits and agent changes must share one canonical state.
- A direct lens edit must be visible to subsequent agent reasoning through current canonical/Workspace state.

Detailed lens semantics are canonical in [`narrative-lenses.md`](narrative-lenses.md).

### Local-first / provider boundary

- Raw camera/media originals remain local by default.
- Attachment handles do not imply permission to upload underlying files.
- Hosted inference receives only task-relevant selected/derived project context unless broader egress is explicitly chosen.
- Provider choice must not change canonical Narrative IR/source/provenance semantics.

### Resolve boundary

- Resolve remains the downstream NLE/finishing environment.
- Natural-language instructions and lens edits change canonical Salai state first.
- Resolve materialization happens through an explicit Salai adapter boundary rather than direct chat-to-Resolve mutation.

## P1 requirements — after 0C passes

- local desktop runtime and persistent local project access;
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
- a graph database exposed to users;
- a generic node/canvas editor;
- a rich-text document used as the canonical project database;
- a system that hides all narrative structure behind opaque AI output.

## Spike 0C success criteria

0C should demonstrate all of the following:

### Interaction compression

- one rough script-first story can be created without manual Beat/Cue construction;
- one ordinary revision can be expressed as one natural instruction;
- one source-backed task can be completed without manual relationship wiring;
- representative routine tasks require materially fewer explicit user actions than 0B;
- user attention tracks creative decisions more than software mechanics.

### Canonical safety / trust

- agent output resolves through typed canonical operations;
- grouped multi-operation changes publish atomically at the controller boundary;
- failed batches leave live state unchanged;
- source identity/ranges survive;
- one successful agent action can be understood and reverted.

### Structural insight

- existing Narrative Lenses reflect agent changes automatically;
- at least one lens is opened voluntarily because it reveals or manipulates something useful about the story;
- direct manipulation in that lens remains creatively meaningful rather than administrative;
- a subsequent agent request sees the result of that direct edit through shared state.

The combined agent + lens workflow should preserve user agency better than either a form-heavy UI or blind chat alone.

## Current milestone

**Spike 0C — Agent-Mediated Authoring + Narrative Lenses.**

0A validated Narrative IR. 0B validated synchronized-view architecture and exposed routine interaction friction. 0C now tests the smallest agent-mediated vertical slices plus continuity with the existing lenses.

See:

- [`agent-mediated-authoring.md`](agent-mediated-authoring.md);
- [`narrative-lenses.md`](narrative-lenses.md);
- [`mvp.md`](mvp.md);
- [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).