# Salai User Stories and Backlog

This is the lightweight product backlog while Salai remains in discovery and spike-driven development.

It owns **priority and user outcomes**, not implementation task numbering. Detailed 0D tasks and completion state live only in [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).

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

0B remains useful evidence that multiple human representations can share one project, but its four surfaces are not assumed to be the final top-level Salai UI.

See [`spike-0b-assessment.md`](spike-0b-assessment.md).

# DONE — Spike 0C: External-Agent Authoring

Human validation used Codex as the external harness. The integration operated the live Salai project correctly and demonstrated the convenience of keeping an agent in the loop for routine structural manipulation.

Validated outcomes:

- external harness operates current Salai state through one machine interface;
- Salai remains canonical project truth;
- routine creative requests no longer require equivalent manual Beat/Cue/parent/operation bookkeeping;
- typed/atomic operation semantics remain underneath agent changes;
- source semantics survive the machine boundary;
- direct UI and agent changes share one project;
- no Salai-owned general model/provider/auth/session runtime is required.

See [`spike-0c-assessment.md`](spike-0c-assessment.md).

# NOW — Spike 0D: Semantic Editorial Environment

0D asks whether Salai's semantic advantage survives contact with actual audiovisual time.

## User outcomes

- As a filmmaker, I can play the current rough story inside Salai without opening Resolve.
- As a filmmaker, I can see Sections/Beats/Cues represented in actual duration rather than only in abstract structure.
- As an editor, I can scrub from narrative structure into source/media realization while preserving the meaning of what I am looking at.
- As an editor, I can reorder a Beat or Cue on the semantic timeline and have the change resolve through canonical Salai operations.
- As an editor, I can trim a SourceExcerpt without losing its source-backed identity/range semantics.
- As a filmmaker, missing visual material remains visibly missing rather than being hidden by the playback layer.
- As a creator, I can ask Codex/external harness for a timing/structure change and immediately watch the canonical result.
- As a creator, a direct timeline change is visible to the next agent context read because both operate on one project.
- As a filmmaker, semantic structure helps me identify or solve at least one pacing/realization problem that a generic clip timeline would communicate less clearly.

## Implementation boundary

Use the smallest replaceable open-source infrastructure needed for the experiment:

- `@moritzbrantner/timeline-editor` — controlled React timeline interaction;
- `@elah/core` — playback/materialization adapter.

Their project/document models are projections only, never canonical Salai state.

## Scope guard

Keep these out of 0D unless a minimal piece is necessary for the pass/fail question:

- full production graph;
- Story Spine/infinite canvas implementation;
- Electron/persistence migration;
- production proxy/cache architecture;
- Resolve/CutMaster execution;
- OTIO/interchange implementation;
- real GenAI execution;
- second agent protocol/runtime;
- advanced NLE trims/transitions/keyframes/effects;
- color/compositing/full audio post;
- collaboration/sync;
- general version graph.

The canonical implementation checklist and evidence are in [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).

# NEXT — local production application

- Open real local project folders and retain access across sessions.
- Work with local/NAS media without requiring originals to be uploaded.
- Persist canonical project, justified Workspace state, and validated structural-editorial state needed to reconstruct the assembly.
- Add recovery/history sufficient for real creative work.
- Keep timeline/rendering engines replaceable and derived from Salai-owned state.

# NEXT — production graph and real media relationships

- Link narrative intent to ShotIntent and real Asset / MediaSegment identity.
- Represent captured, stock, generated, storyboard, and previs realizations as alternatives where evidence justifies a first-class realization concept.
- Reason about real missing coverage.
- Decide from workflow evidence whether Coverage is best as a dedicated view, a timeline overlay/probe, or both.

# NEXT — reverse scripting with real media

- Real transcripts/media analysis → MediaSegments.
- Real source media in the agent + semantic-timeline flow.
- Source references preserved through agent/direct temporal operations.
- Add frame/select views only when real-media workflows justify them.

# LATER — alternatives / review / comparison

- Preserve tried/rejected material without conflating it with Undo.
- Compare alternate realizations and story structures without duplicating entire projects unnecessarily.
- Attach review observations to stable narrative/media identity.
- Support viewer-driven review passes over the playable assembly.

# LATER — Story Spine / Arrange surface

- Test an active temporal spine surrounded by spatial references, alternatives, source material, notes, and generated candidates.
- Prefer Excalidraw as the first MIT implementation reference if/when this experiment becomes active.
- Keep spatial layout Workspace state unless an explicit gesture promotes it to semantic meaning.

# LATER — downstream NLE interchange

- Materialize selected structural editorial decisions to specialist NLEs.
- Keep NLE timelines downstream of canonical Salai state.
- Retain the Salai Resolve adapter → CutMaster boundary when Resolve automation is used.
- Evaluate OTIO or other interchange only when it reduces real adapter coupling.

# LATER — GenAI / previs

- Represent missing production needs as generated storyboard/previs candidates.
- Treat generated outputs as normal assets with provenance.
- Generate/find/replace media in story context rather than through a separate canonical AI project.
- Preserve references and lineage needed to understand how generated material was produced and used.

# LATER — continuity / world constraints

- Preserve character/location/prop/voice/style continuity across realizations when generation/production workflows demonstrate the need.
- Add durable domain concepts only from observed continuity failures, not because a story-bible schema seems theoretically complete.

# LATER — asset-management interoperability

Add OpenAssetIO only when a validated workflow requires external asset resolution/publishing or production asset-management interoperability.

# Backlog hygiene

A backlog item belongs in **NOW** only if it directly helps answer:

> Can Salai's existing semantic model become a playable structural edit whose narrative/source context makes temporal editing materially more useful than a generic clip timeline?

If an item mainly adds infrastructure, a second interaction surface, specialist-NLE features, or generic polish, keep it out of NOW.
