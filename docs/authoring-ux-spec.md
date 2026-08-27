# Spike 0B — Authoring UX Technical Design

## Status

Implementation contract for Spike 0B.

This document owns the implementation-level contract for the familiar authoring UX spike. Product workflow behavior remains authoritative in [`workflows.md`](workflows.md); Narrative IR semantics and operation vocabulary remain authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md).

## Validation question

Can Story Wall, Outline, AV Script, and Paper/Radio Edit feel like familiar creative workflows while manipulating the same canonical Narrative IR without duplicating story state or leaking workspace layout into narrative semantics?

## Scope

Spike 0B must implement the smallest React prototype that can exercise the validated `@salai/script-model` package through four working surfaces:

1. Story Wall;
2. Outline;
3. AV Script;
4. Paper/Radio Edit.

It must also define the minimum in-memory Workspace model required by those surfaces.

## Non-goals

Spike 0B does not require:

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

Mocks are allowed only where they directly help answer the 0B workflow question.

# Dependency baseline

Use commodity UI infrastructure for interaction mechanics while keeping Salai semantics in Salai-owned code.

```text
React + TypeScript + Vite
├── shadcn/ui + Base UI        reusable UI primitives
├── Pragmatic Drag and Drop    reorder/spatial drag mechanics
├── TanStack Table             AV Script / tabular surfaces
├── TanStack Virtual           only when large lists require it
├── Storybook                  isolated workflow/fixture development
└── Vitest Browser Mode        component/interaction validation
```

Do not make the following 0B dependencies unless implementation evidence creates a concrete need:

- tldraw;
- React Flow;
- Tiptap/ProseMirror/Lexical;
- an agent framework.

The dependency boundary is:

> Libraries provide interaction/rendering mechanics. Salai decides what a gesture means and which domain operation, if any, it produces.

# State ownership

## Canonical narrative state

The existing `@salai/script-model` project is the only canonical narrative state.

UI components must not create shadow copies of Sections, Scenes, Beats, Cues, ContentBlocks, SourceExcerpts, or relationships that can drift from the model.

All semantic narrative edits must go through the public Narrative IR operation API.

## Workspace state

Spike 0B introduces the minimum in-memory workspace layer:

```text
Workspace
- id
- name
- kind
- settings?
- board

Board
- items

BoardItem
- id
- reference?       -> canonical object ID/type
- ideaCard?        -> workspace-only idea
- x?
- y?
- width?
- height?
- color?
- rotation?
- label?
- note?
- lane?
- parkingState?

IdeaCard
- id
- text
- kind?
```

Exact fields may be reduced or refined during the spike. A field belongs here only if UX evidence shows it represents persistent human organization rather than narrative meaning.

## UI-local state

Ephemeral state such as selection, hover, open menus, draft input, drag previews, and temporary filters remains component/application state and is not part of either Narrative IR or Workspace semantics.

# Interaction architecture

User gestures must be interpreted before state changes occur.

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

The UI must make destructive semantic changes distinguishable from non-destructive spatial organization.

# Shared application behavior

All four surfaces must:

- render from the same current Narrative IR instance;
- identify canonical objects by stable ID;
- dispatch semantic edits through one shared operation boundary;
- surface operation errors/warnings rather than silently compensating with UI-only state;
- distinguish authored content from source-backed content;
- update when another surface changes the underlying model;
- avoid export/import or duplicated per-surface documents.

A thin application controller/store may coordinate the current Narrative IR, Workspace state, selection, and operation dispatch. It must not redefine domain semantics.

# Surface contracts

## Outline

Purpose: compact hierarchical structural authoring.

Must support:

- Sections;
- optional Scenes;
- direct Beats and Scene-contained Beats in the same Section;
- inline title/summary editing where supported by the IR;
- structural reorder/move through Narrative operations;
- approximate runtime display;
- selection/navigation shared with other surfaces.

Pressure-test whether mixed direct Beats and Scenes are understandable in actual UI.

