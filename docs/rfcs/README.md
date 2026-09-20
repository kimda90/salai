# Salai RFC Process

Use RFCs for changes to shared product/technical semantics that benefit from review before implementation: canonical domain objects, operation contracts, timing, persistence, runtime boundaries, or changes that invalidate existing behavior. Small local implementation details do not need a separate RFC.

## Lifecycle

Draft → Proposed → Accepted / Rejected / Superseded.

An RFC includes status, summary, motivation, proposal, alternatives, consequences/risks, open questions, and decision/outcome. Use `NNNN-short-title.md`. The PR/review discussion is the decision surface.

After acceptance, promote concrete observable behavior, types, and operations to the owning canonical specification; add an ADR where durable architecture history is needed. Keep intentionally deferred questions in the RFC until resolved. Do not duplicate active task completion or exact operation vocabularies here.

## Current records

- [0001 — One Narrative IR, multiple workflows](0001-one-narrative-ir-multiple-workflows.md): foundation of the implemented narrative model.
- [0002 — Agent-mediated authoring](0002-agent-mediated-authoring.md): direction leading to the validated external-harness boundary.
- [0003 — Semantic editorial interaction](0003-semantic-editorial-interaction-model.md): **accepted within its scope**. Standalone 0E execution is now paused under ADR 0010. Its deferred Cue/source splitting, within-Cue timing, intentional-black identity, and cross-parent grouped-move questions remain here and must not be implemented implicitly.
- [0004 — Narrative-first filmmaking loop](0004-narrative-first-filmmaking-loop.md): **accepted F0 interaction and minimal F1 domain/migration plan**. Execution, motion, and 3D gates remain unresolved. The accepted design is not an implemented F1 schema or generation API.

The [active plan](../filmmaking-implementation-plan.md) records implementation evidence separately from RFC acceptance. A slice must resolve the relevant gate before implementing new semantics or execution boundaries. Product approval alone does not resolve those engineering details.
