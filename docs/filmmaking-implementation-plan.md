# Narrative-First Filmmaking — Implementation Plan

## Status and ownership

**Active plan; implementation not started.** Product direction was accepted on September 18, 2026. The documentation PR records scope and learning; it does not complete any implementation or human-validation task below.

This is the sole active task/status/evidence tracker. [PRD](prd.md) owns outcomes, [filmmaking-interaction.md](filmmaking-interaction.md) owns observable interaction, [architecture.md](architecture.md) owns boundaries, and [RFC 0004](rfcs/0004-narrative-first-filmmaking-loop.md) owns proposed additions and their review gates.

The prior [0E tracker](spike-0e-implementation-plan.md) is paused, not passed. No 0E checkbox is completed by this pivot.

## Inspected baseline

Baseline: `main` at `3a9b7cd2e23f5c1ad75811e33b8cd309b85bbcf9` (September 2, 2026). Branch/activity inspection found no open PR to build on at the time of this documentation work. Re-read the current branch before coding.

Implemented foundations include `packages/script-model/src/types.ts`, `operation-api.ts`, `operations.ts`, `serialization.ts`, their tests, and the prototype's shared project-service/machine and timeline/playback boundaries. The existing types contain minimal ShotIntent/MediaSegment references, not a full generation registry.

Preserved evidence: 0A passed the model spike; 0B was mixed on interaction; 0C passed external-harness validation; 0D was mixed because direct editing was insufficient. 0E had an accepted shape but its implementation tasks remained unchecked. Consult the original assessment documents rather than treating this summary as new test evidence.

## Pilot and finish line

Use a small story with approximately 2–3 scenes and 8–12 planned shots, at least one reusable character/location reference, and one meaningful change in audience/character understanding. These are proposed fixture dimensions, not production scale limits.

A complete pilot includes: story intake, an inexpensive still review, a narrative note, selective candidate generation/selection, cheap-motion review, and save/reopen. Voice must be exercised before claiming spoken-story support. A still-only or developer-assisted run is useful intermediate evidence, not completion of the full pilot.

The filmmaker may stop at a storyboard or cheap draft. HQ and 3D are not exit requirements for this first loop.

## Sequence

```text
F0  Existing-model interaction fixture + contract review
 ↓
F1  Minimal media/guidance persistence + still review
 ↓
F2  One real external still-generation loop + directed update
 ↓
F3  Spoken intake + cheap-motion review
 ↓
F4  Human pilot and decision
```

Prefer one focused PR per slice. Do not combine a desktop rewrite, 3D editor, complete NLE, provider platform, or generalized dependency system into these slices.

## F0 — Existing-model fixture and review path

Goal: make the intended user interaction concrete without pretending to have generation.

- [ ] Read current code, [ADR 0010](adr/0010-narrative-first-ai-filmmaking.md), and the active specs; identify reusable controller/CLI/timeline components.
- [ ] Create a representative story fixture through existing canonical operations, preserving Beat/Cue distinction and explicit ShotIntent references.
- [ ] Show viewer/shot context and a concise intent description; capture feedback with an explicit target and submission context.
- [ ] Support direct order/duration/text edits through the existing service; retain source evidence and immediate grouped-revert limits.
- [ ] Reuse only necessary 0E fixes, starting with transport/selection/context and non-distracting review media; record adopted task references here.
- [ ] Review RFC 0004 and approve the minimal domain/migration plan before F1 adds new canonical records.

**Gate:** a reviewer can identify the targeted moment, give a note, inspect a proposed change, and see a canonical edit without learning object wiring. Fake or fixture media is clearly labeled. No new generation/runtime capability is claimed.

## F1 — Minimal records, save/reopen, and still review

Goal: support real candidate/reference identity without a production graph.

- [ ] Implement the accepted minimal asset/reference, ShotIntent-direction, per-use selection, guidance-revision, and frozen-request records in the existing canonical boundary.
- [ ] Add only necessary typed operations/validation, update `narrative-ir-spec.md`, and test migration/round-trip from the inspected baseline.
- [ ] Preserve stable IDs, multi-block Cues, relationship cardinality, and source/acquisition provenance.
- [ ] Show ordered still candidates and timed animatic playback; selected material, not newest arrival, controls the assembly.
- [ ] Compose scoped guidance, preserve origin/history, and compare complete effective input manifests, including added/removed references and changed ancestry.
- [ ] Implement the smallest durable save/reopen/material-relink behavior sufficient for this fixture; distinguish metadata from media-byte retention.
- [ ] Use deterministic fake execution to test success, partial failure, duplicate/late completion, deleted targets, and unknown provenance.

