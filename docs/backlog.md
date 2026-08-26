# Salai User Stories and Backlog

This is the lightweight product backlog while Salai is still in discovery and spike-driven development. When implementation becomes multi-contributor or issue-level tracking becomes useful, these items can move into GitHub Issues/Jira/Linear without changing the product hierarchy below.

## Priority model

- **NOW** — required to retire the current Narrative IR risk.
- **NEXT** — only after the current milestone succeeds.
- **LATER** — important product direction, intentionally deferred.

# NOW — Spike 0A: Narrative IR

## Epic: semantic narrative model

- As a videographer, I want a story represented as stable semantic units so normal rewriting does not disconnect it from production context.
- As a writer/editor, I want Beats to represent narrative progression independently from the number of shots or spoken lines needed to express them.
- As a writer/editor, I want Cues to represent audiovisual moments within a Beat so one idea can span several visual/audio changes.
- As an editor, I want sourced interview material distinguished from authored copy so changing the script never pretends recorded words changed.

### Acceptance work

- Define `Script`, `Section`, optional `Scene`, `Beat`, `Cue`, and minimal content-block types.
- Define stable ID rules.
- Define `AuthoredSpeech` and `SourceExcerpt` semantics.
- Define Beat/Cue links to `ShotIntent`.
- Define SourceExcerpt links to mocked `MediaSegment`.

## Epic: structural editing semantics

- As a user, I want to reorder story units without losing their identity or links.
- As a user, I want to split or merge Beats without hidden relationship loss.
- As a user, I want deleting narrative structure to leave linked production material intact unless I explicitly delete that material too.
- As a future AI-assisted user, I want changes represented as reviewable operations rather than opaque whole-document replacement.

### Acceptance work

- Implement create/update/move/delete operations.
- Implement split/merge semantics.
- Define relationship effects explicitly.
- Support operation validation and useful failure states.
- Make operations invertible where practical.

## Epic: serialization and timing

- As a user, I want the project to reopen with the same narrative identity, ordering, content, and relationships.
- As a videographer, I want approximate duration while writing so I can target 15/30/60/90-second formats before the timeline exists.

### Acceptance work

- Add schema versioning.
- Serialize/deserialize all Spike 0A objects.
- Verify round-trip invariants.
- Estimate authored speech duration.
- Use source duration for SourceExcerpt.
- Support explicit Cue duration and simple visual-hold estimates.

## Epic: representative fixtures

- As the product team, we want the model exercised against realistic work rather than toy examples.

### Required fixtures

1. 30-second product/branded video.
2. 2-minute interview/corporate piece with authored VO and source excerpts.
3. Footage-first mini-documentary built from mocked MediaSegments.

### Exit criterion

All three use the same core model without separate schemas or workflow-specific hacks.

# NEXT — Spike 0B: familiar authoring workflows

## Epic: Outline

- As a writer, I want a compact hierarchical view of Sections/Scenes/Beats so I can shape overall structure quickly.
- As a writer, I want reordering in Outline to modify the same Narrative IR used everywhere else.

## Epic: AV Script

- As a videographer, I want visual and audio intent side by side so I can plan how each Beat is expressed.
- As a videographer, I want several Cues inside one Beat so I do not have to turn every shot change into a new narrative idea.

## Epic: Story Wall / Beat Board

- As an editor, I want scene/beat cards arranged spatially so I can reason about structure before touching a timeline.
- As an editor, I want to move rejected or uncertain ideas to a visible parking-lot area instead of deleting them.
- As a creator, I want loose IdeaCards that do not become canonical narrative objects until I choose to promote them.

## Epic: Paper / Radio Edit

- As a documentary editor, I want source excerpts arranged into a story while preserving their source time ranges.
- As an interview editor, I want to build an audio-first radio edit before solving visuals.
- As a user, I want authored VO and sourced interview excerpts to coexist clearly.

## Epic: cross-workflow coherence

- As a user, I want to switch between Story Wall, Outline, AV Script, and Paper/Radio Edit without exporting or maintaining duplicate documents.

# NEXT — Spike 0C: assisted authoring

- As a user, I want AI to propose shorter or structurally different versions as explicit operations.
- As a user, I want to review structural, runtime, and relationship consequences before accepting AI changes.
- As a user, I want AI suggestions to respect sourced evidence and never rewrite recorded speech as if it were authored copy.

# NEXT — local production application

## Epic: desktop runtime

- As a videographer, I want Salai to open real local project folders and retain access across sessions.
- As a user, I want Salai to work with local/NAS media without uploading originals to a cloud service.

## Epic: persistence

- As a user, I want project state stored locally and recoverable after restart/crash.
- As the product, we want a versioned persistence boundary that does not make UI/editor state canonical.

# LATER — production graph and coverage

- As a videographer, I want Beats/Cues linked to ShotIntents so I know what needs to be shot, found, or generated.
- As a videographer, I want to know which ShotIntents already have usable realizations and which remain missing.
- As a user, I want captured, stock, generated, storyboard, and previs realizations treated as alternatives for the same intent where appropriate.

# LATER — Resolve integration

- As an editor, I want Salai to understand the current Resolve project/timeline context.
- As an editor, I want a paper edit or selected structure materialized as a Resolve timeline.
- As an editor, I want alternate realizations available as ordinary Resolve media/takes rather than trapped in a separate AI workflow.

# LATER — reverse scripting with real media

- As an editor, I want real transcripts and media analysis turned into MediaSegments I can use as narrative evidence.
- As an editor, I want to construct Beats from available footage without losing source references.

# LATER — GenAI / previs

- As a creator, I want a missing ShotIntent represented quickly as a generated storyboard/previs so I can feel the structure before shooting.
- As a creator, I want generated alternatives ingested and reviewed like normal production media.
- As an editor, I want generation provenance preserved so I can regenerate, vary, or promote previews to finals.
- As a creator, I want writing or restructuring to produce a low-friction visual approximation so I can discover weak ideas before expensive production or timeline work.

# LATER — workflow research

These are explicit research directions, not committed product requirements.

- Investigate whether a PureRef-like mixed-media canvas improves story construction beyond the established Story Wall, Paper Edit, AV Script, and related workflows.
- Test a workspace where text fragments, images, video excerpts, references, and previs material can coexist spatially.
- Test whether optional links/arrows or spatial arrangements can usefully inform a script, paper edit, previs, or timeline without turning the product into a generic node editor.
- Promote this direction only if real workflow testing demonstrates a clear advantage over simpler familiar surfaces.

# LATER — review / alternatives / versioning

- As an editor, I want tried/rejected material preserved outside the active structure so I can revisit it later.
- As an editor, I want removing something from the active structure to remain distinct from permanently deleting the underlying idea/media.
- As an editor, I want alternative narrative versions without duplicating the entire project manually.
- As a reviewer, I want annotations tied to narrative/media identity rather than only fragile timeline timecodes.

# Backlog hygiene

A backlog item should only move into **NOW** if it directly contributes to the current milestone's pass/fail question.

For Spike 0A, avoid adding UI, Electron, Python, SQLite, Resolve, real LLM calls, Fountain/FDX, real transcription, GenAI implementation, previs implementation, or mixed-media canvas work.
