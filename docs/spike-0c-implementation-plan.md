# Spike 0C — Agent-Mediated Authoring + Narrative Lenses Implementation Plan

## Status

Canonical execution tracker for **Spike 0C — Agent-Mediated Authoring + Narrative Lenses**.

This file is the only source for 0C task numbering and completion status.

Contracts:

- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — low-friction authoring/model contract;
- [`narrative-lenses.md`](narrative-lenses.md) — structured-lens creative contract;
- [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) — interaction architecture proposal;
- [`adr/0007-project-service-is-the-human-machine-boundary.md`](adr/0007-project-service-is-the-human-machine-boundary.md) — accepted human/machine project boundary.

## Spike goal

Validate the smallest dual interaction model that can answer two questions:

1. can ordinary script-first and footage-first intentions be expressed with materially less structural bookkeeping than 0B; and
2. does at least one existing Narrative Lens provide useful structural insight/direct manipulation after model-mediated normalization?

The spike is **not** a feature-complete agent architecture or media application.

## Implementation strategy

Optimize for **time to a public demo behind a stable Salai domain boundary**.

For 0C:

- `SalaiProjectService` is the stable application boundary over current Narrative IR/Workspace state;
- the existing `applyOperations()` API remains the canonical batch mutation primitive;
- Narrative Lenses and the embedded model flow are clients of the same project service;
- the real demo stays in the browser/GitHub Pages application with no Salai-operated backend;
- use one browser-safe, user-scoped hosted-model adapter and no developer secret in the static bundle;
- deterministic structured model-result fixtures/mocks drive CI;
- provider/model/session/authentication state is disposable adapter state, not Salai project state;
- external-agent CLI/MCP/Skill integration is optional follow-up work and does not block the 0C gate.

Principle:

> **Invest in the project boundary; keep model/runtime infrastructure replaceable.**

## Reuse baseline

0C starts from capabilities that already exist:

- `@salai/script-model` is canonical narrative state;
- `applyOperation()` handles one typed canonical operation;
- `applyOperations()` applies a `NarrativeOperation[]` against immutable input and returns one final `OperationResult`;
- the existing `SalaiController` publishes canonical project/Workspace state;
- Story Wall, Outline, AV Script, and Paper/Radio already read/write the same project;
- deterministic fixtures cover script-first, interview/corporate, and footage-first material;
- the React/Vite prototype and GitHub Pages build already provide the validation surface.

**Do not rebuild model/controller behavior behind a second agent-specific state or operation system.**

## State ownership

Keep these layers explicit:

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

A fresh model session must be able to continue from current Salai state.

## Tracker rules

- `[ ]` — not complete.
- `[x]` — implemented, merged, and verified.
- Human criteria stay unchecked until human evidence exists.
- Each implementation PR updates this tracker only for evidence it actually produces.

## Non-goals

Keep these out of 0C unless the smallest mock is required for a validation scenario:

- Salai-operated backend;
- local agent host/process manager;
- external CLI/MCP/Skill integration;
- production Electron shell or durable desktop packaging;
- durable persistence;
- real Resolve/CutMaster execution;
- production graph implementation;
- a new Coverage Lens;
- full transcription/media analysis;
- OpenTimelineIO/OpenAssetIO integration;
- GenAI media execution;
- vector database;
- canonical rich-text document model;
- generic infinite canvas / graph editor;
- general multi-agent framework;
- general multi-provider/model-router framework;
- Salai-owned OAuth/token refresh or API-key vault;
- durable chat/session history;
- polished token-by-token chatbot streaming;
- autonomous background-agent runtime;
- CRDT/event-sourcing infrastructure.

# Execution order

```text
0C.0 Project service + canonical batch boundary
   ↓
0C.1 Backendless low-friction authoring shell
   ↓
0C.2 Script-first vertical slice
   ↓
0C.3 Grouped change + immediate revert
   ↓
0C.4 Footage/source vertical slice
   ↓
0C.5 Model ↔ existing-lens round trip
   ↓
0C.6 Human validation
   ↓
0C.GATE
```

