# Salai Product Brief

## Product thesis

Salai is a DaVinci Resolve companion for scripted and footage-first video creation.

Its core responsibility is not to replace Resolve. Instead, Salai maintains the production context that traditional NLEs do not model well: why a piece of footage exists, what narrative intent it serves, what was planned before shooting, what coverage exists, how generated media relates to real media, and how those relationships evolve across edits.

The central model is a persistent relationship between:

`idea ↔ narrative beat ↔ script ↔ planned shot ↔ media/take ↔ timeline use ↔ review/revision`

Projects may enter this graph in either direction:

1. **Script-first** — idea → script → beats → shots → capture/generation → edit.
2. **Footage-first** — existing footage → semantic inventory → narrative beats → script/paper edit → edit.

## Target user

Initial target:

- solo videographers;
- small production teams and agencies;
- branded/corporate content producers;
- documentary/interview editors;
- YouTube and educational creators with professional post workflows.

The initial audience should already be comfortable with DaVinci Resolve Studio.

## Product boundary

### Salai owns

- idea and script development;
- narrative beats/scenes;
- shot planning;
- coverage state;
- links between narrative elements and media;
- review/annotations that survive editorial changes;
- paper edits and alternative structures;
- AI-assisted production reasoning;
- GenAI generation jobs and provenance;
- synchronization with Resolve.

### Resolve owns

- original media playback and management;
- proxies and codecs;
- frame-accurate editing;
- Fusion compositing;
- color;
- Fairlight/audio post;
- rendering/delivery.

Salai should prefer invoking or complementing Resolve capabilities rather than reimplementing them.

## Core user stories

### Script-first

- As a videographer, I want to develop an idea into a script before shooting so I can reduce wasted production time.
- As a videographer, I want the script broken into narrative beats and planned shots so I know what coverage is required.
- As a videographer, I want to know during or after a shoot which planned shots have usable takes and what is still missing.
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

## Differentiation

Salai should not compete primarily on:

- transcription;
- generic semantic search;
- automatic rough cuts;
- effects;
- standalone GenAI generation.

Those capabilities increasingly exist inside Resolve or dedicated products.

The differentiator is the persistent **production graph** that connects intent, planning, captured/generated media, editorial usage, review, and revisions.

A concise positioning hypothesis:

> A workspace where the script, footage, and Resolve edit stay connected.

## MVP hypothesis

Three primary views:

1. **Story** — idea, outline, script, beats.
2. **Coverage** — planned shots, linked takes, missing coverage.
3. **Edit** — paper edit, alternative structures, Resolve timeline synchronization.

GenAI initially appears as an action against a production object (for example, a missing shot), not as a separate "AI studio" mode.
