# RFC 0001 — One Narrative IR, Multiple Familiar Workflows

## Status

Proposed, with 0A/0B evidence supporting the canonical-model architecture and rejecting the assumption that structured workflows should be the **mandatory/routine** authoring path.

Spike 0A validated the Narrative IR. Spike 0B validated that Story Wall, Outline, AV Script, and Paper/Radio Edit can share that IR without duplicate story documents or workflow-specific semantic forks.

The first 0B human test then found that using direct manipulation of those structured surfaces as the routine path requires too much interaction.

Follow-up interpretation adds an important qualification: the structured surfaces remain valuable when the creator deliberately wants to see or manipulate the narrative system from another angle.

RFC 0002 therefore proposes agent-mediated low-friction authoring **plus first-class Narrative Lenses** over this architecture. See [`0002-agent-mediated-authoring.md`](0002-agent-mediated-authoring.md).

## Summary

Salai should maintain one canonical semantic narrative representation and expose it through multiple synchronized creative views rather than storing independent script, paper-edit, board, and outline documents that drift apart.

The working model separates:

- **Narrative IR** — canonical semantic data;
- **Projections** — deterministic views such as Outline and AV Script;
- **Workspaces** — persistent human organization such as Story Wall;
- **Narrative Lenses** — the creative role of structured views that emphasize different aspects of the narrative system;
- **agent-mediated authoring** — the low-friction interaction that normalizes free-form text, conversation, and media into canonical state.

The key principle is:

> **Hide structural bookkeeping, not narrative structure.**

## Motivation

Editors and videographers use several established methods depending on material and production stage:

- index cards / sticky-note scene walls;
- outlines;
- AV scripts;
- paper edits;
- radio edits;
- shot/coverage planning;
- selects/frame walls.

Treating each workflow as an independent document recreates the core problem Salai is intended to solve: narrative intent and production material drift apart.

0B additionally showed that simply exposing several familiar structured workflows is not enough. A product can be familiar at the surface level while still forcing too much explicit structure management.

But the same structured representations can still be creatively useful because they reveal different aspects of the story.

The architecture therefore needs three things:

1. one canonical semantic project;
2. a low-friction interaction layer that hides routine structural bookkeeping; and
3. synchronized structured views that remain available as deliberate Narrative Lenses.

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

These concepts remain canonical implementation/domain semantics even when ordinary authoring does not expose them directly.

### Projections

A Projection contains no independent narrative truth.

Examples:

- Outline;
- AV Script;
- Paper/Radio Edit;
- Teleprompter;
- Coverage.

Editing a Projection produces canonical Narrative IR operations.

### Workspaces

A Workspace stores human-authored organization that is meaningful but not inherent to a narrative object.

Validated 0B example:

- Story Wall position/parking state around canonical Scene/Beat references.

Potential later examples:

- Frame Wall;
- Selects boards;
- alternative/story exploration surfaces.

0B removed speculative Workspace metadata that was not actually needed.

### Narrative Lenses

A Narrative Lens is a structured representation of the same canonical project that emphasizes a particular creative dimension.

Examples:

- Outline → hierarchy/proportion;
- Story Wall → spatial rhythm/alternatives;
- AV Script → audiovisual density/realization;
- Paper/Radio → evidence/voice/source pacing;
- Coverage → gaps between intent and realization.

A lens may be implemented as a Projection, Workspace, or combination. “Lens” describes creative purpose; Projection/Workspace describe state ownership.

The structured views are therefore not merely fallback editors.

They can make the narrative system legible when the creator intentionally wants to inspect or manipulate it.

See [`../narrative-lenses.md`](../narrative-lenses.md).

### Agent-mediated authoring

The low-friction entry layer should let users express ordinary creative intent through:

- free-form text;
- conversation;
- media/attachments.

The agent performs routine normalization into the canonical model without making the user manually specify every object, parent, or relationship.

### Direct manipulation remains valid

The 0B failure does not mean direct structured editing should disappear.

Direct manipulation remains useful when the creator intentionally chooses the lens because that representation is the creative tool.

Examples:

- moving cards while thinking spatially;
- rearranging quotes while shaping a radio edit;
- adjusting Visual/Audio moments while planning realization;
- changing hierarchy while intentionally working structurally.

The failure was making these mechanics compulsory for ordinary intent.

### Alternatives and rejected material

The project model should make it easy to move uncertain/rejected material aside rather than destroy it.

