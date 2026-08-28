# Salai System Architecture

## Status

Living System Architecture Document (SAD).

This document owns system-level boundaries, runtime topology, component responsibilities, persistence ownership, and staged infrastructure direction. It does **not** own Narrative IR field-level semantics or the operation vocabulary; those are authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md).

Product terminology is centralized in [`glossary.md`](glossary.md). The active authoring interaction contract is [`agent-mediated-authoring.md`](agent-mediated-authoring.md). The completed 0B structured-authoring contract remains in [`authoring-ux-spec.md`](authoring-ux-spec.md) as historical evidence.

## Architectural thesis

Salai owns the narrative and production context around a video while reusing mature infrastructure for interaction mechanics, model inference, editing automation, media processing, interchange, and generation.

The current product-specific shape is:

```text
messy creative input
text / conversation / media
          ↕
Agent / Normalization layer
          ↕
typed project operations
          ↕
Narrative IR + production context
          ↕
source evidence / ShotIntent / assets
          ↕
specialized views / editorial materialization
          ↕
DaVinci Resolve
```

The user does not need to manipulate every level directly. The structure remains explicit internally so agents, views, validation, persistence, and Resolve integration can share one deterministic project model.

DaVinci Resolve remains the downstream NLE and finishing environment.

## Reuse principle

Salai should aggressively reuse commodity infrastructure while retaining ownership of the semantics that distinguish the product.

Salai owns:

- Narrative IR and stable narrative identity;
- agent interpretation/normalization semantics;
- typed operation/tool boundaries used by agents and human views;
- grouped change/history and graduated-autonomy rules;
- Workspace semantics and projection mapping;
- ShotIntent and narrative/media relationships;
- source-evidence semantics;
- alternatives/rejection/version behavior;
- narrative-to-editorial materialization decisions;
- generated/captured asset provenance within the production graph.

Commodity infrastructure should provide mechanics such as:

- UI primitives, dragging, virtualization, tables, docking;
- model inference / structured tool calling;
- media probing/transcoding/thumbnail extraction;
- waveform/media preview;
- transcription/alignment/scene detection;
- Resolve scripting automation;
- timeline interchange;
- local model execution;
- generation execution.

A third-party model or agent framework must not own Salai's canonical project semantics.

## High-level system shape

```text
                                SALAI

                  Free-form Authoring Surface
                text · conversation · attachments
                               │
                        Agent / Normalizer
                               │
                   typed operation batches
                               │
                         Narrative IR
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
      Projections          Workspaces          Production Graph
  Outline / AV Script      Story Wall        ShotIntent / Assets
  Coverage / Teleprompt    future boards      MediaSegments / links
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
                     Local project state
                               │
               ┌───────────────┴───────────────┐
               │                               │
           Editorial                       Generation
               │                               │
        OpenTimelineIO                     ComfyUI /
               │                          hosted APIs
               └───────────────┬───────────────┘
                               │
                     Salai Resolve adapter
                               │
                           CutMaster
                               │
                        DaVinci Resolve
```

# Canonical layers

## 1. Interaction / agent-normalization layer

Owns the mapping from low-structure user input into explicit project changes.

Inputs may include:

- free-form working text;
- conversational instructions/questions;
- attachments/media context;
- current canonical project state;
- later Resolve/current-production context where appropriate.

Outputs are constrained Salai changes:

```text
NarrativeOperation[]
Workspace operations when relevant
future production-graph operations
```

The layer may reason probabilistically, but committed state changes are explicit and validated.

### Not canonical state

The following are not automatically canonical narrative truth:

- model chain-of-thought/reasoning;
- chat transcript;
- arbitrary LLM output;
- unprocessed working text;
- transient attachment presentation state.

A later persistence phase may introduce durable working-session/document artifacts if 0C demonstrates they are required, but they do not replace the Narrative IR.

### Agent runtime principle

Start with a small Salai-owned tool/structured-output loop. Do not introduce a general agent framework before concrete orchestration needs exist.

Provider choice—hosted, local, OpenAI-compatible, Ollama, `llama.cpp`, etc.—must not change canonical operation semantics.

## 2. Narrative IR

Owns stable semantic narrative identity and authored/source-backed content.

