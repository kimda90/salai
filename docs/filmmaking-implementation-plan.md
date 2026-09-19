# Narrative-First Filmmaking — Implementation Plan

## Status and ownership

**Active plan. F0 implementation and technical verification are complete on September 19, 2026.** Product direction was accepted on September 18, 2026. F1–F4 are not implemented. Human validation remains separate from technical evidence.

This is the sole active task/status/evidence tracker. [PRD](prd.md) owns outcomes, [filmmaking-interaction.md](filmmaking-interaction.md) owns observable interaction, [architecture.md](architecture.md) owns boundaries, and [RFC 0004](rfcs/0004-narrative-first-filmmaking-loop.md) owns the accepted F1 domain/migration plan and unresolved later gates.

The prior [0E tracker](spike-0e-implementation-plan.md) is paused, not passed. No 0E checkbox is completed by this pivot.

## Inspected baseline

F0 starts from `main` at `a241f2a` on September 19, 2026. It includes the 0E implementation in `fd8a1d9` and technical evidence in `ae4e3c5`. The pivot documentation inspected the earlier `3a9b7cd` baseline. Its unchecked snapshot does not describe all code now present. F0 work is on `codex/f0-film-review`.

Implemented foundations include `packages/script-model/src/types.ts`, `operation-api.ts`, `operations.ts`, `serialization.ts`, their tests, and the prototype's shared project-service/machine and timeline/playback boundaries. The existing types contain minimal ShotIntent/MediaSegment references, not a full generation registry.

Preserved evidence: 0A passed the model spike; 0B was mixed on interaction; 0C passed external-harness validation; 0D was mixed because direct editing was insufficient. 0E has technical implementation through 0E.4, with human interaction gates still open. Consult the original assessment documents rather than treating this summary as new test evidence.

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

- [x] Read current code, [ADR 0010](adr/0010-narrative-first-ai-filmmaking.md), and the active specs; identify reusable controller/CLI/timeline components.
- [x] Create a representative story fixture through existing canonical operations, preserving Beat/Cue distinction and explicit ShotIntent references.
- [x] Show viewer/shot context and a concise intent description; capture feedback with an explicit target and submission context.
- [x] Support direct order/duration/text edits through the existing service; retain source evidence and immediate grouped-revert limits.
- [x] Reuse only necessary 0E fixes, starting with transport/selection/context and non-distracting review media; record adopted task references here.
- [x] Review RFC 0004 and approve the minimal domain/migration plan before F1 adds new canonical records.

**Gate:** a reviewer can identify the targeted moment, give a note, inspect a proposed change, and see a canonical edit without learning object wiring. Fake or fixture media is clearly labeled. No new generation/runtime capability is claimed.

### F0 implementation evidence

Technical verification date: September 19, 2026. This is an agent-operated implementation check. A filmmaker has not yet evaluated usefulness or comprehension.

| Criterion | Evidence | Source |
| --- | --- | --- |
| Representative story | `filmmaking-fixture.ts` builds two Scenes, four Beats, and eight Cues with existing operations. Each moment links a ShotIntent stub. | `film-direction.test.ts` validates identity, multiple content blocks, deterministic construction, and serialization. |
| Review context | `FilmReview.tsx` shows ordered moments, Scene/Beat context, narrative intent, and linked shot direction. Eight local SVG sketches are labeled as fixture media. | Browser checks verified all images load, playback advances, and selection seeks to the intended moment. |
| Frozen direction | The controller captures target, text, local revision, playhead, and a copied project snapshot. Selection and workspace changes do not retarget the note. | Unit tests and a live browser note on moment 4 followed by selection of moment 8. |
| Review before application | `propose-direction` stages validated existing operations through the same CLI/HTTP bridge. The UI derives before/after fields from the actual result. | Real CLI process tests and browser review, acceptance, and revert. |
| Direct edits | Duration, authored text, beat intent, and sibling order use existing atomic operations. Detailed temporal edits remain in the existing timeline. | Browser edits changed the selected Cue and authored block while preserving source evidence. |
| Failures and stale work | Edits invalidate pending proposals. Dismissed, duplicate, replaced, reset, and deleted-target requests cannot apply. Invalid batches leave the project unchanged. | `film-direction.test.ts` and `live-machine-flow.test.mjs`. |
| Domain review | RFC 0004 records the accepted minimal F1 domain/migration plan. F0 retains schema version 1. | Engineering review in RFC 0004. No new canonical record is implemented. |

Adopted 0E work: 0E.0.3 safe Space transport, the timeline projection and viewer, 0E.2 contextual selection, and 0E.4 canonical order/duration/text edits. F0 uses silent local sketches. Playback retains its position after canonical edits. Revert retains a selection when that object exists in the restored project. No deferred timing or split behavior is added.

Checks: `pnpm typecheck`, `pnpm test`, and `pnpm build` pass with Node.js 24.19.0 and pnpm 10.34.5. The uncached suite passes 146 tests across 35 files. CLI/bridge tests require local socket and child-process access. The build reports a bundle-size warning above 500 kB. [PR #74](https://github.com/kimda90/salai/pull/74) contains the implementation and hosted CI results. CI passes for the initial implementation commit `2cebcd7`.

Browser evidence covers proposal acceptance, grouped revert, direct text/duration/order edits, unchanged source ranges, stale-note resubmission, dismissal, and Space in a text field. Timeline navigation preserves the selected Cue and returns to its review context. Narrow and wide layouts show the controls without document-level horizontal overflow. A clean final load has no console errors or warnings. These checks establish technical behavior, not narrative quality or filmmaker usability.

Known limits: one active note/proposal, conservative whole-project revision checks, no saved notes, no durable project/media bundle, and no automatic agent dispatch. The external harness must read context and propose changes. Fixture drawings remain fixed after text edits. ShotIntent and MediaSegment stubs are fixture inputs because current public operations can only link them.

Development observation: hot updates to shared controller code caused transient React context errors during implementation. A full reload restores the prototype. This does not occur on the verified clean load.

The follow-up UI review found that view changes discarded an unfinished direction note. The draft text and scope now remain in controller interaction state. A regression test and browser round-trip verify retention without a canonical edit or loss of immediate revert. Resetting or changing the fixture clears the draft.

To conduct the human review, start `pnpm dev` and open `http://localhost:5173/salai/?bridge=1&fixture=filmmaking`.

1. Watch the storyboard and select moment 4.
2. Read its narrative intent and submit the example direction, or write another note.
3. Ask the external agent to read context and return a proposal using the discovered command.
4. Inspect the interpretation, affected items, and before/after values.
5. Apply or dismiss the proposal, then inspect the story again.
6. Revert the edit before another project or workspace edit.
7. Record whether intent helped the decision and whether the proposed scope matched the note.

The functional F0 path is implemented. The human observation remains unclaimed. Continue with the accepted F1 data contract only as a separate implementation slice.

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
