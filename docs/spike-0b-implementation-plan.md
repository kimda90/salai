# Spike 0B — Implementation Plan and Execution Tracker

## Status

**Historical execution record. Spike 0B is closed with a mixed product result.**

This tracker records what the **Spike 0B — Familiar Authoring UX** experiment implemented and which original gates were not completed. It is no longer the active task tracker.

The decisive human finding was broader than the remaining local UX questions:

> **Direct structured authoring requires too much user interaction to be creatively useful as the primary workflow.**

Do not continue unchecked 0B recognizability, terminology, or gesture-polish tasks merely to make the old gate appear complete. The semantic architecture proved useful; the primary interaction hypothesis changed.

Current active tracker: [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).

Current 0B result: [`spike-0b-assessment.md`](spike-0b-assessment.md).

This document owns the historical record of:

- implementation task breakdown;
- task ordering and dependencies;
- task completion state;
- task-level acceptance criteria;
- implementation evidence after tasks were merged.

It does **not** redefine current product/workflow/domain semantics.

Relevant canonical/current contracts are:

- [`authoring-ux-spec.md`](authoring-ux-spec.md) — historical Spike 0B technical/UX contract;
- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — active Spike 0C authoring contract;
- [`workflows.md`](workflows.md) — current creative workflow behavior;
- [`narrative-ir-spec.md`](narrative-ir-spec.md) — Narrative IR semantics and operations;
- [`architecture.md`](architecture.md) — system/infrastructure boundaries;
- [`mvp.md`](mvp.md) — phase sequence;
- [`backlog.md`](backlog.md) — NOW/NEXT/LATER prioritization.

# Tracker rules

## Task state

Use GitHub task-list syntax:

- `[ ]` — not completed under the original 0B criterion;
- `[x]` — implemented, merged, and verified during 0B.

Task IDs are stable. Do not renumber existing IDs.

Cancelled or superseded items remain unchecked with explicit evidence. Unchecked human-only gates below are intentionally preserved because 0B did not pass its original direct-structured-authoring UX hypothesis.

## Historical completion rule

During 0B, a task could change to `[x]` only when:

1. the implementation was merged to `main`;
2. relevant typecheck/tests/build passed;
3. the task-specific acceptance criteria passed;
4. affected documentation/contracts were updated;
5. completion evidence was added beneath the task or in the evidence log.

A partially implemented task stayed unchecked.

## Historical implementation PR rule

During Spike 0B, implementation PRs were expected to update this file in the same PR:

- check only tasks fully completed by the PR;
- add PR/evidence references;
- add newly discovered required tasks before declaring a section complete;
- do not use this tracker to hide changes to Narrative IR semantics or workflow contracts.

## Evidence format

Use:

```text
Evidence: PR #NN — <short validation summary>
```

# Spike goal

Validate that **Story Wall, Outline, AV Script, and Paper/Radio Edit** can operate on one canonical `@salai/script-model` project while preserving familiar creative workflows and keeping Workspace organization separate from narrative semantics.

The semantic part of this goal passed. The stronger product assumption—that these structured surfaces should be the primary authoring model—failed the first human creative-friction test.

# Non-goals

0B intentionally did not pull in:

- Electron;
- Python/FastAPI;
- SQLite/durable persistence;
- Resolve/CutMaster integration;
- OpenTimelineIO/OpenAssetIO integration;
- real transcription/media analysis;
- live LLM calls or agent frameworks;
- GenAI execution;
- collaboration/sync;
- generic infinite canvas;
- node/graph editor;
- rich-text document model.

# Dependency baseline

Actual retained 0B UI/test infrastructure:

```text
React + TypeScript + Vite
├── Pragmatic Drag and Drop    Story Wall drag mechanics
├── Vitest                     fast deterministic unit/acceptance tests
└── GitHub Pages               deployed browser prototype
```

shadcn/Base UI, TanStack Table, TanStack Virtual, Storybook, and browser-test infrastructure were evaluated but were not retained because the implemented 0B workflows did not justify them. Libraries provide mechanics; Salai owns the interpretation of those mechanics into Workspace changes or Narrative IR operations.

# Execution order

```text
0B.0 Foundation
   ↓
0B.1 Workspace model
   ↓
0B.2 Outline
   ↓
0B.3 Story Wall
   ↓
0B.4 AV Script
   ↓
0B.5 Paper / Radio Edit
   ↓
0B.6 Cross-surface validation
   ↓
0B.7 Assessment / decisions
   ↓
0B.GATE
```

