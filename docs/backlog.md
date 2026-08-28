# Salai User Stories and Backlog

This is the lightweight product backlog while Salai remains in discovery and spike-driven development.

It owns **priority and user outcomes**, not implementation task numbering. Detailed 0C tasks and completion state live only in [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).

## Priority model

- **DONE** — validated enough to move to the next risk; revisit only when new evidence requires it.
- **NOW** — required to retire the current product/technical risk.
- **NEXT** — follows the current milestone.
- **LATER** — important direction, intentionally deferred.

# DONE — Spike 0A: Narrative IR

Validated one semantic narrative model with stable identity, authored/source-backed distinction, source/ShotIntent references, typed operations, validation, serialization, runtime estimation, and representative script-first/footage-first fixtures.

See [`spike-0a-assessment.md`](spike-0a-assessment.md).

# DONE — Spike 0B: synchronized structured-view architecture

Validated one canonical project across Story Wall, Outline, AV Script, and Paper/Radio Edit, including stable Beat/Cue/source identity, Workspace isolation, source semantics, runtime/structural edits, and cross-surface propagation.

Human finding:

> **Using direct structured manipulation as the routine path requires too much user interaction to be creatively useful.**

Follow-up interpretation:

> **Structured views remain useful when they expose the narrative system and let the creator understand or modify it from another angle.**

0B is therefore complete as a discovery spike, not a product UX pass.

See [`spike-0b-assessment.md`](spike-0b-assessment.md).

# NOW — Spike 0C: Agent-Mediated Authoring + Narrative Lenses

0C has two user-level outcomes:

1. **interaction compression** — routine creative tasks require materially less structural bookkeeping than 0B; and
2. **structural insight** — creators voluntarily use existing Narrative Lenses when those views help them understand or reshape the story.

## User outcomes

- As a creator, I can write or describe a story change without manually creating and parenting every Beat/Cue.
- As a creator, I can provide mocked/fixture-backed source material without manually wiring every source relationship.
- As a creator, one instruction can become several canonical changes while still appearing as one understandable action.
- As a creator, I can revert the last agent-applied action if Salai interpreted me incorrectly.
- As an editor, recorded source wording/ranges remain source evidence through agent-mediated changes.
- As a creator, I can open an existing Narrative Lens when hierarchy, spatial arrangement, audiovisual realization, or source evidence is the thing I want to inspect or manipulate.
- As a creator, a direct lens edit is visible to the next agent request because both operate on one canonical project.
- As a creator, I can ask what supplied material is unsupported/missing without requiring a new Coverage Lens in this spike.

## Scope guard

0C should prove the smallest end-to-end vertical slices first:

- one script-first flow;
- one footage/source-backed flow;
- grouped apply + revert;
- one agent ↔ direct-lens round trip;
- human comparison against 0B interaction burden.

The canonical implementation checklist and evidence are in [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).

# NOT NOW — protect the 0C validation boundary

Keep these out of 0C unless a minimal mock is necessary to answer its pass/fail question:

- Electron packaging/runtime;
- Python/FastAPI service;
- SQLite/durable persistence;
- real Resolve/CutMaster execution;
- full transcription/media analysis;
- production graph implementation;
- a new Coverage Lens;
- GenAI/ComfyUI execution;
- vector database infrastructure;
- collaborative/canonical rich-text editing;
- generic infinite-canvas/graph editor;
- general multi-agent framework;
- autonomous background-agent infrastructure;
- universal narrative-quality/pulse scoring;
- broad polish unrelated to interaction compression or structural insight.

# NEXT — local production application

- Open real local project folders and retain access across sessions.
- Work with local/NAS media without requiring originals to be uploaded.
- Persist canonical project, justified Workspace state, and enough action/history state for recovery.
- Keep Narrative Lenses derived from canonical/Workspace state rather than storing duplicate narratives.

# NEXT — production graph and Coverage Lens

- Link narrative intent to ShotIntent and real Asset / MediaSegment identity.
- Represent captured, stock, generated, storyboard, and previs realizations as alternatives where appropriate.
- Reason about real missing coverage.
- Build Coverage as a first-class Narrative Lens when the production graph exists and the workflow is validated.

# NEXT — Resolve integration

- Read relevant Resolve project/timeline context.
- Materialize selected narrative/source choices into Resolve deliberately.
- Keep conversational requests and lens edits canonical in Salai before materialization.
- Use the Salai Resolve adapter → CutMaster boundary by default.

# LATER — reverse scripting with real media

- Real transcripts/media analysis → MediaSegments.
- Real media in the low-friction authoring flow.
- Source references preserved through agent/lens operations.
- Frame Wall / Selects lenses when real-media workflows justify them.

# LATER — GenAI / previs

- Represent missing ShotIntents as generated storyboard/previs candidates.
- Treat generated outputs as normal assets with provenance.
- Expose generated alternatives through appropriate Narrative Lenses.

# LATER — alternatives / versioning / review

- Preserve tried/rejected material.
- Create and compare alternative narrative versions.
- Keep annotations tied to narrative/media identity rather than fragile timeline timecodes.

# LATER — asset-management interoperability

Add OpenAssetIO only when a validated workflow requires external asset resolution/publishing or production asset-management interoperability.

# Backlog hygiene

A backlog item belongs in **NOW** only if it directly helps answer one of these questions:

> Can ordinary creative intent become trusted canonical changes with materially less routine interaction than 0B?

> Do existing Narrative Lenses reveal or manipulate the narrative system in ways that are creatively useful enough to justify their cognitive cost?

If an item mainly adds infrastructure, another surface, or generic polish, keep it out of NOW.