# Salai Architecture

## Architectural thesis

Salai should own the production and narrative context of a video project, while reusing mature open-source infrastructure for Resolve automation, asset resolution, editorial interchange, media processing, and generative execution.

The product-specific engineering effort should concentrate on the relationship between:

`idea ↔ narrative ↔ shot intent ↔ asset realization ↔ editorial use ↔ review/revision`

Salai should avoid rebuilding infrastructure that can be consumed behind a stable, permissively licensed interface.

## High-level shape

```text
                         SALAI

                  Production Graph
                         │
          ┌──────────────┼──────────────┐
          │              │              │
        Story         Shot Intent      Assets
          │              │              │
      Script/Beats    Coverage      OpenAssetIO
          │              │              │
          └──────────────┼──────────────┘
                         │
             ┌───────────┴───────────┐
             │                       │
          Editorial                GenAI
             │                       │
      OpenTimelineIO          Generation Core
             │                 ┌─────┴──────┐
             │               ComfyUI    Hosted APIs
             │                 └─────┬──────┘
             │                       │
             └───────────┬───────────┘
                         │
                     CutMaster
                         │
                  DaVinci Resolve
                         │
        Media → Edit → Fusion → Color → Fairlight
                         │
                      Deliver
```

## Runtime architecture

Salai is a local desktop production application. Electron is part of the primary runtime, not merely an optional packaging layer, because the application needs durable access to local production files and processes.

```text
┌─────────────────────────────────────────────┐
│                SALAI ELECTRON               │
│                                             │
│ Main process                                │
│ - native file/folder dialogs                │
│ - filesystem access and watching            │
│ - process lifecycle                         │
│ - OS integration                            │
│ - launch/manage local services              │
│                                             │
│ Preload                                     │
│ - narrow typed IPC API                      │
│                                             │
│ Renderer                                    │
│ - React + TypeScript                        │
└───────────────────┬─────────────────────────┘
                    │ localhost HTTP / WS
                    ▼
┌─────────────────────────────────────────────┐
│              SALAI PYTHON SERVICE           │
│                                             │
│ FastAPI                                     │
│ SQLite                                      │
│ production graph                            │
│ CutMaster client/integration                │
│ OpenAssetIO                                 │
│ OpenTimelineIO                              │
│ ComfyUI / GenAI adapters                    │
│ ffmpeg / ffprobe / analysis                 │
└─────────────────────────────────────────────┘
```

### Security boundary

The renderer should not have unrestricted Node access.

Preferred Electron defaults:

- `contextIsolation: true`;
- `nodeIntegration: false`;
- expose only a narrow preload API such as `openProject`, `pickMedia`, `revealAsset`, and application lifecycle operations.

Most media/pipeline filesystem work should happen in the Python service after Electron has granted/selected the relevant path.

## Components

### 1. Electron desktop application

Primary user interface and local application shell.

Responsibilities:

- launch/open Salai projects;
- native file/folder selection;
- persistent local project access;
- drag/drop with actual filesystem identity;
- process lifecycle for the Python backend and optional local services;
- OS integration such as reveal/open/launch actions;
- render the React application.

The desktop app should remain useful when Resolve is not running.

### 2. React / TypeScript frontend

Primary UX for:

- idea/script/story development;
- shot intent and coverage;
- production graph browsing;
- paper edits;
- review and annotations;
- AI reasoning;
- generation requests/history;
- Resolve context and synchronization state.

The React application should remain mostly a normal web application communicating with the local API. This allows the same component system to be reused in a future Resolve Workflow Integration.

### 3. Python / FastAPI service

The backend is the local production engine.

Responsibilities:

- production graph persistence;
- SQLite migrations/state;
- filesystem scanning and watching;
- media metadata inspection;
- CutMaster communication;
- OpenAssetIO host/manager integration;
- OpenTimelineIO interchange;
- generation backend routing;
- downloading/normalizing generated outputs;
- job/event state;
- AI/ML integrations.

Python is preferred because the surrounding media ecosystem already centers on Python: CutMaster, Resolve scripting, OpenAssetIO, OpenTimelineIO, ML tooling, and media analysis libraries.

### 4. CutMaster — Resolve automation infrastructure

Salai should not independently reimplement broad DaVinci Resolve scripting coverage.

