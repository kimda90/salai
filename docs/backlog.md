# Salai User Stories and Backlog

This is the lightweight product backlog while Salai remains in discovery and spike-driven development.

## Priority model

- **DONE** — validated enough to move to the next risk; revisit only when new evidence requires it.
- **NOW** — required to retire the current product/technical risk.
- **NEXT** — follows the current milestone.
- **LATER** — important product direction, intentionally deferred.

# DONE — Spike 0A: Narrative IR

Validated:

- one semantic Script/Section/Scene?/Beat/Cue model;
- stable identity;
- authored vs source-backed content;
- source/ShotIntent references;
- structural operation vocabulary;
- validation and relationship effects;
- serialization/versioning;
- runtime estimation;
- product, interview/corporate, and footage-first fixtures.

See [`spike-0a-assessment.md`](spike-0a-assessment.md).

# DONE — Spike 0B: synchronized structured-view architecture

0B implemented Story Wall, Outline, AV Script, and Paper/Radio Edit over one canonical Narrative IR.

Validated:

- one canonical project across all four views;
- stable Beat/Cue/source identity;
- Workspace position/parking separate from narrative semantics;
- authored/source-backed content distinction;
- runtime/structural edits through one operation boundary;
- deterministic fixture/acceptance coverage.

Human UX finding:

> **Using direct structured manipulation as the routine path requires too much user interaction to be creatively useful.**

Follow-up product interpretation:

> **The structured views are still useful when they expose the narrative system and let the creator understand or modify it from another angle.**

Therefore 0B is complete as a discovery spike, but not a product UX pass.

The structured surfaces are retained as **Narrative Lenses** rather than mandatory authoring stages.

See [`spike-0b-assessment.md`](spike-0b-assessment.md).

# NOW — Spike 0C: Agent-Mediated Authoring + Narrative Lenses

Contracts:

- [`agent-mediated-authoring.md`](agent-mediated-authoring.md);
- [`narrative-lenses.md`](narrative-lenses.md);
- [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md);
- [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md).

0C must prove two things:

1. **interaction compression** — routine creative tasks require materially less structural bookkeeping than 0B; and
2. **structural insight** — Narrative Lenses remain useful, voluntary ways to perceive and manipulate the canonical story.

## 0C.0 — Canonical/agent boundary

User outcomes:

- As a creator, I want Salai to handle routine structural mechanics for me.
- As a user, I want agent changes and direct lens edits to remain one coherent project.

Engineering work:

- keep `@salai/script-model` as canonical narrative state;
- reuse the existing shared controller/dispatcher;
- define a compact agent-facing project context DTO;
- define typed Salai authoring commands;
- keep ID allocation/reference resolution in Salai code;
- compile commands into public `NarrativeOperation[]`;
- validate complete batches before publishing;
- add deterministic rejection/no-partial-state tests.

## 0C.1 — Low-friction authoring surface

User outcomes:

- As a creator, I want one place to write and think before deciding structure.
- As a creator, I want to ask Salai to change the story in ordinary language.
- As a creator, I want to provide media/context without manually converting it into project objects first.

Engineering work:

- simple free-form working text area;
- project-aware conversational input;
- explicit process/update action initially;
- concise result/change summary;
- attachment/media-drop UI using fixture-backed or mocked metadata;
- clear entry points to Narrative Lenses without making them mandatory stages.

## 0C.2 — Agent normalization

User outcomes:

- As a user, I want Salai to infer routine structure instead of making me create/parent every Beat/Cue.
- As a user, I want one creative request to perform several internal operations safely.

Engineering work:

- minimal Salai-owned agent/model adapter;
- current project + working input + attachment context;
- typed authoring commands;
- canonical operation compilation/validation;
- stable identity preservation;
- strict SourceExcerpt semantics;
- focused creative clarification path;
- deterministic mocked-agent tests.

## 0C.3 — Grouped changes and revert

User outcomes:

