# Salai MVP and Validation Roadmap

## Status

Living implementation/validation sequence.

This document owns **when** product/technical risks are tested. Narrative IR semantics remain authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md). The active interaction contracts are [`agent-mediated-authoring.md`](agent-mediated-authoring.md) and [`narrative-lenses.md`](narrative-lenses.md).

## MVP goal

Validate Salai's narrative/production model and primary creative interaction before investing heavily in Resolve, GenAI media generation, or broad application infrastructure.

The MVP should ultimately prove:

1. one semantic narrative model can represent script-first and footage-first work;
2. narrative meaning and audiovisual timing can remain distinct without becoming routine user workload;
3. narrative objects retain stable links to source evidence and production intent through restructuring;
4. users can express ordinary creative intent with substantially less interaction than manual model manipulation requires;
5. structured Narrative Lenses can expose useful story properties and support direct manipulation when that representation helps the creator think;
6. agent-mediated authoring and direct lens editing can share one canonical state without document drift;
7. Resolve can consume normalized downstream choices without Salai becoming an NLE or opaque chat command shell;
8. captured and generated media can participate in the same production flow.

# Phase 0 — Narrative and authoring foundation

## Spike 0A — Narrative IR

**Status: complete / pass.**

The pure TypeScript Narrative IR is implemented in `packages/script-model/`.

Validated:

- stable Script / Section / optional Scene / Beat / Cue / ContentBlock identity;
- authored vs source-backed content;
- source/ShotIntent relationship stubs;
- structural operations;
- validation and relationship consequences;
- serialization/versioning;
- approximate runtime;
- product, interview/corporate, and footage-first documentary fixtures.

See:

- [`narrative-ir-spec.md`](narrative-ir-spec.md);
- [`spike-0a-assessment.md`](spike-0a-assessment.md).

## Spike 0B — Structured authoring UX

**Status: closed / mixed result.**

0B implemented Story Wall, Outline, AV Script, and Paper/Radio Edit over the same Narrative IR.

### What passed

- one canonical project across all four surfaces;
- stable Beat/Cue/source identity;
- Workspace isolation from narrative semantics;
- authored/source-backed distinction;
- structural/runtime changes through typed operations;
- deterministic fixture coverage.

### What failed

The first human UX test found:

> **Using direct structured manipulation as the routine path requires too much interaction to be creatively useful.**

This was an interaction-architecture failure, not a discovered inability of the Narrative IR to represent the workflows.

### What remains valuable

The structured views can expose useful properties of the narrative system and allow the creator to reshape it from different angles.

Therefore they are retained as **Narrative Lenses**, not discarded or reduced to administrative forms.

See [`spike-0b-assessment.md`](spike-0b-assessment.md) and [`narrative-lenses.md`](narrative-lenses.md).

## Spike 0C — Agent-Mediated Authoring + Narrative Lenses

**Current validation priority.**

### Question

Can a filmmaker write, converse, and provide media naturally while Salai performs routine structural normalization, and can the same creator deliberately enter structured Narrative Lenses to understand and manipulate the story's hierarchy, rhythm, evidence, audiovisual density, gaps, and alternatives?

0C must validate both:

- **interaction compression**; and
- **structural insight**.

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
          Narrative Lenses
                 ↓
 direct manipulation / further agent work
```

### 0C.0 — Reuse canonical boundary

Reuse:

- `@salai/script-model`;
- current shared controller/operation dispatch;
- fixture loading;
- duration/validation logic;
- existing structured surfaces.

The model invokes Salai-owned authoring commands. Salai owns ID allocation/reference resolution and compiles commands to public Narrative operations.

### 0C.1 — Free-form working surface

Build the smallest useful authoring area:

- plain/simple text editing;
- messy notes allowed;
- no requirement to classify each line as Section/Beat/Cue;
- explicit process/interpret action first unless evidence favors continuous processing;
- project/result orientation without forcing a lens switch.

Do not make a rich-text document framework canonical project storage.

### 0C.2 — Project-aware conversation

Support:

- project/story questions;
- structural revisions;
- runtime changes;
- source/media substitutions;
- grouped operation batches.

Conversation and working text share one project context. Chat history is not the project model.

### 0C.3 — Attachment/media intake

Allow fixture-backed or mocked attachment metadata:

```text
Attachment
- id
- display/file name
- media type
- optional duration
- optional transcript/description
- optional mocked source ranges / MediaSegment identity
```

The goal is to validate interaction/source semantics before full media intelligence.

### 0C.4 — Agent normalization loop

Use a small Salai-owned loop rather than a general agent framework.

```text
current project + working input + attachments
                  ↓
             model call
                  ↓
         Salai authoring commands
                  ↓
