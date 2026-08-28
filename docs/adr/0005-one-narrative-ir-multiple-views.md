# ADR 0005 — One Narrative IR, Multiple Views

## Status

Accepted.

## Context

Salai supports several familiar creative representations such as Outline, Story Wall, AV Script, and Paper/Radio Edit.

Storing each representation as an independent story document would duplicate narrative state and recreate the context drift Salai is intended to solve.

Spike 0A validated the Narrative IR independently. Spike 0B then validated that the four structured surfaces can share one canonical project while preserving stable Beat/Cue/source identity, source-backed semantics, and Workspace isolation.

## Decision

Salai uses **one canonical Narrative IR** for semantic narrative state.

Structured surfaces must derive from or reference that canonical state:

- **Projections** contain no independent narrative truth and produce canonical operations when edited.
- **Workspaces** may persist human organization that is not inherent to narrative semantics, but must reference canonical objects rather than duplicate them.
- **Narrative Lenses** describe the creative role of a structured surface; they do not define a separate persistence model.

No workflow may introduce a shadow narrative document merely to simplify its UI.

This decision does not prescribe the primary authoring interaction. Agent-mediated authoring, direct manipulation, or future interaction modes must all respect the same canonical boundary.

## Alternatives considered

- separate per-workflow documents;
- canonical rich-text script document;
- generic graph/canvas as canonical state;
- timeline-first canonical model.

All were rejected because they either duplicate narrative truth or make one representation the semantic model for unrelated workflows.

## Consequences

Positive:

- synchronized views share stable identity;
- source/production relationships survive restructuring;
- downstream systems have one deterministic serialization target;
- new interaction modes can be added without creating new project truth.

Costs:

- Projection vs Workspace ownership must remain explicit;
- specialized workflows may expose real IR gaps that require deliberate model changes rather than local shadow state.

Related: [`../rfcs/0001-one-narrative-ir-multiple-workflows.md`](../rfcs/0001-one-narrative-ir-multiple-workflows.md).