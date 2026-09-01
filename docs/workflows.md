# Salai Creative Workflows

## Status

Living workflow behavior. Narrative semantics live in [`narrative-ir-spec.md`](narrative-ir-spec.md); validated external-agent behavior lives in [`agent-mediated-authoring.md`](agent-mediated-authoring.md); current structural-editorial validation is tracked in [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).

## Core interaction rule

> **Hide structural bookkeeping, not narrative structure.**

Creators can express ordinary intent through an external agent harness without manually managing IDs, parent references, operation types, or object wiring. They can also work directly when a representation contributes to the creative decision.

Spike 0D adds a second core rule:

> **The story must be playable inside Salai without giving timeline-engine state ownership of the project.**

## Default loop

```text
creator expresses intent or edits directly
        ↓
Salai canonical project
        ↓
semantic timeline / other useful representation
        ↓
play and judge the result
        ↓
reshape directly or through external harness
        ↓
canonical project
```

No export/import or chat-history synchronization is required between agent and UI work.

## Script-first

```text
rough idea / prose
      ↓
external harness or direct Salai input
      ↓
usable canonical structure
      ↓
semantic timeline projection
      ↓
playable rough assembly as media becomes available
```

The creator should not manually create/parent every Beat/Cue for routine story changes. Existing IDs remain stable when meaning is unchanged.

## Footage/source-first

```text
source context / media / transcript
      ↓
external harness or direct source selection
      ↓
canonical narrative + source evidence
      ↓
semantic timeline
      ↓
play / reorder / trim while preserving source identity
```

Recorded wording/ranges remain source evidence; authored bridges remain authored.

## Agent ↔ temporal UI

Agent changes are visible on the semantic timeline because both use the same project service/canonical state.

A direct temporal edit changes Salai state through canonical operations. The next machine `context` read sees that current state; the harness does not require a separate synchronization record.

Examples:

- ask the harness to move a payoff earlier, then play the new timing;
- trim a SourceExcerpt directly on the semantic timeline, then ask the harness to tighten authored material around it;
- move a Cue while planning audiovisual rhythm, then continue through the harness;
- ask the harness to identify unsupported material, then inspect the explicit missing moment in the timeline.

## Semantic timeline workflow

The 0D timeline is a projection of Salai meaning into time, not a generic clip document.

At broad scale it should expose narrative regions such as Sections/Beats. At closer scale it exposes Cues and available source/media realization.

Direct temporal gestures are interpreted before state changes occur:

```text
Timeline gesture
      ↓
Salai intent interpretation
      │
      ├── canonical narrative/source operation
      │       ↓
      │   Narrative IR
      │
      └── UI/view-only change
              ↓
          viewport/focus only
```

Examples:

```text
Move Beat temporal region
→ moveBeat canonical operation

Move Cue temporal region
→ moveCue canonical operation

Trim SourceExcerpt edge
→ trimSourceExcerpt canonical operation

Zoom timeline
→ UI state only

Seek playhead
→ viewer/UI state only
```

Engine-specific interactions that cannot be represented safely in Salai semantics must not silently create divergent renderer state.

## Playback/review

The creator can play the rough audiovisual assembly in Salai and use playback as a story-development loop:

```text
construct
   ↓
play
   ↓
notice pacing / evidence / realization problem
   ↓
change canonical story/source structure
   ↓
play again
```

0D only requires enough picture/audio assembly to validate this loop. Specialist finishing remains downstream.

## Workspace vs narrative change

Story Wall x/y position and parking are Workspace semantics, not canonical narrative order. Spatial movement must not silently reorder the story. Explicit narrative reorder remains a canonical operation.

The same principle applies to future spatial Story Spine work: physical proximity is not automatically semantic relation.

## Existing structured views

0B/0C validated:

- Outline;
- Story Wall;
- AV Script;
- Paper / Radio Edit.

These remain valid ways of perceiving/manipulating one canonical project, but the product no longer assumes they are the final top-level navigation model.

0D tests the temporal surface first. A future Story Spine/Arrange experiment follows only if the semantic temporal spine proves useful.

## Downstream finishing

```text
creative + structural editorial work in Salai
        ↓
canonical state / structural assembly
        ↓
explicit materialization/interchange decision
        ↓
optional specialist NLE
```

Neither harness instructions nor direct temporal UI bypass canonical Salai state to mutate a downstream NLE directly.

## Current 0D workflow proof

1. canonical fixture → semantic timeline;
2. timeline → playable rough assembly without Resolve;
3. play → identify one pacing/realization issue;
4. direct temporal edit → canonical operation → replay;
5. external-harness change → canonical state → replay;
6. direct temporal edit → next harness context sees the result.
