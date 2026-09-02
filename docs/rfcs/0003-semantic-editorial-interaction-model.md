# RFC 0003 — Semantic Editorial Interaction Model

## Status

**Proposed — shaping Spike 0E before implementation.**

This RFC is the scoped place for unresolved interaction questions discovered by Spike 0D. Accepted behavior is promoted into [`../editorial-interaction.md`](../editorial-interaction.md), product requirements, and the 0E implementation plan only after review.

## Summary

Spike 0D proved that Salai can project Narrative IR into real time, play a rough assembly, round-trip a small set of timeline gestures through canonical operations, and keep an external harness coherent with direct temporal edits. Human validation did **not** validate the timeline as a useful editing environment because the surface exposed too little semantic depth and too few editing verbs.

0E should therefore test one stronger interaction model rather than adding isolated controls to the 0D UI:

> **One context-preserving hierarchical timeline exposes Section → Beat → Cue → visual/audio content in time, while selection, creation, trimming, splitting, grouping, and playback compile to Salai-owned semantics.**

The timeline is not a second document. It is a temporal interaction surface over the canonical Narrative IR and any explicitly justified later structural-editorial state.

## Motivation

0D human validation produced a consistent failure pattern:

- playback itself worked;
- agent-mediated edits worked;
- Story / Moments / Media switching fragmented context;
- selected objects exposed too few editable properties;
- the timeline could not create ordinary narrative/audiovisual structure;
- only SourceExcerpt trimming had meaningful temporal manipulation;
- multiple visual/audio blocks inside one Cue were not practically exposed;
- multi-selection was absent;
- familiar rough-editing verbs such as source I/O and split/blade were missing;
- spacebar transport was missing;
- placeholder tone audio polluted evaluation.

The failure was not evidence that Narrative IR should be replaced by a generic clip timeline. Current Narrative IR already supports:

- ordered Sections / Scenes / Beats / Cues;
- multiple visual and audio blocks per Cue;
- create/update/move/delete for semantic objects;
- `moveBlock` between compatible Cue lanes;
- `splitBeat` / `mergeBeats`;
- `trimSourceExcerpt`;
- atomic operation batches.

The next experiment should expose that existing power coherently before adding new canonical concepts.

## Proposal

### 1. One temporal hierarchy replaces mechanical semantic-level switching

The primary 0E timeline shows nested temporal bands in one coordinate system:

```text
Script  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Section ━━━━━━━━━━━━━━━━━
  Beat  ━━━━━━━━━━━  Beat ━━━━━━━━━━━━━    Beat ━━━━━━━━━━━━━━━━━
    Cue ━━━━━ Cue ━    Cue ━━━━━━━━━━━      Cue ━━━━━ Cue ━━━━━━━
      V ━━━━  V ━━      V ━━━━━              V ━━━━━  missing ━━
      A ━━━━━━━━        source ━━━━━          A ━━━━━━━━━━━━━━━━━
```

The design may visually resemble a flamegraph, but `flamegraph` is an implementation/design reference, not user-facing product terminology.

Rules:

- all visible bands share the same time axis;
- parent containment is visually legible;
- expanding/collapsing descendants is UI/Workspace state only;
- selecting/focusing a child never replaces the whole timeline with that child;
- the user can always recover the surrounding story without changing surfaces;
- horizontal viewport zoom and semantic expand/collapse remain separate concepts;
- canonical order is never inferred solely from vertical layout or incidental pixel position.

### 2. Selection is a first-class interaction state

Selection references canonical Salai IDs plus type. It remains non-canonical interaction state.

Single selection:

- drives inspector content;
- determines contextual creation targets;
- determines which temporal handles/actions are available.

Multi-selection:

- supports additive selection and contiguous/range selection where the representation has a meaningful order;
- may contain heterogeneous object types for inspection, but mutation commands are enabled only when their semantic meaning is unambiguous across the selected set;
- one grouped user action compiles to one atomic `NarrativeOperation[]` batch;
- selection itself is never serialized into Narrative IR.

Initial grouped mutations should be deliberately narrow:

- delete selected compatible objects;
- move/reorder a compatible ordered set while preserving relative order;
- apply a shared editable property only when every selected object supports the same semantic field;
- no arbitrary “group clips and transform together” abstraction is introduced.

### 3. Inspector edits semantic properties, not engine properties

The contextual inspector is driven by canonical selection and exposes properties owned by the selected semantic type.

Initial contract:

| Selection | Inspector responsibilities |
| --- | --- |
| Section | title; structural position/context; contained Scenes/Beats summary |
| Scene | title; contained Beats summary |
| Beat | title; summary; estimated/current duration; contained Cues; split/merge/delete/create-child actions where valid |
| Cue | explicit duration; contained visual/audio blocks; create visual/audio block; move/delete |
| VisualDescription | text; lane/parent context; move/delete |
| OnScreenText | text; lane/parent context; move/delete |
| Graphic | description; lane/parent context; move/delete |
| AuthoredSpeech | text; role; lane/parent context; move/delete |
| SourceExcerpt | source identity; transcript snapshot; source in/out; duration; move/delete |
| Music | description; lane/parent context; move/delete |
| SFX | description; lane/parent context; move/delete |

