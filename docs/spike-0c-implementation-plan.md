# Spike 0C — Agent-Mediated Authoring + Narrative Lenses Implementation Plan

## Status

Canonical execution tracker for **Spike 0C — Agent-Mediated Authoring + Narrative Lenses**.

This file is the only source for 0C task numbering, implementation order, completion status, and exit evidence.

Contracts:

- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — low-friction authoring/model contract;
- [`narrative-lenses.md`](narrative-lenses.md) — structured-lens creative contract;
- [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) — interaction architecture proposal;
- [`adr/0007-project-service-is-the-human-machine-boundary.md`](adr/0007-project-service-is-the-human-machine-boundary.md) — accepted human/machine project boundary.

## Spike goal

Validate the smallest interaction model that can answer two questions:

1. can ordinary script-first and footage-first intentions be expressed with materially less structural bookkeeping than 0B; and
2. does at least one existing Narrative Lens provide useful structural insight or direct manipulation after model-mediated normalization?

The spike is not a feature-complete agent architecture, provider platform, or media application.

## Hard implementation boundaries

0C optimizes for **time to a public demo behind one stable Salai domain boundary**.

The implementation must preserve these rules:

- `@salai/script-model` remains the only canonical narrative model;
- `SalaiProjectService` is the application boundary used by human UI and machine/model integrations;
- `applyOperations()` remains the canonical multi-operation mutation primitive;
- Narrative Lenses and model-mediated authoring operate on the same project/Workspace state;
- the public demo remains the existing static GitHub Pages application with no Salai-operated backend;
- the live model path uses one browser-safe, user-scoped adapter and embeds no reusable developer secret;
- provider authentication, model sessions, chat history, intermediate reasoning, and tool traces are non-canonical;
- CI uses deterministic model results and never depends on model/provider availability;
- external CLI/MCP/Skill integration is not part of the 0C gate.

Principle:

> **Invest in the project boundary; keep model/runtime infrastructure replaceable.**

## Existing implementation baseline

Reuse the code that already exists rather than creating a parallel application stack.

Current relevant code:

- `packages/script-model/` — canonical Narrative IR, operations, validation, fixtures, `applyOperation()`, and `applyOperations()`;
- `packages/spike-demo/src/controller.tsx` — current application state, publish/subscribe boundary, single-operation dispatch, selection and Workspace synchronization;
- `packages/spike-demo/src/controller.test.ts` — controller-level deterministic tests;
- `packages/spike-demo/src/cross-surface.test.ts` — cross-lens propagation tests;
- `packages/spike-demo/src/App.tsx` — current validation shell and lens navigation;
- `Outline.tsx`, `StoryWall.tsx`, `AVScript.tsx`, `PaperEdit.tsx` — existing Narrative Lenses;
- `fixtures.ts` and current model fixtures — deterministic validation material;
- GitHub Pages workflow — existing hosted validation surface.

`SalaiController` already has `getSnapshot()` and `subscribe()`. Prefer evolving it to satisfy the project-service contract rather than introducing another stateful wrapper unless implementation evidence requires one.

## State ownership

```text
model/provider state
session / auth / history / intermediate output
        ↓ disposable

Salai interaction state
current request / selected context / proposed result
        ↓ transient

Salai project state
Narrative IR / Workspace / source relationships
        ↓ canonical
```

A fresh model interaction must be able to continue from current Salai state without reconstructing work from chat history.

## Delivery rules

- Each implementation PR should leave `main` releasable and CI green.
- Finish and merge one delivery slice before beginning the next.
- Do not add abstractions needed only by a hypothetical later provider or external-agent client.
- Do not add a project revision counter unless a real stale-write case appears.
- Do not add a higher-level authoring command until an implemented scenario demonstrates why public `NarrativeOperation[]` is insufficient.
- Update checkboxes only for behavior actually merged and verified.
- Human-validation checkboxes remain open until the human test is run.

## Merge sequence

