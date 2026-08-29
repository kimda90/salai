# Spike 0C — Agent-Mediated Authoring + Narrative Lenses Implementation Plan

## Status

Canonical execution tracker for **Spike 0C — Agent-Mediated Authoring + Narrative Lenses**.

This file is the only source for 0C task numbering and completion status.

Contracts:

- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — low-friction authoring/agent contract;
- [`narrative-lenses.md`](narrative-lenses.md) — structured-lens creative contract;
- [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) — interaction architecture proposal;
- [`adr/0006-codex-runtime-behind-salai-agent-seam.md`](adr/0006-codex-runtime-behind-salai-agent-seam.md) — accepted Spike 0C runtime/authentication boundary.

## Spike goal

Validate the smallest dual interaction model that can answer two questions:

1. can ordinary script-first and footage-first intentions be expressed with materially less structural bookkeeping than 0B; and
2. does at least one existing Narrative Lens provide useful structural insight/direct manipulation after agent normalization?

The spike is **not** a feature-complete agent architecture or media application.

## Implementation strategy

Optimize for **time to demo behind stable Salai boundaries**.

For 0C:

- Codex app-server provides the real local agent runtime;
- Codex manages ChatGPT authentication/session/model plumbing;
- Salai owns one small `AgentRuntime` seam so Codex protocol types do not spread through the application;
- deterministic/mock runtime behavior remains available for CI and GitHub Pages;
- Codex final output is constrained with `turn/start.outputSchema` before adding a custom tool protocol;
- canonical changes still pass through `NarrativeOperation[]` / `applyOperations()`;
- Codex thread/history state is disposable runtime context, not canonical Salai project state;
- direct browser-to-Codex WebSockets are not the baseline; the real path uses a small local host and Codex's supported stdio/JSONL transport.

Principle:

> **Long-term domain boundary, short-term infrastructure.**

## Reuse baseline

0C starts from capabilities that already exist:

- `@salai/script-model` is canonical narrative state;
- `applyOperation()` handles one typed canonical operation;
- `applyOperations()` already applies a `NarrativeOperation[]` against immutable input and returns one final `OperationResult`;
- the existing `SalaiController` publishes canonical project/Workspace state;
- Story Wall, Outline, AV Script, and Paper/Radio already read/write the same project;
- deterministic fixtures cover script-first, interview/corporate, and footage-first material;
- the React/Vite prototype and GitHub Pages build already provide the validation surface.

External commodity runtime reused for 0C:

- `codex app-server` for ChatGPT-authenticated model execution, threads/turns, and structured final output.

**Do not rebuild existing Salai model/controller behavior behind a second agent-specific state or operation system. Do not rebuild Codex authentication/session plumbing inside Salai.**

## State ownership

Keep three layers explicit:

```text
Codex runtime state
thread / turn / auth / model context
        ↓ disposable

Salai agent state
current request / selected context / proposed result
        ↓ transient

Salai project state
Narrative IR / Workspace / source relationships
        ↓ canonical
```

A fresh Codex process/thread must be able to continue from current Salai state.

## Tracker rules

- `[ ]` — not complete.
- `[x]` — implemented, merged, and verified.
- Human criteria stay unchecked until human evidence exists.
- Cancelled/superseded work stays unchecked with an explicit note.
- Each implementation PR updates this tracker only for evidence it actually produces.

## Non-goals

Keep these out of 0C unless the smallest mock is required for a validation scenario:

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
- extracting/reusing Codex ChatGPT OAuth tokens in Salai;
- direct browser dependency on Codex's experimental WebSocket transport;
- durable chat/session history;
- polished token-by-token chatbot streaming;
- autonomous background-agent runtime.

# Execution order

```text
0C.0 Reuse canonical batch boundary
   ↓
0C.1 Codex runtime seam + low-friction shell
   ↓
0C.2 Script-first vertical slice
   ↓
0C.3 Grouped change + immediate revert
   ↓
0C.4 Footage/source vertical slice
   ↓
0C.5 Agent ↔ existing-lens round trip
   ↓
0C.6 Human validation
   ↓
0C.GATE
```

---

# 0C.0 — Reuse the canonical batch boundary

Do this before wiring a real model so the agent has exactly one safe application path.

- [ ] **0C.0.1 — Keep `@salai/script-model` as the only canonical narrative model.**
  - no AI-owned project schema;
  - no canonical chat transcript;
  - no lens-owned narrative copies.

- [ ] **0C.0.2 — Add controller-level batch dispatch using existing `applyOperations()`.**
  - call `applyOperations(currentProject, operations)`;
  - publish project/Workspace once after the full call succeeds;
  - on error, publish no partial canonical state;
  - preserve selection/Workspace synchronization using the same rules as single-operation dispatch.

- [ ] **0C.0.3 — Add deterministic batch-boundary tests.**
  - valid multi-operation batch publishes one final state;
  - invalid later operation leaves live controller state unchanged;
  - relationship effects/warnings/created/removed IDs reach the application boundary.

