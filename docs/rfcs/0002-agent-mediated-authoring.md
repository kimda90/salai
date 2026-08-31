# RFC 0002 — Agent-Mediated Authoring and Narrative Lenses

## Status

Proposed. Validate through Spike 0C before acceptance.

Accepted architectural baseline: one canonical Narrative IR with synchronized Projections/Workspaces (ADR 0005) and an external harness operating through a Salai-owned project/machine boundary (ADR 0008).

## Summary

Salai combines:

- **external-agent-mediated low-friction authoring** for ordinary intent expression and routine structural normalization; and
- **Narrative Lenses** for deliberate structural perception and direct manipulation.

Core principle:

> **Hide structural bookkeeping, not narrative structure.**

Harness conversation/history and Narrative Lenses are not separate sources of story truth.

## Proposal

### Shared application boundary

Human UI and machine integrations operate on the same authoritative project through `SalaiProjectService`.

```text
Narrative Lenses ───────────┐
                            ↓
                    SalaiProjectService
                            ↑
external harness → Salai machine interface
```

The service provides task-relevant context, applies canonical changes, and publishes project/Workspace changes. It is a facade over existing controller/model behavior, not another project model.

### External harness owns the agent runtime

Model/provider selection, authentication, conversation history, planning, and tool-loop behavior remain outside Salai.

Salai exposes one CLI-oriented machine interface in 0C. Add MCP only after a concrete later need. A Skill may teach a harness how to use the machine interface but does not own capability or state.

### Canonical changes

Reuse the public `NarrativeOperation[]` / `applyOperations()` path.

```text
harness intent/tool call
      ↓
Salai machine command
      ↓
NarrativeOperation[]
      ↓
SalaiProjectService
      ↓
applyOperations()
      ↓
one canonical publish
```

Add a higher-level Salai command only when a real scenario requires Salai-owned ID/reference/placement resolution. The command compiles immediately to public operations.

### Live browser-project bridge

The current spike UI owns project state in the browser. A minimal local request/response bridge is allowed so the external CLI can reach that same live project service.

The bridge carries requests/results only. It owns no narrative project, model session, or persistence and does not justify distributed-state infrastructure.

### Grouped action / immediate revert

One harness request may contain several operations but appears as one creative action:

- publish only after the whole operation batch succeeds;
- keep the pre-action project/Workspace snapshot;
- show a concise action summary;
- allow immediate one-step revert while no later project/Workspace edit has occurred;
- invalidate the revert on any later machine or direct-lens edit.

Do not add a general event-history/inverse-operation architecture for 0C.

### Source evidence

Recorded evidence remains recorded evidence. Machine-driven changes may arrange/select or explicitly trim source excerpts using existing canonical rules but must not silently turn SourceExcerpt wording/ranges into authored copy.

### Narrative Lenses

Existing lenses reflect machine changes through shared canonical state. Direct lens edits use the same project/Workspace boundary and must be visible to the next harness context read without export/import or chat-memory synchronization.

Workspace-only intent remains Workspace-only.

### Resolve boundary

Harness instructions and lens edits change canonical Salai state first. Resolve automation remains downstream behind the Salai Resolve adapter.

## Alternatives considered

### Routine direct structured manipulation

Rejected by 0B human evidence as too interaction-heavy. Structured surfaces remain Narrative Lenses.

### Hide all structure behind chat

Rejected. Narrative structure must remain inspectable/directly manipulable.

### Embedded model/provider inside Salai

Rejected by ADR 0008. It makes Salai own provider/auth/session infrastructure instead of reusing existing harnesses.

### Direct project-file editing by the harness

Rejected. It bypasses application validation, Workspace ownership, grouped-action behavior, and future persistence policy.

### Build CLI and MCP together

Rejected. One machine interface is sufficient for 0C.

### Distributed-state infrastructure

Rejected. One local authoritative project and serialized mutations are enough for this spike.

## Consequences

Benefits:

- interaction burden can scale with creative decisions rather than operation count;
- Salai avoids generic model/auth/chat infrastructure;
- users can bring an existing harness/account/model setup;
- human and machine edits share one semantic model/validation path;
- Narrative Lenses remain direct creative tools;
- project continuity does not depend on harness history.

Risks:

- model interpretation can be wrong;
- the local bridge may add temporary prototype glue;
- a higher-level command can accidentally grow into a second mutation language;
- an external harness may require clear instructions/Skill guidance to use Salai semantics reliably;
- immediate snapshot revert is intentionally limited, not a general undo system.

## Spike 0C validation

Validate only:

1. external harness can inspect/mutate the same live project as the UI;
2. one script-first creation/revision flow;
3. one fixture-backed source flow;
4. one grouped multi-operation action + immediate revert;
5. source evidence preserved;
6. one harness-normalized project → existing lens → direct edit → follow-up harness request;
7. a fresh harness session can continue from current Salai state;
8. human evidence of materially lower routine interaction than 0B;
9. human evidence that at least one lens provides useful structural insight.

Executable tasks are canonical in [`../spike-0c-implementation-plan.md`](../spike-0c-implementation-plan.md).

## Open questions

1. Which creation/reference scenario first justifies a higher-level Salai command?
2. What is the smallest local bridge that allows a CLI to reach the live browser-owned project service?
3. Is serialized mutation enough throughout 0C or does a stale-write case justify revisions?
4. What history/undo behavior is needed beyond immediate revert?
5. Does the external harness need a formal Skill after the raw CLI workflow is tested?
6. Does messy agent-mediated input expose a Narrative IR semantic gap?
7. Which existing lenses remain useful enough to justify continued investment?

## Decision / outcome

Pending Spike 0C implementation and human validation.
