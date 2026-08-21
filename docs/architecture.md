# Salai Architecture

## Architectural thesis

Salai owns the production and narrative context of a video project while reusing mature open-source infrastructure for Resolve automation, asset resolution, editorial interchange, media processing, and generative execution.

The product-specific engineering effort should concentrate on the relationship between:

`idea ↔ structured narrative ↔ shot intent ↔ asset realization ↔ editorial use ↔ review/revision`

The current highest-risk part of this architecture is the **structured narrative/scripting model**, not Resolve automation.

Salai should avoid rebuilding infrastructure that can be consumed behind a stable, permissively licensed interface.

## High-level shape

```text
                         SALAI

                  Production Graph
                         │
          ┌──────────────┼──────────────┐
          │              │              │
   Structured Story   Shot Intent      Assets
          │              │              │
  Sections / Beats    Coverage      OpenAssetIO
  Visual / Audio         │              │
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

## Structured scripting architecture

### Script is semantic data, not an opaque text blob

A Salai script is a structured narrative model whose objects have stable identity and can participate in the production graph.

Initial shape:

```text
Script
├── Section / optional Scene
│   ├── Beat
│   │   ├── visual content
│   │   ├── audio content
│   │   ├── duration intent
│   │   └── relationships
│   └── Beat
└── Section
```

`Scene` is optional rather than universal. Short-form commercial/corporate/YouTube work may use Hook / Problem / Demo / Benefit / CTA, while traditional narrative work can use act/sequence/scene structures.

`Beat` is initially the smallest narrative object Salai reasons about.

### Script views are projections

The same model should power several views rather than storing several independent documents:

```text
                    SCRIPT MODEL
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
    Outline          AV Script        Teleprompter
       │                 │                 │
 sections/beats      visual | audio    dialogue / VO
       │
       ├──────────── screenplay-like view later
       └──────────── coverage / ShotIntent view
```

The initial authoring bias is AV-script-first because the target user frequently needs to reason about visual and audio intent separately.

The AV table is a view, not the canonical schema: one Beat can require several ShotIntents and one ShotIntent can support several Beats.

### Content channels

A Beat may contain typed visual and audio blocks.

Initial candidates:

```text
Visual
- action / visual description
- on-screen text
- graphic
- reference
- note

Audio
- dialogue
- voiceover
- music
- sfx
- ambience
- note
```

The implementation should start with only the types needed by the scripting spike.

### Stable identity and structural editing

Script objects can be linked to ShotIntents, MediaSegments, annotations, and later Resolve/editorial objects. Ordinary editing therefore must preserve identity whenever possible.

Initial rules to validate:

- text edit preserves ID;
- move/reorder preserves ID;
- split creates a new object and requires relationship redistribution;
- merge retains one canonical ID and records provenance from the merged object;
- delete does not silently delete linked production data;
- structural edits are transactional and undoable.

The exact split/merge relationship policy remains a product-spike question.

### AI editing is operation-based

LLM-assisted editing should normally produce structured, reviewable operations rather than replace the document with a new text blob.

```text
structured script
      ↓
LLM proposed operations
      ↓
reviewable patch
      ↓
transaction
```

Example operations:

```text
update beat_17.audio.voiceover
remove beat_16
move beat_18 before beat_17
insert new beat after beat_21
```

This makes AI changes auditable and protects production relationships.

### Runtime is first-class

Target duration is often a hard authoring constraint for the initial market.

Salai should support target and estimated runtime based on spoken-word estimates, explicit Beat durations, linked media duration, and visual-hold estimates.

The goal is useful structural feedback, not frame-accurate timing.

### Reverse scripting uses the same model

Footage-first projects should not require a second scripting system.

```text
existing footage
      ↓
MediaSegments + transcript/descriptions
      ↓
possible moments/topics
      ↓
proposed Beats with source relationships
      ↓
