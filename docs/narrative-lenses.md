# Narrative Lenses

## Status

Living canonical contract for the **Narrative Lens** concept and the structured-view semantics validated in 0B/0C.

The existing Outline, Story Wall, AV Script, and Paper/Radio surfaces remain valid examples of coherent views over one project. After ADR 0009, they are **not** assumed to be the final top-level application navigation. Spike 0D tests a temporal semantic surface separately.

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

The Lens concept does not require every major creative surface to be implemented as a tab/page. A later surface may combine temporal, spatial, or document-like interaction while still exposing lens-like emphasis.

## Validated surfaces

| Lens | Primary creative perception |
| --- | --- |
| Outline | hierarchy, progression, proportion, structural weight |
| Story Wall | spatial rhythm, balance, turning points, alternatives, clustering |
| AV Script | audiovisual density, realization over time, visual/audio interplay |
| Paper / Radio Edit | evidentiary spine, voice, source pacing, authored-vs-sourced balance |

These four surfaces were validated as coherent projections/workspaces over one canonical project. They are historical/product evidence, not a commitment that Salai's future shell must present four permanent lens tabs.

## Later semantic emphases

Potential creative dimensions include:

| Emphasis | Creative perception |
| --- | --- |
| Coverage | gaps between intent and available realization |
| Frame Wall / Selects | visual coverage, contrast, repetition, usable alternatives |
| Runtime / pacing | temporal pressure and proportional weight |
| Sources | where evidence comes from and how concentrated/reused it is |
| Continuity | consistency of people/places/props/style across realizations when required |
| Alternatives | competing realizations or narrative choices |

Do not create a new permanent lens only because a derived value can be displayed. A representation needs a demonstrated creative job.

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

Direct manipulation remains first-class when the user intentionally chooses the representation as the way they want to think.

Examples:

- drag cards while thinking spatially in Story Wall;
- move sourced excerpts while shaping spoken rhythm in Paper/Radio;
- adjust Visual/Audio realization while planning in AV Script;
- restructure hierarchy while intentionally working in Outline;
- in 0D, move a Beat/Cue or trim a SourceExcerpt on the semantic timeline when timing itself is the creative question.

The 0B failure was not that these operations exist. It was making structured operation the compulsory route for ordinary creative intent.

## Agent relationship

The agent and human projections operate on the same canonical project.

```text
working input / instruction
          ↓
     normalization
          ↓
    canonical project
      ↙    ↓    ↘
  human semantic surfaces
      ↖    ↓    ↗
 direct human edits
          ↓
    canonical project
```

Requirements:

- agent changes appear automatically because surfaces read canonical state;
- direct changes become visible to subsequent agent reasoning through the same state;
- active representation/focus may be sent as context when it materially helps interpretation;
- arbitrary presentation state should not automatically become agent context;
- Workspace-only changes remain Workspace-only;
- third-party timeline/rendering state is never a second synchronization model.

Spike 0C human validation using Codex confirmed the external-agent side of this relationship.

## Narrative pulse

“Narrative pulse” is a **discovery metaphor**, not a domain object or product score. It refers to patterns such as pacing, density, repetition, voice distribution, audiovisual complexity, coverage, and structural balance that may become easier to perceive through one or more representations.

Keep exploring the metaphor through human observation and simple derived information; do not create a canonical `Pulse` object or universal quality metric without evidence.

Discovery evidence belongs in [`research-notes.md`](research-notes.md).

## Design requirements

A useful lens/semantic emphasis should satisfy most of these:

1. reveal a story property difficult to perceive in ordinary prose/conversation;
2. operate on the same canonical project rather than a duplicate document;
3. expose stable identity/relationships only where useful;
4. allow direct editing when the representation is intentionally chosen;
5. avoid incidental domain mechanics unrelated to the creative question;
6. reflect agent changes automatically;
7. feed direct changes back into subsequent agent context through shared state;
8. allow entry/exit without export/import or conceptual state loss.

## Relationship to Spike 0D

0D does not need to redesign the existing four lenses.

It tests whether **time/playback** becomes a foundational semantic surface:

- Section/Beat/Cue structure projected into actual duration;
- source/media realization visible beneath narrative meaning;
- direct temporal edits resolving through canonical operations;
- playback used to judge pacing and realization;
- agent and direct temporal work sharing one project.

The result of 0D will determine whether future Coverage, Sources, Alternatives, and related dimensions are best expressed as dedicated lenses, temporal overlays/probes, or a combination. That decision belongs in the 0D assessment/next iteration, not in this contract in advance.
