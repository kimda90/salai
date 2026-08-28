# Spike 0B — Authoring UX Technical Design

## Status

**Historical implementation contract. Spike 0B is closed.**

The implementation validated the shared Narrative IR / Workspace / projection architecture, but the first human UX test found that direct manipulation of these structured surfaces requires too much interaction to be the primary creative workflow.

This document is retained as the contract that 0B tested. Do not reinterpret it as the current product direction.

Current next-step contract: [`agent-mediated-authoring.md`](agent-mediated-authoring.md).

Assessment: [`spike-0b-assessment.md`](spike-0b-assessment.md).

Product workflow behavior remains authoritative in [`workflows.md`](workflows.md); Narrative IR semantics and operation vocabulary remain authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md).

## Validation question

Can Story Wall, Outline, AV Script, and Paper/Radio Edit feel like familiar creative workflows while manipulating the same canonical Narrative IR without duplicating story state or leaking workspace layout into narrative semantics?

## Scope

Spike 0B implemented the smallest React prototype able to exercise the validated `@salai/script-model` package through four working surfaces:

1. Story Wall;
2. Outline;
3. AV Script;
4. Paper/Radio Edit.

It also defined the minimum in-memory Workspace model required by those surfaces.

## Non-goals

Spike 0B did not require:

- Electron packaging;
- Python/FastAPI;
- SQLite or durable persistence;
- Resolve integration;
- OpenAssetIO or OpenTimelineIO integration;
- real transcription/media analysis;
- real LLM calls;
- GenAI execution;
- collaboration/sync;
- a generic infinite canvas;
- a graph editor;
- a rich-text document model.

Mocks were allowed only where they directly helped answer the 0B workflow question.

# Dependency baseline

0B used commodity UI infrastructure for interaction mechanics while keeping Salai semantics in Salai-owned code.

The final retained implementation was intentionally smaller than the original candidate dependency list: React/TypeScript/Vite, Pragmatic Drag and Drop, Vitest, and the deployed GitHub Pages prototype. Storybook and Chromium/browser-test infrastructure were not retained.

The semantic boundary remained:

> Libraries provide interaction/rendering mechanics. Salai decides what a gesture means and which domain operation, if any, it produces.

# State ownership

## Canonical narrative state

The existing `@salai/script-model` project is the only canonical narrative state.

UI components must not create shadow copies of Sections, Scenes, Beats, Cues, ContentBlocks, SourceExcerpts, or relationships that can drift from the model.

All semantic narrative edits must go through the public Narrative IR operation API.

## Workspace state

0B introduced the minimum in-memory Workspace layer. After implementation cleanup, the validated Story Wall workspace retained only the fields actually required by the prototype:

```text
Workspace
- id
- name
- kind
- board

Board
- items

BoardItem
- id
- reference?       -> canonical Scene / Beat
- ideaCard?        -> workspace-only idea
- x?
- y?
- parkingState?

IdeaCard
- id
- text
```

The result remains useful for later spatial views, but Workspace state is no longer assumed to define the primary authoring flow.

## UI-local state

Ephemeral state such as selection, hover, open menus, draft input, drag previews, and temporary filters remains component/application state and is not part of either Narrative IR or Workspace semantics.

# Interaction architecture tested in 0B

User gestures were interpreted before state changes occurred:

```text
Gesture
   ↓
intent interpretation
   │
   ├── Workspace change
   │       ↓
   │   layout/organization only
   │
   └── Narrative operation
           ↓
     @salai/script-model
           ↓
     result / warnings / effects
```

Examples:

```text
Move Beat card freely on a board
→ update BoardItem position only

Move Beat card in an explicitly ordered structural lane
→ moveBeat Narrative operation

Move card to parking lot
→ workspace organization unless the user explicitly removes it from active narrative structure

Promote IdeaCard to Beat
→ createBeat + replace/link BoardItem reference
```