---

# 0C.0 — Project service + canonical batch boundary

Establish one application boundary before wiring a real model.

- [ ] **0C.0.1 — Keep `@salai/script-model` as the only canonical narrative model.**
  - no AI-owned project schema;
  - no canonical chat transcript;
  - no lens-owned narrative copies.

- [ ] **0C.0.2 — Introduce the minimum `SalaiProjectService` facade.**
  - expose task-relevant context reads;
  - expose canonical batch mutation;
  - expose a local project/Workspace change subscription or equivalent notification;
  - implement it over existing controller/model state rather than duplicating state.

- [ ] **0C.0.3 — Add controller/project-service batch dispatch using existing `applyOperations()`.**
  - call `applyOperations(currentProject, operations)`;
  - publish project/Workspace once after the full call succeeds;
  - on error, publish no partial canonical state;
  - preserve selection/Workspace synchronization using the same rules as single-operation dispatch.

- [ ] **0C.0.4 — Add deterministic batch-boundary tests.**
  - valid multi-operation batch publishes one final state;
  - invalid later operation leaves live project state unchanged;
  - relationship effects/warnings/created/removed IDs reach the application boundary.

- [ ] **0C.0.5 — Define the smallest model-facing project context needed by the first scenario.**
  - current canonical project or task-relevant projection;
  - working input;
  - optional attachment handles;
  - active lens identity only when relevant;
  - no arbitrary UI state or provider session state.

- [ ] **0C.0.6 — Start with public `NarrativeOperation[]` where sufficient.**
  - revisions that can reference existing stable IDs use the public operation vocabulary directly;
  - no parallel persistent authoring API merely because a model is involved.

- [ ] **0C.0.7 — Introduce higher-level Salai authoring commands only when a concrete scenario requires them.**
  - valid reasons include Salai-owned new-ID allocation, relative placement, or avoiding raw `ParentRef`/index manufacture by the model;
  - add only command variants required by implemented scenarios;
  - compile immediately to public `NarrativeOperation[]`;
  - no generic mutation escape hatch.

- [ ] **0C.0.8 — Add project revision only if the implementation produces a real stale-write case.**
  - serialized local mutation is the default;
  - if added, a client may submit `expectedRevision` and receive a stale-revision failure;
  - no CRDT/distributed-state framework.

- [ ] **0C.0.GATE — Human UI and machine-produced changes can use one Salai-owned application boundary without bypassing canonical validation or adding a second state system.**

---

# 0C.1 — Backendless low-friction authoring shell

Bootstrap only enough browser/model/UI infrastructure to exercise the product hypothesis publicly.

- [ ] **0C.1.1 — Add a deterministic model-result adapter for tests/CI.**
  - deterministic fixtures produce the same Salai-owned structured result shape as the live adapter;
  - CI does not require network, login, or model availability.

- [ ] **0C.1.2 — Add one browser-safe hosted-model adapter.**
  - runs from the static GitHub Pages application;
  - uses user-scoped authentication/usage suitable for a public browser client;
  - embeds no reusable developer API secret;
  - accepts only task-relevant context;
  - returns a Salai-owned structured result;
  - provider-specific types stay inside the adapter.

- [ ] **0C.1.3 — Validate model output before project mutation.**
  - parse/validate the structured result;
  - normalize any scenario-specific Salai commands;
  - resolve to `NarrativeOperation[]`;
  - submit through `SalaiProjectService`;
  - malformed/invalid results do not partially mutate the project.

- [ ] **0C.1.4 — Add one simple free-form working area + explicit Process/Apply action.**
  - plain textarea/minimal editor is enough;
  - mixed prose, notes, questions, alternatives, and uncertainty are allowed;
  - no rich-text framework;
  - show one concise running/error/result state and change summary;
  - keep existing Narrative Lenses one action away.

