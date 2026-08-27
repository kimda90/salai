# Salai System Architecture

## Status

Living System Architecture Document (SAD).

This document owns system-level boundaries, runtime topology, component responsibilities, persistence ownership, and staged infrastructure direction. It does **not** own Narrative IR field-level semantics or the operation vocabulary; those are authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md).

Product terminology is centralized in [`glossary.md`](glossary.md). Spike 0B authoring implementation details are owned by [`authoring-ux-spec.md`](authoring-ux-spec.md).

## Architectural thesis

Salai owns the narrative and production context around a video while reusing mature infrastructure for interaction mechanics, editing automation, media processing, interchange, inference, and generation.

The product-specific layer connects:

```text
idea / story intent
       ↕
Narrative IR
       ↕
ShotIntent / source evidence
       ↕
assets / generated or captured realizations
       ↕
editorial use / review / revision
```

DaVinci Resolve remains the downstream NLE and finishing environment.

## Reuse principle

Salai should aggressively reuse commodity infrastructure while retaining ownership of the semantics that distinguish the product.

Salai owns:

- Narrative IR and stable narrative identity;
- Workspace semantics and projection mapping;
- the interpretation of gestures as Workspace changes vs narrative operations;
- ShotIntent and narrative/media relationships;
- source-evidence semantics;
- alternatives/rejection/version behavior;
- AI proposal/review semantics;
- narrative-to-editorial materialization decisions;
- generated/captured asset provenance within the production graph.

Commodity infrastructure should provide mechanics such as:

- UI primitives, dragging, virtualization, tables, docking;
- media probing/transcoding/thumbnail extraction;
- waveform/media preview;
- transcription/alignment/scene detection;
- Resolve scripting automation;
- timeline interchange;
- local model execution;
- generation execution.

## High-level system shape

```text
                         SALAI

                   Narrative IR
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
   Workspaces         ShotIntent         Assets
       │                 │                 │
Story Wall /        Coverage          local media /
Paper Edit /            │             generated media
AV surfaces             │                 │
       └─────────────────┼─────────────────┘
                         │
                Local production graph
                         │
            ┌────────────┴────────────┐
            │                         │
       Editorial                  Generation
            │                         │
     OpenTimelineIO                ComfyUI /
            │                     hosted APIs
            └────────────┬────────────┘
                         │
                 Salai Resolve adapter
                         │
                     CutMaster
                         │
                  DaVinci Resolve
```

## Canonical layers

### 1. Narrative IR

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

The authoritative hierarchy, invariants, operation API, serialization contract, and Spike 0A fixtures live in [`narrative-ir-spec.md`](narrative-ir-spec.md).

### 2. Workspace layer

Owns persistent human organization that should not pollute Narrative IR semantics.

Core concepts:

```text
Workspace
Board
BoardItem
IdeaCard
```

Typical state includes:

- spatial position;
- size;
- color;
- rotation;
- lanes/groups;
- notes;
- parking-lot/alternate placement;
- references to canonical narrative/media/ShotIntent objects.

A BoardItem can reference the same Beat/Scene/etc. from multiple workspaces while carrying different layout metadata in each.

#### Ownership by phase

- **Spike 0B:** define the minimum in-memory Workspace/Board model necessary to validate Story Wall and Paper/Radio Edit UX.
- **Phase 2:** persist Workspace/Board/BoardItem/IdeaCard state together with the production graph.

This keeps Workspace out of Spike 0A without leaving persistence architecturally orphaned.

### 3. Production graph

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

Later domain concepts are introduced in the phase that needs them rather than all being required in Phase 2:

```text
PaperEdit / alternate edit materialization  → later editorial phases
GenerationJob / GenerationArtifact         → GenAI phase
Deliverable                                → delivery/product phase
```

A Paper Edit may initially be represented as a Workspace over SourceExcerpts/Beats/Cues. If later materialization/versioning requirements justify a distinct `PaperEdit` domain object, that decision should be made when alternative-edit behavior is implemented rather than assumed now.

