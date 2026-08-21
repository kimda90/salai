# Salai MVP and Technical Spikes

## MVP goal

Validate that a local Resolve companion with a persistent `story ↔ shot intent ↔ asset ↔ timeline` graph is useful before building a broad production platform.

The MVP should prove five things:

1. Salai can use CutMaster as the Resolve automation layer instead of rebuilding broad Resolve API coverage.
2. Narrative objects can remain linked to real/generated assets and Resolve timeline usage.
3. Paper-edit/story-level operations provide value above working directly in the NLE.
4. Generated media can enter the same production flow as captured media.
5. Electron + a local Python service provide a practical production runtime for local files, processes, and Resolve/Comfy integration.

## Phase 0 — CutMaster / Resolve vertical-slice spike

Do not begin by writing a general Resolve abstraction from scratch.

First prove the path:

```text
Salai test client → CutMaster → DaVinci Resolve Studio
```

### Required experiments

- connect CutMaster to the current Resolve instance;
- read the current Resolve project and timeline;
- enumerate Media Pool bins/items;
- map timeline items to source Media Pool items;
- read selected Media Pool/timeline items where supported;
- create a bin;
- import media;
- write/read third-party/custom metadata where supported;
- add/read markers and marker custom data where supported;
- create a timeline from explicit source ranges;
- append/insert clips at known record positions;
- add an imported/generated clip as a Resolve take;
- switch/read takes;
- inspect identifiers across Resolve restart;
- duplicate a timeline and inspect identifier behavior;
- duplicate/export/import a project and inspect identifier behavior;
- determine the polling/event approach needed for current selection/playhead/project state;
- verify timeout/error behavior when Resolve is unavailable or busy.

### Output

A capability matrix focused on Salai requirements rather than exhaustive Resolve coverage:

| Capability | CutMaster surface | Extra Salai code? | Reliable? | Notes |
|---|---|---|---|---|

### Adoption criterion

If CutMaster reliably covers the vertical slice, adopt it as upstream infrastructure and wrap only the small Salai-specific interface required by the domain.

Do not import undocumented CutMaster internals unless a stable/public route does not exist. Prefer its versioned MCP/public extension surfaces and contribute generally useful missing operations upstream where practical.

## Phase 0.5 — Electron / local service shell

Prove the desktop runtime before implementing significant product UI.

### Electron responsibilities

- launch the local Python service;
- wait for a health/ready signal;
- open the React renderer;
- choose/open a real local project directory;
- retain the project path across sessions;
- drag/drop local production files with actual filesystem paths;
- reveal/open local assets;
- observe local filesystem changes;
- start/stop optional child services where appropriate.

Use a secure renderer boundary:

- `contextIsolation: true`;
- `nodeIntegration: false`;
- narrow preload IPC API.

### Python service responsibilities

- FastAPI HTTP/WebSocket API;
- SQLite project state;
- project filesystem scanning/watching;
- CutMaster integration;
- OpenAssetIO integration;
- later ComfyUI and media analysis.

### Success criterion

A user can open a local production directory in the Electron application, Salai can index it through the Python service, and the same service can inspect the connected Resolve project through CutMaster.

## Phase 1 — Production graph prototype

Implement only these domain concepts:

- Project
- NarrativeNode (section/beat/scene/script block)
- ShotIntent
- Asset
- MediaSegment
- Relationship
- ResolveBinding
- Annotation

Use SQLite. Do not introduce a graph database.

### Required flow

1. Create a project and several narrative beats.
2. Create ShotIntents linked to those beats.
3. Register/import local media assets.
4. Sync enough Resolve context through CutMaster to identify Media Pool/timeline objects.
5. Manually link a Resolve clip or clip range to a ShotIntent.
6. Read a Resolve timeline and show which beats/ShotIntents are represented.

Success means Salai can answer:

- Which assets/segments realize this ShotIntent?
- Which ShotIntents still have no usable realization?
- Where is this media/shot used in the current Resolve timeline?
- Which narrative beats are absent from the edit?

## Phase 1.5 — OpenAssetIO spike

Use OpenAssetIO only at the asset boundary.

Implement the smallest useful local manager/host experiment:

```text
salai://project/<project-id>/assets/<asset-id>
        ↓
OpenAssetIO
        ↓
local project-controlled path
```

### Validate

- create a Salai asset with an entity reference;
- resolve it to a local filesystem path;
- publish/register a newly generated asset;
- preserve stable identity if its concrete location changes;
- determine the minimal trait set Salai needs;
- verify that introducing OpenAssetIO does not complicate ordinary narrative/domain queries.