```text
PR 1  0C.0 Project service + atomic batch boundary
  ↓
PR 2  0C.1 Deterministic model contract + authoring shell
  ↓
PR 3  0C.1 Live backendless browser adapter
  ↓
PR 4  0C.2 Script-first creation + revision
  ↓
PR 5  0C.3 Grouped action + immediate revert
  ↓
PR 6  0C.4 Source-backed vertical slice
  ↓
PR 7  0C.5 Model ↔ Narrative Lens round trip
  ↓
PR 8  0C.6 Human validation + assessment
  ↓
0C.GATE
```

The PR boundaries are intentional. In particular, provider integration must not block the canonical project-service work, and source/media work must not begin before the script-first interaction is usable.

---

# 0C.0 — Project service + canonical batch boundary

## PR 1 — Project service and atomic batches

### Goal

Create one application boundary that both the existing lenses and later model integration can use, without introducing new project state.

### Expected code touchpoints

- `packages/spike-demo/src/controller.tsx`;
- `packages/spike-demo/src/controller.test.ts`;
- optionally a small `project-service.ts` containing types/helpers only if keeping the contract in `controller.tsx` becomes unclear.

### Tasks

- [x] **0C.0.1 — Define the minimum `SalaiProjectService` contract over existing state.**
  - current snapshot/context read;
  - canonical batch mutation;
  - project/Workspace subscription;
  - no persistence, network, provider, or agent concepts.

- [x] **0C.0.2 — Add `dispatchNarrativeBatch(operations)` using existing `applyOperations()`.**
  - evaluate the full batch against the current immutable project;
  - publish once only after the full batch succeeds;
  - publish no intermediate canonical state;
  - preserve existing selection-clearing rules when selected IDs are removed;
  - synchronize Story Wall Workspace membership once from the final result.

- [x] **0C.0.3 — Preserve the existing single-operation path.**
  - `dispatchNarrative()` may delegate to the batch path with one operation if this reduces duplication;
  - direct lens behavior must remain unchanged.

- [x] **0C.0.4 — Add deterministic atomicity tests.**
  - valid multi-operation batch produces one final project;
  - subscriber observes one successful publish for the batch;
  - an invalid later operation leaves the live project/Workspace unchanged;
  - warnings, relationship effects, changed IDs, created IDs, and removed IDs reach feedback;
  - removed selection is cleared correctly;
  - Story Wall membership is synchronized for batched create/remove operations.

- [x] **0C.0.5 — Define a task-relevant context read for model-mediated work.**
  - include the canonical project or smallest task-relevant projection needed by the first scenario;
  - include Workspace/source data only when the request needs it;
  - exclude arbitrary presentation state and provider/session state;
  - active lens identity may be supplied only when it materially helps interpret the request.

- [x] **0C.0.6 — Do not add project revisions yet.**
  - browser-local serialized mutation is sufficient until a stale-write case is demonstrated;
  - if that case appears later, add `expectedRevision` as a small extension rather than introducing CRDT/event-sourcing infrastructure.

### Gate

- [x] **0C.0.GATE — Existing lenses and a machine-produced batch can use the same Salai-owned state/mutation boundary, with atomic application and no second project model.**

---

# 0C.1 — Backendless authoring shell

0C.1 is split into two PRs so the product interaction and deterministic contract can be tested before any live provider dependency is introduced.

## PR 2 — Deterministic model contract + low-friction shell

### Goal

Define the smallest Salai-owned request/result contract and make the end-to-end UI work with deterministic results.

### Expected code touchpoints

Create small focused modules under `packages/spike-demo/src/`, for example:

```text
authoring/
  contract.ts
  context.ts
  deterministic-adapter.ts
  result.ts
  AuthoringSurface.tsx
  authoring.test.ts
```

Names may change; keep the module count proportional to actual code.

### Tasks

- [ ] **0C.1.1 — Define one Salai-owned model turn contract.**

Conceptually:

```ts
type AuthoringRequest = {
  instruction: string;
  context: AuthoringProjectContext;
  attachments?: Attachment[];
};

type AuthoringResult = {
  summary: string;
  operations?: NarrativeOperation[];
  commands?: AuthoringCommand[];
  answer?: string;
};
```

The exact fields should be smaller if the first scenario needs less.

