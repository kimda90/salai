# RFC 0001 — One Narrative IR, Multiple Familiar Workflows

## Status

Proposed, with 0A/0B evidence supporting the canonical-model architecture and **rejecting the assumption that the structured workflows should be the primary authoring entry points**.

Spike 0A validated the Narrative IR. Spike 0B validated that Story Wall, Outline, AV Script, and Paper/Radio Edit can share that IR without duplicate story documents or workflow-specific semantic forks. The first 0B human test then found that direct manipulation of those structured surfaces requires too much interaction to be creatively useful as the default authoring model.

RFC 0002 now proposes an agent-mediated primary authoring layer above this architecture. See [`0002-agent-mediated-authoring.md`](0002-agent-mediated-authoring.md).

## Summary

Salai should maintain one canonical semantic narrative representation and expose it through multiple synchronized creative views rather than storing independent script, paper-edit, board, and outline documents that drift apart.

The working model separates:

- **Narrative IR** — canonical semantic data;
- **Projections** — deterministic views such as Outline and AV Script;
- **Workspaces** — persistent human organization such as Story Wall and later spatial/source workspaces;
- **agent-mediated authoring** — proposed primary interaction that normalizes free-form text, conversation, and media into the canonical state.

The multiple structured surfaces remain valuable, but 0B evidence no longer supports making them mandatory or primary authoring stages.

## Motivation

Editors and videographers use several established methods depending on the material and production stage:

- index cards / sticky-note scene walls;
- outlines;
- AV scripts;
- paper edits;
- radio edits;
- shot/coverage planning;
- selects/frame walls.

Treating each workflow as an independent document recreates the core problem Salai is intended to solve: narrative intent and production material drifting apart.

0B additionally showed that simply exposing several familiar structured workflows is not enough. A product can be familiar at the surface level while still forcing too much explicit structure management.

The architecture therefore needs both:

1. one canonical semantic project; and
2. an interaction layer that can hide routine structural bookkeeping.

## Proposal

### Canonical narrative model

The Narrative IR uses:

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

These concepts remain canonical implementation/domain semantics even when the primary UX does not expose them directly.

### Projections

A projection contains no independent narrative truth.

Examples:

- Outline;
- AV Script;
- Teleprompter;
- Coverage.

Editing a projection produces Narrative IR operations.

### Workspaces

A workspace stores human-authored organization that is meaningful but not inherent to a narrative object.

Validated 0B example:

- Story Wall position/parking state around canonical Scene/Beat references.

Potential later examples:

- Frame Wall;
- Selects boards;
- alternative/story exploration surfaces.

0B removed speculative Workspace metadata that was not actually needed.

### Structured surfaces are specialized tools, not necessarily entry points

0B originally treated multiple familiar workflows as candidate primary authoring surfaces. Human testing showed that the user still had to execute too many model-management actions.

The amended proposal is:

- keep the views because their representations are useful;
- do not require users to enter them for ordinary creative changes;
- allow a higher-level agent-mediated surface to perform structural normalization;
- open structured views for inspection, precision, comparison, or production-specific planning.

### Alternatives and rejected material

The project model should make it easy to move uncertain/rejected material aside rather than destroy it.

This remains important, but the user should not be forced into a Story Wall or a specific Workspace just to retain alternatives.

### Source-backed narrative

Footage-first workflows use `SourceExcerpt` objects tied to actual media ranges rather than flattening transcripts into freely editable prose.

This remains a critical invariant for future agent-mediated media intake: an agent may arrange or select source evidence but must not rewrite the recording as authored copy.

## Alternatives considered

### A. One canonical rich-text script document

Pros:

- familiar document metaphor;
- low initial writing friction.

Cons:

- poor fit for source evidence, audiovisual planning, and spatial/media views;
- creates synchronization pressure between document markup and semantic state;
- risks making document structure the domain model.

A simple free-form working document is now part of RFC 0002, but as **input/context**, not canonical story storage.

### B. Separate documents for every workflow

Pros:

- each workflow can be optimized independently.

Cons:

- duplicates narrative state;
- requires synchronization/import/export;
- recreates context drift.

0B strongly argues against this alternative.

### C. Expose a generic node/graph canvas as the main UI

Pros:

- flexible relationships and media layout.

Cons:

- high manual organization burden;
- unfamiliar to many target users;
- can make graph construction the creative task.

The 0B human finding makes this even less attractive as the default authoring model.

### D. Timeline-first model

Pros:

- maps directly to editing software.

Cons:

- commits too early to media/timing;
- poor blank-page/pre-production experience;
- makes narrative intent downstream of editorial realization.

### E. Direct structured surfaces as the complete UX

This is the alternative most directly tested by 0B.

Pros:

- familiar representations;
- deterministic interaction;
- easy to map actions to typed operations.

Cons:

- common creative intentions require too many explicit actions;
- user must think about structure and parentage prematurely;
- operation availability fragments across surfaces;
- technically correct model manipulation interrupts creative flow.

**0B result:** not sufficient as the primary interaction model.

## Consequences

### Positive

- one source of narrative truth remains viable;
- script-first and footage-first work can share one project model;
- story structure can remain stable while audiovisual realization changes;
- structured views can remain synchronized;
- source identity survives restructuring;
- the IR can become a reliable normalization/serialization target for agents and downstream systems.

### Costs / risks

- projection/workspace synchronization rules still need to remain explicit;
- one IR may eventually prove too restrictive for specialized workflows;
- an agent-mediated layer introduces interpretation/trust/history concerns;
- user-facing terminology can now be deferred until a specialized view actually needs it.

## Validation evidence

### Spike 0A — complete / pass

Validated the Narrative IR independently from UI using three fixtures:

1. short script-first product video;
2. interview/corporate piece;
3. footage-first mini-documentary.

### Spike 0B — closed

Validated:

- Story Wall, Outline, AV Script, and Paper/Radio over one canonical project;
- stable Beat/Cue/source identity;
- Workspace isolation;
- source/authored semantics;
- cross-surface propagation.

Human result:

> Direct structured authoring requires too much interaction to remain creatively useful as the primary workflow.

See [`../spike-0b-assessment.md`](../spike-0b-assessment.md).

### Spike 0C — next

Validate whether free-form writing, conversation, and media intake can be normalized by an agent into the same canonical state with materially less explicit interaction.

See [`../agent-mediated-authoring.md`](../agent-mediated-authoring.md).

## Open questions

1. Does the Narrative IR remain sufficient when the input is genuinely messy and agent-interpreted rather than curated fixture data?
2. Which structured surfaces remain first-class after agent-mediated authoring is tested?
3. Does a durable free-form working-document/session artifact become necessary?
4. How much reversible agent normalization can auto-apply before trust falls?
5. Which terms, including `Cue`, should be visible only in specialized views?
6. How should alternatives and uncertainty be represented when the user has not explicitly committed them to canonical structure?

## Decision / outcome

Pending Spike 0C.

Current evidence strongly supports the **one canonical Narrative IR / multiple synchronized views** architecture. The interaction assumption that users should primarily author by directly manipulating those views is superseded by the new agent-mediated hypothesis and will be decided through RFC 0002.