This sequence is retained as historical evidence. 0C now tests a different primary interaction hypothesis rather than continuing the old gate mechanically.

---

# 0B.0 — Shared React prototype foundation

## Application package

- [x] **0B.0.1 — Create the React/TypeScript/Vite authoring prototype package.**
  - Add it to the pnpm workspace.
  - Provide development, typecheck, test, and build scripts.
  - Keep it browser-based; no Electron dependency.
  - Render a minimal Salai application shell.
  - **Acceptance:** root `pnpm typecheck`, `pnpm test`, and `pnpm build` include the package successfully.

- [x] **0B.0.2 — Integrate `@salai/script-model` through its public API.**
  - Do not import internal implementation paths.
  - Do not translate the whole Narrative IR into a second UI-owned canonical model.
  - **Acceptance:** at least one existing fixture renders directly from the package model.

- [x] **0B.0.3 — Establish the approved UI primitives/dependencies.**
  - Add shadcn/ui + Base UI only as needed by implemented surfaces.
  - Add Pragmatic Drag and Drop for drag/reorder mechanics.
  - Add TanStack Table when AV Script work begins if it materially helps.
  - Add TanStack Virtual only if real fixture size justifies it.
  - Confirm dependency licenses before adoption.
  - **Acceptance:** no tldraw, React Flow, rich-text framework, or agent framework is introduced without new documented evidence.
  - **Result:** Pragmatic Drag and Drop is used for Story Wall movement. shadcn/Base UI, TanStack Table, and TanStack Virtual were not added because the implemented 0B surfaces did not require them.

## Development harness

- [x] **0B.0.4 — Build a deterministic fixture selector.**
  - Load all existing Narrative IR fixtures.
  - Switch fixtures without page reload where practical.
  - Reset the active fixture to its original state.
  - Show fixture/project identity and approximate runtime.
  - **Acceptance:** every 0B surface can consume the same fixture-controller boundary.

- [ ] **0B.0.5 — Configure Storybook.**
  - Stories can load real Narrative IR fixtures.
  - Include common and edge states useful to 0B.
  - **Acceptance:** Storybook builds in CI or through an explicit package script.
  - **CANCELLED:** the deployed fixture-driven app already supplies the isolated states needed for 0B, and no implementation/debugging need justified another harness.

- [ ] **0B.0.6 — Configure Vitest Browser Mode for UI interactions.**
  - Keep existing pure model tests unchanged.
  - **Acceptance:** at least one browser-level smoke test runs in CI/local validation.
  - **CANCELLED:** PR #20 explicitly removed Chromium/Playwright/browser-test execution. Fast deterministic acceptance tests cover state/identity boundaries; visual/interaction comprehension was assigned to human testing.

## Shared state and operation boundary

- [x] **0B.0.7 — Implement a thin application controller/store.**
  - Own current Narrative IR model value/reference.
  - Own current Workspace state.
  - Own shared selection/navigation state.
  - UI-local drafts, hover, menus, drag previews, etc. remain ephemeral.
  - **Acceptance:** no surface owns a drifting canonical copy of Sections/Scenes/Beats/Cues/content.

- [x] **0B.0.8 — Implement the shared Narrative operation dispatcher.**
  - All semantic story changes use `@salai/script-model` public operations.
  - Replace/update current model from operation results.
  - Preserve warnings, relationship effects, changed/created/removed IDs.
  - **Acceptance:** one semantic operation updates all subscribed views of the same model.

- [x] **0B.0.9 — Implement operation error/warning feedback.**
  - Surface domain rejection/errors visibly enough for the spike.
  - Surface warnings/relationship consequences where relevant.
  - Never silently fall back to UI-only mutation after a rejected domain operation.

- [x] **0B.0.10 — Implement stable-ID shared selection/navigation.**
  - Selection identifies canonical object type + stable ID.
  - Switching surfaces preserves selection when that object is represented there.
  - **Acceptance:** the same selected Beat can be recognized across at least Outline and Story Wall/AV Script.

## Foundation tests

- [x] **0B.0.11 — Add controller/fixture smoke tests.**
  - fixture load/reset;
  - semantic operation dispatch;
  - warning/error propagation;
  - canonical state update visible to two test consumers.
  - **Result:** PR #12 covers deterministic load/reset, operation dispatch, errors and two subscribers; PR #21 adds destructive-operation relationship consequences. The current domain implementation does not emit a non-empty `DomainWarning`, so there is no warning-producing operation to exercise yet.

