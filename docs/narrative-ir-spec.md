# Narrative IR Technical Design Specification

## Status

**Draft — authoritative implementation contract for Spike 0A**

This document is the single source of truth for Spike 0A implementation semantics: domain constraints, invariants, structural operations, serialization behavior, fixtures, tests, and open questions.

Other docs may summarize the model, but must link here instead of maintaining duplicate operation lists or implementation rules.

Product terminology is defined in [`glossary.md`](glossary.md).

## Purpose

Validate whether one small, stable semantic representation can support both:

- script-first narrative construction; and
- footage-first narrative construction.

The spike should make domain-model failures cheap to discover before UI, persistence, Resolve, or AI integration make them expensive.

## Core hypothesis

```text
Script
└── Section
    ├── Scene?               optional structural grouping
    │   └── Beat
    │       └── Cue
    └── Beat
        └── Cue
```

The model deliberately stops at Cue for Spike 0A. Do not introduce a more atomic narrative level unless a required fixture cannot be represented cleanly without one.

## Design principles

1. **Meaning before media.** Narrative identity is not defined by a clip, shot, line, or timeline item.
2. **Stable identity.** Normal edits and reordering preserve object IDs.
3. **Authored and sourced material are semantically different.** Recorded evidence must not become silently editable prose.
4. **Explicit structure over unrestricted nesting.** Allowed parent/child relationships are validated.
5. **Relationships are explicit but do not require a graph database.**
6. **Operations are the mutation API.** UI and future AI should eventually invoke the same validated operations.
7. **No silent destruction of external production data.** Deleting narrative structure must not delete MediaSegments, ShotIntents, Assets, or future Resolve objects.
8. **Workspace layout is not Narrative IR.** Story Wall/Board layout belongs to Spike 0B and later persistence layers.

# Scope

## In scope

- TypeScript domain types;
- stable IDs;
- explicit hierarchy validation;
- minimal visual/audio content types;
- `AuthoredSpeech` vs `SourceExcerpt`;
- mocked `ShotIntent` and `MediaSegment` references;
- explicit create/update/move/delete operations;
- Beat split/merge semantics;
- serialization/deserialization and schema versioning;
- runtime estimation;
- operation/result validation;
- three realistic fixtures and automated tests.

## Out of scope

- Electron / React;
- editor frameworks;
- Python/FastAPI / SQLite;
- Resolve/CutMaster;
- OpenAssetIO/OTIO integration;
- real transcription/media analysis;
- real LLM calls;
- Fountain/FDX;
- collaboration/CRDT;
- Workspace/Board persistence;
- production-ready performance optimization.

# Proposed domain model

Exact TypeScript syntax may evolve during the spike; semantic changes must be reflected in this spec.

```ts
type Id = string;

type Script = {
  id: Id;
  schemaVersion: number;
  title?: string;
  targetDurationMs?: number;
  sectionIds: Id[];
};

type Section = {
  id: Id;
  title?: string;
  childIds: Id[]; // Scene or Beat according to validated hierarchy
};

type Scene = {
  id: Id;
  title?: string;
  beatIds: Id[];
};

type Beat = {
  id: Id;
  title?: string;
  summary?: string;
  cueIds: Id[];
};

type Cue = {
  id: Id;
  visualBlockIds: Id[];
  audioBlockIds: Id[];
  explicitDurationMs?: number;
};
```

## Content blocks

Start with only the block types required by the fixtures:

```ts
type VisualDescription = {
  id: Id;
  type: "visual_description";
  text: string;
};

type OnScreenText = {
  id: Id;
  type: "on_screen_text";
  text: string;
};

type Graphic = {
  id: Id;
  type: "graphic";
  description: string;
};

type AuthoredSpeech = {
  id: Id;
  type: "authored_speech";
  text: string;
  role?: "vo" | "presenter" | "dialogue";
};

type SourceExcerpt = {
  id: Id;
  type: "source_excerpt";
  mediaSegmentId: Id;
  sourceInMs: number;
  sourceOutMs: number;
  transcriptSnapshot?: string;
};

type Music = {
  id: Id;
  type: "music";
  description?: string;
};

type SFX = {
  id: Id;
  type: "sfx";
  description: string;
};
```

Do not add additional block types until a required fixture demonstrates the need.

# External-reference stubs

Spike 0A does not implement the production graph, but it must prove stable narrative references to downstream objects.

```ts
type MediaSegment = {
  id: Id;
  assetId?: Id;
  sourceInMs: number;
  sourceOutMs: number;
  transcript?: string;
};

type ShotIntent = {
  id: Id;
  description: string;
};
```

## Relationship records