Core concepts:

```text
Script
Section
Scene?
Beat
Cue
ContentBlock
Relationship stubs
```

The authoritative hierarchy, invariants, operation API, serialization contract, and fixtures live in [`narrative-ir-spec.md`](narrative-ir-spec.md).

The new agent-mediated direction makes the IR function as an **intermediate representation** between messy creative input and deterministic product behavior.

## 3. Workspace layer

Owns persistent human organization that should not pollute Narrative IR semantics.

Validated 0B concepts:

```text
Workspace
Board
BoardItem
IdeaCard
```

The current proven Story Wall metadata is intentionally small:

- canonical Beat/Scene reference or IdeaCard;
- x/y position;
- parking state.

Workspace is optional. It should not become the primary place users must manage structure merely because a board can represent it.

### Ownership by phase

- **Spike 0B:** minimum in-memory Story Wall semantics validated.
- **Spike 0C:** reuse Workspace only where a specialized view benefits from it; do not expand it to solve free-form authoring.
- **Phase 2:** persist only Workspace state still justified after agent-mediated workflow testing.

## 4. Production graph

Owns persistent relationships between narrative intent and actual production/editorial objects.

Core concepts:

```text
Project
ShotIntent
Asset
MediaSegment
Relationship
Annotation
ResolveBinding
```

Later domain concepts are introduced in the phase that needs them:

```text
alternative/versioned editorial plan     → later editorial phase
GenerationJob / GenerationArtifact       → GenAI phase
Deliverable                              → delivery/product phase
WorkingDocument/session artifact         → only if 0C persistence evidence requires it
```

No graph database is required initially.

# Narrative and production relationships

Representative relationships:

```text
Beat/Cue ↔ ShotIntent
SourceExcerpt → MediaSegment
Beat/Cue ↔ supporting MediaSegment
ShotIntent ↔ Asset/MediaSegment realization
MediaSegment ↔ Resolve object
Annotation ↔ narrative/media/editorial object
GenerationJob ↔ ShotIntent
```

Agent mediation may create or query these relationships, but it does not change their domain meaning.

# Projection vs Workspace

A **Projection** is deterministically derived from canonical state:

```text
Outline
AV Script
Teleprompter
Coverage
```

A **Workspace** stores human organizational decisions:

```text
Story Wall
later Frame Wall
later Selects/alternative boards
```

Paper/Radio may use projection/workspace behavior as required, but no independent canonical paper-edit document is justified yet.

Structured surfaces are now treated as **specialized views/precision editors** rather than the default authoring entry point.

See [`workflows.md`](workflows.md).

# Authoring/UI architecture

## Spike 0C baseline

Reuse the existing React/TypeScript/Vite prototype and canonical controller boundary.

The minimum new shape is:

```text
React + TypeScript + Vite
│
├── Free-form working text
├── Conversation/instruction input
├── Attachment/media-drop context
├── AgentSession / model adapter
│       ↓
│   structured tool calls
│       ↓
├── grouped operation/history boundary
│       ↓
├── existing SalaiController
│       ↓
└── @salai/script-model

Existing specialized views
├── Outline
├── Story Wall
├── AV Script
└── Paper / Radio Edit
```

No new editor framework is required to validate the first version. Start with normal DOM text controls unless a real interaction need justifies more.

## Intent normalization boundary

The 0B gesture boundary remains valid for direct view interactions, but the primary 0C boundary is higher-level:

```text
user creative intent
        ↓
agent interpretation
        ↓
operation plan/batch
        ↓
validation
        ↓
canonical project state
```

A single user request may legitimately produce many operations.

Libraries/models must not mutate canonical state directly.

## Grouped history / undo

Agent mediation makes history a near-term requirement.

Minimum 0C model:

```text
UserActionBatch
- user intent/input reference
- operations[]
- before/after or inverse data sufficient for one-step revert
- summary
- status/error
```

This is an interaction-layer concept for the spike, not yet a persisted domain object.

One agent request should normally correspond to one user-visible history entry even if it performs several operations.

## Graduated autonomy boundary

### Reversible local normalization

May apply as grouped/undoable changes when clearly requested.

### Material ambiguity

Ask a focused creative clarification when necessary.

### Destructive or external effects

