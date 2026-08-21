# Salai Scripting Model

## Why scripting is the current product-risk focus

Resolve integration is important, but broad Resolve automation already has a credible open-source path through CutMaster. The less understood part of Salai is the authoring model itself: what a "script" means across short-form branded work, interviews/documentary, corporate video, YouTube, commercials, and more traditional scene-based work.

Salai should not assume that every production starts from a screenplay, nor that a script is only formatted text.

The current hypothesis is:

> A Salai script is a structured narrative model with stable identity. Outline, AV script, screenplay-like formatting, teleprompter text, coverage, and paper edit are views or projections over that model rather than separate documents.

This model must also support the inverse workflow:

> Existing footage can become evidence for proposed narrative beats, which can then be edited into a script/story structure.

## Primary authoring model: AV-script-first, not screenplay-first

The initial target user often works on 15-second to several-minute pieces where visual and audio intent matter independently.

A useful default representation is therefore similar to an AV script:

| Visual | Audio |
| --- | --- |
| Close shot of product opening | VO: "Opening it takes one click." |
| UI screen recording | SFX + VO |
| Customer reaction | Music rises |

This is a useful **view**, but it should not be the storage schema.

A single narrative beat may require multiple visual realizations, and a single shot can support more than one beat. Treating one AV row as one shot would make the model too rigid.

## Semantic script model

A project contains structured narrative objects with stable IDs.

```text
Script
├── NarrativeNode: section
│   ├── NarrativeNode: beat
│   │   ├── visual content
│   │   ├── audio content
│   │   ├── duration intent
│   │   └── notes
│   └── NarrativeNode: beat
└── NarrativeNode: section
```

Possible narrative node types:

```text
section
scene
beat
script_block
```

`scene` is optional rather than universal. A feature-film-like project may use acts/sequences/scenes; a 45-second product video may use Hook / Problem / Demo / Benefit / CTA.

### Beat-first hierarchy

The smallest narrative unit that Salai should reason about is initially the `Beat`.

Examples:

```text
HOOK
  Beat: surprising claim

PROBLEM
  Beat: old process is slow
  Beat: user frustration

DEMO
  Beat: open product
  Beat: complete task

CTA
  Beat: final promise
```

For more traditional narrative work:

```text
ACT 1
  Scene 1
    Beat
    Beat
  Scene 2
    Beat
```

The model should allow both without forcing all projects into screenplay conventions.

## Content channels inside a beat

A beat can carry multiple typed content blocks.

### Visual

Possible visual block types:

```text
action
visual_description
onscreen_text
graphic
reference
note
```

### Audio

Possible audio block types:

```text
dialogue
voiceover
music
sfx
ambience
note
```

This is intentionally extensible. The first implementation should only add block types required by the prototype rather than trying to model every screenplay or broadcast convention.

## Script views

The same semantic model should support multiple presentations.

```text
                    SCRIPT MODEL
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
    Outline          AV Script        Teleprompter
       │                 │                 │
  sections/beats     visual | audio     dialogue/VO
       │
       ├──────────── screenplay-like view
       └──────────── coverage/shot-intent view
```

### Outline view

Optimized for structural authoring:

- sections/scenes;
- beats;
- approximate duration;
- drag/reorder;
- collapse/expand;
- structural alternatives.

### AV Script view

Optimized for production intent:

- visual and audio side by side;
- per-beat timing;
- on-screen text/graphics;
- references;
- linked ShotIntents.

### Teleprompter view

A derived view containing only material intended to be spoken/read, such as:

- dialogue;
- presenter copy;
- voiceover.

It should not be stored as a second independent script.

### Screenplay-like view

Potential later projection for projects that benefit from scene headings, action, character and dialogue formatting. This should not dictate the base model for the first version.

## ShotIntent remains separate from narrative content

`ShotIntent` represents a production need, not a line of script.

```text
Beat
"Installation takes less than a minute."

Visual intent
"Show installation process"

ShotIntents
├── wide installation
├── close-up connector
├── insert screws
├── UI indicator
└── reaction
```