- [x] **0B.0.GATE — Shared foundation is ready for workflow surfaces.**
  - Application package builds/tests.
  - Existing fixtures load.
  - One canonical Narrative IR is shared.
  - Semantic edits pass through one operation boundary.

---

# 0B.1 — Minimum in-memory Workspace model

## Types and ownership

- [x] **0B.1.1 — Define `Workspace` and `Board` types.**
  - In-memory only.
  - Stable Workspace identity.
  - Workspace kind/name/settings only as needed by 0B.

- [x] **0B.1.2 — Define `BoardItem` canonical-reference representation.**
  - BoardItem has its own Workspace identity.
  - Reference canonical objects by stable ID + supported object type.
  - Do not copy canonical titles/content as persisted BoardItem data.

- [x] **0B.1.3 — Define `IdeaCard` as Workspace-only state.**
  - Stable Workspace identity.
  - Minimal editable text/type metadata.
  - It does not become a Beat/Scene simply by existing.

- [x] **0B.1.4 — Determine initial Workspace metadata fields.**
  - Start with only fields needed for implemented interactions.
  - Candidate fields: x/y, width/height, color, rotation, label, note, lane/group, parking state.
  - Mark unused speculative fields for removal during assessment.
  - **Result:** 0B retains only x/y and parking state as layout metadata. Unused speculative presentation/grouping fields were removed in PR #17.

## Workspace operations

- [x] **0B.1.5 — Implement Workspace-only BoardItem operations.**
  - add/remove workspace reference;
  - update spatial position;
  - update lane/group/parking where required;
  - update other validated layout metadata.
  - **Acceptance:** these operations do not mutate Narrative IR.

- [x] **0B.1.6 — Implement IdeaCard lifecycle.**
  - create;
  - edit;
  - move/organize;
  - delete.
  - **Acceptance:** all remain Workspace-only until explicit promotion.

- [x] **0B.1.7 — Implement explicit IdeaCard promotion.**
  - Promote to Beat and/or Scene where supported by the chosen UX.
  - Use Narrative operations to create canonical identity.
  - Replace/link the BoardItem to that canonical identity.
  - **Acceptance:** promotion creates canonical identity exactly once.

## Intent interpretation

- [x] **0B.1.8 — Define the gesture-intent mapping boundary.**
  - Input: surface/context + gesture result.
  - Output: Workspace operation or Narrative operation intent.
  - Drag-library event types do not enter Narrative IR/domain types.
  - **Result:** the implemented boundary is structural rather than a generic interpreter: free board drag calls Workspace operations; the explicit Story Order UI calls Narrative operations. PR #17 removed the unused test-only generic movement interpreter.

- [x] **0B.1.9 — Implement explicit Workspace-vs-Narrative movement semantics.**
  - Free spatial movement → Workspace only.
  - Explicit structural movement → Narrative operation.
  - Parking → Workspace organization unless a separate explicit semantic removal action is invoked.

## Workspace tests

- [x] **0B.1.10 — Test free movement does not change Narrative IR.**
- [x] **0B.1.11 — Test structural movement emits expected Narrative operation.**
- [x] **0B.1.12 — Test parking is not deletion.**
- [x] **0B.1.13 — Test IdeaCard promotion creates identity once and preserves BoardItem continuity.**

- [x] **0B.1.GATE — Workspace semantics are sufficient to build Story Wall/Paper Edit without polluting Narrative IR.**

---

# 0B.2 — Outline

Purpose: compact hierarchical structural authoring and the first pressure test of the existing IR in a real editing UI.

## Rendering

- [x] **0B.2.1 — Render Sections.**
- [x] **0B.2.2 — Render optional Scenes within Sections.**
- [x] **0B.2.3 — Render direct Beats and Scene-contained Beats in the same Section.**
  - **Acceptance:** mixed hierarchy is visually distinguishable and navigable.

- [x] **0B.2.4 — Render useful Beat text and runtime information.**
  - title/summary as available;
  - derived approximate duration where useful.

## Editing

- [x] **0B.2.5 — Implement supported inline text edits.**
  - Section title;
  - Scene title;
  - Beat title/summary.
  - Use Narrative operations.

