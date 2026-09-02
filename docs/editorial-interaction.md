# Salai Structural Editorial Interaction Contract

## Status

**Accepted 0E interaction contract.**

This document owns observable structural-editorial interaction behavior for Spike 0E under accepted RFC 0003. The RFC's five deferred questions remain intentionally unresolved until implementation or human evidence reaches them; this contract must not silently implement those behaviors through engine/UI state.

Narrative object semantics and canonical operations remain authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md). Product boundaries remain authoritative in [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md). The accepted cross-cutting direction and deferred questions live in [`rfcs/0003-semantic-editorial-interaction-model.md`](rfcs/0003-semantic-editorial-interaction-model.md).

## Purpose

Define how a filmmaker directly perceives and edits Salai's semantic project in time without making a third-party timeline engine or generic clip model authoritative.

The core rule is:

> **One temporal context, progressively revealed semantic depth.**

The structural-editorial surface should let the creator move between whole-story structure and detailed audiovisual content without losing temporal context, while familiar gestures compile to canonical Salai operations.

## Primary surface

The primary temporal editor presents a hierarchical timeline over one shared time axis.

```text
Script  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━ Section ━━━━━━━━━━━━━━━━━
  Beat  ━━━━━━━━━━━ Beat ━━━━━━━━━   Beat ━━━━━━━━━━━━━━━━━
    Cue ━━━━━ Cue ━   Cue ━━━━━━━     Cue ━━━━━ Cue ━━━━━━━
      V ━━━━  V ━━     V ━━━━━          V ━━━━   missing ━━
      A ━━━━━━━       source ━━━━━       A ━━━━━━━━━━━━━━━━━
```

Required behavior:

- Section, Beat, Cue, visual content, audio content, source evidence, and explicit missing realization use the same horizontal time coordinate system.
- Parent/child containment is perceptually clear.
- Expanding/collapsing descendants does not replace the surrounding timeline.
- Horizontal zoom changes viewport scale only.
- Expand/collapse changes semantic detail only.
- Focus or selection never changes canonical order.
- The creator can always see or recover surrounding story context without changing to another mechanical editing surface.
- `flamegraph` is a design analogy, not required user-facing vocabulary.

## Temporal model exposed by the surface

0E exposes the current Narrative IR timing model rather than inventing independent clip coordinates.

- Cue is the canonical narrative-time interval.
- Beat duration is the sum of its Cues.
- Scene duration is the sum of its Beats.
- Section duration is the sum of its children.
- Script duration is the sum of its Sections.
- Reordering semantic objects ripples later derived start times.
- Changing Cue duration ripples later derived start times.
- There is no canonical arbitrary absolute-position gap or overwrite edit in 0E.

Cue duration follows the Narrative IR contract:

1. use `explicitDurationMs` when present;
2. otherwise derive from authored speech, SourceExcerpt duration, and visual-hold assumptions.

## Cue and ContentBlock behavior

A Cue may contain multiple visual blocks and multiple audio blocks. The UI must expose all of them.

For 0E:

- all blocks belong to the Cue's narrative interval;
- visual block order is canonical in `visualBlockIds`;
- audio block order is canonical in `audioBlockIds`;
- multiple blocks may coexist in one Cue;
- SourceExcerpt keeps its own source in/out evidence range;
- ordinary ContentBlocks do not gain independent narrative-time offsets or durations;
- the UI must not persist engine-only per-block timing as project truth.

If real editing evidence proves independent within-Cue placement is required, that is a separate domain-model decision.

## Selection

### Single selection

Selecting one semantic object:

- preserves its canonical `{type, id}` identity;
- reveals type-appropriate inspector controls;
- reveals valid contextual creation actions;
- reveals only gestures that can be explained through Salai semantics.

### Multi-selection

Multi-selection is interaction state, not Narrative IR.

The surface supports:

- additive selection;
- contiguous/range selection where an ordered sibling context exists;
- multiple ContentBlocks in one Cue;
- multiple compatible Beats/Cues/blocks for grouped actions.

