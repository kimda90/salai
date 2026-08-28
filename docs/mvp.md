# Salai MVP and Validation Roadmap

## Status

Living implementation/validation sequence.

This document owns **when** product/technical risks are tested. Narrative IR semantics remain authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md). The next authoring interaction contract is [`agent-mediated-authoring.md`](agent-mediated-authoring.md).

## MVP goal

Validate Salai's narrative/production model and primary creative interaction before investing heavily in Resolve, GenAI media generation, or broad application infrastructure.

The MVP should ultimately prove:

1. one semantic narrative model can represent script-first and footage-first work;
2. narrative meaning and audiovisual timing can remain distinct without becoming user workload;
3. narrative objects retain stable links to source evidence and production intent through restructuring;
4. users can express creative intent with substantially less interaction than manual model manipulation requires;
5. specialized views can inspect/precisely edit the same underlying state without document drift;
6. Resolve can consume normalized downstream choices without Salai becoming an NLE or opaque chat command shell;
7. captured and generated media can participate in the same production flow.

# Phase 0 — Narrative and authoring foundation

## Spike 0A — Narrative IR

**Status: complete / pass.**

The pure TypeScript Narrative IR is implemented in `packages/script-model/` and satisfies the current fixture/operation/serialization/runtime acceptance criteria.

See:

- [`narrative-ir-spec.md`](narrative-ir-spec.md) — implemented baseline contract;
- [`spike-0a-assessment.md`](spike-0a-assessment.md) — result and evidence.

The implementation demonstrated one model across product, interview/corporate, and footage-first documentary fixtures without a workflow-specific schema or generic mutation escape hatch.

## Spike 0B — Structured authoring UX

**Status: closed / mixed result.**

0B implemented Story Wall, Outline, AV Script, and Paper/Radio Edit over the same Narrative IR.

### What passed

- one canonical project across all four surfaces;
- stable Beat/Cue/source identity;
- Workspace isolation from narrative semantics;
- authored/source-backed distinction;
- structural/runtime changes through typed operations;
- product/interview/documentary fixture coverage.

### What failed

The first human UX test found:

> **The direct structured workflow needs too much user interaction to be creatively useful.**

The primary failure is interaction architecture, not a discovered inability of the Narrative IR to represent the workflows.

Structured surfaces are retained as specialized projections/workspaces, but they are no longer the assumed primary authoring entry point.

See [`spike-0b-assessment.md`](spike-0b-assessment.md).

## Spike 0C — Agent-Mediated Authoring

**Current validation priority.**

### Question

Can a filmmaker write, converse, and provide media naturally while Salai performs the structural normalization into one canonical project with enough trust, reversibility, and source fidelity to remain creatively useful?

### Primary flow

```text
free-form text / conversation / media
                 ↓
          agent normalization
                 ↓
        typed operation batch
                 ↓
          validation/apply
                 ↓
     canonical Narrative IR/state
                 ↓
 specialized views / later Resolve
```

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md) for the detailed UX/implementation contract and [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) for the architectural proposal.

### 0C.0 — Reuse the proven canonical boundary

Do not rebuild the model.

Reuse:

- `@salai/script-model`;
- current shared controller/operation dispatch;
- fixture loading;
- duration/validation logic;
- existing structured surfaces as inspection views.

The agent must produce canonical changes through the same typed operation boundary.

### 0C.1 — Free-form working surface

Build the smallest useful authoring area:

- plain/simple text editing;
- messy notes allowed;
- no requirement to classify each line as Section/Beat/Cue;
- explicit process/interpret action first unless continuous processing proves necessary;
- current project context visible enough to preserve orientation.

Do not make a rich-text document framework canonical project storage.

### 0C.2 — Project-aware conversation

Add a conversational input that can:

- inspect the current project;
- answer project/story questions;
- request structural revisions;
- request runtime changes;
- request source/media substitutions;
- produce a typed operation batch.

Conversation and working text share one project context. Do not make chat history the project model.

### 0C.3 — Attachment/media intake

