# Spike 0E — Semantic Editorial Interaction Depth Implementation Plan

## Status

**Current validation iteration — SHAPING ACCEPTED; implementation ready to start at 0E.0.**

`0E.SHAPE.GATE` was accepted on September 2, 2026 through RFC 0003. Implementation must follow the accepted interaction contract and must not silently resolve the RFC's five deferred questions.

This file is the canonical execution tracker for Spike 0E. It owns 0E task numbering, implementation order, completion state, and exit evidence. It does **not** own unresolved product semantics.

Shaping inputs/contracts:

- 0D evidence: [`spike-0d-assessment.md`](spike-0d-assessment.md)
- accepted cross-cutting decision: [`rfcs/0003-semantic-editorial-interaction-model.md`](rfcs/0003-semantic-editorial-interaction-model.md)
- accepted observable interaction contract: [`editorial-interaction.md`](editorial-interaction.md)
- canonical Narrative IR: [`narrative-ir-spec.md`](narrative-ir-spec.md)
- roadmap: [`mvp.md`](mvp.md)

## Goal

Make the temporal environment deep enough to fairly test Salai's semantic-editorial product thesis **without building a specialist NLE**.

## Validation question

> **If Salai provides one context-preserving hierarchical timeline plus the minimum useful canonical rough-editing grammar, do its semantic objects materially improve structural editing compared with generic clip manipulation?**

## Why 0E exists

0D passed the underlying architecture tests but failed the human interaction gate. The user could watch the assembly and the external harness worked, but direct editing was too shallow and fragmented to be meaningful.

0E must address exactly that evidence:

- semantic-level switching lost context;
- selected objects exposed too little editing;
- new Beats/Cues/material could not be created in temporal context;
- multiple visual/audio blocks per Cue were not practically exposed;
- multi-selection was missing;
- source I/O and split/blade grammar were insufficient;
- spacebar transport was missing;
- fixed-frequency validation audio was distracting.

## Shaped 0E baseline

Under accepted RFC 0003, implementation works from these constraints:

- one hierarchical temporal context exposes Section → Beat → Cue → all ContentBlocks;
- Cue is the canonical narrative-time interval;
- ordinary ContentBlocks share the Cue interval and do not gain hidden independent offsets/durations;
- SourceExcerpt owns source I/O independently from Cue narrative duration;
- reorders and Cue-duration changes ripple later derived narrative time;
- selection, multi-selection, viewport, playhead, and expand/collapse remain non-canonical interaction state;
- inspector edits canonical semantic properties, not engine fields;
- creation resolves to a valid semantic parent/insertion point before commit;
- direct gestures compile to existing canonical operations/batches wherever possible;
- Beat split/merge are supported by existing canonical operations;
- Cue split, SourceExcerpt split, independent within-Cue timing, intentional black-vs-missing, and broad cross-parent multi-move remain RFC-scoped deferred questions until explicitly resolved;
- timeline-editor and Elah remain replaceable adapters;
- external harness remains on the validated existing machine boundary.

## Hard boundaries

- `@salai/script-model` remains canonical.
- `SalaiProjectService` remains the human/machine mutation boundary.
- No engine-owned edited document may become project truth.
- Do not add a canonical operation merely to mirror an editor gesture if existing operations can express it safely.
- Do not implement deferred RFC behavior by silently persisting UI/engine state.
- Do not add provider/model/session/runtime code.
- Do not add Phase 1 desktop/persistence infrastructure.
- Do not add Production Graph, Resolve execution/interchange, GenAI execution, Story Spine canvas, color, VFX, multicam, keyframes/effects, full audio post, mastering, delivery, CRDT/event sourcing, or a second machine protocol/runtime.

# Merge sequence

```text
0E.SHAPE  Interaction/domain contract review        [complete]
    ↓
0E.0      Interaction foundation + evaluation noise [current]
    ↓
0E.1      Hierarchical semantic timeline
    ↓
0E.2      Selection / inspector / creation in time
    ↓
0E.3      Multiple material + multi-selection
    ↓
0E.4      Minimum canonical editing grammar
    ↓
0E.5      Human validation
    ↓
0E.GATE
```

