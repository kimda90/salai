# Salai Creative Workflows and Working Surfaces

## UX principle

Salai should adapt its production graph to familiar creative workflows rather than require editors, writers, or videographers to think in database concepts.

Users should work with concepts they already recognize:

```text
cards
scenes
beats
quotes
frames
scripts
selects
paper edits
```

Internal concepts such as `Beat`, `Cue`, `MediaSegment`, `ShotIntent`, `Relationship`, or `EntityReference` remain implementation/domain vocabulary where appropriate, but the primary UX should map that model onto established editorial working methods.

The central hypothesis is:

> One Narrative IR can support several familiar ways of constructing a story. Salai should preserve the user's preferred working method while keeping all of those methods connected to the same underlying production data.

## Projection vs Workspace

Not every way of looking at a project is the same kind of UI.

Salai should distinguish between **projections** and **workspaces**.

### Projection

A projection is deterministically derived from the Narrative IR.

Examples:

- Outline;
- AV Script;
- Teleprompter;
- Coverage table;
- later screenplay-like formatting.

A projection does not own independent narrative state. Editing a projection changes the underlying Narrative IR.

```text
Narrative IR
   │
   ├── Outline
   ├── AV Script
   ├── Teleprompter
   └── Coverage
```

### Workspace

A workspace preserves human spatial/organizational decisions that are not inherent to the narrative object itself.

Examples:

- Story Wall;
- Beat Board / scratch board;
- Paper Edit;
- Radio Edit;
- Frame Wall;
- Selects board.

A workspace can reference the same underlying objects while storing its own layout and annotations.

```text
Narrative IR / Production Graph
             │
      ┌──────┴──────┐
      │             │
 Projection      Workspace
 derived state    persistent human organization
```

This distinction prevents presentation metadata such as board position or card color from polluting the semantic story model.

## Workspace model

The first working hypothesis is a lightweight persistent workspace/board layer.

```text
Workspace
- id
- name
- kind
- settings
- board/items

BoardItem
- id
- reference?          -> Section / Scene / Beat / Cue / MediaSegment / ShotIntent
- freeformCard?       -> uncommitted idea/note
- x / y
- width / height
- color?
- rotation?
- label?
- note?
- lane/group?
```

A `BoardItem` may reference an existing production object or exist initially as a freeform idea card.

This is important because brainstorming should not require every sticky note to immediately become canonical production data.

Possible conversions:

```text
IdeaCard
   ↓
Convert to Beat
Convert to Scene
Attach to Beat
Attach to MediaSegment
Discard
```

### Workspace metadata is contextual

Color, position, size, and orientation belong to the workspace item, not to the referenced Beat/Scene itself.

For example:

```text
Scene 14
"Daniel enters the archive"

Story Wall
- large blue card
- rotated
- position near the midpoint

Character Arc board
- small neutral card
- positioned in Daniel lane
```

The same narrative object can therefore appear in several workspaces with different visual meaning.

## Familiar workflow 1 — Story Wall

Inspired by physical index-card/sticky-note story construction used by film editors and writers, including Walter Murch-style scene walls.

Primary objects:

- Scene;
- Beat;
- optionally Section/sequence markers.

Typical operations:

- lay out scenes/beats spatially;
- reorder narrative structure by moving cards;
- group by act/section/character/theme;
- use card color for user-defined meaning;
- vary size for weight/duration/importance;
- optionally rotate or flag turning points;
- move removed ideas to a visible parking-lot area instead of deleting them.

Example:

```text
ACT I

[ Arrival ]   [ Meet family ]

        [ DISCOVERY ]

ACT II

[ Research ]  [ Confront ]  [ Failure ]

PARKING LOT

[ Old intro ]
```

### Semantics

When a Story Wall card references an existing Beat/Scene, moving it in a **structural lane/order mode** may produce Narrative IR move operations.

Free spatial movement should not automatically imply narrative order unless the workspace explicitly uses ordering semantics.

This distinction must be clear in the UX.

## Familiar workflow 2 — Beat Board / Scratch Board

A looser ideation surface similar to traditional index-card or beat-board workflows.

Cards may represent:

- an idea;
- a story point;
- a question;
- a quote;
- a possible scene;
- a visual motif;
- a sequence;
- an act marker;
- a production note.

Unlike a Story Wall, many cards may initially be uncommitted.

Example:

```text
"Reveal father earlier"

"Need stronger reason to leave"

"Interview quote about first failure"

"Could open on archival image"
```

The user can progressively promote these cards into Narrative IR objects or attach them to existing objects.

This gives blank-page ideation a familiar entry point without forcing premature structure.

## Familiar workflow 3 — Outline

Projection over the Narrative IR.

Primary hierarchy:

```text
Section
  Scene? / Beat
    Beat
```

Optimized for:

- compact structural overview;
- hierarchical navigation;
- drag/reorder;
- sectioning;
- runtime summaries;
- quick text editing.

Outline is useful for writers who prefer a conventional hierarchical structure rather than a spatial wall.

## Familiar workflow 4 — AV Script

Projection over Beat/Cue structure.

Primary unit:

```text
Beat
  Cue
    Visual | Audio
```

Example:

| Visual | Audio |
| --- | --- |
| Wide installation | VO begins |
| Connector insert | VO continues |
| UI green | SFX |
| User reaction | Music rises |

Optimized for:

- scripted short-form work;
- branded/corporate video;
- commercials;
- YouTube/educational pieces;
- planning visual and audio intent independently;
- linking Cues to ShotIntents.

The AV Script is not a separate document. It is a production-oriented projection of the same Narrative IR used by the Story Wall and Outline.

## Familiar workflow 5 — Paper Edit

A documentary/interview-oriented workspace centered on source evidence and narrative placement.

Primary objects:

- `SourceExcerpt`;
- `MediaSegment`;
- Beat;
- Cue;
- authored bridge copy.

Example:

```text
SOURCE                      STORY

Maria 03:14–03:27           PROBLEM
"We thought it would
only take a week..."

B-roll 034                  PROBLEM
Factory opening

Juan 12:04–12:17            TURN
"Then something changed."

B-roll 112                  SOLUTION
New machinery
```

The important behavior is that sourced material remains linked to actual media while being arranged into narrative structure.

A paper edit can create or attach Beats/Cues without flattening recorded evidence into editable prose.

## Familiar workflow 6 — Radio Edit

An audio-first editorial surface for interview-heavy work.

Example:

```text
Maria 03:14–03:27
"We had no idea what was happening."

Juan 12:04–12:17
"Then suddenly things started improving."

VO
"But the change did not happen overnight."

Maria 05:41–05:52
"It took almost six months."
```

Primary focus:

- SourceExcerpts;
- authored VO/dialogue bridges;
- spoken duration;
- sequence and pacing;
- transcript-level restructuring.

A Radio Edit should be able to transition naturally into an AV Script by exposing/adding the visual side of the same Cues.

```text
Transcript / Sources
        ↓
Radio Edit
        ↓
AV Script
        ↓
Coverage / ShotIntents
        ↓
Resolve
```

This is a particularly important workflow for documentary, corporate interview, and factual content.

## Familiar workflow 7 — Frame Wall

Later production/editorial workspace inspired by physical frame walls/contact-sheet methods used to understand a scene or body of footage spatially rather than only sequentially.

Primary objects:

- MediaSegment;
- representative frame;
- selected take/moment;
- Scene/Beat association.

Example:

```text
SCENE 12 — FRAME WALL

[ CU ] [ WIDE ] [ HANDS ] [ REACTION ]

[ DOOR ] [ SMILE ] [ INSERT ]
```

Potential purposes:

- compare camera positions;
- understand available visual coverage;
- group expressions/moments;
- inspect scene rhythm/options;
- attach selects to Beats/Cues/ShotIntents.

This should not be required for the early scripting spikes, but the Narrative IR and workspace model should not prevent it.

## Familiar workflow 8 — Coverage / Selects

Production-oriented surface connecting narrative intent to realizations.

Primary relationships:

```text
Beat/Cue
   ↓
ShotIntent
   ↓
MediaSegment / Asset realization
```

This can be shown as a board, matrix, or list depending on context.

