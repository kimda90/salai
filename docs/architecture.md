# Salai Architecture

## Architectural thesis

Salai owns the production and narrative context of a video project while reusing mature open-source infrastructure for Resolve automation, asset resolution, editorial interchange, media processing, and generative execution.

The product-specific engineering effort should concentrate on the relationship between:

`idea ↔ narrative IR ↔ shot intent ↔ asset realization ↔ editorial use ↔ review/revision`

The current highest-risk part of this architecture is the **Narrative IR / scripting model**, not Resolve automation.

Salai should avoid rebuilding infrastructure that can be consumed behind a stable, permissively licensed interface.

## High-level shape

```text
                         SALAI

                   Narrative IR
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Story          Shot Intent      Assets
          │              │              │
 Sections/Beats       Coverage      OpenAssetIO
      Cues               │              │
 Visual / Audio          │              │
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
```

# Narrative IR

## Script is domain data, not an editor document

The canonical scripting model should exist independently from React, Tiptap, ProseMirror, Lexical, HTML, Fountain, or any particular persistence layer.

Initial explicit domain hierarchy:

```text
Script
└── Section
    ├── optional Scene
    │   └── Beat
    │       └── Cue
    └── Beat
        ├── Cue
        └── Cue
```

The implementation should use explicit discriminated types and allowed relationships rather than a generic recursively nestable `NarrativeNode` as the primary data structure.

`NarrativeNode` may remain useful shorthand in diagrams and generic relationship APIs.

## Beat and Cue have different responsibilities

### Beat

A Beat is the semantic narrative unit: the idea, revelation, argument, action, or change that advances the story.

### Cue

A Cue is an audiovisual/temporal unit inside a Beat: a moment where visual and audio content occur together or overlap approximately.

This distinction allows one narrative idea to contain several AV rows without incorrectly turning every shot/moment into a separate Beat.

```text
Beat: installation is simple

Cue 1  wide installation      VO begins
Cue 2  connector close-up     VO continues
Cue 3  UI confirmation        SFX
Cue 4  reaction               music rises
```

`Cue` is a working domain term and remains subject to validation in Spike 0A.

## ContentBlock semantics

Cues contain typed content blocks.

Minimal initial types:

```text
Visual
- VisualDescription
- OnScreenText
- Graphic

Audio
- AuthoredSpeech
- SourceExcerpt
- Music
- SFX
```

The model should grow only when real fixtures require additional types.

## Authored content and sourced evidence are different

`AuthoredSpeech` represents editable copy created for the production.

`SourceExcerpt` represents a specific time range in existing recorded media and points to a `MediaSegment`.

```text
AuthoredSpeech
- id
- text
- role/type

SourceExcerpt
- id
- mediaSegmentId
- source in/out
- transcript snapshot/display text
```

Changing authored copy changes the intended words.

Changing the displayed transcript of a SourceExcerpt must not pretend the underlying recording changed. Trimming, replacing, unlinking, or paraphrasing sourced material are distinct operations.

This distinction is central to using one Narrative IR for both script-first and footage-first workflows.

## Views are projections

The same Narrative IR should support multiple UIs:

```text
                     Narrative IR
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
    Outline          AV Script        Teleprompter
       │                 │                 │
 Section/Beat       Beat/Cue V|A      AuthoredSpeech
       │
       └──────────── Coverage / ShotIntent
```

No view is canonical storage.

A later screenplay-like projection may add scene headings, action, character/dialogue formatting, but it should not determine the first data model.

## ShotIntent relationships

`ShotIntent` remains separate from narrative content.

Relationships may exist at Beat or Cue granularity:

```text
Beat ↔ ShotIntent
Cue  ↔ ShotIntent
```

The correct default granularity is deliberately left to the spike.

A ShotIntent is later realized by Assets or MediaSegments:

```text
ShotIntent
├── storyboard
├── captured takes
├── generated takes
├── stock material
└── graphics/composites
```

## Stable identity and structural operations

Narrative objects participate in the production graph, so structural editing must preserve identity and relationships intentionally.

Initial invariants:

- field/text edit preserves ID;
- move/reorder preserves ID and relationships;
- split creates new identity while retaining one original identity;
- merge retains one canonical identity and records provenance;
- deleting narrative structure never silently deletes linked external production objects;
- operations should be transactional and invertible/undoable where possible.

The exact relationship redistribution rules for split/merge are product questions to validate, not assumptions to hide in UI behavior.

## Structural operation API

The Narrative IR should expose explicit operations such as:

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
linkSourceExcerpt
```

This API provides the common control surface for:

- human editing;
- validation;
- undo;
- persistence transactions;
- future collaboration;
- future AI-assisted changes.

A real LLM is not needed to validate this layer.

## Runtime estimation

Cue-level timing is the initial runtime abstraction.

```text
Cue duration = explicit duration
  OR max(
    authored speech estimate,
    SourceExcerpt source duration,
    visual hold estimate
  )

Beat duration = sum(Cue durations)
```

The goal is useful 15/30/60/90-second authoring feedback, not frame-accurate editorial timing.

## Reverse scripting

Footage-first work uses the same Narrative IR.

```text
MediaSegments
     ↓