---

# 0E.SHAPE — Product / interaction contract

## Goal

Prevent implementation from deciding product semantics accidentally.

- [x] **0E.SHAPE.1 — Record 0D human evidence and close 0D mixed.**
  - `spike-0d-assessment.md` records playback/agent success and direct-editor failure.
- [x] **0E.SHAPE.2 — Inventory existing Narrative IR capabilities relevant to editing.**
  - current create/update/move/delete vocabulary;
  - `moveBlock`;
  - multiple Cue visual/audio block arrays;
  - `splitBeat` / `mergeBeats`;
  - `trimSourceExcerpt`;
  - Cue duration semantics;
  - atomic operation batches.
- [x] **0E.SHAPE.3 — Write RFC 0003 for the cross-cutting temporal interaction model.**
- [x] **0E.SHAPE.4 — Write `editorial-interaction.md` as the observable direct-edit contract.**
- [x] **0E.SHAPE.5 — Normalize living docs around 0D closed/mixed and 0E current.**
- [x] **0E.SHAPE.6 — Keep unresolved semantics only in RFC 0003.**
- [x] **0E.SHAPE.7 — Review RFC 0003 and classify non-blocking questions as explicitly deferred.**
- [x] **0E.SHAPE.GATE — Accept the shaped 0E interaction contract for implementation.**

Evidence: RFC 0003 was accepted on September 2, 2026. The hierarchical temporal interaction direction and `editorial-interaction.md` contract are binding for 0E. The five questions below remain deliberately deferred and are not implicitly resolved by acceptance.

### Deferred RFC questions that do not block initial slices unless the implementation task reaches them

1. Cue split semantics.
2. SourceExcerpt split composition vs dedicated operation.
3. Independent within-Cue media timing.
4. Intentional black vs missing realization identity.
5. Broad cross-parent grouped moves.

0E.0–0E.3 may proceed while individual questions above remain deferred **only if those slices do not implement the unresolved behavior**. 0E.4 must not implement an unresolved split/timing behavior without resolving its RFC question first.

---

# 0E.0 — Interaction foundation and evaluation noise

## Goal

Remove non-product friction and prove the existing adapters can host the shaped interaction without changing canonical state ownership.

- [ ] **0E.0.1 — Add contract tests for gesture/inspector action → canonical operation compilation.**
  - update Section/Scene/Beat/Cue/block;
  - create Section/Beat/Cue/block;
  - move Section/Beat/Cue/block;
  - Cue explicit-duration update;
  - SourceExcerpt source I/O trim;
  - Beat split/merge;
  - delete;
  - grouped atomic batch;
  - seek/zoom/selection/expand as non-canonical state.
- [ ] **0E.0.2 — Verify timeline adapter feasibility for nested rows / custom rendering / controlled selection.**
  - if current adapter cannot cleanly express the shaped contract, replace/wrap it here rather than distorting Salai semantics.
- [ ] **0E.0.3 — Add Space play/pause without interfering with text inputs or focused controls.**
- [ ] **0E.0.4 — Replace fixed-frequency validation audio with non-distracting, semantically distinguishable deterministic local media.**
- [ ] **0E.0.5 — Keep the fixture self-contained and deterministic in CI.**
- [ ] **0E.0.6 — Confirm no new canonical state/dependency model is introduced merely for UI mechanics.**
- [ ] **0E.0.GATE — Evaluation noise is removed and the adapter/operation boundary can support the shaped contract without semantic compromise.**

---

# 0E.1 — Hierarchical semantic timeline

## Goal

Keep global temporal context while exposing nested semantic structure on one shared time axis.

