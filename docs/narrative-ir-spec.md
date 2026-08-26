# Narrative IR Technical Design Specification

## Status

**Implemented baseline — Spike 0A validated**

This document is the authoritative implementation contract for the Narrative IR. The Spike 0A implementation and assessment validated this baseline; future evidence may revise it explicitly rather than through drifting summary docs.

See [`spike-0a-assessment.md`](spike-0a-assessment.md) for the implementation result and resolved open questions.

## Purpose

Validate whether one small, stable semantic representation can support both:

- script-first narrative construction; and
- footage-first narrative construction.

The spike should answer product-model questions before application architecture makes them expensive to change.

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

Definitions are canonical in [`glossary.md`](glossary.md). Implementation-specific semantics in this document take precedence for Spike 0A behavior.

The model deliberately stops at Cue. Do not introduce a more atomic narrative level unless later workflow evidence demonstrates the need.

## Design principles

1. **Meaning before media.** A Beat is not a shot, clip, line of dialogue, or timeline item.
2. **Stable identity.** Reordering or text editing does not recreate domain objects.
3. **Authored and sourced material are semantically different.** Recorded evidence must not become silently editable prose.
4. **Explicit structure over generic nesting.** Avoid an unrestricted graph/tree where any object can contain any other object.
5. **Relationships are explicit but do not require a graph database.** Plain typed objects plus relationship records are sufficient.
6. **Operations are the mutation API.** UI and future AI should invoke the same validated structural operations.
7. **No cascade destruction of production material.** Deleting narrative structure must not silently delete source media or ShotIntents.
8. **Workspace layout is not Narrative IR.** Story Wall position/color/rotation/parking-lot state belong to the workspace layer validated in Spike 0B.

# Scope

## In scope

- TypeScript domain types;
- stable IDs;
- explicit hierarchy validation;
- minimal visual/audio content types;
- AuthoredSpeech vs SourceExcerpt;
- mocked ShotIntent and MediaSegment references;
- create/update/move/delete operations;
- Beat split/merge semantics;
- serialization/deserialization and schema versioning;
- runtime estimation;
- operation/result validation;
- three realistic fixtures and automated tests.

## Out of scope

- Electron;
- React UI;
- Tiptap/ProseMirror/Lexical;
- Python/FastAPI;
- SQLite;
- Resolve/CutMaster;
- OpenAssetIO/OTIO integration;
- real transcription/media analysis;
- real LLM calls;
- Fountain/FDX;
- collaboration/CRDT;
- freeform canvas/workspace persistence;
- production-ready performance optimization.

# Domain types

The implementation uses normalized object maps keyed by stable IDs, with ordering stored explicitly on parents.