- [ ] **0C.1.2 — Add deterministic adapter/results for CI.**
  - deterministic inputs produce deterministic structured results;
  - no network/login/model call in unit tests;
  - the mock uses the same Salai-owned result shape as the live adapter.

- [ ] **0C.1.3 — Add result validation before canonical mutation.**
  - reject malformed result shapes;
  - resolve any scenario-specific commands before mutation;
  - final canonical mutations go through `SalaiProjectService`;
  - invalid results/batches never partially publish state.

- [ ] **0C.1.4 — Add one low-friction authoring surface.**
  - plain textarea/minimal editor;
  - explicit Process/Apply action;
  - idle/running/error/success state;
  - concise result/change summary;
  - immediate access to the existing Narrative Lenses;
  - update the old 0B-facing shell copy to 0C language.

- [ ] **0C.1.5 — Keep working text non-canonical.**
  - resetting/changing the working text does not mutate Narrative IR;
  - no rich-text document model;
  - no durable chat transcript.

### Gate

- [ ] **0C.1A.GATE — The complete authoring interaction works deterministically in-browser: input → structured result → validation → project-service batch → synchronized lenses.**

## PR 3 — Live backendless browser adapter

### Goal

Replace the deterministic adapter at runtime with one real hosted-model path while keeping the static deployment architecture.

### Provider feasibility gate

Before integrating a provider, verify all of the following with the smallest standalone call:

- it runs from the deployed GitHub Pages origin;
- user authentication/usage is browser-safe and user-scoped;
- no reusable Salai developer secret is shipped in JavaScript;
- the model can return reliably parseable structured data or tool/function arguments sufficient for the Salai result contract;
- CORS/browser restrictions do not require a Salai proxy/backend.

If a candidate fails any of these, switch adapter/provider rather than changing Salai's project architecture.

### Tasks

- [ ] **0C.1.6 — Implement exactly one live browser model adapter.**
  - provider-specific SDK/types stay in this adapter;
  - convert Salai request → provider request;
  - convert provider result → Salai `AuthoringResult`;
  - do not expose provider objects to controller/lens code.

- [ ] **0C.1.7 — Send only task-relevant project context.**
  - no automatic raw-media upload;
  - no whole-project dump if the task can be answered from a smaller projection;
  - attachment handles do not imply permission to upload underlying media.

- [ ] **0C.1.8 — Handle auth/provider failure as interaction state, not project state.**
  - clear retryable error;
  - current project remains untouched;
  - deterministic adapter remains usable for CI/dev tests.

- [ ] **0C.1.9 — Smoke-test the deployed Pages build.**
  - authenticate as an ordinary user;
  - submit one real instruction;
  - receive a structured result;
  - apply one valid canonical change;
  - reload/fresh interaction can continue from current in-memory project state during the same app session without relying on chat history.

### Gate

- [ ] **0C.1.GATE — The public static prototype can execute one real model-mediated canonical change with no Salai backend and no embedded developer secret.**

---

# 0C.2 — Script-first vertical slice

## PR 4 — Rough paragraph → story → natural-language revision

### Goal

Prove the main low-friction hypothesis with one complete script-first workflow before generalizing model capabilities.

### Tasks

- [ ] **0C.2.1 — Choose one fixed representative rough-paragraph scenario.**
  - keep it in a deterministic fixture/test input;
  - define the minimum acceptable resulting structure before implementation.

- [ ] **0C.2.2 — Create a usable canonical story from the paragraph in one action.**
  - creator does not manually create/parent Beats or Cues;
  - create only structure required to express the scenario;
  - unresolved notes may remain outside canonical state.

- [ ] **0C.2.3 — Introduce the smallest creation command/resolver only if raw operations force the model to manufacture Salai-owned IDs or brittle indices.**
  - prefer public operations where existing stable IDs are already available;
  - if creation needs Salai-owned IDs, allow placeholders/relative references or a tiny scenario-specific command;
  - allocate real IDs and resolve placement inside Salai;
  - compile immediately to `NarrativeOperation[]`;
  - do not create a generic second mutation language.