```ts
type Relationship = {
  id: Id;
  sourceId: Id;
  targetId: Id;
  type:
    | "requires_shot_intent"
    | "supported_by_media"
    | "source_excerpt_of";
};
```

The spike validates relationship semantics, not graph technology.

# Hierarchy invariants

At minimum:

- a Script contains Sections;
- a Section contains Beats directly or Scenes containing Beats;
- a Scene contains Beats;
- a Beat contains Cues;
- a Cue contains visual/audio ContentBlocks;
- objects cannot be nested outside the allowed hierarchy;
- references must target allowed object types;
- IDs are globally unique within the serialized NarrativeProject;
- parent ordering arrays are canonical ordering state.

The question of mixing direct Beats and Scenes inside one Section remains an explicit spike question, not an accidental implementation behavior.

# Identity and lifecycle invariants

## Edit

Changing title/text/content preserves identity.

## Move

Moving/reordering preserves identity and external relationships.

## Split Beat

Initial policy:

- left/first result retains the original Beat ID;
- right/second result receives a new ID;
- Cue assignment is explicit;
- external Beat relationships are redistributed explicitly or reported unresolved.

Candidate relationship policies:

```text
left
right
both
manual
```

## Merge Beats

Initial policy:

- caller identifies the canonical Beat whose ID survives;
- Cue order is explicit;
- relationships from removed Beats are not silently discarded;
- equivalent duplicate relationships may be normalized;
- provenance of merged IDs is exposed in operation/history metadata unless fixture evidence requires canonical persistence.

## Delete

Deletion may remove owned Narrative IR descendants, but must never silently delete external production objects.

Examples:

- deleting a Section may remove its owned Scenes/Beats/Cues/blocks;
- deleting a Beat may remove its owned Cues/blocks;
- deleting a Cue may remove its owned ContentBlocks;
- deleting a ContentBlock removes only that block;
- referenced MediaSegments and ShotIntents survive;
- relationship effects are returned explicitly.

Callers that want to preserve descendants must move them before deleting the container.

# SourceExcerpt semantics

`SourceExcerpt` represents recorded evidence, not authored speech.

Rules:

- source in/out must remain inside the referenced MediaSegment range;
- `sourceOutMs > sourceInMs`;
- transcript snapshot corrections do not change source media;
- rewriting a quote as new copy creates/replaces it with `AuthoredSpeech`;
- trimming source range is explicit via `trimSourceExcerpt`;
- moving/reordering a SourceExcerpt is handled as ContentBlock movement, not media mutation.

# Structural operation API

This list is authoritative for Spike 0A. Summary docs must point here rather than restate it.

```text
createSection
createScene
createBeat
createCue
createBlock

updateSection
updateScene
updateBeat
updateCue
updateBlock

moveSection
moveScene
moveBeat
moveCue
moveBlock

splitBeat
mergeBeats

deleteSection
deleteScene
deleteBeat
deleteCue
deleteBlock

linkShotIntent
unlinkShotIntent
linkMediaSegment
unlinkMediaSegment
trimSourceExcerpt
```

### Operation notes

- `moveSection` reorders `Script.sectionIds`.
- `moveScene`, `moveBeat`, and `moveCue` reorder or reparent within allowed hierarchy while preserving identity.
- `moveBlock` reorders/reparents blocks between compatible Cue visual/audio lanes; block type determines its valid lane.
- `deleteSection`, `deleteScene`, `deleteBeat`, and `deleteCue` follow the explicit narrative-descendant deletion semantics above.
- `deleteBlock` is the inverse lifecycle operation for `createBlock`.
- `linkMediaSegment` / `unlinkMediaSegment` represent generic narrative evidence/support relationships. A `SourceExcerpt` itself references its `MediaSegment` directly and therefore does not need a separate `linkSourceExcerpt` operation.
- `trimSourceExcerpt` changes only the selected range within existing media evidence.

Do not expose generic unrestricted `mutate(path, value)` as the primary public editing API.

## Operation contract

Every operation returns enough information for validation, undo/history, and future UI/AI diff presentation.

```ts
type OperationResult = {
  model: NarrativeProject;
  changedIds: Id[];
  createdIds: Id[];
  removedIds: Id[];
  relationshipEffects: RelationshipEffect[];
  warnings: DomainWarning[];
};
```

Requirements:

- operations behave transactionally;
- invalid operations return no partially mutated model;
- relationship effects are explicit;
- operation inputs/results are serializable;
- inversion/undo should be possible where practical during the spike.

# Serialization

The serialized representation must include a schema version.

```json
{
  "schemaVersion": 1,
  "script": {},
  "sections": {},
  "scenes": {},
  "beats": {},
  "cues": {},
  "blocks": {},
  "relationships": {},
  "mediaSegments": {},
  "shotIntents": {}
}
```

