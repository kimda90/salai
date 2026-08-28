# Salai System Architecture

## Status

Living System Architecture Document (SAD).

This document owns system-level boundaries, runtime topology, component responsibilities, persistence ownership, and integration direction. It does **not** own Narrative IR field semantics or the canonical operation vocabulary; those are authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md).

Current interaction contracts are [`agent-mediated-authoring.md`](agent-mediated-authoring.md) and [`narrative-lenses.md`](narrative-lenses.md).

## Architectural thesis

Salai owns narrative and production context around a video while reusing mature infrastructure for model inference, UI mechanics, media processing, generation, interchange, and Resolve automation.

The core shape is:

```text
creative input
text / instructions / attachment handles
          ↓
Agent / normalization adapter
          ↓
NarrativeOperation[]
(or the minimum scenario-specific command adapter)
          ↓
@salai/script-model
          ↓
canonical Narrative IR
      ↙       ↓       ↘
Projections  Workspaces  production context
      ↘       ↓       ↙
       Narrative Lenses
              ↓
editorial materialization
              ↓
DaVinci Resolve
```

The user should not need to manipulate every layer directly.

Core interaction rule:

> **Hide structural bookkeeping, not narrative structure.**

# Ownership

## Salai owns

- Narrative IR and stable narrative identity;
- authored vs source-backed semantics;
- canonical operation semantics;
- agent interpretation/normalization policy;
- any minimal agent-facing command adapters proven necessary by real scenarios;
- grouped action/revert semantics;
- Narrative Lens semantics and Projection/Workspace ownership;
- ShotIntent and narrative/media relationships when the production graph is introduced;
- source-evidence rules;
- alternatives/version behavior when justified;
- narrative-to-editorial materialization decisions;
- generated/captured asset provenance;
- the Resolve adapter boundary.

## Commodity infrastructure may provide

- UI primitives, dragging, tables, docking, virtualization;
- model inference / structured output;
- media probing/transcoding/thumbnail/waveform extraction;
- transcription/alignment/scene detection;
- editorial interchange;
- Resolve automation plumbing;
- local model execution;
- generation execution.

A model provider, agent framework, editor framework, or Resolve automation library must not own Salai's canonical project semantics.

# Canonical state layers

## 1. Narrative IR

Canonical semantic narrative state:

```text
Script
  Section
    Scene?
      Beat
        Cue
          ContentBlock
```

It owns stable identity, hierarchy/order, authored/source-backed content, runtime inputs, and explicit relationships defined by the current spec.

The accepted architectural decision that multiple views share one Narrative IR is recorded in [`adr/0005-one-narrative-ir-multiple-views.md`](adr/0005-one-narrative-ir-multiple-views.md).

## 2. Projection

A Projection is deterministically derived from canonical state and owns no independent narrative truth.

Existing examples include Outline, AV Script, and Paper/Radio Edit.

Editing a Projection produces canonical operations.

## 3. Workspace

A Workspace stores meaningful human organization that is not inherent to the narrative itself.

Validated example:

- Story Wall x/y placement and parking state around canonical Scene/Beat references.

Workspace metadata must not silently redefine canonical narrative order or meaning.

## 4. Narrative Lens

Narrative Lens describes a **creative role**, not a separate persistence layer.

A lens may be implemented by a Projection, Workspace, or combination. Its detailed product/UX contract lives in [`narrative-lenses.md`](narrative-lenses.md).

## 5. Production context

The future production graph owns objects/relationships such as:

- ShotIntent;
- Asset;
- MediaSegment;
- realizations/alternatives;
- provenance;
- Resolve bindings.

Do not pull the full production graph into Spike 0C merely to answer mocked missing-coverage questions.

# Agent / normalization boundary

The agent maps low-structure user input into explicit canonical changes.

Inputs may include:

- working text;
- project-aware instructions/questions;
- task-relevant canonical state;
- attachment handles/derived metadata;
- active Narrative Lens identity when materially useful.

## Reuse the existing operation API

`@salai/script-model` already exposes:

- `applyOperation()`;
- `applyOperations()`.

`applyOperations()` is the default model-level primitive for one agent request that resolves to several canonical operations. The application controller should publish only after that full call succeeds.

Do **not** add a second persistent batch engine or agent-specific domain model.

## Higher-level agent commands are conditional

Start with public `NarrativeOperation[]` where existing stable IDs make that practical.

Introduce a higher-level Salai command only for a concrete scenario that requires Salai-owned resolution, such as:

- new-ID allocation;
- relative placement;
- user-facing reference resolution;
- avoiding raw `ParentRef` or array-index manufacture by the model.

Any such command compiles immediately to public canonical operations and remains a transient adapter.

# Grouped action / history boundary

For Spike 0C:

```text
one user request
      ↓
NarrativeOperation[]
      ↓
applyOperations()
      ↓
one controller publish
```

Keep the pre-action project/Workspace snapshots and allow one-step revert of the last successful agent action.

Do not introduce event sourcing, general inverse-operation generation, or a universal undo architecture until a later phase demonstrates the need.

# Local-first and provider data egress

Salai is local-first. A hosted model provider does not receive implicit access to local production media or the entire project.

Rules:

- raw camera/media originals remain local by default;
- an attachment handle is a local/project reference, not authorization to upload the underlying file;
- hosted inference receives only the text, derived metadata, thumbnails/transcript excerpts, or project subset explicitly required for the current request;
- sending raw media or materially broader project context to a hosted provider requires an explicit product/user boundary;
- local providers may process local files without cloud egress, but context should still be task-relevant rather than indiscriminate;
- provider choice must not change Narrative IR, source, operation, or provenance semantics.

This is an architecture boundary, not a requirement to build a full privacy subsystem in 0C.

# Runtime topology

The accepted broader runtime direction remains local-first desktop.

```text
Electron / React renderer
      ↕ narrow preload / local API
local application/service processes
      ↕
filesystem · media tools · model providers · Resolve
```

See [`adr/0002-local-first-desktop-runtime.md`](adr/0002-local-first-desktop-runtime.md).

Spike 0C remains browser/dev-prototype scale and should not pull Electron/FastAPI/persistence forward.

# Persistence boundary

Validated state today:

- Narrative IR serialization exists;
- minimum Story Wall Workspace semantics are validated in memory;
- 0C agent/grouped-action behavior is intentionally in-memory.

Durable persistence comes after 0C and should include only state whose product role is validated:

- Narrative IR;
- production graph when introduced;
- justified Workspace state;
- Resolve bindings/annotations;
- action/history metadata required for recovery/audit;
- a durable WorkingDocument/session artifact only if evidence proves it is real product state.

Narrative Lenses should derive from canonical/Workspace state rather than storing duplicate narratives.

SQLite remains the default local persistence direction unless measured requirements justify otherwise.

# Resolve boundary

DaVinci Resolve remains the editing/finishing environment.

```text
Salai canonical state
       ↓
materialization decision
       ↓
Salai Resolve adapter
       ↓
CutMaster by default
       ↓
DaVinci Resolve
```

The agent must not turn conversation directly into arbitrary Resolve mutations.

See [`adr/0001-resolve-remains-the-nle.md`](adr/0001-resolve-remains-the-nle.md) and [`adr/0004-cutmaster-default-resolve-boundary.md`](adr/0004-cutmaster-default-resolve-boundary.md).

# Integration direction

## OpenTimelineIO

Use where useful for editorial interchange/materialization. It does not replace Narrative IR or carry all Workspace/agent/lens semantics.

## OpenAssetIO

Conditional. Add only when external asset resolution/publishing creates a concrete validated need.

## FFmpeg / ffprobe

Commodity local media utilities for probing, extraction, proxy/transcode work, and similar operations.

## Transcription / reverse scripting

Prefer established components such as faster-whisper, WhisperX when alignment/diarization is required, and PySceneDetect for initial segmentation experiments. Convert their output into Salai-owned MediaSegment/SourceExcerpt semantics.

0C uses fixture/mock metadata instead of this real-media stack.

## Generation

ComfyUI or hosted generation providers remain process/API boundaries. Generated output becomes an ordinary production asset with provenance rather than creating a parallel GenAI workflow model.

# Technology baseline

## Spike 0A

- TypeScript;
- Vitest;
- `packages/script-model/`.

## Spike 0B retained foundation

- React;
- TypeScript;
- Vite;
- Pragmatic Drag and Drop;
- deterministic Vitest coverage;
- GitHub Pages prototype.

## Spike 0C minimum addition

- simple text/instruction/attachment UI;
- one mockable model-provider adapter;
- controller batch dispatch using `applyOperations()`;
- in-memory last-action revert;
- existing Narrative Lenses.

No general agent framework is assumed.

# Architecture questions for Spike 0C

Only questions that can change the near-term architecture belong here:

- Can public `NarrativeOperation[]` cover most agent revision scenarios directly?
- Which concrete creation/reference cases, if any, justify a higher-level command adapter?
- What constitutes one understandable reversible agent action?
- Does working text need durable identity after human testing?
- What attachment-derived context is sufficient before real media analysis?
- Does active-lens identity materially improve interpretation without dragging UI state into the agent contract?
- Does messy agent-mediated input expose a real Narrative IR semantic gap?

Narrative IR questions belong in [`narrative-ir-spec.md`](narrative-ir-spec.md). Interaction behavior belongs in [`agent-mediated-authoring.md`](agent-mediated-authoring.md) and [`narrative-lenses.md`](narrative-lenses.md).