- [ ] **0E.1.1 — Render Script/Section/Beat/Cue bands from the existing timeline projection.**
- [ ] **0E.1.2 — Render every visual/audio ContentBlock and explicit missing realization beneath its Cue.**
- [ ] **0E.1.3 — Keep Cue-owned timing: ordinary blocks align to the Cue interval; SourceExcerpt shows source metadata without engine-owned narrative offsets.**
- [ ] **0E.1.4 — Add expand/collapse per hierarchy branch as non-canonical state.**
- [ ] **0E.1.5 — Keep surrounding story visible when focusing/selecting nested objects.**
- [ ] **0E.1.6 — Keep horizontal viewport zoom separate from semantic expand/collapse.**
- [ ] **0E.1.7 — Preserve one playhead/scrub coordinate through hierarchy changes.**
- [ ] **0E.1.8 — Remove/de-emphasize Story / Moments / Media mechanical level switching.**
- [ ] **0E.1.9 — Add deterministic tests for containment, timing, selection continuity, expansion state, and no canonical mutation from presentation changes.**
- [ ] **0E.1.GATE — A filmmaker can inspect Cue/material detail without losing the larger story's temporal context.**

---

# 0E.2 — Selection, contextual inspector, and creation in time

## Goal

Make any selected semantic object useful immediately and allow structure/material creation from the temporal environment.

- [ ] **0E.2.1 — Use canonical `{type,id}` selection across all visible narrative/content rows.**
- [ ] **0E.2.2 — Add one contextual inspector implementing the type table from `editorial-interaction.md`.**
- [ ] **0E.2.3 — Section/Scene/Beat fields edit through existing update operations.**
- [ ] **0E.2.4 — Cue inspector exposes explicit/derived duration and all contained visual/audio blocks.**
- [ ] **0E.2.5 — ContentBlock inspector exposes only type-owned semantic properties.**
- [ ] **0E.2.6 — SourceExcerpt inspector exposes source identity and source in/out separately from Cue duration.**
- [ ] **0E.2.7 — Create Section/Beat/Cue/block through existing canonical create operations.**
- [ ] **0E.2.8 — Resolve playhead-assisted creation to a visible semantic parent/insertion point before ambiguous commit.**
- [ ] **0E.2.9 — Re-project immediately after committed inspector/creation edits.**
- [ ] **0E.2.GATE — The creator can select, understand, edit, and extend narrative/audiovisual structure without leaving the temporal context.**

---

# 0E.3 — Multiple material and multi-selection

## Goal

Expose the actual Cue model rather than pretending each Cue has one practical visual/audio item, and add narrow useful grouped work.

- [ ] **0E.3.1 — Render every `visualBlockId` and `audioBlockId` in each Cue.**
- [ ] **0E.3.2 — Independently select/reorder blocks through `moveBlock`.**
- [ ] **0E.3.3 — Add multiple new visual/audio blocks to one Cue.**
- [ ] **0E.3.4 — Add additive and sibling-range multi-selection.**
- [ ] **0E.3.5 — Multi-selection remains non-canonical interaction state.**
- [ ] **0E.3.6 — Implement one or more narrow grouped actions only where semantically unambiguous:**
  - delete compatible selection;
  - move/reorder compatible sibling set preserving relative order;
  - shared field edit only when every item supports it.
- [ ] **0E.3.7 — Publish each grouped edit as one atomic canonical operation batch and preserve immediate revert.**
- [ ] **0E.3.8 — Do not add independent within-Cue offsets/durations.**
- [ ] **0E.3.GATE — Multi-material Cue structures and at least one useful grouped edit work naturally without flattening semantic objects into generic clips.**

---

# 0E.4 — Minimum canonical editing grammar

## Goal

Provide enough familiar direct editorial control to make the semantic-vs-generic comparison meaningful while staying inside the shaped Salai semantics.

### Reorder / move

- [ ] **0E.4.1 — Reorder/reparent Sections/Beats/Cues/compatible blocks with clear semantic targets.**
- [ ] **0E.4.2 — Preserve ripple of later derived narrative time after canonical order changes.**

### Duration / trim

- [ ] **0E.4.3 — Adjust Cue narrative duration through `updateCue.explicitDurationMs`.**
- [ ] **0E.4.4 — Edge-trim SourceExcerpt through `trimSourceExcerpt`.**
- [ ] **0E.4.5 — Expose SourceExcerpt in/out numerically and through the supported temporal edge gesture.**
- [ ] **0E.4.6 — Keep Cue duration and SourceExcerpt source I/O visibly distinct.**

