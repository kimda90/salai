# Spike 0C — External-Agent Authoring + Narrative Lenses Implementation Plan

## Status

Canonical execution tracker for Spike 0C. This file is the only source for 0C task numbering, implementation order, completion status, and exit evidence.

Current decision: [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md).

## Goal

Validate that a filmmaker can express ordinary story intent through an existing external agent harness with materially less structural bookkeeping than 0B, while Salai keeps one valid canonical project and the existing Narrative Lenses remain useful for direct structural work.

## Hard boundaries

- `@salai/script-model` is the only canonical narrative model.
- `SalaiProjectService` is the human/machine application boundary.
- `applyOperations()` is the canonical multi-operation mutation primitive.
- The external harness owns model choice, authentication, sessions, history, planning, and tool-loop behavior.
- Salai contains no model/provider SDK, API-key/OAuth handling, model router, chat runtime, or embedded agent session.
- 0C exposes one machine interface first: **CLI-oriented**, not CLI + MCP.
- The machine interface must reach the same live project service used by the Narrative Lenses; it must not edit serialized storage or maintain another project model.
- A Skill may later teach a harness how to use the interface, but it is instructions only.
- CI is deterministic and provider-independent.
- No CRDT, event sourcing, distributed state, production graph, new lens, real media analysis, Resolve execution, or general plugin framework in 0C.

Principle:

> **Invest in the project interface; let the harness own the agent.**

## Delivery rules

- Read this plan before each slice.
- Finish one slice, run CI, then mark only verified tasks implemented.
- Merge one slice before beginning the next.
- Reuse existing model/controller behavior before adding abstractions.
- Add a higher-level command only when a concrete scenario proves raw public operations are too brittle.
- Human-validation tasks remain open until a human actually runs them.

## Merge sequence

```text
0C.0  Project service + atomic batch boundary          [implemented]
  ↓
0C.1  External-harness machine interface              [implemented]
  ↓
0C.2  Script-first creation + revision                [implemented]
  ↓
0C.3  Grouped action + immediate revert               [implemented]
  ↓
0C.4  Source-backed vertical slice
  ↓
0C.5  Harness ↔ Narrative Lens round trip
  ↓
0C.6  Human validation + assessment
  ↓
0C.GATE
  ↓
Ponytail-equivalent implementation review
  ↓
implementation-improvements plan
```

---

# 0C.0 — Project service + canonical batch boundary

- [x] **0C.0.1 — Define the minimum `SalaiProjectService` contract over existing state.**
- [x] **0C.0.2 — Add atomic `dispatchNarrativeBatch()` using existing `applyOperations()`.**
- [x] **0C.0.3 — Preserve the existing single-operation lens path.**
- [x] **0C.0.4 — Test one-publish success and no-publish failure behavior.**
- [x] **0C.0.5 — Expose task-relevant current project context.**
- [x] **0C.0.GATE — Human UI and machine-produced batches can use one Salai-owned state/mutation boundary.**

---

# 0C.1 — External-harness machine interface

## Goal

Let a generic local harness inspect and mutate the **live Salai project** without putting model/runtime concerns inside Salai.

### 0C.1A — Machine command surface

- [x] **0C.1.1 — Define the smallest machine command vocabulary.**
  - `context`: return task-relevant current project state as JSON;
  - `apply`: accept a canonical `NarrativeOperation[]` batch and return the canonical operation result/feedback;
  - no provider/session/model concepts.

- [x] **0C.1.2 — Route machine mutations through `SalaiProjectService`.**
  - same `dispatchNarrativeBatch()` used by the UI/controller;
  - no direct file/storage mutation;
  - no shadow project.

- [x] **0C.1.3 — Add deterministic command tests.**
  - current context reflects current canonical state;
  - valid batch publishes once;
  - invalid batch leaves live state unchanged;
  - JSON output is machine-readable and errors are explicit.

### 0C.1B — Local bridge + CLI

The current React prototype owns its project in the browser, so an external process needs a small local transport to reach that same live service. The transport is glue only; it must not become another state owner.

- [x] **0C.1.4 — Add the smallest local request/response bridge between the browser project service and a local CLI.**
  - prefer Node/browser built-ins before adding a transport dependency;
  - bridge stores no narrative project;
  - one active local browser client is sufficient for 0C;
  - local-only binding by default.

- [x] **0C.1.5 — Add one CLI entry point for a harness.**
  - `salai context`;
  - `salai apply <json-or-stdin>`;
  - stable JSON stdout for success;
  - non-zero exit + concise stderr for failure.

- [x] **0C.1.6 — Prove live shared state.**
  - CLI reads the same project shown by a Narrative Lens;
  - CLI mutation immediately updates the open UI through existing project state;
  - direct lens mutation is visible to the next CLI `context` call;
  - restarting the harness/CLI loses no Salai project state.

- [x] **0C.1.GATE — An external local harness can inspect and mutate the same live Salai project as the UI without Salai owning model/runtime infrastructure.**

---

# 0C.2 — Script-first vertical slice

## Goal

Prove one rough-text → story → revision flow through the external harness interface.

