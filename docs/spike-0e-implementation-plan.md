# Spike 0E — Semantic Editorial Interaction Depth Implementation Plan

## Status

**Next validation iteration. Start only after the 0D assessment is merged.**

This file is the canonical execution tracker for Spike 0E. It exists because 0D passed the semantic/editorial architecture tests but failed the human interaction gate: the timeline exposed too little structure and too few editing verbs to make the semantic advantage test meaningful.

Assessment: [`spike-0d-assessment.md`](spike-0d-assessment.md).

Roadmap: [`mvp.md`](mvp.md).

## Goal

Make the temporal environment deep enough to fairly test Salai's semantic-editorial product thesis **without building a specialist NLE**.

## Validation question

> **If Salai provides one context-preserving hierarchical timeline plus a minimum useful rough-editing grammar, do its semantic objects materially improve structural editing compared with generic clip manipulation?**

## Core interaction hypothesis

Replace/de-emphasize Story / Moments / Media level switching with one hierarchical temporal context inspired by a flamegraph:

```text
Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Beat ━━━━━━━━━━━━━━━  Beat ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Cue ━━━━━ Cue ━━━      Cue ━━━━━━━━━━━━━ Cue ━━━━━━━━━━━
      visual ━━━━━━━        visual ━━━━━━━   missing ━━━━━━━
      audio  ━━━━━━━━━       source ━━━━━━━━━━━━━━━━━━━━━━━━━
```

The exact rendering is not prescribed. Required behavior:

- whole-story time remains visible;
- parent/child containment is legible;
- nested levels can expand/collapse without replacing the entire timeline;
- focusing one object does not erase surrounding temporal context;
- selection identity remains canonical.

## Hard boundaries

- `@salai/script-model` remains canonical.
- `SalaiProjectService` remains the human/machine mutation boundary.
- Timeline-editor and Elah remain replaceable adapters.
- Reuse the existing `context` / `create-story` / `apply` machine interface unchanged unless a demonstrated Salai-owned resolution problem makes one additional command unavoidable.
- Do not add provider/model/session/runtime code.
- Do not add Phase 1 persistence/desktop infrastructure.
- Do not add Production Graph, Resolve integration, GenAI, Story Spine canvas, color, VFX, multicam, keyframes/effects, full audio post, mastering, or delivery.
- Do not add a canonical operation merely to mirror an editor gesture if the gesture can be compiled safely from existing operations.

## Human findings that 0E must address

- spacebar did not toggle play/pause;
- fixed-frequency fixture audio was distracting;
- selected timeline items exposed too few editable properties;
- users could not create additional Beats, Cues, or audiovisual material in time;
- only source audio had meaningful temporal editing;
- multiple visual/audio blocks in a Cue were not exposed naturally;
- semantic-level tabs lost context;
- multi-selection was missing;
- trim, blade/split, and source in/out were insufficient.

# Merge sequence

```text
0E.0  Editing grammar + interaction baseline
  ↓
0E.1  Hierarchical semantic timeline
  ↓
0E.2  Contextual inspector + creation in time
  ↓
0E.3  Multiple material + multi-selection
  ↓
0E.4  Minimum rough-editing grammar
  ↓
0E.5  Human validation
  ↓
0E.GATE
```

---

# 0E.0 — Editing grammar and interaction baseline

## Goal

Define the smallest direct-edit vocabulary before changing the timeline UI, and fix evaluation noise that does not require product-model changes.

- [ ] **0E.0.1 — Audit requested gestures against current Narrative IR operations.**
  - selected Beat property edits → existing `updateBeat`;
  - selected Cue property edits → existing `updateCue`;
  - selected ContentBlock property edits → existing `updateBlock`;
  - create Beat/Cue/block → existing create operations;
  - reorder/move → existing move operations;
  - SourceExcerpt I/O → existing `trimSourceExcerpt`;
  - Beat split → existing `splitBeat`;
  - multi-item changes → existing atomic operation batches;
  - determine whether Cue/source blade can compile from existing create/move/trim operations before proposing any new operation.