resolve refs / allocate IDs / compile operations
                  ↓
          validate complete batch
                  ↓
              publish once
```

Required behavior:

- infer obvious hierarchy/order;
- create supporting Cues when needed;
- preserve source evidence;
- preserve stable existing identity where possible;
- ask focused creative clarifications only when necessary.

### 0C.5 — Grouped changes and revert

One user intention may create multiple canonical operations.

Represent them as one user-facing batch:

```text
intent
 ↓
0..N operations
 ↓
one history entry
```

Minimum spike behavior:

- creative-level change summary;
- complete-batch validation before publishing;
- pre-batch project/Workspace snapshot;
- one-step revert;
- no partial live-state mutation after failure.

Do not introduce event sourcing or general inverse-operation synthesis for this spike.

### 0C.6 — Narrative Lenses

Existing surfaces remain first-class ways to perceive the canonical project:

- **Outline** — hierarchy / progression / proportion;
- **Story Wall** — spatial rhythm / alternatives / balance;
- **AV Script** — audiovisual density / realization;
- **Paper / Radio Edit** — evidence / voice / source pacing;
- later **Coverage** — realization gaps.

Requirements:

- agent changes appear immediately in relevant lenses;
- direct lens edits use the same canonical/Workspace operation boundaries;
- lenses expose useful structure without exposing incidental mechanics;
- lens state ownership remains correct (Projection vs Workspace);
- at least one lightweight derived indicator may be added if needed to test narrative insight.

Examples of candidate indicators:

- Cue count/density per Beat;
- section runtime proportion;
- source-voice distribution;
- unsupported/coverage count.

Do not invent a universal narrative score.

### 0C.7 — Agent ↔ lens continuity

Verify:

- direct lens edits are visible to the next agent request;
- active lens identity can be included in context when useful;
- lens-aware questions compile to canonical operations/queries;
- Workspace-only requests remain Workspace-only;
- source identity survives agent/lens round trips.

Examples:

```text
Story Wall: "Why does the middle feel crowded?"
AV Script: "Reduce the visual changes in this Beat."
Paper Edit: "Can this rely less on Maria?"
Outline: "Which section is carrying too much weight?"
```

### 0C.8 — Human validation

Compare representative 0C tasks with the 0B baseline.

#### Interaction compression

Measure:

- explicit user actions/inputs;
- required clarifications;
- times incidental hierarchy interrupts creative thinking;
- perceived flow;
- trust in grouped summary + revert.

#### Structural insight

Measure:

- which Narrative Lens users open voluntarily;
- what they are trying to understand;
- whether the lens reveals something not obvious in free-form/chat;
- whether direct manipulation feels creatively meaningful;
- whether exposed internal concepts justify their cognitive cost;
- whether agent + active-lens context is more useful than either alone.

Required scenarios:

1. blank-page paragraph → rough story;
2. messy draft → coherent restructure/runtime change;
3. interview/media attachments → source-preserving radio/paper structure;
4. mixed story + media → missing-coverage question;
5. grouped multi-operation change → one-step revert;
6. overloaded middle → lens-assisted diagnosis;
7. source-voice imbalance → Paper/Radio diagnosis;
8. disproportionate audiovisual complexity → AV Script diagnosis;
9. direct lens edit → subsequent agent request.

### 0C exit criterion

0C passes when:

- routine story creation/revision can remain low-friction;
- common intentions take materially fewer incidental interactions than 0B;
- agent output resolves through validated typed canonical operations;
- source-backed content remains source-backed;
- users understand and revert grouped agent changes;
- Narrative Lenses remain synchronized and directly editable;
- at least some lenses reveal useful narrative information beyond prose/chat;
- users enter lenses because they help think, not because software mechanics force them there;
- direct lens edits become context for subsequent agent reasoning;
- no second canonical free-form/lens document is required;
- the IR remains adequate for messy agent-interpreted input or failures are documented explicitly.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md), [`narrative-lenses.md`](narrative-lenses.md), and [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).

# Phase 1 — Minimal desktop/local-service shell

Proceed only after the primary interaction + Narrative Lens model is validated.

## Electron

- desktop shell;
- local project/file access;
- packaging/distribution.

Preferred direction:

- `electron-vite` for Electron/Vite development/build;
- `electron-builder` for packaging unless evidence justifies another tool.

## Local service

- Python 3.11/3.12 + FastAPI;
- initial project API;
- filesystem/media services;
- model/media-provider adapters as justified;
- prepare for SQLite/integrations.

Narrative IR remains a versioned explicit contract rather than being redefined by persistence/service models.

# Phase 2 — Durable project / production graph foundation

Introduce local persistence after 0C clarifies what free-form/session/lens context actually needs to survive.

Persist as validated:

- Narrative IR;
- production graph objects/relationships;
- Workspace state still justified after 0C;
- Resolve bindings/annotations when implemented;
- agent action/history metadata required for recovery/audit;
- a durable WorkingDocument/session artifact only if 0C proves it necessary.

Use SQLite unless implementation evidence justifies another local mechanism. Do not introduce a graph database by default.

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

Required experiments:

- inspect project/timeline state;
- map media identity;
- read/write useful metadata/markers;
- create/modify timelines from explicit source ranges;
- inspect identity behavior across restart/duplication/export-import;
- determine event/polling strategy;
- document direct-Resolve exceptions.

Agent requests and lens edits must materialize through canonical Salai state rather than bypassing this boundary.

# Phase 4 — Reverse scripting with real media

Replace mocked 0C attachments/source evidence with real media-derived data.

```text
local media
   ↓
