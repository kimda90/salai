# Salai Product Brief

## Product thesis

Salai is a local-first, narrative-aware production companion for DaVinci Resolve.

Its job is not to replace the NLE. Salai keeps story intent, source evidence, production needs, real/generated media, alternatives, and later editorial use connected across a project.

The current product hypothesis is:

> **Express intent naturally; Salai structures it for production. See and reshape that structure through narrative lenses.**

A creator should be able to write freely, converse with Salai, and provide media without manually translating every thought into project structure.

Salai then normalizes that input into a canonical, serializable project representation.

```text
free-form writing / conversation / media
                 ↓
          Salai agent layer
       interpret + normalize
                 ↓
   Narrative IR / production context
                 ↓
          Narrative Lenses
                 ↓
       Resolve materialization
```

The architectural principle remains:

> **One Narrative IR, multiple synchronized creative views.**

The important refinement after Spike 0B is:

> **Hide structural bookkeeping, not narrative structure.**

Structured views are not merely fallback or expert controls. They can reveal the narrative system from different angles and help a creator understand its hierarchy, rhythm, evidence, audiovisual density, gaps, alternatives, and temporal balance.

See [`narrative-lenses.md`](narrative-lenses.md).

## Problem

Video production is fragmented across writing, planning, shooting, reviewing footage, editing, VFX, sound, color, graphics, and increasingly GenAI.

The story intent gets disconnected from the media and edit.

Creators repeatedly need to answer:

- What idea is this scene or shot trying to communicate?
- Which footage supports that idea?
- What coverage is still missing?
- Which interview excerpt supports which part of the story?
- Which alternatives were tried and rejected?
- What changed when the narrative was restructured?
- Could missing material be shot, found, generated, or represented as previs?

Traditional NLEs are excellent at manipulating media but are not designed to preserve this broader narrative/production context.

There is a second product problem exposed by Spike 0B: even when that context is represented correctly, asking the user to manually create, parent, move, and wire structured narrative objects creates too much interaction overhead for ordinary creative work.

The product therefore needs to solve both:

1. preserve structured story/production context; and
2. keep incidental structure from becoming user workload.

At the same time, hiding all structure behind a chat interface would remove valuable ways to understand and shape the story.

Salai therefore needs a third property:

3. expose structure deliberately when it carries creative meaning.

## Solution direction

Salai combines:

- a simple free-form working text area;
- project-aware conversation;
- media/attachment intake;
- an agent that interprets and normalizes creative intent;
- grouped, reversible project changes;
- Narrative Lenses that expose useful dimensions of the canonical project;
- downstream Resolve materialization.

Example working input:

```text
We open on Maria explaining the old manual process.
[ interview_maria.mov ]

Then show installation. I think we are missing a connector close-up.
[ demo-wide.mov ]

End on Juan's result quote.
```

The user can ask:

```text
Tighten the middle and keep this under 45 seconds.
Which parts do not have visual coverage?
Use Maria's second quote instead.
```

Salai performs the structural bookkeeping through typed project operations while preserving source identity and production semantics.

The creator can then open a Narrative Lens when another representation helps:

```text
Outline        → hierarchy / progression / proportion
Story Wall     → spatial rhythm / alternatives / balance
AV Script      → audiovisual density / realization over time
Paper/Radio    → evidence / voice / source pacing
Coverage       → missing realizations / production gaps
```

The agent reduces interaction cost. The lenses preserve legibility and alternate ways of thinking.

## Narrative Lenses

A Narrative Lens is a structured representation of the same canonical project that emphasizes one aspect of the narrative system.

It is not merely an advanced settings panel.

A useful lens should help the creator perceive something difficult to see in ordinary prose or conversation.

Examples:

- an Outline can show that one section carries disproportionate weight;
- a Story Wall can make a crowded middle or weak turning point visually obvious;
- an AV Script can reveal that a simple Beat requires excessive audiovisual changes;
- a Paper Edit can reveal overdependence on one interview voice;
- Coverage can show that several narrative moments have intent but no realization.

Direct manipulation inside a lens remains first-class when the lens itself is the chosen way of thinking.

The failure observed in 0B was not “structured editing is bad.” It was “structured editing should not be compulsory for ordinary creative intent.”

## Narrative pulse

“Narrative pulse” is currently a product metaphor, not a separate domain object.

It describes patterns made legible across the structured project, including:

- progression;
- pacing;
- density;
- alternation;
- repetition;
- voice/evidence distribution;
- audiovisual complexity;
- coverage completeness;
- balance between sections;
- unresolved intent.

Salai should explore how lenses and derived indicators reveal this pulse without prematurely inventing a universal quality score.

## Script-first and footage-first

Projects may begin from either direction.

### Script-first

```text
idea / prose / conversation
          ↓
agent normalization
          ↓
narrative + production intent
          ↓
Narrative Lenses as useful
          ↓
capture / generation / edit
```

### Footage-first

