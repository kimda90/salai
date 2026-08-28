# Salai Creative Workflows

## Status

Living workflow behavior.

This document describes **how creators move through Salai**. It does not redefine Narrative Lens semantics; those are canonical in [`narrative-lenses.md`](narrative-lenses.md). The active low-friction authoring contract is [`agent-mediated-authoring.md`](agent-mediated-authoring.md).

## Core interaction rule

> **Hide structural bookkeeping, not narrative structure.**

Creators should be able to express ordinary intent without first managing IDs, parent references, operation types, or object wiring. They should also be able to enter a structured Narrative Lens when that representation is itself useful for thinking.

# Default creative loop

```text
express intent
write / instruct / provide media
        ↓
Salai normalizes
        ↓
canonical project
        ↓
continue directly
   or open a useful lens
        ↓
reshape directly or conversationally
        ↓
continue toward production / Resolve
```

A lens is optional for any individual change. It is not “advanced mode”; it is another creative representation the user may choose deliberately.

# Script-first workflow

Typical path:

```text
rough idea / prose
      ↓
process with Salai
      ↓
usable narrative structure
      ↓
revise conversationally
      ↓
open a lens when structure/realization is worth inspecting
```

Expected behavior:

- the user may write incomplete prose and notes before deciding structure;
- one request may create/reorder/update several canonical objects;
- unresolved material may remain outside canonical structure until needed;
- common revisions should not require manual Beat/Cue/parent management;
- direct structured editing remains available when the creator wants to work that way.

# Footage-first workflow

Typical path:

```text
interview / source handles
         +
story intention
      ↓
Salai arranges source evidence
      ↓
canonical narrative + source links
      ↓
inspect/refine conversationally or through an existing lens
```

Expected behavior:

- attachment presentation is distinct from canonical MediaSegment/SourceExcerpt identity;
- recorded wording/ranges remain source evidence;
- authored bridges remain authored;
- moving/selecting source material must not silently rewrite it;
- mocked source metadata is sufficient for 0C; real analysis comes later.

# Agent → lens workflow

A creator may normalize material first, then open a lens because another representation exposes a useful property of the story.

```text
natural-language change
        ↓
canonical state
        ↓
open existing Narrative Lens
        ↓
inspect / direct edit
```

The lens reads the same canonical state; there is no export/import or synchronization step.

# Lens → agent workflow

A creator may make a direct edit because the lens is the right way to think, then continue conversationally.

```text
direct lens edit
        ↓
canonical / Workspace state
        ↓
next agent request reads current state
```

Examples of legitimate transitions:

- rearrange cards spatially, then ask Salai whether the new structure leaves an unsupported Beat;
- move a sourced excerpt in Paper/Radio, then ask Salai to tighten the authored bridge around it;
- adjust AV realization directly, then ask for a simpler version of the surrounding Beat;
- restructure hierarchy in Outline, then continue writing in the low-friction surface.

The agent does not need a separate synchronization record of the edit; canonical state is already the shared context.

# Workspace vs narrative change

The 0B ownership distinction remains important.

A Workspace stores meaningful human organization that is not inherent to canonical narrative semantics.

Validated example:

- Story Wall x/y position and parking state.

A request such as “move this card aside” may therefore be Workspace-only when spatial organization is clearly the intent. It must not silently reorder the narrative.

Conversely, “put this Beat before the proof” is a narrative structural request even if it originates while Story Wall is open.

# Narrative Lens selection

The product should not force the user into a lens merely because an operation is implemented there.

The creator enters a lens because its representation helps answer the current creative question.

The canonical lens roles and expose/hide rules are defined in [`narrative-lenses.md`](narrative-lenses.md).

0C reuses the four existing lenses:

- Outline;
- Story Wall;
- AV Script;
- Paper / Radio Edit.

A new Coverage Lens is deferred until the production graph exists. 0C may still answer simple missing/unsupported-material questions using mocked relationships.

# Alternatives and parking

Creators often keep rejected or uncertain material nearby rather than deleting it.

Salai should preserve the distinction between:

- move/reorder in active narrative;
- park/move aside in Workspace organization;
- remove from active structure where a future model supports that explicitly;
- permanently delete.

0C does not need a new alternatives/versioning model to preserve the existing Story Wall behavior.

# Resolve workflow

Resolve remains downstream.

```text
creative work in Salai
        ↓
canonical narrative / source / production state
        ↓
explicit materialization decision
        ↓
Resolve adapter
        ↓
DaVinci Resolve
```

Neither conversation nor a Narrative Lens should bypass canonical Salai state and mutate Resolve directly.

# 0C workflow proof

The active spike needs only these representative loops:

1. rough prose → canonical story → natural-language revision;
2. fixture-backed source handles → source-preserving structure;
3. one grouped agent change → summary → revert;
4. agent-normalized project → existing lens → direct edit → follow-up agent instruction.

If those loops reduce interaction burden while preserving useful structural perception, later phases can broaden lenses, media intelligence, persistence, production graph, and Resolve integration.