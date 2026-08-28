# Salai Creative Workflows and Narrative Lenses

## UX principle

Salai should let creators express **creative intent** before requiring them to express **project structure**.

The primary interaction hypothesis is:

> **Write, talk, or drop media. Salai normalizes that material into one structured project. Then use narrative lenses to see and reshape that project from different creative angles.**

The deeper rule is:

> **Hide structural bookkeeping, not narrative structure.**

Users should not routinely have to manage IDs, parent references, operation types, or object wiring. But they should be able to see structure when that structure helps them understand the story's hierarchy, rhythm, density, evidence, audiovisual realization, coverage, or alternatives.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md) for the active 0C interaction contract and [`narrative-lenses.md`](narrative-lenses.md) for the lens concept.

# Why this changed after Spike 0B

Spike 0B proved that Story Wall, Outline, AV Script, and Paper/Radio Edit can all operate on one canonical Narrative IR.

The first human UX test then produced the key finding:

> **The direct structured workflow needs too much user interaction to be creatively useful as the routine path for ordinary changes.**

The problem was not that structured representations are useless. The problem was asking the user to operate them even when the structure itself was not the creative question.

The revised hypothesis is therefore:

- **agent-mediated authoring** handles routine normalization and bookkeeping;
- **Narrative Lenses** expose the narrative system deliberately when the representation helps the creator think;
- direct lens editing remains first-class when the user intentionally wants to manipulate that representation.

# Primary workflow

The default loop is:

```text
express intent
write / talk / drop media
        ↓
Salai normalizes
        ↓
canonical project
        ↓
see through a useful lens
        ↓
reshape directly or conversationally
        ↓
continue toward production / Resolve
```

The user may skip the lens step when unnecessary or remain in a lens for extended work when that mode is creatively productive.

# Free-form authoring

## Working text

A simple writing area accepts incomplete and mixed-purpose material:

```text
Open with Maria describing the old manual process.
Then show installation in three quick moments.
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

Conversation is an interaction/reasoning channel, not a second canonical project document.

## Media and attachment intake

The user can add relevant material without manually wiring it into the domain model first:

- interview clips;
- B-roll;
- stills;
- scripts/documents;
- voice notes;
- references;
- generated/previs material.

For 0C, attachments can be fixture-backed or mocked. Later, transcription/media analysis provides richer evidence.

# Agent normalization

The agent interprets the user's desired outcome and maps it into typed Salai changes.

```text
free-form input
      ↓
interpretation
      ↓
Salai authoring commands
      ↓
canonical operations
      ↓
validation
      ↓
canonical project
```

The user works at the level of intent; Salai performs routine object creation, parenting, ordering, and attachment.

Example:

```text
Open on the manual-process quote, show three install moments,
then use the result quote. Keep it around 30 seconds.
```

Salai may internally:

- create/reuse several Beats;
- create Cues for audiovisual moments;
- attach SourceExcerpts;
- infer visual descriptions;
- reorder material;
- update authored bridges;
- compute runtime.

That internal complexity should remain one understandable creative action.

# Narrative Lenses

A **Narrative Lens** is a structured representation of the same canonical project that emphasizes a specific property of the narrative system.

A lens is not merely an advanced settings screen. It can be a different way to perceive the story and to modify it.

## Lens taxonomy

| Lens | What it helps the creator perceive |
| --- | --- |
| Outline | hierarchy, progression, proportion, structural weight |
| Story Wall | spatial rhythm, balance, turning points, alternatives, clustering |
| AV Script | audiovisual density, realization over time, visual/audio interplay |
| Paper / Radio Edit | evidentiary spine, voice, source pacing, authored-vs-sourced balance |
| Coverage | gaps between intent and available realization |
| Runtime / pacing indicators | temporal pressure, density, narrative weight |
| later Frame Wall / Selects | visual coverage, contrast, repetition, usable alternatives |

## Lens rule

> **Expose structure when the exposure contributes to the creative decision. Hide it when it is only bookkeeping.**

Useful exposure:

- one Beat contains many more Cues than its neighbors;
- one section dominates runtime;
- several consecutive Beats depend on one interview subject;
- a Beat lacks credible visual support;
- an area of the Story Wall is crowded;
- a simple narrative idea requires complex audiovisual realization.

Unhelpful exposure:

- raw IDs;
- `ParentRef` construction;
- insertion-index calculation;
- object-type selection for obvious commands;
- mandatory Cue creation when Salai can infer it;
- manual source wiring that is clear from context.

# Direct manipulation inside lenses

Direct manipulation remains a first-class Salai interaction.

The criterion is intentionality:

> **Direct manipulation is useful when the user is intentionally manipulating what the lens represents.**

Examples:

- rearrange cards while thinking spatially in Story Wall;
- move interview excerpts while shaping spoken rhythm in Paper/Radio;
- adjust Visual/Audio moments while planning audiovisual expression in AV Script;
- change hierarchy while intentionally working structurally in Outline.

The 0B finding means these interactions should not be the compulsory route for every ordinary creative change.

# Agent + lens workflows

The agent should understand the active lens when useful.

Examples:

### Story Wall

```text
Why does the middle feel crowded?

