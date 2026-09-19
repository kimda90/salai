# Salai Creative Workflows

Target workflow under [ADR 0010](adr/0010-narrative-first-ai-filmmaking.md). These are requirements for the new loop, not claims that generation/transcription already work. Exact acceptance requirements belong in [the PRD](prd.md); task state belongs in [the active plan](filmmaking-implementation-plan.md).

## The loop

```text
Tell → See → Direct → Update → See … → Stop / save / hand off
```

There is no compulsory “approve every breakdown field” step. There is also no automatic march to HQ. The filmmaker chooses what question to explore next and when the current result is enough.

## Tell

Speak, paste a story, or bring a draft screenplay. Preserve the original input. A transcript records what was said; the screenplay/narrative interpretation is separately authored and editable.

Present a compact interpretation and begin an inexpensive visual plan. Expose uncertainty that matters, especially names, pronouns, motivation, and who knows what. Do not present inferred details as supplied facts. Let the creator correct the story directly rather than requiring structural terminology.

The first implementation may use written input and the existing external harness. Voice intake must be labeled unavailable until its explicit transcription path works; a text-only development fixture is not validation of spoken-story intake.

## See

Show an ordered still storyboard with enough scene/beat context to understand why each shot exists. Support timed playback as an animatic, and identify missing material rather than fabricating completed results.

The viewer and a compact shot strip/timeline are the working context. The screenplay, intent, references, and details are accessible there. Expanding detail must not require losing the surrounding film.

Results can arrive progressively. Keep existing material visible and distinguish queued, running, failed, and ready work. Do not manufacture a duration estimate when none is available.

## Direct

React through text, voice when supported, references, candidate selection, direct edits, or later optional 3D staging. Reference upload is opportunistic, not required onboarding.

Examples:

- “She suspects him already; do not play this as a surprise.”
- “Use this apartment, but keep the framing.”
- “Keep this take. Shorten the pause before he answers.”

Capture the selected scope and project revision when the note is submitted. “Here” must not silently switch targets when the user moves the playhead. A scene note does not automatically rewrite a character globally.

Use existing atomic project edits for clear, reversible changes. Show a proposed change for ambiguous, destructive, or wide-reaching direction. Preserve the difference between a note, a proposed interpretation, and an accepted project change.

## Update

Separate changing the plan from spending resources to produce new media. Show the proposed targets, output profile, external recipient, references to be sent, and available cost information. Get approval before external generation or quality escalation.

Resolve guidance from the relevant project, section, scene, beat, shot, and selected references. Preserve where it came from. Do not re-create a full prompt hierarchy as a separate project.

Store a frozen request and its inputs with each result. Compare current effective inputs with those recorded inputs to identify material that may need updating. A mismatch is not proof that the existing take is unusable.

Keep the previous selection while candidates are generated. A completion from an older project revision is still useful history, but must not silently become the current take. Let the user compare, accept, retain, or reject it.

For a beat, scene, or sequence, update a scoped set of shots and rebuild the review assembly. Do not assume the whole sequence is one model request. Failed shots can be retried separately without erasing successful results or triggering unapproved duplicate charges.

## Increase fidelity only when useful

Stills answer composition and broad story questions. Timed stills help assess order and holds. Cheap generated motion tests movement and pacing. These are different output kinds, not interchangeable proof of quality.

The user may update only one shot, keep a mixed-fidelity assembly, or stop at a storyboard/animatic. Later low/HQ profiles and 3D direction use the same loop and retained narrative identity; they are not separate canonical workflows.

## Keep and resume

Save the canonical project, accepted selections, relevant guidance/revisions, request provenance, and asset references. Reopening must not depend on the original chat. Missing/offline media is reported and relinked, not reinterpreted as intentionally absent or regenerated automatically.

Imported/captured material retains its acquisition/source provenance. A story revision may change its use or suitability; it does not rewrite the recording or imply it was generated from the story.

## Supporting editorial work

Reorder, select, change Cue duration, edit useful fields, and play/scrub through the existing service and canonical model. Keep [source I/O and timing boundaries](editorial-interaction.md) intact. Do not require a complete NLE or completion of the entire former 0E checklist before testing this loop.
