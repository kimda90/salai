# Narrative IR Technical Design Specification

## Status

**Draft — Spike 0A implementation contract**

This document is the Technical Design Document for the first Narrative IR implementation. It intentionally describes the domain model independently from Electron, React, Python, SQLite, Resolve, AI providers, or rich-text editor frameworks.

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

Definitions:

- **Beat** — the smallest intentional unit of narrative progression. It may advance information, action, argument, emotion, revelation, or audience understanding.
- **Cue** — an audiovisual/temporal moment used to express part of a Beat.
- **ContentBlock** — typed visual or audio content attached to a Cue.
- **ShotIntent** — production intent describing material needed to express narrative intent, independent from its realization.
- **MediaSegment** — a referenced range of existing media used as evidence/source material.

The model deliberately stops at Cue for Spike 0A. Do not introduce a more atomic narrative level unless a required fixture cannot be represented cleanly without one.

## Design principles

1. **Meaning before media.** A Beat is not a shot, clip, line of dialogue, or timeline item.
2. **Stable identity.** Reordering or text editing does not recreate domain objects.
3. **Authored and sourced material are semantically different.** Recorded evidence must not become silently editable prose.
4. **Explicit structure over generic nesting.** Avoid an unrestricted graph/tree where any object can contain any other object.
5. **Relationships are explicit but do not require a graph database.** Plain typed objects plus relationship records are sufficient for the spike.
6. **Operations are the mutation API.** UI and future AI should eventually invoke the same validated structural operations.
7. **No cascade destruction of production material.** Deleting narrative structure must not silently delete source media or ShotIntents.
8. **Workspace layout is not Narrative IR.** Story Wall position/color/rotation/parking-lot state belong to a later workspace layer.

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

# Proposed domain types

The exact TypeScript syntax may evolve during implementation; the semantic boundaries should not change silently.

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

Start with the smallest types required by the fixtures.

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

Do not add more block types until a required fixture demonstrates the need.

# External-reference stubs

Spike 0A does not implement the full production graph, but it must prove that narrative objects can retain stable references to downstream objects.

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

Use explicit relationship records instead of hidden foreign-key conventions for cross-domain links.

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

Spike 0A should validate semantics, not graph technology.

# Hierarchy invariants

At minimum:

- a Script contains Sections;
- a Section contains Beats directly or Scenes that contain Beats;
- a Scene contains Beats;
- a Beat contains Cues;
- a Cue contains visual/audio ContentBlocks;
- a Cue cannot contain another Beat/Cue;
- a Beat cannot directly contain a Section;
- references must target an object of an allowed type;
- IDs are unique within the serialized project model.

If mixed direct Beats and Scenes inside one Section makes implementation/UX ambiguous, the fixtures should expose that and the hierarchy should be narrowed.

# Identity invariants

## Edit

Changing title/text/content preserves object identity.

```text
update Beat summary
→ same Beat ID
```

## Move

Moving/reordering an object preserves identity and all external relationships.

```text
move beat_7 from position 4 to 2
→ beat_7 remains beat_7
```

## Split

Initial policy:

- the first/left result retains the original Beat ID;
- the second/right result receives a new ID;
- Cue assignment is explicit in the operation input;
- Beat-level external relationships must not be silently guessed.

If the original Beat has external relationships, `splitBeat` must either:

1. receive an explicit relationship redistribution policy; or
2. return unresolved relationship effects requiring caller resolution.

Allowed policies may include:

```text
left
right
both
manual
```

The spike should determine whether this is sufficient or too cumbersome.

## Merge

Initial policy:

- caller identifies the canonical Beat whose ID survives;
- Cues are ordered explicitly;
- relationships from removed Beats are not discarded;
- duplicate equivalent relationships may be normalized;
- provenance of merged Beat IDs should be available in the operation result or metadata for undo/debugging.

## Delete

Deleting a Beat/Cue removes narrative structure only.

It must not silently delete:

- MediaSegments;
- ShotIntents;
- source Assets;
- future Resolve objects.

The operation result should report relationships that became detached/removed.

# SourceExcerpt semantics

`SourceExcerpt` represents recorded evidence, not editable authored speech.

Rules:

- source in/out must remain inside the referenced MediaSegment range;
- sourceOut must be greater than sourceIn;
- transcriptSnapshot may be corrected for display/transcription purposes, but changing it does not change the underlying source media;
- converting a sourced quote into rewritten VO must create/replace it with `AuthoredSpeech`, not mutate the SourceExcerpt into fictional recorded words;
- trimming is an explicit source-range operation.

# Structural operation API

