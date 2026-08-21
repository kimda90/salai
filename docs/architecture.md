# Salai Architecture

## High-level shape

```text
                    SALAI

             Production Graph
                    │
        ┌───────────┼───────────┐
        │           │           │
      Story       Assets     Generations
        │           │           │
    Script       Camera       GenAI
    Beats        Audio          │
    Shots        Graphics       │
        │           │      ┌────┴─────┐
        │           │    ComfyUI    Hosted APIs
        │           │      └────┬─────┘
        └───────────┴───────────┘
                    │
              Resolve bridge
                    │
                    ▼
             DAVINCI RESOLVE

       Media → Edit → Fusion → Color → Fairlight
                    │
                 Deliver
```

## Components

### 1. Companion application

Primary user interface for:

- script/story development;
- shot planning and coverage;
- production graph browsing;
- paper edits;
- AI reasoning;
- generation configuration/history;
- review and annotations.

This should remain usable when Resolve is not running.

### 2. Local companion service

Responsible for:

- project graph persistence;
- filesystem watching;
- local asset resolution;
- Resolve communication;
- generation backend routing;
- downloading and normalizing generated outputs;
- background job state.

A local-first architecture is preferred initially because original camera media may be hundreds of gigabytes and should not require cloud upload.

### 3. Resolve bridge

Two integration surfaces should be explored:

- DaVinci Resolve scripting API (Python/Lua) for project/media/timeline automation;
- Resolve Workflow Integration plug-in for contextual embedded UI and JavaScript interaction.

The embedded integration should remain thin. It should show context for the current Resolve selection and expose actions such as:

- show linked scene/shot;
- link media to a shot/beat;
- show alternatives;
- generate alternative;
- open the corresponding object in Salai;
- materialize a paper edit/assembly.

The full script/story/generation UI should remain in the companion application.

### 4. Generation core

Salai should define its own semantic generation API rather than couple the product domain directly to a provider.

Example domain request:

```json
{
  "operation": "image_to_video",
  "prompt": "Slow push toward the product",
  "inputs": {
    "image": "asset://shot-23-storyboard"
  },
  "output": {
    "duration_seconds": 5,
    "aspect_ratio": "16:9",
    "quality": "preview"
  }
}
```

Provider adapters translate this request into provider-specific schemas.

Initial adapters:

- `ComfyBackend` — local/custom workflows and power-user use cases;
- one hosted multi-model backend such as fal or Replicate.

Direct Runway/Veo/Kling/etc. adapters should only be added when they offer important functionality, pricing, or reliability advantages.

### 5. Asset resolver

A logical asset identifier should resolve differently depending on the backend:

```text
asset://abc123

Comfy local  → /project/assets/abc123.png
Hosted API   → signed HTTPS URL
Cloud API    → provider-specific uploaded asset URI
```

Generated outputs should always be copied into project-controlled storage rather than leaving temporary provider URLs as canonical assets.

## Core data model

The relationship graph is more important than a rigid hierarchy.

```text
Project
NarrativeNode
PlannedShot
MediaAsset
MediaSegment
Relationship
Edit
EditEvent
Annotation
GenerationJob
GeneratedAsset
Deliverable
```

### NarrativeNode

Possible types:

- idea;
- beat;
- scene;
- script block.

### PlannedShot

Represents intent independently from its realization.

A shot can have multiple representations:

```text
Shot 13B
├── storyboard.jpg
├── previs_gen_v01.mp4
├── gen_take_01.mp4
├── camera_take_01.mov
└── camera_take_02.mov
```

### MediaAsset / MediaSegment

A media asset is a physical/logical file. A segment identifies a meaningful time range within it and may carry transcription, description, embeddings, ratings, and links.

### Relationship

Examples:

```text
Beat ↔ Script block
Beat ↔ Planned shot
Planned shot ↔ Media segment
Media segment ↔ Timeline item
Timeline item ↔ Review annotation
Generation job ↔ Planned shot
Generated asset ↔ Generation job
```

Relationships should carry provenance/confidence where applicable because some links may be suggested by AI rather than manually confirmed.

## Generated media model

Generative AI is treated as another source of production media.

```text
Shot 07A
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

The same logical generated take may have multiple quality representations.

## Resolve responsibilities

Do not reimplement unless required:

- proxy generation;
- codec handling;
- playback;
- frame-accurate editing;
- compositing;
- color;
- audio post;
- delivery.

Salai should generate or organize normal production assets and hand them to Resolve.

## Open technical questions

1. Which current Resolve operations are exposed reliably through Workflow Integration vs scripting APIs?
2. Can Salai reliably identify the current selected Media Pool item and timeline item?
3. Can it react to playhead/selection/project changes?
4. Can it create bins, import media, set metadata, add markers, and construct timelines/source ranges robustly?
5. What identifiers survive project reopen, duplication, relinking, and timeline edits?
6. Which data should be mirrored into Resolve metadata/markers for portability and which should remain Salai-only?
7. Should the first app be Electron/Tauri/native, and how should that choice interact with Resolve's own Electron-based Workflow Integrations?
