# Salai MVP and Validation Roadmap

## Status

Living implementation/validation sequence.

This document owns **when** product/technical risks are tested. It does not own the Narrative IR operation list or field-level semantics; those are authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md). Spike 0B implementation details are authoritative in [`authoring-ux-spec.md`](authoring-ux-spec.md).

## MVP goal

Validate Salai's narrative/production model before investing heavily in Resolve, GenAI, or broad application infrastructure.

The MVP should ultimately prove:

1. one semantic narrative model can represent script-first and footage-first work;
2. narrative meaning and audiovisual timing can remain distinct without becoming cumbersome;
3. narrative objects can retain stable links to source evidence and production intent through restructuring;
4. familiar editorial workflows can manipulate the same underlying model without document drift;
5. Resolve can consume downstream choices without Salai becoming an NLE;
6. captured and generated media can participate in the same production flow.

# Phase 0 — Narrative and authoring foundation

## Spike 0A — Narrative IR

**Status: complete / pass.**

The pure TypeScript Narrative IR is implemented in `packages/script-model/` and satisfies the current fixture/operation/serialization/runtime acceptance criteria.

See:

- [`narrative-ir-spec.md`](narrative-ir-spec.md) — implemented baseline contract;
- [`spike-0a-assessment.md`](spike-0a-assessment.md) — result, evidence, resolved open questions, and remaining pressure points.

The implementation demonstrated one model across product, interview/corporate, and footage-first documentary fixtures without a workflow-specific schema or generic mutation escape hatch.

## Spike 0B — Familiar authoring UX

**Current validation priority.**

Test whether people can comfortably author/restructure the validated model through familiar workflows.

See [`authoring-ux-spec.md`](authoring-ux-spec.md) for the implementation contract.

### Minimum surfaces

1. **Story Wall** — Beat/Scene cards, spatial organization, parking-lot material, loose IdeaCards.
2. **Outline** — hierarchical structure.
3. **AV Script** — Beat/Cue visual/audio authoring.
4. **Paper/Radio Edit** — SourceExcerpt-driven construction.

Teleprompter remains a simple projection.

### Implementation sequence

#### 0B.0 — React prototype shell

- create the smallest React/TypeScript/Vite prototype package;
- integrate `@salai/script-model` as the only canonical narrative model;
- establish shared selection/navigation and one narrative-operation dispatch boundary;
- load existing deterministic fixtures into UI development/test surfaces.

#### 0B.1 — Minimum Workspace model

Define the minimum in-memory:

```text
Workspace
Board
BoardItem
IdeaCard
```

Store only human organizational metadata proven necessary by the spike. Do not persist it yet.

#### 0B.2 — Outline

- render Sections / optional Scenes / direct Beats;
- test the mixed Scene/direct-Beat hierarchy in real UI;
- support quick text editing where the IR permits it;
- route structural reorder/move through Narrative operations;
- expose approximate runtime.

#### 0B.3 — Story Wall

- render Beat/Scene cards spatially;
- support loose IdeaCards;
- support parking-lot/alternate placement;
- distinguish free spatial movement from intentional narrative reorder;
- support promotion of IdeaCards into canonical narrative objects.

#### 0B.4 — AV Script

- present Beat/Cue structure as visual/audio planning;
- support multiple Cues per Beat;
- keep authored and sourced content semantically distinct;
- expose runtime feedback.

#### 0B.5 — Paper / Radio Edit

- present SourceExcerpts with source identity/range intact;
- distinguish sourced recorded speech from authored bridges/VO;
- support source-driven story ordering/attachment;
- test the audio-first path into the same Cue/Beat structure.

#### 0B.6 — Cross-surface workflow test

Exercise at least one representative project continuously through:

```text
Story Wall
   ↓
Outline
   ↓
AV Script
   ↓
Paper / Radio Edit
   ↓
Story Wall
```

Verify:

- stable Beat/Cue/source identity;
- edits propagate between surfaces without export/import;
- Workspace organization survives surface changes in memory;
- Workspace changes do not mutate Narrative IR unless explicitly intended;
- SourceExcerpt remains source-backed;
- authored and sourced material remain visually distinguishable;
- parking/removal/deletion remain separate concepts;
- runtime feedback remains consistent.

#### 0B.7 — Assessment

Record:

- which Workspace fields were actually necessary;
- whether mixed Scene/direct-Beat hierarchy remains usable;
- which surfaces should expose the term `Cue`;
- which gestures users understand as spatial vs structural;
- any genuine Narrative IR failures exposed by the UX.

Revise the Narrative IR only when the UX supplies evidence of a semantic failure rather than compensating with workflow-specific state.

### Editor / UI framework decision

Use ordinary React/DOM controls with composable interaction infrastructure for 0B. Do not make a generic infinite canvas, graph editor, or rich-text framework canonical story storage.

### Exit criterion

Users can recognize and move between Story Wall, Outline, AV Script, and Paper/Radio Edit without export/import, duplicate story documents, or exposure to graph/database terminology.

## Spike 0C — Assisted authoring

### Question

Can an LLM propose useful narrative restructuring without bypassing stable identity, source evidence, or relationship rules?

### Flow

```text
Narrative IR
    ↓
structured model call proposes NarrativeOperation[]
    ↓
validate/apply to preview state
    ↓
show structural/runtime/relationship diff
    ↓
review / apply / reject
```

### Implementation constraint

Do **not** introduce a general agent framework for the first 0C implementation. Begin with structured output/tool calling that produces explicit Narrative operations through the same domain boundary used by human editing.

The model provider may be local or hosted; provider choice must not change proposal/review semantics.

### Exit criterion

AI changes behave like reviewable transactions using the same operation semantics as human edits.

# Phase 1 — Minimal desktop/local-service shell

Package the validated prototype as real local software.

## Electron

- launch/manage the local service;
- host React UI;
- open/retain real project folders;
- filesystem/OS bridge through narrow secure IPC;
- `contextIsolation: true`;
- `nodeIntegration: false`.

Preferred tooling direction:

- `electron-vite` for the Electron/Vite development and build boundary;
- `electron-builder` for packaging/distribution unless implementation evidence justifies another tool.

## Local service

- Python 3.11 or 3.12 / FastAPI;
- initial project API;
- filesystem/media services;
- prepare for SQLite/integrations.

Narrative IR remains a versioned explicit contract rather than being redefined by Python persistence models.

# Phase 2 — Durable project / production graph foundation

Introduce local persistence after 0A/0B reveal the required semantics.

Persist:

### Narrative

- Project;
- validated Narrative IR;
- version/schema metadata.

### Production graph

- ShotIntent;
- Asset;
- MediaSegment;
- Relationship;
- Annotation as needed;
- ResolveBinding as integration begins.

### Workspace layer

- Workspace;
- Board;
- BoardItem;
- IdeaCard;
- validated layout/grouping metadata from Spike 0B.

Use SQLite unless implementation evidence justifies another local persistence mechanism. Do not introduce a graph database.

### Required flow

1. Persist/reopen validated Narrative IR.
2. Persist/reopen Story Wall/Paper Edit workspace layout without changing canonical narrative semantics.
3. Link narrative objects to ShotIntents and mocked Assets/MediaSegments.
4. Restructure narrative content and inspect relationship/workspace behavior.
5. Query basic coverage/state from the persisted project.

`GenerationJob`, `Deliverable`, and any specialized `PaperEdit` domain object are introduced by later phases that actually require them rather than being mandatory Phase 2 schema.

# Phase 3 — CutMaster / Resolve vertical slice

Prove:

```text
Salai → Salai Resolve adapter → CutMaster → DaVinci Resolve Studio
```