Require explicit confirmation before later executing:

- irreversible deletion;
- real Resolve mutations;
- destructive filesystem operations;
- publishing/export;
- paid/expensive generation;
- unrecoverable source-binding changes.

This review policy belongs to Salai and should not be delegated to provider-specific agent behavior.

## Explicit 0C non-dependencies

Do not introduce without concrete evidence:

- tldraw/general infinite-canvas SDK;
- React Flow as primary authoring abstraction;
- Tiptap/ProseMirror/Lexical as canonical story storage;
- general multi-agent framework;
- autonomous background-agent runtime;
- vector database;
- Electron/persistence infrastructure merely to validate the interaction;
- full media-analysis stack.

A future mixed-media canvas may become a Workspace after simpler free-form authoring is validated.

## Later UI infrastructure

Introduce only when required:

```text
Dockview        → multi-workspace/panel docking
Vidstack        → local media preview
wavesurfer.js   → waveform/radio-edit visualization
Playwright      → packaged Electron end-to-end tests when justified
```

These provide mechanics; Salai remains responsible for narrative/source/workspace identity.

# Runtime architecture

After agent-mediated authoring is validated, Salai remains a local-first desktop application.

```text
┌─────────────────────────────────────────────┐
│                SALAI ELECTRON               │
│                                             │
│ Main process                                │
│ - file/folder dialogs                       │
│ - filesystem access/watching                │
│ - process lifecycle                         │
│ - OS integration                            │
│                                             │
│ Preload                                     │
│ - narrow typed IPC                          │
│                                             │
│ Renderer                                    │
│ - React + TypeScript                        │
│ - authoring / views                         │
└───────────────────┬─────────────────────────┘
                    │ localhost HTTP / WS
                    ▼
┌─────────────────────────────────────────────┐
│              SALAI LOCAL SERVICE            │
│                                             │
│ Python 3.11 / 3.12 + FastAPI                │
│ SQLite                                      │
│ media/filesystem services                   │
│ model-provider adapters where justified     │
│ CutMaster / Resolve adapter                 │
│ OpenTimelineIO                              │
│ optional OpenAssetIO integration            │
│ ComfyUI / GenAI adapters                    │
│ FFmpeg / ffprobe                            │
└─────────────────────────────────────────────┘
```

Electron remains the OS/runtime shell; the local service owns heavier media/integration concerns. Narrative IR remains independent from Electron/Python.

For the packaged application, `electron-vite` and `electron-builder` remain the preferred direction unless evidence justifies alternatives. Python packaging remains a Phase 1 concern.

# Infrastructure boundaries

## Model / agent providers

Providers supply inference. Salai supplies:

- project context shaping;
- tools/operation schemas;
- validation;
- change batching;
- autonomy/confirmation policy;
- history/undo semantics;
- source/provenance rules.

A provider response is never canonical until it resolves through Salai validation/application logic.

Initial implementation should prefer simple structured output/tool calling. Add a framework only when measured requirements justify it.

## DaVinci Resolve

Resolve owns:

- frame-accurate editing;
- media playback/proxies/codecs;
- Fusion;
- color;
- Fairlight/audio post;
- rendering/delivery.

Salai owns the story/production context and the decision to materialize it.

The agent should not turn free-form conversation directly into arbitrary Resolve mutations.

## CutMaster

CutMaster remains the **default Resolve automation boundary**. Salai decides *why* an editorial operation occurs; a Salai-owned Resolve adapter translates canonical materialization intent into CutMaster operations. Direct Resolve scripting is an exception for capabilities unavailable or unsuitable through CutMaster.

Salai domain types must not depend on CutMaster types.

See [`adr/0004-cutmaster-default-resolve-boundary.md`](adr/0004-cutmaster-default-resolve-boundary.md).

## OpenTimelineIO

Use for editorial interchange/materialization where useful. It does not carry all Salai narrative/workspace/agent semantics and does not replace Narrative IR.

## OpenAssetIO

OpenAssetIO is a conditional interoperability integration, not a prerequisite for stable local Asset identity.

Early Salai projects may use Salai-owned stable IDs, paths/fingerprints, and metadata. Add OpenAssetIO when external asset resolution/publishing creates a concrete need.

