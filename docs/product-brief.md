# Salai Product Brief

## Product thesis

Salai is a local-first DaVinci Resolve companion for scripted and footage-first video creation.

Its core responsibility is not to replace Resolve. Salai maintains production context that traditional NLEs do not model well: what story is being told, why a piece of footage exists, what narrative intent it serves, what was planned before shooting, what source evidence exists, what coverage is missing, and how those relationships evolve across revisions and edits.

The central model is a persistent relationship between:

`idea ↔ narrative IR ↔ shot intent ↔ asset/source evidence ↔ timeline use ↔ review/revision`

Projects may enter this graph in either direction:

1. **Script-first** — idea → narrative structure → ShotIntents → capture/generation → edit.
2. **Footage-first** — existing media → meaningful MediaSegments → sourced evidence → narrative structure → paper edit/edit.

# Current product-risk focus: Narrative IR

Resolve automation has a credible infrastructure path through CutMaster. The larger unknown is the scripting/authoring model.

Salai should not assume that every project is a traditional screenplay or that a script is only formatted text.

Current hypothesis:

> A Salai script is stable semantic production data. Outline, AV Script, Teleprompter, Coverage, and later screenplay-like views are projections of the same Narrative IR rather than independent documents.

The first implementation should test this model without Electron, Resolve, a real LLM, or a rich-text editor framework.

## Beat and Cue

The working model separates narrative meaning from audiovisual timing.

```text
Beat = semantic narrative unit
Cue  = audiovisual/temporal moment within a Beat
```

Example:

```text
Beat: installation is simple

Cue 1  wide installation      VO begins
Cue 2  connector close-up     VO continues
Cue 3  UI confirmation        SFX
Cue 4  reaction               music rises
```

This allows one narrative idea to contain several AV-script rows/moments without forcing each shot into a separate Beat.

`Cue` is intentionally a working term that the spike may validate or reject.

## Authored vs sourced material

Footage-first work requires a distinction that normal screenwriting tools often do not need.

### AuthoredSpeech

Editable copy created for the production: voiceover, presenter copy, scripted dialogue.

### SourceExcerpt

A reference to words that already exist in recorded media, linked to a `MediaSegment` and source in/out.

The transcript of a SourceExcerpt is evidence/display data, not freely editable authored copy. Trimming, replacing, unlinking, or paraphrasing sourced material have different semantics.

This distinction is central to allowing script-first and footage-first projects to use the same Narrative IR.

# Target user

Initial target:

- solo videographers;
- small production teams and agencies;
- branded/corporate content producers;
- documentary/interview editors;
- YouTube and educational creators with professional post workflows.

The initial audience is expected to be comfortable with DaVinci Resolve Studio, but the scripting workflow must remain useful with Resolve closed.

# Product principles

## Local-first production software

Salai is a desktop production application, not a cloud-first media service.

It should be comfortable with large camera originals, project folders, NAS/network paths, local GenAI services, and Resolve without requiring all source media to be uploaded.

The broader application runtime remains Electron + React/TypeScript with a local Python service, but this runtime is downstream of validating the Narrative IR.

## Domain model before editor framework

The canonical script must not be defined by Tiptap, ProseMirror, Lexical, HTML, Fountain, or another presentation/interchange format.

First validate explicit domain types and operations in pure TypeScript.

A later authoring UI may use normal React controls, Tiptap/ProseMirror, Lexical, or a combination, depending on what the validated model actually needs.

## Stable identity

Narrative objects have stable IDs because they may link to:

- ShotIntents;
- source MediaSegments;
- annotations;
- production Assets;
- generated alternatives;
- editorial/Resolve objects.

Normal edits and moves should preserve identity. Split, merge, and delete must have explicit relationship policies.

## Multiple views, one narrative

The same Narrative IR should support:

- **Outline** — Section/Beat structural authoring;
- **AV Script** — Beat/Cue visual and audio intent;
- **Teleprompter** — derived authored spoken content;
- **Coverage** — Beat/Cue relationships to ShotIntents and realizations;
- later screenplay-like presentation where useful.

These are projections, not independent documents.

## Structural operations are the editing API

Useful changes should be represented by validated operations such as:

```text
createBeat
createCue
updateBlock
moveBeat
splitBeat
mergeBeats
deleteBeat
linkShotIntent
linkSourceExcerpt
```

This operation layer should eventually serve human edits, undo, persistence transactions, collaboration, and AI-assisted changes.

## AI proposes operations, not replacement documents

A real LLM is not part of the first Narrative IR spike.

First prove that meaningful revisions can be expressed manually through the operation vocabulary while preserving stable IDs and relationships.

Later:

```text
Narrative IR
    ↓
LLM proposes operations
    ↓
validate
    ↓
show structural/runtime/relationship diff
    ↓
review / apply / reject
```

## Duration is part of authoring