CutMaster is the default Resolve automation boundary; direct Resolve scripting is reserved for capabilities not adequately exposed through CutMaster. See [`adr/0004-cutmaster-default-resolve-boundary.md`](adr/0004-cutmaster-default-resolve-boundary.md).

Required experiments:

- read current Resolve project/timeline context;
- identify Media Pool/timeline items;
- import media;
- map timeline items to source items;
- write/read useful metadata/custom data;
- add/read markers;
- create/modify timelines from explicit source ranges;
- expose alternate realizations/takes where useful;
- inspect identity behavior across restart/duplication/export-import;
- determine event/polling strategy;
- document any required direct-Resolve exceptions.

Resolve integration should follow Salai's narrative/production semantics rather than define them.

# Phase 4 — Reverse scripting with real media

Replace mocked source evidence with real media-derived data before adding external asset-management infrastructure.

```text
local media
   ↓
transcript / lightweight visual description / metadata
   ↓
MediaSegments
   ↓
SourceExcerpts / selected evidence
   ↓
Beats / Cues
```

Initial reusable infrastructure may include:

- FFmpeg/ffprobe for media probing/extraction;
- faster-whisper for local transcription;
- WhisperX when alignment/diarization is required;
- PySceneDetect for initial segmentation;
- SQLite FTS5 for transcript retrieval;
- sqlite-vec only if semantic retrieval proves useful.

Success means the same Narrative IR semantics hold with real evidence and real local assets using Salai-owned stable asset identity.

# Phase 5 — Alternative edits / paper-edit materialization

Test story-level alternatives independent from a Resolve timeline.

Start from the Workspace/Paper Edit concepts validated in 0B. Introduce a distinct `PaperEdit` or versioned editorial-plan domain type only if materialization/comparison requirements justify it.

Required capabilities:

- select narrative/source choices;
- reorder/duplicate into alternatives;
- keep rejected material recoverable;
- compare alternatives;
- approximate runtime;
- materialize a chosen version as a Resolve timeline.

OpenTimelineIO may support interchange but does not replace Salai narrative semantics.

# Phase 6 — GenAI / previs production-media spike

Add generation only after ordinary ShotIntent/media relationships work.

Initial useful operations may include:

- text-to-image storyboard/previs;
- image-to-video preview.

Required flow:

1. narrative object requires a ShotIntent;
2. ShotIntent lacks a realization;
3. user requests a generated preview/alternative;
4. generation executes through a registered backend/workflow;
5. result becomes a normal Asset with provenance;
6. Asset links to ShotIntent;
7. Asset can be reviewed and handed into Resolve like captured media.

This phase is also where low-friction previs should be tested as an earlier creative feedback loop, not just as media generation.

# Conditional interoperability spike — OpenAssetIO

OpenAssetIO is not a prerequisite for local Asset identity or reverse scripting.

Run an OpenAssetIO spike when a validated workflow requires external asset resolution/publishing or production asset-management interoperability.

At that point test:

- create/resolve an external asset entity reference;
- publish/register local assets;
- preserve Salai identity when concrete storage locations change;
- determine the minimum Salai trait set.

Until then, use Salai-owned stable Asset IDs plus paths/fingerprints/metadata.

# Later product areas

Introduce only when required by validated workflows:

- Deliverable/release management;
- collaboration/sync/CRDT;
- hosted review;
- broader screenplay interchange;
- richer generation operations;
- mixed-media/freeform canvas research;
- external asset-management interoperability beyond the conditional OpenAssetIO spike.

# Current gate

Proceed to **Spike 0B — Familiar Authoring UX** using the implemented `@salai/script-model` package as the canonical semantic model and [`authoring-ux-spec.md`](authoring-ux-spec.md) as the implementation contract.

Do not pull Electron, persistence, Resolve, real transcription, GenAI, or speculative canvas infrastructure into the spike unless a small mock is strictly necessary to answer the workflow validation question.