Show me an alternative where the proof arrives earlier.
```

### Outline

```text
Which section is carrying too much of the story?

Flatten this part unless the Scene boundary is doing useful work.
```

### AV Script

```text
This Beat feels visually busy. Reduce the number of visual changes.

Where am I repeating the same kind of shot?
```

### Paper / Radio Edit

```text
Can we make this less dependent on Maria?

Which source excerpt gives us the same idea more concisely?
```

### Coverage

```text
Show only what is missing enough to block a rough cut.

Which Beat has intent but no usable realization?
```

A lens therefore becomes both:

- a human perception/manipulation surface; and
- structured context for agent reasoning.

# Projection vs Workspace

The 0B distinction remains important.

## Projection

A Projection is deterministically derived from canonical state.

Examples:

- Outline;
- AV Script;
- Paper / Radio Edit;
- Teleprompter;
- Coverage.

A projection does not own independent narrative truth. Editing it produces canonical operations.

## Workspace

A Workspace preserves human organization that is not inherent to the narrative object.

Validated example:

- Story Wall x/y position and parking state.

Potential later examples:

- Frame Wall;
- Selects board;
- alternative/comparison spaces;
- other spatial organizations justified by workflow evidence.

Workspace metadata must not silently redefine narrative semantics.

A Narrative Lens may be implemented as a Projection, a Workspace, or a combination. “Lens” describes its creative role; Projection/Workspace describe state ownership.

# Lens 1 — Outline

Outline is a Narrative Lens for structural hierarchy.

Primary structure:

```text
Section
  Scene?
    Beat
  Beat
```

Useful for:

- seeing progression and hierarchy;
- comparing structural weight;
- identifying overly nested or flat areas;
- precise parent/order edits;
- resolving ambiguities the agent should not guess.

The user should not need Outline merely to add “the next idea.” They open it when hierarchy itself is useful to see or manipulate.

# Lens 2 — Story Wall

Story Wall is a spatial Narrative Lens and Workspace inspired by index-card/sticky-note practice.

Useful for:

- seeing many chunks simultaneously;
- spatial rhythm/balance;
- turning points;
- alternatives and parking;
- thematic or sequence clustering;
- deliberate manual arrangement.

Validated semantic distinction:

- free x/y placement is Workspace state;
- canonical narrative order is Narrative IR state.

The user may directly manipulate either when intentionally working in the wall metaphor.

# Lens 3 — AV Script

AV Script is a Narrative Lens over Beat/Cue audiovisual realization.

Primary form:

```text
Beat
  Cue
    Visual | Audio