## Narrative and production relationships

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

Plain typed records and normal persistence are sufficient initially. No graph database is required.

## Workspace vs projection

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
Beat Board
Paper Edit
Radio Edit
Frame Wall
Selects board
```

No projection becomes canonical storage. Workspace metadata does not redefine Beat/Scene semantics.

See [`workflows.md`](workflows.md) for UX behavior and [`authoring-ux-spec.md`](authoring-ux-spec.md) for the Spike 0B interaction contract.

# Authoring/UI architecture

## Spike 0B baseline

The current authoring prototype uses normal React/DOM controls and headless/composable interaction infrastructure rather than a generic editor framework.

```text
React + TypeScript + Vite
├── shadcn/ui + Base UI        UI primitives
├── Pragmatic Drag and Drop    drag/reorder mechanics
├── TanStack Table             AV Script/tabular surfaces
├── TanStack Virtual           large-list virtualization when needed
├── Storybook                  isolated workflow development
└── Vitest Browser Mode        component/interaction tests
```

The important boundary is semantic rather than technological:

```text
user gesture
    ↓
Salai intent interpretation
    │
    ├── Workspace-only change
    │
    └── Narrative operation
            ↓
      @salai/script-model
```

Libraries must not mutate canonical narrative state directly.

## Explicit 0B non-dependencies

Do not introduce these into Spike 0B without concrete validation evidence:

- tldraw or another general infinite-canvas SDK;
- React Flow as the Story Wall abstraction;
- Tiptap/ProseMirror/Lexical as canonical story storage;
- an agent framework.

A future relationship/mixed-media canvas may justify React Flow, Excalidraw, or another dedicated canvas after the simpler familiar workflows are validated.

## Later UI infrastructure

Introduce only when the product phase requires it:

```text
Dockview        → multi-workspace/panel docking
Vidstack        → local media preview
wavesurfer.js   → waveform/radio-edit visualization
Playwright      → packaged Electron end-to-end tests
```

These libraries provide rendering/interaction mechanics; Salai remains responsible for narrative/source/workspace identity.

# Runtime architecture

After Narrative IR and authoring UX are validated, Salai remains a local-first desktop application.

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
└───────────────────┬─────────────────────────┘
                    │ localhost HTTP / WS
                    ▼
┌─────────────────────────────────────────────┐
│              SALAI LOCAL SERVICE            │
│                                             │
│ Python 3.11 / 3.12 + FastAPI                │
│ SQLite                                      │
│ media/filesystem services                   │
│ CutMaster / Resolve adapter                 │
│ OpenTimelineIO                              │
│ optional OpenAssetIO integration            │
│ ComfyUI / GenAI adapters                    │
│ FFmpeg / ffprobe                            │
└─────────────────────────────────────────────┘
```

Electron remains the OS/runtime shell; the local service owns heavier media/integration concerns. The Narrative IR package remains independent from Electron and Python.

For the eventual packaged application, `electron-vite` and `electron-builder` are the preferred build/distribution direction unless implementation evidence justifies alternatives. The Python service should initially be packaged with a conventional standalone bundling approach such as PyInstaller; packaging details remain a Phase 1 implementation concern.

# Infrastructure boundaries

## DaVinci Resolve

Resolve owns:

- frame-accurate editing;
- media playback/proxies/codecs;
- Fusion;
- color;
- Fairlight/audio post;
- rendering/delivery.

Salai owns the story/production context that should survive around those operations.

## CutMaster

CutMaster is the **default Resolve automation boundary**. Salai decides *why* an editorial operation occurs; a Salai-owned Resolve adapter translates that intent into CutMaster operations. Direct Resolve scripting is an exception for capabilities unavailable or unsuitable through CutMaster.

Salai domain types must not depend on CutMaster types.

See [`adr/0004-cutmaster-default-resolve-boundary.md`](adr/0004-cutmaster-default-resolve-boundary.md).