- [x] **0C.2.1 — Add one fixed rough-paragraph scenario and minimum acceptable canonical result.**
- [x] **0C.2.2 — Create the story in one machine action without manual Beat/Cue/parent bookkeeping.**
- [x] **0C.2.3 — Add one narrow Salai creation command only if creation requires Salai-owned ID/reference resolution.**
  - command resolves IDs/placement inside Salai;
  - compiles immediately to `NarrativeOperation[]`;
  - does not become a second persistent mutation model.
- [x] **0C.2.4 — Support one ordinary-language revision through the harness while preserving stable IDs where meaning is unchanged.**
- [x] **0C.2.5 — Add deterministic creation/revision tests, including malformed/invalid atomic failure.**
- [x] **0C.2.6 — Run one real external-harness smoke test against the local CLI.**
- [x] **0C.2.GATE — The representative story can be created and revised with materially less structural bookkeeping than 0B.**

---

# 0C.3 — Grouped action + immediate revert

- [x] **0C.3.1 — Record one successful machine batch as the current revertible action with pre-action project/Workspace snapshots.**
- [x] **0C.3.2 — Expose immediate Revert in Salai.**
- [x] **0C.3.3 — Invalidate the revert snapshot after any later canonical or Workspace edit, whether machine- or lens-originated.**
- [x] **0C.3.4 — Test exact revert, later-lens invalidation, Workspace-only invalidation, and failed-batch behavior.**
- [x] **0C.3.GATE — One harness request behaves as one understandable, immediately revertible creative action without risking later edits.**

---

# 0C.4 — Source-backed vertical slice

- [ ] **0C.4.1 — Add one deterministic interview/source fixture exposed through task-relevant machine context.**
- [ ] **0C.4.2 — Keep transient input/reference identity separate from canonical MediaSegment/SourceExcerpt identity.**
- [ ] **0C.4.3 — Build one short source-backed sequence through the harness interface.**
- [ ] **0C.4.4 — Preserve SourceExcerpt wording, source ranges, media identity, and authored/source-backed distinction.**
- [ ] **0C.4.5 — Answer one missing/unsupported-material question from mocked relationships without building a Coverage Lens.**
- [ ] **0C.4.6 — Add deterministic source-preservation tests and one real harness smoke test.**
- [ ] **0C.4.GATE — Source-backed material can be arranged through the harness without manual wiring or provenance loss.**

---

# 0C.5 — Harness ↔ Narrative Lens round trip

- [ ] **0C.5.1 — Prove machine changes appear in all existing lenses through canonical state only.**
- [ ] **0C.5.2 — Make one meaningful direct lens edit after harness normalization.**
- [ ] **0C.5.3 — Prove the next harness `context` sees that direct edit with no export/import or conversation-memory dependency.**
- [ ] **0C.5.4 — Preserve Workspace-only Story Wall semantics.**
- [ ] **0C.5.5 — Add deterministic round-trip tests.**
- [ ] **0C.5.GATE — Harness and direct-lens work remain coherent over one live project with no shadow synchronization state.**

---

# 0C.6 — Human validation

- [ ] **0C.6.1 — Rough-paragraph script-first creation through an external harness.**
- [ ] **0C.6.2 — Natural-language revision that would have required several 0B interactions.**
- [ ] **0C.6.3 — Short source/interview task.**
- [ ] **0C.6.4 — Incorrect interpretation → immediate revert.**
- [ ] **0C.6.5 — Harness-normalized project → voluntary Narrative Lens → direct edit → follow-up harness request.**
- [ ] **0C.6.6 — Record interaction-compression and voluntary-lens evidence.**
- [ ] **0C.6.7 — Write the Spike 0C assessment with pass/fail evidence and evidence-backed next steps only.**
- [ ] **0C.6.GATE — Human evidence shows materially lower routine interaction than 0B and at least one existing lens remains voluntarily useful.**

---

# 0C.GATE

Spike 0C passes only when:

- [ ] an external harness can inspect and mutate the same live project as the UI through one Salai machine interface;
- [ ] Salai contains no model/provider/auth/session runtime;
- [ ] script-first authoring is materially lower-friction than routine 0B structure management;
- [ ] all machine canonical changes pass through `SalaiProjectService` and `applyOperations()`;
- [ ] invalid batches publish no partial canonical state;
- [ ] source evidence remains source evidence;
- [ ] one grouped machine action is immediately revertible without erasing later edits;
- [ ] existing Narrative Lenses remain synchronized through canonical state;
- [ ] at least one lens is voluntarily useful;
- [ ] a direct lens edit is visible to the next harness request;
- [ ] harness/model history is not required to reconstruct Salai project state;
- [ ] no unvalidated second machine protocol, new lens, production graph, distributed-state system, or general agent framework was added;
- [ ] CI is green.

After the gate, run a Ponytail-equivalent review using the repository's prior multi-pass method plus the public minimalism ladder: YAGNI → reuse existing code → standard library → native platform → installed dependency → smallest implementation. Audit architecture/scope, dead/overbuilt code, duplication/legibility, performance, and maintenance. Write the resulting improvement plan, then restart this implementation loop from that plan.
