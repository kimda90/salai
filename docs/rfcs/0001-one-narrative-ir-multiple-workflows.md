# RFC 0001 — One Narrative IR, Multiple Familiar Workflows

## Status

**Accepted.**

The accepted architectural decision is recorded in [`../adr/0005-one-narrative-ir-multiple-views.md`](../adr/0005-one-narrative-ir-multiple-views.md).

Spike 0A validated the Narrative IR. Spike 0B validated that Story Wall, Outline, AV Script, and Paper/Radio Edit can share that IR without duplicate story documents or workflow-specific semantic forks.

0B did **not** validate the original interaction assumption that those structured workflows should be the routine path for ordinary authoring. That interaction assumption is superseded by RFC 0002; the canonical-model decision remains accepted.

## Summary

Salai maintains one canonical semantic narrative representation and exposes it through synchronized creative views rather than storing independent script, paper-edit, board, and outline documents that drift apart.

The architecture separates:

- **Narrative IR** — canonical semantic data;
- **Projections** — deterministic views with no independent narrative truth;
- **Workspaces** — persistent human organization that is meaningful but not inherent to canonical narrative semantics;
- **Narrative Lenses** — the creative role of structured views, regardless of whether implementation uses a Projection, Workspace, or both.

## Motivation

Editors use several familiar representations—outlines, index-card walls, AV scripts, paper/radio edits, coverage views, selects/frame walls—depending on material and stage.

If each representation stores its own story, Salai recreates the context drift it is meant to solve.

The shared model must preserve stable narrative/source identity while allowing several ways of seeing and manipulating the same project.

## Proposal

### Canonical narrative model

Narrative IR remains the single semantic story model. Its exact fields/invariants/operation vocabulary are owned by [`../narrative-ir-spec.md`](../narrative-ir-spec.md).

### Projections

A Projection owns no independent narrative truth. Editing a Projection produces canonical Narrative operations.

Validated examples:

- Outline;
- AV Script;
- Paper/Radio Edit.

### Workspaces

A Workspace stores human-authored organization that is not inherent to the narrative object itself.

Validated example:

- Story Wall x/y placement and parking around canonical Scene/Beat references.

Workspace metadata must not silently redefine narrative order or meaning.

### Narrative Lenses

Narrative Lens describes the creative purpose of a structured surface. It is not a new persistence layer.

Current lens semantics live in [`../narrative-lenses.md`](../narrative-lenses.md).

## Alternatives considered

### Separate documents for every workflow

Rejected. It duplicates narrative state and requires synchronization/import/export.

### Canonical rich-text document

Rejected as the semantic project model. It fits prose but poorly represents source evidence, audiovisual realization, and non-document views.

### Generic graph/canvas as the canonical model/UI

Rejected. It turns relationship management into routine creative work and does not solve semantic ownership.

### Timeline-first canonical model

Rejected. It commits too early to editorial realization and makes narrative intent downstream of media placement.

## Evidence

### Spike 0A

Validated stable Narrative IR identity, authored/source semantics, operations, serialization, runtime, and representative fixtures.

### Spike 0B

Validated:

- four structured surfaces over one canonical project;
- stable Beat/Cue/source identity;
- Workspace isolation;
- source/authored semantics;
- cross-surface propagation;
- no workflow-specific semantic fork required.

0B's human result rejected only the assumption that direct structured manipulation should be the routine primary interaction.

See [`../spike-0b-assessment.md`](../spike-0b-assessment.md).

## Consequences

Positive:

- one source of narrative truth;
- stable source/production identity through restructuring;
- synchronized structured views;
- clear Projection vs Workspace state ownership;
- reliable serialization target for agents and downstream systems.

Costs/risks:

- new workflows must respect canonical ownership rather than adding shadow models;
- Workspace semantics must remain explicitly separate;
- the shared IR may still need revision when genuinely new workflows expose a semantic gap.

## Open questions

None for the accepted canonical-model decision. Questions about the primary interaction model are tracked in RFC 0002 and Spike 0C.

## Decision / outcome

**Accepted:** one canonical Narrative IR with synchronized Projections/Workspaces is Salai's architectural baseline.

**Not accepted by this RFC:** any specific primary authoring interaction. RFC 0002 proposes agent-mediated routine authoring plus Narrative Lenses and remains subject to Spike 0C validation.