## ComfyUI / generation providers

Treat generated outputs as normal production assets with provenance. The agent may formulate generation intent later, but generation execution remains an explicit production effect with appropriate confirmation/cost visibility.

Keep ComfyUI at a process/API boundary rather than importing its UI/editor model.

## FFmpeg / ffprobe

Use as commodity local media utilities for probing, frame/audio extraction, proxy/transcode work, and similar tasks.

Use direct libraries such as PyAV only when subprocess boundaries are insufficient for a specific need.

## Transcription and reverse-scripting infrastructure

Real-media phases should reuse established components rather than implement speech recognition from scratch.

Current candidates:

```text
faster-whisper  → default local transcription candidate
WhisperX        → alignment/diarization when required
PySceneDetect   → initial scene/shot segmentation candidate
```

These produce evidence/metadata that Salai converts into its own `MediaSegment` / `SourceExcerpt` semantics and exposes to the agent.

0C may use mocked attachment metadata instead of pulling this stack forward.

## Local search

Use SQLite capabilities before separate infrastructure:

```text
SQLite relational data
├── FTS5        transcript/text retrieval
└── sqlite-vec  semantic retrieval if/when embeddings prove useful
```

Do not introduce a standalone vector database until scale/measured requirements justify it.

## Local model execution

0C should remain provider-agnostic.

Possible later local adapters include Ollama or an OpenAI-compatible `llama.cpp` server. Hosted providers can use the same tool/operation contract.

Provider choice must not change:

- canonical-state rules;
- source/provenance semantics;
- grouped-action history;
- confirmation boundaries.

# Persistence boundary

Spike 0A validated versioned Narrative IR serialization. Spike 0B validated minimum Workspace semantics in memory. Spike 0C validates agent/session/history interaction semantics in memory.

Phase 2 introduces durable local persistence for:

- validated Narrative IR;
- production graph objects/relationships;
- Workspace state still justified after 0C;
- annotations and Resolve bindings;
- agent action/history metadata required for recovery/audit;
- a durable free-form WorkingDocument/session artifact only if 0C proves it necessary.

SQLite remains the default direction. The schema should preserve domain versioning/stable IDs without making transient UI or provider state canonical.

# Technology baseline

## Spike 0A

```text
TypeScript
pnpm
Vitest/unit tests
packages/script-model/
```

## Spike 0B — retained foundation

```text
React
TypeScript
Vite
Pragmatic Drag and Drop
Vitest deterministic tests
GitHub Pages prototype
```

## Spike 0C — added validation layer

```text
simple text/chat/attachment UI
model provider adapter
structured output / tool calling
operation batching
in-memory undo/history
existing Narrative IR/controller/views
```

No general agent framework is assumed.

## Broader application

```text
Desktop/UI
- Electron
- React
- TypeScript
- Vite
- electron-vite
- electron-builder

Local service
- Python 3.11 or 3.12
- FastAPI
- Pydantic
- SQLite

Infrastructure
- model provider adapters
- CutMaster as default Resolve boundary
- OpenTimelineIO
- OpenAssetIO when interoperability requires it
- ComfyUI / generation providers
- FFmpeg / ffprobe
- faster-whisper / WhisperX when reverse scripting requires them
- PySceneDetect when segmentation requires it
- SQLite FTS5 / sqlite-vec when retrieval requires them
```

No Rust/Tauri, graph database, standalone vector database, generic infinite canvas, canonical rich-text document, or general multi-agent framework is currently justified for the active validation milestone.

# Architecture questions for Spike 0C

- What exact contract should the agent adapter expose above `NarrativeOperation[]`?
- What constitutes one undoable action batch?
- How should agent assumptions/uncertainty be represented without creating approval spam?
- Does free-form working text need durable identity/state?
- Which reversible changes may auto-apply?
- What attachment metadata is sufficient before real media analysis?
- Which structured surfaces remain important once they are no longer primary authoring paths?
- Does messy agent-mediated input expose a real Narrative IR semantic gap?

Narrative IR questions still belong in [`narrative-ir-spec.md`](narrative-ir-spec.md). The active 0C interaction questions belong in [`agent-mediated-authoring.md`](agent-mediated-authoring.md).
