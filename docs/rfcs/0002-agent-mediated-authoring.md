# RFC 0002 — Agent-Mediated Authoring and Narrative Lenses

## Status

**Accepted by Spike 0C.**

Implementation/human evidence: [`../spike-0c-assessment.md`](../spike-0c-assessment.md).

Accepted architectural baseline: one canonical Narrative IR with synchronized Projections/Workspaces (ADR 0005) and an external harness operating through a Salai-owned project/machine boundary (ADR 0008).

## Summary

Salai combines:

- **external-agent-mediated low-friction authoring** for ordinary intent expression and routine structural normalization; and
- **human semantic representations** for deliberate structural perception and direct manipulation.

Core principle:

> **Hide structural bookkeeping, not narrative structure.**

Harness conversation/history and human projections are not separate sources of story truth.

## Accepted interaction model

### Shared application boundary

Human UI and machine integrations operate on the same authoritative project through `SalaiProjectService`.

```text
human UI ──────────────────┐
                           ↓
                   SalaiProjectService
                           ↑
external harness → Salai machine interface
```

The service provides task-relevant context, applies canonical changes, and publishes project/Workspace changes. It is a facade over existing controller/model behavior, not another project model.

### External harness owns the agent runtime

Model/provider selection, authentication, conversation history, planning, and tool-loop behavior remain outside Salai.

Salai exposes one CLI-oriented machine interface as the first validated protocol. Add MCP or another protocol only after a concrete integration requires it. A Skill may teach a harness how to use the interface but does not own capability or state.

Spike 0C human validation used Codex successfully. Codex is evidence for the boundary, not a mandatory product dependency.

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

The current prototype UI owns project state in the browser. A minimal local request/response bridge lets the external CLI reach that same live project service.

The bridge carries requests/results only. It owns no narrative project, model session, or persistence and does not justify distributed-state infrastructure.

### Grouped action / immediate revert

One harness request may contain several operations but appears as one creative action:

- publish only after the whole operation batch succeeds;
- keep the pre-action project/Workspace snapshot;
- show a concise action summary;
- allow immediate one-step revert while no later project/Workspace edit has occurred;
- invalidate the revert on any later machine or direct edit.

This does not require general event sourcing.

### Source evidence

Recorded evidence remains recorded evidence. Machine-driven changes may arrange/select or explicitly trim source excerpts using existing canonical rules but must not silently turn SourceExcerpt wording/ranges into authored copy.

### Human UI continuity

Human projections reflect machine changes through shared canonical state. Direct edits use the same project/Workspace boundary and are visible to the next harness context read without export/import or chat-memory synchronization.

Workspace-only intent remains Workspace-only.

### Structural-editorial continuation

ADR 0009 changes the downstream product boundary but does not change the accepted agent architecture.

In Spike 0D the same flow continues into the semantic timeline:

```text
external harness
      ↓
SalaiProjectService
      ↓
canonical narrative/source change
      ↓
semantic timeline / playback
```

The harness never manipulates third-party timeline/rendering state as project truth.

## Alternatives rejected

### Routine direct structured manipulation

Rejected by 0B human evidence as too interaction-heavy for ordinary authoring.

### Hide all structure behind chat

Rejected. Narrative structure must remain inspectable/directly manipulable.

### Embedded model/provider inside Salai

Rejected by ADR 0008. It makes Salai own provider/auth/session infrastructure instead of reusing existing harnesses.

### Direct project-file editing by the harness

Rejected. It bypasses application validation, Workspace ownership, grouped-action behavior, and persistence policy.

### Build CLI and MCP together without evidence

Rejected. One machine interface was sufficient for 0C.

### Distributed-state infrastructure

Rejected. One local authoritative project and serialized mutations are enough for the validated flow.

## Evidence / outcome

Spike 0C implementation and human validation established that:

- an external harness can inspect and mutate the same live Salai project as the UI;
- script-first and source-backed changes can resolve through canonical operations;
- grouped changes can remain atomic/revertible;
- source evidence can remain source-backed;
- human and machine edits share one project;
- a fresh harness can reason from current Salai state rather than conversation history;
- using Codex as the harness materially reduced routine structural interaction compared with 0B.

The proposal is therefore accepted and carried forward as the external-agent interaction architecture.
