# Salai User Stories and Backlog

This is the lightweight product backlog while Salai remains in discovery and spike-driven development.

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

See [`spike-0a-assessment.md`](spike-0a-assessment.md).

# DONE — Spike 0B: shared structured-view architecture

0B implemented Story Wall, Outline, AV Script, and Paper/Radio Edit over one canonical Narrative IR.

Validated:

- one canonical project across all four views;
- stable Beat/Cue/source identity;
- Workspace position/parking separate from narrative semantics;
- authored/source-backed content distinction;
- runtime/structural edits through one operation boundary;
- deterministic product/interview/documentary acceptance coverage.

Human UX result:

> **Direct structured authoring requires too much user interaction to be creatively useful as the primary workflow.**

Therefore 0B is considered complete as a discovery spike but **not a product UX pass**. The structured surfaces remain useful specialized tools; they are not the next primary authoring direction.

See [`spike-0b-assessment.md`](spike-0b-assessment.md).

# NOW — Spike 0C: Agent-Mediated Authoring

Implementation/validation contract: [`agent-mediated-authoring.md`](agent-mediated-authoring.md).

Architectural proposal: [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md).

## 0C.0 — Interaction shell

User outcomes:

- As a creator, I want one low-friction place to write and think before deciding structure.
- As a creator, I want to ask Salai to change the story in ordinary language.
- As a creator, I want to provide media/context without manually converting it into project objects first.

Engineering work:

- add a simple free-form working text area;
- add project-aware conversational input;
- add attachment/media-drop UI using fixture-backed or mocked metadata;
- preserve existing structured views as secondary inspection tools.

## 0C.1 — Agent normalization boundary

User outcomes:

- As a user, I want Salai to infer routine structure instead of making me create/parent every Beat and Cue.
- As a user, I want one creative request to be allowed to perform several internal operations.
- As a user, I want the resulting project to remain deterministic and valid.

Engineering work:

- build a small Salai-owned agent/model adapter;
- pass current Narrative IR + working input + attachments as context;
- expose constrained typed tools / structured output into `NarrativeOperation[]`;
- validate before applying;
- preserve current public script-model boundary;
- do not adopt a general agent framework until real orchestration needs appear.

## 0C.2 — Grouped changes and undo

User outcomes:

- As a creator, I want one request to appear as one understandable change, even when Salai performs multiple internal operations.
- As a creator, I want to undo an agent interpretation that I do not like.

Engineering work:

- define one user-visible action/change batch;
- collect the operations produced from one user instruction;
- apply transactionally where possible;
- summarize creative consequences;
- implement last-batch undo/revert for the spike;
- preserve stable identities when restructuring.

## 0C.3 — Graduated autonomy

User outcomes:

- As a creator, I do not want approval dialogs for routine reversible changes I explicitly requested.
- As a creator, I want Salai to ask when a real creative ambiguity matters.
- As a user, I want explicit control before external or destructive actions.

Validation work:

- auto-apply clearly requested reversible in-project normalization as grouped undoable batches;
- ask focused creative clarifications only when necessary;
- define explicit-confirmation boundary for later Resolve/destructive/filesystem/publishing/generation effects;
- never ask users to choose internal object/parent types when a creative-language clarification will do.

## 0C.4 — Script-first flow

User outcomes:

- As a writer/videographer, I want a paragraph or rough notes turned into a usable story structure with one processing action.
- As a user, I want to say “make this 30 seconds” or “move the proof earlier” rather than manually editing several objects.

Validation work:

- paragraph → rough Beat/Cue structure;
- messy notes → structure while leaving unresolved notes uncommitted;
- natural-language reorder/rewrite/runtime changes;
- Outline/AV Script inspect the result without export/import.

## 0C.5 — Footage-first / attachment flow

User outcomes:

- As a documentary editor, I want to drop interview/source material and describe the story I want.
- As an editor, I want Salai to arrange source evidence without changing the recorded wording/ranges.
- As a user, I want to ask what evidence or visual coverage is missing.

Validation work:

- attachment handles with mocked transcript/source ranges;
- source-preserving normalization into SourceExcerpt-backed structure;
- authored bridge material remains authored;
- query missing/unsupported narrative moments;
- inspect exact result in Paper/Radio/AV views.

## 0C.6 — Interaction-compression test

Compare representative 0C tasks with the 0B baseline.

Measure:

- explicit user actions/inputs;
- clarifications;
- moments where internal hierarchy interrupts creative thinking;
- confidence/trust in agent changes;
- usefulness of grouped summary + undo;
- whether structured views are opened voluntarily because they help.