- [ ] **0C.0.4 — Define the smallest agent-facing project context needed by the first scenario.**
  - current canonical project or task-relevant projection;
  - working input;
  - optional attachment handles;
  - active lens identity only when relevant;
  - no arbitrary UI state.

- [ ] **0C.0.5 — Start with public `NarrativeOperation[]` where it is sufficient.**
  - do not create a parallel persistent authoring API merely because an agent is involved;
  - revisions that can reference existing stable IDs may use the public operation vocabulary directly.

- [ ] **0C.0.6 — Introduce higher-level Salai authoring commands only when a concrete scenario requires them.**
  - valid reasons include Salai-owned new-ID allocation, relative placement, or avoiding raw `ParentRef`/index manufacture by the model;
  - add only command variants required by implemented scenarios;
  - compile immediately to public `NarrativeOperation[]`;
  - no generic mutation escape hatch.

- [ ] **0C.0.GATE — Agent output cannot bypass canonical validation, and 0C adds no second domain/state system.**

---

# 0C.1 — Codex runtime seam + low-friction authoring shell

Bootstrap only enough runtime/UI infrastructure to exercise the real product hypothesis.

- [ ] **0C.1.1 — Define a minimum Salai-owned `AgentRuntime` contract.**
  - use Salai-owned request/result/status types;
  - keep Codex JSON-RPC, thread, turn, auth, and model types inside the Codex adapter;
  - support only capabilities required by the first two vertical slices;
  - do not introduce a provider registry/plugin framework.

- [ ] **0C.1.2 — Add a deterministic/mock runtime behind the same contract.**
  - deterministic fixtures drive CI;
  - GitHub Pages continues to use mock behavior;
  - tests must not require ChatGPT login/network/model availability.

- [ ] **0C.1.3 — Add a local `CodexRuntime` adapter using `codex app-server` over stdio/JSONL.**
  - local host owns Codex process lifecycle;
  - initialize the app-server protocol explicitly;
  - start an ephemeral/fresh thread for the minimum scenario unless persistence proves necessary;
  - translate only needed runtime events/results;
  - no dependency on experimental browser WebSocket transport.

- [ ] **0C.1.4 — Delegate ChatGPT authentication to Codex.**
  - use Codex's ChatGPT login flow;
  - surface/open the returned authorization URL when login is required;
  - Salai does not persist or refresh ChatGPT OAuth tokens;
  - no Salai API-key management UI in 0C.

- [ ] **0C.1.5 — Use structured final output as the first agent/result boundary.**
  - pass a Salai-owned JSON Schema through Codex `turn/start.outputSchema`;
  - parse/validate the final result before canonical application;
  - start with `NarrativeOperation[]` or minimum scenario-specific Salai commands;
  - do not add MCP/tool-registry infrastructure unless an implemented scenario proves final structured output insufficient.

- [ ] **0C.1.6 — Add the smallest browser ↔ local-host request boundary.**
  - submit one project-aware request;
  - expose coarse idle/running/auth-required/error/success state;
  - return the final structured result;
  - token-by-token chat streaming and durable conversation history are optional and should not block the demo.

- [ ] **0C.1.7 — Add one simple free-form working area + explicit Process/Apply action.**
  - plain textarea/minimal editor is enough;
  - mixed prose, notes, questions, alternatives, and uncertainty are allowed;
  - no rich-text framework;
  - show one concise result/change summary;
  - keep existing Narrative Lenses one action away.

- [ ] **0C.1.8 — Prove runtime disposability.**
  - stop/restart the mock/runtime boundary or start a fresh thread;
  - reconstruct task context from current Salai project state;
  - no canonical narrative state is lost or recovered from chat history.

- [ ] **0C.1.GATE — A local user can authenticate through Codex and submit an ordinary request through Salai without Salai owning provider credentials, while hosted/CI mode remains deterministic.**

---

# 0C.2 — Script-first vertical slice

Build one complete path before generalizing the agent interface.

- [ ] **0C.2.1 — Process a rough paragraph through `AgentRuntime` into a usable canonical story in one user action.**
  - create/reuse only the structure required by the example;
  - unresolved notes may remain uncommitted;
  - the user does not manually create Beats/Cues;
  - structured model output still passes through canonical validation.

- [ ] **0C.2.2 — Support one natural-language revision over existing stable IDs.**
  - representative example: move proof earlier, tighten one Beat, or target a shorter runtime;
  - preserve existing identity where possible.

- [ ] **0C.2.3 — Keep real Codex and deterministic runtime behavior behind the same Salai contract.**
  - product/domain code must not branch on Codex-specific thread/turn types;
  - CI assertions use deterministic results, not live model text.

- [ ] **0C.2.4 — Add deterministic agent tests for the script-first scenario.**
  - resulting operations/project validate through `@salai/script-model`;
  - malformed/invalid structured results fail before partial canonical publish.

- [ ] **0C.2.GATE — One representative script-first story can be created and revised without routine structured-UI management or provider credential plumbing.**

---

# 0C.3 — Grouped change, trust, and immediate revert

One creative request may contain several internal operations but should remain one understandable action.

- [ ] **0C.3.1 — Represent the current revertible agent action with minimum in-memory metadata.**

