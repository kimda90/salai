# Salai Creative Workflows

## Status

Living workflow behavior. Narrative semantics live in [`narrative-ir-spec.md`](narrative-ir-spec.md); validated external-agent behavior lives in [`agent-mediated-authoring.md`](agent-mediated-authoring.md); proposed direct structural-editorial behavior lives in [`editorial-interaction.md`](editorial-interaction.md); current execution is tracked in [`spike-0e-implementation-plan.md`](spike-0e-implementation-plan.md).

## Core interaction rules

> **Hide structural bookkeeping, not narrative structure.**

> **One temporal context, progressively revealed semantic depth.**

> **The story must be playable inside Salai without giving timeline-engine state ownership of the project.**

Creators can express ordinary intent through an external agent harness without manually managing IDs, parents, operation types, or low-level structure. They can also work directly when the representation itself contributes to the creative decision.

## Default loop

```text
creator expresses intent or edits directly
        ↓
Salai canonical project
        ↓
hierarchical semantic timeline / other useful representation
        ↓
play and judge
        ↓
reshape directly or through external harness
        ↓
canonical project
```

No export/import or chat-history synchronization is required between agent and UI work.

## Script-first

```text
rough idea / prose
      ↓
external harness or direct Salai input
      ↓
usable canonical structure
      ↓
hierarchical temporal projection
      ↓
playable rough assembly as material becomes available
```

The creator should not manually create/parent every Beat/Cue for routine story changes. Direct creation remains available when temporal context itself is useful.

## Footage/source-first

```text
source context / media / transcript
      ↓
external harness or direct source selection
      ↓
canonical narrative + source evidence
      ↓
hierarchical semantic timeline
      ↓
play / reorder / trim source I/O while preserving evidence identity
```

Recorded wording/ranges remain source evidence; authored bridges remain authored.

## Hierarchical semantic timeline workflow

0D showed that replacing the whole timeline with Story / Moments / Media levels caused context loss. 0E therefore tests nested semantic depth inside one temporal context.

A representative interaction is:

```text
whole story visible
      ↓
expand a Section / Beat
      ↓
inspect Cue detail without leaving surrounding time
      ↓
select Cue / ContentBlock
      ↓
edit or create in contextual inspector
      ↓
canonical operation/batch
      ↓
reproject + replay
```

Expansion/collapse, viewport zoom, selection, and playhead remain non-canonical interaction state.

## Select → inspect → edit

Selecting a canonical object should make the selected object useful immediately.

Examples:

- select Beat → edit title/summary, inspect duration/Cues, create Cue, split/merge when valid;
- select Cue → edit explicit duration, inspect all visual/audio blocks, add a block;
- select SourceExcerpt → inspect evidence identity and source in/out, trim the range;
- select authored/visual/sound block → edit its type-owned properties and move/delete it.

The inspector does not expose engine clip properties merely because the timeline library has them.

## Creation in temporal context

The creator can add semantic structure without changing to a separate mechanical surface.

Examples:

- add a Beat inside/relative to the selected Section/Scene/Beat;
- add a Cue inside/relative to the selected Beat/Cue;
- add a visual/audio ContentBlock to a selected Cue;
- use the playhead as a placement hint only after Salai resolves the intended canonical parent/insertion point.

When structure is materially ambiguous, show the resolved semantic target rather than inferring destructive reparenting from pixel position.

## Multiple material in one Cue

A Cue can already contain multiple visual and audio blocks. The workflow must expose every one of them.

```text
Cue: "She realizes the installation is easy"
  visual
    - wide installation description
    - on-screen text: "30 seconds"
    - graphic: connector callout
  audio
    - interview SourceExcerpt
    - SFX: connector click
    - Music: light continuation
```

For 0E all blocks share the Cue's narrative interval. SourceExcerpt preserves source I/O. Independent within-Cue offsets/durations are not silently invented.

## Multi-selection / grouped editing

Selection may include multiple compatible semantic items.

Useful first grouped workflows:

- select several sibling Beats/Cues/blocks and move them while preserving relative order;
- delete a compatible set in one action;
- apply one shared semantic property only when every selected object supports it.

One grouped direct action becomes one atomic `NarrativeOperation[]` batch. Unsupported heterogeneous mutations stay disabled rather than guessing.

## Minimum temporal editing grammar

### Transport

- Space toggles play/pause unless text editing or another focused control consumes Space.
- Seek/scrub uses the same Viewer playhead.

### Reorder / move

```text
Move Section      → moveSection
Move Beat         → moveBeat
Move Cue          → moveCue
Move ContentBlock → moveBlock
```

Canonical sequence changes ripple all later derived start times.

### Cue duration

Change Cue narrative duration through `updateCue.explicitDurationMs`.

This is distinct from source trimming.

### Source I/O

```text
SourceExcerpt edge trim / inspector in-out
      ↓
trimSourceExcerpt
```

The source range remains inside the MediaSegment and keeps evidence identity.

### Split / merge

Beat split at a Cue boundary uses `splitBeat`; Beat merge uses `mergeBeats`.

A universal razor is not assumed. Cue split and SourceExcerpt split remain scoped RFC 0003 questions until their semantics are explicitly resolved.

### Delete

Delete uses the corresponding canonical delete operation(s); external production media is not cascade-deleted.

## Ripple and absence

The current story is sequential Cue time, not arbitrary clip space.

- reorder/duration changes ripple later story time;
- no 0E overwrite/free-positioned-gap mode exists;
- no audio blocks means silence;
- no visual content remains visibly absent;
- known unsupported realization remains explicitly missing;
- the UI does not invent clips/material to hide absence.

## Agent ↔ temporal UI

Agent changes are visible automatically because both agent and UI use the same project service/canonical state.

Examples:

- directly create/trim/reorder, then ask the harness to tighten the surrounding story;
- ask the harness to restructure a Beat, then inspect the same nested hierarchy and play the result;
- multi-edit several objects, then read fresh machine context without synchronization bookkeeping.

Selection/viewport/collapse state is not automatically agent context unless the current user request explicitly makes it relevant.

## Playback/review

```text
construct
   ↓
play
   ↓
notice pacing / evidence / realization problem
   ↓
select the relevant semantic object(s)
   ↓
edit directly or through external harness
   ↓
replay canonical result
```

Validation fixtures must not be dominated by placeholder artifacts such as fixed-frequency tones that distort creative judgment.

## Workspace vs narrative change

Story Wall x/y and parking remain Workspace semantics. Timeline hierarchy expansion/collapse, selection, viewport, and playhead are likewise non-canonical interaction state.

Physical position does not silently become narrative meaning unless an explicit semantic gesture commits a canonical change.

## Existing structured views

0B/0C validated Outline, Story Wall, AV Script, and Paper/Radio Edit as coherent representations of one project.

They remain valid Narrative Lens evidence, but ordinary temporal editing must not require switching to another surface for mechanical reasons. 0E tests whether one hierarchical temporal surface can expose much of the needed story/AV depth while preserving global context.

## Downstream finishing

```text
creative + structural editorial work in Salai
        ↓
canonical state / structural assembly
        ↓
explicit materialization/interchange decision
        ↓
optional specialist NLE
```

Neither harness instructions nor direct temporal UI bypass canonical Salai state to mutate a downstream NLE directly.

## Current 0E workflow proof

Human validation should be possible entirely from this loop:

1. watch the representative rough story;
2. navigate whole story → nested Cue/material detail without losing temporal context;
3. edit a selected Beat/Cue/block through its inspector;
4. create new Beat/Cue/material in temporal context;
5. work with multiple visual/audio blocks inside a Cue;
6. perform one useful multi-selection/grouped edit;
7. reorder and change Cue duration;
8. adjust SourceExcerpt source I/O;
9. split/merge where accepted semantics exist;
10. use external harness for one structural/timing change;
11. replay and compare whether semantic hierarchy changed the creative decision.
