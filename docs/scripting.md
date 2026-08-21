# Salai Scripting Model

## Why scripting is the current product-risk focus

Resolve integration remains important, but broad Resolve automation has a credible open-source path through CutMaster. The less understood part of Salai is the authoring model itself: what a "script" means across short-form branded work, interviews/documentary, corporate video, YouTube, commercials, and more traditional scene-based work.

Salai should not assume that every production starts from a screenplay, nor that a script is only formatted text.

The current hypothesis is:

> A Salai script is stable semantic production data. Outline, AV script, teleprompter, coverage, and later screenplay-like presentations are projections of that data rather than separate documents.

The model must work in both directions:

```text
blank page → narrative → production

existing media → evidence/moments → narrative → production
```

The immediate spike should validate this semantic intermediate representation before choosing an editor framework or adding downstream infrastructure.

## The key distinction: Beat vs Cue

The previous model treated `Beat` as both the semantic narrative unit and the AV-script row. That is likely too rigid.

Example:

```text
Beat
"Installing the device is easy"

AV moments
1. wide installation       VO starts
2. insert connector        VO continues
3. UI turns green          SFX + end of VO
4. user reaction           music rises
```

Narratively this is one Beat, but production-wise it contains several temporal audiovisual moments.

The current model to test is therefore:

```text
Script
└── Section
    └── Beat                 semantic meaning
        ├── Cue              audiovisual/temporal moment
        │   ├── visual[]
        │   └── audio[]
        └── Cue
            ├── visual[]
            └── audio[]
```

`Cue` is a working name. The spike should validate whether this level is genuinely useful before treating the term as permanent product language.

### Beat

A Beat represents a meaningful narrative idea or change.

Examples:

```text
HOOK
  Beat: surprising claim

PROBLEM
  Beat: old process is slow
  Beat: user frustration

DEMO
  Beat: installation is simple

CTA
  Beat: final promise
```

A traditional scene-based project may still use:

```text
ACT 1
  Scene
    Beat
    Beat
```

`Scene` is optional rather than universal.

### Cue

A Cue represents a moment in which visual and audio content are intended to happen together or overlap approximately.

A Beat may contain one Cue or several Cues.

This gives different views natural levels of granularity:

```text
Outline
Section → Beat

AV Script
Beat → Cue → Visual | Audio

Teleprompter
spoken AudioBlocks across Cues

Coverage
Beat/Cue → ShotIntent
```

The spike should determine whether ShotIntent relationships normally belong at Beat level, Cue level, or both.

## Explicit domain types, not a generic NarrativeNode tree

`NarrativeNode` remains useful architectural shorthand, but the implementation should prefer explicit discriminated domain types rather than an unrestricted recursive tree.

Initial domain concepts:

```text
Script
Section
Scene (optional)
Beat
Cue
ContentBlock
```

Allowed parent/child relationships should be explicit. This avoids invalid structures such as a Section nested under a Beat purely because every object is a generic node.

## Content blocks

A Cue carries typed visual and audio content blocks.

The first spike should implement only the smallest useful set.

### Visual

```text
VisualDescription
OnScreenText
Graphic
```

### Audio

```text
AuthoredSpeech
SourceExcerpt
Music
SFX
```

Additional types such as ambience, notes, references, dialogue character metadata, or screenplay-specific constructs can be added after the model proves itself.

## Authored content vs sourced content

This distinction is fundamental for footage-first/reverse scripting.

### AuthoredSpeech

Editable production copy such as voiceover, presenter copy, or scripted dialogue.

```text
AuthoredSpeech
- id
- text
- role/type
```

Changing the text changes the authored content.

### SourceExcerpt

A reference to words that already exist in recorded media.

```text
SourceExcerpt
- id
- mediaSegmentId
- transcript snapshot/display text
- source in/out
```

Example:

```text
Interview 03:41–03:47
"We were spending almost two days doing this manually."
```

This is evidence tied to media. Editing its displayed transcript must not pretend the underlying interview changed.

A user may trim, replace, or unlink a SourceExcerpt, or create new AuthoredSpeech paraphrasing it, but those operations have different semantics.

This authored-vs-sourced distinction is one of the primary things Spike 0A must validate.

## ShotIntent remains separate from narrative content

`ShotIntent` represents a production need, not a line of script or an AV row.

```text
Beat
"Installation takes less than a minute"

Cues
1. begin installation
2. connect device
3. confirm UI state

Possible ShotIntents
- wide installation
- connector insert
- UI confirmation
- reaction
```

Relationships are many-to-many and may attach at Beat or Cue level:

```text
Beat ↔ ShotIntent
Cue  ↔ ShotIntent
```

A ShotIntent is later realized by assets/segments:

```text
ShotIntent 18B
├── storyboard
├── camera take A
├── camera take B
├── generated take A
├── stock clip
└── graphic/composite
```

Narrative intent remains independent from realization.

## Stable identity is a core requirement

Script objects participate in the production graph and therefore require durable IDs.

For example:

```text
Beat B17
"Manual invoices waste time"
```

may eventually be related to:

```text
Cue C31
ShotIntent S32
MediaSegment M43
Annotation A12
ResolveBinding R91
```

Ordinary text editing must not implicitly destroy those relationships.

### Identity rules to validate

Initial hypotheses:

- editing fields preserves object identity;
- moving/reordering objects preserves identity;
- inserting creates new identity;
- splitting retains one original identity and creates another, with an explicit relationship policy;
- merging retains one canonical identity and records provenance from removed objects;
- deleting narrative objects never silently deletes linked external production objects;
- structural operations are transactional and invertible/undoable.

The exact split/merge rules are not yet product decisions. They are part of the experiment.

## Duration model

The Beat/Cue distinction gives runtime estimation a cleaner structure.

A Cue is approximately a concurrent audiovisual moment.

Possible estimate:

```text
Cue duration =
  explicit duration
  OR max(
    authored speech estimate,
    source excerpt duration,
    visual hold estimate
  )

Beat duration    = sum(Cue durations)
Section duration = sum(Beat durations)
Script duration  = sum(Section durations)
```

For authored speech, estimate from words per minute.

For a SourceExcerpt, use actual source in/out duration.

The goal is useful authoring feedback, not frame-accurate timing.

Target durations such as 15, 30, 60, or 90 seconds remain first-class constraints.

## Reverse scripting: media becomes evidence

Reverse scripting is not a separate script system.

Starting state:

```text
MediaSegments
├── interview excerpts
├── B-roll moments
├── screen recordings
└── other selected material
```

A user or later AI process can create narrative structure from those sources:

```text
Section: Problem

Beat: Manual work consumed too much time

Cue 1
Visual: office B-roll
Audio: SourceExcerpt interview_04 03:41–03:47

Cue 2
Visual: spreadsheet screen recording
Audio: AuthoredSpeech bridge VO
```

The same Beat/Cue model therefore supports blank-page scripting and footage-derived scripting.

This is a core validation criterion for the narrative IR.

## Views are projections, not canonical documents

If the domain model succeeds, it should support multiple presentations.

### Outline

Shows primarily:

```text
Section
  Beat
  Beat
```

Optimized for structural reasoning and reordering.

### AV Script

Shows Cues as audiovisual moments:

| Visual | Audio |
| --- | --- |
| Wide installation | VO begins |
| Connector insert | VO continues |
| UI green | SFX |

### Teleprompter

Derived from `AuthoredSpeech` blocks marked as spoken/presenter/VO content.

`SourceExcerpt` may optionally appear in transcript/reference modes, but it is not editable teleprompter copy by default.

### Coverage

Projects Beat/Cue relationships to ShotIntents and later realizations.

### Screenplay-like presentation

Potential later projection for scene headings, action, characters, and dialogue. It should not determine the first domain model.

## Structural operations are a first-class API

The domain should expose explicit operations rather than arbitrary mutation.

Candidate operation vocabulary:

```text
createSection
createBeat
createCue
updateBlock
moveBeat
moveCue
splitBeat
mergeBeats
deleteBeat
linkShotIntent
unlinkShotIntent
linkSourceExcerpt
```

The operation layer provides:

- identity preservation;
- relationship policy enforcement;
- validation;
- transaction boundaries;
- undo/inversion;
- a future interface for AI-assisted edits.

## AI should be tested after the operation vocabulary

Spike 0A should not call a real LLM.

First prove that meaningful editorial changes can be represented manually as domain operations.

Example patch:

```json
[
  {
    "op": "updateBlock",
    "blockId": "vo_12",
    "text": "Installation takes seconds."
  },
  {
    "op": "moveBeat",
    "beatId": "beat_4",
    "after": "beat_1"
  },
  {
    "op": "deleteBeat",
    "beatId": "beat_2"
  }
]
```

The important first test is:

```text
before runtime 00:41
        ↓
operations
        ↓
after runtime 00:29

stable IDs retained where appropriate
relationships preserved according to policy
patch invertible
```

Only after this operation model is stable should an LLM generate proposed patches.

## Editor framework should follow the domain model

Do not make ProseMirror/Tiptap, Lexical, HTML, or another editor representation the canonical script model in Spike 0A.

Two architectures remain possible:

```text
A. editor document = canonical domain

B. Salai domain model = canonical
   React authoring UI projects the model
   rich-text editor used only where useful
```