- [ ] **0C.1.5 — Prove provider/session disposability.**
  - start a fresh model interaction using current Salai context;
  - no canonical narrative state is lost or reconstructed from conversation history.

- [ ] **0C.1.GATE — A user can open the hosted prototype, use a real model without Salai backend/secret infrastructure, and apply a validated structured change through the project service.**

---

# 0C.2 — Script-first vertical slice

Build one complete path before generalizing model interaction.

- [ ] **0C.2.1 — Process a rough paragraph into a usable canonical story in one user action.**
  - create/reuse only structure required by the example;
  - unresolved notes may remain uncommitted;
  - user does not manually create Beats/Cues;
  - model output still passes through canonical validation.

- [ ] **0C.2.2 — Support one natural-language revision over existing stable IDs.**
  - representative example: move proof earlier, tighten one Beat, or target a shorter runtime;
  - preserve existing identity where possible.

- [ ] **0C.2.3 — Keep live and deterministic model adapters behind the same Salai result contract.**
  - project/domain code does not branch on provider/session types;
  - CI assertions use deterministic results, not live model prose.

- [ ] **0C.2.4 — Add deterministic script-first tests.**
  - resulting operations/project validate through `@salai/script-model`;
  - malformed/invalid structured results fail before partial canonical publish.

- [ ] **0C.2.GATE — One representative script-first story can be created and revised without routine structured-UI management or backend/provider credential plumbing owned by Salai.**

---

# 0C.3 — Grouped change, trust, and immediate revert

One creative request may contain several internal operations but should remain one understandable action.

- [ ] **0C.3.1 — Represent the current revertible model action with minimum in-memory metadata.**

```text
AgentAction
- id
- input/intent
- changeSummary
- operations
- beforeProject
- beforeWorkspace
```

- [ ] **0C.3.2 — Apply one request as one project-service batch.**
  - reuse `applyOperations()`;
  - publish once on success.

- [ ] **0C.3.3 — Implement immediate one-step revert safely.**
  - restore pre-action project/Workspace snapshots only while that action is still the most recent canonical/Workspace change;
  - invalidate/clear the revert snapshot on any subsequent narrative or Workspace edit, including direct lens edits;
  - no general event sourcing;
  - no inverse-operation framework.

- [ ] **0C.3.4 — Keep clarification proportional to creative ambiguity.**
  - reversible, clearly requested local change may apply;
  - material ambiguity may ask one focused creative question;
  - external/destructive effects remain outside this spike.

- [ ] **0C.3.GATE — Model-mediated changes are understandable and immediately recoverable without risking later edits.**

---

# 0C.4 — Footage/source-backed vertical slice

Use fixture-backed or mocked source metadata. Do not pull real media intelligence into the spike.

- [ ] **0C.4.1 — Add minimal attachment handles for the scenario.**

```text
Attachment
- id
- displayName
- mediaType
- optional duration
- optional transcript/description
- optional fixture MediaSegment/source-range reference
```

- [ ] **0C.4.2 — Keep attachment identity distinct from canonical source identity.**
  - resolve explicitly to an existing/new MediaSegment only when canonical relationships are created.

- [ ] **0C.4.3 — Build one short source-backed sequence from attachments + natural-language intent.**

- [ ] **0C.4.4 — Preserve SourceExcerpt wording/ranges/media identity.**
  - source material never becomes freely rewritten authored copy;
  - authored bridge material remains authored.

- [ ] **0C.4.5 — Answer one missing/unsupported-material question from mocked relationships.**
  - response may be conversational or a simple result list;
  - **do not build Coverage Lens in 0C.**

- [ ] **0C.4.6 — Add deterministic source-preservation tests.**

- [ ] **0C.4.GATE — Source material can enter the story without manual source/Beat/Cue wiring and without losing provenance.**

---

# 0C.5 — Model ↔ existing Narrative Lens round trip

0C does not redesign or expand all lenses. It proves continuity with the already-implemented ones.

