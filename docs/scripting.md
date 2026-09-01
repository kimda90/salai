# Salai Scripting Model

## Role of this document

This document explains **why** Salai needs a structured scripting/narrative model and which creative problems pressure-test it.

Canonical terminology lives in [`glossary.md`](glossary.md). Exact types, invariants, operation vocabulary, fixtures, and tests live in [`narrative-ir-spec.md`](narrative-ir-spec.md).

This document does not maintain a parallel schema/API, Narrative Lens taxonomy, structural-editorial implementation contract, or iteration tracker.

## Why structured narrative data still matters

A Salai “script” is not only formatted prose. It must work across:

- short-form branded/product work;
- interviews/documentary;
- corporate video;
- YouTube/educational content;
- commercials;
- traditional scene-based work.

Projects may begin from a blank idea or from existing footage/source evidence.

Current thesis:

> A Salai script is stable semantic production data that can be normalized from messy authored intent or source material, inspected through several representations, projected into structural editorial time, and consumed by later production/interchange systems without losing identity.

The user should not have to manually construct every level of that structure for ordinary creative work. Spike 0C human validation using Codex confirmed that external-agent mediation can handle much of that routine bookkeeping while Salai remains canonical.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md), [`spike-0c-assessment.md`](spike-0c-assessment.md), and [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).

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

may normalize to one Beat with several Cues. A temporal/AV representation can expose them later when audiovisual realization is the actual creative question.

No lower semantic narrative layer is currently justified.

## Script-first and footage-first share one model

### Script-first

A creator may begin with rough prose:

```text
Open with the frustration of the old process.
Then show installation in three fast moments.
End on the time saved.
```

That intent can normalize into the same canonical model used by human semantic surfaces, structural editorial, and later production planning.

### Footage-first

An editor may begin with interview excerpts, B-roll, screen recordings, or archive material plus an instruction such as:

```text
Build a short story around the old process, what changed, and the result.
```

The critical semantic distinction is between:

- **authored material**, whose words/content are intentionally editable; and
- **sourced material**, whose wording/timing comes from recorded evidence.

An agent or temporal editor must not turn a recorded interview excerpt into editable authored copy merely because rewriting would be easier.

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

The full production graph remains later than Spike 0D. The current timeline spike must not invent a production ontology merely to satisfy a third-party editor model.

## Stable identity matters more than formatted text or clip placement

Narrative objects may eventually link to source media, ShotIntents, annotations, generated alternatives, Workspace cards, action history, semantic timeline projections, and optional downstream NLE bindings.

Therefore:

- rewriting text should not recreate identity unnecessarily;
- reordering should not sever relationships;
- split/merge/delete must report relationship consequences explicitly;
- source-backed content must keep source identity;
- agent normalization should preserve identity during restructuring where possible;
- timeline projection must reference canonical IDs rather than create a second story model;
- switching representations must not create another copy of the story.

Exact behavior belongs to [`narrative-ir-spec.md`](narrative-ir-spec.md).

## Duration has two levels

Before media exists, Narrative IR provides approximate structural timing from Cue-level inputs such as:

- authored speech estimate;
- actual source-excerpt duration;
- explicit duration;
- simple visual hold estimate.

That remains useful for requests such as:

```text
Get this under 45 seconds without losing the result quote.
```

After ADR 0009, Salai also owns enough structural editorial to represent/play the current story in actual time. Spike 0D tests the relationship between these levels rather than replacing semantic duration with a renderer-owned clip timeline.

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
shoot, find, or generate
      ↓
watch material
      ↓
place in context
      ↓
edit until it feels right
```

ADR 0009 makes the **watch / place in context / structural edit** part of Salai's own product loop instead of requiring Resolve for every iteration.

Salai should preserve intent, identity, source evidence, and alternatives as work moves through these levels rather than treating an early script choice as permanently committed.

Low-friction previs remains interesting because it can move visual feedback earlier without pretending preview media is final.

See [`research-notes.md`](research-notes.md).

## Current validation implication

Spike 0A validated the current semantic model against representative fixtures. Spike 0B showed the same model can back several synchronized structured views. Spike 0C validated external-agent mediation in a human run using Codex.

Spike 0D now tests whether the same semantic model remains useful when projected into a **playable structural timeline** and edited directly in time.

If 0D exposes a real semantic failure, update [`narrative-ir-spec.md`](narrative-ir-spec.md) and its tests based on that evidence rather than compensating with timeline-engine-specific shadow state.

Interchange formats, rich-text frameworks, media engines, specialist NLE integrations, real media analysis, and model-provider/runtime choices remain adapters around the semantic model rather than determinants of it.