- As a creator, I want one request to appear as one understandable change.
- As a creator, I want to revert an agent interpretation I do not like.

Engineering work:

- one user-visible action batch;
- complete-batch validation before live publish;
- concise creative-level summary;
- pre-batch project/Workspace snapshot;
- one-step revert;
- failed batch leaves live state unchanged;
- no event-sourcing/inverse-operation architecture yet.

## 0C.4 — Script-first flow

User outcomes:

- As a writer/videographer, I want rough prose turned into useful structure in one processing action.
- As a user, I want to say “make this 30 seconds” or “move the proof earlier” rather than manually editing several objects.

Validation work:

- paragraph → rough Beat/Cue structure;
- unresolved notes remain uncommitted where appropriate;
- natural-language reorder/rewrite/runtime changes;
- stable identity preservation;
- deterministic script-first scenarios.

## 0C.5 — Footage-first / attachment flow

User outcomes:

- As a documentary editor, I want to drop interview/source material and describe the story I want.
- As an editor, I want Salai to arrange source evidence without changing recorded wording/ranges.
- As a user, I want to ask what evidence or visual coverage is missing.

Validation work:

- attachment handles with mocked transcript/source ranges;
- explicit attachment → canonical source identity resolution;
- source-preserving normalization;
- authored bridge material remains authored;
- source substitution instruction;
- missing/unsupported moment query;
- deterministic footage-first scenarios.

## 0C.6 — Narrative Lenses

User outcomes:

- As a creator, I want structured views that help me see the narrative from different angles.
- As a creator, I want direct manipulation when that representation is the way I want to think.
- As a creator, I do not want incidental implementation mechanics mixed into those views.

Required lenses for 0C:

- **Outline** — hierarchy/proportion;
- **Story Wall** — spatial rhythm/alternatives;
- **AV Script** — audiovisual density/realization;
- **Paper/Radio Edit** — evidence/voice/source pacing.

Engineering/validation work:

- agent changes reflected immediately in all relevant lenses;
- direct lens edits stay on canonical/Workspace boundaries;
- no lens-owned narrative copies;
- preserve Projection vs Workspace ownership;
- expose stable/domain structure only where it adds creative information;
- optionally add one or two lightweight derived indicators to test narrative insight.

Candidate derived indicators:

- Cue density per Beat;
- section runtime proportion;
- source-speaker distribution;
- unsupported/coverage count.

Do not build a universal narrative score.

## 0C.7 — Agent ↔ lens continuity

User outcomes:

- As a user, I want Salai to understand changes I make directly in a lens.
- As a user, I want to ask questions from the perspective of the current lens.

Validation work:

- direct lens edit → next agent context;
- active lens identity available to agent when useful;
- lens-aware questions;
- Workspace-only intent remains Workspace-only;
- source evidence remains unchanged through agent/lens round trips.

Examples:

```text
Story Wall: Why does the middle feel crowded?
AV Script: Reduce the visual changes in this Beat.
Paper Edit: Can this rely less on Maria?
Outline: Which section is carrying too much weight?
```

## 0C.8 — Human interaction + structural-insight test

### Interaction-compression metrics

- explicit user actions/inputs;
- clarifications;
- moments incidental hierarchy interrupts creative thought;
- perceived flow;
- trust in summary + revert.

### Narrative-Lens metrics

- which lens users open voluntarily;
- what problem they are trying to understand;
- whether the lens reveals something not obvious in prose/chat;
- whether direct manipulation feels creatively meaningful;
- whether exposed concepts justify cognitive cost;
- whether agent + lens together are more useful than either alone.

Required scenarios:

- blank-page branded/product story;
- messy draft + runtime target;
- interview/source radio edit;
- mixed story + attachments + coverage question;
- revert agent interpretation;
- overloaded middle → lens diagnosis;
- source-voice imbalance → Paper/Radio diagnosis;
- audiovisual overload → AV Script diagnosis;
- direct lens edit → follow-up agent instruction.

### Spike 0C exit criterion

