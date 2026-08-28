# RFC 0002 — Agent-Mediated Authoring and Narrative Lenses

## Status

Proposed. Validate through Spike 0C before acceptance.

RFC 0001 / ADR 0005 already establish the accepted architectural baseline: one canonical Narrative IR with synchronized Projections/Workspaces. This RFC proposes a **primary interaction model** over that baseline.

## Summary

Salai should combine:

- **agent-mediated low-friction authoring** for ordinary intent expression and routine structural normalization; and
- **Narrative Lenses** for deliberate structural perception and direct manipulation.

Core principle:

> **Hide structural bookkeeping, not narrative structure.**

The agent, working text, chat history, and lenses are not separate sources of truth.

## Motivation

Spike 0B produced two findings:

1. one Narrative IR can support several synchronized structured views; and
2. requiring direct structured manipulation as the routine path creates too much interaction burden.

Follow-up product interpretation showed that the same structured views remain useful when the creator deliberately wants to see or manipulate the narrative system from another angle.

The next interaction should therefore reduce routine bookkeeping without making the canonical structure opaque.

## Proposal

### Low-friction input

The creator may use:

- rough working text;
- natural-language project instructions/questions;
- fixture-backed or later real media/source context.

Working text and conversation are context, not canonical story storage.

### Canonical change boundary

Reuse the existing public Narrative operation API.

`@salai/script-model` already provides `applyOperation()` and `applyOperations()`.

For an agent request that resolves to several canonical changes:

```text
user intent
    ↓
model/provider
    ↓
NarrativeOperation[]
    ↓
applyOperations()
    ↓
one controller publish
```

Start with public `NarrativeOperation[]` where stable existing IDs make that sufficient.

Introduce a higher-level Salai authoring command only when a concrete implemented scenario requires Salai-owned resolution, such as new-ID allocation, relative placement, or avoiding raw `ParentRef`/index manufacture by the model.

Such commands are transient adapters that compile immediately to public operations. They must not become a second persistent domain API.

### Grouped action / immediate revert

One creative request may contain several internal operations but should appear as one understandable action.

For 0C:

- publish only after the full operation batch succeeds;
- retain pre-action project/Workspace snapshots;
- show a concise creative-level summary;
- support immediate one-step revert only while no later canonical/Workspace edit has occurred;
- invalidate the snapshot on any later agent or direct-lens edit.

This avoids erasing newer manual work with an older snapshot. Do not introduce a general event-history or inverse-operation architecture merely to validate 0C.

### Source evidence

Recorded evidence remains recorded evidence.

Agent-mediated changes may arrange, select, or explicitly trim source excerpts using the existing canonical rules, but must not silently convert `SourceExcerpt` wording/ranges into editable authored copy.

### Narrative Lenses

Detailed lens semantics are canonical in [`../narrative-lenses.md`](../narrative-lenses.md).

This RFC requires only that:

- existing lenses reflect agent changes through shared canonical state;
- direct lens edits continue through the existing Narrative/Workspace boundaries;
- one direct-lens edit can become context for a subsequent agent request without synchronization/export logic;
- Workspace-only intent remains Workspace-only.

0C does not need a new Coverage Lens. It may test a simple missing/unsupported-material question using mocked relationships; the Coverage Lens belongs with the later production graph.

### Local-first / hosted-provider boundary

Supporting hosted inference does not grant the provider implicit access to local production media.

- raw originals remain local by default;
- attachment handles are references, not upload authorization;
- hosted requests receive only task-relevant selected/derived context;
- broader/raw-media egress requires an explicit product/user boundary;
- provider choice must not change canonical Narrative/source/provenance semantics.

### Resolve boundary

Free-form instructions and lens edits change canonical Salai state first. Resolve automation remains downstream behind the Salai Resolve adapter.

## Alternatives considered

### Structured surfaces as the routine path for every task

Rejected by 0B human evidence because routine interaction burden is too high. Structured surfaces remain valuable as Narrative Lenses.

### Hide all structure behind chat

Rejected. It lowers command-entry friction but makes the narrative system opaque and weakens direct creative manipulation.

### Chat sidebar beside unchanged form-heavy workflow

Insufficient. It leaves model management as the default interaction and treats the agent as an accessory.

### Canonical rich-text document

Not proposed. Working text is input/context; Narrative IR remains canonical.

### General agent framework

Not justified for 0C. Start with one small Salai-owned provider/structured-output boundary.

## Consequences

Benefits:

- routine interaction can scale with creative decisions rather than operation count;
- creators retain direct structured ways to inspect/manipulate the story;
- source/provenance rules remain enforceable;
- downstream systems consume deterministic project state.

Risks:

- model interpretation can be wrong;
- free-form context vs canonical state can become conceptually unclear;
- a higher-level command adapter can accidentally grow into a duplicate domain API;
- active-lens context may add complexity without enough value;
- hosted providers introduce an explicit data-egress boundary;
- the immediate snapshot revert is intentionally limited and does not solve general mixed manual/agent history.

## Spike 0C validation

Validate only the minimum proof:

1. one script-first creation/revision flow;
2. one fixture-backed footage/source flow;
3. one grouped multi-operation change with summary + immediate revert;
4. source evidence preserved;
5. one agent-normalized project → existing lens → direct edit → follow-up agent request;
6. human evidence of materially lower routine interaction than 0B;
7. human evidence that at least one existing lens provides useful structural insight.

The executable tasks are canonical in [`../spike-0c-implementation-plan.md`](../spike-0c-implementation-plan.md).

## Open questions

1. Which concrete scenarios actually require higher-level agent commands rather than public `NarrativeOperation[]`?
2. What history/undo behavior is actually needed beyond 0C's immediate snapshot revert?
3. Does working text need durable identity after human testing?
4. How much active-lens context materially improves interpretation?
5. Does messy agent-mediated input expose a real Narrative IR semantic gap?
6. Which existing lenses remain useful enough to justify continued investment after 0C?

## Decision / outcome

Pending Spike 0C implementation and human validation.