Object maps keyed by ID are preferred for Spike 0A; order is stored explicitly in parent ID arrays.

Round trip must preserve:

- IDs;
- ordering;
- content;
- target duration;
- source ranges;
- relationships;
- schema version.

# Runtime estimation

Runtime is authoring feedback, not frame-accurate editorial duration.

```text
if Cue.explicitDurationMs exists:
    Cue duration = explicitDurationMs
else:
    Cue duration = max(
        authoredSpeechEstimate,
        longestSourceExcerptDuration,
        visualHoldEstimate
    )

Beat duration    = sum(Cue durations)
Scene duration   = sum(Beat durations)
Section duration = sum(children durations)
Script duration  = sum(Section durations)
```

Authored speech uses configurable words-per-minute. SourceExcerpt uses `sourceOutMs - sourceInMs`. Visual-only Cues may carry a simple explicit hold estimate.

# Required fixtures

## Fixture A — 30-second product video

Structure:

```text
Hook
Problem
Demo
Benefit
CTA
```

Must exercise:

- AuthoredSpeech;
- visual descriptions;
- OnScreenText/Graphic if useful;
- several Cues in at least one Beat;
- ShotIntent relationships;
- target duration;
- Beat reorder/split/merge;
- Section reorder/delete behavior;
- block reorder/delete behavior;
- a small Scene-structure variant to pressure-test Section hierarchy rules.

## Fixture B — 2-minute interview/corporate piece

Must exercise:

- several SourceExcerpts;
- authored VO bridge;
- B-roll while sourced speech continues;
- replacement/trimming/reordering of SourceExcerpt blocks;
- Beat reordering while source identity survives;
- evidence relationships to MediaSegments.

## Fixture C — footage-first mini-documentary

Starts from mocked MediaSegments.

Must exercise:

- SourceExcerpt creation from media evidence;
- constructing Cues/Beats from existing sources;
- moving an excerpt to a different Beat;
- authored connective material;
- media-reference preservation through restructuring;
- relationship representation under footage-first pressure.

# Required behavioral tests

At minimum:

1. Create all fixtures from scratch.
2. Serialize → deserialize → semantic equivalence.
3. Edit text without ID churn.
4. Reorder Sections.
5. Move Beat without relationship loss.
6. Move Cue between Beats.
7. Reorder/move ContentBlocks.
8. Split a Beat with relationships and verify explicit redistribution behavior.
9. Merge Beats and verify no source relationship disappears.
10. Delete Section/Scene/Beat/Cue/Block and verify external MediaSegment/ShotIntent stubs survive.
11. Trim SourceExcerpt and verify range constraints.
12. Estimate runtime before/after structural edits.
13. Reject invalid hierarchy operations.
14. Reject duplicate IDs and dangling references.
15. Verify operation failures are atomic.

# Spike success criteria

Spike 0A passes if:

- all three fixtures use the same core domain model;
- no fixture requires a parallel workflow-specific schema;
- Beat and Cue remain useful and distinct;
- authored and sourced content semantics remain unambiguous;
- common restructuring preserves identity predictably;
- split/merge/delete effects are explicit;
- the authoritative operation vocabulary can express all required fixture edits without a generic mutation escape hatch;
- serialization preserves the full semantic model;
- runtime estimation is useful for structural authoring.

## Failure signals

Treat these as evidence against the current model:

- Cue repeatedly collapses into Beat;
- fixtures require hidden workflow-specific fields/schemas;
- common editing requires constant manual relationship repair;
- SourceExcerpt cannot represent documentary/radio-edit behavior cleanly;
- operation API becomes mostly special cases;
- hierarchy prevents natural fixture representation.

Failure is a valid spike outcome. Change the model before building UI.

# Open questions and fixture ownership

| Open question | Primary evidence |
| --- | --- |
| May a Section mix direct Beats and Scenes, or should it choose one structural mode? | Fixture A Scene-structure variant |
| Are Beat-level and Cue-level ShotIntent links both necessary? | Fixture A, checked against B |
| Is `Cue` the right/useful domain term? | Fixtures A, B, and C |
| What split relationship redistribution policy is least surprising? | Fixture A split tests |
| Should merge provenance live in canonical state or operation/history metadata? | Fixture A merge tests |
| What minimal visual-only duration input is useful without false precision? | Fixture A |
| Is a generic Relationship collection clearer than typed relationship arrays? | Fixtures B and C |

These are expected outputs of implementation. They should be resolved in the Spike 0A assessment before 0B begins, rather than by pre-implementation discussion alone.