normal Salai structured authoring
```

A proposed Beat may already link to interview excerpts, B-roll, or other source MediaSegments. Rewriting/reordering the narrative should preserve those relationships where appropriate.

See `docs/scripting.md` for the detailed scripting model and spike.

## Runtime architecture

Salai is a local desktop production application. Electron is part of the primary runtime because the application needs durable access to local production files and processes.

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
│ - structured script editor                  │
└───────────────────┬─────────────────────────┘
                    │ localhost HTTP / WS
                    ▼
┌─────────────────────────────────────────────┐
│              SALAI PYTHON SERVICE           │
│                                             │
│ FastAPI                                     │
│ SQLite                                      │
│ production graph / script persistence       │
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
- expose only a narrow preload API for local application/OS operations.

Most media/pipeline filesystem work should happen in the Python service after Electron has selected/granted the relevant path.

## Components

### 1. Electron desktop application

Primary user interface and local application shell.

Responsibilities:

- launch/open Salai projects;
- native file/folder selection;
- persistent local project access;
- drag/drop with actual filesystem identity;
- process lifecycle for the Python backend and optional local services;
- OS integration;
- render the React application.

The desktop app and scripting workflow must remain useful when Resolve is not running.

### 2. React / TypeScript frontend

Primary UX for:

- structured script/story development;
- Outline / AV Script / Teleprompter projections;
- runtime constraints;
- AI structural proposals/review;
- shot intent and coverage;
- production graph browsing;
- paper edits;
- review and annotations;
- generation requests/history;
- Resolve context and synchronization state.

#### Structured editor

Current prototype preference is Tiptap / ProseMirror because the scripting problem needs custom semantic schemas, stable node IDs, and transactional editing rather than a generic text editor.

Initial custom node candidates:

```text
salaiDocument
section
beat
visualBlock
voiceoverBlock
dialogueBlock
onscreenTextBlock
noteBlock
```

Lexical remains an alternative if the spike shows a better fit.

The editor framework must not become the production-domain storage model. Editor state should map cleanly to Salai narrative/domain objects.

### 3. Python / FastAPI service

The backend is the local production engine.

Responsibilities:

- production graph and structured-script persistence;
- SQLite migrations/state;
- script structural operations and relationship transactions;
- filesystem scanning/watching;
- media metadata inspection;
- CutMaster communication;
- OpenAssetIO host/manager integration;
- OpenTimelineIO interchange;
- generation backend routing;
- job/event state;
- AI/ML integrations.

Python remains preferred because the surrounding media/pipeline ecosystem centers on Python.

### 4. CutMaster — Resolve automation infrastructure

Salai should not independently reimplement broad DaVinci Resolve scripting coverage.

Use the MIT-licensed CutMaster project as the Resolve automation layer where its public/stable surfaces satisfy requirements.

Preferred consumption strategy:

1. treat CutMaster as an upstream dependency rather than copying its code;
2. prefer stable MCP/public interfaces over undocumented internal imports;
3. pin a compatible release/commit during early development;
4. wrap CutMaster behind a small Salai-facing service interface.

CutMaster should handle operations such as:

- current project/timeline context;
- Media Pool and bin operations;
- media import/relink/metadata;
- timeline creation and clip placement;
- take operations;
- markers;
- Resolve-side interchange/delivery where needed.

Salai decides *why* those operations happen.

Resolve integration is downstream of the narrative model rather than the first implementation priority.

#### Resolve Workflow Integration

A future Workflow Integration should provide a small contextual Salai view inside Resolve and communicate with the same local service.

Do not move the script model, production graph, AI orchestration, or full project UI into the Resolve plug-in.

### 5. OpenAssetIO — asset boundary

OpenAssetIO handles asset identity, resolution, publishing, and asset-management interoperability. It does not replace Salai's database or narrative graph.

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

Use OpenAssetIO only at the asset boundary. Narrative nodes, script operations, annotations, reviews, and ordinary domain queries remain Salai data.

### 6. OpenTimelineIO — editorial interchange

OpenTimelineIO is used for portable editorial structures/interchange where useful. Direct Resolve operations can use CutMaster.

`PaperEdit` is not identical to an OTIO timeline because it carries narrative intent and relationships beyond editorial interchange.

### 7. Generation core

GenAI is another source of production media, not a separate editing mode.

Salai defines provider-neutral generation operations and routes them to compatible backends.

Initial backends:

- `ComfyBackend` for local/custom workflows;
- later, one hosted multi-model backend.

Do not recreate ComfyUI's node editor. Register known workflows with Salai manifests exposing only the parameters relevant to the production operation.

### 8. Media utilities and reverse-scripting analysis

Prefer established utilities/models rather than custom media infrastructure:

- FFmpeg / ffprobe for probing and limited transformations;
- Resolve for production proxy/transcode/editorial operations whenever possible;
- transcription and lightweight visual analysis only where they support MediaSegment creation and reverse scripting.

Semantic search itself is not the product; converting available material into useful narrative evidence is the product goal.

## Core data model

The relationship graph is more important than a rigid hierarchy.

```text
Project
Script
NarrativeNode
ContentBlock
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

