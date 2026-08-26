# RFC 0001 — One Narrative IR, Multiple Familiar Workflows

## Status

Proposed. Under review in the current structured-scripting spike.

## Summary

Salai should maintain one canonical semantic narrative representation and expose it through multiple familiar creative working surfaces rather than storing independent script, paper-edit, board, and outline documents that drift apart.

The working model separates:

- **Narrative IR** — canonical semantic data;
- **Projections** — deterministic views such as Outline and AV Script;
- **Workspaces** — persistent human organization such as Story Wall, Beat Board, Paper Edit, and Radio Edit.

## Motivation

Editors and videographers use several established methods to construct story depending on the material and production stage:

- index cards / sticky-note scene walls;
- outlines;
- AV scripts;
- paper edits;
- radio edits;
- shot/coverage planning;
- selects/frame walls.

A product that forces one new universal editor risks being technically elegant but creatively alien.

Conversely, treating each workflow as an independent document recreates the core problem Salai is intended to solve: narrative intent and production material drifting apart.

## Proposal

### Canonical narrative model

The initial Narrative IR uses:

```text
Script
  Section
    Scene? / Beat
      Beat
        Cue
          Visual / Audio ContentBlocks
```

A Beat represents the smallest intentional unit of narrative progression.

A Cue represents an audiovisual/temporal moment used to express a Beat.

### Projections

A projection contains no independent narrative truth.

Examples:

- Outline;
- AV Script;
- Teleprompter;
- Coverage.

Editing a projection produces Narrative IR operations.

### Workspaces

A workspace stores user-authored organization that is meaningful but not inherent to a narrative object.

Examples:

- Story Wall;
- Beat Board / Scratch Board;
- Paper Edit;
- Radio Edit;
- later Frame Wall / Selects boards.

Workspace state may include:

- card position;
- size;
- color;
- rotation;
- user-defined lanes/groups;
- parking-lot/rejected areas;
- freeform IdeaCards.

These properties belong to the workspace item, not to the referenced Beat/Scene/MediaSegment itself.

### Alternatives and rejected material

The workflow model should make it easy to move uncertain/rejected material aside rather than delete it.

This reflects common physical editorial practice and allows material to be reused in another structure/version later.

### Source-backed narrative

Footage-first workflows use `SourceExcerpt` objects tied to actual media ranges rather than flattening transcripts into freely editable prose.

This allows Paper Edit / Radio Edit workflows to operate on the same Narrative IR as script-first workflows.

## Alternatives considered

### A. One generic rich-text script editor

Pros:

- familiar document metaphor;
- simpler initial UI.

Cons:

- poor fit for spatial/card workflows;
- source excerpts and coverage become annotations around text;
- risks making the editor document the canonical model.

### B. Separate documents for every workflow

Pros:

- each workflow can be optimized independently;
- easy to copy existing software patterns.

Cons:

- duplicates narrative state;
- requires synchronization/import/export;
- directly recreates the context-drift problem Salai is intended to solve.

### C. Expose a generic node/graph canvas as the main UI

Pros:

- extremely flexible;
- relationships visible directly.

Cons:

- unfamiliar to much of the target audience;
- encourages over-modeling and connection management;
- graph structure may begin driving creative workflow instead of supporting it.

A freeform PureRef-like canvas remains an interesting future workspace, but is not proposed as the canonical UX or Narrative IR.

### D. Timeline-first model

Pros:

- directly maps to editing software;
- concrete temporal semantics.

Cons:

- commits too early to media/timing;
- poor blank-page and pre-production experience;
- makes narrative intent downstream of editorial realization.

## Consequences

### Positive

- users can start from workflows they already understand;
- script-first and footage-first can share one project model;
- story structure can remain stable while its audiovisual realization changes;
- future AI can operate on semantic objects rather than rewriting disconnected documents;
- alternates/rejected material can remain visible without polluting active structure.

### Costs / risks

- projection/workspace synchronization rules must be explicit;
- structural gestures on spatial boards can be ambiguous;
- workspace persistence adds another layer of state;
- one IR may eventually prove too restrictive for some specialized workflows;
- terminology such as Beat/Cue must survive real-project validation.

## Validation plan

### Spike 0A

Validate the Narrative IR independently from UI using three fixtures:

1. short script-first product video;
2. interview/corporate piece;
3. footage-first mini-documentary.

### Spike 0B

Validate recognizable workflows over the same IR:

- Story Wall;
- Outline;
- AV Script;
- Paper/Radio Edit.

The important test is whether users can move naturally between those paradigms without maintaining duplicate story documents.

## Open questions

1. Which workspace gestures should modify canonical narrative order vs only visual layout?
2. How should a Story Wall communicate parking-lot/rejected material versus active structure?
3. When should an IdeaCard become a Beat/Scene versus remain freeform?
4. Does Cue remain useful across all tested workflows?
5. Which workspace should become the initial default for different entry points, if any?
6. How should previs eventually appear across Script/Story Wall/Coverage without becoming a separate project state?

## Decision / outcome

Pending validation and review.

If accepted, the final architectural decision should be captured in an ADR without copying all exploratory detail from this RFC.
