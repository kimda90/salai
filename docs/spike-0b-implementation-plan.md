# Spike 0B — Implementation Plan and Execution Tracker

## Status

Canonical task-level execution tracker for **Spike 0B — Familiar Authoring UX**.

This document owns:

- implementation task breakdown;
- task ordering and dependencies;
- task completion state;
- task-level acceptance criteria;
- implementation evidence after tasks are merged.

It does **not** redefine product/workflow/domain semantics.

Canonical contracts remain:

- [`authoring-ux-spec.md`](authoring-ux-spec.md) — Spike 0B technical/UX contract;
- [`workflows.md`](workflows.md) — creative workflow behavior;
- [`narrative-ir-spec.md`](narrative-ir-spec.md) — Narrative IR semantics and operations;
- [`architecture.md`](architecture.md) — system/infrastructure boundaries;
- [`mvp.md`](mvp.md) — phase sequence;
- [`backlog.md`](backlog.md) — NOW/NEXT/LATER prioritization.

If implementation evidence changes a contract, update the canonical contract and this tracker in the same PR.

# Tracker rules

## Task state

Use GitHub task-list syntax:

- `[ ]` — not complete;
- `[x]` — implemented, merged, and verified.

Task IDs are stable. Do not renumber existing IDs after implementation begins.

If a task becomes unnecessary, leave it unchecked and annotate it with `CANCELLED:` or `SUPERSEDED:` plus the decision/evidence. If blocked, leave it unchecked and annotate it with `BLOCKED:`.

## When a task may be checked

A task may change to `[x]` only when:

1. the implementation is merged to `main`;
2. relevant typecheck/tests/build pass;
3. the task-specific acceptance criteria below pass;
4. affected documentation/contracts are updated;
5. completion evidence is added beneath the task or in the evidence log.

A task that is partially implemented stays unchecked.

## Implementation PR rule

Every Spike 0B implementation PR should update this file in the same PR:

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

The spike passes only if the same canonical story can move through all four surfaces without export/import, duplicate story documents, or workflow-specific semantic workarounds.

# Non-goals

Do not pull these into 0B unless a minimal mock is strictly required to answer the workflow validation question:

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

Current intended UI infrastructure:

```text
React + TypeScript + Vite
├── shadcn/ui + Base UI        reusable UI primitives
├── Pragmatic Drag and Drop    drag/reorder mechanics
├── TanStack Table             AV Script/tabular mechanics where useful
├── TanStack Virtual           only when list size requires it
├── Storybook                  isolated workflow/fixture development
└── Vitest Browser Mode        browser/component interaction tests
```

Libraries provide mechanics. Salai owns the interpretation of those mechanics into Workspace changes or Narrative IR operations.

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

Some tasks within adjacent sections may be developed together when that reduces duplication, but completion must still be recorded against the individual acceptance criteria.

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

- [ ] **0B.0.3 — Establish the approved UI primitives/dependencies.**
  - Add shadcn/ui + Base UI only as needed by implemented surfaces.
  - Add Pragmatic Drag and Drop for drag/reorder mechanics.
  - Add TanStack Table when AV Script work begins if it materially helps.
  - Add TanStack Virtual only if real fixture size justifies it.
  - Confirm dependency licenses before adoption.
  - **Acceptance:** no tldraw, React Flow, rich-text framework, or agent framework is introduced without new documented evidence.

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

- [ ] **0B.0.6 — Configure Vitest Browser Mode for UI interactions.**
  - Keep existing pure model tests unchanged.
  - **Acceptance:** at least one browser-level smoke test runs in CI/local validation.

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

- [ ] **0B.0.10 — Implement stable-ID shared selection/navigation.**
  - Selection identifies canonical object type + stable ID.
  - Switching surfaces preserves selection when that object is represented there.
  - **Acceptance:** the same selected Beat can be recognized across at least Outline and Story Wall/AV Script.

## Foundation tests

- [ ] **0B.0.11 — Add controller/fixture smoke tests.**
  - fixture load/reset;
  - semantic operation dispatch;
  - warning/error propagation;
  - canonical state update visible to two test consumers.

- [ ] **0B.0.GATE — Shared foundation is ready for workflow surfaces.**
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

- [ ] **0B.1.4 — Determine initial Workspace metadata fields.**
  - Start with only fields needed for implemented interactions.
  - Candidate fields: x/y, width/height, color, rotation, label, note, lane/group, parking state.
  - Mark unused speculative fields for removal during assessment.

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

- [ ] **0B.1.7 — Implement explicit IdeaCard promotion.**
  - Promote to Beat and/or Scene where supported by the chosen UX.
  - Use Narrative operations to create canonical identity.
  - Replace/link the BoardItem to that canonical identity.
  - **Acceptance:** promotion creates canonical identity exactly once.

