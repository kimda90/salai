# Salai User Stories and Backlog

This is the lightweight product backlog while Salai is still in discovery and spike-driven development. When implementation becomes multi-contributor or issue-level tracking becomes useful, these items can move into GitHub Issues/Jira/Linear without changing the product hierarchy below.

## Priority model

- **DONE** — validated enough to move to the next risk; revisit only when new evidence requires it.
- **NOW** — required to retire the current product/technical risk.
- **NEXT** — follows the current milestone.
- **LATER** — important product direction, intentionally deferred.

# DONE — Spike 0A: Narrative IR

Spike 0A implemented and validated the core Narrative IR in `packages/script-model/`.

Completed evidence includes:

- stable `Script / Section / Scene? / Beat / Cue / ContentBlock` identity;
- authored `AuthoredSpeech` vs media-backed `SourceExcerpt` semantics;
- mocked `ShotIntent` and `MediaSegment` references;
- the authoritative structural operation API;
- move/split/merge/delete relationship behavior;
- transactional validation;
- schema-versioned serialization round trip;
- runtime estimation;
- three representative fixtures for product, interview/corporate, and footage-first documentary work.

See [`spike-0a-assessment.md`](spike-0a-assessment.md) for the conclusions and known limitations.

# NOW — Spike 0B: familiar authoring workflows

Implementation details and pass/fail behavior are owned by [`authoring-ux-spec.md`](authoring-ux-spec.md).

## 0B.0 — Shared UX foundation

User outcomes:

- As a creator, I want familiar working surfaces to manipulate one Narrative IR rather than separate documents.
- As a user, I want the same Beat/Cue/source identity to survive when I switch working methods.
- As a user, I should not need to understand graph/database concepts to use Salai.

Engineering work:

- create the smallest React/TypeScript/Vite prototype package needed to exercise `@salai/script-model`;
- add the agreed 0B UI primitives/interaction dependencies;
- load the existing three Narrative IR fixtures into development/test surfaces;
- establish one shared Narrative operation dispatcher for semantic edits;
- establish shared selection/navigation state across surfaces;
- define clear UI handling for operation warnings/errors;
- build reusable narrative card/content/source presentation primitives.

## 0B.1 — Minimum Workspace model

- define the minimum in-memory `Workspace / Board / BoardItem / IdeaCard` types;
- keep workspace layout/grouping state separate from canonical narrative semantics;
- support references from BoardItems to stable Narrative IR object IDs;
- define loose IdeaCards that do not become canonical objects until promoted;
- keep ephemeral selection/hover/drag-preview state outside Workspace semantics;
- defer durable persistence until Phase 2.

## 0B.2 — Outline

User outcomes:

- As a writer/editor, I want a compact hierarchical view of Sections/Scenes/Beats so I can shape overall structure quickly.
- As a writer/editor, I want reordering in Outline to invoke the same Narrative IR operations used everywhere else.

Engineering/validation work:

- render Sections, optional Scenes, Scene-contained Beats, and direct Beats;
- test mixed Scene/direct-Beat hierarchy in real UI;
- support inline title/summary editing where the IR permits it;
- support structural drag/reorder through Narrative operations;
- display approximate runtime;
- test whether `Cue` terminology needs to appear in Outline at all.

## 0B.3 — Story Wall / Beat Board

User outcomes:

- As an editor, I want scene/beat cards arranged spatially so I can reason about structure before touching a timeline.
- As an editor, I want to move rejected or uncertain ideas to a visible parking-lot area instead of deleting them.
- As a creator, I want loose IdeaCards that do not become canonical narrative objects until I choose to promote them.
- As a user, I want spatial movement distinguished from intentional narrative reordering.

Engineering/validation work:

- render Beat/Scene cards with Workspace-owned position/layout metadata;
- support free spatial drag without changing Narrative IR order;
- support an explicit structural reorder interaction that emits Narrative operations;
- implement visible parking-lot/alternate placement;
- implement loose IdeaCards;
- implement IdeaCard promotion into a canonical Beat/Scene plus BoardItem reference replacement/linking;
- verify removal from active structure, parking, and permanent deletion are not conflated.

## 0B.4 — AV Script

User outcomes:

- As a videographer, I want visual and audio intent side by side so I can plan how each Beat is expressed.
- As a videographer, I want several Cues inside one Beat so shot/AV changes do not force artificial narrative fragmentation.
- As a user, I want runtime feedback while authoring.

Engineering/validation work:

- group rows/entries by Beat;
- present Visual and Audio intent side by side;
- preserve Cue stable identity rather than treating rows as canonical state;
- distinguish authored speech/content from source-backed excerpts;
- surface approximate runtime;
- test whether users need to see the term `Cue` explicitly.

## 0B.5 — Paper / Radio Edit

User outcomes:

- As a documentary editor, I want SourceExcerpts arranged into a story while preserving their source ranges.
- As an interview editor, I want an audio-first radio-edit workflow before solving visuals.
- As a user, I want authored VO and sourced interview excerpts to remain visually and semantically distinct.

Engineering/validation work:

- present SourceExcerpt source identity/ranges visibly;
- prevent source-backed wording from behaving like freely editable authored prose;
- support ordering/attaching excerpts into the canonical story;
- support authored bridge/VO material between sourced excerpts;
- test the audio-first path toward AV Script without creating a duplicate document.

## 0B.6 — Cross-surface workflow validation

Use at least one representative fixture continuously through:

```text
Story Wall
   ↓
Outline
   ↓
AV Script
   ↓
Paper / Radio Edit
   ↓
Story Wall
```

Verify:

- stable Beat/Cue/source identity survives;
- semantic edits propagate across surfaces;
- Workspace organization survives surface changes in memory;
- Workspace-only moves do not mutate Narrative IR;
- structural gestures emit the intended Narrative operations;
- SourceExcerpt remains source-backed;
- authored/source material remains distinguishable;
- parking/removal/deletion remain distinct;
- runtime feedback stays consistent.

## 0B.7 — Spike assessment

Record the result before moving on:

- minimum Workspace field set actually required;
- whether mixed Scene/direct-Beat hierarchy remains viable;
- which surfaces should expose `Cue` terminology;
- the successful spatial-vs-structural interaction pattern;
- any Narrative IR changes justified by UX evidence;
- whether Paper Edit requires a distinct domain concept later or remains a Workspace for now.

## Spike 0B exit criterion

Users can recognize and move between Story Wall, Outline, AV Script, and Paper/Radio Edit without export/import, duplicate story documents, or exposure to the underlying production-graph implementation.

# NOT NOW — protect the 0B validation boundary

Do not pull these into the active spike unless a minimal mock is strictly necessary to answer a workflow-UX question:

- Electron packaging/runtime;
- Python/FastAPI;
- SQLite/durable persistence;
- Resolve/CutMaster execution;
- OpenTimelineIO/OpenAssetIO integration;
- real LLM calls or an agent framework;
- real transcription/media analysis;
- GenAI/ComfyUI execution;
- semantic embeddings/vector-search infrastructure;
- rich-text editor frameworks;
- generic infinite-canvas or graph-editor infrastructure;
- the speculative mixed-media canvas.

# NEXT — Spike 0C: assisted authoring

- As a user, I want AI to propose shorter or structurally different versions as explicit Narrative IR operations.
- As a user, I want to review structural, runtime, and relationship consequences before accepting AI changes.
- As a user, I want AI suggestions to respect sourced evidence and never rewrite recorded speech as if it were authored copy.
- Start with structured output/tool calling into `NarrativeOperation[]`; do not add a general agent framework unless later evidence requires one.

# NEXT — local production application

## Epic: desktop runtime

- As a videographer, I want Salai to open real local project folders and retain access across sessions.
- As a user, I want Salai to work with local/NAS media without uploading originals to a cloud service.

## Epic: persistence

- As a user, I want project state stored locally and recoverable after restart/crash.
- As the product, we want a versioned persistence boundary that does not make UI/editor state canonical.
- Persist the Workspace semantics proven in 0B without moving layout metadata into Narrative IR objects.

# LATER — production graph and coverage

- As a videographer, I want Beats/Cues linked to ShotIntents so I know what needs to be shot, found, or generated.
- As a videographer, I want to know which ShotIntents already have usable realizations and which remain missing.
- As a user, I want captured, stock, generated, storyboard, and previs realizations treated as alternatives for the same intent where appropriate.

# LATER — Resolve integration

- As an editor, I want Salai to understand the current Resolve project/timeline context.
- As an editor, I want a paper edit or selected structure materialized as a Resolve timeline.
- As an editor, I want alternate realizations available as ordinary Resolve media/takes rather than trapped in a separate AI workflow.
- Use the Salai Resolve adapter → CutMaster boundary by default; document direct Resolve scripting exceptions when required.

# LATER — reverse scripting with real media

- As an editor, I want real transcripts and media analysis turned into MediaSegments I can use as narrative evidence.
- As an editor, I want to construct Beats from available footage without losing source references.
- Begin with Salai-owned Asset IDs and commodity local processing; external asset-management interoperability is not a prerequisite.

# LATER — GenAI / previs

- As a creator, I want a missing ShotIntent represented quickly as a generated storyboard/previs so I can feel the structure before shooting.
- As a creator, I want generated alternatives ingested and reviewed like normal production media.
- As an editor, I want generation provenance preserved so I can regenerate, vary, or promote previews to finals.
- As a creator, I want writing or restructuring to produce a low-friction visual approximation so I can discover weak ideas before expensive production or timeline work.

# LATER — asset-management interoperability

- Add OpenAssetIO only when a validated workflow requires external asset resolution/publishing or production asset-management interoperability.
- Until then, use Salai-owned stable Asset identity plus local path/fingerprint/metadata.

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

A backlog item belongs in **NOW** only if it directly contributes to the current milestone's pass/fail question.

When a new dependency or subsystem is proposed during 0B, first ask whether it is necessary to distinguish Workspace semantics, projection behavior, or cross-surface Narrative IR editing. If not, keep it out of NOW.
