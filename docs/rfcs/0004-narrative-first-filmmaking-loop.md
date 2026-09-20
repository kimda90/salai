# RFC 0004 — Minimal Narrative-First Filmmaking Loop

## Status

**Accepted for the existing-model F0 interaction and the minimal F1 domain/migration plan on September 19, 2026.** The execution and motion decisions remain unresolved. Product direction is accepted in [ADR 0010](../adr/0010-narrative-first-ai-filmmaking.md).

This acceptance records the engineering review performed during the authorized F0 implementation. It does not represent human product validation or implemented F1 records. Implement the accepted delta with migrations, typed operations, tests, and the canonical Narrative IR specification in F1. Resolve the remaining gates before the corresponding later slices.

## Summary and motivation

Support a small loop: story interpretation → still candidates → contextual narrative feedback → scoped update → cheap-motion review. Retain existing story identities and source evidence. The user should not manage a graph, and the implementation should not begin with one.

Current `packages/script-model/src/types.ts` has a minimal ShotIntent, MediaSegment references, and narrative ContentBlocks. It does not contain an asset registry, per-object revision history, generation jobs, or a selected generated-video block. Those gaps need explicit small extensions, not hidden engine state.

## Staged design

### 1. Preserve the existing narrative model

Keep Script/Section/optional Scene/Beat/Cue/ContentBlock and the existing relationships. Express intent in current authored fields first. Do not introduce a mandatory Intent/Requirement/Satisfaction type hierarchy.

Enrich the existing ShotIntent identity for shot direction, reference links, and later optional nested staging. Do not migrate stable IDs merely to rename it Shot. Preserve the existing ability to link narrative objects and shot intents explicitly; a single `cueId` field must not replace those links.

The initial generated sequence can use one principal planned visual shot per Cue as an authoring convention. Multiple shots across a Beat use multiple ordered Cues. Existing multi-block Cue content remains valid. This convention is not a global one-to-one invariant and does not resolve independent within-Cue timing.

### 2. Add the smallest explicit media/reference bindings

Add ordinary project-owned records for concrete assets and references required by the pilot. Keep imported/captured versus generated origin explicit. A minimal reusable character/location/prop reference is enough; do not require a complete World schema.

Represent selected generated visual material through an explicit canonical content/media binding, not a URL stored only in a renderer. Selection must be per use in the assembly, so choosing another take for one use cannot silently alter every use of the same ShotIntent. Preserve multiple visual/audio blocks.

Do not cascade-delete media when narrative structure is deleted. A source recording's acquisition provenance remains unchanged by later story direction. SourceExcerpt ranges may change through explicit source-trim operations; they remain evidence selections, not rewritten recordings.

### 3. Keep guidance authored and requests frozen

Store generation guidance with appropriate existing scopes and scoped reference assignments. Basic guidance history is a sequence of readable revisions/snapshots, not Git-style branches or a universal event log. Reusing old guidance creates a new revision. Schema version and content revision are separate concepts.

A generation request records at least:

- stable request identity and target/use identity;
- requested output kind and quality/cost profile;
- a frozen effective input manifest: referenced IDs, versions/content identifiers, relevant inherited guidance, and sufficient values or immutable snapshots to inspect later;
- actual prompt/workflow parameters and execution identity when known, without credentials;
- approval/scope, known cost information or explicit uncertainty, and returned artifact identity/result metadata.

Resolve explicit structured local overrides predictably; preserve their origin. Keep free-form narrative guidance as context. Contradictory creative instructions require interpretation/review, not an invented universal constraint solver.

Flatten the relevant resolved inputs into each request. No standalone dependency database is needed. Comparing an old manifest with the newly resolved one must detect added/removed inputs and hierarchy changes, not merely increments on the immediate ShotIntent.

### 4. Be conservative about change

A matching input manifest means input-current, not narratively successful. A mismatch means needs review; unavailable/incomplete inputs mean unknown. Imported media without a generation manifest is not automatically stale.

For prose/motivation changes, the external harness may propose affected shots with reasons. It must distinguish those suggestions from deterministic references and let the filmmaker correct the scope. Do not automatically mutate performance, dialogue, music, or production facts from a guessed causal graph.

Initially compare records directly. Fine-grained indexes, dependency facets, or caching are later optimizations only if measured false positives or latency warrant them. UI focus, viewport, and playhead changes must not invalidate generation. A change to an actual conditioning input, including a selected still used for motion, does change the relevant request inputs.

### 5. Separate request, result, and selection