The current preference is to validate **B** first.

An AV script is primarily structured production data with editable text fields, not necessarily one rich-text document.

Tiptap/ProseMirror and Lexical remain candidates for Spike 0B if richer text editing requires them.

## Interchange comes later

Fountain and FDX are useful interoperability targets but do not test whether Salai's semantic authoring model is correct.

They are therefore excluded from Spike 0A.

Once the model stabilizes:

```text
Fountain / FDX
      ↕ adapters
Salai narrative IR
```

Interchange formats must never become canonical storage for Salai-specific relationships.

# Scripting validation plan

The previous single scripting spike is split into three experiments.

## Spike 0A — Narrative IR

### Question

Can one stable semantic model represent blank-page AV scripting, audio-driven interview work, and footage-first narrative construction without special-case data models?

### Implementation boundary

Pure TypeScript package:

```text
packages/script-model/
```

No Electron, React, Tiptap, Python, SQLite, Resolve, real LLM, or Fountain required.

### Required domain capabilities

- Script / Section / optional Scene / Beat / Cue types;
- typed visual/audio ContentBlocks;
- AuthoredSpeech vs SourceExcerpt;
- stable IDs;
- Beat/Cue ↔ ShotIntent references;
- SourceExcerpt ↔ MediaSegment references;
- move/edit/split/merge/delete semantics;
- serialization/deserialization round-trip;
- duration estimation;
- explicit structural operation format;
- validation and relationship invariants;
- operation inversion/undo where practical for the spike.

### Three required fixtures

#### Fixture A — 30-second product video

Script-first structure:

```text
Hook
Problem
Demo
Benefit
CTA
```

Must exercise:

- authored VO;
- visuals/graphics;
- several Cues within a Beat;
- several ShotIntents for one Beat;
- target runtime.

#### Fixture B — 2-minute interview/corporate piece

Audio-driven structure combining:

- SourceExcerpts;
- authored VO bridges;
- B-roll while interview audio continues;
- several audiovisual Cues per Beat.

Must validate authored-vs-sourced semantics.

#### Fixture C — footage-first mini documentary

Start from mocked `MediaSegment[]` and construct the narrative using SourceExcerpts and visual source references.

Must prove the same domain model works without a blank-page script origin.

A traditional screenplay/dialogue scene may be added later as a stress fixture, but should not shape the initial model.

### Identity/invariant tests

At minimum:

```text
edit Beat/Cue content
→ identity unchanged

move Beat/Cue
→ identity unchanged
→ relationships unchanged

split Beat
→ one original ID retained
→ one new ID created
→ relationship outcome explicit/tested

merge Beats
→ one canonical ID retained
→ provenance recorded

remove narrative object with external links
→ external object not silently deleted
→ orphan/reassignment state explicit

serialize → deserialize
→ IDs/order/content/relationships/runtime semantics preserved
```

### Success criteria

Spike 0A succeeds if:

- all three fixtures fit the same core types without special-case schemas;
- Beat and Cue remain meaningfully different concepts;
- authored speech and sourced excerpts coexist naturally;
- stable identity survives common structural changes;
- relationship behavior is explicit rather than accidental;
- runtime estimates are structurally useful;
- useful script revisions can be represented through the operation vocabulary.

If the fixtures require fundamentally different data models, the hypothesis fails and should be revised before UI work.

## Spike 0B — Authoring UX

### Question

Can humans comfortably author and restructure the validated Narrative IR?

Only after 0A succeeds, build a small React prototype exposing:

- Outline view;
- AV Script view;
- derived Teleprompter view;
- reordering;
- Cue creation/removal;
- editing authored blocks;
- viewing SourceExcerpts as media-backed evidence;
- target/estimated runtime.

Evaluate whether plain React editable controls are sufficient or whether Tiptap/ProseMirror/Lexical materially improve the experience.

Electron is optional for this UX spike; it should not be required to answer the authoring question.

## Spike 0C — Assisted authoring

### Question

Can an LLM safely propose useful narrative restructuring through the validated operation API?

Add:

- structured LLM input derived from the Narrative IR;
- operation-schema output;
- validation;
- reviewable diff/patch UI;
- apply/reject;
- runtime before/after;
- relationship impact summary.

The LLM must not bypass the domain operation layer.

## Explicit non-goals for Spike 0A

Do not build:

- Electron application shell;
- Python/FastAPI service;
- SQLite persistence;
- Tiptap/ProseMirror integration;
- real LLM calls;
- Fountain/FDX interchange;
- Resolve integration;
- real transcription/computer vision;
- polished UI;
- collaboration/CRDT;
- full screenplay formatting.

The purpose of 0A is to make changing the model cheap while testing the highest-risk assumptions.