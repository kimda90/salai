# Salai Creative Workflows and Working Surfaces

## UX principle

Salai should let creators express **creative intent** before asking them to express **project structure**.

The primary UX hypothesis is now:

> **Write, talk, or drop media. Salai normalizes that material into one structured project.**

The user should not routinely think in `Section`, `Beat`, `Cue`, `ParentRef`, relationship, or operation vocabulary. Those concepts remain available where they help precision, but common creative work should not require manually operating the data model.

The architectural principle remains:

> **One Narrative IR, multiple synchronized creative views.**

Story Wall, Outline, AV Script, Paper/Radio Edit, Coverage, and later media views are still useful. Their role changes from candidate primary authoring workflows to **specialized representations over agent-maintained canonical state**.

## Why this changed

Spike 0B proved that the structured surfaces can share one project safely. It also produced a decisive human finding:

> **The direct structured workflow needs too much user interaction to be creatively useful.**

The problem is not only click count. It is attention cost: the user must stop thinking about the story to decide which object, parent, surface, mode, or structural operation is required.

The next workflow should hide that bookkeeping behind an agent-mediated normalization layer.

See [`spike-0b-assessment.md`](spike-0b-assessment.md) and [`agent-mediated-authoring.md`](agent-mediated-authoring.md).

# Primary workflow — free-form authoring with agent normalization

The primary workflow combines three input modes over one shared project context.

## Free-form working text

A simple writing area accepts incomplete and mixed-purpose prose:

```text
Open with Maria describing the old manual process.

Then show the installation. Three quick moments should be enough.

I think we still need a close-up of the connector.

End on Juan talking about the result.
```

The text may contain:

- story prose;
- rough ideas;
- production notes;
- uncertainty;
- reminders;
- questions;
- alternative directions.

The user should not have to classify each line before writing it.

## Conversation

The same project can be changed or queried conversationally:

```text
Move Maria's quote earlier.

Make the middle less repetitive.

Give me a version under 45 seconds.

What parts do not have visual coverage?

Use the second interview quote instead.
```

The conversation is an interaction channel, not a second project document.

## Media and attachment intake

The user can add relevant material without manually wiring it into the domain model first:

- interview clips;
- B-roll;
- stills;
- scripts/documents;
- voice notes;
- references;
- generated/previs material.

For early validation, attachments can be fixture-backed or mocked. Later, transcription/media analysis provides richer evidence.

## Agent normalization

The agent interprets the user's desired outcome and maps it into typed project changes:

```text
free-form input
      ↓
interpretation
      ↓
0..N Narrative / Workspace / production operations
      ↓
validation
      ↓
canonical project
```

The user works at the level of intent; Salai performs routine object creation, parenting, ordering, and attachment.

### Example

User:

```text
Open on the manual-process quote, show three install moments,
then use the result quote. Keep it around 30 seconds.
```

Salai may internally:

- create or reuse several Beats;
- create Cues for the audiovisual moments;
- attach SourceExcerpts;
- infer visual descriptions;
- reorder material;
- update authored bridges;
- compute runtime.

That internal complexity should remain one understandable creative action to the user.

# Interaction and trust

## Common intentions should be compressed

A common creative intention should usually require one short input or one direct gesture.

The number of user actions should scale with the number of **creative decisions**, not with the number of domain operations required to represent those decisions.

## Do not replace interaction friction with approval friction

If every agent-produced operation requires separate confirmation, Salai recreates the same problem in a new form.

One user request should produce one grouped action/history entry:

```text
creative request
     ↓
operation batch
     ↓
summary + undo
```

## Graduated autonomy

### Reversible in-project changes

Clearly requested, reversible local normalization may apply as one batch:

- structure creation;
- reordering;
- attaching evidence;
- authored-copy changes;
- creation of supporting Cues.

### Meaningful ambiguity

Ask a focused question only when the creative meaning changes materially and a safe reversible assumption is not reasonable.

Questions should use creative language, not domain vocabulary.

### External/destructive actions

Require explicit confirmation for actions such as:

- irreversible deletion;
- changing a real Resolve timeline;
- destructive filesystem/media operations;
- publishing/export;
- expensive generation;
- replacing source identity when recovery is unclear.

# Working text vs canonical project state

The free-form working text and chat transcript are **input/context**, not automatically canonical narrative truth.

For the current direction:

- raw input can remain messy;
- Salai normalizes committed meaning into the Narrative IR;
- unresolved notes can remain unstructured;
- media remains attached by stable source handles;
- no full second document model should be introduced just to make the free-form surface work.

This prevents the product from replacing “four drifting documents” with “one drifting AI document plus the IR.”

# Projection vs Workspace

The distinction validated by 0B remains useful.

## Projection

A projection is deterministically derived from canonical state.

Examples:

- Outline;
- AV Script;
- Teleprompter;
- Coverage.

A projection does not own independent narrative truth. Editing it changes the underlying canonical state.

## Workspace

A Workspace preserves human organization that is not inherent to a narrative object.

Validated example:

- Story Wall x/y position and parking state.

Potential later examples:

- Frame Wall;
- Selects board;
- alternate/comparison spaces;
- other spatial organizations justified by real workflow evidence.

A Workspace is now explicitly **optional**. The product should not require persistent spatial organization to accomplish ordinary story changes.

# Specialized surface 1 — Outline

Outline is a projection for inspecting and precisely editing hierarchy.

Primary structure:

```text
Section
  Scene? / Beat
    Beat
```

Useful for:

- structural overview;
- precise move/parent inspection;
- sectioning;
- runtime summaries;
- resolving ambiguities the agent could not confidently infer.

### New role

A writer should not have to open Outline merely to add “the next idea” or move one story point before another. Those requests should normally be possible from the primary free-form flow.

Outline becomes valuable when explicit hierarchy itself is the thing the user wants to inspect or control.

# Specialized surface 2 — Story Wall

Story Wall is a spatial Workspace inspired by index-card and sticky-note workflows.

Useful for:

- seeing several story chunks simultaneously;
- comparing alternatives;
- keeping removed ideas nearby;
- spatial/theme exploration;
- precise manual arrangement when the user wants a wall metaphor.

Validated semantic distinction:

- free x/y placement is Workspace state;
- canonical narrative order is Narrative IR state.

### New role

Story Wall should not be the required solution to basic narrative reordering. A user can simply ask Salai to reorder the story.

The wall is opened because spatial thinking helps, not because the user must manually perform the operation there.

# Specialized surface 3 — AV Script

AV Script is a projection over Beat/Cue structure.

Primary form:

```text
Beat
  Cue
    Visual | Audio
```

Useful for:

- visual/audio planning;
- branded/corporate work;
- commercials;
- YouTube/educational pieces;
- shot/coverage planning;
- precise audiovisual sequencing.

### New role

The agent may create Cues implicitly when a user's story requires several audiovisual moments.

The user opens AV Script to inspect or refine the audiovisual realization, not because every audiovisual change requires manual Cue creation.

Whether `Cue` should be visible remains a per-view UX question rather than a global product requirement.

# Specialized surface 4 — Paper / Radio Edit

Paper/Radio Edit is a source-evidence-oriented view for documentary and interview work.

Primary material:

- SourceExcerpts;
- MediaSegments;
- authored bridge/VO material;
- Beat/Cue placement;
- spoken duration.

Important invariant:

> Recorded wording remains source evidence, not editable fiction.

### New role

A footage-first user should be able to drop source media and say:

```text
Build a short radio edit around the old process, what changed, and the result.
Keep Maria's wording exactly as recorded.
```

Salai should create/attach the required structure automatically.

Paper/Radio Edit is then used to inspect source ranges, refine the exact order, compare alternatives, or solve difficult evidence choices.

# Specialized surface 5 — Coverage

Coverage connects narrative intent to production material.

Representative relationship:

```text
Beat / Cue
   ↓
ShotIntent
   ↓
MediaSegment / Asset realization
```

It should answer:

- What do we still need to shoot?
- Which story moments lack visual support?
- Which takes are usable?
- What can cover this line?
- Is there a generated/stock/previs alternative?

### Agent relationship

Coverage should also be queryable conversationally:

```text
What am I missing visually?

Find source material that could support this Beat.

Give me a shot list only for the missing coverage.
```

The Coverage view remains useful for verification and production planning.

# Specialized surface 6 — Frame Wall / Selects

Later real-media Workspaces may show representative frames, takes, and source moments spatially.

Use them for:

- visual comparison;
- coverage inspection;
- selects;
- expressions/moments;
- scene rhythm/options;
- attaching real media to narrative/ShotIntent objects.

These should be added after real-media integration demonstrates the need.

# Workflow paths

Salai should not force a prescribed sequence.

The default pattern is now:

```text
write / talk / drop media
          ↓
    agent normalization
          ↓
   canonical project
      ↙   ↓   ↘
 optional specialized views
          ↓
  production / Resolve
```

## Script-first / commercial

```text
idea / rough prose
       ↓
free-form authoring + agent
       ↓
rough narrative
       ↓
AV Script / Outline / Story Wall as useful
       ↓
Coverage / ShotIntents
       ↓
Shoot / Generate
       ↓
Resolve
```

## Documentary / interview

```text
media / transcripts / notes
          ↓
free-form authoring + agent
          ↓
source-preserving narrative / radio edit
          ↓
Paper/Radio / Outline / AV as useful
          ↓
missing coverage
          ↓
Resolve
```

## Traditional narrative

```text
idea / scene notes / script fragments
          ↓
free-form authoring + agent
          ↓
canonical narrative structure
          ↓
Story Wall / Outline / screenplay-like views as useful
          ↓
shot planning
          ↓
Resolve
```

# Relationship to Narrative IR

The workflow layer should not redefine canonical story semantics.

```text
Interaction layer
- working text
- conversation
- attachments
- agent normalization

Canonical narrative
- Script
- Section
- Scene?
- Beat
- Cue
- ContentBlock

Production context
- ShotIntent
- MediaSegment
- Asset
- relationships

Optional Workspace layer
- Workspace
- Board
- BoardItem
- IdeaCard
- validated layout metadata
```

The agent acts through the same operation boundaries used by structured views.

Examples:

```text
"Make this intro shorter"
→ batch of typed narrative operations

Drop interview clip beside rough story text
→ attachment context → source-preserving relationship/structure operations

Move Beat card freely on Story Wall
→ Workspace position only

Precisely move a Cue in AV Script
→ Narrative operation
```

# Resolve relationship

The agent must not turn conversational requests directly into opaque Resolve commands.

The intended path is:

```text
creative intent
      ↓
agent normalization
      ↓
canonical Salai project
      ↓
chosen materialization/edit action
      ↓
Salai Resolve adapter
      ↓
CutMaster / DaVinci Resolve
```

This preserves deterministic state and makes downstream edits reproducible.

# Current UX validation

## Spike 0B result

0B showed that the four structured surfaces can manipulate one Narrative IR. Human testing showed that using those surfaces directly as the main authoring model creates too much interaction.

## Spike 0C question

Can the user remain in a free-form writing/conversation/media workflow while Salai performs the structural normalization?

Minimum 0C interaction:

1. working text;
2. project-aware chat/instructions;
3. media/attachment drop;
4. typed operation batches;
5. grouped change summary + undo;
6. existing structured views reflecting the result.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md).

## 0C acceptance principle

The new workflow succeeds when:

- users express common creative changes without model vocabulary;
- one creative intention can produce several safe internal operations without several explicit UI steps;
- source identity remains intact;
- structured views remain synchronized;
- changes are understandable and reversible;
- users open specialized views because they help think, not because the system requires them;
- interaction cost is materially lower than the 0B baseline.

# Product principle to preserve

> **Salai should make structured production context disappear behind the creative act, while keeping that context explicit enough for agents, specialized views, and DaVinci Resolve to consume reliably.**