Do not expose third-party renderer/timeline fields merely because the engine has them.

### 4. Creation happens in narrative context, not arbitrary track space

Creation must resolve to an allowed canonical parent and insertion point.

Initial rules:

- create Section relative to selected Section or at playhead-derived top-level insertion point;
- create Beat inside the selected Section/Scene, or relative to a selected Beat;
- create Cue inside a selected Beat, or relative to a selected Cue;
- create visual/audio ContentBlock inside a selected Cue;
- if the playhead is used, it proposes the nearest valid semantic insertion context; the UI must show the resolved parent before commit when ambiguity is material;
- creation never silently reparents unrelated objects because of pixel overlap.

The agent remains the low-friction path for requests whose intended structure is easier to express naturally than manually.

### 5. Cue is a temporal container; its current blocks are concurrent content, not mini-track clips

Current Narrative IR stores ordered `visualBlockIds[]` and `audioBlockIds[]` inside a Cue but does not assign independent timeline offsets/durations to ordinary blocks.

Therefore 0E must not invent independent within-Cue clip timing as canonical state.

For 0E:

- a Cue owns one narrative time interval;
- all contained visual/audio blocks belong to that Cue interval;
- multiple blocks can coexist semantically in the Cue;
- their order is canonical within the visual/audio lane via the existing arrays;
- SourceExcerpt preserves its own source range, but its placement in narrative time is the Cue interval;
- ordinary ContentBlocks do not gain independent start/end offsets in 0E;
- if human testing proves that independent within-Cue temporal placement is required, that becomes a new scoped domain-model decision rather than hidden timeline state.

This lets 0E fairly expose multiple material per Cue without prematurely creating a full clip/track model.

### 6. Duration semantics remain Cue-owned in 0E

Narrative IR already defines Cue duration as:

1. `explicitDurationMs` when present; otherwise
2. a derived estimate from authored speech, SourceExcerpt duration, and visual-hold assumptions.

Therefore:

- Section/Scene/Beat duration remains the sum of descendant Cue durations;
- changing Beat/Section edges directly is not a canonical trim gesture;
- editing a Cue duration changes `Cue.explicitDurationMs` through `updateCue`;
- trimming a SourceExcerpt changes source evidence through `trimSourceExcerpt` and may alter derived Cue duration only when no explicit Cue duration overrides it;
- a UI may offer an explicit command to fit Cue duration to selected source/content, but it must compile to a Salai operation/batch rather than mutate an engine clip.

### 7. Ripple is the default consequence of canonical narrative duration/order changes

Narrative time is currently sequential through Section → Beat → Cue ordering. There is no canonical free-positioned timeline offset.

Therefore:

- moving/reordering a Section/Beat/Cue changes sequence order and all later derived start times ripple automatically;
- changing a Cue duration changes later derived start times;
- there is no 0E “overwrite at absolute time while leaving later story fixed” edit mode;
- gaps are not created implicitly by moving semantic objects on the time axis.

Absolute free placement, overwrite editing, and track gaps would require additional canonical editorial state and are out of 0E scope.

### 8. Gap, black, silence, and missing intent remain distinct

0E must not use one generic empty timeline gap for different meanings.

Initial rules:

- **missing realization**: an explicit semantic/production support state already represented in the projection when no visual realization exists; display as missing, not as an invented clip;
- **silence**: absence of audio blocks in a Cue is valid and should play as silence;
- **black / no visual**: absence of visual blocks in a Cue may be intentional or missing; 0E should display the absence and, where the fixture knows it is intentionally unsupported, label it as missing rather than guessing intent;
- **timeline gap**: not a canonical 0E concept because narrative time is sequential Cue time.

### 9. Editing-gesture compilation table

The interaction layer recognizes creative/editor gestures and compiles them to existing canonical operations wherever possible.

| User action | Semantic target | Canonical result |
| --- | --- | --- |
| edit title/summary/text/property | selected semantic object | corresponding `update*` / `updateBlock` |
| create Section/Beat/Cue/block | valid selected parent/insertion context | `createSection` / `createBeat` / `createCue` / `createBlock` |
| drag Section | Script order | `moveSection` |
| drag Beat | valid Section/Scene order/parent | `moveBeat` |
| drag Cue | valid Beat order/parent | `moveCue` |
| drag ContentBlock | compatible Cue visual/audio lane | `moveBlock` |
| trim SourceExcerpt source edge | SourceExcerpt | `trimSourceExcerpt` |
| change Cue duration | Cue | `updateCue` explicit duration |
| split Beat at Cue boundary | Beat | `splitBeat` with explicit Cue assignment |
| merge Beats | compatible Beats | `mergeBeats` |
| delete object(s) | selected canonical object(s) | matching delete operation(s), atomic batch for multi-select |
| seek/scrub | viewer | UI state only |
| viewport zoom | timeline viewport | UI state only |
| expand/collapse hierarchy | timeline presentation | UI/Workspace state only |

Unsupported engine gestures are disabled or reverted rather than becoming shadow state.

### 10. Blade/split semantics are semantic, not generic clip surgery