- [ ] **0E.0.2 — Define the UI gesture → canonical operation/batch table in tests/docs.**
- [ ] **0E.0.3 — Add spacebar play/pause without interfering with text inputs or other focused controls.**
- [ ] **0E.0.4 — Replace fixed-frequency validation audio with non-distracting, semantically distinguishable local fixture audio.**
- [ ] **0E.0.5 — Preserve deterministic CI and no external media hosting.**
- [ ] **0E.0.GATE — The requested editing grammar has a clear canonical compilation plan and transport/media-fixture friction no longer contaminates the next UX test.**

---

# 0E.1 — Hierarchical semantic timeline

## Goal

Keep global temporal context while exposing nested semantic structure.

- [ ] **0E.1.1 — Render Section → Beat → Cue as simultaneous nested temporal bands.**
- [ ] **0E.1.2 — Render visual/audio/source/missing material beneath its Cue.**
- [ ] **0E.1.3 — Expand/collapse hierarchy without changing canonical order or identity.**
- [ ] **0E.1.4 — Keep surrounding story visible when focusing or selecting a nested item.**
- [ ] **0E.1.5 — Preserve playhead/scrub behavior through hierarchy expansion.**
- [ ] **0E.1.6 — Remove or de-emphasize Story / Moments / Media tabs if the hierarchy makes them mechanically redundant.**
- [ ] **0E.1.7 — Add deterministic tests for nesting, timing, selection continuity, and collapse/expand Workspace state.**
- [ ] **0E.1.GATE — A filmmaker can inspect Cue/media detail without losing the story's larger temporal structure.**

Workspace rule: expansion/collapse is UI state, not Narrative IR.

---

# 0E.2 — Contextual inspector and creation in time

## Goal

Make selection useful: the selected semantic object should expose its meaningful properties and creation affordances without requiring another lens for mechanical reasons.

- [ ] **0E.2.1 — Add one contextual inspector driven by canonical selection.**
- [ ] **0E.2.2 — Beat inspector exposes meaningful authored fields and duration controls supported by Narrative IR.**
- [ ] **0E.2.3 — Cue inspector exposes duration and contained visual/audio material.**
- [ ] **0E.2.4 — ContentBlock/SourceExcerpt inspector exposes type-appropriate properties and canonical source I/O.**
- [ ] **0E.2.5 — Create a Beat at a valid temporal/narrative insertion point using canonical create operations.**
- [ ] **0E.2.6 — Create a Cue in a selected Beat.**
- [ ] **0E.2.7 — Add appropriate visual/audio blocks to a selected Cue.**
- [ ] **0E.2.8 — Keep creation semantics explicit when placement is ambiguous; do not infer destructive hierarchy changes from pixel position alone.**
- [ ] **0E.2.GATE — The creator can select an object, understand/edit its meaningful properties, and add narrative/audiovisual structure without leaving the temporal environment.**

---

# 0E.3 — Multiple material and multi-selection

## Goal

Stop treating a Cue as if it can contain only one practical visual/audio item and allow basic grouped structural work.

- [ ] **0E.3.1 — Render every `visualBlockId` and `audioBlockId` in a Cue, not only one representative item.**
- [ ] **0E.3.2 — Independently select multiple visual/audio blocks within one Cue.**
- [ ] **0E.3.3 — Add additive/range multi-selection for compatible semantic items.**
- [ ] **0E.3.4 — Define compatible grouped operations narrowly: move/reorder, delete/park where semantically safe, and grouped property updates only where they have clear meaning.**
- [ ] **0E.3.5 — Multi-selection remains Workspace/UI state; grouped mutations remain canonical operation batches.**
- [ ] **0E.3.GATE — Common multi-material Cue structures and grouped selection can be manipulated without flattening them into generic clips.**