SourceExcerpts / visual evidence
     ↓
Cues
     ↓
Beats / Sections
```

A Beat can therefore emerge from existing material while retaining direct source relationships.

# Implementation staging

## Spike 0A — pure TypeScript Narrative IR

The first implementation should be isolated from application architecture:

```text
packages/script-model/
```

Dependencies should be minimal.

Do not introduce:

- Electron;
- React;
- editor frameworks;
- Python/FastAPI;
- SQLite;
- Resolve;
- real LLM calls;
- Fountain/FDX.

The purpose is to make domain-model changes cheap.

## Spike 0B — authoring UI

After 0A succeeds, build a React projection of the domain model.

Test plain React authoring controls first. Use Tiptap/ProseMirror or Lexical only where richer text editing provides concrete value.

The editor framework must not become the canonical domain representation.

## Spike 0C — assisted authoring

After the operation API and UX are inspectable, allow an LLM to propose validated operation patches.

```text
Narrative IR
   ↓
LLM proposed operations
   ↓
validation
   ↓
structural/runtime/relationship diff
   ↓
review/apply/reject
```

# Runtime architecture

The broader application remains a local desktop production application.

```text
┌─────────────────────────────────────────────┐
│                SALAI ELECTRON               │
│                                             │
│ Main process                                │
│ - native file/folder dialogs                │
│ - filesystem access/watching                │
│ - process lifecycle                         │
│ - OS integration                            │
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
│ production persistence                      │
│ CutMaster integration                       │
│ OpenAssetIO                                 │
│ OpenTimelineIO                              │
│ ComfyUI / GenAI adapters                    │
│ ffmpeg / ffprobe / analysis                 │
└─────────────────────────────────────────────┘
```

This runtime architecture should not be pulled into Narrative IR Spike 0A.

# Infrastructure boundaries

## CutMaster

Use the MIT-licensed CutMaster project as preferred Resolve automation infrastructure through stable/public surfaces where practical.

Salai decides *why* an operation occurs; CutMaster handles generic Resolve automation.

## OpenAssetIO

Use OpenAssetIO at the asset identity/resolution/publishing boundary only. It does not replace narrative or production-graph data.

## OpenTimelineIO

Use OTIO for editorial interchange where useful. `PaperEdit` remains a Salai domain model because it carries narrative intent beyond editorial interchange.

## ComfyUI

Treat GenAI as another source of production media. Register known workflows and expose only production-relevant parameters; do not recreate ComfyUI's node editor.

# Core data model direction

```text
Project
Script
Section
Scene?
Beat
Cue
ContentBlock
ShotIntent
Asset
MediaSegment
Relationship
PaperEdit
Annotation
GenerationJob
ResolveBinding
Deliverable
```

Important relationships include:

```text
Beat/Cue ↔ ShotIntent
SourceExcerpt ↔ MediaSegment
ShotIntent ↔ Asset/MediaSegment
MediaSegment ↔ Resolve timeline item
Annotation ↔ narrative/media/editorial object
GenerationJob ↔ ShotIntent
```

# Persistence boundary

Spike 0A validates serialization semantics only.

Later, the local project may use normalized SQLite tables, structured JSON plus indexes, or a hybrid. The storage choice must preserve the versioned Narrative IR and must not make editor state canonical.

# Interchange

Fountain and FDX are later adapters, not Spike 0A dependencies and not canonical storage.

```text
Fountain / FDX
      ↕
Narrative IR
```

# Technology baseline

Immediate Spike 0A:

```text
TypeScript
pnpm
unit tests
```

Broader application:

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

Infrastructure
- CutMaster
- OpenAssetIO
- OpenTimelineIO
- ComfyUI
- FFmpeg / ffprobe
```

No Rust/Tauri dependency is currently justified.

# Current open questions

## Narrative IR — highest priority

1. Is `Beat` semantically distinct enough from `Cue` to justify both levels?
2. Does `Cue` remain useful across product video, interview/corporate, and footage-first documentary fixtures?
3. Which content types are truly necessary in the smallest model?
4. Do `AuthoredSpeech` and `SourceExcerpt` cover the crucial authored-vs-sourced distinction cleanly?
5. Should ShotIntent links default to Beat, Cue, or allow both equally?
6. What split/merge relationship policies are least surprising?
7. Can runtime estimation be expressed cleanly at Cue level?
8. Can the operation vocabulary represent meaningful restructuring without escape-hatch mutation?
9. Does serialization preserve all required identity/invariants without committing to persistence technology?

## Authoring UX

10. Can a plain React projection make the domain model pleasant to author?
11. Where, if anywhere, is Tiptap/ProseMirror/Lexical actually needed?
12. Can Outline, AV Script, and Teleprompter remain projections rather than diverging documents?

## Downstream infrastructure

13. Which CutMaster public tools cover the required Resolve vertical slice?
14. What is the smallest useful OpenAssetIO trait/entity design?
15. How should Electron + Python be packaged cross-platform?
16. Which GenAI operations belong in the first production vertical slice?
