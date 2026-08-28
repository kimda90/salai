# Spike 0C — Agent-Mediated Authoring + Narrative Lenses Implementation Plan

## Status

Canonical execution tracker for **Spike 0C — Agent-Mediated Authoring + Narrative Lenses**.

This file is the only source for 0C task numbering and completion status.

Contracts:

- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — low-friction authoring/agent contract;
- [`narrative-lenses.md`](narrative-lenses.md) — structured-lens creative contract;
- [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) — architecture proposal.

## Spike goal

Validate the smallest dual interaction model that can answer two questions:

1. can ordinary script-first and footage-first intentions be expressed with materially less structural bookkeeping than 0B; and
2. does at least one existing Narrative Lens provide useful structural insight/direct manipulation after agent normalization?

The spike is **not** a feature-complete agent architecture or media application.

## Reuse baseline

0C starts from capabilities that already exist:

- `@salai/script-model` is canonical narrative state;
- `applyOperation()` handles one typed canonical operation;
- `applyOperations()` already applies a `NarrativeOperation[]` against immutable input and returns one final `OperationResult`;
- the existing `SalaiController` publishes canonical project/Workspace state;
- Story Wall, Outline, AV Script, and Paper/Radio already read/write the same project;
- deterministic fixtures cover script-first, interview/corporate, and footage-first material.

**Do not rebuild these behind a second agent-specific state or operation system.**

## Tracker rules

- `[ ]` — not complete.
- `[x]` — implemented, merged, and verified.
- Human criteria stay unchecked until human evidence exists.
- Cancelled/superseded work stays unchecked with an explicit note.
- Each implementation PR updates this tracker only for evidence it actually produces.

## Non-goals

Keep these out of 0C unless the smallest mock is required for a validation scenario:

- Electron / FastAPI / SQLite;
- durable persistence;
- real Resolve/CutMaster execution;
- production graph implementation;
- a new Coverage Lens;
- full transcription/media analysis;
- OpenTimelineIO/OpenAssetIO integration;
- GenAI execution;
- vector database;
- canonical rich-text document model;
- generic infinite canvas / graph editor;
- general multi-agent framework;
- autonomous background-agent runtime.

# Execution order

```text
0C.0 Reuse canonical batch boundary
   ↓
0C.1 Low-friction authoring shell
   ↓
0C.2 Script-first vertical slice
   ↓
0C.3 Grouped change + revert
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

# 0C.1 — Low-friction authoring shell

- [ ] **0C.1.1 — Add one simple free-form working area.**
  - plain textarea/minimal editor is enough;
  - mixed prose, notes, questions, alternatives, and uncertainty are allowed;
  - no rich-text framework.

- [ ] **0C.1.2 — Add one project-aware instruction/question input.**
  - may share the working area or sit beside it;
  - chat transcript is not canonical state.

- [ ] **0C.1.3 — Add an explicit Process/Apply action.**
  - no continuous autonomous normalization in this spike.

- [ ] **0C.1.4 — Show one concise result/change summary.**
  - enough orientation that the user is not forced into a lens after every request.

- [ ] **0C.1.5 — Keep existing Narrative Lenses one action away.**
  - no new lens required.

- [ ] **0C.1.GATE — A user can express an ordinary intention without first choosing Beat/Cue/parent/operation mechanics.**

---

# 0C.2 — Script-first vertical slice

Build one complete path before generalizing the agent interface.

- [ ] **0C.2.1 — Add a minimal model/provider adapter with deterministic mock support.**
  - one Salai-owned call/structured-output loop;
  - no agent framework.

- [ ] **0C.2.2 — Process a rough paragraph into a usable canonical story in one user action.**
  - create/reuse only the structure required by the example;
  - unresolved notes may remain uncommitted;
  - the user does not manually create Beats/Cues.

- [ ] **0C.2.3 — Support one natural-language revision over existing stable IDs.**
  - representative example: move proof earlier, tighten one Beat, or target a shorter runtime;
  - preserve existing identity where possible.

- [ ] **0C.2.4 — Add deterministic mocked-agent tests for the script-first scenario.**
  - model/provider availability is not required for CI;
  - resulting operations/project validate through `@salai/script-model`.

- [ ] **0C.2.GATE — One representative script-first story can be created and revised without routine structured-UI management.**

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
  - use canonical state as the source of truth.

- [ ] **0C.5.4 — Keep Workspace-only intent Workspace-only.**
  - Story Wall x/y/parking must not silently change narrative semantics.

- [ ] **0C.5.5 — Add deterministic round-trip tests.**
  - agent batch → lens projection;
  - direct lens edit → next agent context;
  - source evidence survives the round trip;
  - subsequent direct edit disables the older immediate agent revert.

- [ ] **0C.5.GATE — Agent and direct lens work behave as two interaction modes over one project without unsafe snapshot rollback.**

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
- whether grouped summary + immediate revert were sufficient for trust.

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
- [ ] **G8 — One direct-lens edit is visible to the next agent request without export/import or state drift.**
- [ ] **G9 — No unvalidated 0C infrastructure or new lens was required to make the demo work.**
- [ ] **G10 — CI/typecheck/tests/build are green.**

If 0C passes, record an assessment and decide whether RFC 0002 should be accepted, revised, or rejected before moving to the local production application.