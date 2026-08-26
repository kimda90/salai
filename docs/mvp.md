# Salai MVP and Technical Spikes

## MVP goal

Validate Salai's semantic scripting and production-graph model before investing in broad Resolve, GenAI, or production-platform implementation.

The largest current product uncertainty is not whether Resolve can be automated. CutMaster provides a credible path for that infrastructure. The larger unknown is whether one structured narrative model can support:

- blank-page/script-first authoring;
- AV-style visual/audio planning;
- stable links to ShotIntents and later production assets;
- duration-aware restructuring;
- footage-first/reverse scripting;
- AI-assisted structural editing without destroying production relationships.

The MVP should ultimately prove six things:

1. One semantic narrative model can represent script-first and footage-first work.
2. Narrative and audiovisual timing concepts can remain distinct without becoming cumbersome.
3. Script objects can remain linked to ShotIntents/assets through revisions.
4. Existing media can act as source evidence rather than being flattened into editable prose.
5. Resolve can consume downstream decisions through CutMaster without Salai becoming an NLE.
6. Generated media can enter the same production flow as captured media.

# Phase 0 — Scripting foundation

The previous single scripting spike is intentionally split into three smaller experiments so failures remain attributable.

## Spike 0A — Narrative IR

This is the immediate implementation priority.

### Core question

Can one stable semantic model represent:

1. a short script-first product video;
2. an audio-driven interview/corporate piece;
3. a footage-first mini-documentary;

without separate schemas or large amounts of workflow-specific logic?

### Model hypothesis

```text
Script
└── Section
    └── Beat                 semantic narrative unit
        ├── Cue              audiovisual/temporal moment
        │   ├── visual[]
        │   └── audio[]
        └── Cue
```

`Scene` is optional for projects that need traditional scene structure.

The important distinction to validate is:

```text
Beat = what the story means/does
Cue  = what happens audiovisually at a moment
```

A Beat can therefore contain several AV rows/moments without being split into several narrative ideas.

### Content semantics

The first model must distinguish authored copy from media-backed source material.

```text
AuthoredSpeech
- editable text created for the production

SourceExcerpt
- reference to an existing MediaSegment
- source in/out
- transcript display/snapshot
```

Editing a SourceExcerpt transcript must not imply that the underlying recorded media changed.

### Implementation boundary

Implement as a pure TypeScript package:

```text
packages/script-model/
```

Do not introduce UI/runtime/infrastructure dependencies in 0A.

### Required capabilities

- explicit `Script`, `Section`, optional `Scene`, `Beat`, `Cue`, and `ContentBlock` types;
- stable IDs;
- minimal typed visual/audio blocks;
- `AuthoredSpeech` and `SourceExcerpt` semantics;
- Beat/Cue ↔ ShotIntent references;
- SourceExcerpt ↔ MediaSegment references;
- create/update/move/split/merge/delete operations;
- serialization/deserialization;
- duration estimation;
- validation/invariants;
- explicit structural operation format;
- invertible/undoable operations where practical.

### Required fixtures

#### Fixture A — 30-second product video

Script-first:

```text
Hook
Problem
Demo
Benefit
CTA
```

Exercises authored VO, graphics/visual descriptions, several Cues per Beat, ShotIntent references, and target duration.

#### Fixture B — 2-minute interview/corporate piece

Exercises SourceExcerpts, authored VO bridges, B-roll over interview audio, and audiovisual overlap.

#### Fixture C — footage-first mini-documentary

Starts from mocked `MediaSegment[]` and constructs the narrative using sourced evidence.

The same core domain types must support all three fixtures.

### Identity rules to test

```text
edit fields
→ same ID

move/reorder
→ same ID and links

split Beat
→ one original ID retained
→ one new ID created
→ relationship policy explicit

merge Beats
→ one canonical ID retained
→ provenance from merged Beat recorded

delete narrative object
→ linked external production objects are not silently deleted

serialize/deserialize
→ IDs/order/content/relationships preserved
```

### Duration hypothesis

A Cue is approximately concurrent audiovisual content:

```text
Cue duration = explicit duration
  OR max(
    authored speech estimate,
    SourceExcerpt duration,
    visual hold estimate
  )

Beat duration = sum(Cues)
```

The estimate needs to be useful for authoring, not frame-accurate.

### Operation vocabulary

Useful changes should be expressible as explicit operations before any real LLM is introduced.

Candidate operations (abbreviated; the authoritative Spike 0A list is defined in [`narrative-ir-spec.md`](narrative-ir-spec.md)):

```text
createSection
createBeat
createCue
updateBlock
moveBeat
moveCue
splitBeat
mergeBeats
deleteBeat
linkShotIntent
unlinkShotIntent
linkMediaSegment
trimSourceExcerpt
```

A manually authored patch should be able to restructure a script while preserving IDs and reporting relationship effects.

### Success criterion

0A succeeds if:

- all three fixtures fit the same core model without special-case schemas;
- Beat and Cue remain meaningfully different concepts;
- authored and sourced speech coexist naturally;
- common edits preserve identity predictably;
- relationship outcomes are explicit;
- runtime estimation is structurally useful;
- meaningful revisions can be represented as domain operations.

No UI is required to pass 0A.

See `docs/scripting.md` for the detailed model.

## Spike 0B — Authoring UX

Only after the Narrative IR is credible, test whether humans can comfortably author and restructure it through familiar working methods.

### Minimal surfaces

Build a small React prototype testing four familiar surfaces over the same model (see `docs/workflows.md`):

1. **Story Wall** — Beat/Scene cards for structural reordering, including a parking-lot area and freeform IdeaCards;
2. **Outline** — hierarchical Section/Beat structure;
3. **AV Script** — Beat → Cue → Visual | Audio authoring;
4. **Paper/Radio Edit** — SourceExcerpt-driven construction.

