# Salai Product Brief

## Product thesis

Salai is a local-first DaVinci Resolve companion for scripted and footage-first video creation.

Its core responsibility is not to replace Resolve. Instead, Salai maintains the production context that traditional NLEs do not model well: what story is being told, why a piece of footage exists, what narrative intent it serves, what was planned before shooting, what coverage exists, how generated media relates to real media, and how those relationships evolve across revisions and edits.

The central model is a persistent relationship between:

`idea ↔ structured narrative ↔ shot intent ↔ asset/take ↔ timeline use ↔ review/revision`

Projects may enter this graph in either direction:

1. **Script-first** — idea → structured narrative → ShotIntents → capture/generation → edit.
2. **Footage-first** — existing footage → meaningful MediaSegments → proposed narrative structure → script/paper edit → edit.

## Current product-risk focus: scripting

Resolve automation has a credible infrastructure path through CutMaster. The larger unknown is the authoring model itself.

Salai should not assume that every project is a traditional screenplay or that a script is only formatted text.

Current hypothesis:

> A Salai script is a structured narrative model with stable identity. Outline, AV Script, Teleprompter, coverage, and later screenplay-like views are projections of that same model rather than separate documents.

The initial authoring bias is **AV-script-first** because the target user often needs to reason explicitly about visual and audio intent.

`Beat` is the initial smallest narrative unit Salai reasons about. `Scene` remains optional so short-form work can use structures such as Hook / Problem / Demo / Benefit / CTA without being forced into screenplay conventions.

See `docs/scripting.md` for the detailed model.

## Target user

Initial target:

- solo videographers;
- small production teams and agencies;
- branded/corporate content producers;
- documentary/interview editors;
- YouTube and educational creators with professional post workflows.

The initial audience is expected to be comfortable with DaVinci Resolve Studio, but the scripting workflow must remain fully useful when Resolve is closed.

## Product principles

### Local-first production software

Salai is a desktop application, not a cloud-first media service.

It should be comfortable with large camera originals, project folders, NAS/network paths, local GenAI services, and applications such as Resolve without requiring all source media to be uploaded.

The primary runtime is expected to be Electron with a React/TypeScript UI and a local Python service.

### Script is semantic data

The script is not an opaque text blob.

Narrative objects have stable IDs because they may be linked to ShotIntents, source MediaSegments, annotations, generated alternatives, and editorial objects.

Normal text editing should preserve identity. Structural edits such as split/merge/delete must have explicit, reviewable relationship behavior.

### Multiple views, one narrative

The same structured script should support:

- **Outline** — sections/scenes/beats and structural authoring;
- **AV Script** — visual and audio intent side by side;
- **Teleprompter** — derived spoken material;
- **Coverage** — Beats connected to ShotIntents and realizations;
- later screenplay-like presentation where useful.

These are not independent documents.

### AI proposes structural operations

LLM assistance should normally propose reviewable operations against stable narrative objects rather than return replacement script text.

For example:

```text
update beat_17
remove beat_16
move beat_18 before beat_17
insert a new beat after beat_21
```

This makes rewriting auditable and protects production relationships.

### Duration is part of authoring

Target runtime is often a hard constraint for the intended market.

Salai should continuously estimate runtime from spoken copy, explicit Beat timing, visual holds, and later linked media. AI-assisted requests such as "make this a 30-second version" should operate against that constraint.

### Reverse scripting is first-class

Existing footage can be the starting point.

Salai should be able to turn transcripts, selected moments, visual descriptions, and MediaSegments into proposed Beats already linked to their source evidence. The user can then rewrite/reorder the resulting narrative using the same editor used for blank-page scripting.

The goal is not merely semantic media search; it is **turning available material into editable narrative structure**.

### Intent is independent from realization

A `ShotIntent` represents what the production needs independently from how it is fulfilled.

One ShotIntent may be realized by:

- a storyboard;
- generated previs;
- captured camera takes;
- generated takes;
- stock footage;
- graphics/composites.

A Beat can require several ShotIntents, and a ShotIntent may support several Beats.

### Reuse infrastructure; own production intelligence

Prefer mature, permissively licensed infrastructure instead of rebuilding commodity pipeline layers.

Current direction:

- **Tiptap / ProseMirror** for the initial structured-editor prototype;
- **CutMaster** for broad Resolve automation;
- **OpenAssetIO** at the asset identity/resolution/publishing boundary;
- **OpenTimelineIO** for editorial interchange;
- **ComfyUI** as the initial local GenAI execution backend;
- **FFmpeg/ffprobe** for media utilities;
- **Fountain** for initial screenplay-oriented interchange, not canonical storage.

Salai's differentiated engineering should concentrate on the structured narrative and production graph connecting these systems.

