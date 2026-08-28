# Salai Product Brief

## Product thesis

Salai is a local-first, narrative-aware production companion for DaVinci Resolve.

Its job is not to replace the NLE. Salai keeps story intent, source evidence, production needs, real/generated media, alternatives, and later editorial use connected across a project.

Current product hypothesis:

> **Express intent naturally; Salai structures it for production. See and reshape that structure through narrative lenses.**

The architectural foundation remains:

> **One Narrative IR, multiple synchronized creative views.**

The interaction refinement after Spike 0B is:

> **Hide structural bookkeeping, not narrative structure.**

A creator should be able to write, instruct Salai, and provide media without manually translating every thought into object/parent/operation mechanics. The same creator should be able to enter a structured Narrative Lens when that representation helps them understand or reshape the story.

## Problem

Video production is fragmented across writing, planning, shooting, footage review, editing, VFX, sound, color, graphics, and GenAI.

Story intent gets disconnected from media and edit. Creators repeatedly need to know:

- what idea a scene/shot is trying to communicate;
- which footage supports that idea;
- what coverage is missing;
- which interview excerpt supports which part of the story;
- which alternatives were tried or rejected;
- what changed after restructuring;
- whether missing material should be shot, found, generated, or represented as previs.

Traditional NLEs are excellent at media/timeline manipulation but do not maintain this broader narrative/production context.

Spike 0B exposed a second problem: even when the context is represented correctly, asking the user to manually create, parent, move, and wire structured narrative objects creates too much interaction overhead for routine creative work.

Salai therefore needs to do three things:

1. preserve structured story/production context;
2. keep incidental structure from becoming routine user workload;
3. expose meaningful structure deliberately when it helps the creator think.

## Solution direction

```text
free-form writing / instruction / supplied media
                    ↓
          Salai interpretation layer
                    ↓
        validated canonical project
                    ↓
             Narrative Lenses
                    ↓
          downstream Resolve work
```

The agent reduces bookkeeping. Narrative Lenses preserve legibility, agency, and alternate ways of thinking.

Narrative Lens semantics are defined in [`narrative-lenses.md`](narrative-lenses.md). The active low-friction interaction contract is [`agent-mediated-authoring.md`](agent-mediated-authoring.md).

## Script-first and footage-first

### Script-first

```text
idea / prose / instruction
          ↓
normalization
          ↓
narrative + production intent
          ↓
optional deliberate lens work
          ↓
capture / generation / edit
```

### Footage-first

```text
media / transcripts / selects
          ↓
normalization
          ↓
source evidence + narrative
          ↓
optional deliberate lens work
          ↓
edit / missing coverage
```

Both paths use the same canonical project representation.

## Product principles

1. **Creative intent before bookkeeping.** Users state the result they want; Salai handles routine structural mechanics.
2. **Hide bookkeeping, not structure.** Expose structure when it contributes to a creative decision.
3. **Meaning before media.** Narrative intent is not defined by whichever clip currently represents it.
4. **One canonical project state.** Working input, chat, lenses, and workspaces must not become drifting competing truths.
5. **Narrative Lenses are first-class creative tools.** Direct manipulation remains valid when the representation is the chosen way of thinking.
6. **Interaction cost follows creative decisions.** One creative intention may produce several internal operations but should not require equivalent user actions.
7. **Stable identity.** Normal restructuring preserves source, production, and editorial relationships.
8. **Authored and sourced material stay distinct.** Recorded evidence is not editable fiction.
9. **Agent changes are constrained and recoverable.** Canonical changes use typed operations and grouped revert/history semantics.
10. **Clarification is about creative meaning.** Do not ask users to choose raw internal mechanics when Salai can infer them.
11. **Alternatives remain recoverable.** Tried/rejected material can move aside without being permanently lost.
12. **Local-first media handling.** Camera originals remain local by default; hosted inference receives only task-relevant selected/derived context unless broader egress is explicitly chosen.
13. **Resolve remains the NLE.** Salai does not rebuild frame-accurate editing, color, Fusion, Fairlight, or delivery.
14. **AI is a normalization/reasoning layer, not a parallel project model.**

## Target users

Initial audience:

- solo filmmakers/editors;
- small production companies;
- documentary and interview-driven editors;
- commercial/corporate videographers;
- professional YouTube/educational creators;
- Resolve Studio users with recurring story-driven work.

The authoring/planning side should remain useful with Resolve closed.

## Product-owned semantics

Salai owns:

- Narrative IR and stable narrative identity;
- authored vs source-backed material;
- Narrative Lens semantics and Workspace boundaries;
- agent interpretation/normalization into canonical operations;
- grouped action/revert semantics;
- ShotIntent and production/media relationships when introduced;
- reverse scripting from existing material;
- generation intent/provenance;
- Resolve materialization boundaries.

Commodity infrastructure should be reused for model inference, UI mechanics, media analysis, generation execution, interchange, and Resolve automation where appropriate.

See [`architecture.md`](architecture.md).

## What Salai is not

Salai is not defined by any one feature such as:

- transcript-based editing;
- script-to-video generation;
- sticky-note boards;
- review/comments;
- standalone GenAI generation;
- generic chat-controlled Resolve actions.

The thesis is the combination:

> **Messy human creative intent and media become durable narrative/production context; creators can perceive that context through multiple creative lenses; the context remains connected into Resolve.**

## Current discovery evidence

- Spike 0A validated the Narrative IR baseline.
- Spike 0B validated one canonical project across four structured views.
- The first 0B human test found that routine direct structured authoring requires too much interaction.
- Follow-up interpretation found that the same structured UI remains useful for understanding/manipulating the narrative system from another angle.
- Spike 0C therefore tests agent-mediated routine authoring plus first-class Narrative Lenses.

See [`research-notes.md`](research-notes.md).

## Current product-risk focus

Highest current uncertainty:

> **Can agent-mediated free-form authoring materially reduce routine interaction while existing Narrative Lenses preserve enough structural visibility and direct control to deepen creative understanding?**

Current sequence:

1. **0A — Narrative IR:** complete/pass.
2. **0B — Structured authoring UX:** closed/mixed; semantic architecture passes, routine direct-manipulation workflow fails the creative-friction test.
3. **0C — Agent-Mediated Authoring + Narrative Lenses:** current validation milestone.

See [`mvp.md`](mvp.md) and [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).

## Pricing / business model

**Not decided yet.**

Revisit after the primary authoring workflow demonstrates clear value. Open questions include desktop license vs subscription, paid upgrades/support, optional hosted AI services, individual/team tiers, offline/local-only viability, and provider-cost implications.

## Positioning hypothesis

> **A narrative-aware workspace where you can write, instruct Salai, or provide media; Salai turns that intent into structured production context, lets you see the story through multiple narrative lenses, and keeps it connected through DaVinci Resolve.**