A Beat can link to zero, one, or many ShotIntents.

A ShotIntent can also support multiple Beats.

```text
Beat ↔ ShotIntent
```

is therefore many-to-many.

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

This keeps narrative intent independent from execution.

## Stable identity is a core requirement

Salai's scripting model differs from a normal text editor because script objects participate in the production graph.

For example:

```text
Beat B17
"Manual invoices take hours."
```

may be linked to:

```text
ShotIntent S32
MediaSegment M43
ResolveBinding R91
Annotation A12
```

Changing the wording must not implicitly destroy those relationships.

### Simple text edit

```text
B17 before:
"Manual invoices take hours."

B17 after:
"Teams waste hours entering invoices manually."
```

This remains the same object and retains the same ID.

### Structural edit

Splitting, merging, deleting, or moving beats is more difficult:

```text
B17
"Teams waste hours entering invoices manually."

becomes

B17
"Teams waste hours entering invoices."

B18
"The process is entirely manual."
```

The system must define how relationships are preserved or redistributed.

Initial principle:

- editing text preserves object identity;
- moving an object preserves identity;
- splitting creates a new object and requires an explicit relationship policy;
- merging retains one canonical ID and records provenance from the merged object;
- deleting an object does not silently delete linked production data;
- structural operations should be transactional and undoable.

Exact split/merge policies are a prototype question and should be tested with real workflows.

## AI must edit structure, not replace opaque text

The LLM should not normally receive a blob of script text and return another blob that replaces the document.

Bad abstraction:

```text
script text
   ↓
LLM
   ↓
new script text
```

Preferred abstraction:

```text
structured script
      ↓
LLM proposes operations
      ↓
reviewable patch
      ↓
transaction
```

Example user request:

> Make the opening shorter and get this under 30 seconds.

Possible proposal:

```json
[
  {
    "op": "update",
    "id": "beat_17",
    "field": "audio.voiceover",
    "value": "..."
  },
  {
    "op": "remove",
    "id": "beat_16"
  },
  {
    "op": "move",
    "id": "beat_18",
    "before": "beat_17"
  }
]
```

The UI can present:

```text
AI PROPOSAL

- Beat 16 removed
~ Beat 17 shortened
↕ Beat 18 moved earlier

Estimated runtime
00:47 → 00:29

[Review] [Accept all]
```

This preserves IDs where possible, makes structural edits auditable, and keeps the production graph coherent.

## Runtime is first-class narrative data

For the initial target market, target duration is often a hard creative constraint:

```text
15 sec
30 sec
60 sec
90 sec
3 min
```

Salai should track both target and estimated duration.

Possible sources of estimated duration:

- spoken-word reading rate;
- explicit beat duration;
- linked media-segment duration;
- visual-hold estimates;
- overlaps between audio and visual content.

Example:

```text
TARGET        00:30

Voiceover     00:21
Visual holds  00:12
Overlap       -00:05
───────────────────
Estimated     00:28
```

The estimate does not need to be frame-accurate. Its purpose is to support authoring and structural alternatives before editorial materialization.

## Reverse scripting: footage → narrative

Reverse scripting is a first-class workflow, not a secondary import feature.

Starting state:

```text
existing/random footage
        ↓
transcripts + descriptions + metadata
        ↓
meaningful MediaSegments
        ↓
possible topics / evidence / moments
        ↓
proposed narrative structure
```

Example:

```text
Available material

Interview
- hiring problem
- old process
- implementation
- result

Visual material
- office
- application UI
- customer
- exterior
```

Salai may propose:

```text
01 Hook
   "Hiring used to take weeks."

02 Problem
   Existing process

03 Change
   New application

04 Result
   Faster hiring
```

Crucially, proposed Beats can already carry evidence/source relationships:

```text
Beat 03
Sources
├── interview_04 03:41–04:12
├── screen_08
└── broll_31
```

The user can then write/rewrite the narrative while retaining those source relationships.

This is one of the strongest ways Salai differs from conventional screenplay software.

## Editor implementation direction