- [ ] **0C.2.4 — Support one natural-language revision over the created story.**
  - representative revision: move proof earlier, tighten one Beat, or target a shorter runtime;
  - preserve existing IDs where the narrative object remains conceptually the same.

- [ ] **0C.2.5 — Add deterministic script-first tests.**
  - creation result validates;
  - revision uses current canonical context;
  - identity is preserved where expected;
  - malformed creation/revision results do not partially publish.

- [ ] **0C.2.6 — Manually smoke-test the same scenario with the live adapter.**
  - assess whether output is usable without manual structural repair;
  - record model-output failures as evidence, not as reasons to generalize infrastructure prematurely.

### Gate

- [ ] **0C.2.GATE — A representative story can be created and revised from ordinary language with substantially less structural bookkeeping than 0B.**

---

# 0C.3 — Grouped action, trust, and immediate revert

## PR 5 — One creative action + safe one-step revert

### Goal

Make model-mediated changes understandable and recoverable without building a general history system.

### Minimum action state

```text
ModelAction
- id
- input/intent
- changeSummary
- operations
- beforeProject
- beforeWorkspace
```

Keep this in memory.

### Tasks

- [ ] **0C.3.1 — Record one successful model-mediated batch as the current revertible action.**
  - capture project/Workspace snapshots immediately before application;
  - store the user-facing summary and applied operations.

- [ ] **0C.3.2 — Expose immediate Revert in the authoring surface.**
  - restore the stored project/Workspace snapshots;
  - clear the current action after revert;
  - keep selection in a valid state.

- [ ] **0C.3.3 — Invalidate revert on every subsequent canonical or Workspace edit.**
  - another model action;
  - direct Outline/AV/Paper narrative edit;
  - Story Wall Workspace move/parking edit;
  - fixture reset/change.

- [ ] **0C.3.4 — Add deterministic trust/revert tests.**
  - successful multi-operation action reverts exactly;
  - later direct lens edit disables old revert;
  - later Workspace-only edit disables old revert;
  - failed model batch creates no revert action.

- [ ] **0C.3.5 — Keep clarification outside the mutation mechanism.**
  - a result that asks a focused creative question applies no operations;
  - clearly requested reversible local changes may apply as one batch;
  - no per-operation approval UI.

### Gate

- [ ] **0C.3.GATE — One model request behaves as one understandable, immediately revertible creative action without risking later human edits.**

---

# 0C.4 — Footage/source-backed vertical slice

## PR 6 — Fixture-backed source material

### Goal

Validate source semantics without pulling transcription, vision, upload, or production-graph infrastructure into 0C.

### Attachment shape

Use only fields required by the scenario:

```text
Attachment
- id
- displayName
- mediaType
- optional duration
- optional transcript/description
- optional fixture MediaSegment/source-range reference
```

### Tasks

- [ ] **0C.4.1 — Add one deterministic source/interview fixture presented as attachments.**

- [ ] **0C.4.2 — Keep attachment identity separate from canonical source identity.**
  - attachment is input/context;
  - create/link canonical MediaSegment/SourceExcerpt identity explicitly when applying the result.

- [ ] **0C.4.3 — Build one short source-backed sequence from natural-language intent + attachment context.**
  - creator does not manually wire each source object to Beats/Cues.

- [ ] **0C.4.4 — Preserve source evidence invariants.**
  - `SourceExcerpt` wording is not silently rewritten;
  - source ranges/media identity remain attached;
  - authored bridge material remains authored;
  - trimming/selecting source material uses existing canonical semantics.

- [ ] **0C.4.5 — Answer one missing/unsupported-material question from mocked relationships.**
  - simple answer/result list is sufficient;
  - do not build Coverage Lens or production graph.

- [ ] **0C.4.6 — Add deterministic source-preservation tests and one live smoke test.**

### Gate

- [ ] **0C.4.GATE — Source-backed material can enter and be rearranged in the story without manual wiring and without losing provenance.**

---

# 0C.5 — Model ↔ existing Narrative Lens round trip

## PR 7 — Shared-state round trip

### Goal

Prove that model-mediated authoring and direct structured work are genuinely two interaction modes over one project.

### Tasks

