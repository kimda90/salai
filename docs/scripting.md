# Salai Scripting Model

## Role of this document

This document explains **why** Salai needs a structured scripting/narrative model and which creative problems pressure-test it.

Canonical terminology lives in [`glossary.md`](glossary.md). Exact types, invariants, operation vocabulary, fixtures, and tests live in [`narrative-ir-spec.md`](narrative-ir-spec.md).

This document does not maintain a parallel schema/API, Narrative Lens taxonomy, or implementation tracker.

## Why structured narrative data still matters

A Salai “script” is not only formatted prose. It must work across:

- short-form branded/product work;
- interviews/documentary;
- corporate video;
- YouTube/educational content;
- commercials;
- traditional scene-based work.

Projects may begin from a blank idea or from existing footage/source evidence.

Working hypothesis:

> A Salai script is stable semantic production data that can be normalized from messy authored intent or source material, inspected through several representations, and consumed by downstream production/editorial systems without losing identity.

The user should not have to manually construct every level of that structure for ordinary creative work. The structure may still be exposed deliberately through Narrative Lenses when it contributes to a creative decision.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md) and [`narrative-lenses.md`](narrative-lenses.md).

## Why Beat and Cue are separate

A creator may have one narrative idea that requires several audiovisual moments.

```text
Beat: installation is simple

Cue 1  wide installation      VO starts
Cue 2  connector insert       VO continues
Cue 3  UI confirmation        SFX
Cue 4  reaction               music rises
```

The conceptual distinction is:

- **Beat** — the narrative progression the audience should receive;
- **Cue** — an audiovisual moment used to express part of that Beat.

This distinction can remain semantically important without forcing users to explicitly create every Cue.

For example:

```text
Show three quick installation moments under the same line of VO.
```

may normalize to one Beat with several Cues. An AV-oriented view can expose them later when audiovisual realization is the actual creative question.

No lower semantic layer is currently justified.

## Script-first and footage-first share one model

### Script-first

A creator may begin with rough prose:

```text
Open with the frustration of the old process.
Then show installation in three fast moments.
End on the time saved.
```

That intent can normalize into the same canonical model used by structured views and downstream production planning.

### Footage-first

An editor may begin with interview excerpts, B-roll, screen recordings, or archive material plus an instruction such as:

```text
Build a short story around the old process, what changed, and the result.
```

The critical semantic distinction is between:

- **authored material**, whose words/content are intentionally editable; and
- **sourced material**, whose wording/timing comes from recorded evidence.

An agent must not turn a recorded interview excerpt into editable authored copy merely because rewriting would be easier.

## Narrative intent is independent from realization

A narrative need should not become equivalent to whichever clip currently fills it.

Conceptually:

```text
Beat / Cue
    ↓
ShotIntent
    ↓
possible realizations
- captured take
- generated previs/final
- stock
- graphic/composite
- storyboard
```

This separation enables later questions such as:

- what coverage is missing;
- which footage supports this idea;
- which alternatives exist;
- whether a missing moment should be shot, found, generated, or represented as previs.

The full production graph is intentionally later than Spike 0C.

## Stable identity matters more than formatted text

Narrative objects may eventually link to source media, ShotIntents, annotations, generated alternatives, Workspace cards, action history, views, and Resolve objects.

Therefore:

- rewriting text should not recreate identity unnecessarily;
- reordering should not sever relationships;
- split/merge/delete must report relationship consequences explicitly;
- source-backed content must keep source identity;
- agent normalization should preserve identity during restructuring where possible;
- switching representations must not create another copy of the story.

Exact behavior belongs to [`narrative-ir-spec.md`](narrative-ir-spec.md).

## Duration is part of authoring

Video work frequently has a target duration before a timeline exists.

Narrative IR therefore provides approximate structural timing from Cue-level inputs such as:

- authored speech estimate;
- actual source-excerpt duration;
- explicit duration;
- simple visual hold estimate.

This is creative feedback, not frame-accurate editorial timing.

Natural-language requests such as:

```text
Get this under 45 seconds without losing the result quote.
```

should be able to operate over that same canonical duration information.

## Free-form working text is not the Script

A low-friction working area may contain:

- prose;
- questions;
- production notes;
- alternatives;
- uncertainty;
- pasted source context.

It should not automatically become canonical story storage.

Salai normalizes committed meaning into Narrative IR and may leave unresolved material unstructured. Do not require lossless bidirectional synchronization between scratch text and canonical state unless later evidence proves it necessary.

## Progressive creative validation

A production idea is rarely validated once.

```text
write / imagine
      ↓
structure / inspect
      ↓
shoot or generate
      ↓
watch material
      ↓
place in context
      ↓
edit until it feels right
```

Salai should preserve intent, identity, source evidence, and alternatives as work moves through these levels rather than treating an early script choice as permanently committed.

Low-friction previs remains interesting because it can move visual feedback earlier without pretending preview media is final.

See [`research-notes.md`](research-notes.md).

## Current validation implication

Spike 0A validated the current semantic model against representative fixtures. Spike 0B showed the same model can back several synchronized structured views. Spike 0C now tests whether agent-mediated input can reduce routine structural interaction while those views remain useful when deliberately chosen.

If messy 0C inputs expose a real semantic failure, update [`narrative-ir-spec.md`](narrative-ir-spec.md) and its tests rather than compensating with workflow-specific shadow state.

Interchange formats, rich-text frameworks, Resolve integration, real media analysis, and model-provider/runtime choices remain adapters around this semantic model rather than determinants of it.