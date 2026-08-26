# Spike 0A — Narrative IR Assessment

## Result

**PASS — the current Narrative IR is credible enough to proceed to Spike 0B authoring UX.**

This is not a claim that the model is final. It means the implementation answered the Spike 0A question without requiring parallel workflow-specific schemas or a generic mutation escape hatch.

The assessment is based on the implemented `@salai/script-model` package, the three representative fixtures, structural-operation tests, serialization/runtime tests, and fixture-specific pressure tests.

## What was implemented

- normalized, versioned `NarrativeProject` storage keyed by stable IDs;
- explicit `Script → Section → Scene?/Beat → Cue → ContentBlock` hierarchy;
- typed visual/audio blocks;
- `AuthoredSpeech` and media-backed `SourceExcerpt`;
- mocked `MediaSegment` and `ShotIntent` external objects;
- explicit cross-domain relationships;
- the authoritative 27-operation structural vocabulary;
- transactional validation around operations;
- split/merge/delete relationship semantics;
- validated JSON serialization/deserialization;
- Cue/Beat/Scene/Section/Script runtime estimation;
- all three required production fixtures.

## Fixture results

### Fixture A — 30-second product video

The model naturally represented:

```text
Hook
Problem
Demo
Benefit
CTA
```

The Demo Beat contains three separate Cues for wide installation, connector insert, and UI confirmation. This was useful rather than redundant: one narrative idea remained one Beat while AV timing/coverage remained independently manipulable.

The fixture also supported:

- Cue-level ShotIntent links;
- Beat reorder;
- Beat split/merge;
- Section reorder/delete;
- ContentBlock reorder/delete;
- a Scene variant containing Demo + Benefit while Hook/Problem/CTA remained direct Beats.

### Fixture B — interview/corporate

The same model represented SourceExcerpts, authored VO bridges, and visuals occurring while interview audio continued.

The fixture and tests supported:

- trimming a recorded excerpt without changing its media identity;
- replacing one SourceExcerpt with a different source excerpt;
- moving Beats while source identity remained stable;
- generic B-roll/evidence relationships to MediaSegments.

No documentary-specific script schema was required.

### Fixture C — footage-first mini documentary

The project started from mocked MediaSegments and then constructed narrative structure from that evidence.

The same Beat/Cue hierarchy supported:

- SourceExcerpt creation from existing material;
- visual source relationships;
- moving a sourced quote to another Cue/Beat context;
- adding authored connective VO;
- preserving source references through restructure.

This is sufficient evidence that reverse scripting does not need a separate canonical narrative model at this stage.

# Open-question resolutions

## 1. May a Section mix direct Beats and Scenes?

**Yes, for now.**

Fixture A's Scene pressure test was natural:

```text
Section
├ Hook Beat
├ Problem Beat
├ Demo Scene
│  ├ Demo Beat
│  └ Benefit Beat
└ CTA Beat
```

Forcing every Beat into a Scene merely because one local sequence benefits from Scene grouping would add ceremony. Conversely, removing Scene prevents a useful traditional grouping level.

Spike 0B should test whether this remains understandable in Outline/Story Wall UX. If the mixed hierarchy is confusing to users, narrow it at the UX/domain boundary then.

## 2. Should ShotIntent link at Beat or Cue level?

**Allow both; prefer Cue when concrete AV coverage exists.**

Fixture A showed Cue-level relationships are more precise for concrete coverage. They also survive a Beat split automatically because the Cue retains identity.

Beat-level ShotIntent relationships remain useful earlier in ideation when the production need belongs to the idea as a whole and Cues have not yet been elaborated.

A practical default for 0B:

```text
high-level / early intent → Beat
specific audiovisual coverage → Cue
```

The split tests are evidence that Beat-level relationships require explicit redistribution, while Cue-level relationships generally do not.

## 3. Is Cue useful enough to keep?

**Yes. Keep `Cue` as the domain term for 0B.**

Across all three fixtures it represented a meaningful temporal/AV unit below narrative meaning:

- product: several visual actions inside one Demo Beat;
- interview: B-roll + sourced speech / VO combinations;
- documentary: source-backed and authored moments within the same narrative structure.

