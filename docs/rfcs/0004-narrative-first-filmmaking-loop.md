# RFC 0004 — Minimal Narrative-First Filmmaking Loop

## Status

**Proposed implementation shape for review in the pivot documentation PR.** Product direction is accepted in [ADR 0010](../adr/0010-narrative-first-ai-filmmaking.md); this RFC is not an implemented schema or machine API.

Accept this RFC, including the decisions required below, before implementing new canonical filmmaking records. Existing-operation UX groundwork can proceed under the active plan. After acceptance, update the canonical Narrative IR specification alongside implementation, migrations, operations, and tests; do not relabel the present spec as if these additions already existed.

## Summary and motivation

Support a small loop: story interpretation → still candidates → contextual narrative feedback → scoped update → cheap-motion review. Retain existing story identities and source evidence. The user should not manage a graph, and the implementation should not begin with one.

Current `packages/script-model/src/types.ts` has a minimal ShotIntent, MediaSegment references, and narrative ContentBlocks. It does not contain an asset registry, per-object revision history, generation jobs, or a selected generated-video block. Those gaps need explicit small extensions, not hidden engine state.

## Proposal

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

**Before new domain records (F1):** approve the concrete field/operation delta, per-use material binding, guidance-history policy, schema migration, and save/reopen fixture. The owning implementation PR must update `narrative-ir-spec.md`; this RFC deliberately does not duplicate its operation vocabulary.

**Before real generation (F2):** select one executor and output profiles using current documentation; define approval/cost, data-sharing, recovery/idempotency, and request/receipt integration through the existing boundary. A new runtime/transport requires its own explicit decision.

**Before cheap motion (F3):** choose and test returned-media duration/fit behavior inside current Cue semantics. Resolve an RFC 0003 question only if the implementation actually needs it.

**Before 3D (next scope):** select an engine, coordinate/staging representation, and one verified export/conditioning path. 3D is not required for F0–F4.

## Decision / outcome

Awaiting implementation-shape review. Product scope is accepted; no code, new operation, provider selection, or new runtime is approved as implemented by this document. Track the above gates in [filmmaking-implementation-plan.md](../filmmaking-implementation-plan.md).