```

Useful for:

- visual/audio planning;
- audiovisual density;
- multiple moments within one narrative idea;
- shot/coverage planning;
- precise audiovisual sequencing;
- seeing whether realization complexity matches narrative importance.

The agent may create Cues implicitly. The user opens AV Script when they want to inspect or reshape the audiovisual system explicitly.

Whether the word `Cue` should be visible remains a per-lens UX decision.

# Lens 4 — Paper / Radio Edit

Paper/Radio Edit is a source-evidence Narrative Lens for documentary/interview work.

Primary material:

- SourceExcerpts;
- MediaSegments;
- authored bridge/VO material;
- Beat/Cue placement;
- spoken duration.

Important invariant:

> Recorded wording remains source evidence, not editable fiction.

A footage-first user should be able to drop source media and say:

```text
Build a short radio edit around the old process, what changed, and the result.
Keep Maria's wording exactly as recorded.
```

Salai normalizes the structure. Paper/Radio then lets the editor see and directly manipulate the evidentiary spine, voice distribution, exact source choices, and pacing.

# Lens 5 — Coverage

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

- What still needs to be shot?
- Which story moments lack visual/source support?
- Which takes are usable?
- What can cover this line?
- Is there a generated/stock/previs alternative?

Coverage is both queryable conversationally and inspectable as a lens.

# Lens 6 — Frame Wall / Selects

Later real-media Workspaces may expose representative frames, takes, and source moments spatially.

Potential uses:

- visual comparison;
- coverage inspection;
- selects;
- expression/moment comparison;
- scene rhythm/options;
- attaching real media to narrative/ShotIntent objects.

Add only after real-media integration demonstrates the need.

# Narrative pulse

“Narrative pulse” is currently a product metaphor, not a canonical domain object.

It refers to patterns made visible across lenses, including:

- progression;
- pacing;
- density;
- alternation;
- repetition;
- voice/evidence distribution;
- audiovisual complexity;
- coverage completeness;
- structural balance;
- unresolved intent.

Salai should make these patterns legible through views and derived indicators before considering any universal score or `Pulse` domain concept.

# Workflow paths

Salai should not force a prescribed sequence.

## Script-first / commercial

```text
idea / rough prose
       ↓
free-form authoring + agent
       ↓
canonical narrative
       ↓
Outline / Story Wall / AV Script as useful
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
source-preserving narrative / radio structure
          ↓
Paper/Radio / Outline / AV as useful
          ↓
Coverage / missing visuals
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
Story Wall / Outline / later screenplay lens as useful
          ↓
shot planning
          ↓
Resolve
```

Users may also start directly in a Narrative Lens if that is how they want to think.

The key distinction is that **starting in a lens is a creative choice, not a software requirement**.

# Relationship to Narrative IR

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

Narrative Lenses
- Projections
- Workspaces
- derived indicators
```

The agent and direct lens interactions use the same canonical operation boundaries.

Examples:

```text
"Make this intro shorter"
→ grouped narrative operations

Drop interview clip beside rough story text
→ attachment context → source-preserving operations

Move Beat card freely on Story Wall
→ Workspace position only

Precisely move a Cue in AV Script
→ Narrative operation
```

# Resolve relationship

The agent must not turn conversational requests directly into opaque Resolve commands.

```text
creative intent
      ↓
agent normalization / lens edits
      ↓
canonical Salai project
      ↓
chosen materialization action
      ↓
Salai Resolve adapter
      ↓
CutMaster / DaVinci Resolve
```

This preserves deterministic project state and makes downstream edits reproducible.

# 0C validation

0C must validate two dimensions.

## Interaction compression

Can ordinary creative tasks be completed with materially less model-management interaction than 0B?

Measure:

- explicit user actions/inputs;
- clarifications;
- moments where incidental hierarchy interrupts creative thinking;
- trust in grouped summary + undo.

## Structural insight

Do Narrative Lenses add creative value beyond the free-form/chat interface?

Measure:

- which lens users open voluntarily;
- what they are trying to understand;
- whether the lens reveals something not obvious in prose/chat;
- whether direct manipulation feels creatively meaningful;
- whether exposed domain concepts justify their cognitive cost;
- whether agent + lens interaction is stronger than either alone.

A successful 0C result is **not** “users never touch structured UI.”

The stronger outcome is:

> **Users create with low friction and deliberately enter structured lenses when they want to understand or reshape the narrative system from another angle.**

# Product principle to preserve

> **Salai should make structural bookkeeping disappear behind the creative act while keeping the narrative system visible enough to inspect, understand, and directly shape when that visibility helps the creator.**