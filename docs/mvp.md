# Salai MVP and Validation Roadmap

## Status

Living implementation/validation sequence.

This document owns **when** product/technical risks are tested. It does not own the Narrative IR operation list or field-level semantics; those are authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md).

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

**Current implementation priority.**

### Question

Can one stable semantic model represent:

- a short script-first product video;
- an interview/corporate piece mixing sourced and authored audio;
- a footage-first mini-documentary;

without separate workflow-specific schemas?

### Implementation boundary

```text
packages/script-model/
TypeScript
pnpm
unit tests
```

No Electron, React, Python, SQLite, Resolve, real LLM, Fountain/FDX, or real media analysis is required.

### Contract

Use [`narrative-ir-spec.md`](narrative-ir-spec.md) as the single source of truth for:

- hierarchy and type constraints;
- stable identity rules;
- authoritative structural operation vocabulary;
- SourceExcerpt semantics;
- split/merge/delete behavior;
- serialization/versioning;
- duration estimation;
- required fixtures/tests;
- open-question ownership and pass/fail criteria.

### Exit criterion

All required fixtures fit the same model and meaningful restructuring can be expressed through the authoritative operation API without a generic mutation escape hatch.

Failure is valid evidence: change the model before building UI.

## Spike 0B — Familiar authoring UX

Only after 0A is credible, test whether people can comfortably author/restructure the model through familiar workflows.

### Minimum surfaces

1. **Story Wall** — Beat/Scene cards, spatial organization, parking-lot material, loose IdeaCards.
2. **Outline** — hierarchical structure.
3. **AV Script** — Beat/Cue visual/audio authoring.
4. **Paper/Radio Edit** — SourceExcerpt-driven construction.

Teleprompter remains a simple projection.

### Workspace-layer ownership

0B must define the **minimum in-memory** workspace model required for UX validation:

```text
Workspace
Board
BoardItem
IdeaCard
```

This model may store layout/grouping metadata such as position, size, color, rotation, lane/group, and parking-lot state.

0B does **not** require durable persistence yet. Phase 2 owns persisted Workspace state once the UX proves what needs to be stored.

### Editor framework decision

Start with normal React controls. Add Tiptap/ProseMirror/Lexical only where rich text materially improves the validated workflows. No editor framework becomes canonical story storage.

### Exit criterion

Users can recognize and move between Story Wall, Outline, AV Script, and Paper/Radio Edit without export/import, duplicate story documents, or exposure to graph/database terminology.

## Spike 0C — Assisted authoring

### Question

Can an LLM propose useful narrative restructuring without bypassing stable identity, source evidence, or relationship rules?

### Flow

```text
Narrative IR
    ↓
LLM proposes domain operations
    ↓
validate
    ↓
show structural/runtime/relationship diff
    ↓
review / apply / reject
```

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

## Local service

- Python/FastAPI;
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
Salai → CutMaster → DaVinci Resolve Studio
```

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
- determine event/polling strategy.

Resolve integration should follow Salai's narrative/production semantics rather than define them.

# Phase 4 — Asset boundary / OpenAssetIO spike

Validate stable Salai asset identity independently from concrete storage location.

Required experiments:

- create/resolve an asset entity reference;
- publish/register local assets;
- preserve identity if paths change;
- determine the minimum Salai trait set.

# Phase 5 — Reverse scripting with real media

Replace mocked source evidence with real media-derived data.

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

Success means the same Narrative IR semantics hold with real evidence.

# Phase 6 — Alternative edits / paper-edit materialization

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

# Phase 7 — GenAI / previs production-media spike

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

# Later product areas

Introduce only when required by validated workflows:

- Deliverable/release management;
- collaboration/sync/CRDT;
- hosted review;
- broader screenplay interchange;
- richer generation operations;
- mixed-media/freeform canvas research.

# Current gate

Implementation can proceed on Spike 0A once [`narrative-ir-spec.md`](narrative-ir-spec.md) is internally consistent. The spec's operation vocabulary and fixture-owned open questions are the implementation contract; summary docs should not duplicate them.
