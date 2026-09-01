# Spike 0C — External-Agent Authoring + Narrative Lenses Implementation Plan

## Status

**Complete / pass. Historical execution record.**

Spike 0C is closed. Human validation was completed using Codex as the external harness; the integration operated correctly and demonstrated the convenience of agent-mediated structural manipulation over the live canonical Salai project.

The completed assessment is [`spike-0c-assessment.md`](spike-0c-assessment.md).

The active execution tracker is now [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).

Current accepted runtime decision remains [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md).

## Goal that was tested

Validate that a filmmaker can express ordinary story intent through an existing external agent harness with materially less structural bookkeeping than 0B, while Salai keeps one valid canonical project shared with direct human UI.

## Hard boundaries retained from the spike

- `@salai/script-model` is the only canonical narrative model.
- `SalaiProjectService` is the human/machine application boundary.
- `applyOperations()` is the canonical multi-operation mutation primitive.
- The external harness owns model choice, authentication, sessions, history, planning, and tool-loop behavior.
- Salai contains no required model/provider SDK, API-key/OAuth handling, model router, chat runtime, or embedded agent session.
- 0C validated one machine interface first: CLI-oriented, not CLI + MCP.
- The machine interface reaches the same live project service used by human UI; it does not edit serialized storage or maintain another project model.
- CI remains deterministic and provider-independent.

Principle validated by 0C:

> **Invest in the project interface; let the harness own the agent.**

## Completed merge sequence

```text
0C.0  Project service + atomic batch boundary          [complete]
  ↓
0C.1  External-harness machine interface              [complete]
  ↓
0C.2  Script-first creation + revision                [complete]
  ↓
0C.3  Grouped action + immediate revert               [complete]
  ↓
0C.4  Source-backed vertical slice                    [complete]
  ↓
0C.5  Harness ↔ Narrative Lens round trip             [complete]
  ↓
0C.6  Human validation using Codex                    [complete]
  ↓
0C.GATE                                               [pass]
```

## Implemented result

### 0C.0 — Project service + canonical batch boundary

Completed:

- minimum `SalaiProjectService` contract over existing state;
- atomic `dispatchNarrativeBatch()` using existing `applyOperations()`;
- preserved single-operation direct-UI path;
- one-publish success and no-publish failure behavior;
- task-relevant current project context.

### 0C.1 — External-harness machine interface

Completed:

- `salai tools` self-description;
- `context` for current task-relevant project state;
- `apply` for canonical `NarrativeOperation[]` batches;
- narrow script-first `create-story` helper where Salai-owned ID/placement resolution was required;
- local request/response bridge from CLI to the browser-owned live project;
- deterministic machine-readable success/error behavior;
- shared live-state proof between CLI and human UI.

### 0C.2 — Script-first vertical slice

Completed:

- rough paragraph → canonical story flow;
- ordinary-language revision while preserving stable IDs where meaning remained the same;
- deterministic creation/revision tests;
- real CLI-process smoke coverage.

### 0C.3 — Grouped action + immediate revert

Completed:

- one successful machine batch represented as one user-understandable action;
- pre-action Narrative IR/Workspace snapshots;
- immediate Revert;
- invalidation after later canonical or Workspace edits;
- exact-revert and failed-batch tests.

### 0C.4 — Source-backed vertical slice

Completed:

- deterministic source fixture through machine context;
- canonical MediaSegment/SourceExcerpt identity without a second transient source model;
- source-backed sequence construction;
- wording/range/media-identity preservation;
- simple missing/unsupported-material reasoning from current relationships;
- deterministic source-preservation and CLI smoke tests.

### 0C.5 — Harness ↔ direct UI round trip

Completed:

- machine changes visible through canonical state;
- direct human edit visible to the next machine `context` read;
- Workspace-only Story Wall semantics preserved;
- no export/import or conversation-memory synchronization model.

### 0C.6 — Human validation

Completed with Codex as the external harness.

Observed product evidence:

- the integration worked correctly against the live Salai project;
- keeping an agent in the loop was materially more convenient than routine direct model management from 0B;
- Salai remained the project source of truth rather than relying on Codex conversation history;
- the external-harness boundary was usable in practice, not only in deterministic tests.

The repository does not invent per-scenario timing/action counts that were not recorded during the run. The evidence-backed product conclusion is documented in [`spike-0c-assessment.md`](spike-0c-assessment.md).

## Final gate result

**PASS.**

0C established enough evidence to carry the following decisions forward:

- external harnesses can operate Salai through one narrow machine interface;
- Salai should not own a general model/provider/session runtime merely to enable agent-mediated authoring;
- agent-mediated authoring materially reduces the interaction burden exposed by 0B;
- all machine canonical changes still pass through Salai-owned project semantics;
- source-backed material remains source-backed;
- direct and machine interaction can share one live canonical project;
- harness/model history is not required to reconstruct Salai project state.

The next active product risk is no longer agent viability. It is the native structural-editorial environment defined in [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).
