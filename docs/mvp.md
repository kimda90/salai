# Salai MVP and Technical Spikes

## MVP goal

Validate that Salai's semantic scripting and production-graph model is useful before investing in broad Resolve, GenAI, or production-platform implementation.

The largest current product uncertainty is not whether Resolve can be automated. CutMaster provides a credible path for that infrastructure. The larger unknown is whether one structured narrative model can support:

- blank-page/script-first authoring;
- AV-style visual/audio planning;
- stable links to ShotIntents and later production assets;
- runtime-constrained rewriting;
- footage-first/reverse scripting;
- AI-assisted structural editing without destroying production relationships.

The MVP should ultimately prove six things:

1. A semantic script with stable object identity feels natural to author.
2. Outline, AV Script, Teleprompter, and later coverage views can derive from the same model.
3. Script objects can remain linked to ShotIntents/assets through revisions.
4. Existing footage can become evidence for a narrative structure using the same model.
5. Resolve can consume downstream decisions through CutMaster without Salai becoming an NLE.
6. Generated media can enter the same production flow as captured media.

## Phase 0 — Structured scripting spike

This is the current highest-priority product-risk spike.

It should run without Resolve and without real footage analysis.

### Core hypothesis

A Salai script is not an opaque text document and is not necessarily a screenplay.

It is a structured narrative model with stable IDs. Different authoring/production views are projections of that model.

Initial semantic hierarchy:

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

`Beat` is the initial smallest narrative unit Salai reasons about.

### Initial editor direction

Prototype with Tiptap / ProseMirror using custom schema nodes and stable IDs.

Keep the first schema intentionally small:

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

Lexical remains a fallback candidate if the spike reveals a materially better fit.

### Required experiments

1. Create sections and Beats.
2. Edit visual and audio content naturally.
3. Move/reorder Beats while preserving identity.
4. Split and merge Beats and define relationship behavior.
5. Toggle between Outline and AV Script views.
6. Derive a Teleprompter view from the same document.
7. Link dummy ShotIntents to Beats.
8. Persist/reopen with IDs and links intact.
9. Set a target duration and continuously estimate runtime.
10. Have an LLM propose a rewrite as explicit structured operations rather than replacement text.
11. Review/apply/reject the AI patch.
12. Import/export a small Fountain example.
13. Build a small reverse-script structure from mocked footage-derived MediaSegments.

### Structural identity rules to validate

Initial hypothesis:

- text edits preserve object ID;
- move/reorder preserves object ID;
- split creates a new object and requires explicit relationship redistribution;
- merge retains one canonical ID and records provenance from the merged object;
- delete does not silently delete linked production objects;
- structural operations are transactional and undoable.

### AI editing rule

Do not use:

```text
script blob → LLM → replacement script blob
```

Prefer:

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

### Success criterion

The scripting spike succeeds when one semantic model can support Outline, AV Script, and Teleprompter views while preserving stable IDs/relationships through common edits, and when both script-first and mocked footage-first authoring fit the same model.

See `docs/scripting.md` for the detailed model and open questions.

## Phase 0.5 — Electron / local service shell

Build only enough desktop runtime to host the scripting prototype and prove local application lifecycle.

### Electron responsibilities

- launch the local Python service;
- wait for a health/ready signal;
- open the React renderer;
- choose/open a real local project directory;
- retain the project path across sessions;
- expose a narrow secure preload API.

Use:

- `contextIsolation: true`;
- `nodeIntegration: false`.

### Python service responsibilities

- FastAPI HTTP/WebSocket API;
- SQLite project state;
- scripting/domain persistence;
- later filesystem/media/Resolve/GenAI integrations.

### Success criterion

The structured scripting prototype persists as a real local Salai project inside the Electron application without relying on browser filesystem permissions.

## Phase 1 — Production graph foundation

Once the scripting model is validated, formalize the minimum domain graph around it.

Implement:

- Project
- NarrativeNode
- ShotIntent
- Asset
- MediaSegment
- Relationship
- Annotation
- ResolveBinding

Use SQLite. Do not introduce a graph database.

### Required flow

1. Create a script containing Sections/Beats.
2. Link one Beat to several ShotIntents.
3. Link a dummy Asset/MediaSegment realization to a ShotIntent.
4. Edit/reorder/split narrative content and inspect how those links behave.
5. Query coverage from the graph.

Success means Salai can answer:

- What visual/production intent supports this Beat?
- Which ShotIntents have no realization?
- Which assets/segments realize a ShotIntent?
- Which production relationships changed when the script structure changed?

## Phase 1.5 — CutMaster / Resolve vertical slice

Resolve integration is still required, but it follows the scripting model rather than driving it.

Do not write broad Resolve wrappers from scratch.

Prove:

```text
Salai → CutMaster → DaVinci Resolve Studio
```

### Required experiments

- read current project/timeline context;
- identify Media Pool/timeline items;
- import media;
- map timeline items to source Media Pool items;
- write/read third-party/custom metadata where useful;
- add/read markers/custom data;
- create a timeline from explicit source ranges;
- append/insert known ranges;
- add an alternative asset as a Resolve take;
- inspect identifier behavior across restart/duplication/export-import;
- determine polling/event strategy for current Resolve context.