### Script / NarrativeNode

A `Script` is the structured narrative container.

`NarrativeNode` initially represents:

- section;
- optional scene;
- beat.

Nodes have stable IDs and ordering/parent relationships.

### ContentBlock

Typed narrative content attached to a node, initially covering the minimal visual/audio types required by the scripting spike.

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

### Asset / MediaSegment

An `Asset` represents a logical production asset and may carry an OpenAssetIO entity reference.

A `MediaSegment` identifies a meaningful time range and may carry transcription, description, embeddings, ratings, and relationships.

### Relationship

Examples:

```text
Beat ↔ ShotIntent
Beat ↔ MediaSegment (source evidence)
ShotIntent ↔ Asset/MediaSegment
MediaSegment ↔ Resolve timeline item
Annotation ↔ narrative/media/editorial object
GenerationJob ↔ ShotIntent
GenerationArtifact ↔ Asset
```

Relationships should carry provenance/confidence where applicable.

### ResolveBinding

Stores mappings between Salai and Resolve objects without making Resolve the system of record.

## Interchange

### Fountain

Fountain is an initial screenplay-oriented import/export format, not canonical storage.

```text
Fountain
   ↕ importer/exporter
Salai structured script
```

Salai-specific relationships and production metadata remain in the project even when exported text cannot represent them.

FDX may be added later if real user demand justifies it.

## Persistence questions

The scripting spike should determine whether the canonical local representation is best implemented as:

1. normalized narrative/domain tables with derived editor state;
2. structured JSON document plus indexed domain objects;
3. a hybrid.

Regardless of choice:

- stable IDs are mandatory;
- relationships must survive normal authoring;
- rendered HTML/Fountain text is not canonical storage;
- structural operations must be transactional/undoable.

## Initial technology baseline

```text
Frontend/runtime
- Electron
- React
- TypeScript
- Vite
- Tiptap / ProseMirror (initial structured-editor candidate)

Backend
- Python 3.11+
- FastAPI
- Pydantic
- SQLite

Resolve
- CutMaster (MIT)

Assets/interchange
- OpenAssetIO
- OpenTimelineIO
- Fountain import/export

Generation/media
- ComfyUI
- FFmpeg / ffprobe
- transcription/analysis components as required

Workspace tooling
- pnpm
- uv
```

No Rust/Tauri dependency is currently justified.

## Current open technical/product questions

### Scripting — highest priority

1. Does Beat-first structured authoring feel natural for short-form professional video?
2. Can Outline, AV Script, and Teleprompter views share one model without awkward compromises?
3. Which relationship policy is least surprising when Beats are split, merged, or deleted?
4. Should editor persistence be normalized tables, structured JSON, or hybrid?
5. Can Tiptap/ProseMirror maintain stable semantic IDs through the editing operations Salai needs?
6. How should duration estimation combine spoken copy, visual holds, and linked media?
7. Can operation-based LLM patches produce useful rewriting while preserving object identity?
8. Does footage-first narrative construction fit the same model cleanly?

### Downstream infrastructure

9. Which CutMaster public tools cover Salai's required Resolve vertical slice?
10. How stable are Resolve IDs across restart/relink/duplication/export-import?
11. What is the smallest useful OpenAssetIO trait/entity design for local Salai projects?
12. How should Electron + the local Python runtime be packaged cross-platform?
13. Which GenAI operations belong in the first production vertical slice?
14. Which permissive OSS licenses are allowed for bundled dependencies, Comfy nodes, and model weights?
