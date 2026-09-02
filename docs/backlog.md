# Salai User Stories and Backlog

This is the lightweight product backlog while Salai remains in discovery and spike-driven development.

It owns **priority and user outcomes**, not implementation task numbering. Detailed 0E tasks and completion state live only in [`spike-0e-implementation-plan.md`](spike-0e-implementation-plan.md).

## Priority model

- **DONE** — validated enough to move to the next risk; revisit only when new evidence requires it.
- **NOW** — required to retire the current product/technical risk.
- **NEXT** — follows the current milestone.
- **LATER** — important direction, intentionally deferred.

# DONE — Spike 0A: Narrative IR

Validated one semantic narrative model with stable identity, authored/source-backed distinction, source/ShotIntent references, typed operations, validation, serialization, runtime estimation, and representative script-first/footage-first fixtures.

See [`spike-0a-assessment.md`](spike-0a-assessment.md).

# DONE — Spike 0B: synchronized structured-view architecture

Validated one canonical project across Story Wall, Outline, AV Script, and Paper/Radio Edit. Human testing found routine direct structured manipulation too interaction-heavy to be the default authoring path.

See [`spike-0b-assessment.md`](spike-0b-assessment.md).

# DONE — Spike 0C: External-Agent Authoring

Human validation using Codex proved that an external harness can operate the live Salai project correctly and materially reduce routine structural bookkeeping without becoming a second source of truth.

See [`spike-0c-assessment.md`](spike-0c-assessment.md).

# DONE — Spike 0D: Semantic Editorial Environment architecture

0D closed **mixed**.

Technical results retained:

- Narrative IR → semantic time projection works;
- rough picture/audio playback works without Resolve;
- direct Beat/Cue reorder and SourceExcerpt trim can round-trip through canonical operations;
- timeline/playback engines remain derived/replaceable;
- direct and external-agent temporal work share one project.

Human result:

- the editor was too shallow and fragmented to fairly validate semantic structural editing;
- semantic-level switching lost context;
- creation, inspector depth, multiple Cue contents, multi-selection, source I/O, split/blade, and familiar transport were insufficient;
- the user could not meaningfully judge/improve the rough story inside Salai alone.

See [`spike-0d-assessment.md`](spike-0d-assessment.md).

# NOW — Spike 0E: Semantic Editorial Interaction Depth

0E asks whether a sufficiently expressive **semantic** temporal editor changes creative reasoning before Salai invests in production infrastructure.

## Current shaping gate

Before implementation, stabilize:

- [`rfcs/0003-semantic-editorial-interaction-model.md`](rfcs/0003-semantic-editorial-interaction-model.md);
- [`editorial-interaction.md`](editorial-interaction.md);
- [`spike-0e-implementation-plan.md`](spike-0e-implementation-plan.md).

Do not use implementation to decide unresolved Cue split, SourceExcerpt split, independent within-Cue timing, intentional black-vs-missing semantics, or broad cross-parent multi-move behavior.

## User outcomes

- As a filmmaker, I can keep the whole story's time visible while expanding Section → Beat → Cue → audiovisual detail.
- As an editor, I do not have to switch Story/Moments/Media modes merely to reach nested objects.
- As an editor, selecting any visible semantic object gives me the meaningful properties/actions for that object.
- As a filmmaker, I can add a Beat, Cue, visual block, or audio block from the temporal environment in a valid semantic location.
- As an editor, I can see and manipulate every visual/audio block in a Cue rather than one representative item.
- As an editor, I can multi-select compatible semantic objects and perform at least one useful grouped canonical edit.
- As an editor, Space toggles play/pause in normal timeline use.
- As an editor, I can reorder Sections/Beats/Cues/blocks through canonical move semantics.
- As an editor, I can change Cue narrative duration separately from trimming SourceExcerpt evidence.
- As an editor, I can adjust SourceExcerpt source in/out without losing source identity.
- As an editor, I can split a Beat at a valid Cue boundary and merge Beats using existing canonical semantics.
- As a creator, I can move between direct temporal work and Codex/external harness without synchronization bookkeeping.
- As a filmmaker, I can identify a concrete decision where semantic hierarchy helps more than generic clip thinking.
- As a filmmaker, I can judge/improve the representative structural rough story without Resolve.

## Interaction boundary

0E uses current Narrative IR sequence semantics:

- Cue is the narrative-time interval;
- all visual/audio blocks inside a Cue are exposed but do not gain hidden independent offsets/durations;
- reorders and Cue-duration changes ripple later derived time;
- source I/O remains SourceExcerpt evidence;
- arbitrary free-positioned clip/gap/overwrite behavior is not NOW scope.

## Infrastructure boundary

Continue to treat:

- `@moritzbrantner/timeline-editor` as replaceable timeline interaction infrastructure;
- `@elah/core` as replaceable playback/materialization infrastructure.

Either may be wrapped/replaced if it cannot express the shaped contract, but their state never becomes Salai project truth.

## Scope guard

Keep these out of 0E unless the minimum piece is necessary for the human pass/fail question:

- full production graph;
- Story Spine/infinite canvas;
- Electron/persistence migration;
- production proxy/cache architecture;
- Resolve/CutMaster execution;
- OTIO/interchange implementation;
- real GenAI execution;
- second agent protocol/runtime;
- arbitrary free-positioned clip model;
- independent ordinary ContentBlock timing;
- advanced NLE trim/transition/keyframe/effect systems;
- color/compositing/full audio post;
- collaboration/sync;
- general version graph.

# NEXT — local production application

Proceed only after 0E passes the direct semantic-editorial human gate.

- Open real local project folders and retain access across sessions.
- Work with local/NAS media without requiring originals to be uploaded.
- Persist canonical project, justified Workspace state, and validated structural-editorial state needed to reconstruct the assembly.
- Add recovery/history sufficient for real creative work.
- Keep timeline/rendering engines replaceable and derived.

# NEXT — production graph and real media relationships

- Link narrative intent to ShotIntent and real Asset / MediaSegment identity.
- Represent captured, stock, generated, storyboard, and previs realizations as alternatives where evidence justifies a first-class realization concept.
- Reason about real missing coverage.
- Decide from workflow evidence whether Coverage is a dedicated view, timeline overlay/probe, or both.

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

# LATER — continuity / world constraints

- Preserve character/location/prop/voice/style continuity across realizations when generation/production workflows demonstrate the need.
- Add durable concepts only from observed failures.

# LATER — asset-management interoperability

Add OpenAssetIO only when a validated workflow requires external asset resolution/publishing or production asset-management interoperability.

# Backlog hygiene

A backlog item belongs in **NOW** only if it directly helps answer:

> If Salai exposes one context-preserving semantic temporal hierarchy plus the minimum useful canonical editing grammar, does that materially improve structural editorial reasoning over generic clip manipulation?

If an item mainly adds production infrastructure, a second interaction surface, specialist-NLE features, or generic polish, keep it out of NOW.
