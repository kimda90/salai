# Salai Scripting Model

## Purpose and ownership

The script preserves **what the creator is trying to communicate**, not just the wording of a screenplay or the prompts for current shots. This rationale supports the narrative-first filmmaking loop; it does not introduce a second schema. Exact implemented types and operations remain in [narrative-ir-spec.md](narrative-ir-spec.md), and proposed generation extensions belong in [RFC 0004](rfcs/0004-narrative-first-filmmaking-loop.md).

## From telling to a working film

A spoken telling is source input. Its recording and transcript remain distinguishable from the authored screenplay interpretation. Salai may propose scene structure, Beats, Cues, and shot descriptions, but interpretation must not silently rewrite the source recording or misrepresent a synthesized line as a recorded quote.

Breakdown is assistance, not a required form-filling stage. The creator can correct what matters and add references when useful. Unknown details can remain visibly provisional; the system must not imply that a suggested prop, motivation, or setting was specified by the user.

## Small semantic distinctions worth keeping

A **Beat** expresses a meaningful narrative progression. A **Cue** expresses an audiovisual moment in time. A **ShotIntent** describes a desired production realization; it is not currently a new mandatory child below every Cue.

For example, “Maria realizes Pedro lied” can need an insert, a reaction, and a sound, or one sustained shot. Changing that coverage should not erase the Beat's identity or force a fixed shot count into the story hierarchy.

Use existing Section/optional Scene/Beat/Cue structure. “Sequence” can be user-facing language for an appropriate Section; it does not authorize an additional nesting layer. Preserve existing direct Beats inside Sections and multi-block Cues. Exact new shot/asset bindings require explicit design rather than a silent `cueId` shortcut.

## Intent, direction, and prompts

Narrative intent answers why a moment exists. Direction describes a desired expression of it: a performance, composition, sound, pace, or reference. A provider prompt is one generated request representation, not the definition of the story.

Keep initial intent in ordinary readable text and the smallest relevant fields. Do not require formal preconditions, audience-state logic, satisfaction graphs, or controlled emotional taxonomies. Scoped guidance and its revision history should remain understandable without exposing compiler terminology.

An instruction such as “she is pretending to be frightened” may require interpretation and a proposed change. It is not a deterministic rewrite rule. The creator approves the meaning and judges the result; recording the changed inputs only establishes provenance.

## Authored versus sourced material

Script-first is the first product loop, but footage-first semantics remain valid and must not regress. SourceExcerpt retains its source identity and range. Authored bridges and rewritten dialogue remain authored material. Imported media may be linked to an intention without claiming that the intention caused or generated the recording.

## Timing and stable identity

Reordering or rewriting should preserve identity where the implemented operation semantics allow it. Splits, merges, and deletion must retain their explicit relationship policies. The current Cue-owned timing contract remains authoritative; a generated video's duration does not automatically replace the intended Cue duration.

Screenplay, outline, storyboard, and temporal review are representations of the project. Free-form working text may include notes, questions, and rejected ideas; it is not automatically canonical story state. Do not promise lossless bidirectional editing across arbitrary screenplay formats before implementing and testing it.

## Next proof

Test whether the filmmaker can tell a small story, see stills, give a narrative correction, see the revised sequence, and retain useful choices through cheap motion. Keep the model as small as that proof permits. A comprehensive screenplay parser, formal narrative solver, or production ontology is not a prerequisite.
