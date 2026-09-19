# Salai Structural Editorial Interaction Contract

## Status after the filmmaking pivot

Structural editorial now **supports** the narrative-first filmmaking loop; it is not the standalone prerequisite milestone. [ADR 0010](adr/0010-narrative-first-ai-filmmaking.md) changes priority, not ownership of story state. The primary interaction contract is [filmmaking-interaction.md](filmmaking-interaction.md).

The original accepted 0E contract is preserved verbatim in [editorial-interaction-0e.md](editorial-interaction-0e.md). Its full checklist is not implicitly required by every new slice. [RFC 0003](rfcs/0003-semantic-editorial-interaction-model.md) remains accepted within its scope, and its five deferred questions remain unresolved. 0E is paused, not implemented or validated.

## Supporting behavior required by the active loop

The viewer and ordered story/shot strip must let the creator find the relevant moment, see its narrative context, review available material, make a correction, and see the result. Keep selection and transport consistent across direct and agent-assisted work. Do not force mechanical Story/Moments/Media switching to reach ordinary feedback.

Start with the smallest useful controls: select, play/pause, seek, inspect intent, reorder where supported, adjust Cue duration, and select a candidate through the explicit future binding contract. Add more of the old 0E grammar only when a named active-plan acceptance criterion needs it.

A stills-only review can use an ordered board/animatic without first implementing a complete hierarchical NLE. It must not claim to prove motion, performance, or final timing.

## Semantics that do not change

- Canonical ordering and timing come from the Narrative IR, not engine tracks.
- Cue remains the narrative interval; ordinary visual/audio blocks share that interval and retain their ordered lanes.
- Multiple blocks per Cue remain supported; a convenient one-shot fixture is not a one-shot-per-Cue schema restriction.
- SourceExcerpt in/out is recorded source evidence, distinct from Cue narrative duration.
- Canonical reorder/duration edits ripple derived time. Viewport, expansion, selection, and playhead are non-canonical interaction state.
- Direct edits use the shared project service and public validated operations. Grouped changes publish atomically.
- Existing media is preserved when narrative objects are removed; no cascade deletion of external assets.
- Unsupported gestures are disabled or rejected, not stored as hidden renderer state.

Exact operations and invariants remain in [narrative-ir-spec.md](narrative-ir-spec.md). New result-selection and media-fit contracts must be reviewed in [RFC 0004](rfcs/0004-narrative-first-filmmaking-loop.md) before implementation.

## Deferred questions are not shortcuts

Cue splitting, source-excerpt splitting, independent within-Cue timing, intentional black-versus-missing identity, and broad cross-parent grouped moves still require explicit RFC 0003 resolution when reached. The generation pivot does not settle them.

Before generated motion is placed in time, the relevant implementation slice must state its duration/trim/hold policy and test it. Do not silently change story duration to fit a provider's output or equate a failed generation with intentional silence/black.

## Evaluation

Retain 0D's lesson: passive labels without useful correction are insufficient. Evaluate whether the minimal supporting editor lets the filmmaker understand and improve the current sequence. Do not mark all of 0E passed because the new review loop works, or require all of 0E before testing that loop.
