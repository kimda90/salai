# Salai — External-Agent Authoring

## Status

**Validated interaction contract. Spike 0C complete/pass.**

Human validation using Codex confirmed that an external harness can operate the live Salai project correctly and materially reduce routine structural bookkeeping while Salai remains the canonical source of truth.

Current runtime decision: [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md).

Current product/editorial direction: [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md).

The required external-agent operating procedure is defined separately in [`agent-usage.md`](agent-usage.md).

## Validated product behavior

A filmmaker can express ordinary story intent through an existing external agent harness while Salai handles structural bookkeeping, preserves canonical validity/source provenance, and keeps the result coherent with direct UI editing.

> **Express intent naturally; Salai structures it for production and structural editorial.**

> **Hide structural bookkeeping, not narrative structure.**

## Validated flow

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
human UI / semantic projections
```

The harness conversation is an interaction surface, not Salai project storage.

## External harness boundary

The harness owns:

- model/provider access and authentication;
- conversation/session history;
- planning/reasoning/tool-loop behavior;
- model-specific context handling.

Salai does not embed those concerns as a requirement of this architecture.

A fresh harness session must be able to continue from current Salai state by using the machine interface. Salai does not require chat history to reconstruct the project.

Spike 0C human validation used Codex successfully. Codex is evidence for this boundary, not a mandatory product dependency.

## Machine interface

The validated first interface is CLI-oriented rather than several parallel protocols.

The CLI provides local self-description:

```text
salai tools
```

and live-project commands including:

```text
salai context
salai create-story <{sectionTitle?, beats:[...]}>
salai apply <NarrativeOperation[]>
```

Agents must discover the implemented tool set rather than assume commands from prompt memory. The detailed required usage cycle—discover, read context, mutate atomically, inspect feedback, and re-read context—is defined in [`agent-usage.md`](agent-usage.md).

The machine interface:

- uses the same canonical project as the human UI;
- does not edit persistence directly;
- does not maintain a second story/session model;
- returns machine-readable results/errors;
- contains no model/provider-specific concepts;
- keeps discovery metadata aligned with implemented CLI commands.

A Skill or repository agent instruction may teach a harness the workflow and Salai semantics. It is instructions only; it does not implement capability or state.

Add MCP or another machine protocol only when a concrete integration demonstrates a need. Spike 0C proved that usefulness does not require maintaining CLI + MCP + embedded provider APIs simultaneously.

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

The same rule carries into structural editorial: an external harness should request Salai semantic changes, not manipulate third-party timeline/rendering engine state.

## Grouped changes and trust

One harness request may produce several operations but should behave as one understandable creative action:

- apply as one atomic batch;
- show a concise action summary in Salai;
- retain the pre-action project/Workspace snapshots;
- allow immediate one-step revert while it remains the latest project/Workspace change;
- invalidate that revert after any later machine or direct edit;
- publish no partial state on failure.

Do not turn this into a general event-sourcing system without a later versioning/recovery requirement.

## Source-backed behavior

Recorded evidence remains recorded evidence.

The harness may arrange/select source-backed material and Salai may apply explicit canonical trimming, but SourceExcerpt wording/ranges must not silently become editable authored copy.

This invariant now also applies to the 0D semantic timeline and playback path.

## Human UI continuity

External-agent changes and direct UI work operate on the same canonical project.

Requirements carried forward:

1. a harness mutation is immediately visible in human projections through canonical state;
2. one meaningful direct edit changes the same project/Workspace state;
3. the next harness `context` read sees that direct edit without export/import or chat-memory synchronization;
4. Workspace-only changes remain Workspace-only;
5. third-party timeline/rendering state is never used as a hidden synchronization channel.

## Local bridge

The current React prototype owns the live project in the browser. A small local request/response bridge therefore lets an external CLI reach that live `SalaiProjectService`.

The bridge must not:

- store another narrative project;
- own harness/model sessions;
- become a generic backend;
- introduce distributed-state infrastructure.

One local browser client and serialized requests are sufficient for current spikes.

## Structural-editorial relationship

Spike 0D reuses the validated agent boundary rather than reopening it.

```text
external harness
      ↓
SalaiProjectService
      ↓
canonical story/source change
      ↓
semantic timeline projection
      ↓
playback
```

A user may ask the harness for a timing/reorder/source change, watch the result in Salai, make a direct temporal edit, and then continue with the harness. All coherence comes from shared Salai state.

## Validation record

The detailed completed result is in [`spike-0c-assessment.md`](spike-0c-assessment.md).

The active product risk has moved to [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md): whether the same semantic model remains useful in a playable structural editorial environment.