This remains important, but the user should not be forced into one specific Workspace merely to retain alternatives.

### Source-backed narrative

Footage-first workflows use `SourceExcerpt` objects tied to actual media ranges rather than flattening transcripts into freely editable prose.

This remains a critical invariant for agent-mediated media intake and Paper/Radio lenses.

## Alternatives considered

### A. One canonical rich-text script document

Pros:

- familiar document metaphor;
- low initial writing friction.

Cons:

- poor fit for source evidence, audiovisual planning, and spatial/media views;
- synchronization pressure between document markup and semantic state;
- risks making document structure the domain model.

A simple free-form working document is part of RFC 0002 as **input/context**, not canonical story storage.

### B. Separate documents for every workflow

Pros:

- each workflow can be optimized independently.

Cons:

- duplicates narrative state;
- requires synchronization/import/export;
- recreates context drift.

0B strongly argues against this alternative.

### C. Generic node/graph canvas as main UI

Pros:

- flexible relationships and media layout.

Cons:

- high manual organization burden;
- unfamiliar to many target users;
- can make graph construction the creative task.

A future canvas may become one Narrative Lens/Workspace if evidence supports it, but not the canonical UX.

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
- easy operation mapping;
- valuable structural visibility.

Cons:

- ordinary creative intentions require too many explicit actions;
- users must think about parentage/mechanics prematurely;
- operation availability fragments across surfaces.

**0B result:** insufficient as the sole/routine interaction model, but the surfaces remain valuable as Narrative Lenses.

### F. Hide all structure behind chat

Pros:

- low command-entry friction.

Cons:

- narrative system becomes opaque;
- creator loses useful alternative representations;
- direct structural perception/manipulation weakens.

**Current direction:** rejected as an extreme. Agent-mediated authoring and Narrative Lenses should coexist.

## Consequences

### Positive

- one source of narrative truth remains viable;
- script-first and footage-first work share one model;
- story structure remains stable while audiovisual realization changes;
- structured views stay synchronized;
- source identity survives restructuring;
- the IR becomes a reliable normalization/serialization target for agents and downstream systems;
- Narrative Lenses make the same system human-legible from several creative angles.

### Costs / risks

- Projection/Workspace synchronization rules must remain explicit;
- one IR may eventually prove too restrictive for specialized workflows;
- agent mediation introduces interpretation/trust/history concerns;
- lens design can expose implementation detail rather than useful creative structure;
- user-facing terminology remains a per-lens decision.

## Validation evidence

### Spike 0A — complete / pass

Validated the Narrative IR independently from UI using three fixtures:

1. short script-first product video;
2. interview/corporate piece;
3. footage-first mini-documentary.

### Spike 0B — closed / mixed

Validated:

- Story Wall, Outline, AV Script, and Paper/Radio over one canonical project;
- stable Beat/Cue/source identity;
- Workspace isolation;
- source/authored semantics;
- cross-surface propagation.

Human result:

> Using direct structured authoring as the routine path requires too much interaction.

Follow-up interpretation:

> The same structured views remain valuable as deliberate Narrative Lenses.

See [`../spike-0b-assessment.md`](../spike-0b-assessment.md).

### Spike 0C — next

Validate:

- free-form writing/conversation/media → canonical state with materially less incidental interaction;
- Narrative Lenses → useful structural insight/direct manipulation;
- agent ↔ lens continuity over the same project.

See [`../agent-mediated-authoring.md`](../agent-mediated-authoring.md) and [`../narrative-lenses.md`](../narrative-lenses.md).

## Open questions

1. Does the Narrative IR remain sufficient for genuinely messy agent-interpreted input?
2. Which Narrative Lenses remain first-class after 0C?
3. Which internal concepts are useful enough to expose per lens?
4. Does a durable free-form WorkingDocument/session artifact become necessary?
5. How much reversible agent normalization can auto-apply before trust falls?
6. How should agent reasoning incorporate active-lens context?
7. How should alternatives/uncertainty be represented before canonical commitment?
8. Is narrative pulse best exposed through several derived indicators rather than one score?

## Decision / outcome

Pending Spike 0C.

Current evidence strongly supports the **one canonical Narrative IR / multiple synchronized views** architecture.

The superseded assumption is not “structured views are useful.” It is “structured views must be the routine path for ordinary authoring.”

RFC 0002 tests the combined agent-mediated + Narrative Lens interaction model.