### Generated media is normal media

GenAI is not a separate editing mode. Generated images, video, audio, plates, graphics, or cleanup results become normal production assets with provenance and can be reviewed, selected, ingested, edited, graded, composited, mixed, and rendered through the normal workflow.

## Product boundary

### Salai owns

- structured idea/script/story development;
- sections/scenes/beats and typed visual/audio content;
- stable narrative identity through revisions;
- duration-aware authoring;
- reverse scripting from footage-derived material;
- ShotIntent and coverage state;
- links between narrative elements and assets/segments;
- review/annotations that survive editorial changes;
- paper edits and alternative structures;
- AI-assisted structural/production reasoning;
- GenAI generation jobs and provenance;
- production asset identity/context;
- synchronization/orchestration with Resolve.

### Resolve owns

- original media playback and production media management;
- proxies and codecs;
- frame-accurate editing;
- Fusion compositing;
- color;
- Fairlight/audio post;
- rendering/delivery.

Salai should prefer invoking or complementing Resolve capabilities rather than reimplementing them.

### Infrastructure projects own

Where suitable:

- Tiptap/ProseMirror provide structured editor infrastructure;
- CutMaster owns generic Resolve automation plumbing;
- OpenAssetIO owns standardized asset-manager integration semantics;
- OpenTimelineIO owns portable editorial interchange semantics;
- ComfyUI/providers own model execution.

Salai wraps these systems behind its own domain concepts rather than leaking infrastructure details throughout the product.

## Core user stories

### Blank-page / script-first

- As a videographer, I want to develop an idea into an editable narrative before shooting so I can reduce wasted production time.
- As a videographer, I want to move between an outline and AV script without maintaining separate documents.
- As a videographer, I want to see how close the current script is to a 15/30/60-second target.
- As a videographer, I want visual and audio intent represented separately where useful.
- As a videographer, I want the narrative broken into Beats and ShotIntents so I know what coverage is required.
- As a presenter/editor, I want a Teleprompter view derived from the same script rather than copied manually.

### AI-assisted writing

- As a videographer, I want AI to propose shorter or structurally different versions while showing exactly which Beats would change.
- As a videographer, I want AI changes to preserve links to shots/assets whenever the underlying narrative object still represents the same intent.
- As a videographer, I want to accept/reject structural changes rather than have the entire script silently replaced.

### Footage-first / reverse scripting

- As a videographer, I want to ingest existing/random footage and understand what useful narrative material exists.
- As a videographer, I want selected interview moments and visual material to become source evidence for proposed Beats.
- As a videographer, I want AI to suggest possible structures from existing material.
- As an editor, I want to rewrite/reorder those Beats without losing the links back to the source moments.

### Production / coverage

- As a videographer, I want to know which ShotIntents have usable realizations and what remains missing.
- As an editor, I want captured clips linked back to their intended narrative purpose.

### Editorial / review

- As an editor, I want to compare multiple story structures using the same footage.
- As an editor, I want an approved PaperEdit to materialize as a Resolve timeline/assembly.
- As a reviewer, I want comments linked to underlying media/narrative elements rather than only volatile timeline timecodes.

### Generative media

- As an editor, I want to generate missing coverage, inserts, plates, cleanup variants, audio, or other assets from within production context.
- As an editor, I want generated results ingested into Resolve and treated like normal production media.
- As an editor, I want generated assets to retain provenance so they can be reproduced, varied, or regenerated at final quality.
- As an editor, I want real and generated realizations of the same ShotIntent to be comparable as normal alternatives/takes.

## Differentiation

Salai should not compete primarily on:

- traditional screenplay formatting;
- transcription;
- generic semantic search;
- automatic rough cuts;
- chat-controlled Resolve operations;
- standalone GenAI generation;
- effects.

The differentiator is the persistent **production graph** whose narrative side is itself editable structured data.

A concise positioning hypothesis:

> A workspace where the story, footage, generated assets, and Resolve edit stay connected.

A more specific scripting hypothesis:

> Write the story from a blank page or from the footage you already have, without losing the links between narrative intent and production material.

## Current MVP priority

The next validation milestone is **structured scripting**, not Resolve integration.

Immediate prototype goals:

1. Beat-first semantic model with stable IDs.
2. Outline and AV Script views over the same model.
3. Derived Teleprompter view.
4. Target/estimated runtime.
5. ShotIntent links that survive ordinary edits.
6. Operation-based AI structural rewrite.
7. Persistence/reopen with IDs intact.
8. Mocked footage-first narrative construction using the same model.
9. Fountain import/export as interoperability.

Only after this model feels coherent should the project expand into real media analysis, broader production graph work, Resolve materialization, and GenAI.