An approved request is fixed at submission. Results refer to that snapshot even if the project changes. Register completion idempotently; retain actual outputs instead of promising deterministic regeneration.

Before presenting a result as current, compare its inputs and verify the target still exists. Late or partial results remain candidates. They do not restore deleted narrative objects or automatically replace accepted media. Explicit selection is a canonical operation.

Track enough execution status to recover a request, not a new planning runtime. Timeout or cancellation may leave provider status/cost unknown; do not blindly retry paid work. Keep previous selections and successful outputs through failure.

### 6. External execution and persistence

Retain ADR 0008. Start with one external executor/harness route and deterministic fake execution in tests. Do not add provider SDKs, credential management, a model router, an embedded agent runtime, or another transport as an incidental UI choice.

A developer-assisted request/receipt path may test the early data flow, but must be labeled as such. Before the live pilot, resolve how user direction reaches the external harness and how approved requests/results return through the existing machine/service boundary. Do not count manually copying files as a completed end-user loop.

Save/reopen the small canonical project extension and asset references, plus the actual media bytes or a tested durable retrieval/relink path. Avoid a desktop/persistence-platform rewrite. Missing media and interrupted external requests must be explicit after reopening.

### 7. Keep temporal questions scoped

The first still animatic and cheap-motion assembly follow Cue-owned sequential time. Decide the explicit fit/trim/hold policy for a returned clip in the initial implementation; never silently persist engine-only offsets, stretch source evidence, or claim a duration estimate is measured output duration.

The deferred questions in [RFC 0003](0003-semantic-editorial-interaction-model.md) remain there. Reaching independent within-Cue timing or split semantics requires that RFC's explicit resolution, not a side effect of this pivot.

## Acceptance examples

A scene-guidance edit marks requests using that scene's effective inputs for review, but does not alter their bytes or selections. Attaching a new reference is detected even though it did not exist in the old request. Moving a shot's use into another scene changes inherited context. Reordering unrelated Cues does not automatically invalidate unconditioned shot media.

An in-flight result arrives after its target is deleted: preserve the artifact and request, do not recreate the target. A duplicate receipt produces no duplicate candidate. A recorded interview remains a source recording after a narrative rewrite. An input-current frame can still be rejected by the filmmaker.

## Alternatives considered

Reject a generic Film graph, formal satisfaction/coverage engine, per-layer prompt entity hierarchy, and ShotIntent → ShotPlan → Realization service chain as prerequisites. Reject renderer-only media bindings and globally selected takes that ignore placement. Reject rebuilding all generated assets after every edit.

Retain ordinary typed records, explicit relationships, snapshots, and existing operations where sufficient. The goal is a reviewable film, not exhaustive production modeling.

## Consequences and risks

Small schema additions still require migration and validation work. Coarse revision tracking may create unnecessary review warnings. Undeclared inputs can create false negatives. Generated outputs may ignore preserved direction. Human review and actual pilot evidence are required; none of these limitations is solved merely by storing a revision number.

## Decisions required before the corresponding implementation

**Before new domain records (F1):** follow the accepted domain/migration plan below. The owning implementation PR must update `narrative-ir-spec.md` with exact types and operation signatures. A materially different binding or migration needs renewed review.

**Before real generation (F2):** select one executor and output profiles using current documentation; define approval/cost, data-sharing, recovery/idempotency, and request/receipt integration through the existing boundary. A new runtime/transport requires its own explicit decision.

**Before cheap motion (F3):** choose and test returned-media duration/fit behavior inside current Cue semantics. Resolve an RFC 0003 question only if the implementation actually needs it.

**Before 3D (next scope):** select an engine, coordinate/staging representation, and one verified export/conditioning path. 3D is not required for F0–F4.

## F0 domain and migration review

The review question is whether the pilot needs a new narrative hierarchy or a second state owner. It does not. The existing controller, operation batches, timeline projection, and playback adapter support the F0 interaction.

F0 retains schema version 1. A submitted note contains a target, text, playhead, local project revision, and copied submission context. One pending note and proposal live in controller interaction state. They are not serialized as narrative facts. A proposal uses existing operations, previews the resulting field changes, and requires explicit acceptance. Any intervening canonical edit invalidates acceptance. This conservative rule is sufficient for eight moments. It is not the later generation-input comparison algorithm.

The current API links ShotIntent and MediaSegment stubs but cannot create or update those stubs through public operations. F0 seeds documented fixture stubs, then builds all narrative structure and relationships with operations. Do not use that fixture construction path to import live project data.

### Accepted F1 delta