**Gate:** the still-review fixture survives reopening, preserves old candidates/selections, and reports changed inputs conservatively. No full World, Coverage, prompt hierarchy, or general job platform is required.

## F2 — One real still-generation path and directed revision

Goal: replace fake execution with one explicitly supported external path.

- [ ] Select and document one current executor/profile and how UI direction reaches the external harness; complete RFC 0004's execution gate without introducing an unapproved runtime/transport.
- [ ] Show scope, inputs/recipient, profile, cost information or uncertainty, and obtain approval before dispatch.
- [ ] Generate real still candidates, retain the actual request/output provenance, and import results through validated service actions.
- [ ] Execute one narrative note, one scoped reference replacement, and one direct edit; review which targets should update rather than inferring every consequence automatically.
- [ ] Demonstrate unchanged selections/project IDs outside the approved change and preserve prior material while new jobs run.
- [ ] Verify delayed/duplicate completion, partial failure, and explicit retry behavior with the live executor where safely testable.
- [ ] Record any manual/dev-harness steps and their user overhead instead of hiding them in the pilot report.

**Gate:** Tell/See/Direct/Update works with actual stills. At least one narrative-directed revision is useful to a human reviewer. Application-boundary correctness does not stand in for image quality or model adherence.

## F3 — Spoken intake and cheap motion

Goal: cover the original spoken-story/cheap-previs workflow.

- [ ] Add the explicit recording/transcription path through approved external execution; preserve original recording/transcript separately from authored adaptation.
- [ ] Review uncertain names, roles, and intent; do not invent supplied facts or silently rewrite source evidence.
- [ ] Add one low-cost moving-output profile with explicit approval and known capability limits.
- [ ] Implement and test duration/fit handling under current Cue semantics; do not resolve deferred timing/split questions inside renderer state.
- [ ] Update one shot and one selected scene/beat group; retain successful results, still fallbacks, and mixed-fidelity review.
- [ ] Exercise interruption/reopen, unavailable media, and a stale in-flight result without replacing accepted work.

**Gate:** a recorded story can reach reviewed cheap motion; the user can direct a further change or stop. A timed still animatic alone does not satisfy this motion gate.

## F4 — Human pilot and learning decision

- [ ] Have the filmmaker perform the workflow, not just observe an agent demonstration.
- [ ] Observe at least two meaningful revision cycles, including one narrative note and one reference/visual direction change.
- [ ] Record whether the displayed intent/context helped the next decision and whether the system's proposed scope was correct/useful.
- [ ] Record time to useful first review, manual corrections/context re-entry, unnecessary update prompts, preserved selections, failures, and actual/unknown cost.
- [ ] Record one unsuccessful or ambiguous interpretation where possible and how the user recovered; do not report only favorable examples.
- [ ] Test saved-project continuation without relying on the original conversation and verify available media/recovery.
- [ ] Write an assessment with evidence, limitations, and a continue/narrow/rethink decision. Compare a familiar/manual or competing workflow only if actually exercised.

**Pass:** the filmmaker can make and retain meaningful narrative-directed revisions with acceptable effort, understand external work before approving it, and recover their project. **Fail/narrow:** intent adds bookkeeping without helping decisions, updates disturb accepted work, or provider/runtime friction prevents a usable loop. A failed hypothesis is valid evidence, not a reason to add a larger ontology.

## Next, not hidden prerequisites

After the pilot: optional 3D placement/camera/lights, explicit low/HQ profiles, richer real-media import, and optional downstream handoff. Reassess priority from actual evidence. The original 3D idea is retained, not silently dropped.

Later only when justified: automatic continuity/coverage suggestions, long-screenplay scale, sophisticated audio/dialogue control, story branches/merge, collaboration, full production administration, and broader backend integration.

## Verification for every implementation PR

Run focused tests plus `pnpm typecheck`, `pnpm test`, and `pnpm build`. Update discovery when machine commands change. Include tests for identity, atomicity, source preservation, serialization/migration, per-use selection, effective-input changes, and asynchronous result handling as relevant.

No paid generation belongs in deterministic CI. No human task is checked from unit tests. Keep the implementation plan current with commit/PR/test evidence rather than copying exact task state into other living docs.
