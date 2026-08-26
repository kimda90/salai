# Salai Product Brief

## Product thesis

Salai is a local-first, narrative-aware production companion for DaVinci Resolve.

Its job is not to replace the NLE. Salai keeps story intent, source evidence, production needs, real/generated media, alternatives, and later editorial use connected across a project.

The central product idea is:

> **One Narrative IR, multiple familiar creative workflows.**

Projects may begin from either direction:

```text
script-first
idea → narrative → production intent → capture/generation → edit

footage-first
media → source evidence/selects → narrative → edit
```

The same underlying project should be usable through workflows filmmakers already understand rather than through exposed database/graph concepts.

## Problem

Video production context is fragmented across scripts, notes, cards, shot lists, bins, transcripts, review systems, AI tools, and timelines.

Traditional NLEs are excellent at manipulating media but are not designed to preserve all of the broader questions editors carry in their heads:

- What idea is this moment trying to communicate?
- Which footage or interview quote supports it?
- What coverage is missing?
- Which alternatives were tried and rejected?
- What changed when the narrative was restructured?
- Can a missing element be shot, found, generated, or represented as previs?

When those answers live in separate documents or memory, story intent drifts away from media and the edit.

## Solution direction

Salai maintains stable narrative/production identity while presenting familiar working surfaces such as:

- Outline;
- AV Script;
- Story Wall / sticky-note scene construction;
- Beat Board / scratch board;
- Paper Edit;
- Radio Edit;
- Coverage / shot planning;
- later Frame Wall, Selects, previs, and timeline-oriented views.

Some surfaces are derived **Projections**; others are persistent **Workspaces**. See [`glossary.md`](glossary.md) for canonical terminology and [`workflows.md`](workflows.md) for UX semantics.

Generated media is treated like ordinary production media: it can represent previs, missing coverage, alternatives, plates, graphics, etc., and then be reviewed/edited normally.

DaVinci Resolve remains the actual editing, finishing, color, audio, VFX, and delivery environment.

## Target users

Initial audience:

- solo professional videographers;
- small production teams and agencies;
- branded/corporate content producers;
- documentary/interview editors;
- professional YouTube/educational creators;
- Resolve Studio users with recurring story-driven work.

The scripting/production-planning side should remain useful with Resolve closed.

## Product principles

1. **Meaning before media.** Narrative intent is not defined by whichever clip currently represents it.
2. **Familiar workflows over internal abstractions.** Users work with cards, scenes, quotes, beats, frames, scripts, and selects.
3. **One source of narrative truth.** Workspaces/projections should not become drifting duplicate documents.
4. **Stable identity.** Normal restructuring should preserve source/production/editorial relationships.
5. **Authored and sourced material stay distinct.** Recorded evidence is not editable fiction.
6. **Alternatives remain recoverable.** Rejected/tried material can move aside without being permanently lost.
7. **Local-first media handling.** Large originals should not require cloud upload.
8. **Resolve remains the NLE.** Salai should not rebuild frame-accurate editing, color, Fusion, Fairlight, or delivery.
9. **AI is assistive and reviewable.** AI should propose operations/media/alternatives without silently replacing project state.

## Product discovery evidence

Current observed workflow facts include:

- creators often think first in terms of the narrative progression the audience should receive;
- one Beat may require several audiovisual Cues;
- no additional semantic level below Cue has yet been justified;
- creative validation is progressive across reading/imagining, capture or generation, watching material, and editing in context;
- rejected material is often kept nearby or in alternate versions;
- low-friction previs may move useful feedback earlier;
- a mixed-media spatial canvas is a shelved research direction rather than a committed feature.

See [`research-notes.md`](research-notes.md) for the evidence record.

## Product boundary

### Salai owns

- narrative structure/identity;
- authored vs source-backed story material;
- ShotIntent and coverage state;
- relationships among narrative, source media, assets, alternatives, review, and editorial context;
- familiar narrative/editorial workspaces;
- reverse scripting from existing material;
- AI-assisted production reasoning;
- generation intent/provenance;
- synchronization/handoff with Resolve.

### Resolve owns

- media playback/proxies/codecs;
- frame-accurate editing;
- Fusion;
- color;
- Fairlight/audio post;
- rendering/delivery.

### Reused infrastructure

Where suitable, Salai should reuse mature infrastructure such as CutMaster, OpenAssetIO, OpenTimelineIO, ComfyUI, and FFmpeg rather than rebuilding commodity pipeline layers.

System-level ownership is defined in [`architecture.md`](architecture.md).

## Differentiation

Salai should not depend on any single feature as its moat, including:

- traditional screenplay formatting;
- transcription;
- transcript/text-based editing;
- semantic media search;
- script-to-rough-cut;
- sticky-note boards;
- review/comments;
- standalone GenAI generation;
- chat-controlled Resolve actions.

The thesis is the **combination**: persistent narrative intent and production context across several familiar creative methods, with real/source/generated media staying connected through to Resolve.

See [`competitive-landscape.md`](competitive-landscape.md) for named adjacent products and positioning pressure tests.

## Business model

**Not decided yet.**

Pricing/licensing should be explored after the Narrative IR and authoring workflow demonstrate clear value. The current discovery phase should not optimize the product model around an unvalidated pricing assumption.

Questions to revisit after 0A/0B include:

- one-time desktop license vs subscription;
- paid upgrades/support;
- optional hosted/AI services;
- individual vs team/agency tiers;
- whether an offline/local-only tier remains viable without hosted dependencies.

## Current product-risk focus

The highest current uncertainty is the Narrative IR, not broad Resolve automation.

Implementation details are canonical in [`narrative-ir-spec.md`](narrative-ir-spec.md); this brief intentionally does not duplicate its types, operation list, or invariants.

Current sequence:

1. **Spike 0A — Narrative IR**: validate semantic model/operations/fixtures in pure TypeScript.
2. **Spike 0B — Authoring UX**: validate familiar surfaces over the same model.
3. **Spike 0C — Assisted authoring**: validate AI-proposed operations with reviewable consequences.

See [`mvp.md`](mvp.md) for the full roadmap and [`backlog.md`](backlog.md) for current ordering.

## Positioning hypothesis

> **A workspace where the story, source material, production intent, generated assets, alternatives, and Resolve edit stay connected.**