Users can create/revise representative stories with materially less incidental interaction than 0B **and** voluntarily use structured Narrative Lenses because those views reveal or manipulate something creatively useful.

# NOT NOW — protect the 0C validation boundary

Do not pull these into the active spike unless a minimal mock is necessary to answer the interaction/lens question:

- Electron packaging/runtime;
- Python/FastAPI service;
- SQLite/durable persistence;
- real Resolve/CutMaster execution;
- full real transcription/media analysis;
- GenAI/ComfyUI execution;
- vector database infrastructure;
- collaborative rich-text editing;
- canonical rich-text document model;
- generic infinite-canvas/graph editor;
- general multi-agent framework;
- autonomous background-agent infrastructure;
- universal AI narrative-quality/pulse score;
- broad polish unrelated to the 0C hypothesis.

# NEXT — local production application

## Epic: desktop runtime

- As a creator, I want Salai to open real local project folders and retain access across sessions.
- As a user, I want Salai to work with local/NAS media without uploading originals to a cloud service.
- As a user, I want agent/lens context to operate on local project/media state.

## Epic: persistence

- Persist canonical project state and recover it after restart/crash.
- Persist agent-applied changes/history enough to support trust/recovery.
- Persist only Workspace semantics still justified after 0C.
- Persist a WorkingDocument/session artifact only if 0C proves it is durable product state.
- Rebuild Narrative Lenses from canonical/Workspace state rather than storing duplicate narratives.

# NEXT — production graph and Coverage lens

- As a videographer, I want Beats/Cues linked to ShotIntents.
- As a creator, I want to ask Salai what coverage is missing.
- As a user, I want captured, stock, generated, storyboard, and previs realizations treated as alternatives for the same intent where appropriate.
- As a user, I want Coverage as a first-class Narrative Lens for verifying the agent's reasoning.

# NEXT — Resolve integration

- As an editor, I want Salai to understand the current Resolve project/timeline context.
- As an editor, I want a selected narrative/source structure materialized as a Resolve timeline.
- As an editor, I want conversational requests/direct lens edits to change canonical Salai state first, then materialize deliberately into Resolve.
- Use the Salai Resolve adapter → CutMaster boundary by default.

# LATER — reverse scripting with real media

- Real transcripts/media analysis → MediaSegments.
- Drop real media into the primary authoring flow.
- Preserve source references through agent/lens operations.
- Add Frame Wall / Selects Narrative Lenses when real-media workflows justify them.

# LATER — GenAI / previs

- Represent missing ShotIntents as generated storyboard/previs.
- Request previs naturally from the same authoring flow.
- Treat outputs as normal assets with provenance.
- Expose generated alternatives through appropriate Narrative Lenses.

# LATER — optional spatial/mixed-media lenses

Potential later work:

- text/images/video/reference/previs in an optional spatial Workspace;
- agent-produced and user-arranged material coexisting visually;
- no requirement for node/link/canvas management in normal authoring;
- promote only if spatial organization solves a demonstrated problem better than current lenses.

# LATER — alternatives / versioning / review

- preserve tried/rejected material;
- create/compare alternative narrative versions;
- agent-generated alternatives as grouped changes or versions;
- annotations tied to narrative/media identity rather than fragile timeline timecodes.

# LATER — asset-management interoperability

- Add OpenAssetIO only when a validated workflow requires external asset resolution/publishing or production asset-management interoperability.
- Until then, use Salai-owned stable Asset identity plus local path/fingerprint/metadata.

# Backlog hygiene

A backlog item belongs in **NOW** only if it directly contributes to the current 0C pass/fail questions:

> Can free-form text, conversation, and media be normalized into trusted canonical changes with materially less routine interaction than 0B?

and

> Do structured Narrative Lenses reveal or manipulate the narrative system in ways that are creatively useful enough to justify their cognitive cost?

If an item mainly adds infrastructure, generic polish, or another surface without answering either question, keep it out of NOW.