OpenAssetIO should not become a requirement for querying scenes, beats, reviews, or other non-asset objects.

## Phase 2 — Paper edit

Create a story-level edit representation independent from a Resolve timeline.

A paper edit is an ordered set of narrative/media segments with approximate duration and intent.

Required operations:

- drag/reorder beats;
- choose a linked media segment/take;
- duplicate a paper edit into an alternative version;
- compare high-level structural differences;
- materialize the selected paper edit as a new Resolve timeline through CutMaster.

OpenTimelineIO may be generated for interchange/inspection, but the Salai PaperEdit model should retain narrative information beyond OTIO.

No frame-accurate NLE UI should be built.

## Phase 3 — GenAI backend spike

Define a minimal provider-independent interface.

```text
GenerationBackend
- capabilities()
- validate(request)
- submit(request)
- status(job)
- cancel(job)
- result(job)
```

### Initial operations

Limit to:

- `text_to_image`;
- `image_to_video`.

These are sufficient to validate storyboard/previs/missing-coverage workflows.

### Initial backend

Start with ComfyUI.

The spike should:

1. register a known workflow plus a Salai workflow manifest;
2. expose selected workflow inputs such as prompt, source image, seed, and duration where applicable;
3. submit the workflow programmatically;
4. observe queue/execution state;
5. retrieve the output;
6. copy/publish the output into project-controlled storage;
7. create provenance records;
8. register the result as a normal Salai Asset;
9. import it into Resolve through CutMaster;
10. link it to a ShotIntent;
11. optionally add it as a Resolve take alongside a captured realization.

### Generated take behavior

A generated result should behave like another realization/take:

```text
ShotIntent 07A
├── camera-01.mov
├── camera-02.mov
├── gen-01.mp4
└── gen-02.mp4
```

No generated result should overwrite source media.

### Quality lifecycle

Support the concept, even if the spike only implements two levels:

```text
DRAFT → PREVIEW → FINAL
```

A final regeneration should remain linked to the same generation family/intent rather than silently replacing the preview.

## Phase 4 — AI-assisted linking/reasoning

Only after the graph, CutMaster integration, and GenAI ingest flow work manually.

Potential capabilities:

- break script into beats and suggested ShotIntents;
- suggest clip/segment ↔ ShotIntent links;
- identify missing coverage;
- describe footage and propose narrative groupings;
- propose alternate paper-edit structures;
- explain structural changes before applying them;
- decide whether a missing realization should be searched, shot, generated, or represented temporarily.

AI suggestions should carry provenance/confidence and remain user-confirmable.

## Explicit non-goals for MVP

Do not build:

- a frame-accurate NLE;
- a standalone color system;
- a compositor;
- an audio workstation;
- a render farm;
- broad custom Resolve scripting already covered by CutMaster;
- a custom asset-resolution standard already covered by OpenAssetIO;
- a proxy/media transcoding platform beyond what integration requires;
- a ComfyUI node editor;
- a generic MAM;
- broad cloud collaboration;
- mobile capture tooling;
- every GenAI provider;
- a Rust/Tauri desktop stack without a concrete requirement.

## First validation scenario

Use one concrete 30–60 second scripted piece.

1. Open a real local project directory in Salai Electron.
2. Write 5–8 narrative beats.
3. Plan 8–15 ShotIntents.
4. Import a small real footage set into Resolve.
5. Through CutMaster, identify/import/link footage to ShotIntents.
6. Observe coverage gaps.
7. Generate one missing realization through ComfyUI.
8. Publish/register it as a Salai Asset and ingest it into Resolve.
9. Add the generated option as a normal timeline item or alternate Resolve take.
10. Build two paper-edit alternatives.
11. Materialize one as a Resolve timeline through CutMaster.
12. Change the Resolve timeline and inspect how much linkage Salai can preserve/recover.

This end-to-end scenario is the primary product/architecture test before expanding scope.

## Initial implementation stack

```text
Desktop/UI
- Electron
- React
- TypeScript
- Vite
- pnpm

Backend
- Python 3.11+
- FastAPI
- Pydantic
- SQLite
- uv

Infrastructure
- CutMaster (Resolve automation)
- OpenAssetIO (asset identity/resolution boundary)
- OpenTimelineIO (editorial interchange)
- ComfyUI (initial GenAI execution)
- FFmpeg / ffprobe (media utilities)
```