A grouped edit is available only when its meaning is valid for the whole selection. One grouped edit publishes one atomic canonical operation batch.

Initial grouped actions:

- delete compatible selected canonical objects;
- move/reorder a compatible sibling set while preserving relative order;
- apply a shared property only when every selected item owns that same semantic field.

Do not expose arbitrary geometric group transforms.

## Inspector

The inspector shows semantic properties, not renderer/timeline-engine properties.

| Selected type | Editable/visible contract |
| --- | --- |
| Section | title; structural location; child summary; create child; move/delete |
| Scene | title; structural location; Beat summary; create Beat; move/delete |
| Beat | title; summary; derived duration; Cue summary; create Cue; split/merge where valid; move/delete |
| Cue | explicit duration; derived duration; visual/audio block lists; create block; move/delete |
| VisualDescription | text; parent/lane; move/delete |
| OnScreenText | text; parent/lane; move/delete |
| Graphic | description; parent/lane; move/delete |
| AuthoredSpeech | text; role; parent/lane; move/delete |
| SourceExcerpt | MediaSegment identity; transcript snapshot; source in/out; source duration; parent/lane; move/delete |
| Music | description; parent/lane; move/delete |
| SFX | description; parent/lane; move/delete |

Raw stable IDs may be available for diagnostics but should not be the normal editing language.

## Creation in temporal context

Creation always resolves to a valid canonical parent and insertion order.

### Section

Create relative to a selected Section or a clearly resolved top-level insertion point.

### Beat

Create inside a selected Section/Scene or relative to a selected Beat.

### Cue

Create inside a selected Beat or relative to a selected Cue.

### ContentBlock

Create a type-appropriate visual/audio block inside the selected Cue.

### Playhead-assisted insertion

The playhead may suggest an insertion location, but Salai resolves that location to semantic structure before commit.

When more than one parent interpretation is materially plausible, show the resolved parent/placement rather than silently guessing a destructive reparent.

## Direct manipulation → canonical semantics

| Interaction | Canonical meaning |
| --- | --- |
| edit Section field | `updateSection` |
| edit Scene field | `updateScene` |
| edit Beat field | `updateBeat` |
| edit Cue duration | `updateCue` |
| edit ContentBlock field | `updateBlock` |
| create Section | `createSection` |
| create Beat | `createBeat` |
| create Cue | `createCue` |
| create visual/audio block | `createBlock` |
| reorder Section | `moveSection` |
| reorder/reparent Beat | `moveBeat` |
| reorder/reparent Cue | `moveCue` |
| reorder/reparent compatible ContentBlock | `moveBlock` |
| trim SourceExcerpt source edge | `trimSourceExcerpt` |
| split Beat at Cue boundary | `splitBeat` |
| merge compatible Beats | `mergeBeats` |
| delete | matching canonical delete operation |
| multi-edit | atomic `NarrativeOperation[]` batch |
| seek/scrub | viewer/UI state only |
| horizontal zoom | viewport state only |
| expand/collapse | presentation/Workspace state only |
| selection | interaction state only |

The timeline library may propose a changed document, but Salai accepts only changes that compile to the table above or to a later explicitly accepted semantic operation.

## Move and ripple behavior

Narrative objects do not behave like freely positioned clips.

- Moving a Section changes Script order.
- Moving a Beat changes its valid Section/Scene parent/order.
- Moving a Cue changes its Beat parent/order.
- Moving a ContentBlock changes its compatible Cue lane/order.
- Later derived start times ripple after order or Cue-duration changes.
- Pixel placement alone does not establish a new semantic parent when the target is ambiguous.
- 0E has no overwrite mode, track collision system, or implicit gap creation.

## Trimming and source I/O

### SourceExcerpt

SourceExcerpt trimming changes source evidence, not narrative identity.

- source in/out are visible and editable in the inspector;
- edge trims adjust `sourceInMs` / `sourceOutMs` through `trimSourceExcerpt`;
- ranges stay inside the MediaSegment;
- transcript/source identity remains source-backed;
- a trim may change derived Cue duration when the Cue has no explicit duration;
- explicit Cue duration remains a separate semantic control.