---

# 0E.4 — Minimum rough-editing grammar

## Goal

Provide enough ordinary editing power to make the semantic-vs-generic comparison meaningful while stopping well before specialist NLE scope.

- [ ] **0E.4.1 — Reorder/move Beats and Cues directly in the hierarchy with clear canonical placement.**
- [ ] **0E.4.2 — Edge-trim SourceExcerpts/media where canonical source ranges exist.**
- [ ] **0E.4.3 — Expose source in/out adjustment in the inspector and temporal gesture where practical.**
- [ ] **0E.4.4 — Implement the smallest semantically correct blade/split behavior proven by 0E.0.**
- [ ] **0E.4.5 — Do not implement a generic arbitrary clip split if Salai cannot explain the resulting narrative/source semantics.**
- [ ] **0E.4.6 — Ensure grouped gestures publish one atomic Salai action and remain immediately revertible.**
- [ ] **0E.4.7 — Re-project hierarchy and playback immediately after every accepted canonical edit.**
- [ ] **0E.4.8 — Unsupported timeline-editor gestures are rejected/reverted rather than becoming shadow state.**
- [ ] **0E.4.GATE — The representative rough story can be meaningfully rearranged, trimmed, split where valid, and source-I/O adjusted without entering a conventional NLE.**

---

# 0E.5 — Human validation

Use a representative local audiovisual fixture that is not dominated by placeholder artifacts.

- [ ] **0E.5.1 — Watch once and identify a real structural/timing issue.**
- [ ] **0E.5.2 — Navigate from whole story to nested Cue/media detail without losing temporal context; record whether the hierarchical view helps.**
- [ ] **0E.5.3 — Make one meaningful Beat/Cue structural edit directly.**
- [ ] **0E.5.4 — Add one new Beat/Cue/material item from the timeline.**
- [ ] **0E.5.5 — Work with more than one visual/audio item in one Cue.**
- [ ] **0E.5.6 — Make one multi-selection/grouped edit.**
- [ ] **0E.5.7 — Make one trim or source-I/O edit and one split/blade edit if the semantic grammar supports it.**
- [ ] **0E.5.8 — Ask the external harness for one structural/timing change and verify continuity with the direct edits.**
- [ ] **0E.5.9 — Compare against generic clip-timeline thinking: identify a concrete decision that the semantic hierarchy changed, or record that it did not.**
- [ ] **0E.5.10 — Record whether the rough story could be judged/improved without Resolve for the structural task.**
- [ ] **0E.5.11 — Write `spike-0e-assessment.md` from observed evidence only.**
- [ ] **0E.5.GATE — Human evidence shows the hierarchical semantic timeline and minimum editing grammar materially improve structural editorial reasoning.**

---

# 0E.GATE

Spike 0E passes only when:

- [ ] Narrative IR remains canonical;
- [ ] hierarchical/collapse/selection UI state stays non-canonical;
- [ ] timeline/rendering engines remain replaceable;
- [ ] nested semantic structure remains visible without mechanical level switching;
- [ ] selected items expose useful type-appropriate editing;
- [ ] Beats/Cues/audiovisual content can be created in temporal context;
- [ ] multiple visual/audio blocks per Cue work naturally;
- [ ] multi-selection supports at least one useful grouped structural edit;
- [ ] transport, trim, source I/O, and semantically valid split provide a minimum useful editing grammar;
- [ ] all mutations resolve through canonical operations/batches and remain revertible;
- [ ] external harness continuity remains on the validated 0C/0D boundary;
- [ ] human evidence identifies at least one creative decision materially helped by semantic hierarchy;
- [ ] the representative rough story can be judged and improved without Resolve for the tested structural task;
- [ ] no specialist-NLE or unrelated infrastructure was added to force a pass.

If the final two human conditions still fail after the editor is sufficiently expressive, stop expanding direct timeline scope and reassess ADR 0009's product boundary before proceeding.