transcript / visual description / metadata
   ↓
MediaSegments
   ↓
agent/source selection + normalization
   ↓
SourceExcerpts / Beats / Cues
   ↓
Narrative Lenses
```

Candidate infrastructure:

- FFmpeg/ffprobe;
- faster-whisper;
- WhisperX when alignment/diarization is required;
- PySceneDetect;
- SQLite FTS5;
- sqlite-vec only if semantic retrieval proves useful.

Success means the same Narrative IR/source semantics hold with real evidence and the agent/lenses can reason over it without losing provenance.

# Phase 5 — Alternatives / editorial materialization

Test story-level alternatives independent from a Resolve timeline.

Required capabilities:

- ask for or directly build alternative narrative/source choices;
- keep rejected material recoverable;
- compare alternatives through appropriate lenses;
- approximate runtime;
- choose one for Resolve materialization.

Introduce a distinct versioned editorial-plan/PaperEdit domain type only if comparison/materialization requirements justify it.

# Phase 6 — GenAI / previs production-media spike

Add generation only after ordinary ShotIntent/media relationships work.

Required flow:

1. narrative object requires a ShotIntent;
2. ShotIntent lacks a realization;
3. user requests a preview/alternative naturally;
4. agent creates/updates structured generation intent;
5. generation executes through a registered backend;
6. result becomes a normal Asset with provenance;
7. Asset links to ShotIntent;
8. result is visible through relevant Narrative Lenses and can be handed into Resolve.

# Conditional interoperability — OpenAssetIO

Add OpenAssetIO only when a validated workflow requires external asset resolution/publishing or production asset-management interoperability.

Until then, use Salai-owned stable Asset IDs plus paths/fingerprints/metadata.

# Later / conditional work

Introduce only when validated workflows require it:

- collaboration/sync;
- hosted review;
- broader screenplay interchange;
- richer generation operations;
- optional mixed-media spatial lenses/workspaces;
- external asset-management interoperability.

# Current gate

Proceed to **Spike 0C — Agent-Mediated Authoring + Narrative Lenses** using:

- `@salai/script-model` as canonical semantic state;
- existing 0B controller/views as validation infrastructure;
- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) as the agent/free-form contract;
- [`narrative-lenses.md`](narrative-lenses.md) as the structured-view contract;
- [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md) as the executable tracker.

Do not pull Electron, persistence, real Resolve execution, full media analysis, GenAI execution, a canonical rich-text model, or a general agent framework into 0C unless a minimal piece is necessary to answer the interaction-compression or structural-insight question.