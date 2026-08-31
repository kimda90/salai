# Spike 0C — Agent-Mediated Authoring

## Status

Active product/UX contract for Spike 0C. Current runtime decision: [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md).

The required external-agent operating procedure is defined separately in [`agent-usage.md`](agent-usage.md).

## Validation question

Can a filmmaker construct and revise representative stories through ordinary-language interaction with an existing agent harness while Salai handles structural bookkeeping, preserves canonical validity/source provenance, and remains coherent with direct Narrative Lens editing?

## Product hypothesis

> **Express intent naturally; Salai structures it for production. See and reshape that structure through narrative lenses.**

> **Hide structural bookkeeping, not narrative structure.**

## Primary flow

```text
filmmaker
   ↓
external harness
   ↓
Salai machine interface
   ↓
SalaiProjectService
   ↓
typed canonical changes
   ↓
@salai/script-model validation
   ↓
one canonical publish
   ↓
Narrative IR / Workspace
   ↓
Narrative Lenses
```

The harness conversation is an interaction surface, not Salai project storage.

## External harness boundary

The harness owns:

- model/provider access and authentication;
- conversation/session history;
- planning/reasoning/tool-loop behavior;
- model-specific context handling.

Salai does not embed those concerns in 0C.

A fresh harness session must be able to continue from current Salai state by using the machine interface. Salai does not require chat history to reconstruct the project.

## Machine interface

0C uses one CLI-oriented external interface, not CLI + MCP or multiple parallel protocols.

The CLI provides a local, self-describing discovery command:

```text
salai tools
```

`tools` returns machine-readable metadata for the implemented CLI capabilities. It does not require the live bridge and is not a fourth project/domain command.

Current live-project commands are:

```text
salai context
salai create-story <{sectionTitle?, beats:[...]}>
salai apply <NarrativeOperation[]>
```

`context` returns only the current task-relevant project data needed to reason about the story. `create-story` is the narrow script-first helper introduced because Salai must allocate canonical IDs/placement for initial creation. `apply` delegates to `SalaiProjectService` and the existing atomic operation path.

Agents must discover the implemented tool set rather than assume commands from prompt memory. The detailed required usage cycle—discover, read context, mutate atomically, inspect feedback, and re-read context—is defined in [`agent-usage.md`](agent-usage.md).

The machine interface:

- uses the same canonical project as Narrative Lenses;
- does not edit persistence directly;
- does not maintain a second story/session model;
- returns machine-readable results/errors;
- contains no model/provider-specific concepts;
- keeps discovery metadata aligned with implemented CLI commands.

A Skill or repository agent instruction may teach a harness the workflow and Salai semantics. It is instructions only; it does not implement capability or state.

## Canonical operation boundary

Reuse `@salai/script-model` first:

- `applyOperation()` for one operation;
- `applyOperations()` for an atomic `NarrativeOperation[]` batch.

Start with public operations where stable existing IDs are enough.

Introduce one higher-level Salai command only when an implemented scenario needs Salai-owned resolution such as:

- allocating canonical IDs;
- resolving relative placement;
- resolving a user-facing reference;
- avoiding brittle raw `ParentRef`/array-index manufacture.

Such a command compiles immediately to public `NarrativeOperation[]` and does not become another persistent domain API.

## Grouped changes and trust

One harness request may produce several operations but should behave as one understandable creative action:

- apply as one atomic batch;
- show a concise action summary in Salai;
- retain the pre-action project/Workspace snapshots;
- allow immediate one-step revert while it remains the latest project/Workspace change;
- invalidate that revert after any later machine or direct-lens edit;
- publish no partial state on failure.

Do not build a general history/event-sourcing system for 0C.

The current immediate Revert is a Salai UI capability; agents must not assume a CLI `revert` command unless `salai tools` reports one.

## Script-first behavior

Prove one representative rough-paragraph → usable story flow and one ordinary revision through the external harness.

The filmmaker should not manually create/parent Beats or Cues for this scenario. Existing IDs should be preserved during revision when the narrative object remains conceptually the same.

## Source-backed behavior

0C uses fixture-backed source descriptors rather than real transcription/vision.

Required invariant:

> **Recorded evidence remains recorded evidence.**

The harness may arrange/select source-backed material and Salai may apply explicit canonical trimming, but SourceExcerpt wording/ranges must not silently become editable authored copy.

## Narrative Lens continuity

0C must prove:

1. a harness mutation is immediately visible in the existing lenses through canonical state;
2. one meaningful direct-lens edit changes the same project/Workspace state;
3. the next harness `context` call sees that direct edit without export/import or chat-memory synchronization;
4. Workspace-only intent remains Workspace-only.

## Local bridge

The current React prototype owns the live project in the browser. A small local request/response bridge is therefore allowed solely to let an external CLI reach that live `SalaiProjectService`.

The bridge must not:

- store another narrative project;
- own harness/model sessions;
- become a generic backend;
- introduce distributed-state infrastructure.

One local browser client and serialized requests are sufficient for 0C. The current browser client opts into the bridge with the `?bridge=1` URL parameter.

## Resolve boundary

Harness instructions change canonical Salai state first. Resolve remains downstream behind explicit Salai materialization/adapter behavior.

## Required 0C scope

- existing `SalaiProjectService` + atomic batch boundary;
- one CLI-oriented machine interface with local self-description;
- smallest local bridge needed for the current browser prototype;
- one script-first vertical slice;
- one fixture-backed source vertical slice;
- grouped summary + immediate revert;
- one harness ↔ existing-lens round trip;
- human comparison with 0B.

Not required:

- embedded model/provider SDK;
- Salai-owned OAuth/API-key handling;
- embedded chat/agent runtime;
- MCP in addition to CLI;
- general agent/provider/plugin framework;
- production graph/Coverage Lens;
- real transcription/vision;
- Resolve execution;
- durable chat history;
- CRDT/event sourcing;
- canonical rich-text document.

## Validation target

0C passes only if representative tasks require materially less incidental interaction than 0B and at least one existing Narrative Lens remains useful enough that the filmmaker voluntarily enters it for structural insight or direct manipulation.

Executable tasks and status live only in [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).