Allow the user to add attachments with fixture-backed or mocked metadata:

```text
attachment
- id
- display/file name
- media type
- optional duration
- optional transcript/description
- optional mocked source ranges/MediaSegment identity
```

The goal is to validate the interaction and source semantics before implementing full media intelligence.

Test:

- script-first reference material;
- interview/source evidence;
- visual/B-roll context;
- missing-coverage reasoning.

### 0C.4 — Agent normalization loop

Begin with a small Salai-owned loop, not a general agent framework.

```text
current project + working input + attachments
                  ↓
             model call
                  ↓
 structured tools / NarrativeOperation[]
                  ↓
          validate + apply batch
```

Provider may be local or hosted. Provider choice must not change operation/review semantics.

Required agent behavior:

- infer obvious hierarchy/order;
- create supporting Cues when needed;
- preserve source evidence;
- make best-effort reversible assumptions when appropriate;
- ask focused creative clarifications only when material ambiguity requires them.

### 0C.5 — Change batches and undo

One user intention may create multiple canonical operations.

Represent those as one user-facing change batch:

```text
intent
 ↓
0..N operations
 ↓
one history entry
```

Minimum prototype requirements:

- summary of what changed;
- last-batch undo/revert;
- operation failure does not partially corrupt project state;
- stable IDs preserved where possible.

Do not require per-operation approval for clearly requested reversible changes.

### 0C.6 — Graduated autonomy

Validate three review boundaries.

#### Reversible local project changes

May apply as a grouped, undoable batch when clearly requested.

#### Meaningful creative ambiguity

Ask one focused question if necessary. Use creative language, not internal model terminology.

#### External/destructive effects

Remain explicit-confirmation operations. Real Resolve execution is outside this spike, but the boundary must be designed now.

### 0C.7 — Structured-view continuity

After agent changes, inspect the same state through existing views.

Verify:

- Outline reflects hierarchy;
- AV Script reflects inferred Cue/Visual/Audio structure;
- Paper/Radio preserves source evidence;
- Story Wall references remain valid where relevant;
- views do not require export/import or reconstruction.

The views are not the primary workflow test; they prove normalization produced usable structured state.

### 0C.8 — Human interaction-compression test

Run representative tasks comparable to 0B.

Measure:

- number of explicit user actions/inputs;
- number of required clarifications;
- number of times the user must reason about the internal hierarchy;
- whether change summaries/undo create trust;
- whether specialized views are opened voluntarily because they help;
- perceived continuity of creative flow.

Required scenarios:

1. blank-page paragraph → rough story;
2. messy draft → coherent restructure/runtime change;
3. interview/media attachments → source-preserving radio/paper structure;
4. mixed story + media → missing-coverage question;
5. multi-operation natural-language change → one undoable batch.

### 0C exit criterion

0C passes when:

- users can remain primarily in free-form authoring for ordinary story construction/revision;
- common creative intentions take materially fewer explicit interactions than 0B;
- agent output always resolves through validated typed canonical operations;
- source-backed content remains source-backed;
- users can understand and revert grouped agent changes;
- structured views remain synchronized and useful for precision/inspection;
- no second canonical free-form document is required;
- the IR remains adequate for genuinely messy agent-interpreted input or any failure is documented explicitly.

# Phase 1 — Minimal desktop/local-service shell

Proceed only after the primary authoring interaction is validated.

## Electron

- launch/manage the local service;
- host React UI;
- open/retain real project folders;
- filesystem/OS bridge through narrow secure IPC;
- `contextIsolation: true`;
- `nodeIntegration: false`.

Preferred tooling direction:

- `electron-vite` for Electron/Vite development/build;
- `electron-builder` for packaging unless evidence justifies another tool.

## Local service

- Python 3.11 or 3.12 / FastAPI;
- initial project API;
- filesystem/media services;
- model/media-provider adapters as justified;
- prepare for SQLite/integrations.

Narrative IR remains a versioned explicit contract rather than being redefined by persistence/service models.