## Intent interpretation

- [x] **0B.1.8 — Define the gesture-intent mapping boundary.**
  - Input: surface/context + gesture result.
  - Output: Workspace operation or Narrative operation intent.
  - Drag-library event types do not enter Narrative IR/domain types.

- [ ] **0B.1.9 — Implement explicit Workspace-vs-Narrative movement semantics.**
  - Free spatial movement → Workspace only.
  - Explicit structural movement → Narrative operation.
  - Parking → Workspace organization unless a separate explicit semantic removal action is invoked.

## Workspace tests

- [x] **0B.1.10 — Test free movement does not change Narrative IR.**
- [ ] **0B.1.11 — Test structural movement emits expected Narrative operation.**
- [x] **0B.1.12 — Test parking is not deletion.**
- [ ] **0B.1.13 — Test IdeaCard promotion creates identity once and preserves BoardItem continuity.**

- [ ] **0B.1.GATE — Workspace semantics are sufficient to build Story Wall/Paper Edit without polluting Narrative IR.**

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
- [ ] **0B.2.12 — Reject invalid drop/move targets with understandable feedback.**

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
- [ ] **0B.2.16 — Test inline edit dispatches domain operation.**
- [ ] **0B.2.17 — Test valid and invalid structural moves.**
- [ ] **0B.2.18 — Test stable identity survives moves.**
- [ ] **0B.2.19 — Test runtime updates after edits.**

- [ ] **0B.2.GATE — Outline can author/restructure the canonical model without a UI-specific story representation.**

---

# 0B.3 — Story Wall / Beat Board

Purpose: spatial story construction and recoverable alternatives without conflating board layout with narrative structure.

## Card projection

- [ ] **0B.3.1 — Render canonical Beat cards.**
  - Canonical content from Narrative IR.
  - Layout/organization from Workspace.

- [ ] **0B.3.2 — Render canonical Scene cards where useful.**
- [ ] **0B.3.3 — Preserve shared stable-ID selection between board and other surfaces.**

## Spatial organization

- [ ] **0B.3.4 — Implement free spatial positioning.**
  - Use approved drag mechanics.
  - Store positions in Workspace only.

- [ ] **0B.3.5 — Implement parking-lot/alternate area.**
  - Cards can move into/out of parking without deleting canonical objects.
  - Visually distinguish parked/alternate material from active structural material.

- [ ] **0B.3.6 — Add lanes/groups if required to express structural or thematic organization.**
  - Do not add until an interaction actually needs them.

- [ ] **0B.3.7 — Add optional card presentation metadata only when validated.**
  - color;
  - size;
  - rotation;
  - label/note.
  - Remain Workspace-owned.

## IdeaCards

- [ ] **0B.3.8 — Implement create/edit/move/delete IdeaCards on the wall.**
- [ ] **0B.3.9 — Implement explicit IdeaCard → Beat promotion.**
- [ ] **0B.3.10 — Implement IdeaCard → Scene promotion if the UX demonstrates a real need.**

## Structural ordering

- [ ] **0B.3.11 — Implement an explicit structural-order interaction.**
  - Ordered lane, structural mode, explicit reorder affordance, or equivalent.
  - Arbitrary x/y position alone must not silently redefine narrative order.

- [ ] **0B.3.12 — Dispatch structural wall moves through Narrative operations.**

## Tests

- [ ] **0B.3.13 — Test free card movement leaves Narrative IR unchanged.**
- [ ] **0B.3.14 — Test structural wall movement changes narrative order correctly.**
- [ ] **0B.3.15 — Test parking vs delete distinction.**
- [ ] **0B.3.16 — Test canonical text edit updates card while preserving layout.**
- [ ] **0B.3.17 — Test IdeaCard promotion keeps one canonical identity and one appropriate BoardItem reference.**

- [ ] **0B.3.GATE — Story Wall provides useful spatial organization without making layout canonical narrative state.**

---

# 0B.4 — AV Script

Purpose: production-oriented visual/audio authoring over Beat/Cue semantics.

## Rendering

- [ ] **0B.4.1 — Render Beats as AV Script groups.**
- [ ] **0B.4.2 — Render multiple Cues within each Beat.**
- [ ] **0B.4.3 — Present Visual and Audio content side by side.**
  - Preserve Cue identity.
  - Do not flatten the model into anonymous table rows.

- [ ] **0B.4.4 — Render authored and source-backed material distinctly.**

## Authoring

- [ ] **0B.4.5 — Implement create Cue action.**
- [ ] **0B.4.6 — Implement supported Cue/content edits.**
- [ ] **0B.4.7 — Implement Cue reorder/move actions required for normal AV planning.**
- [ ] **0B.4.8 — Implement Cue deletion where required.**
  - Route all structural changes through Narrative operations.