Target runtime is often a hard creative constraint.

Cue-level timing should support useful 15/30/60/90-second estimates based on:

- authored speech reading rate;
- SourceExcerpt source duration;
- explicit duration;
- visual-hold estimate.

The goal is structural feedback, not frame accuracy.

## Reverse scripting is first-class

Existing footage can be the starting point.

```text
MediaSegments
    ↓
SourceExcerpts / visual evidence
    ↓
Cues
    ↓
Beats / Sections
```

The user can restructure the resulting story while retaining links to the original material.

The goal is not merely semantic media search; it is turning available material into editable narrative structure.

## Intent is independent from realization

A `ShotIntent` represents what the production needs independently from how it is fulfilled.

A Beat or Cue may link to several ShotIntents, and a ShotIntent may support several narrative objects.

A ShotIntent may later be realized by:

- storyboard;
- generated previs;
- captured camera takes;
- generated takes;
- stock footage;
- graphics/composites.

## Reuse infrastructure; own production intelligence

Prefer mature, permissively licensed infrastructure instead of rebuilding commodity pipeline layers.

Current downstream direction:

- **CutMaster** for Resolve automation;
- **OpenAssetIO** at the asset identity/resolution/publishing boundary;
- **OpenTimelineIO** for editorial interchange;
- **ComfyUI** for initial local GenAI execution;
- **FFmpeg/ffprobe** for media utilities.

Fountain/FDX are later script interchange adapters, not canonical storage and not part of the first Narrative IR spike.

# Product boundary

## Salai owns

- Narrative IR and structural authoring semantics;
- Section/Scene?/Beat/Cue structures;
- typed visual/audio content;
- AuthoredSpeech vs SourceExcerpt semantics;
- stable narrative identity;
- duration-aware authoring;
- reverse scripting from media evidence;
- ShotIntent and coverage state;
- relationships between narrative, source material, assets, and editorial state;
- paper edits and alternative structures;
- review/annotations that survive editorial changes;
- AI-assisted structural/production reasoning;
- generation provenance and orchestration;
- synchronization with Resolve.

## Resolve owns

- production media playback/management;
- proxies/codecs;
- frame-accurate editing;
- Fusion compositing;
- color;
- Fairlight/audio post;
- delivery.

## Infrastructure projects own

Where suitable:

- CutMaster: generic Resolve automation;
- OpenAssetIO: standardized asset-manager integration;
- OpenTimelineIO: editorial interchange;
- ComfyUI/providers: model execution.

# Core user stories

## Script-first

- As a videographer, I want to turn an idea into an editable narrative before shooting.
- I want structural Beats to remain distinct from the individual audiovisual moments needed to express them.
- I want to move between Outline and AV Script views without maintaining separate documents.
- I want to see whether the current structure fits a duration target.
- I want to derive presenter/VO copy without copying it into another document.
- I want narrative objects to stay linked to their production intent through revisions.

## Footage-first

- As an editor, I want recorded interview excerpts to remain linked to their real source media.
- I want to mix sourced excerpts with newly authored VO without confusing the two.
- I want existing media to become evidence for Beats/Cues.
- I want to restructure a footage-derived narrative without losing source relationships.

## Assisted authoring

- I want AI to propose shorter or structurally different versions as explicit changes.
- I want to see runtime and relationship consequences before accepting those changes.
- I do not want the whole script silently replaced by generated text.

## Production / coverage

- I want Beat/Cue objects linked to ShotIntents so I know what needs to be captured, found, or generated.
- I want to know which ShotIntents already have usable realizations and which remain missing.

# Differentiation

Salai should not compete primarily on:

- traditional screenplay formatting;
- transcription;
- generic semantic search;
- automatic rough cuts;
- chat-controlled Resolve operations;
- standalone GenAI generation;
- effects.

The differentiator is a persistent **production graph whose narrative side is itself structured, editable, media-aware data**.

Positioning hypothesis:

> A workspace where the story, source material, production intent, generated assets, and Resolve edit stay connected.

More specific scripting hypothesis:

> Write from a blank page or from the footage you already have without losing the difference between authored story and recorded evidence.

# Current MVP priority

The immediate milestone is **Spike 0A — Narrative IR**.

Implement only a pure TypeScript `packages/script-model/` and validate three realistic fixtures:

1. 30-second script-first product video;
2. 2-minute interview/corporate piece;
3. footage-first mini-documentary from mocked MediaSegments.

The spike must validate:

- Beat vs Cue;
- AuthoredSpeech vs SourceExcerpt;
- stable IDs;
- structural operation semantics;
- ShotIntent/MediaSegment references;
- split/merge/delete relationship behavior;
- serialization round-trip;
- duration estimation.

Do **not** add Electron, React editor frameworks, Python, SQLite, Resolve, a real LLM, or Fountain/FDX until this model is credible.