- [ ] **0C.5.1 — Model-mediated changes appear in all existing lenses through current canonical state.**
  - regression check, not new per-lens architecture.

- [ ] **0C.5.2 — Demonstrate one meaningful direct-lens edit after model normalization.**
  - choose whichever existing lens best fits the test scenario;
  - direct edit continues through the same project/Workspace boundary;
  - this edit invalidates any older snapshot-based model-action revert.

- [ ] **0C.5.3 — Include that direct edit in the next model context.**
  - no synchronization/export step;
  - read current project state through `SalaiProjectService`;
  - do not depend on conversation history remembering the edit.

- [ ] **0C.5.4 — Keep Workspace-only intent Workspace-only.**
  - Story Wall x/y/parking must not silently change narrative semantics.

- [ ] **0C.5.5 — Add deterministic round-trip tests.**
  - model batch → lens projection;
  - direct lens edit → next model context;
  - source evidence survives the round trip;
  - subsequent direct edit disables the older immediate revert.

- [ ] **0C.5.GATE — Model-mediated and direct-lens work behave as two interaction modes over one project without unsafe snapshot rollback or conversation-state dependence.**

---

# 0C.6 — Human validation

Do not expand implementation before running the minimum flows with people.

## Required scenarios

- [ ] **0C.6.1 — Blank-page or rough-paragraph script-first task.**
- [ ] **0C.6.2 — Natural-language revision that would have required several 0B interactions.**
- [ ] **0C.6.3 — Short source/interview task with fixture-backed attachments.**
- [ ] **0C.6.4 — Immediately revert an incorrect model interpretation before making another edit.**
- [ ] **0C.6.5 — Model-normalized project → voluntary Narrative Lens use → direct edit → follow-up model request.**

## Interaction-compression evidence

Record:

- explicit user actions/inputs;
- clarifications;
- structural concepts the user had to reason about;
- hesitation/flow;
- whether grouped summary + immediate revert were sufficient for trust;
- whether provider/login interaction materially interrupted the creative task.

## Structural-insight evidence

Record:

- which lens, if any, the user entered voluntarily;
- what property they noticed there that was less obvious in free-form interaction;
- whether they made a direct edit there;
- whether the next model request correctly reflected that edit.

- [ ] **0C.6.GATE — Evidence shows materially lower routine interaction than 0B and at least one existing lens remains voluntarily useful.**

---

# Optional external-agent proof — non-gating

Do this only if it is useful after the core hosted flow works.

A smallest proof may expose `SalaiProjectService` through **one** machine interface:

- CLI **or** MCP;
- optional Skill/instructions for a generic agent;
- one context/read operation;
- one validated canonical mutation;
- same project state as the UI/lenses.

Do not build both CLI and MCP. Do not add an agent harness, provider auth, or project storage to this adapter. This proof is not part of `0C.GATE`.

---

# 0C.GATE — Spike completion

Spike 0C passes only when all of these are true:

- [ ] script-first authoring is materially lower-friction than routine 0B direct structure management;
- [ ] the public prototype can use a real hosted model without a Salai-operated backend or embedded developer secret;
- [ ] all model-mediated canonical changes pass through `SalaiProjectService` and the existing `applyOperations()` boundary;
- [ ] invalid batches publish no partial state;
- [ ] source evidence remains source evidence;
- [ ] one grouped model action is immediately revertible without erasing later edits;
- [ ] existing Narrative Lenses remain synchronized through canonical state;
- [ ] at least one lens is voluntarily useful for structural insight or direct manipulation;
- [ ] a direct lens edit is visible to the next model request from current project context;
- [ ] provider/model/session state is not required to reconstruct the project;
- [ ] no unvalidated backend, external-agent bridge, new lens, production graph, or distributed-state infrastructure was added;
- [ ] CI is green.

If the gate passes, use the evidence to decide the next smallest production step. Do not infer that external-agent integration, desktop packaging, persistence, production graph, or Resolve automation should all start automatically.