### Spike 0C exit criterion

Users can create and revise representative script-first and footage-first stories primarily through free-form text, conversation, and attachments with **materially less model-management interaction** than 0B, while canonical/source semantics remain correct and reversible.

# NOT NOW — protect the 0C validation boundary

Do not pull these into the active spike unless a minimal mock is strictly necessary to answer the agent-mediated interaction question:

- Electron packaging/runtime;
- Python/FastAPI service;
- SQLite/durable persistence;
- Resolve/CutMaster execution;
- OpenTimelineIO/OpenAssetIO integration;
- full real transcription/media analysis;
- GenAI/ComfyUI execution;
- vector database infrastructure;
- collaborative rich-text editing;
- a canonical rich-text document model;
- generic infinite-canvas/graph editor;
- general multi-agent framework;
- autonomous background agent infrastructure;
- extensive Story Wall/Outline/AV/Paper polish that does not test the new primary workflow.

# NEXT — local production application

## Epic: desktop runtime

- As a videographer, I want Salai to open real local project folders and retain access across sessions.
- As a user, I want Salai to work with local/NAS media without uploading originals to a cloud service.
- As a user, I want the agent authoring context to operate on local project/media state.

## Epic: persistence

- As a user, I want canonical project state stored locally and recoverable after restart/crash.
- As a user, I want agent-applied changes/history recoverable enough to trust the application.
- Persist a free-form WorkingDocument/session artifact only if 0C proves it is durable product state rather than transient authoring context.
- Persist only Workspace semantics that remain useful after 0C.

# NEXT — production graph and coverage

- As a videographer, I want Beats/Cues linked to ShotIntents so I know what needs to be shot, found, or generated.
- As a creator, I want to ask Salai conversationally what coverage is missing.
- As a user, I want captured, stock, generated, storyboard, and previs realizations treated as alternatives for the same intent where appropriate.
- As a user, I want a Coverage view available to verify the agent's reasoning.

# NEXT — Resolve integration

- As an editor, I want Salai to understand the current Resolve project/timeline context.
- As an editor, I want a selected narrative/source structure materialized as a Resolve timeline.
- As an editor, I want conversational requests to change canonical Salai state first, then materialize deliberately into Resolve.
- Use the Salai Resolve adapter → CutMaster boundary by default; do not let agent chat bypass that boundary.

# LATER — reverse scripting with real media

- As an editor, I want real transcripts and media analysis turned into MediaSegments automatically.
- As an editor, I want to drop real media into the primary authoring flow and have Salai reason over it without losing source references.
- Begin with Salai-owned Asset IDs and commodity local processing; external asset-management interoperability is not a prerequisite.

# LATER — GenAI / previs

- As a creator, I want a missing ShotIntent represented quickly as generated storyboard/previs.
- As a creator, I want generated alternatives ingested and reviewed like normal production media.
- As a creator, I want to ask for previs naturally from the same authoring flow rather than entering a separate generation product.
- Preserve generation provenance and keep paid/expensive generation behind explicit user action.

# LATER — optional spatial/mixed-media workflows

The old PureRef-like canvas idea is no longer the primary research direction.

Potential later work:

- test whether text/images/video/reference/previs material benefits from an optional spatial Workspace;
- allow agent-produced or user-arranged material to coexist visually;
- avoid making node/link/canvas management a prerequisite for normal authoring;
- add only when evidence shows spatial organization solves a problem better than the simple free-form surface plus specialized views.

# LATER — review / alternatives / versioning

- As an editor, I want tried/rejected material preserved outside the active structure.
- As an editor, I want alternative narrative versions without duplicating the project manually.
- As a user, I want Salai to generate/compare alternatives as grouped changes or versions rather than destructive replacements.
- As a reviewer, I want annotations tied to narrative/media identity rather than fragile timeline timecodes.

# LATER — asset-management interoperability

- Add OpenAssetIO only when a validated workflow requires external asset resolution/publishing or production asset-management interoperability.
- Until then, use Salai-owned stable Asset identity plus local path/fingerprint/metadata.

# Backlog hygiene

A backlog item belongs in **NOW** only if it directly contributes to the current 0C pass/fail question:

> Can free-form text, conversation, and media be normalized into trusted canonical project changes with materially less creative friction than direct structured authoring?

If an item mainly adds infrastructure, polish, or another structured surface without answering that question, keep it out of NOW.