- [ ] **0C.5.1 — Regression-test that model-mediated changes appear in every existing lens through canonical state.**
  - no per-lens synchronization code.

- [ ] **0C.5.2 — Choose one meaningful direct-lens edit after model normalization.**
  - use the lens best suited to the scenario;
  - edit must continue through the same project/Workspace boundary.

- [ ] **0C.5.3 — Build the next model context from current project state after that direct edit.**
  - no export/import;
  - no conversation-memory dependency;
  - old model-action revert is already invalidated by the direct edit.

- [ ] **0C.5.4 — Preserve Workspace-only semantics.**
  - spatial Story Wall movement/parking remains Workspace-only;
  - semantic reorder remains a Narrative IR operation.

- [ ] **0C.5.5 — Add deterministic round-trip tests.**
  - model batch → Outline/Story Wall/AV/Paper projections;
  - direct lens edit → next authoring context;
  - source evidence survives the loop;
  - direct edit invalidates previous model revert.

### Gate

- [ ] **0C.5.GATE — Direct lens work and model-mediated work remain coherent with no shadow state, synchronization document, or chat-memory requirement.**

---

# 0C.6 — Human validation

## PR 8 — Validation evidence and assessment

Do not broaden implementation before running these scenarios.

### Required scenarios

- [ ] **0C.6.1 — Blank-page/rough-paragraph script-first creation.**
- [ ] **0C.6.2 — Natural-language revision that would have required several 0B interactions.**
- [ ] **0C.6.3 — Short fixture-backed source/interview task.**
- [ ] **0C.6.4 — Incorrect model interpretation → immediate revert.**
- [ ] **0C.6.5 — Model-normalized project → voluntary Narrative Lens → direct edit → follow-up model request.**

### Record interaction-compression evidence

- explicit user actions/inputs;
- clarifications;
- structural concepts the user had to manage explicitly;
- hesitation/flow;
- whether summary + immediate revert were sufficient for trust;
- whether authentication/provider interaction materially interrupted creative work.

### Record structural-insight evidence

- which lens, if any, was entered voluntarily;
- what property became easier to perceive there;
- whether the creator changed anything directly in the lens;
- whether the next model request correctly reflected that edit.

### Deliverable

- [ ] **0C.6.6 — Write the Spike 0C assessment with pass/fail evidence and only evidence-backed next-step recommendations.**

### Gate

- [ ] **0C.6.GATE — Human evidence shows materially lower routine interaction than 0B and at least one existing lens remains voluntarily useful.**

---

# Optional external-agent proof — non-gating

Do this only after the core hosted flow works and only if it answers a concrete next-step question.

The smallest acceptable proof exposes `SalaiProjectService` through **one** machine interface:

- CLI **or** MCP, not both;
- one context/read operation;
- one validated canonical mutation;
- optional Skill/instructions for a generic agent;
- same project state as the UI/lenses.

Do not add an agent harness, model authentication, provider runtime, or separate project storage to this adapter. This proof is not part of `0C.GATE`.

---

# 0C.GATE — Spike completion

Spike 0C passes only when all of these are true:

- [ ] script-first authoring is materially lower-friction than routine 0B direct structure management;
- [ ] the public GitHub Pages prototype can use a real hosted model without a Salai-operated backend or embedded developer secret;
- [ ] all model-mediated canonical changes pass through `SalaiProjectService` and `applyOperations()`;
- [ ] invalid model results/batches publish no partial canonical state;
- [ ] source evidence remains source evidence;
- [ ] one grouped model action is immediately revertible without erasing later edits;
- [ ] existing Narrative Lenses remain synchronized through canonical state;
- [ ] at least one lens is voluntarily useful for structural insight or direct manipulation;
- [ ] a direct lens edit is visible to the next model request from current Salai project context;
- [ ] provider/model/session history is not required to reconstruct the project;
- [ ] no unvalidated backend, external-agent bridge, new lens, production graph, distributed-state system, or general provider framework was added;
- [ ] CI is green.

If the gate passes, choose the next production step from the evidence. Do not assume that external-agent integration, desktop packaging, durable persistence, production graph, or Resolve automation must all begin together.