## Runtime

- [ ] **0B.4.9 — Render explicit Cue duration where present.**
- [ ] **0B.4.10 — Render derived Beat/project runtime feedback during authoring.**

## Terminology pressure test

- [ ] **0B.4.11 — Test whether users need to see the term `Cue`.**
  - Keep implementation identity independent from the final displayed label.
  - Record evidence for 0B assessment.

## Tests

- [ ] **0B.4.12 — Test multiple Cue rendering/identity.**
- [ ] **0B.4.13 — Test Visual/Audio editing dispatch.**
- [ ] **0B.4.14 — Test authored/source-backed distinction.**
- [ ] **0B.4.15 — Test Cue reorder/move and identity stability.**
- [ ] **0B.4.16 — Test runtime feedback updates.**
- [ ] **0B.4.17 — Test changes are reflected in Outline/Story Wall where relevant.**

- [ ] **0B.4.GATE — AV Script can author audiovisual realization without forcing additional narrative fragmentation.**

---

# 0B.5 — Paper Edit / Radio Edit

Purpose: footage-first/source-evidence-driven story construction while preserving source identity and ranges.

## Source presentation

- [ ] **0B.5.1 — Render SourceExcerpt source identity.**
- [ ] **0B.5.2 — Render source range/timing clearly.**
- [ ] **0B.5.3 — Render source-backed wording as evidence rather than ordinary authored text.**

## Authored material

- [ ] **0B.5.4 — Render authored VO/bridge material distinctly.**
- [ ] **0B.5.5 — Allow supported authored bridge editing through Narrative operations.**

## Paper Edit behavior

- [ ] **0B.5.6 — Arrange SourceExcerpt-backed material into narrative structure.**
  - Preserve source ranges and canonical source identity.

- [ ] **0B.5.7 — Implement Workspace organization required by Paper Edit.**
  - references/grouping/notes only as evidence justifies.

- [ ] **0B.5.8 — Implement source excerpt reorder/attachment actions required by the fixture workflows.**

## Radio Edit behavior

- [ ] **0B.5.9 — Implement audio-first sequencing presentation.**
- [ ] **0B.5.10 — Show useful timing/runtime information for spoken sequence.**
- [ ] **0B.5.11 — Provide a path to reveal/add visual Cue intent without creating a separate canonical document.**

## Tests

- [ ] **0B.5.12 — Test SourceExcerpt wording cannot accidentally become authored mutable content.**
- [ ] **0B.5.13 — Test source ranges survive narrative reorder.**
- [ ] **0B.5.14 — Test authored bridge remains authored after movement/editing.**
- [ ] **0B.5.15 — Test Paper/Radio changes propagate to other surfaces.**

- [ ] **0B.5.GATE — Footage-first authoring works over the same Narrative IR without losing evidence identity.**

---

# 0B.6 — Cross-surface validation

This is the core Spike 0B proof. Individual surfaces are insufficient without this section.

## Continuous scenario

- [ ] **0B.6.1 — Implement one continuous multi-surface validation flow.**

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

## Identity and propagation

- [ ] **0B.6.2 — Verify Beat identity survives all surface changes/edits.**
- [ ] **0B.6.3 — Verify Cue identity survives all compatible surface changes/edits.**
- [ ] **0B.6.4 — Verify SourceExcerpt/source identity survives all relevant surface changes/edits.**
- [ ] **0B.6.5 — Verify semantic edits appear in every relevant surface without export/import.**

## State boundaries

- [ ] **0B.6.6 — Verify Workspace positions/grouping persist in memory across surface switches.**
- [ ] **0B.6.7 — Verify Workspace-only changes do not mutate Narrative IR.**
- [ ] **0B.6.8 — Verify narrative restructuring does not destroy unrelated Workspace organization.**

## Semantic distinctions

- [ ] **0B.6.9 — Verify authored vs sourced content remains visually and semantically distinct.**
- [ ] **0B.6.10 — Verify parking, removal from active structure, and deletion are not conflated.**
- [ ] **0B.6.11 — Verify runtime feedback is consistent across relevant surfaces.**

## Fixture coverage

- [ ] **0B.6.12 — Run the product/branded fixture through relevant surfaces.**
- [ ] **0B.6.13 — Run the interview/corporate fixture through relevant surfaces.**
- [ ] **0B.6.14 — Run the footage-first documentary fixture through relevant surfaces.**

## Automated boundary tests

- [ ] **0B.6.15 — Add automated cross-surface state propagation test(s).**
- [ ] **0B.6.16 — Add automated Workspace-vs-Narrative isolation test(s).**
- [ ] **0B.6.17 — Add automated authored-vs-source evidence preservation test(s).**

- [ ] **0B.6.GATE — One canonical project works continuously across all four authoring paradigms.**

---

