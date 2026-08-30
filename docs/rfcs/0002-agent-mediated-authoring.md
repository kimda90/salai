# RFC 0002 — Agent-Mediated Authoring and Narrative Lenses

## Status

Proposed. Validate through Spike 0C before acceptance.

RFC 0001 / ADR 0005 already establish the accepted architectural baseline: one canonical Narrative IR with synchronized Projections/Workspaces. This RFC proposes a **primary interaction model** over that baseline.

The current application boundary is separately accepted in [`../adr/0007-project-service-is-the-human-machine-boundary.md`](../adr/0007-project-service-is-the-human-machine-boundary.md).

## Summary

Salai should combine:

- **agent/model-mediated low-friction authoring** for ordinary intent expression and routine structural normalization; and
- **Narrative Lenses** for deliberate structural perception and direct manipulation.

Core principle:

> **Hide structural bookkeeping, not narrative structure.**

Working text, model history, and lenses are not separate sources of truth.

## Motivation

Spike 0B produced two findings:

1. one Narrative IR can support several synchronized structured views; and
2. requiring direct structured manipulation as the routine path creates too much interaction burden.

The same structured views remain useful when the creator deliberately wants to see or manipulate the narrative system from another angle.

The next interaction should therefore reduce routine bookkeeping without making the canonical structure opaque.

## Proposal

### Low-friction input

The creator may use:

- rough working text;
- natural-language project instructions/questions;
- fixture-backed or later real media/source context.

Working text and model conversation/history are context, not canonical story storage.

### Shared application boundary

Human UI and machine/model integrations should operate on the same authoritative Salai project through `SalaiProjectService`.

The service provides task-relevant context, applies canonical changes, and publishes project/Workspace updates. It is an application facade over the existing controller/model state, not a second project model.

```text
Narrative Lenses ─┐
                  │
embedded model ───┼──> SalaiProjectService
                  │          ↓
future CLI/MCP ───┘    Narrative IR / Workspace
```

Provider sessions, model history, external-agent state, and credentials are not Salai project state.

### Canonical change boundary

Reuse the existing public Narrative operation API.

`@salai/script-model` already provides `applyOperation()` and `applyOperations()`.

For a model request that resolves to several canonical changes:

```text
user intent
    ↓
model / interpretation
    ↓
typed Salai result
    ↓
NarrativeOperation[]
    ↓
SalaiProjectService
    ↓
applyOperations()
    ↓
one canonical publish
```

Start with public `NarrativeOperation[]` where stable existing IDs make that sufficient.

Introduce a higher-level Salai authoring command only when a concrete implemented scenario requires Salai-owned resolution, such as new-ID allocation, relative placement, or avoiding raw `ParentRef`/index manufacture by a model/client.

Such commands are transient adapters that compile immediately to public operations. They must not become a second persistent domain API.

### Backendless 0C model path

The primary 0C demo should run in the existing static browser/GitHub Pages application without a Salai-operated backend.

The hosted-model integration therefore must:

- be safe for a public browser client;
- use user-scoped authentication/usage rather than an embedded developer secret;
- receive only task-relevant Salai context;
- return a Salai-owned structured result;
- keep provider/auth/session types outside the project/domain layer.

CI should use deterministic structured model-result fixtures rather than live network/model calls.

Provider/model selection is an adapter decision and is not part of this RFC's product semantics.

### Grouped action / immediate revert

One creative request may contain several internal operations but should appear as one understandable action.

For 0C:

- publish only after the full operation batch succeeds;
- retain pre-action project/Workspace snapshots;
- show a concise creative-level summary;
- support immediate one-step revert only while no later canonical/Workspace edit has occurred;
- invalidate the snapshot on any later model-mediated or direct-lens edit.

This avoids erasing newer manual work with an older snapshot. Do not introduce a general event-history or inverse-operation architecture merely to validate 0C.

### Source evidence

Recorded evidence remains recorded evidence.

Model-mediated changes may arrange, select, or explicitly trim source excerpts using the existing canonical rules, but must not silently convert `SourceExcerpt` wording/ranges into editable authored copy.

### Narrative Lenses

Detailed lens semantics are canonical in [`../narrative-lenses.md`](../narrative-lenses.md).

