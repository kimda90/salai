# Spike 0B — Human Workflow Test Plan

## Status

**Closed after the first UX test exposed a higher-order workflow failure.**

This document remains as the test procedure that produced the decisive 0B human finding. Further sessions focused on polishing the same direct-manipulation workflow are paused while Salai tests the new agent-mediated authoring direction.

The observed result was:

> **It needs too much user interaction to be creatively useful.**

See [`spike-0b-assessment.md`](spike-0b-assessment.md) for the interpretation and [`agent-mediated-authoring.md`](agent-mediated-authoring.md) for the next validation contract.

## Why the test stopped here

The original plan attempted to resolve several local questions:

- Story Wall spatial vs structural interaction;
- mixed Scene/direct-Beat hierarchy;
- visible `Cue` terminology;
- Paper/Radio workflow fit;
- shared selection expectations.

The first human test produced a more fundamental finding that cuts across all of them: **the prototype asks the user to operate Salai's structure too often.**

Continuing to optimize individual controls before testing a lower-friction authoring model would risk polishing the wrong primary workflow.

The unresolved local questions are therefore deferred until the product knows when users actually choose to enter each specialized view.

## Original purpose

Validate whether the four Salai authoring surfaces are recognizable, understandable, and useful as different ways of working with one story.

This was not intended as a usability-polish test or feature-request session. It pressure-tested the product model before moving beyond Spike 0B.

## Original setup

Use the deployed Spike 0B web build and its deterministic fixtures.

Ask participants to think aloud. Do not explain the Narrative IR, Workspace model, or intended interaction answers before they attempt the tasks.

Capture:

- what they expected before each action;
- what they actually did;
- where they hesitated;
- terminology they used naturally;
- moments where they believed data/story intent had been lost;
- workarounds they invented;
- how many interactions were required to express a creative intention.

## Original session structure

### 1. Orientation — one story or four tools?

Open the product fixture in Outline.

Ask the participant to:

1. describe what they think they are looking at;
2. switch through Story Wall, AV Script, and Paper / Radio Edit;
3. explain what they believe changes and what remains the same between views.

Observe whether the surfaces feel related and whether switching feels like navigation or opening another document.

### 2. Story Wall — spatial vs structural intent

Ask the participant to:

1. move a Beat card somewhere useful spatially;
2. change story order;
3. park an idea;
4. bring it back.

Observe whether free placement vs narrative order is predictable and whether parking feels distinct from deletion.

### 3. Outline — hierarchy pressure test

Use or create a Section containing both a Scene and a direct Beat.

Ask the participant to:

1. explain the hierarchy;
2. move a Beat into a Scene;
3. move it back;
4. create a new Beat where they think it belongs.

Observe whether hierarchy supports the work or forces the user to reason about the model.

### 4. AV Script — Cue terminology and audiovisual planning

Open a Beat with multiple Cues.

Ask the participant to:

1. plan several audiovisual moments;
2. edit visual intent;
3. edit authored audio;
4. move a Cue;
5. explain what `Cue` means to them.

Observe whether Beat/Cue helps or becomes implementation vocabulary the user must manage.

### 5. Paper / Radio Edit — source evidence vs authored material

Switch to the interview fixture.

Ask the participant to:

1. identify sourced vs authored text;
2. try to change a sourced quote;
3. edit authored material;
4. rearrange source-backed material;
5. inspect/add visual intent.

Observe whether source identity is clear and whether arranging evidence requires too much explicit structural wiring.

### 6. Return loop — continuity check

Return to Story Wall and Outline.

Ask what the participant expects to have changed and what should remain stable.

Observe trust in cross-surface propagation.

## The finding that superseded the local rubrics

The important outcome was not simply that one gesture or term was confusing. The overall workflow imposed too much interaction overhead.

A representative pattern was:

```text
creative intention
     ↓
choose view
     ↓
choose/create structural object
     ↓
choose parent/target
     ↓
perform edit
     ↓
repeat for supporting structure
```

This creates a context switch from creative thinking into model management.

The new hypothesis is that the user should state the intended result and Salai should perform this normalization internally through typed operations.

## Evidence retained from the original plan

The following questions remain useful later, but no longer block moving into 0C:

### Story Wall spatial vs structural

Revisit when users choose Story Wall voluntarily as a spatial inspection/precision view. Do not assume Story Wall must solve ordinary narrative reordering for the primary flow.

### Mixed hierarchy

Revisit when the agent-mediated workflow reveals when users actually need to inspect or edit Scene/direct-Beat structure explicitly.

### `Cue` terminology

Keep `Cue` as implementation/domain identity. Decide user-facing labels only in views where exposing the concept demonstrably helps.

### Paper Edit domain state

Continue to avoid a paper-specific canonical model unless agent-mediated source-first testing demonstrates a real missing semantic concept.

### Narrative IR

The first human test did not expose a semantic representation failure. It exposed an interaction-model failure. Continue to change the IR only when desired meaning cannot be represented safely.

## Next human validation

The next human session should test [`agent-mediated-authoring.md`](agent-mediated-authoring.md), not repeat this workflow unchanged.

Measure:

- how many explicit interactions are needed for the same creative task;
- whether the user can stay primarily in free-form text/conversation;
- whether media can be supplied without manual wiring;
- whether Salai's assumptions are understandable without approval spam;
- whether grouped undo/revert creates enough trust;
- whether structured views are opened because they help rather than because they are required.

The key comparison is the same creative goal under 0B direct manipulation vs 0C agent-mediated normalization.
