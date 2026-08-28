# Salai Product Brief

## Product thesis

Salai is a local-first, narrative-aware production companion for DaVinci Resolve.

Its job is not to replace the NLE. Salai keeps story intent, source evidence, production needs, real/generated media, alternatives, and later editorial use connected across a project.

The current product hypothesis is:

> **Express intent naturally; Salai structures it for production.**

A creator should be able to write freely, converse with Salai, and provide media without manually translating every thought into project structure.

Salai then normalizes that input into a canonical, serializable project representation:

```text
free-form writing / conversation / media
                 ↓
          Salai agent layer
       interpret + normalize
                 ↓
   Narrative IR / production context
                 ↓
 specialized views / Resolve materialization
```

The earlier architectural principle remains important:

> **One Narrative IR, multiple synchronized creative views.**

Story Wall, Outline, AV Script, Paper/Radio Edit, Coverage, and later media-oriented surfaces remain useful ways to inspect or precisely edit the same project. Human testing showed they should not be assumed to be the primary authoring entry point.

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

There is a second product problem exposed by Spike 0B: even when the context is represented correctly, asking the user to manually create, parent, move, and wire structured narrative objects produces too much interaction overhead for creative work.

The product therefore needs to solve **both**:

1. preserve structured story/production context; and
2. keep that structure from becoming user workload.

## Solution direction

The primary authoring experience should combine:

- a simple free-form working text area;
- project-aware conversation;
- media/attachment intake;
- an agent that interprets and normalizes creative intent;
- grouped, reversible project changes;
- optional structured views for precision and inspection.

Example:

```text
We open on Maria explaining the old manual process.
[ interview_maria.mov ]

Then show installation. I think we are missing a connector close-up.
[ demo-wide.mov ]

End on Juan's result quote.
```

The user can then ask:

```text
Tighten the middle and keep this under 45 seconds.
Which parts do not have visual coverage?
Use Maria's second quote instead.
```

Salai should perform the structural bookkeeping through typed project operations while preserving source identity and production semantics.

## Role of structured views

Structured surfaces remain important but become specialized tools rather than mandatory stages.

- **Outline** — inspect or precisely edit hierarchy.
- **Story Wall** — inspect spatial structure, alternatives, and parking.
- **AV Script** — plan/inspect visual and audio realization.
- **Paper / Radio Edit** — inspect or precisely arrange source evidence.
- **Coverage** — identify production needs and realizations.
- later **Frame Wall / Selects** — visually inspect real media.

A creator should open these because the representation helps them think, not because a routine operation is available only there.

## Script-first and footage-first

Projects may still begin from either direction:

```text
script-first
idea / prose / conversation
          ↓
agent normalization
          ↓
narrative + production intent
          ↓
capture / generation / edit

footage-first
media / transcripts / selects
          ↓
agent normalization
          ↓
source evidence + narrative
          ↓
edit / missing coverage
```

The same underlying project representation supports both.

## Target users

Initial audience:

- solo professional videographers;
- small production teams and agencies;
- branded/corporate content producers;
- documentary/interview editors;
- professional YouTube/educational creators;
- Resolve Studio users with recurring story-driven work.

The authoring/production-planning side should remain useful with Resolve closed.

## Product principles

1. **Creative intent before structure.** Users express the outcome they want; Salai handles routine structural bookkeeping.
2. **Meaning before media.** Narrative intent is not defined by whichever clip currently represents it.
3. **One canonical project state.** Free-form input, chat, projections, and workspaces must not become drifting competing truths.
4. **Structured views are tools, not obligations.** Use Outline/Story Wall/AV/Paper when the representation helps.
5. **Stable identity.** Normal restructuring should preserve source/production/editorial relationships.
6. **Authored and sourced material stay distinct.** Recorded evidence is not editable fiction.
7. **Interaction cost follows creative decisions.** One creative intention may produce many internal operations but should not require many user actions.
8. **Agent changes are constrained and recoverable.** Canonical changes use typed operations, grouped history, and undo; high-impact external effects require explicit confirmation.
9. **Alternatives remain recoverable.** Rejected/tried material can move aside without being permanently lost.
10. **Local-first media handling.** Large originals should not require cloud upload.
11. **Resolve remains the NLE.** Salai should not rebuild frame-accurate editing, color, Fusion, Fairlight, or delivery.
12. **AI is the normalization layer, not a parallel project model.** Chat history or model output never replaces canonical Salai state.

## Product discovery evidence

Current observed workflow facts include:

- creators often think first in terms of the narrative progression the audience should receive;
- one Beat may require several audiovisual Cues;
- no additional semantic level below Cue has yet been justified;
- creative validation is progressive across reading/imagining, capture or generation, watching material, and editing in context;
- rejected material is often kept nearby or in alternate versions;
- low-friction previs may move useful feedback earlier;
- Spike 0B proved one Narrative IR can support several structured views;
- the first 0B human UX test found that direct structured manipulation requires too much interaction to remain creatively useful as the primary workflow;
- free-form text + conversation + media normalization is now the active interaction hypothesis.

See [`research-notes.md`](research-notes.md) for the evidence record.

## Product boundary

### Salai owns

- narrative structure/identity;
- authored vs source-backed story material;
- ShotIntent and coverage state;
- relationships among narrative, source media, assets, alternatives, review, and editorial context;
- agent interpretation/normalization into canonical project operations;
- grouped change/history semantics for agent-mediated authoring;
- familiar narrative/editorial projections and workspaces;
- reverse scripting from existing material;
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

Where suitable, Salai should reuse mature infrastructure such as CutMaster, OpenTimelineIO, ComfyUI, FFmpeg, model providers, and local media-analysis components rather than rebuilding commodity pipeline layers.

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
- generic chat-controlled Resolve actions.

The thesis is the **combination**:

> messy human creative intent and media are normalized into durable narrative/production context that stays connected all the way into Resolve.

The chat/agent layer is therefore not merely a command shell for Resolve. Its value is maintaining and evolving the structured project model that other views and systems can consume.

See [`competitive-landscape.md`](competitive-landscape.md) for named adjacent products and positioning pressure tests.

## Business model

**Not decided yet.**

Pricing/licensing should be explored after the new primary authoring workflow demonstrates clear value. The current discovery phase should not optimize the product around an unvalidated pricing assumption.

Questions to revisit after 0C include:

- one-time desktop license vs subscription;
- paid upgrades/support;
- optional hosted/AI services;
- individual vs team/agency tiers;
- whether an offline/local-only tier remains viable;
- how model-provider costs affect local vs hosted modes.

## Current product-risk focus

Spike 0A reduced the Narrative IR risk. Spike 0B reduced the multi-view architecture risk and exposed the primary UX risk.

The highest current uncertainty is now:

> **Can agent-mediated free-form authoring reduce interaction enough to preserve creative flow without losing trust, source identity, or deterministic project state?**

Current sequence:

1. **Spike 0A — Narrative IR:** complete/pass.
2. **Spike 0B — structured authoring UX:** closed; semantic architecture passes, direct-manipulation primary UX fails creative-friction test.
3. **Spike 0C — Agent-Mediated Authoring:** validate free-form text/chat/media → grouped typed project changes.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md), [`mvp.md`](mvp.md), and [`backlog.md`](backlog.md).

## Positioning hypothesis

> **A narrative-aware workspace where you can write, talk, or drop media, and Salai turns that creative intent into structured production context that stays connected through DaVinci Resolve.**