It should answer familiar production questions rather than expose graph terminology:

- What do we still need to shoot?
- Which takes are usable?
- Which beat has no visual support?
- What footage can cover this line?
- Is there a generated/stock alternative?

## Workflow paths

Salai should not force a single prescribed sequence or ask users to commit permanently to a project type.

### Script-first / commercial

```text
Ideas
  ↓
Beat Board
  ↓
Story Wall / Outline
  ↓
AV Script
  ↓
ShotIntents / Coverage
  ↓
Shoot / Generate
  ↓
Resolve
```

A user may start directly in AV Script if that is their normal method.

### Documentary / interview

```text
Media / Transcripts
  ↓
Select SourceExcerpts
  ↓
Paper Edit or Radio Edit
  ↓
Story Wall / Outline
  ↓
AV Script as needed
  ↓
Coverage / missing visuals
  ↓
Resolve
```

### Traditional narrative

```text
Ideas
  ↓
Beat Board
  ↓
Story Wall
  ↓
Outline / Scene structure
  ↓
Screenplay-like projection later
  ↓
Shot planning
  ↓
Resolve
```

The product should allow users to skip stages, move backward, or open several workspaces simultaneously.

## Relationship to the Narrative IR

The workflow layer should not redefine canonical story semantics.

```text
Narrative IR
- Script
- Section
- Scene?
- Beat
- Cue
- ContentBlock

Production Graph
- ShotIntent
- MediaSegment
- Asset
- relationships

Workspace layer
- Workspace
- Board
- BoardItem
- IdeaCard
- layout/grouping metadata
```

The workspace layer references domain objects by stable ID.

A workspace operation may produce domain operations when appropriate, but not every spatial gesture changes story structure.

Examples:

```text
Move Beat card within ordered Story lane
→ moveBeat domain operation

Move same Beat card freely on Character Arc board
→ workspace position only

Create freeform card
→ workspace-only IdeaCard

Promote IdeaCard to Beat
→ createBeat + replace/link board reference
```

This separation is important for undo, persistence, collaboration, and future AI assistance.

## AI and workflow surfaces

AI should operate through the same domain/workspace semantics rather than introducing a separate chatbot-only workflow.

Examples:

- "Give me a 30-second structure" → proposed Beat operations;
- "Group these interview quotes by theme" → proposed Paper Edit/board grouping;
- "Show an alternate second act" → proposed Story Wall structural arrangement;
- "Which cards have no source evidence?" → graph query projected onto the board;
- "Find visual coverage for this Cue" → suggested ShotIntent/MediaSegment relationships.

AI proposals should remain reviewable and should preserve the familiar workspace the user is already working in.

## UX validation plan

The Narrative IR remains Spike 0A.

These familiar workflow surfaces primarily change **Spike 0B — Authoring UX**.

0B should no longer test only Outline + AV Script. It should test whether the same Narrative IR can move naturally between several recognizable working methods.

### Minimum 0B surfaces

Test four surfaces first:

1. **Story Wall** — Beat/Scene cards for structural reordering.
2. **Outline** — hierarchical Section/Beat structure.
3. **AV Script** — Cue-based Visual/Audio authoring.
4. **Paper/Radio Edit** — SourceExcerpt-driven construction.

Teleprompter remains a simple derived projection.

Frame Wall and full Coverage/Selects can wait until real media is integrated.

### 0B acceptance criteria

The UX spike succeeds if:

- an editor can recognize each workflow without learning Salai's internal graph terminology;
- moving between surfaces does not feel like export/import;
- the same Beat/Cue identities remain visible across surfaces;
- authored and sourced material remain distinguishable;
- spatial board organization can persist without corrupting narrative semantics;
- Story Wall structural moves can intentionally produce Narrative IR operations;
- freeform brainstorming remains possible without prematurely creating canonical story objects;
- users can begin from different familiar workflows rather than one mandatory entry point.

## Product principle to preserve

> Salai should make the production graph disappear behind familiar creative workflows.

The innovation is not inventing a new way for editors to think. It is connecting the ways they already work so that story intent, source material, production planning, generated media, and the eventual Resolve edit remain part of one coherent project.