## OpenTimelineIO

Use for editorial interchange/materialization where useful. It does not carry all Salai narrative/workspace semantics and does not replace the Narrative IR.

## OpenAssetIO

OpenAssetIO is a **conditional interoperability integration**, not a prerequisite for Salai to have stable local Asset identity.

Early Salai projects may use Salai-owned stable IDs, paths/fingerprints, and metadata. Add OpenAssetIO when external asset resolution/publishing or production asset-management interoperability creates a concrete need.

It does not replace narrative or production-graph state.

## ComfyUI / generation providers

Treat generated outputs as normal production assets with provenance. Salai should register useful workflows and expose production-relevant parameters rather than recreate a node editor.

Keep ComfyUI at a process/API boundary rather than importing its UI/editor model into Salai.

## FFmpeg / ffprobe

Use as commodity local media utilities for probing, frame extraction, audio extraction, proxy/transcode work, and similar tasks.

Use direct frame/packet libraries such as PyAV only when CLI/subprocess boundaries are insufficient for a specific implementation.

## Transcription and reverse-scripting infrastructure

Later real-media phases should reuse established local media-analysis components rather than implement speech recognition from scratch.

Current candidates:

```text
faster-whisper  → default local transcription candidate
WhisperX        → alignment/diarization when required
PySceneDetect   → initial scene/shot segmentation candidate
```

These produce evidence/metadata that Salai converts into its own `MediaSegment` / `SourceExcerpt` semantics.

## Local search

Use SQLite capabilities before introducing separate infrastructure:

```text
SQLite relational data
├── FTS5        transcript/text retrieval
└── sqlite-vec  semantic retrieval if/when embeddings prove useful
```

Do not introduce a standalone vector database service until project scale or measured requirements justify it.

## Local model execution

Spike 0C should begin with structured model calls that return proposed Narrative operations, not with a general agent runtime.

Local providers may later be exposed through an adapter to engines such as Ollama or an OpenAI-compatible `llama.cpp` server. Provider choice must not change the AI proposal/review contract.

# Persistence boundary

Spike 0A validates versioned serialization only. Spike 0B validates Workspace semantics in memory only.

Phase 2 introduces durable local persistence for:

- validated Narrative IR;
- production graph objects/relationships;
- Workspace/Board state proven by 0B;
- annotations and Resolve bindings as they become real.

SQLite remains the default direction. The schema should preserve domain versioning and stable IDs without making UI/editor state canonical.

# Technology baseline

## Spike 0A

```text
TypeScript
pnpm
Vitest/unit tests
packages/script-model/
```

## Spike 0B

```text
React
TypeScript
Vite
shadcn/ui + Base UI
Pragmatic Drag and Drop
TanStack Table
TanStack Virtual when needed
Storybook
Vitest Browser Mode
```

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
- CutMaster as default Resolve boundary
- OpenTimelineIO
- OpenAssetIO when interoperability requires it
- ComfyUI / generation providers
- FFmpeg / ffprobe
- faster-whisper / WhisperX when reverse scripting requires them
- PySceneDetect when segmentation requires it
- SQLite FTS5 / sqlite-vec when retrieval requires them
```

No Rust/Tauri, graph-database, standalone vector-database, generic infinite-canvas, or agent-framework dependency is currently justified for the active validation milestone.

# Architecture questions not owned by Spike 0A/0B

- final Workspace persistence schema after 0B UX evidence;
- CutMaster coverage and direct-Resolve exceptions for the required Resolve vertical slice;
- cross-platform Electron + Python packaging details;
- whether/when external asset interoperability justifies OpenAssetIO;
- GenAI operation set and provider abstraction details;
- eventual collaboration/sync architecture.

Narrative IR questions belong in [`narrative-ir-spec.md`](narrative-ir-spec.md), not here. Spike 0B implementation questions belong in [`authoring-ux-spec.md`](authoring-ux-spec.md).