# 0B.7 — Assessment and decisions

Do not start 0C until this section records what 0B actually taught us.

## Workspace decisions

- [ ] **0B.7.1 — Record the minimum Workspace schema actually required by the UI.**
  - Remove unused speculative fields.
  - Document newly justified fields.

- [ ] **0B.7.2 — Decide Story Wall spatial-vs-structural interaction.**
  - Record which interaction users understand and which implementation becomes the baseline.

- [ ] **0B.7.3 — Decide whether Paper Edit needs domain state beyond Workspace references.**
  - Prefer no new domain object without concrete evidence.

## Narrative-model pressure-test decisions

- [ ] **0B.7.4 — Decide mixed Scene/direct-Beat hierarchy outcome.**
  - keep;
  - constrain;
  - revise Narrative IR with evidence.

- [ ] **0B.7.5 — Decide user-facing `Cue` terminology per surface.**

- [ ] **0B.7.6 — Record any Narrative IR failures exposed by real authoring UX.**
  - Do not hide them with workflow-specific state.
  - If IR changes are required, update `narrative-ir-spec.md` and tests explicitly.

## Interaction/system decisions

- [ ] **0B.7.7 — Decide shared selection/navigation behavior.**
- [ ] **0B.7.8 — Decide undo/history requirement for the next phase.**
  - domain undo;
  - Workspace undo;
  - coordinated command history;
  - or explicitly defer with evidence.

## Assessment documentation

- [ ] **0B.7.9 — Create `spike-0b-assessment.md`.**
  - pass / partial / fail;
  - evidence;
  - workflow findings;
  - Workspace findings;
  - Narrative IR findings;
  - decisions;
  - remaining pressure points.

- [ ] **0B.7.10 — Resolve RFC 0001 based on 0B evidence.**
  - accepted / rejected / superseded;
  - create an ADR only if an accepted architectural decision needs one.

- [ ] **0B.7.11 — Update roadmap/current-focus docs.**
  - `README.md`;
  - `docs/README.md`;
  - `mvp.md`;
  - `backlog.md`;
  - other contracts only if evidence changed them.

- [ ] **0B.7.12 — Update this tracker to final 0B status/evidence.**

---

# 0B.GATE — Spike completion

Spike 0B is complete only when all required tasks above are either completed or explicitly cancelled/superseded with evidence, and the following conditions hold:

- [ ] **0B.GATE.1 — Story Wall is recognizable and usable for structural/spatial validation.**
- [ ] **0B.GATE.2 — Outline is recognizable and usable for hierarchical authoring.**
- [ ] **0B.GATE.3 — AV Script is recognizable and usable for visual/audio authoring.**
- [ ] **0B.GATE.4 — Paper/Radio Edit is recognizable and usable for source-backed authoring.**
- [ ] **0B.GATE.5 — All four surfaces manipulate one canonical Narrative IR without duplicate story documents.**
- [ ] **0B.GATE.6 — Workspace organization remains separate from Narrative IR semantics.**
- [ ] **0B.GATE.7 — Stable canonical identity survives cross-surface editing.**
- [ ] **0B.GATE.8 — Authored and source-backed content remain unambiguous.**
- [ ] **0B.GATE.9 — Spatial/structural gestures map predictably to Workspace or Narrative operations.**
- [ ] **0B.GATE.10 — No workflow-specific workaround hides a genuine Narrative IR semantic failure.**
- [ ] **0B.GATE.11 — `spike-0b-assessment.md` records the result and decisions.**
- [ ] **0B.GATE.12 — CI/typecheck/tests/build are green for the final 0B state.**

When these are satisfied, mark Spike 0B complete in `mvp.md`/`backlog.md`, update the current project focus, and move to the next validated milestone.

# Completion evidence log

Add concise phase/subphase evidence here as work lands. Keep detailed implementation discussion in PRs and assessment documents.

| Area | Evidence | Result |
| --- | --- | --- |
| 0B.0 Foundation | PR #12 — React/Vite app, public `@salai/script-model` integration, fixture controller, canonical operation dispatch, visible domain feedback; CI typecheck/tests/build green. | Partial |
| 0B.1 Workspace | PR #12 — in-memory Workspace/Board/BoardItem/IdeaCard model, Workspace-only move/parking/IdeaCard operations, movement-intent boundary, isolation tests. | Partial |
| 0B.2 Outline | PR #12 — mixed Section/Scene/Beat rendering, inline domain edits, create/move/delete actions, cross-parent movement, derived runtime. | Partial |
| 0B.3 Story Wall | — | Pending |
| 0B.4 AV Script | — | Pending |
| 0B.5 Paper/Radio | — | Pending |
| 0B.6 Cross-surface | — | Pending |
| 0B.7 Assessment | — | Pending |
| 0B.GATE | — | Pending |