A single universal razor tool is misleading because Salai objects have different meanings.

0E should expose a contextual **Split** action with these rules:

- Beat: supported at a Cue boundary using existing `splitBeat`; the left Beat retains identity according to Narrative IR policy and Cue assignment is explicit.
- SourceExcerpt: source I/O trim is supported, but splitting one SourceExcerpt into two evidence excerpts is **not** yet a canonical single operation. For 0E, do not pretend an engine clip split is canonical. If a fixture requires it, implement only after proving a safe atomic composition using create/move/trim semantics or propose a new operation explicitly.
- Cue: no generic split in the accepted 0E baseline. Splitting a Cue would require a policy for distributing visual/audio blocks and durations; add only if 0E human tasks demonstrate that this is necessary to make a meaningful structural decision.
- ordinary ContentBlock: no temporal split because current blocks have no independent narrative-time range.

This deliberately favors explainable semantic editing over NLE mimicry.

### 11. Source I/O belongs to SourceExcerpt evidence

For a SourceExcerpt:

- source in/out are editable numerically in the inspector;
- edge-trim gestures may adjust the same values;
- source range must remain inside the referenced MediaSegment;
- transcript/source identity remains evidence-backed;
- a later source-monitor UI may provide dedicated preview and mark-in/mark-out, but 0E does not require a separate source-monitor subsystem to validate source I/O semantics.

### 12. Transport follows familiar editorial conventions

Minimum global transport behavior:

- Space toggles play/pause when focus is not inside a text-editing control or another control that consumes Space.
- Clicking/scrubbing the timeline seeks the shared viewer playhead.
- Transport state remains UI state.
- Do not add a large NLE shortcut vocabulary in 0E; only add shortcuts exercised by the validation workflow.

### 13. External harness remains another client of the same semantics

0E does not add another agent surface or protocol.

- machine `context` remains Salai-owned semantic context;
- agent changes continue through the existing machine interface and `SalaiProjectService`;
- direct timeline edits become visible to the next agent context read;
- selection/viewport/collapse state is not automatically sent to the agent unless a concrete interaction explicitly supplies it as task context.

## Alternatives considered

### Keep Story / Moments / Media tabs and add more controls

Rejected for 0E because human validation specifically found that changing semantic levels caused loss of context. More controls would deepen each isolated view without testing the stronger context-preserving hypothesis.

### Use a conventional multi-track clip timeline as the primary model

Rejected because it would bypass the product question. Salai needs to determine whether narrative identity improves editing, not whether a generic NLE timeline can be embedded.

### Add independent clip timing to every ContentBlock now

Rejected for 0E. Current Narrative IR does not model per-block narrative offsets/durations. Adding them before evidence would conflate the need to expose multiple Cue contents with a much larger editorial-domain expansion.

### Implement a universal blade tool

Rejected. Beat, Cue, SourceExcerpt, and generic ContentBlock have different lifecycle and evidence semantics. Contextual split behavior is safer and more informative.

### Add Story Spine / canvas now

Rejected for 0E. 0D failed because the temporal editor was not deep enough, not because spatial exploration was missing. The temporal interaction must receive a fair test first.

## Consequences / risks

### Positive

- keeps narrative hierarchy and temporal context visible simultaneously;
- makes the existing IR operation vocabulary available through familiar direct manipulation;
- gives selection/inspector/creation one coherent home;
- avoids shadow engine state;
- creates a fairer human test of semantic editing before expanding product scope;
- preserves the successful external-agent architecture.

### Risks

- a hierarchical timeline can become visually dense;
- current Cue-owned timing may prove too coarse for real audiovisual arrangement;
- lack of independent within-Cue media timing may become the next blocker;
- a semantic Split action may feel less familiar than a universal razor;
- multi-selection across semantic levels can easily become ambiguous if commands are enabled too broadly.

These are exactly the risks 0E should measure rather than pre-solving with a full NLE model.

## Open questions

These questions are intentionally scoped to this RFC and must be resolved by review or 0E evidence before becoming broader canonical requirements:

1. **Cue split:** Is splitting a Cue necessary for the 0E validation fixture, and if so what deterministic rule distributes visual/audio blocks and duration?
2. **SourceExcerpt split:** Can a two-excerpt split be expressed safely as one atomic batch with existing operations, or does the Narrative IR need a dedicated operation?
3. **Independent within-Cue timing:** Does real human editing require visual/audio blocks to have offsets/durations independent from their Cue, or is Cue-level concurrency sufficient for structural editorial?
4. **Intentional black vs missing visual:** Is absence alone enough for 0E, or does the canonical model need an explicit intentional-empty/missing distinction later?
5. **Multi-selection move across parents:** Which cross-parent grouped moves are understandable enough to expose directly without accidental reparenting?

No other unresolved interaction behavior should be duplicated into living canonical docs.

## Decision / outcome

**Pending review.**

If accepted, this RFC establishes the 0E interaction direction. Accepted observable behavior is owned by `docs/editorial-interaction.md`; Narrative IR changes, if any become necessary, must be made explicitly in `narrative-ir-spec.md` and may require an ADR/RFC follow-up.
