# Salai Scripting Model

## Role of this document

This is the conceptual rationale for Salai's scripting model: why the model exists, what creative problems it is trying to solve, and what workflows pressure-test it.

Canonical terminology lives in [`glossary.md`](glossary.md). The authoritative Spike 0A implementation contract—types, invariants, operation vocabulary, fixtures, tests, and open questions—lives in [`narrative-ir-spec.md`](narrative-ir-spec.md).

This document should not maintain a parallel API or schema definition.

## Why a structured scripting model still matters

Resolve integration is important, but generic Resolve automation has a credible infrastructure path. The more product-specific question is what a "script" means across:

- short-form branded/product work;
- interviews/documentary;
- corporate video;
- YouTube/educational content;
- commercials;
- traditional scene-based work.

Salai should not assume every production starts from a screenplay or that a script is merely formatted text.

The working hypothesis is now:

> A Salai script is stable semantic production data that can be **normalized from messy authored intent or source material**, then inspected through several views and consumed by downstream production/editorial systems without losing identity.

```text
free-form idea / prose / conversation
                ↓
         agent normalization
                ↓
        semantic narrative
                ↓
            production

existing media / evidence
                ↓
         agent normalization
                ↓
        semantic narrative
                ↓
            production
```

The important change after Spike 0B is that the user should not have to manually construct every level of this structure for ordinary creative work.

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

The distinction remains:

- **Beat**: the narrative progression the audience should receive;
- **Cue**: an audiovisual moment used to express part of that Beat.

The terms themselves are defined in [`glossary.md`](glossary.md). Their precise implementation constraints are defined in [`narrative-ir-spec.md`](narrative-ir-spec.md).

No lower semantic layer is currently justified.

### User-facing implication

The distinction can remain important internally without requiring users to explicitly create every Cue.

For example:

```text
"Show three quick installation moments under the same line of VO"
```

may be normalized by the agent into one Beat with several Cues.

That is precisely why the structured model is useful: it can preserve semantic meaning and audiovisual timing without making the user perform the normalization manually.

## Script-first and footage-first share one model

### Script-first

A creator may begin with rough prose such as:

```text
Open with the frustration of the old process.
Then show installation in three fast moments.
End on the time saved.
```

Salai can normalize this into the same Beat/Cue structure previously authored manually through Outline/AV Script.

### Footage-first

An editor may begin with:

```text
interview excerpts
B-roll moments
screen recordings
archive material
```

plus a natural instruction such as:

```text
Build a short story around the old process, what changed, and the result.
```

The critical distinction remains between:

- **authored material**, whose words/content are intentionally editable; and
- **sourced material**, whose meaning/timing comes from real recorded media.

An agent must not turn a recorded interview excerpt into editable VO merely because it is easier to rewrite.

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
- generated previs
- generated final
- stock
- graphic/composite
- storyboard
```

This separation lets Salai answer questions such as:

- what coverage is missing?
- which footage supports this idea?
- which alternatives exist?
- could this missing moment be shot, found, generated, or represented as previs?

The agent-mediated authoring direction makes these questions accessible conversationally without changing the underlying semantics.

## Stable identity matters more than formatted text

Narrative objects may eventually be linked to source media, ShotIntents, annotations, generated alternatives, workspace cards, agent history, and Resolve objects.

Therefore:

- rewriting text should not recreate the narrative object unnecessarily;
- reordering should not sever relationships;
- split/merge/delete must report relationship consequences explicitly;
- source-backed content must keep source identity;
- rejected alternatives should remain recoverable rather than disappearing by default;
- agent normalization should preserve identity during restructuring whenever possible.

Exact behavior belongs to [`narrative-ir-spec.md`](narrative-ir-spec.md).

## Duration is part of authoring

Professional video work frequently has a target duration before a timeline exists.

The Narrative IR provides approximate structural timing from Cue-level information such as:

- authored speech estimate;
- actual source-excerpt duration;
- explicit duration;
- simple visual hold estimate.

This remains creative feedback, not frame-accurate editorial timing.

Agent-mediated authoring should make duration usable through natural requests:

```text
"Get this under 45 seconds without losing the result quote."
```

The agent can use the same canonical duration model while producing a grouped structural/copy revision.

## Structured views are projections/workspaces over the model

The same project supports surfaces such as:

- Outline;
- AV Script;
- Story Wall;
- Paper / Radio Edit;
- Coverage;
- later Frame Wall / Selects / previs-oriented views.

Spike 0B proved these views can share one model but found that direct manipulation is too interaction-heavy to be the primary creative workflow.

Their new role is:

- inspect canonical state;
- resolve precision/ambiguity;
- support spatial or audiovisual thinking;
- verify agent normalization;
- provide expert controls when explicit structure is genuinely useful.

See [`workflows.md`](workflows.md).

## Free-form working text is not the Script

The new primary authoring direction includes a simple free-form working area, but this should not make an arbitrary text document canonical.

Working text may contain:

- prose;
- questions;
- production notes;
- alternatives;
- uncertainty;
- pasted source context.

The agent normalizes committed meaning into Narrative IR and may leave unresolved material unstructured.

This protects the system from replacing one synchronization problem with another.

## Progressive creative validation

A production idea is rarely validated once.

A common loop is:

```text
write / imagine
      ↓
normalize / inspect
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

Low-friction previs remains interesting because it can move visual feedback earlier without pretending the preview is the final media.

See [`research-notes.md`](research-notes.md).

# Validation sequence

## Spike 0A — Narrative IR

**Complete / pass.**

Question:

> Can one stable semantic model represent script-first product work, sourced interview work, and footage-first documentary construction without workflow-specific schemas?

Result: yes for the implemented fixtures/operations.

## Spike 0B — Structured authoring UX

**Closed / mixed result.**

Question:

> Can humans manipulate the validated model naturally through familiar structured workflows?

Result:

- one model can back all four views;
- direct manipulation requires too much interaction to be the primary creative workflow.

See [`spike-0b-assessment.md`](spike-0b-assessment.md).

## Spike 0C — Agent-Mediated Authoring

**Current.**

Question:

> Can free-form text, conversation, and media be normalized into valid, grouped, reversible Narrative IR changes with materially less user interaction?

The model/agent should use explicit typed operations internally while the user works at the level of creative intent.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md).

# Interchange and editor technology come later

Fountain/FDX, rich-text frameworks, Resolve integration, real media analysis, and model-provider/runtime choices do not determine the canonical Narrative IR.

They are adapters/interfaces evaluated after the semantic model and primary interaction have survived the required validation scenarios.