Teleprompter remains a simple derived projection.

Across these surfaces the prototype must support:

- create/edit/reorder Beats and Cues;
- authored text editing;
- read-only/media-backed SourceExcerpt presentation;
- target and estimated runtime;
- simple ShotIntent relationship display.

### Editor framework decision

Do not assume Tiptap/ProseMirror is the canonical document model.

First test a normal React projection of the domain model. Add Tiptap/ProseMirror or Lexical only if richer text editing materially improves the authoring experience.

### Success criterion

A user can recognize each workflow without learning Salai's internal graph terminology, move between surfaces without export/import or duplicate story documents, and author naturally without feeling like they are editing database rows, while every surface remains a projection of the same domain model validated in 0A.

## Spike 0C — Assisted authoring

Only after the operation API and authoring UI are stable enough to inspect changes.

### Core question

Can an LLM propose useful structural changes without bypassing stable identity and relationship rules?

### Flow

```text
Narrative IR
    ↓
LLM proposes domain operations
    ↓
validate patch
    ↓
show structural/runtime/relationship diff
    ↓
review / apply / reject
```

Example:

```text
update authored speech in cue_12
move beat_4 after beat_1
delete beat_2
```

The UI should show runtime before/after and any relationship impact.

### Success criterion

AI-assisted restructuring behaves like a reviewable transaction against the same operation system humans use, rather than whole-document replacement.

# Phase 1 — Minimal desktop/local service shell

Once the narrative model and basic authoring UX are viable, package the prototype as real local production software.

### Electron responsibilities

- launch the local Python service;
- wait for a health/ready signal;
- host the React renderer;
- choose/open a real project directory;
- retain local project access;
- expose a narrow secure preload API.

Use:

- `contextIsolation: true`;
- `nodeIntegration: false`.

### Python service responsibilities

- FastAPI HTTP/WebSocket API;
- SQLite project state;
- later filesystem/media/Resolve/GenAI integrations.

Do not move the canonical Narrative IR into Python merely because persistence lives there; TypeScript and Python boundaries should use an explicit versioned schema.

# Phase 2 — Production graph foundation

Formalize downstream relationships after the script model is stable.

Implement:

- Project
- Script/domain narrative objects
- ShotIntent
- Asset
- MediaSegment
- Relationship
- Annotation
- ResolveBinding

Use SQLite. Do not introduce a graph database.

### Required flow

1. Persist the validated Narrative IR.
2. Link Beat/Cue objects to ShotIntents.
3. Link dummy MediaSegments/Assets to ShotIntents or SourceExcerpts.
4. Edit/reorder/split narrative content and inspect relationship behavior.
5. Query coverage from the graph.

# Phase 3 — CutMaster / Resolve vertical slice

Resolve integration follows the scripting/production model rather than driving it.

Do not write broad Resolve wrappers from scratch.

Prove:

```text
Salai → CutMaster → DaVinci Resolve Studio
```

Required experiments:

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

If CutMaster covers the required vertical slice reliably, keep it as upstream Resolve infrastructure.

# Phase 4 — Asset boundary / OpenAssetIO spike

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
- determine the minimal Salai trait set.

# Phase 5 — Reverse scripting with real media

Replace mocked SourceExcerpts/MediaSegments with real media-derived material.

Minimal pipeline:

```text
local media
   ↓
transcript / lightweight visual description / metadata
   ↓
MediaSegments
   ↓
user/AI selection and grouping
   ↓
Beats/Cues with SourceExcerpt relationships
```

Success means the Narrative IR behaves the same way with real evidence as it did with mocked Fixture C.

# Phase 6 — Paper edit

Create a story-level edit representation independent from a Resolve timeline.

A PaperEdit is an ordered set of narrative/media choices with approximate duration and intent.

Required operations:

- select narrative Beats/Cues;
- choose linked MediaSegments/realizations;
- reorder structure;
- duplicate into alternatives;
- compare structural differences;
- materialize the chosen version as a Resolve timeline through CutMaster.

OpenTimelineIO may be derived for interchange, but PaperEdit retains Salai narrative semantics.

# Phase 7 — GenAI production-media spike

Add generation only after ShotIntent and ordinary media relationships work.

Initial operations:

- `text_to_image`;
- `image_to_video`.

Initial backend: ComfyUI.

Required flow:

1. Beat/Cue requires a ShotIntent.
2. ShotIntent lacks a realization.
3. User requests a generated alternative.
4. Salai executes a registered Comfy workflow.
5. Output becomes a normal Asset with provenance.
6. Asset is linked to the ShotIntent.
7. Asset is imported into Resolve through CutMaster.
8. Where useful, it becomes another Resolve take.

# Interchange after the model stabilizes

Fountain and FDX are useful interoperability targets, but they are intentionally excluded from Narrative IR Spike 0A.

Once the model is validated:

```text
Fountain / FDX
      ↕ adapters
Salai Narrative IR
```

Do not let interchange formats determine canonical storage or relationship semantics.

# Explicit non-goals for Spike 0A

Do not build:

- Electron;
- Python/FastAPI;
- SQLite;
- Tiptap/ProseMirror/Lexical integration;
- real LLM calls;
- Fountain/FDX parsing;
- Resolve integration;
- real transcription/computer vision;
- collaboration/CRDT;
- polished UI;
- full screenplay formatting.

# Immediate implementation stack

For **Spike 0A only**:

```text
TypeScript
pnpm
unit tests
packages/script-model/
```

Broader planned stack remains:

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
- CutMaster
- OpenAssetIO
- OpenTimelineIO
- ComfyUI
- FFmpeg / ffprobe
```

The immediate goal is intentionally smaller than the application architecture: prove the narrative model before building the application around it.