- [x] **0B.2.6 — Implement create Section action.**
- [x] **0B.2.7 — Implement create Scene action.**
- [x] **0B.2.8 — Implement create Beat under valid parent.**
  - **Acceptance:** newly created object identity appears in every subscribed surface.

## Structural movement

- [x] **0B.2.9 — Implement reorder within a parent.**
- [x] **0B.2.10 — Implement valid cross-parent Beat moves.**
- [x] **0B.2.11 — Implement Scene/structural moves required by normal Outline use.**
- [x] **0B.2.12 — Reject invalid drop/move targets with understandable feedback.**
  - **Evidence:** PR #21 verifies invalid structural targets are rejected without project mutation and produce domain feedback.

## Removal and runtime

- [x] **0B.2.13 — Implement deletion/removal actions needed by the spike.**
  - Surface warnings/relationship effects.
  - Avoid inventing separate UI semantics that contradict the domain operation contract.

- [x] **0B.2.14 — Implement runtime summaries.**
  - Project total.
  - Section/Beat-level summaries where useful.
  - Always derived from current Narrative IR.

## Tests

- [ ] **0B.2.15 — Test mixed Scene/direct-Beat rendering.**
  - **SUPERSEDED BY 0B OUTCOME:** PR #21 verifies the mixed hierarchy projection/model path. The planned visual-comprehension refinement is no longer an 0B blocker because the primary structured-authoring hypothesis was rejected on broader interaction-friction evidence.
- [x] **0B.2.16 — Test inline edit dispatches domain operation.**
- [x] **0B.2.17 — Test valid and invalid structural moves.**
- [x] **0B.2.18 — Test stable identity survives moves.**
- [x] **0B.2.19 — Test runtime updates after edits.**

- [x] **0B.2.GATE — Outline can author/restructure the canonical model without a UI-specific story representation.**
  - **Result:** semantic/model gate passed. Outline remains a specialized precision/inspection view under 0C.

---

# 0B.3 — Story Wall / Beat Board

Purpose: spatial story construction and recoverable alternatives without conflating board layout with narrative structure.

## Card projection

- [x] **0B.3.1 — Render canonical Beat cards.**
  - Canonical content from Narrative IR.
  - Layout/organization from Workspace.

- [x] **0B.3.2 — Render canonical Scene cards where useful.**
- [x] **0B.3.3 — Preserve shared stable-ID selection between board and other surfaces.**

## Spatial organization

- [x] **0B.3.4 — Implement free spatial positioning.**
  - Use approved drag mechanics.
  - Store positions in Workspace only.

- [x] **0B.3.5 — Implement parking-lot/alternate area.**
  - Cards can move into/out of parking without deleting canonical objects.
  - Visually distinguish parked/alternate material from active structural material.

- [ ] **0B.3.6 — Add lanes/groups if required to express structural or thematic organization.**
  - Do not add until an interaction actually needs them.
  - **CANCELLED:** no implemented Story Wall interaction required lanes/groups in Spike 0B.

- [ ] **0B.3.7 — Add optional card presentation metadata only when validated.**
  - color;
  - size;
  - rotation;
  - label/note.
  - Remain Workspace-owned.
  - **CANCELLED:** no validated 0B need. Speculative fields were removed in PR #17 rather than retained for future use.

## IdeaCards

- [x] **0B.3.8 — Implement create/edit/move/delete IdeaCards on the wall.**
- [x] **0B.3.9 — Implement explicit IdeaCard → Beat promotion.**
- [ ] **0B.3.10 — Implement IdeaCard → Scene promotion if the UX demonstrates a real need.**
  - **CANCELLED:** the 0B UX demonstrated a concrete need for Beat promotion only; no Scene-promotion evidence emerged.

## Structural ordering

- [x] **0B.3.11 — Implement an explicit structural-order interaction.**
  - Ordered lane, structural mode, explicit reorder affordance, or equivalent.
  - Arbitrary x/y position alone must not silently redefine narrative order.

- [x] **0B.3.12 — Dispatch structural wall moves through Narrative operations.**

## Tests

- [x] **0B.3.13 — Test free card movement leaves Narrative IR unchanged.**
- [x] **0B.3.14 — Test structural wall movement changes narrative order correctly.**
- [x] **0B.3.15 — Test parking vs delete distinction.**
- [x] **0B.3.16 — Test canonical text edit updates card while preserving layout.**
  - **Evidence:** PR #20 updates canonical Beat text and verifies the existing BoardItem x/y layout survives unchanged.