### Adoption criterion

If CutMaster covers the required vertical slice reliably, keep it as upstream Resolve infrastructure and add only small Salai-specific adapters where required.

## Phase 2 — Asset boundary / OpenAssetIO spike

Use OpenAssetIO only at the asset boundary.

Validate:

```text
salai://project/<project-id>/assets/<asset-id>
        ↓
OpenAssetIO
        ↓
local project-controlled path
```

Required experiments:

- create an Asset with an entity reference;
- resolve it to a local path;
- publish/register a new asset;
- preserve identity if concrete location changes;
- determine the minimal Salai trait set;
- confirm narrative queries remain ordinary domain operations rather than OpenAssetIO calls.

## Phase 3 — Reverse scripting with real media

Move from mocked MediaSegments to real footage-derived material.

The purpose is not to build a full semantic-search product. It is to test whether footage can become narrative evidence.

### Minimal pipeline

```text
local media
   ↓
transcript / simple visual description / metadata
   ↓
MediaSegments
   ↓
topic/moment grouping
   ↓
proposed Beats with source relationships
```

### Required flow

1. Ingest a small interview/B-roll dataset.
2. Produce transcript-derived segments and lightweight visual descriptions.
3. Let the user select moments as narrative evidence.
4. Ask AI to propose a short structure.
5. Create Beats already linked to their source MediaSegments.
6. Rewrite/reorder the structure while retaining those links.

Success means footage-first work uses the same scripting model as blank-page authoring.

## Phase 4 — Paper edit

Create a story-level edit representation independent from a Resolve timeline.

A PaperEdit is an ordered set of narrative/media choices with approximate duration and intent.

Required operations:

- select narrative Beats;
- choose linked MediaSegments/realizations;
- reorder structure;
- duplicate into alternatives;
- compare structural differences;
- materialize the chosen version as a Resolve timeline through CutMaster.

OpenTimelineIO may be derived for interchange, but the Salai PaperEdit model retains narrative information beyond OTIO.

No frame-accurate NLE UI should be built.

## Phase 5 — GenAI backend spike

Add generation only after ShotIntent and asset relationships work with ordinary media.

Initial provider-neutral interface:

```text
GenerationBackend
- capabilities()
- validate(request)
- submit(request)
- status(job)
- cancel(job)
- result(job)
```

Initial operations:

- `text_to_image`;
- `image_to_video`.

Initial backend: ComfyUI.

Required flow:

1. Beat requires a ShotIntent.
2. ShotIntent has no usable realization.
3. User requests a generated alternative.
4. Salai fills a registered Comfy workflow manifest.
5. Output is copied/published into project-controlled storage.
6. Output becomes a normal Salai Asset.
7. Asset is linked as a ShotIntent realization.
8. Asset is imported into Resolve through CutMaster.
9. Where useful, it is added as another Resolve take.

Generated output never overwrites source media and retains provenance.

## Phase 6 — Broader AI-assisted reasoning

Only after the structured script and production graph work manually.

Potential capabilities:

- develop an idea into sections/beats;
- rewrite to target duration;
- compare alternative structures;
- suggest ShotIntents from visual narrative needs;
- suggest MediaSegment ↔ ShotIntent relationships;
- identify missing coverage;
- propose footage-first structures;
- explain changes before applying them;
- decide whether a missing realization should be searched, shot, generated, or left as placeholder.

AI suggestions remain reviewable and should carry provenance/confidence where appropriate.

## Explicit non-goals for early MVP

Do not build:

- a complete Final Draft replacement;
- page-perfect screenplay formatting;
- locked pages/revision colors;
- a frame-accurate NLE;
- a standalone color/compositing/audio system;
- broad custom Resolve scripting already covered by CutMaster;
- a custom asset-resolution standard already covered by OpenAssetIO;
- a ComfyUI node editor;
- a generic MAM;
- broad cloud collaboration;
- full CRDT/multi-user editing before the local model is validated;
- every screenplay interchange format;
- every GenAI provider.

## First product validation scenario

Use one concrete 30–60 second piece.

### Script-first

1. Start with an idea.
2. Build 5–8 Beats using Outline view.
3. Switch to AV Script view and author visual/audio intent.
4. Set a 30- or 60-second target and refine against runtime estimate.
5. Link 8–15 ShotIntents.
6. Ask AI for a shorter structural alternative and review the patch.

### Footage-first

7. Start a second version from a small set of interview/B-roll MediaSegments.
8. Build/propose Beats with source relationships.
9. Compare the footage-first and blank-page structures.

### Downstream production

10. Link real footage realizations.
11. Observe coverage gaps.
12. Generate one missing realization through ComfyUI.
13. Build two PaperEdit alternatives.
14. Materialize one into Resolve through CutMaster.

The first milestone should stop much earlier than step 14: the immediate goal is to validate steps 1–9 before expanding downstream.

## Initial implementation stack

```text
Desktop/UI
- Electron
- React
- TypeScript
- Vite
- Tiptap / ProseMirror (initial scripting editor candidate)
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

Interchange
- Fountain import/export initially
- FDX later if justified
```
