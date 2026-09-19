# Salai Priorities

Priority and user outcomes live here. Detailed tasks/status belong only in [filmmaking-implementation-plan.md](filmmaking-implementation-plan.md). The pivot is accepted in [ADR 0010](adr/0010-narrative-first-ai-filmmaking.md); technical additions remain subject to [RFC 0004](rfcs/0004-narrative-first-filmmaking-loop.md).

## NOW — Narrative-directed first film

As a filmmaker, I can tell or provide a story, see an inexpensive interpretation, and correct it without managing the breakdown by hand.

I can add a reference when I need it, see what a moment should communicate, and direct a change at the appropriate scope. I can keep a take, compare another, and preserve unrelated accepted work.

I can approve generation with its scope, external inputs, profile, and cost uncertainty visible. I can review stills, then request cheap motion, and stop when the result answers my creative question.

I can save/reopen the project and know which material is available, changed relative to its inputs, or still being produced. My recording remains source evidence, and a generated result does not rewrite what I originally said.

Only enough schema, persistence, job provenance, and direct editing to make that loop work belong in NOW. Existing operation-based groundwork precedes approved extensions.

## NEXT — More precise direction

Optional per-shot 3D placement of subjects/props, camera, and lights; higher-quality generation profiles; better local media handling; and deliberate specialist-NLE handoff. These use the same story/reference/media identities and approval loop.

The order is reevaluated after the first human pilot. Do not turn all next-scope items into prerequisites for stills.

## LATER — Evidence-dependent breadth

Long-screenplay scale, broader footage-first analysis, richer audio/performance controls, automated continuity or coverage suggestions, structural branching/merging, collaboration/review services, multi-provider orchestration, and production administration.

Cross-domain ideas such as digital threads and dependency graphs are research inputs, not backlog commitments by themselves.

## PAUSED — Standalone 0E timeline-depth program

The full [0E checklist](spike-0e-implementation-plan.md) is paused, not passed. Transport, selection, contextual inspection, order/duration edits, and context preservation are adopted when a filmmaking slice needs them. Deep multi-selection, all inspector types, and other breadth are not required merely because they appeared in the prior milestone.

Its unresolved domain questions remain in RFC 0003. No task may create shadow clip state to bypass them.

## Retained foundation

Reuse the Narrative IR, atomic operation/service boundary, external-harness integration, source-backed semantics, existing views, and timeline/playback adapters. Prior experiment evidence is indexed in [the documentation map](README.md); it is not new filmmaking validation.

## Scope test

A NOW item must answer: **Does this help the filmmaker see, direct, or safely update the current film while retaining narrative intent?**

If it mainly increases architectural generality, NLE breadth, provider coverage, or production-management scope, defer it until a concrete failure justifies it.
