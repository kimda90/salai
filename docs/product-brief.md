# Salai Product Brief

## Product thesis

Salai is a local-first DaVinci Resolve companion for scripted and footage-first video creation.

Its core responsibility is not to replace Resolve. Instead, Salai maintains the production context that traditional NLEs do not model well: why a piece of footage exists, what narrative intent it serves, what was planned before shooting, what coverage exists, how generated media relates to real media, and how those relationships evolve across edits.

The central model is a persistent relationship between:

`idea ↔ narrative beat ↔ script ↔ shot intent ↔ asset/take ↔ timeline use ↔ review/revision`

Projects may enter this graph in either direction:

1. **Script-first** — idea → script → beats → shot intent → capture/generation → edit.
2. **Footage-first** — existing footage → semantic inventory → narrative beats → script/paper edit → edit.

## Target user

Initial target:

- solo videographers;
- small production teams and agencies;
- branded/corporate content producers;
- documentary/interview editors;
- YouTube and educational creators with professional post workflows.

The initial audience should already be comfortable with DaVinci Resolve Studio.

## Product principles

### Local-first production software

Salai is a desktop application, not a cloud-first media service.

It should be comfortable with large camera originals, project folders, NAS/network paths, local GenAI services, and applications such as Resolve without requiring the user to upload all source media.

The primary runtime is expected to be Electron with a React/TypeScript UI and a local Python service.

### Reuse infrastructure; own production intelligence

Prefer mature, permissively licensed open-source infrastructure instead of rebuilding commodity pipeline layers.

Current architectural direction:

- **CutMaster** for broad Resolve automation;
- **OpenAssetIO** at the asset identity/resolution/publishing boundary;
- **OpenTimelineIO** for editorial interchange;
- **ComfyUI** as the initial local GenAI execution backend;
- **FFmpeg/ffprobe** for media utilities.

Salai's differentiated engineering should concentrate on the production graph and the workflows built on top of it.

### Generated media is normal media

GenAI is not a separate editing mode. Generated images, video, audio, plates, graphics, or cleanup results become normal production assets with provenance and can be reviewed, selected, ingested, edited, graded, composited, mixed, and rendered through the usual workflow.

### Intent is independent from realization

A required shot/visual idea should exist independently from how it is ultimately fulfilled.

For example, one `ShotIntent` may be realized by:

- a storyboard;
- a generated previs;
- multiple captured camera takes;
- multiple generated takes;
- stock footage;
- a graphic or composited result.

This makes script-first and footage-first workflows compatible with the same domain model.

## Product boundary

### Salai owns

- idea and script development;
- narrative beats/scenes;
- shot intent and planning;
- coverage state;
- links between narrative elements and assets/segments;
- review/annotations that survive editorial changes;
- paper edits and alternative structures;
- AI-assisted production reasoning;
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

- CutMaster owns generic Resolve automation plumbing;
- OpenAssetIO owns standardized asset-manager integration semantics;
- OpenTimelineIO owns portable editorial interchange semantics;
- ComfyUI/providers own model execution.

Salai should wrap these systems behind its own domain concepts rather than leak infrastructure details throughout the product.

## Core user stories

### Script-first

- As a videographer, I want to develop an idea into a script before shooting so I can reduce wasted production time.
- As a videographer, I want the script broken into narrative beats and ShotIntents so I know what coverage is required.
- As a videographer, I want to know during or after a shoot which ShotIntents have usable realizations and what is still missing.
- As an editor, I want captured clips linked back to their intended shots/scenes so I can find relevant material quickly.

### Footage-first

- As a videographer, I want to ingest existing/random footage and understand what material I actually have.
- As a videographer, I want AI to suggest topics, beats, and possible narrative structures from existing material.
- As an editor, I want to build a paper edit from footage before committing to a detailed timeline.

### Editorial/review

- As an editor, I want to compare multiple story structures using the same footage.
- As an editor, I want an approved paper edit to materialize as a Resolve timeline/assembly.
- As a reviewer, I want comments linked to underlying media/narrative elements rather than only to a volatile timeline timecode.

### Generative media

- As an editor, I want to generate missing coverage, inserts, plates, cleanup variants, audio, or other assets from within the production context.
- As an editor, I want generated results ingested into Resolve and treated like normal production media.
- As an editor, I want generated assets to retain provenance so they can be reproduced, varied, or regenerated at final quality.
- As an editor, I want real and generated realizations of the same ShotIntent to be comparable as normal alternatives/takes.

## Differentiation

Salai should not compete primarily on:

- transcription;
- generic semantic search;
- automatic rough cuts;
- chat-controlled Resolve operations;
- effects;
- standalone GenAI generation.

Those capabilities increasingly exist inside Resolve or dedicated products.

The differentiator is the persistent **production graph** connecting intent, planning, captured/generated assets, editorial usage, review, and revisions.

A concise positioning hypothesis:

> A workspace where the script, footage, generated assets, and Resolve edit stay connected.

## MVP hypothesis

Three primary product views:

1. **Story** — idea, outline, script, beats.
2. **Coverage** — ShotIntents, linked realizations/takes, missing coverage.
3. **Edit** — paper edit, alternative structures, Resolve timeline synchronization.

GenAI initially appears as an action against a production object (for example, a missing ShotIntent), not as a separate "AI studio" mode.

The first end-to-end validation should prove one small production from script/shot planning through real footage, one generated missing realization, a paper edit, and materialization into Resolve.