This RFC requires only that:

- existing lenses reflect model-mediated changes through shared canonical state;
- direct lens edits continue through the existing Narrative/Workspace boundaries;
- one direct-lens edit becomes context for a subsequent model request by reading current project state, without export/import or shadow synchronization;
- Workspace-only intent remains Workspace-only.

0C does not need a new Coverage Lens. It may test a simple missing/unsupported-material question using mocked relationships; the Coverage Lens belongs with the later production graph.

### External machine interfaces

External-agent integration is not required for the 0C gate.

A later or optional adapter may expose `SalaiProjectService` through one machine-oriented interface such as CLI or MCP. A Skill may package workflow guidance for a generic agent, but it does not own state or implement capability.

External interfaces must use the same canonical service rather than editing persistence directly or introducing another project/session model.

### Local-first / hosted-provider boundary

Supporting hosted inference does not grant a provider implicit access to local production media.

- raw originals remain local by default;
- attachment handles are references, not upload authorization;
- hosted requests receive only task-relevant selected/derived context;
- broader/raw-media egress requires an explicit product/user boundary;
- provider choice must not change canonical Narrative/source/provenance semantics;
- credentials are adapter infrastructure, not project state.

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

### Make an agent runtime the central Salai abstraction

Rejected. The durable boundary is the project/application service that both humans and machines use. Runtime/provider integrations should remain replaceable adapters.

### Let machine clients edit serialized project storage directly

Rejected. It bypasses application validation, operation semantics, Workspace ownership, revert behavior, and future persistence policy.

### Build external-agent bridge/synchronization infrastructure for 0C

Not justified. The embedded browser path is enough to validate the interaction hypothesis. External CLI/MCP/Skill work should begin only when there is a concrete scenario to validate.

### Build distributed-state infrastructure now

Rejected. A local serialized mutation boundary is sufficient. Add project revision checks if a real stale-write case appears; CRDTs/event sourcing are not 0C requirements.

## Consequences

Benefits:

- routine interaction can scale with creative decisions rather than operation count;
- creators retain direct structured ways to inspect/manipulate the story;
- source/provenance rules remain enforceable;
- downstream systems consume deterministic project state;
- the public 0C demo can remain backendless;
- model/provider/authentication choices remain replaceable;
- later machine interfaces can reuse the same project boundary.

Risks:

- model interpretation can be wrong;
- free-form context vs canonical state can become conceptually unclear;
- a higher-level command adapter can accidentally grow into a duplicate domain API;
- active-lens context may add complexity without enough value;
- hosted inference introduces an explicit data-egress boundary;
- the immediate snapshot revert is intentionally limited and does not solve general mixed manual/model history;
- a browser-safe model adapter may constrain provider choice for the hosted prototype.

## Spike 0C validation

Validate only the minimum proof:

1. one script-first creation/revision flow;
2. one fixture-backed footage/source flow;
3. one grouped multi-operation change with summary + immediate revert;
4. source evidence preserved;
5. one model-normalized project → existing lens → direct edit → follow-up model request;
6. a real hosted model works from the static prototype without a Salai backend or embedded developer secret;
7. a fresh model interaction can continue from current Salai context without conversation history as project storage;
8. human evidence of materially lower routine interaction than 0B;
9. human evidence that at least one existing lens provides useful structural insight.

The executable tasks are canonical in [`../spike-0c-implementation-plan.md`](../spike-0c-implementation-plan.md).

## Open questions

1. Which concrete scenarios actually require higher-level authoring commands rather than public `NarrativeOperation[]`?
2. What is the minimum `SalaiProjectService` contract required by both lens and model-mediated interactions?
3. Is serialized local mutation sufficient throughout 0C, or does a concrete stale-write case justify project revisions?
4. What history/undo behavior is actually needed beyond 0C's immediate snapshot revert?
5. Does working text need durable identity after human testing?
6. How much active-lens context materially improves interpretation?
7. Does messy model-mediated input expose a real Narrative IR semantic gap?
8. Which existing lenses remain useful enough to justify continued investment after 0C?
9. Does external-agent access later justify CLI, MCP, or another machine interface?

## Decision / outcome

Pending Spike 0C implementation and human validation.