```ts
type Id = string;

type Script = {
  id: Id;
  title?: string;
  targetDurationMs?: number;
  sectionIds: Id[];
};

type Section = {
  id: Id;
  title?: string;
  childIds: Id[]; // Scene or Beat
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

Do not add additional block types until workflow evidence demonstrates the need.

# External-reference stubs

Spike 0A does not implement the production graph, but it proves stable narrative references to downstream objects.

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

The implementation evidence suggests `source_excerpt_of` may be redundant with `SourceExcerpt.mediaSegmentId`; this is recorded as a known cleanup candidate in the Spike 0A assessment rather than silently changing the validated schema.

# Hierarchy invariants

- a Script contains Sections;
- a Section may contain Beats directly and/or Scenes containing Beats;
- a Scene contains Beats;
- a Beat contains Cues;
- a Cue contains visual/audio ContentBlocks;
- objects cannot be nested outside the allowed hierarchy;
- references must target allowed object types;
- IDs are globally unique within the serialized NarrativeProject;
- parent ordering arrays are canonical ordering state;
- every Section/Scene/Beat/Cue/ContentBlock is reachable from the Script through exactly one canonical parent path.

Fixture A demonstrated that mixed direct Beats and Scenes can be useful. Spike 0B must pressure-test whether this remains understandable in actual authoring UX.

# Identity and lifecycle invariants

## Edit

Changing title/text/content preserves identity.

Public update operations use JSON-safe patch semantics:

```text
field omitted → preserve current value
field: null   → clear optional value
```

Changing a ContentBlock's semantic type is not an update: replacing SourceExcerpt with AuthoredSpeech requires explicit delete/create behavior.

## Move

Moving/reordering preserves identity and external relationships.

## Split Beat

Validated policy:

- left/first result retains the original Beat ID;
- right/second result receives a new ID;
- Cue assignment is explicit;
- Beat-level relationships use an explicit caller policy.

Supported policies:

```text
left
right
both
manual
```

`both` requires caller-provided IDs for duplicated relationships so operation patches remain deterministic and serializable.

## Merge Beats

Validated policy:

- caller identifies the canonical Beat whose ID survives;
- Cue order is explicit;
- relationships from removed Beats are preserved by retargeting to the canonical Beat;
- equivalent duplicate relationships may be normalized;
- merged Beat IDs are exposed in operation/history metadata rather than canonical Beat state.

## Delete

Deletion may remove owned Narrative IR descendants, but never silently deletes external production objects.

Examples:

- deleting a Section removes its owned Scenes/Beats/Cues/blocks;
- deleting a Beat removes its owned Cues/blocks;
- deleting a Cue removes its owned ContentBlocks;
- deleting a ContentBlock removes only that block;
- referenced MediaSegments and ShotIntents survive;
- relationship removals are returned explicitly.

Callers that want to preserve descendants must move them before deleting the container.

# SourceExcerpt semantics

`SourceExcerpt` represents recorded evidence, not authored speech.

Rules:

- source in/out are finite values inside the referenced MediaSegment range;
- `sourceInMs >= 0` and `sourceOutMs > sourceInMs`;
- transcript snapshot corrections do not change source media;
- rewriting a quote as new copy creates/replaces it with `AuthoredSpeech`;
- trimming source range is explicit via `trimSourceExcerpt`;
- moving/reordering a SourceExcerpt is handled as ContentBlock movement, not media mutation.

# Structural operation API

This list is authoritative for the validated Spike 0A baseline. Summary docs must point here rather than restate it.

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
- `linkMediaSegment` / `unlinkMediaSegment` represent generic narrative evidence/support relationships. A `SourceExcerpt` itself references its `MediaSegment` directly and does not need a separate `linkSourceExcerpt` operation.
- `trimSourceExcerpt` changes only the selected range within existing media evidence.

Do not expose generic unrestricted `mutate(path, value)` as the primary public editing API.

## Operation contract

Every operation returns enough information for validation, history/undo, and future UI/AI diff presentation.

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

Validated behavior:

- operations are transactional from the caller's perspective;
- invalid operations expose no partially mutated model;
- input state remains untouched;
- relationship effects are explicit;
- operation inputs/results are JSON-serializable;
- immutable input plus serializable operation/result data leaves a clean path to history/undo, while a first-class inverse-operation API is intentionally deferred.

# Serialization

The serialized representation includes an explicit schema version.

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

Object maps keyed by ID are canonical in this baseline; order is stored explicitly in parent ID arrays.

Round trip preserves:

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

Authored speech uses configurable words-per-minute. SourceExcerpt uses `sourceOutMs - sourceInMs`. Visual-only timing is represented by explicit Cue duration when known; estimation may optionally receive a simple visual-hold assumption without making false precision canonical.

All timing values must be finite and non-negative where applicable.

# Required fixtures — implemented

## Fixture A — 30-second product video

Structure:

```text
Hook
Problem
Demo
Benefit
CTA
```

Implemented pressure tests include:

- AuthoredSpeech;
- visual descriptions;
- OnScreenText and Graphic;
- several Cues in the Demo Beat;
- Cue-level ShotIntent relationships;
- target duration;
- Beat reorder/split/merge;
- Section reorder/delete;
- block reorder/delete;
- mixed Section hierarchy with a Scene grouping Demo + Benefit alongside direct Beats.

## Fixture B — 2-minute interview/corporate piece

Implemented pressure tests include:

- several SourceExcerpts;
- authored VO bridge;
- B-roll while sourced speech continues;
- replacement/trimming/reordering of SourceExcerpt blocks;
- Beat reordering while source identity survives;
- evidence relationships to MediaSegments.

## Fixture C — footage-first mini-documentary

Starts from mocked MediaSegments and implements:

- SourceExcerpt creation from media evidence;
- Cues/Beats constructed from existing sources;
- moving a sourced excerpt to a different narrative context;
- authored connective material;
- media-reference preservation through restructuring;
- generic evidence relationships under footage-first pressure.

# Behavioral acceptance — implemented

Automated tests cover at minimum:

1. all fixtures created from scratch through the operation model;
2. serialize → deserialize semantic equivalence;
3. text/field edit without ID churn;
4. Section reorder;
5. Beat move without relationship loss;
6. Cue move between Beats;
7. ContentBlock reorder/move;
8. Beat split with explicit relationship redistribution;
9. Beat merge with relationship preservation;
10. Section/Scene/Beat/Cue/Block deletion while external MediaSegment/ShotIntent stubs survive;
11. SourceExcerpt trimming and range constraints;
12. runtime before/after edits;
13. invalid hierarchy rejection;
14. duplicate/dangling/orphan/reference validation;
15. atomic operation failure;
16. JSON-serializable operation/result semantics;
17. manual split relationship policy;
18. non-finite timing rejection.

# Spike result

Spike 0A **passes** the current success criteria:

- all three fixtures use one core domain model;
- no parallel workflow-specific schema was required;
- Beat and Cue remained useful and distinct;
- authored and sourced content semantics remained unambiguous;
- common restructuring preserved identity predictably;
- split/merge/delete effects are explicit;
- all fixture edits were expressible through the 27-operation vocabulary without a generic mutation escape hatch;
- serialization preserves the semantic model;
- runtime estimation is useful for structural authoring.

See [`spike-0a-assessment.md`](spike-0a-assessment.md) for the detailed conclusions and remaining pressure points for Spike 0B.
