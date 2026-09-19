# Salai Reliability Expectations

## Status

No customer Service Level Agreement applies. Salai is a local-first prototype moving toward a narrative-first AI filmmaking loop, not a production service with contractual uptime, generation-quality, or response-time guarantees.

This document owns reliability expectations, not implementation status. The active work is tracked in [filmmaking-implementation-plan.md](filmmaking-implementation-plan.md). Source and operation invariants remain in [narrative-ir-spec.md](narrative-ir-spec.md).

## Preserve the film while external work runs

Generation, transcription, and interpretation can fail or take an unknown amount of time. The user must still be able to inspect available work. Previously selected media and committed story decisions remain intact until an explicit replacement is accepted. A failed job must not produce a half-published canonical edit or silently retry a paid request.

Record submitted context independently from current mutable project state. Late results attach to their original request and become reviewable candidates, not automatic overwrites of a changed/deleted target. Duplicate callbacks must not create duplicate selected takes. Where a provider cannot guarantee cancellation or idempotency, expose that limitation and an unknown external-job state rather than promising no charge or no duplicate generation.

## Persistence and recovery

The first real-generation loop needs enough save/reopen behavior to retain committed intent, references, available media, selections, and request provenance. Saving metadata alone is insufficient if the referenced bytes are temporary, expired, or unavailable. State exactly what is durable, what needs relinking, and what is intentionally transient.

Keep schema migration versioned and tested. Preserve original media and recorded input snapshots; do not overwrite source evidence. The new persistence contract is proposed in RFC 0004 and must be implemented before claiming durability. Existing Narrative IR serialization alone does not save a full generated-media project.

## Honest derived status

Input changes indicate that an output was created from older inputs, not that it is creatively invalid. Missing media, unknown provenance, execution failure, and artistic rejection are different conditions. The creator may keep an older output deliberately.

Recorded prompts, parameters, seed, and provider/workflow versions improve traceability but do not guarantee bit-identical regeneration. Retaining actual output media matters. Do not advertise reproducibility without a backend-specific measured guarantee.

## External boundaries

Show which material/context will leave the device and to whom, and request the relevant approval before transmission/spend. Do not place credentials in project files. Unavailable providers must produce understandable degraded states; existing local material remains usable where the prototype supports it.

Timeline/playback libraries are product implementation dependencies, not optional external services. Their failure is a product defect, even though their state must remain disposable and derivable from Salai state.

## Measure before promising

Measure time to a useful first preview, update latency, generation failures, duplicate submissions, lost/relinked media, save/reopen success, and unintended changes. Report backend cost estimates as estimates and unknown prices as unknown. Do not invent response-time or cost guarantees, a quality SLA, or cancellation guarantees before representative evidence exists.