### Split / merge

- [ ] **0E.4.7 — Implement Beat split at a Cue boundary through `splitBeat`.**
- [ ] **0E.4.8 — Implement Beat merge through `mergeBeats`.**
- [ ] **0E.4.9 — Do not implement Cue split or SourceExcerpt split until its RFC 0003 question is explicitly resolved.**
- [ ] **0E.4.10 — Do not expose a universal engine razor for semantic objects without accepted split semantics.**

### State / replay

- [ ] **0E.4.11 — Every accepted direct edit publishes through canonical operation(s)/batch and remains immediately revertible.**
- [ ] **0E.4.12 — Re-project hierarchy and playback immediately after every accepted edit.**
- [ ] **0E.4.13 — Unsupported timeline-engine gestures are disabled/rejected/reverted rather than becoming shadow state.**
- [ ] **0E.4.GATE — The representative story can be meaningfully rearranged, Cue-timed, source-trimmed, and Beat-split/merged without a conventional NLE or semantic ambiguity.**

---

# 0E.5 — Human validation

Use a representative deterministic audiovisual fixture that is not dominated by placeholder artifacts.

- [ ] **0E.5.1 — Watch once and identify a real structural/timing/realization issue.**
- [ ] **0E.5.2 — Navigate whole story → nested Cue/material detail without losing temporal context; record whether hierarchy helps.**
- [ ] **0E.5.3 — Edit meaningful properties of a selected Beat/Cue/block through the inspector.**
- [ ] **0E.5.4 — Add a new Beat or Cue plus at least one audiovisual block from temporal context.**
- [ ] **0E.5.5 — Work with more than one visual/audio block in one Cue.**
- [ ] **0E.5.6 — Perform one useful multi-selection/grouped edit.**
- [ ] **0E.5.7 — Change Cue duration and SourceExcerpt source I/O as distinct operations.**
- [ ] **0E.5.8 — Split or merge Beats in a way that supports the creative task.**
- [ ] **0E.5.9 — Ask the external harness for one structural/timing change and verify continuity with direct edits.**
- [ ] **0E.5.10 — Identify one concrete decision materially changed/helped by semantic hierarchy, or record that none was.**
- [ ] **0E.5.11 — Record whether the rough story could be judged/improved without Resolve for the structural task.**
- [ ] **0E.5.12 — Record whether Cue-owned concurrent ContentBlocks were sufficient or independent within-Cue timing became a real blocker.**
- [ ] **0E.5.13 — Write `spike-0e-assessment.md` from observed evidence only.**
- [ ] **0E.5.GATE — Human evidence fairly answers the semantic-editorial thesis after the editor reaches the shaped minimum interaction depth.**

---

# 0E.GATE

Spike 0E passes only when:

- [ ] Narrative IR remains canonical;
- [ ] interaction/viewport/selection/hierarchy state stays non-canonical;
- [ ] timeline/rendering engines remain replaceable;
- [ ] nested semantic structure remains visible without mechanical level switching;
- [ ] selected objects expose useful type-appropriate editing;
- [ ] narrative/audiovisual structure can be created in temporal context;
- [ ] every visual/audio block in a Cue is available for direct work;
- [ ] multi-selection supports at least one useful grouped canonical edit;
- [ ] transport, reorder, Cue duration, source I/O, and accepted split/merge provide a minimum useful editing grammar;
- [ ] all mutations resolve through canonical operations/batches and remain revertible;
- [ ] external harness continuity remains on the validated 0C/0D boundary;
- [ ] human evidence identifies at least one creative decision materially helped by semantic hierarchy;
- [ ] the representative rough story can be judged and improved without Resolve for the tested structural task;
- [ ] no specialist-NLE or unrelated infrastructure was added to force a pass.

If the final two human conditions still fail after the shaped contract is implemented, stop expanding direct timeline scope and reassess ADR 0009's product boundary before proceeding.