This boundary was technically successful. The human finding was that requiring users to choose and execute these mechanics repeatedly creates too much creative friction.

# Shared application behavior

All four surfaces:

- render from the same current Narrative IR instance;
- identify canonical objects by stable ID;
- dispatch semantic edits through one shared operation boundary;
- surface operation errors rather than silently compensating with UI-only state;
- distinguish authored content from source-backed content;
- update when another surface changes the underlying model;
- avoid export/import or duplicated per-surface documents.

A thin application controller/store coordinates Narrative IR, Workspace state, selection, and operation dispatch without redefining domain semantics.

# Surface contracts tested

## Outline

Purpose: compact hierarchical structural authoring.

Implemented:

- Sections;
- optional Scenes;
- direct Beats and Scene-contained Beats in the same Section;
- inline title/summary editing;
- structural reorder/move through Narrative operations;
- approximate runtime display;
- shared selection/navigation.

The structure works semantically. The new direction does not assume users should manage this hierarchy routinely.

## Story Wall

Purpose: spatial story construction with recoverable alternatives.

Implemented:

- Beat and Scene cards;
- free spatial positioning;
- loose IdeaCards;
- parking-lot/alternate material;
- IdeaCard promotion;
- explicit structural narrative reorder separate from free x/y position.

The Workspace-vs-Narrative boundary remains valid. Story Wall becomes an optional spatial/precision view under the new hypothesis.

## AV Script

Purpose: visual/audio planning over Beat/Cue structure.

Implemented:

- Beat grouping;
- multiple Cues per Beat;
- Visual and Audio presentation side by side;
- authored and source-backed content;
- approximate runtime feedback;
- structural/edit operations through the Narrative IR.

Cue remains useful as domain identity. Whether users need to see the term is deferred until agent-mediated authoring shows when explicit AV precision is required.

## Paper / Radio Edit

Purpose: source-evidence-driven story construction.

Implemented:

- SourceExcerpt presentation with source identity/range visible;
- authored VO/bridge material distinct from recorded speech;
- ordering and attaching source-backed material to narrative structure;
- audio-first sequencing;
- a path to visual Cue information without a separate canonical document.

The source semantics remain a strong foundation for future agent-mediated footage-first authoring.

# Cross-surface result

The representative project was exercised through all four surfaces with one canonical project.

Validated:

- Beat/Cue/source IDs remain stable;
- semantic edits propagate;
- Workspace position survives unrelated narrative changes;
- Workspace changes do not alter Narrative IR unless explicitly intended;
- SourceExcerpt remains source-backed;
- parking and deletion remain distinct;
- runtime feedback is derived from canonical state;
- all three fixtures use the same controller/model boundary.

# Testing strategy result

0B retained fast deterministic tests around semantic boundaries rather than browser automation.

High-value assertions include:

- Workspace movement does not change Narrative IR;
- structural moves produce canonical changes;
- IdeaCard promotion creates identity once;
- edits propagate through shared state;
- SourceExcerpt content remains source evidence;
- controller errors/relationship consequences reach the application boundary.

# Exit result

0B did **not** pass the original product UX exit criterion that the structured surfaces themselves become comfortable primary authoring workflows.

It did pass the architectural parts:

1. one canonical story works across all four surfaces;
2. Workspace organization remains separate from narrative semantics;
3. stable identity survives cross-surface editing;
4. authored and sourced content can remain unambiguous semantically;
5. no workflow-specific semantic workaround was required to compensate for a failure in the Narrative IR.

The human test added the decisive failure:

> Common creative changes require too many explicit interactions and too much model management.

## Superseded assumption

0B assumed that hiding database/graph concepts behind familiar structured workflows would be enough to make the product creatively natural.

The evidence suggests a stronger requirement:

> **The user should not have to operate the structure at all for common creative intentions. Salai should infer and normalize it.**

Story Wall, Outline, AV Script, and Paper/Radio remain valuable representations, but become secondary/specialized views under the 0C hypothesis.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md).
