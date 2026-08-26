# Salai Scripting Model

## Role of this document

This is the conceptual rationale for Salai's scripting model: why the model exists, what creative problems it is trying to solve, and what workflows pressure-test it.

Canonical terminology lives in [`glossary.md`](glossary.md). The authoritative Spike 0A implementation contract—types, invariants, operation vocabulary, fixtures, tests, and open questions—lives in [`narrative-ir-spec.md`](narrative-ir-spec.md).

This document should not maintain a parallel API or schema definition.

## Why scripting is the current product-risk focus

Resolve integration is important, but generic Resolve automation has a credible infrastructure path. The less understood question is what a "script" means across:

- short-form branded/product work;
- interviews/documentary;
- corporate video;
- YouTube/educational content;
- commercials;
- traditional scene-based work.

Salai should not assume every production starts from a screenplay or that a script is merely formatted text.

The working hypothesis is:

> A Salai script is stable semantic production data that can be authored from a blank page or constructed from source material, then exposed through familiar creative workflows without losing identity.

```text
blank page → narrative → production

existing media → evidence/moments → narrative → production
```

## Why Beat and Cue are separate

A creator may have one narrative idea that takes several audiovisual moments to communicate.

Example:

```text
Beat: installation is simple

Cue 1  wide installation      VO starts
Cue 2  connector insert       VO continues
Cue 3  UI confirmation        SFX
Cue 4  reaction               music rises
```

The distinction under test is therefore:

- **Beat**: the narrative progression the audience should receive;
- **Cue**: an audiovisual moment used to express part of that Beat.

The terms themselves are defined in [`glossary.md`](glossary.md). Their precise implementation constraints are defined in [`narrative-ir-spec.md`](narrative-ir-spec.md).

No lower semantic layer is currently justified. Spike 0A should only introduce one if a required fixture cannot be represented cleanly without it.

## Script-first and footage-first must share one model

### Script-first

A creator may begin with:

```text
Hook
Problem
Demo
Benefit
CTA
```

and gradually add audiovisual intent, ShotIntents, real/generated media, and eventually an edit.

### Footage-first

An editor may begin with:

```text
interview excerpts
B-roll moments
screen recordings
archive material
```

and construct narrative structure from that evidence.

The critical distinction is between:

- **authored material**, whose words/content are intentionally editable; and
- **sourced material**, whose meaning/timing comes from real recorded media.

A recorded interview excerpt cannot behave like editable VO copy without breaking source truth.

## Narrative intent is independent from realization

A narrative need should not become equivalent to whichever clip currently happens to fill it.

Conceptually:

```text
Beat / Cue
    ↓
ShotIntent
    ↓
possible realizations
- captured take
- generated previs
- generated final
- stock
- graphic/composite
- storyboard
```

This separation is what lets Salai ask useful production questions such as:

- what coverage is missing?
- which footage supports this idea?
- which alternatives exist?
- could this missing moment be shot, found, generated, or represented as previs?

## Stable identity matters more than formatted text

Narrative objects may eventually be linked to source media, ShotIntents, annotations, generated alternatives, workspace cards, and Resolve objects.

Therefore:

- rewriting text should not recreate the narrative object;
- reordering should not sever relationships;
- split/merge/delete must report relationship consequences explicitly;
- source-backed content must keep source identity;
- rejected alternatives should remain recoverable rather than disappearing by default.

Exact behavior belongs to [`narrative-ir-spec.md`](narrative-ir-spec.md).

## Duration is part of authoring

Professional video work frequently has a target duration before a timeline exists.

The Narrative IR should therefore provide approximate structural timing from Cue-level information such as:

- authored speech estimate;
- actual source-excerpt duration;
- explicit duration;
- simple visual hold estimate.

This is creative feedback, not frame-accurate editorial timing.

## Familiar workflows are projections/workspaces over the model

The user should not be forced into a Salai-specific scripting metaphor.

The same project should support familiar surfaces such as:

- Outline;
- AV Script;
- Story Wall / sticky-note cards;
- Beat Board;
- Paper Edit;
- Radio Edit;
- Coverage;
- later Frame Wall / Selects / previs-oriented views.

See [`workflows.md`](workflows.md) for the Projection-vs-Workspace distinction and UX semantics.

## Progressive creative validation

A production idea is rarely validated once.

A common loop is closer to:

```text
read / imagine
      ↓
shoot or generate
      ↓
watch material
      ↓
place in context
      ↓
edit until it feels right
```

Salai should preserve intent and alternatives as work moves through these levels rather than treating an early script decision as permanently committed.

Low-friction previs is therefore interesting because it can move visual feedback earlier without pretending the preview is the final media.

See [`research-notes.md`](research-notes.md) for the underlying observations.

# Validation sequence

## Spike 0A — Narrative IR

Question:

> Can one stable semantic model represent script-first product work, sourced interview work, and footage-first documentary construction without workflow-specific schemas?

Implementation is pure TypeScript in `packages/script-model/`.

The complete implementation contract is [`narrative-ir-spec.md`](narrative-ir-spec.md). Do not copy its operation vocabulary into this document.

## Spike 0B — Authoring UX

Question:

> Can humans manipulate the validated model naturally through familiar workflows?

Initial surfaces:

- Story Wall;
- Outline;
- AV Script;
- Paper/Radio Edit.

0B also defines the minimum in-memory Workspace/Board model required by those surfaces before durable persistence is added later.

## Spike 0C — Assisted authoring

Question:

> Can AI propose meaningful structural changes through the same validated operation semantics humans use?

AI should propose reviewable operations/diffs rather than replace the entire narrative document.

# Interchange and editor technology come later

Fountain/FDX, Tiptap/ProseMirror/Lexical, Resolve integration, and real LLM calls do not determine the canonical Narrative IR.

They are adapters/interfaces evaluated after the semantic model has survived the required fixtures.