Use the MIT-licensed CutMaster project as the Resolve automation layer where its public/stable surfaces satisfy our needs.

Preferred consumption strategy:

1. treat CutMaster as an upstream dependency rather than copying its code;
2. prefer its stable MCP/public interfaces over imports from documented-internal modules;
3. pin a known compatible release/commit during early development;
4. wrap CutMaster behind a small Salai-facing service interface so the product domain does not depend on CutMaster tool names.

CutMaster should be responsible for operations such as:

- current project/timeline context;
- Media Pool and bin operations;
- media import/relink/metadata;
- timeline creation and clip placement;
- timeline item/take operations;
- markers;
- Resolve-side interchange and delivery where needed.

Salai remains responsible for deciding *why* those operations happen.

Conceptually:

```text
Salai:     "Materialize this paper edit"
              ↓
Salai:     convert narrative/media choices to edit specification
              ↓
CutMaster: create timeline / append ranges / markers / takes
              ↓
Resolve
```

#### Resolve Workflow Integration

A Resolve Workflow Integration should eventually provide a small contextual Salai view inside Resolve, but it is not required for the first functional vertical slice.

The embedded UI should remain thin and communicate with the same local Salai service.

Potential actions:

- show the Salai object linked to the selected Resolve item;
- link selected media/timeline items to a ShotIntent or beat;
- show camera/generated alternatives;
- generate an alternative;
- open the object in the full Salai desktop app;
- materialize or inspect story-level edits.

Do not move the production graph, AI orchestration, or main project UI into the Resolve plug-in.

### 5. OpenAssetIO — asset boundary

OpenAssetIO should replace a bespoke cross-application `AssetResolver` abstraction where appropriate.

Its role is **asset identity, resolution, publishing, and asset-management interoperability**. It does not replace Salai's production database or production graph.

Example:

```text
Salai Asset
    │
    └── EntityReference: salai://project/123/assets/abc
                            │
                      OpenAssetIO
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
          local path     studio MAM    remote/cache URI
```

Salai can initially provide a simple local `SalaiManager` backed by project storage/SQLite while remaining capable of integrating a different OpenAssetIO manager later.

Use OpenAssetIO only at the asset boundary. Narrative nodes, annotations, reviews, and ordinary domain lookups remain normal Salai application data.

Generated provider URLs are never canonical assets: completed outputs must be copied/published into project-controlled storage and registered as normal Salai assets.

### 6. OpenTimelineIO — editorial interchange

OpenTimelineIO should be used for portable editorial structures and interchange when useful, while direct Resolve operations can use CutMaster for the normal connected workflow.

The Salai `PaperEdit` domain model should not be identical to an OTIO timeline; it carries narrative intent that editorial interchange formats do not necessarily represent. Materialization/export can derive OTIO from the paper edit.

### 7. Generation core

GenAI is another source of production media, not a separate editing mode.

Salai defines a provider-neutral semantic generation request and routes it to a compatible backend.

Example:

```json
{
  "operation": "image_to_video",
  "prompt": "Slow push toward the product",
  "inputs": {
    "image": "salai://project/123/assets/storyboard-23"
  },
  "output": {
    "duration_seconds": 5,
    "aspect_ratio": "16:9",
    "quality": "preview"
  }
}
```

Initial backends:

- `ComfyBackend` for local/custom workflows;
- later, one hosted multi-model backend such as fal or Replicate.

Direct model-provider adapters should be added only when they materially improve capability, cost, reliability, or control.

#### Capability-based routing

The product domain should ask for operations/capabilities rather than model names:

```text
TEXT_TO_IMAGE
IMAGE_TO_IMAGE
TEXT_TO_VIDEO
IMAGE_TO_VIDEO
VIDEO_TO_VIDEO
INPAINT
EXTEND
CLEAN_PLATE
SFX
SPEECH
MUSIC
```

Backend-specific parameters remain an escape hatch below the portable request layer.

#### ComfyUI workflow manifests

Do not recreate ComfyUI's graph editor.

Register known workflows with a small Salai manifest exposing the inputs and outputs that Salai may control:

```text
workflows/comfy/wan-i2v/
├── workflow.json
└── salai.json
```

The manifest maps semantic fields such as `prompt`, `image`, `seed`, and `duration` to workflow node inputs/outputs.

### 8. Media utilities