- [x] **0B.3.17 — Test IdeaCard promotion keeps one canonical identity and one appropriate BoardItem reference.**

- [x] **0B.3.GATE — Story Wall provides useful spatial organization without making layout canonical narrative state.**

---

# 0B.4 — AV Script

Purpose: production-oriented visual/audio authoring over Beat/Cue semantics.

## Rendering

- [x] **0B.4.1 — Render Beats as AV Script groups.**
- [x] **0B.4.2 — Render multiple Cues within each Beat.**
- [x] **0B.4.3 — Present Visual and Audio content side by side.**
  - Preserve Cue identity.
  - Do not flatten the model into anonymous table rows.

- [x] **0B.4.4 — Render authored and source-backed material distinctly.**

## Authoring

- [x] **0B.4.5 — Implement create Cue action.**
- [x] **0B.4.6 — Implement supported Cue/content edits.**
- [x] **0B.4.7 — Implement Cue reorder/move actions required for normal AV planning.**
- [x] **0B.4.8 — Implement Cue deletion where required.**
  - Route all structural changes through Narrative operations.

## Runtime

- [x] **0B.4.9 — Render explicit Cue duration where present.**
- [x] **0B.4.10 — Render derived Beat/project runtime feedback during authoring.**

## Terminology pressure test

- [ ] **0B.4.11 — Test whether users need to see the term `Cue`.**
  - Keep implementation identity independent from the final displayed label.
  - Record evidence for 0B assessment.
  - **SUPERSEDED BY 0B OUTCOME:** user-facing `Cue` terminology is now deferred until agent-mediated authoring shows where explicit AV precision is actually needed.

## Tests

- [x] **0B.4.12 — Test multiple Cue rendering/identity.**
  - **Evidence:** PR #15 verifies canonical multi-Cue Beat projection; PR #21 verifies Cue identity across surface switches and cross-Beat moves.
- [ ] **0B.4.13 — Test Visual/Audio editing dispatch.**
  - **PARTIAL / SUPERSEDED:** authored audio update dispatch is covered by PR #20 and content helper tests. Further direct-surface interaction coverage is not an 0B blocker after the primary-workflow pivot.
- [x] **0B.4.14 — Test authored/source-backed distinction.**
- [x] **0B.4.15 — Test Cue reorder/move and identity stability.**
- [x] **0B.4.16 — Test runtime feedback updates.**
- [ ] **0B.4.17 — Test changes are reflected in Outline/Story Wall where relevant.**
  - **PARTIAL / SUPERSEDED:** PR #20 verifies shared canonical propagation and runtime derivation. Further visible cross-surface refinement is deferred to specialized-view work after 0C evidence.

- [x] **0B.4.GATE — AV Script can author audiovisual realization without forcing additional narrative fragmentation.**

---

# 0B.5 — Paper Edit / Radio Edit

Purpose: footage-first/source-evidence-driven story construction while preserving source identity and ranges.

## Source presentation

- [x] **0B.5.1 — Render SourceExcerpt source identity.**
- [x] **0B.5.2 — Render source range/timing clearly.**
- [x] **0B.5.3 — Render source-backed wording as evidence rather than ordinary authored text.**

## Authored material

- [x] **0B.5.4 — Render authored VO/bridge material distinctly.**
- [x] **0B.5.5 — Allow supported authored bridge editing through Narrative operations.**

## Paper Edit behavior

- [x] **0B.5.6 — Arrange SourceExcerpt-backed material into narrative structure.**
  - Preserve source ranges and canonical source identity.

- [ ] **0B.5.7 — Implement Workspace organization required by Paper Edit.**
  - references/grouping/notes only as evidence justifies.
  - **CANCELLED:** the 0B Paper/Radio Edit projection required no additional Workspace state. Add it later only if new evidence produces a concrete need.

- [x] **0B.5.8 — Implement source excerpt reorder/attachment actions required by the fixture workflows.**

## Radio Edit behavior

- [x] **0B.5.9 — Implement audio-first sequencing presentation.**
- [x] **0B.5.10 — Show useful timing/runtime information for spoken sequence.**
- [x] **0B.5.11 — Provide a path to reveal/add visual Cue intent without creating a separate canonical document.**

## Tests