These records are design commitments for F1, not callable F0 capabilities.

| Owner | Minimal addition | Invariants |
| --- | --- | --- |
| Project assets | An asset map with stable ID, media kind, MIME type, byte length, content digest, origin, and optional generation request ID. | Imported, captured, and generated origins stay distinct. Returned bytes and identity are immutable. Missing bytes do not delete the record. |
| Visual content | A `visual_media` ContentBlock with candidate asset IDs and an optional selected asset ID. It can record the associated ShotIntent ID. | The block is the material use. Selection affects only that block. Preserve other visual/audio blocks and existing Beat/Cue-to-ShotIntent relationships. |
| Scoped guidance | Immutable guidance revisions plus a current revision pointer for each typed scope. Each revision contains text and named reference bindings. | Allowed scopes are Script, Section, Scene, Beat, ShotIntent, and material use. Reusing old guidance appends a revision. No edits to historical revisions. |
| Reference bindings | Each binding contains a stable slot name, role, and asset ID. | The pilot reuses named slots such as `mara` or `workshop`. A local binding replaces the inherited binding for that slot. An explicit empty binding removes it locally. |
| Requests | A request map with ID, target use and ShotIntent identities, output kind/profile, frozen inputs, prompt/parameters, executor identity, and approval scope. | Preserve the input values and identifiers needed to inspect the actual request. Credentials never enter these records. |
| Completion | Request execution status, receipt identity, and returned asset IDs. | Repeating the same receipt is a no-op. Conflicting receipts fail. Completion registers candidates but never selects them. Deleted targets remain historical references. |

Resolve structured bindings from Script → Section → optional Scene → Beat → ShotIntent → material use. Preserve free-form guidance from each scope with its origin. Do not silently resolve contradictory prose. If several ShotIntents condition one use, freeze their explicit ordered identities and guidance. Do not choose one from map iteration order.

Compare the complete resolved manifest, including membership, reference slots, content digests, inherited guidance, and relevant story text. A scene move or added reference must be detectable. Exclude presentation selection, viewport, and playhead. A selected still used to condition motion is a real input and must be included.

Use typed operation families to register assets, revise scoped guidance, create/update material uses, request work, record completion, and select candidates. Add public stub registration/update operations only where live import requires them. Validate all references, media kinds, selection membership, immutable receipts, and history at the existing operation boundary. Do not add a generic patch operation.

### Migration and save/reopen

1. Introduce schema version 2 only when F1 implements these records.
2. Read version 1 projects by adding empty asset, guidance, and request collections.
3. Preserve every existing ID, relationship, ordering array, block, and source range.
4. Leave old media relationships intact. Do not infer selected candidates or generation provenance from them.
5. Reject unsupported future versions without modifying the input file.
6. Save the canonical JSON with a separate asset-byte map in one portable JSON bundle for the small pilot.
7. Store bundled bytes as base64, keyed by asset ID, with MIME type and digest checks on import.
8. Mark absent bytes as unavailable and support deliberate relinking to matching content.

The portable bundle avoids a desktop rewrite and a dependency for archive handling. Base64 increases file size. Set and test an explicit import-size limit during F1. Move to an archive or directory format only when actual pilot media exceeds that limit. The serializer remains separate from the byte bundle. Downloading a file is the persistence step. An in-memory object or blob URL is not a durable save.

The F1 fixture must round-trip all existing fixtures and the F0 story. It must contain two uses of one ShotIntent with different selections, older candidates, a replaced reference, and an interrupted request. Verify added/removed inputs, changed ancestry, duplicate completion, deleted targets, missing bytes, digest mismatch, and unknown provenance. Tests must use fake execution and actual local image bytes. They must not claim real generation quality or a human pass.

### Alternatives and remaining gates

Reject renderer-only candidate selection because it cannot survive canonical save/reopen. Reject a global selected take on ShotIntent because its uses can differ. Reject a graph database, general event log, and job platform because direct records answer the pilot questions.

The existing bridge is sufficient for F0 proposal review. F2 must still choose and verify one executor, profiles, approval/cost disclosure, request/receipt recovery, and the complete user handoff. F3 must resolve returned-video duration/fit behavior before motion. The deferred RFC 0003 semantics remain deferred. No new runtime or transport is accepted here.

## Decision / outcome

Accept the bounded F0 interaction and F1 domain/migration plan above. Retain the later execution, motion, and 3D gates. Track implementation and evidence only in [the active plan](../filmmaking-implementation-plan.md). This decision does not claim that F1 schema, durable media, or generation exists.
