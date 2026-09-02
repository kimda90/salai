# Narrative Lenses

## Status

Living canonical contract for the **Narrative Lens** concept and the structured-view semantics validated in 0B/0C.

Outline, Story Wall, AV Script, and Paper/Radio remain valid examples of coherent views over one project. They are **not** assumed to be the final top-level application navigation.

Spike 0D established that time/playback can be a Salai-owned semantic surface but did not validate its first direct-edit UI. Spike 0E tests a deeper hierarchical temporal surface. Proposed direct temporal behavior lives in [`editorial-interaction.md`](editorial-interaction.md), not in this document.

## Core principle

> **Hide structural bookkeeping, not narrative structure.**

Salai should not require a filmmaker to manually serialize every ordinary intention into Sections, Scenes, Beats, Cues, parent references, source relationships, or low-level operations.

At the same time, canonical structure can carry real creative information. A creator may deliberately want to see and manipulate it.

The product therefore distinguishes:

- **structural bookkeeping** — mechanics Salai should normally infer/automate; and
- **structural perception** — structure worth exposing because it helps the creator understand or shape the story.

## Definition

A **Narrative Lens** is a structured representation or emphasis over the same canonical Salai project that deliberately makes one creative aspect perceptually dominant.

A lens is not a second document, a separate canonical state model, or necessarily a permanent tab/page.

A lens may be implemented as:

- a Projection;
- a Workspace;
- an overlay/emphasis inside a broader creative surface;
- a combination of the above.

Projection/Workspace describe state ownership. Narrative Lens describes creative purpose.

## Validated surfaces

| Lens | Primary creative perception |
| --- | --- |
| Outline | hierarchy, progression, proportion, structural weight |
| Story Wall | spatial rhythm, balance, turning points, alternatives, clustering |
| AV Script | audiovisual density, realization, visual/audio interplay |
| Paper / Radio Edit | evidentiary spine, voice, source pacing, authored-vs-sourced balance |

These were validated as coherent views/workspaces over one project. They are product evidence, not shell/navigation requirements.

## Foundational temporal surface vs lens

0D/0E sharpen the distinction between a **foundational creative surface** and a **lens**.

The temporal editor may become foundational because audiovisual stories must be experienced in duration and sequence. A lens can then emphasize one dimension inside that same temporal context rather than replacing the editor.

Examples of possible temporal emphases:

- coverage/missing realization;
- pacing/runtime proportion;
- source/evidence concentration;
- character/voice distribution;
- continuity warnings;
- alternatives;
- provenance.

This does not require permanent lanes for every dimension.

The 0E hierarchical timeline specifically tests whether narrative hierarchy itself should remain visible as persistent temporal structure rather than as a separate Story/Moments/Media lens switch.

## Later semantic emphases

| Emphasis | Creative perception |
| --- | --- |
| Coverage | gaps between intent and available realization |
| Frame Wall / Selects | visual coverage, contrast, repetition, usable alternatives |
| Runtime / pacing | temporal pressure and proportional weight |
| Sources | where evidence comes from and how concentrated/reused it is |
| Continuity | consistency of people/places/props/style across realizations when required |
| Alternatives | competing realizations or narrative choices |

Do not create a permanent lens merely because a derived value can be displayed. A representation needs a demonstrated creative job.

## What a lens should expose

Expose canonical or Workspace structure when it contributes to a creative decision.

Examples:

- one Beat has substantially more audiovisual moments than neighboring Beats;
- one Section consumes disproportionate runtime;
- several consecutive moments depend on the same interview voice;
- a Beat has no credible visual/source support;
- the middle of a Story Wall is spatially crowded;
- several source excerpts compete for the same narrative function;
- a simple narrative idea requires unexpectedly complex realization.

Stable identity and important relationships may be visible when they help the creator reason, but raw IDs usually do not.

## What a lens should hide

Normally keep these implicit:

- generating canonical IDs;
- constructing raw parent references;
- calculating insertion indexes;
- choosing an operation type for an obvious creative change;
- manually creating structure only because the schema requires it;
- wiring source relationships that can be inferred safely;
- switching views merely because an operation is unavailable elsewhere.

The distinction is not simple vs advanced UI. It is whether exposed structure contributes to the creative question.

## Direct manipulation

Direct manipulation remains first-class when the representation itself is useful.

Examples:

- drag cards while thinking spatially in Story Wall;
- move sourced excerpts while shaping spoken rhythm in Paper/Radio;
- adjust Visual/Audio realization while planning in AV Script;
- restructure hierarchy while intentionally working in Outline;
- expand/select/reorder semantic objects in the 0E temporal hierarchy when time and containment are the creative question.

The 0B failure was not that direct operations exist. It was making specialized structural mechanics the compulsory route for ordinary creative intent.

0D added another failure mode: changing semantic-level views for mechanical access can fragment context. 0E therefore tries to expose nested temporal structure continuously rather than making semantic depth a page/tab switch.

## Agent relationship

The agent and human surfaces operate on the same canonical project.

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
- active representation/focus may be supplied as task context when materially useful;
- arbitrary presentation state should not automatically become agent context;
- Workspace-only changes remain Workspace-only;
- third-party timeline/rendering state is never a second synchronization model.

Spike 0C and the 0D temporal round trip validated this external-agent boundary.

## Narrative pulse

“Narrative pulse” remains a **discovery metaphor**, not a domain object or product score. It refers to patterns such as pacing, density, repetition, voice distribution, audiovisual complexity, coverage, and structural balance that may become easier to perceive through one or more representations.

Keep exploring through human observation and simple derived information; do not create a canonical `Pulse` object or universal quality metric without evidence.

## Design requirements

A useful lens/semantic emphasis should satisfy most of these:

1. reveal a story property difficult to perceive in ordinary prose/conversation;
2. operate on the same canonical project rather than a duplicate document;
3. expose stable identity/relationships only where useful;
4. allow direct editing when the representation is intentionally chosen;
5. avoid incidental domain mechanics unrelated to the creative question;
6. reflect agent changes automatically;
7. feed direct changes back into subsequent agent context through shared state;
8. allow entry/exit without export/import or conceptual state loss;
9. avoid destroying broader temporal/spatial context merely to reveal deeper detail.

## Relationship to Spike 0E

0E does not redesign the validated four lenses.

It tests whether a context-preserving temporal hierarchy can become the primary structural-editorial surface while lens-like emphases remain available within or around it.

The 0E result should determine whether future Coverage, Sources, Pacing, Alternatives, and related dimensions are best expressed as:

- overlays/probes inside the temporal surface;
- dedicated lenses/workspaces;
- or a combination.

Do not settle those later representations in advance of 0E human evidence.