- [x] **0B.5.12 — Test SourceExcerpt wording cannot accidentally become authored mutable content.**
  - **Evidence:** PR #19 content-unit coverage is retained after PR #20 and verifies display-text edits return the original SourceExcerpt unchanged.
- [x] **0B.5.13 — Test source ranges survive narrative reorder.**
- [x] **0B.5.14 — Test authored bridge remains authored after movement/editing.**
- [x] **0B.5.15 — Test Paper/Radio changes propagate to other surfaces.**
  - **Evidence:** PR #20 verifies source-backed movement and authored edits remain in the one shared canonical project through surface/controller changes.

- [x] **0B.5.GATE — Footage-first authoring works over the same Narrative IR without losing evidence identity.**

---

# 0B.6 — Cross-surface validation

This is the core semantic Spike 0B proof. Individual surfaces were insufficient without this section.

## Continuous scenario

- [x] **0B.6.1 — Implement one continuous multi-surface validation flow.**

```text
Story Wall
   ↓
Outline
   ↓
AV Script
   ↓
Paper / Radio Edit
   ↓
Story Wall
```

The same application session and canonical project must be used throughout.
  - **Evidence:** PR #20 runs this exact sequence through one `SalaiController` and one project instance lineage.

## Identity and propagation

- [x] **0B.6.2 — Verify Beat identity survives all surface changes/edits.**
- [x] **0B.6.3 — Verify Cue identity survives all compatible surface changes/edits.**
  - **Evidence:** PR #21 preserves Cue identity/selection through surface switches and cross-Beat movement.
- [x] **0B.6.4 — Verify SourceExcerpt/source identity survives all relevant surface changes/edits.**
- [x] **0B.6.5 — Verify semantic edits appear in every relevant surface without export/import.**

## State boundaries

- [x] **0B.6.6 — Verify Workspace positions/grouping persist in memory across surface switches.**
- [x] **0B.6.7 — Verify Workspace-only changes do not mutate Narrative IR.**
- [x] **0B.6.8 — Verify narrative restructuring does not destroy unrelated Workspace organization.**

## Semantic distinctions

- [ ] **0B.6.9 — Verify authored vs sourced content remains visually and semantically distinct.**
  - **PARTIAL / SUPERSEDED:** semantic identity/preservation passes in PR #20. The original visual-unambiguity gate is preserved as an unpassed 0B UX criterion; source/provenance remains a hard requirement for 0C.
- [x] **0B.6.10 — Verify parking, removal from active structure, and deletion are not conflated.**
  - **Evidence:** PRs #14 and #20 verify parking is Workspace-only, structural movement is Narrative-owned, and canonical deletion removes the projected BoardItem.
- [x] **0B.6.11 — Verify runtime feedback is consistent across relevant surfaces.**

## Fixture coverage

- [x] **0B.6.12 — Run the product/branded fixture through relevant surfaces.**
- [x] **0B.6.13 — Run the interview/corporate fixture through relevant surfaces.**
- [x] **0B.6.14 — Run the footage-first documentary fixture through relevant surfaces.**

## Automated boundary tests

- [x] **0B.6.15 — Add automated cross-surface state propagation test(s).**
- [x] **0B.6.16 — Add automated Workspace-vs-Narrative isolation test(s).**
- [x] **0B.6.17 — Add automated authored-vs-source evidence preservation test(s).**

- [x] **0B.6.GATE — One canonical project works continuously across all four authoring paradigms.**
  - **Result:** automated semantic/state gate passed. This is the part of 0B retained by the new direction.

---

# 0B.7 — Assessment and decisions

This section records what 0B actually taught us. The original plan expected all local human questions to be resolved before 0C; the first human test instead exposed a higher-order workflow failure and changed the next validation target.

## Workspace decisions

- [x] **0B.7.1 — Record the minimum Workspace schema actually required by the UI.**
  - Remove unused speculative fields.
  - Document newly justified fields.
  - **Decision:** retain Board/BoardItem identity, Scene/Beat references or IdeaCard, x/y, and parking state only. See `spike-0b-assessment.md`.

- [ ] **0B.7.2 — Decide Story Wall spatial-vs-structural interaction.**
  - Record which interaction users understand and which implementation becomes the baseline.
  - **SUPERSEDED AS AN 0B BLOCKER:** technical baseline remains free x/y → Workspace and explicit Story Order → Narrative. Final gesture UX is deferred until Story Wall's role is revalidated as an optional specialized view.