```text
media / transcripts / selects
          ↓
agent normalization
          ↓
source evidence + narrative
          ↓
Narrative Lenses as useful
          ↓
edit / missing coverage
```

The same underlying project representation supports both.

## Target users

Initial audience:

- solo filmmakers/editors;
- small production companies;
- documentary and interview-driven editors;
- videographers producing commercial/corporate work;
- professional YouTube/educational creators;
- Resolve Studio users with recurring story-driven work.

The authoring and production-planning side should remain useful with Resolve closed.

## Product principles

1. **Creative intent before bookkeeping.** Users state the result they want; Salai handles routine structural mechanics.
2. **Hide bookkeeping, not structure.** Internal structure should be visible when it helps the creator understand or shape the story.
3. **Meaning before media.** Narrative intent is not defined by whichever clip currently represents it.
4. **One canonical project state.** Free-form input, chat, lenses, and workspaces must not become drifting competing truths.
5. **Narrative Lenses are first-class creative tools.** Use them to perceive and manipulate the story from different angles.
6. **Interaction cost follows creative decisions.** One creative intention may produce many internal operations but should not require many user actions.
7. **Stable identity.** Normal restructuring should preserve source, production, and editorial relationships.
8. **Authored and sourced material stay distinct.** Recorded evidence is not editable fiction.
9. **Agent changes are constrained and recoverable.** Canonical changes use typed operations, grouped history, and undo.
10. **Clarification is about creative meaning.** Do not ask users to choose internal object types/parents when Salai can infer them.
11. **Alternatives remain recoverable.** Rejected/tried material can move aside without being permanently lost.
12. **Local-first media handling.** Large originals should not require cloud upload.
13. **Resolve remains the NLE.** Salai should not rebuild frame-accurate editing, color, Fusion, Fairlight, or delivery.
14. **AI is the normalization/reasoning layer, not a parallel project model.** Chat history or model output never replaces canonical Salai state.

## Product discovery evidence

Current observed workflow facts include:

- narrative thinking is often idea-first: creators care first about what the audience should understand or experience;
- one Beat may need several Cues;
- creative validation is progressive across reading/imagining, capture/generation, watching material, and editing in context;
- rejected material is often retained nearby or in alternate versions;
- low-friction previs may move useful feedback earlier;
- Spike 0B proved one Narrative IR can support several synchronized structured views;
- the first 0B human UX test found that using direct structured manipulation as the routine authoring path requires too much interaction;
- follow-up interpretation showed that the structured UI remains valuable for understanding the narrative system and modifying it from another angle;
- free-form agent-mediated authoring plus first-class Narrative Lenses is now the active interaction hypothesis.

See [`research-notes.md`](research-notes.md).

## Product-owned semantics

Salai owns:

- Narrative IR and stable narrative identity;
- authored vs source-backed story material;
- ShotIntent and coverage state;
- relationships among narrative, source media, assets, alternatives, review, and editorial context;
- agent interpretation/normalization into canonical project operations;
- grouped change/history semantics;
- Narrative Lens semantics and mapping to canonical state;
- reverse scripting from existing material;
- generation intent/provenance;
- synchronization/handoff with Resolve.

## Reused infrastructure

Where suitable, Salai should reuse mature infrastructure such as CutMaster, OpenTimelineIO, ComfyUI, FFmpeg, model providers, and local media-analysis components rather than rebuilding commodity pipeline layers.

System-level ownership is defined in [`architecture.md`](architecture.md).

## What Salai is not

Salai should not depend on any single feature as its moat, including:

- transcript-based editing;
- script-to-video generation;
- sticky-note boards;
- review/comments;
- standalone GenAI generation;
- generic chat-controlled Resolve actions.

The thesis is the combination:

> **Messy human creative intent and media are normalized into durable narrative/production context; that context can be perceived through multiple creative lenses and stays connected all the way into Resolve.**

The chat/agent layer is not merely a command shell. The structured views are not merely forms. Their combination is the product.

## Pricing / business model

**Not decided yet.**

Pricing/licensing should be explored after the primary authoring workflow demonstrates clear value.

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

> **Can agent-mediated free-form authoring reduce routine interaction while Narrative Lenses preserve enough structural visibility and direct control to deepen creative understanding?**

Current sequence:

1. **Spike 0A — Narrative IR:** complete/pass.
2. **Spike 0B — structured authoring UX:** closed; semantic architecture passes, routine direct-manipulation workflow fails the creative-friction test.
3. **Spike 0C — Agent-Mediated Authoring + Narrative Lenses:** validate free-form text/chat/media → grouped typed changes, plus voluntary structured-lens use for insight and direct shaping.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md), [`narrative-lenses.md`](narrative-lenses.md), [`mvp.md`](mvp.md), and [`backlog.md`](backlog.md).

## Positioning hypothesis

> **A narrative-aware workspace where you can write, talk, or drop media; Salai turns that intent into structured production context, lets you see the story through multiple narrative lenses, and keeps everything connected through DaVinci Resolve.**