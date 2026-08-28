# Narrative Lenses

## Status

Living canonical product/UX contract for Salai's structured creative views.

This document owns Narrative Lens definition, taxonomy, expose/hide rules, and direct-manipulation semantics. Other docs should link here rather than restating them.

## Core principle

> **Hide structural bookkeeping, not narrative structure.**

Salai should not require a filmmaker to manually serialize every ordinary intention into Sections, Scenes, Beats, Cues, parent references, source relationships, or low-level operations.

At the same time, canonical structure can carry real creative information. A creator may deliberately want to see and manipulate it.

The product therefore distinguishes:

- **structural bookkeeping** — mechanics Salai should normally infer/automate; and
- **structural perception** — structure worth exposing because it helps the creator understand or shape the story.

## Definition

A **Narrative Lens** is a structured representation of the same canonical Salai project that deliberately emphasizes one creative aspect of the narrative system.

A lens is not a second document, an expert settings screen, or a separate state model. It is a way to **see and modify the story from a particular creative angle**.

A lens may be implemented as a Projection, a Workspace, or a combination:

- **Projection** describes deterministic state ownership;
- **Workspace** describes persistent human organization outside canonical narrative semantics;
- **Narrative Lens** describes creative purpose.

## Lens taxonomy

### Existing / validated surfaces

| Lens | Primary creative perception |
| --- | --- |
| Outline | hierarchy, progression, proportion, structural weight |
| Story Wall | spatial rhythm, balance, turning points, alternatives, clustering |
| AV Script | audiovisual density, realization over time, visual/audio interplay |
| Paper / Radio Edit | evidentiary spine, voice, source pacing, authored-vs-sourced balance |

### Later candidates

| Lens | Primary creative perception |
| --- | --- |
| Coverage | gaps between intent and available realization; build after the production graph exists |
| Frame Wall / Selects | visual coverage, contrast, repetition, usable alternatives |
| Runtime / pacing view | temporal pressure and proportional weight if a dedicated view proves useful |

Do not create a new lens only because a derived value can be displayed. A lens needs a demonstrated creative job.

## What a lens should expose

Expose canonical or Workspace structure when it contributes to a creative decision.

Examples:

- one Beat has substantially more audiovisual moments than neighboring Beats;
- one section consumes disproportionate runtime;
- several consecutive story moments depend on the same interview voice;
- a Beat has no credible visual/source support;
- the middle of a Story Wall is spatially crowded;
- several source excerpts compete for the same narrative function;
- a simple narrative idea requires unexpectedly complex realization.

Stable identity and important relationships may be visible when they help the creator reason, but raw implementation identifiers usually do not.

## What a lens should hide

Normally keep these implicit:

- generating canonical IDs;
- constructing raw `ParentRef` values;
- calculating insertion indices;
- choosing an operation type for an obvious creative change;
- creating a Cue only because the schema requires one;
- manually wiring source relationships that can be inferred safely;
- switching views merely because an operation is unavailable elsewhere.

The distinction is not “simple vs advanced UI.” It is whether the exposed structure contributes to the creative question.

## Direct manipulation

Direct manipulation remains first-class when the user intentionally chooses the lens as the way they want to think.

Examples:

- drag cards while thinking spatially in Story Wall;
- move sourced excerpts while shaping spoken rhythm in Paper/Radio;
- adjust Visual/Audio realization while planning in AV Script;
- restructure hierarchy while intentionally working in Outline.

The 0B failure was not that these operations exist. It was making structured operation the compulsory route for ordinary creative intent.

## Agent relationship

The agent and lenses operate on the same canonical project.

```text
working input / instruction
          ↓
     normalization
          ↓
    canonical project
      ↙    ↓    ↘
      Narrative Lenses
      ↖    ↓    ↗
 direct lens edits
          ↓
    canonical project
```

Requirements:

- agent changes appear in a lens automatically because the lens reads canonical state;
- direct lens changes become visible to subsequent agent reasoning through the same state;
- active lens identity may be sent as context when it materially helps interpretation;
- arbitrary presentation state should not automatically become agent context;
- Workspace-only changes remain Workspace-only.

## Narrative pulse

“Narrative pulse” is a **discovery metaphor**, not a domain object or product score. It refers to patterns such as pacing, density, repetition, voice distribution, audiovisual complexity, coverage, and structural balance that may become easier to perceive through one or more lenses. Keep exploring the metaphor through human observation and simple derived information; do not create a canonical `Pulse` object or universal quality metric without evidence.

Discovery evidence for the metaphor belongs in [`research-notes.md`](research-notes.md).

## Design requirements

A useful Narrative Lens should satisfy most of these:

1. reveal a story property difficult to perceive in ordinary prose/conversation;
2. operate on the same canonical project rather than a duplicate document;
3. expose stable identity/relationships only where useful;
4. allow direct editing when the representation is intentionally chosen;
5. avoid incidental domain mechanics unrelated to the creative question;
6. reflect agent changes automatically;
7. feed direct changes back into subsequent agent context through shared state;
8. allow entry/exit without export/import or conceptual state loss.

## 0C validation

0C does not need to redesign every lens or create new ones.

It needs to prove:

- the four existing surfaces remain synchronized after agent-mediated changes;
- at least one is opened voluntarily because it reveals something useful;
- one direct edit in an existing lens feels creatively meaningful;
- that edit is visible to a subsequent agent request through shared state.

Coverage reasoning may be mocked conversationally during 0C, but the actual Coverage Lens is deferred until the production graph exists.

A successful 0C result is not “users never touch structured UI.”

It is:

> **Users can create with low friction, then deliberately enter structured lenses when they want to understand or reshape the narrative system from another angle.**