- [x] **0B.7.3 — Decide whether Paper Edit needs domain state beyond Workspace references.**
  - Prefer no new domain object without concrete evidence.
  - **Decision:** no additional Paper Edit domain or Workspace state is justified by 0B implementation evidence.

## Narrative-model pressure-test decisions

- [ ] **0B.7.4 — Decide mixed Scene/direct-Beat hierarchy outcome.**
  - keep;
  - constrain;
  - revise Narrative IR with evidence.
  - **SUPERSEDED AS AN 0B BLOCKER:** implementation supports the mixed hierarchy. 0C will reveal whether users ever need to manage this hierarchy explicitly in the primary flow.

- [ ] **0B.7.5 — Decide user-facing `Cue` terminology per surface.**
  - **SUPERSEDED AS AN 0B BLOCKER:** keep `Cue` as domain identity; decide visible terminology only in specialized views where it proves useful.

- [x] **0B.7.6 — Record any Narrative IR failures exposed by real authoring UX.**
  - Do not hide them with workflow-specific state.
  - If IR changes are required, update `narrative-ir-spec.md` and tests explicitly.
  - **Result:** no semantic failure was exposed by 0B fixtures/authoring implementation. The human failure was interaction burden rather than representational inability.

## Interaction/system decisions

- [x] **0B.7.7 — Decide shared selection/navigation behavior.**
  - **Decision:** canonical selection remains `{ type, id }`; preserve across compatible surface changes and clear when the selected canonical object is deleted.
- [x] **0B.7.8 — Decide undo/history requirement for the next phase.**
  - domain undo;
  - Workspace undo;
  - coordinated command history;
  - or explicitly defer with evidence.
  - **0B decision:** defer until the next interaction required concrete semantics.
  - **Outcome after human test:** 0C now requires grouped, user-visible agent action batches with undo/revert because one creative instruction may produce several canonical operations.

## Assessment documentation

- [x] **0B.7.9 — Create `spike-0b-assessment.md`.**
  - pass / partial / fail;
  - evidence;
  - workflow findings;
  - Workspace findings;
  - Narrative IR findings;
  - decisions;
  - remaining pressure points.
  - **Final result:** `CLOSED — semantic architecture passes; direct structured authoring fails the creative-friction test`.

- [ ] **0B.7.10 — Resolve RFC 0001 based on 0B evidence.**
  - accepted / rejected / superseded;
  - create an ADR only if an accepted architectural decision needs one.
  - **SUPERSEDED AS AN 0B CLOSURE TASK:** RFC 0001 remains Proposed with the one-IR/multiple-view architecture supported by 0B. RFC 0002 now tests the new agent-mediated interaction layer; final architectural disposition follows 0C evidence.

- [ ] **0B.7.11 — Update roadmap/current-focus docs.**
  - `README.md`;
  - `docs/README.md`;
  - `mvp.md`;
  - `backlog.md`;
  - other contracts only if evidence changed them.
  - **CLOSURE WORK:** the agent-mediated direction PR updates these documents and moves the active milestone to 0C. This checkbox is intentionally left as historical task state rather than rewritten after the fact.

- [ ] **0B.7.12 — Update this tracker to final 0B status/evidence.**
  - **CLOSURE WORK:** this historical status/closure annotation records the final mixed result without converting failed/superseded UX gates into passes.

---

# 0B.GATE — Original spike completion gate

The original 0B gate below **did not pass as a product UX gate**, and it is intentionally not being cosmetically completed.

The semantic/state conditions passed. The first human UX test exposed a more fundamental failure—too much direct model-management interaction—before the remaining recognizability/terminology questions were resolved. Those local criteria are preserved below as unpassed/superseded evidence.

- [ ] **0B.GATE.1 — Story Wall is recognizable and usable for structural/spatial validation.**
  - **SUPERSEDED AS PRIMARY-WORKFLOW GATE:** Story Wall remains a specialized view; final polish depends on its role after 0C.
- [ ] **0B.GATE.2 — Outline is recognizable and usable for hierarchical authoring.**
  - **SUPERSEDED AS PRIMARY-WORKFLOW GATE:** Outline remains a specialized precision/inspection view.
- [ ] **0B.GATE.3 — AV Script is recognizable and usable for visual/audio authoring.**
  - **SUPERSEDED AS PRIMARY-WORKFLOW GATE:** AV Script remains a specialized AV precision view.
