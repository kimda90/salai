# Narrative Lenses

## Status

Living product/UX concept introduced from the first Spike 0B human test and the subsequent agent-mediated authoring direction.

This document defines the role of structured Salai surfaces after the 0B finding that direct model management creates too much creative friction.

## Core principle

> **Hide structural bookkeeping, not narrative structure.**

Salai should not require a filmmaker to manually serialize every creative intention into Sections, Scenes, Beats, Cues, parent references, source relationships, or low-level operations.

At the same time, those structures can carry real creative information. Seeing them can help a filmmaker understand the story from an angle that prose or conversation alone cannot reveal.

The product should therefore distinguish between:

- **structural bookkeeping** — mechanics Salai should normally infer or automate; and
- **structural perception** — information worth exposing because it helps the creator understand or shape the story.

## Narrative Lens

A **Narrative Lens** is a structured representation of the same canonical Salai project that deliberately emphasizes one aspect of the narrative system.

A lens is not merely an advanced settings panel or fallback editor. It is a way to **see, feel, and modify the narrative from a particular creative angle**.

Examples:

| Lens | What it reveals |
| --- | --- |
| Outline | hierarchy, progression, proportion, structural weight |
| Story Wall | spatial rhythm, balance, turning points, alternatives, clustering |
| AV Script | audiovisual density, realization over time, visual/audio interplay |
| Paper / Radio Edit | evidentiary spine, voice, source pacing, authored-vs-sourced balance |
| Coverage | gaps between intent and available realization |
| Runtime / pacing views | temporal pressure, density, narrative weight |
| Frame Wall / Selects | visual coverage, contrast, repetition, usable alternatives |

The same canonical Beat may therefore be experienced differently through different lenses without creating multiple competing story documents.

## Primary authoring vs narrative lenses

Salai has two complementary interaction modes.

### Low-friction authoring

The user can:

- write freely;
- talk to the agent;
- paste notes;
- drop media;
- describe a desired change.

Salai interprets and normalizes that intent into canonical state.

This mode minimizes structural bookkeeping.

### Narrative lenses

The user can deliberately open a lens when the representation itself helps them reason.

For example:

- open Story Wall because the middle feels crowded and spatial balance may reveal why;
- open AV Script because a Beat feels narratively simple but audiovisually overloaded;
- open Paper Edit because the story depends too heavily on one interview voice;
- open Coverage because several Beats have intent but no credible realization;
- open Outline because the hierarchy or proportion is itself the creative question.

The user may then edit directly in that lens. Direct manipulation remains valuable when the structure being manipulated is itself the thing the creator is thinking about.

## What a lens should expose

A lens should expose internal structure when that structure has creative meaning.

Useful examples:

- one Beat contains six Cues while another contains one;
- a section carries half the total runtime;
- three consecutive Beats depend on the same speaker;
- a Beat has no visual realization;
- the middle of a Story Wall is spatially dense;
- several source-backed moments compete for the same narrative function;
- a short narrative idea requires unexpectedly complex audiovisual coverage.

These are not implementation details merely because they derive from the Narrative IR. They can be part of the story's **pulse**.

## What a lens should hide

A lens should not expose mechanics that add no useful creative information.

Examples that should usually remain implicit:

- generating canonical IDs;
- choosing raw `ParentRef` values;
- calculating array indices;
- manually creating a Cue only because the data model needs one;
- choosing a domain operation type for an obvious creative change;
- wiring source relationships that can be inferred safely from context;
- switching views merely because an operation is unavailable elsewhere.

The difference is not “simple UI vs advanced UI.” The difference is whether the exposed structure contributes to the creative decision.

## Agent relationship

The agent and the lenses operate on the same canonical project.

```text
write / talk / drop media
          ↓
     agent normalization
          ↓
    canonical project
      ↙    ↓    ↘
 Outline  AV   Story Wall ...
      ↖    ↓    ↗
 direct lens edits
          ↓
    canonical project
```

The agent should understand the current lens when useful.

Examples:

- in Story Wall: “Why does the middle feel crowded?”
- in AV Script: “Reduce the number of visual changes in this Beat.”
- in Paper Edit: “Can we make this section less dependent on Maria?”
- in Coverage: “Show only the gaps that would block a rough cut.”

A lens can therefore become both a human perception surface and additional context for agent reasoning.

## Lens edits

Direct manipulation inside a lens remains a first-class capability.

The rule is:

> **Direct manipulation is justified when the user is intentionally manipulating what the lens represents.**

Examples:

- dragging cards while thinking spatially in Story Wall;
- moving a sourced excerpt while shaping a radio edit;
- editing Visual/Audio relationships while planning in AV Script;
- restructuring hierarchy while intentionally working in Outline.

The failure observed in 0B was not that these operations should never exist. It was treating them as the routine path for every ordinary creative intention.

## Narrative pulse

“Narrative pulse” is currently a product metaphor rather than a separate domain object.

It refers to the patterns that emerge when the canonical story is viewed through multiple dimensions, such as:

- progression;
- pacing;
- density;
- alternation;
- repetition;
- source/evidence distribution;
- audiovisual complexity;
- coverage completeness;
- balance between sections or voices;
- unresolved intent.

Salai should explore ways to make these patterns legible through lenses and derived indicators without prematurely inventing a universal narrative score.

Do not introduce a canonical `Pulse` object or opaque AI quality metric during Spike 0C without evidence.

## Design requirements

A useful Narrative Lens should satisfy most of the following:

1. It reveals a property of the story that is difficult to perceive in ordinary prose/chat.
2. It operates on the same canonical project rather than a duplicate document.
3. It makes stable identity and important relationships legible where useful.
4. It allows direct editing when that representation is the user's chosen way of thinking.
5. It does not require low-level domain mechanics unrelated to the creative question.
6. Agent changes appear in it automatically.
7. Direct changes made in it become context for subsequent agent reasoning.
8. Users can enter and leave it without export/import or conceptual state loss.

## 0C validation implications

Spike 0C should not ask only whether users can stay in the free-form authoring surface.

It should test both sides of the product hypothesis:

### Interaction compression

Can routine creative intent be expressed with materially less structural bookkeeping than 0B?

### Structural insight

Do users voluntarily open structured lenses because they reveal something useful about the narrative system?

Human tests should record:

- which lens the user chooses without prompting;
- what problem they are trying to understand by opening it;
- whether the lens reveals information they did not notice in free-form authoring;
- whether direct manipulation feels creatively meaningful or merely mechanical;
- whether the agent and lens complement each other;
- whether any exposed internal concept is useful enough to justify its cognitive cost.

A successful 0C result is not “users never touch the structured UI.”

A stronger result is:

> **Users can create with low friction, then deliberately move into structured lenses when they want to understand or reshape the narrative system from another angle.**

## Product framing

Salai should not become either extreme:

### Not a model-management application

The user should not have to manually maintain the Narrative IR to make ordinary creative changes.

### Not a blind chat interface

The narrative system should not disappear into an opaque agent conversation where the creator cannot inspect or directly shape structure.

The intended product loop is:

```text
express intent
     ↓
Salai structures it
     ↓
see the structure through useful lenses
     ↓
reshape directly or conversationally
     ↓
continue toward media / Resolve
```

The agent reduces interaction cost. The lenses preserve legibility, agency, and alternate ways of thinking.