# Salai System Architecture

## Status

Living System Architecture Document (SAD).

This document owns system-level boundaries, runtime topology, component responsibilities, persistence ownership, and staged infrastructure direction. It does **not** own Narrative IR field-level semantics or the operation vocabulary; those are authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md).

Product terminology is centralized in [`glossary.md`](glossary.md).

## Architectural thesis

Salai owns the narrative and production context around a video while reusing mature infrastructure for editing, media processing, asset interchange, and generation.

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

A Paper Edit may initially be represented as a Workspace over SourceExcerpts/Beats/Cues. If later materialization/versioning requirements justify a distinct `PaperEdit` domain object, that decision should be made when Phase 6 is implemented rather than assumed now.

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

See [`workflows.md`](workflows.md) for UX behavior.

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
│ Python / FastAPI                            │
│ SQLite                                      │
│ media/filesystem services                   │
│ CutMaster integration                       │
│ OpenAssetIO / OpenTimelineIO                │
│ ComfyUI / GenAI adapters                    │
│ FFmpeg / ffprobe                            │
└─────────────────────────────────────────────┘
```

Electron remains the OS/runtime shell; the local service owns heavier media/integration concerns. Spike 0A must not depend on this runtime.

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

Preferred Resolve automation infrastructure where its stable/public interfaces cover Salai's needs. Salai decides *why* an operation occurs; CutMaster performs generic Resolve automation.

## OpenAssetIO

Use at the asset identity/resolution/publishing boundary. It does not replace narrative or production-graph state.

## OpenTimelineIO

Use for editorial interchange where useful. It does not carry all Salai narrative/workspace semantics.

## ComfyUI / generation providers

Treat generated outputs as normal production assets with provenance. Salai should register useful workflows and expose production-relevant parameters rather than recreate a node editor.

## FFmpeg / ffprobe

Use as commodity local media utilities where appropriate.

# Persistence boundary

Spike 0A validates versioned serialization only.

Phase 2 introduces durable local persistence for:

- validated Narrative IR;
- production graph objects/relationships;
- Workspace/Board state needed by 0B workflows;
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

## Broader application

```text
Desktop/UI
- Electron
- React
- TypeScript
- Vite

Local service
- Python 3.11+
- FastAPI
- Pydantic
- SQLite

Infrastructure
- CutMaster
- OpenAssetIO
- OpenTimelineIO
- ComfyUI
- FFmpeg / ffprobe
```

No Rust/Tauri or graph-database dependency is currently justified.

# Architecture questions not owned by Spike 0A

- final Workspace persistence schema after 0B UX evidence;
- CutMaster coverage for the required Resolve vertical slice;
- OpenAssetIO trait/entity design;
- cross-platform Electron + Python packaging;
- GenAI operation set and provider abstraction details;
- eventual collaboration/sync architecture.

Narrative IR questions belong in [`narrative-ir-spec.md`](narrative-ir-spec.md), not here.