- [ ] **0B.GATE.4 — Paper/Radio Edit is recognizable and usable for source-backed authoring.**
  - **SUPERSEDED AS PRIMARY-WORKFLOW GATE:** Paper/Radio remains a specialized source-evidence view; source-first primary authoring moves into 0C.
- [x] **0B.GATE.5 — All four surfaces manipulate one canonical Narrative IR without duplicate story documents.**
- [x] **0B.GATE.6 — Workspace organization remains separate from Narrative IR semantics.**
- [x] **0B.GATE.7 — Stable canonical identity survives cross-surface editing.**
- [ ] **0B.GATE.8 — Authored and source-backed content remain unambiguous.**
  - **PARTIAL:** semantic distinction passes; the original direct-surface visual-unambiguity criterion was not completed. Source/provenance is retained as a hard 0C requirement.
- [ ] **0B.GATE.9 — Spatial/structural gestures map predictably to Workspace or Narrative operations.**
  - **PARTIAL:** technical mapping passes; the original user-predictability criterion was superseded by the broader interaction-friction failure.
- [x] **0B.GATE.10 — No workflow-specific workaround hides a genuine Narrative IR semantic failure.**
- [x] **0B.GATE.11 — `spike-0b-assessment.md` records the result and decisions.**
- [x] **0B.GATE.12 — CI/typecheck/tests/build are green for the final 0B implementation state.**
  - **CI baseline:** install → typecheck → unit/acceptance tests → build. Chromium/browser automation is disabled.

## Closure rule

Spike 0B is closed as a **discovery spike with a mixed result**, not as a passed primary-authoring UX gate.

Retained conclusions:

- canonical Narrative IR / synchronized-view architecture: **pass**;
- Workspace separation: **pass**;
- stable/source identity: **pass**;
- direct structured surfaces as the primary creative workflow: **fail**;
- next hypothesis: **Spike 0C — Agent-Mediated Authoring**.

# Completion evidence log

| Area | Evidence | Result |
| --- | --- | --- |
| 0B.0 Foundation | PR #12 — React/Vite app, public `@salai/script-model` integration, fixture controller, canonical operation dispatch, visible domain feedback. PRs #14–#16 — shared selection/controller across all four surfaces. PR #17 — simplified shared boundary. PR #21 — relationship consequence/controller acceptance. Storybook and Browser Mode explicitly cancelled for 0B. | Gate passed. |
| 0B.1 Workspace | PR #12 — in-memory Workspace/Board/BoardItem/IdeaCard model and isolation tests. PR #14 — free spatial movement, parking, explicit structural order, IdeaCard promotion. PR #17 — removed speculative fields. PR #20 — cross-surface isolation/layout preservation. | Semantic gate passed. |
| 0B.2 Outline | PR #12 — Section/Scene/Beat authoring and runtime. PR #21 — mixed hierarchy projection, valid/invalid moves, stable identity and runtime acceptance. | Semantic gate passed; primary-workflow hierarchy polish superseded by 0C direction. |
| 0B.3 Story Wall | PR #14 — Beat/Scene cards, DnD positioning, parking, IdeaCards, promotion, structural order. PR #17 — reduced Workspace state. PR #20 — canonical edit preserves board layout and parking/delete boundaries. | Semantic gate passed; final specialized-view gesture UX deferred. |
| 0B.4 AV Script | PR #15 — Beat/Cue projection, Visual/Audio lanes, authored/source distinction, Cue authoring/runtime. PR #21 — Cue identity across surfaces/moves. | Semantic implementation gate passed; visible terminology deferred to specialized-view evidence. |
| 0B.5 Paper/Radio | PR #16 — source identity/ranges, authored bridges, audio-first sequence, reorder/attachment and visual-intent path. PR #20 — source/authored preservation and cross-surface acceptance. | Semantic gate passed; source-first primary interaction moves to 0C. |
| 0B.6 Cross-surface | PR #20 — continuous surface flow, Workspace isolation/persistence, source preservation, runtime and all fixtures. PR #21 — Cue identity continuation. | Automated semantic/state gate passed. |
| 0B.7 Assessment | `spike-0b-assessment.md` + first human UX test | Closed: semantic architecture passes; direct structured authoring fails creative-friction test. |
| 0B.GATE | Automated semantic/state conditions pass; original structured-primary UX gate did not pass. | Closed mixed result; superseded by Spike 0C agent-mediated authoring hypothesis. |