The editor should be schema-aware rather than a generic textarea/contenteditable document.

### Preferred prototype: Tiptap / ProseMirror

Current preference:

- Tiptap for React/TypeScript editor integration;
- ProseMirror's schema and transaction model underneath;
- stable IDs stored on semantic nodes;
- custom node types for Salai narrative content.

Candidate nodes for the spike:

```text
salaiDocument
section
beat
visualBlock
voiceoverBlock
dialogueBlock
onscreenTextBlock
noteBlock
```

The exact node set should remain small until validated.

### Alternative: Lexical

Lexical is a credible alternative, especially if the React integration proves simpler for the required structured operations. The spike should not deeply couple domain persistence to an editor framework; editor state should map cleanly into Salai domain objects.

## Interchange

### Fountain

Fountain is useful as a screenplay-oriented import/export format and should be treated as interoperability rather than canonical storage.

```text
Fountain
   ↕ importer/exporter
Salai semantic model
```

A Fountain export will necessarily lose some Salai-specific information such as:

- ShotIntent links;
- asset relationships;
- Resolve bindings;
- generation provenance;
- review relationships.

Those remain in the Salai project.

### FDX and other formats

FDX may be supported later through permissively licensed parsers/libraries if demand justifies it. The scripting spike should not become an interchange project.

## Persistence

The canonical production graph remains SQLite/domain data.

The first spike should determine whether editor documents are best persisted as:

1. normalized narrative/domain tables plus editor projection state;
2. a structured JSON document with indexed domain objects;
3. a hybrid approach.

Regardless of storage shape, stable object IDs and relationships are requirements.

Do not make rendered HTML or Fountain text the canonical source of truth.

## Scripting spike

The next product-risk spike should work without Resolve.

### Prototype UI

One intentionally simple Electron screen:

```text
┌───────────────────────────────────────────┐
│ STORY                                     │
│                                           │
│ Target: 00:30            Estimate: 00:34  │
│                                           │
│ HOOK                                      │
│ ┌────────────────┬──────────────────────┐ │
│ │ VISUAL         │ AUDIO                │ │
│ │ Product close  │ "This used to take  │ │
│ │                │ twenty minutes."     │ │
│ └────────────────┴──────────────────────┘ │
│                                           │
│ PROBLEM                                   │
│ ┌────────────────┬──────────────────────┐ │
│ │ ...            │ ...                  │ │
│ └────────────────┴──────────────────────┘ │
│                                           │
│ + Beat                                    │
└───────────────────────────────────────────┘
```

### Required experiments

1. Create sections and Beats.
2. Write/edit visual and audio content.
3. Move/reorder Beats without changing identity.
4. Split and merge Beats and inspect relationship behavior.
5. Toggle between Outline and AV Script views.
6. Derive a Teleprompter view from the same model.
7. Link dummy ShotIntents to Beats.
8. Persist/reopen the document with IDs and relationships intact.
9. Set a target duration and continuously estimate runtime.
10. Have an LLM propose a structural rewrite as explicit operations.
11. Review/apply/reject the AI structural patch.
12. Import/export a small Fountain sample.
13. Create a small reverse-script structure from mocked footage-derived MediaSegments.

### Success criteria

The spike succeeds if:

- the user can author naturally without feeling like they are editing database rows;
- structural objects retain reliable identity through normal editing;
- one semantic model can power Outline, AV Script, and Teleprompter views;
- ShotIntent relationships remain understandable after common edits;
- AI can propose meaningful structural changes without replacing the entire document;
- runtime constraints are useful during authoring;
- footage-first narrative construction fits the same model without a second scripting system.

## Explicit non-goals for this spike

Do not build:

- a complete Final Draft replacement;
- page-perfect screenplay formatting;
- locked pages/revision colors;
- production scheduling;
- full collaboration/CRDT infrastructure;
- real Resolve integration;
- real computer-vision footage analysis;
- every screenplay interchange format;
- a polished visual design system;
- autonomous script writing that bypasses review.

The purpose of the spike is to validate the semantic authoring model before broader application implementation.