Candidate initial operations:

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
moveScene
moveBeat
moveCue
splitBeat
mergeBeats
deleteScene
deleteBeat
deleteCue
linkShotIntent
unlinkShotIntent
linkMediaSegment
unlinkMediaSegment
trimSourceExcerpt
```

Do not expose a generic unrestricted `mutate(path, value)` as the primary public editing API in Spike 0A.

## Operation contract

Every operation should return enough information for validation, future undo, and future UI/AI diff presentation.

Conceptually:

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

Implementation may use immutable or controlled mutable internals; externally the operation must behave transactionally.

If validation fails, do not return partially changed model state.

# Serialization

The serialized representation must contain an explicit schema version.

Example:

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

Map/object storage keyed by ID is preferable for the spike because identity is primary and ordering is stored explicitly in parent ID arrays.

A successful round trip must preserve:

- IDs;
- ordering;
- content;
- target duration;
- source ranges;
- relationships;
- schema version.

# Runtime estimation

Runtime is authoring feedback, not frame-accurate edit duration.

## Cue duration

Initial rule:

```text
if explicitDuration exists:
    duration = explicitDuration
else:
    duration = max(
        authoredSpeechEstimate,
        longestSourceExcerptDuration,
        visualHoldEstimate
    )
```

## Authored speech

Use configurable words-per-minute with a reasonable default for the fixture tests. The exact default is a product setting, not an invariant.

## SourceExcerpt

```text
duration = sourceOut - sourceIn
```

## Visual hold

Visual-only Cues may supply an explicit estimate. Do not invent sophisticated computer-vision timing in Spike 0A.

## Aggregation

```text
Beat duration    = sum(Cue duration)
Scene duration   = sum(Beat duration)
Section duration = sum(children duration)
Script duration  = sum(Section duration)
```

The product should later compare estimated vs target duration.

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
- OnScreenText/Graphic if required;
- several Cues in at least one Beat;
- ShotIntent relationships;
- target duration;
- Beat reorder/split.

## Fixture B — 2-minute interview/corporate piece

Must exercise:

- several SourceExcerpts;
- authored VO bridge;
- visual B-roll while sourced speech continues;
- replacement/trimming of a SourceExcerpt;
- Beat reordering while source identity survives.

## Fixture C — footage-first mini-documentary

Starts from mocked MediaSegments rather than authored Beats.

Must exercise:

- SourceExcerpt creation from media evidence;
- constructing Cues/Beats from existing source material;
- moving an excerpt to a different Beat;
- adding authored connective material;
- preserving all media references through restructure.

# Required behavioral tests

At minimum:

1. Create each fixture from scratch.
2. Serialize → deserialize → deep semantic equivalence.
3. Edit text without ID churn.
4. Move Beat without relationship loss.
5. Move Cue between Beats.
6. Split a Beat with relationships and verify explicit redistribution behavior.
7. Merge Beats and verify no source relationship disappears.
8. Delete narrative structure and verify MediaSegment/ShotIntent stubs survive.
9. Trim SourceExcerpt and verify source constraints.
10. Estimate runtime before and after structural edits.
11. Reject invalid hierarchy operations.
12. Reject duplicate IDs / dangling references on validation.

# Spike success criteria

Spike 0A passes if:

- all three fixtures use the same domain types;
- no fixture requires a parallel workflow-specific schema;
- Beat and Cue remain useful and distinct across all fixtures;
- AuthoredSpeech and SourceExcerpt semantics are unambiguous;
- common restructuring preserves identity predictably;
- split/merge/delete relationship effects are explicit rather than magical;
- serialization round-trip preserves the full semantic model;
- duration estimation is useful for structural authoring;
- meaningful revisions can be expressed through the operation vocabulary without a generic escape-hatch mutation API.

## Failure signals

The spike should be considered evidence against the current model if:

- Cue repeatedly becomes redundant with Beat;
- required workflows need hidden workflow-specific fields/schemas;
- common editing requires constant manual relationship repair;
- SourceExcerpt semantics cannot represent documentary/radio-edit behavior cleanly;
- the operation API becomes mostly special cases;
- the hierarchy prevents natural fixture representation.

Failure is a valid spike outcome. Change the model before building UI.

# Open questions to resolve during implementation

1. May a Section mix direct Beats and Scenes, or should each Section choose one structural mode?
2. Are Beat-level and Cue-level ShotIntent links both necessary, or does one become the useful default?
3. Is `Cue` the right user/domain term after fixture testing?
4. What relationship redistribution UI/policy is least surprising for split operations?
5. Should merge provenance live in the canonical model or only operation/history metadata?
6. What minimal visual-only duration input feels useful without false precision?
7. Is a separate generic Relationship collection clearer than typed relationship arrays on domain objects for this first package?

These are expected spike outputs, not prerequisites that must be solved by discussion alone.