## Story Wall

Purpose: spatial story construction with recoverable alternatives.

Must support:

- Beat and Scene cards;
- free spatial positioning;
- loose IdeaCards;
- visible parking-lot/alternate material;
- promotion of IdeaCards into canonical narrative objects;
- an explicit mode/gesture for structural narrative reorder when spatial position alone is insufficient.

Card color, position, rotation, and size are Workspace metadata unless user research proves otherwise.

A generic node/edge graph is not required.

## AV Script

Purpose: visual/audio planning over Beat/Cue structure.

Must support:

- Beat grouping;
- multiple Cues per Beat;
- Visual and Audio presentation side by side;
- authored speech and other content without flattening Cue identity;
- approximate runtime feedback;
- structural/edit operations through the Narrative IR.

Use a headless table/grid implementation where useful, but do not make table row state canonical.

## Paper / Radio Edit

Purpose: source-evidence-driven story construction.

Must support:

- SourceExcerpt presentation with source identity/range visible;
- authored VO/bridge material clearly distinguished from recorded speech;
- ordering and attaching source-backed material to narrative structure;
- audio-first sequencing for Radio Edit;
- a path toward exposing visual Cue information without creating a separate document.

Recorded SourceExcerpt wording is evidence, not freely editable authored prose.

# Cross-surface fixture test

At least one representative project must be exercised through all four surfaces in one session:

```text
Story Wall
   ↓
Outline
   ↓
AV Script
   ↓
Paper / Radio Edit
   ↓
Story Wall
```

Verify that:

- Beat/Cue/source IDs remain stable;
- semantic edits appear in every surface;
- Workspace position/grouping survives surface changes in memory;
- Workspace changes do not alter Narrative IR unless explicitly intended;
- SourceExcerpt remains source-backed;
- authored and sourced content remain visually distinguishable;
- parking/removal/deletion are not conflated;
- runtime feedback remains consistent;
- mixed Scene/direct-Beat hierarchy remains usable.

# Testing strategy

Use the existing three Narrative IR fixtures as the primary deterministic UI fixtures.

Use Storybook for isolated surface states and interaction cases. Use Vitest Browser Mode for important cross-component and drag/operation behavior. Keep pure model tests in `packages/script-model` unchanged.

The spike should add tests around semantic boundaries rather than pixel-perfect appearance.

High-value tests include:

- a drag interpreted as Workspace-only does not change Narrative IR;
- a structural drag emits the expected Narrative operation;
- promoting an IdeaCard creates canonical identity once;
- editing in Outline updates AV Script/Story Wall representations;
- SourceExcerpt content cannot accidentally become authored mutable text;
- operation warnings/errors reach the UI boundary.

# Exit criteria

Spike 0B passes when:

1. users can recognize Story Wall, Outline, AV Script, and Paper/Radio Edit without learning the underlying graph/data model;
2. the same canonical story can be manipulated through all four surfaces without export/import or duplicate documents;
3. Workspace organization remains separate from narrative semantics;
4. stable identity survives cross-surface editing;
5. authored and sourced content remain unambiguous;
6. common drag/restructure actions map predictably to either Workspace changes or Narrative operations;
7. no workflow-specific semantic workaround is required to compensate for a failure in the Narrative IR.

If 0B exposes a genuine semantic failure, revise the Narrative IR based on that evidence rather than hiding the failure in UI-only state.

# Open questions to resolve during 0B

- Is the mixed Scene/direct-Beat hierarchy understandable enough to keep?
- Which surfaces should expose the term `Cue` directly to users?
- What is the minimum Workspace field set that users actually need?
- Which Story Wall gestures best distinguish spatial organization from narrative reorder?
- Does Paper Edit require any state beyond Workspace references to existing narrative/source objects?
- What selection/navigation behavior should be shared across surfaces?
- What undo boundary is required for the prototype: domain operation undo, workspace undo, or a coordinated command history?