```text
AgentAction
- id
- input/intent
- changeSummary
- operations
- beforeProject
- beforeWorkspace
```

- [ ] **0C.3.2 — Apply one request as one controller batch.**
  - reuse `applyOperations()`;
  - publish once on success.

- [ ] **0C.3.3 — Implement immediate one-step revert safely.**
  - restore pre-action project/Workspace snapshots only while that agent action is still the most recent canonical/Workspace change;
  - invalidate/clear the revert snapshot on any subsequent narrative or Workspace edit, including direct lens edits;
  - no general event sourcing;
  - no inverse-operation framework.

- [ ] **0C.3.4 — Keep clarification proportional to creative ambiguity.**
  - reversible, clearly requested local change may apply;
  - material ambiguity may ask one focused creative question;
  - external/destructive effects remain outside this spike.

- [ ] **0C.3.GATE — Agent changes are understandable and immediately recoverable without risking later edits.**

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

# 0C.5 — Agent ↔ existing Narrative Lens round trip

0C does not need to redesign or expand all lenses. It needs to prove continuity with the already-implemented ones.

- [ ] **0C.5.1 — Agent changes appear in all existing lenses through current canonical state.**
  - regression check, not a new per-lens architecture.

- [ ] **0C.5.2 — Demonstrate one meaningful direct-lens edit after agent normalization.**
  - choose whichever existing lens best fits the test scenario;
  - direct edit continues through the existing canonical/Workspace boundary;
  - this edit invalidates any older snapshot-based agent revert.

- [ ] **0C.5.3 — Include that direct edit in the next agent context.**
  - no synchronization/export step;
  - use canonical state as the source of truth;
  - do not depend on a Codex thread remembering the edit unless Salai explicitly supplies current project context.

- [ ] **0C.5.4 — Keep Workspace-only intent Workspace-only.**
  - Story Wall x/y/parking must not silently change narrative semantics.

- [ ] **0C.5.5 — Add deterministic round-trip tests.**
  - agent batch → lens projection;
  - direct lens edit → next agent context;
  - source evidence survives the round trip;
  - subsequent direct edit disables the older immediate agent revert.

- [ ] **0C.5.GATE — Agent and direct lens work behave as two interaction modes over one project without unsafe snapshot rollback or chat-state dependence.**

---

# 0C.6 — Human validation

Do not expand implementation before running the minimum flows with people.

## Required scenarios

- [ ] **0C.6.1 — Blank-page or rough-paragraph script-first task.**
- [ ] **0C.6.2 — Natural-language revision that would have required several 0B interactions.**
- [ ] **0C.6.3 — Short source/interview task with fixture-backed attachments.**
- [ ] **0C.6.4 — Immediately revert an incorrect agent interpretation before making another edit.**
- [ ] **0C.6.5 — Agent-normalized project → voluntary Narrative Lens use → direct edit → follow-up agent request.**

## Interaction-compression evidence

Record:

- explicit user actions/inputs;
- clarifications;
- structural concepts the user had to reason about;
- hesitation/flow;
- whether grouped summary + immediate revert were sufficient for trust;
- whether auth/runtime plumbing intruded on the creative task.

## Structural-insight evidence

Record:

- which existing lens, if any, the user opens voluntarily;
- what they are trying to understand;
- what the lens reveals that prose/conversation did not;
- whether direct manipulation feels creatively meaningful;
- whether any exposed internal concept fails to justify its cognitive cost.

- [ ] **0C.6.GATE — Human evidence supports both lower routine interaction and useful voluntary structural perception.**

---

# 0C.GATE — Spike completion

0C passes only when all of the following are supported by implementation/test/human evidence:

- [ ] **G1 — One script-first flow works with materially less routine structural interaction than 0B.**
- [ ] **G2 — One footage/source-backed flow works without manual relationship wiring.**
- [ ] **G3 — Agent changes use the existing canonical operation/batch boundary rather than a second domain model.**
- [ ] **G4 — Failed batches cannot partially publish live project state.**
- [ ] **G5 — Source evidence remains source evidence.**
- [ ] **G6 — One grouped agent action can be understood and immediately reverted without erasing later edits.**
- [ ] **G7 — Existing Narrative Lenses remain synchronized; at least one provides useful voluntary structural insight.**
- [ ] **G8 — One direct-lens edit is visible to the next agent request without export/import, state drift, or dependence on hidden chat memory.**
- [ ] **G9 — The real local path uses Codex behind a Salai-owned runtime seam; Salai does not own ChatGPT OAuth/API-key lifecycle.**
- [ ] **G10 — Restarting/freshening the agent runtime does not lose canonical Salai project state.**
- [ ] **G11 — Hosted/CI mode remains deterministic without live model credentials.**
- [ ] **G12 — No unvalidated general provider/agent/chat infrastructure or new lens was required to make the demo work.**
- [ ] **G13 — CI/typecheck/tests/build are green.**

If 0C passes, record an assessment and decide whether RFC 0002 should be accepted, revised, or rejected before moving to the local production application. At that point, separately evaluate whether Codex remains the right runtime or should be superseded by another implementation behind the same Salai seam.