### Cue

Changing Cue duration uses `updateCue.explicitDurationMs`. It is not the same operation as trimming a SourceExcerpt.

### Beat / Section / Scene

No edge-trim gesture is defined. Their durations are derived from descendants.

## Split and merge

### Beat split

Supported at Cue boundaries using `splitBeat`.

- original Beat identity remains on the left result according to the Narrative IR contract;
- right result receives a new ID;
- Cue assignment is explicit;
- relationship redistribution follows the canonical split policy.

### Beat merge

Supported through `mergeBeats` with explicit surviving Beat identity and Cue order.

### Cue split

Deferred by accepted RFC 0003. It is not part of the 0E baseline until a deterministic block/duration policy is explicitly accepted.

### SourceExcerpt split

Deferred by accepted RFC 0003. It is not part of the 0E baseline until a safe canonical composition or dedicated operation is explicitly accepted.

### Ordinary ContentBlock split

Not applicable because ordinary blocks have no independent narrative-time range.

The UI should use contextual **Split** language rather than pretending every semantic object supports the same razor behavior.

## Empty and missing states

The timeline must distinguish states the user reasons about differently.

- A Cue with no audio plays silence.
- A Cue with no visual content displays the absence rather than inventing media.
- A known unsupported/missing visual realization is displayed explicitly as missing.
- A generic free-positioned timeline gap is not a 0E canonical concept.
- Intentional black versus missing realization remains a deferred RFC 0003 question and must not be guessed into canonical state.

## Playback and transport

- Space toggles play/pause except while text editing or when a focused control consumes Space.
- Timeline seek/scrub and Viewer use one playhead.
- Playhead and transport state are non-canonical UI state.
- Playback uses current reprojected canonical state after every accepted edit.
- Fixture audio used for human validation must be non-distracting and semantically distinguishable; fixed-frequency placeholder tones are not acceptable validation material.

## Agent continuity

The external harness remains a peer client of `SalaiProjectService`.

- agent changes use existing machine `context` / creation / apply paths;
- timeline changes use canonical operations/batches;
- each sees the next current canonical project state;
- no import/export synchronization is required;
- no second model/provider/session/runtime is added;
- viewport, selection, and collapsed rows are not automatically project or agent state.

## Keyboard and command scope

0E adds only commands required by the validation workflow.

Required baseline:

- Space: play/pause when safe;
- ordinary platform multi-select modifiers;
- Delete/Backspace for selected deletable semantic objects when text editing is not active;
- explicit Split action for types whose split semantics are accepted.

Do not recreate a full NLE shortcut matrix during 0E.

## Out of scope

0E does not add:

- arbitrary free-positioned tracks/clips as canonical state;
- independent offsets/durations for ordinary ContentBlocks;
- overwrite/insert track edit modes;
- trim rollers/slip/slide/ripple tools as generic NLE abstractions;
- multicam;
- transitions/effects/keyframes;
- color/VFX;
- full audio post;
- production persistence/desktop runtime;
- Production Graph;
- Resolve execution/interchange;
- Story Spine canvas;
- GenAI execution;
- another agent protocol/runtime.

## Acceptance contract for 0E implementation

Implementation is ready for human validation only when a user can, in one temporal context:

1. play/pause and scrub;
2. see Section → Beat → Cue → all visual/audio blocks without mechanical level switching;
3. expand/collapse detail without losing surrounding time;
4. select any visible canonical object and edit its meaningful inspector properties;
5. create a Beat, Cue, visual block, and audio block in valid semantic context;
6. work with multiple visual/audio blocks in one Cue;
7. multi-select compatible items and perform at least one grouped canonical edit;
8. reorder Beats/Cues/blocks through canonical moves;
9. adjust Cue duration and SourceExcerpt source I/O as distinct operations;
10. split a Beat at a valid Cue boundary;
11. immediately replay the canonical result;
12. continue through the external harness over the same project.

No engine-owned edited document may survive as an independent source of truth.