# Phase 2 — Durable project / production graph foundation

Introduce local persistence after 0C clarifies what free-form/session context actually needs to survive.

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

### Validated interaction/workspace state

- Workspace/Board state proven useful;
- agent change/history metadata required for recovery/audit;
- a durable WorkingDocument/session artifact **only if 0C proves it necessary**.

Use SQLite unless implementation evidence justifies another local persistence mechanism. Do not introduce a graph database.

# Phase 3 — CutMaster / Resolve vertical slice

Prove:

```text
Salai canonical state
        ↓
materialization decision
        ↓
Salai Resolve adapter
        ↓
CutMaster
        ↓
DaVinci Resolve Studio
```

CutMaster remains the default Resolve automation boundary; direct Resolve scripting is reserved for capabilities not adequately exposed through CutMaster. See [`adr/0004-cutmaster-default-resolve-boundary.md`](adr/0004-cutmaster-default-resolve-boundary.md).

Required experiments:

- read current Resolve project/timeline context;
- identify Media Pool/timeline items;
- import media;
- map timeline items to source items;
- write/read useful metadata/custom data;
- add/read markers;
- create/modify timelines from explicit source ranges;
- inspect identity behavior across restart/duplication/export-import;
- determine event/polling strategy;
- document direct-Resolve exceptions.

Agent requests must materialize through canonical Salai state rather than bypassing this boundary.

# Phase 4 — Reverse scripting with real media

Replace mocked 0C attachments/source evidence with real media-derived data.

```text
local media
   ↓
transcript / lightweight visual description / metadata
   ↓
MediaSegments
   ↓
agent/source selection + normalization
   ↓
SourceExcerpts / Beats / Cues
```

Initial reusable infrastructure may include:

- FFmpeg/ffprobe;
- faster-whisper;
- WhisperX when alignment/diarization is required;
- PySceneDetect;
- SQLite FTS5;
- sqlite-vec only if semantic retrieval proves useful.

Success means the same Narrative IR/source semantics hold with real evidence and real local assets, and the agent can reason over them without losing provenance.

# Phase 5 — Alternative edits / materialization

Test story-level alternatives independent from a Resolve timeline.

Required capabilities:

- ask for or create alternative narrative/source choices;
- keep rejected material recoverable;
- compare alternatives;
- approximate runtime;
- choose one for Resolve materialization.

Introduce a distinct versioned editorial-plan/PaperEdit domain type only if comparison/materialization requirements justify it.

# Phase 6 — GenAI / previs production-media spike

Add generation only after ordinary ShotIntent/media relationships work.

Required flow:

1. narrative object requires a ShotIntent;
2. ShotIntent lacks a realization;
3. user requests a preview/alternative naturally;
4. agent creates/updates the structured generation intent;
5. generation executes through a registered backend;
6. result becomes a normal Asset with provenance;
7. Asset links to ShotIntent;
8. Asset can be reviewed and handed into Resolve like captured media.

This is where low-friction previs can become part of the primary authoring feedback loop.

# Conditional interoperability spike — OpenAssetIO

OpenAssetIO remains conditional. Add it when a validated workflow requires external asset resolution/publishing or production asset-management interoperability.

Until then, use Salai-owned stable Asset IDs plus paths/fingerprints/metadata.

# Later product areas

Introduce only when required by validated workflows:

- Deliverable/release management;
- collaboration/sync/CRDT;
- hosted review;
- broader screenplay interchange;
- richer generation operations;
- optional mixed-media/freeform spatial Workspace;
- external asset-management interoperability.

# Current gate

Proceed to **Spike 0C — Agent-Mediated Authoring** using:

- the implemented `@salai/script-model` package as canonical semantic state;
- the existing 0B controller/views as validation infrastructure;
- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) as the active interaction contract.

Do not pull Electron, persistence, real Resolve execution, full media analysis, GenAI execution, a rich-text canonical model, or a general agent framework into 0C unless a minimal piece is strictly necessary to answer the interaction-compression question.