Prefer established utilities rather than custom media infrastructure:

- FFmpeg / ffprobe for probing and limited transformations required by Salai;
- Resolve for production proxy/transcode/editorial operations whenever possible;
- open models/services for transcription and semantic analysis only where they add product value.

## Core data model

The relationship graph is more important than a rigid hierarchy.

```text
Project
NarrativeNode
ShotIntent
Asset
MediaSegment
Relationship
PaperEdit
PaperEditItem
Annotation
GenerationJob
GenerationArtifact
ResolveBinding
Deliverable
```

### NarrativeNode

Possible types:

- idea;
- section;
- beat;
- scene;
- script block.

### ShotIntent

Represents what the production needs independently from how that need is realized.

```text
ShotIntent 13B
├── storyboard.jpg
├── previs_gen_v01.mp4
├── gen_take_01.mp4
├── camera_take_01.mov
└── camera_take_02.mov
```

Realizations may be captured, generated, stock, graphic, or otherwise sourced.

### Asset / MediaSegment

An `Asset` represents a logical production asset and may carry an OpenAssetIO entity reference.

A `MediaSegment` identifies a meaningful time range within an asset and may carry transcription, description, embeddings, ratings, and relationships.

### Relationship

Examples:

```text
Beat ↔ Script block
Beat ↔ ShotIntent
ShotIntent ↔ Asset/MediaSegment
MediaSegment ↔ Resolve timeline item
Annotation ↔ narrative/media/editorial object
GenerationJob ↔ ShotIntent
GenerationArtifact ↔ Asset
```

Relationships should carry provenance/confidence where applicable because some links may be AI-suggested rather than manually confirmed.

### ResolveBinding

Stores the mapping between Salai objects and Resolve objects without making Resolve the system of record.

Possible fields:

```text
salai_id
resolve_project_id
resolve_object_type
resolve_unique_id
resolve_media_id?
last_seen
```

Where supported, a small Salai identifier can also be mirrored into Resolve third-party metadata or marker custom data to aid recovery. The production graph itself remains Salai-owned.

## Generated media model

Generated media behaves like normal production media after completion.

```text
ShotIntent 07A
├── Camera 07A-01
├── Camera 07A-02
├── Generated 07A-G01
└── Generated 07A-G02
```

Generated media must be nondestructive and retain provenance:

```text
GenerationJob
- operation
- backend
- model/workflow
- workflow hash/version
- source assets
- prompt/context
- seed
- provider parameters
- output assets
- quality tier
```

Suggested quality lifecycle:

```text
DRAFT → PREVIEW → FINAL
```

A generated realization may be imported into Resolve as normal media and, where useful, added as a Resolve take alongside captured alternatives.

## Resolve responsibilities

Do not reimplement unless integration requires it:

- proxy generation;
- codec handling;
- playback;
- frame-accurate editing;
- compositing;
- color;
- audio post;
- rendering/delivery.

Salai should organize, reason about, generate, publish, and hand normal production assets/editorial decisions to Resolve.

## Initial technology baseline

```text
Frontend/runtime
- Electron
- React
- TypeScript
- Vite

Backend
- Python 3.11+
- FastAPI
- Pydantic
- SQLite

Resolve
- CutMaster (MIT), consumed through stable interfaces where practical

Assets/interchange
- OpenAssetIO
- OpenTimelineIO

Generation/media
- ComfyUI
- FFmpeg / ffprobe
- hosted GenAI adapters later

Workspace tooling
- pnpm
- uv
```

No Rust/Tauri dependency is currently justified.

## Open technical questions

1. Which CutMaster public tools cover Salai's required Resolve vertical slice without custom wrappers?
2. Which missing Resolve operations require a small Salai-specific adapter or upstream CutMaster contribution?
3. How stable are Resolve unique/media IDs across restart, relink, timeline duplication, project duplication, and project export/import?
4. What polling/event strategy is needed to keep Resolve selection/playhead/project context responsive?
5. What is the smallest useful OpenAssetIO trait/entity design for a local Salai project?
6. How should the local Python runtime and Electron app be packaged on macOS, Windows, and Linux?
7. What exact subset of GenAI operations belongs in the first vertical slice?
8. Which permissive OSS licenses are allowed for bundled runtime dependencies, Comfy custom nodes, and model weights?