This does not require every user-facing surface to display the word “Cue.” AV Script can expose it naturally while Outline can mostly hide it.

## 4. What split relationship policy is least surprising?

**Do not guess. Make the relationship outcome explicit.**

The implemented operation requires a split policy:

```text
left
right
both
manual
```

`both` requires caller-provided IDs for duplicated relationships, keeping operation patches deterministic and serializable.

This is slightly more verbose than a magical default, but the fixtures showed that guessing semantic ownership of a Beat-level relationship is unsafe.

In 0B the UI can make common choices easy, while the domain operation remains explicit.

## 5. Where should merge provenance live?

**Operation/history metadata, not canonical Beat state.**

The surviving Beat identity plus an operation result containing merged Beat IDs was sufficient. Persisting historical merged IDs on every canonical Beat would pollute the current narrative model with edit-history concerns.

If future undo/collaboration requires a durable operation log, merge provenance belongs there.

## 6. What is the minimum useful visual-only duration input?

**Explicit Cue duration, with optional estimation policy outside canonical meaning.**

The model supports `Cue.explicitDurationMs`. Runtime estimation can optionally receive a simple `visualHoldMs` assumption, but the canonical model does not invent visual timing when none was authored.

This avoids false precision while still making 15/30/60/90-second structural authoring useful.

## 7. Generic Relationship collection or typed arrays?

**Keep a generic relationship collection for cross-domain associations, but keep intrinsic ownership/source identity typed directly.**

The fixtures benefited from generic relationships for:

- Beat/Cue → ShotIntent;
- Beat/Cue/ShotIntent → MediaSegment evidence.

Containment is not represented as generic graph edges; parent ordering arrays remain explicit and canonical.

Likewise `SourceExcerpt.mediaSegmentId` is intrinsic to what a SourceExcerpt *is* and should remain a typed direct reference. A separate `source_excerpt_of` relationship is therefore redundant in normal fixture construction and should be reconsidered before a long-lived schema is frozen.

# Other implementation findings

## Stable identity worked as intended

Normal field edits, moves, Cue moves, block moves, and Beat/Section reorders preserve IDs. Source identity remains stable through narrative restructuring.

## Deletion must remain narrative-only

Cascade deletion of owned narrative descendants was workable as long as external `MediaSegment` and `ShotIntent` objects survive. Relationship removals are explicit in `OperationResult`.

This matches the editorial expectation that removing something from active narrative structure is not equivalent to destroying source material.

## Structured operations are viable

The 27-operation vocabulary expressed all required fixture changes. No generic `mutate(path, value)` escape hatch was required.

The public update API uses:

```text
field omitted → preserve current value
field: null   → clear optional value
```

This keeps update patches JSON-serializable for future AI/history use.

## Transaction boundary is viable

Operations validate input, operate on cloned state, validate output, and return no partial model on failure. Tests verify the caller's project remains unchanged after invalid operations.

# Known limitations / 0B pressure points

These do not block 0A completion:

- the current package uses linear parent lookups; performance optimization is intentionally deferred;
- no durable operation/history log or collaboration model exists;
- inversion is not implemented as a first-class API, although immutable input + serializable operations/results leave a path to history/undo;
- external MediaSegment/ShotIntent creation is outside the Narrative IR operation vocabulary by design;
- `source_excerpt_of` is likely redundant with `SourceExcerpt.mediaSegmentId` and should be simplified before schema stability is promised;
- `Cue` is validated as a domain concept, not necessarily permanent user-facing terminology;
- mixed Scene/direct-Beat hierarchy must be tested with real Story Wall/Outline users in 0B.

# Recommendation

Proceed to **Spike 0B — Authoring UX**.

0B should treat the implemented `@salai/script-model` package as the canonical semantic model and test four familiar surfaces over it:

1. Story Wall;
2. Outline;
3. AV Script;
4. Paper/Radio Edit.

Do not introduce persistence, Resolve, or AI as a way to compensate for UX problems. If a familiar authoring surface exposes a genuine semantic failure in the IR, revise the package based on that evidence.
