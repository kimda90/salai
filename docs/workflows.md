# Salai Creative Workflows

## Status

Living workflow behavior. Narrative Lens semantics live in [`narrative-lenses.md`](narrative-lenses.md); external-agent authoring behavior lives in [`agent-mediated-authoring.md`](agent-mediated-authoring.md).

## Core interaction rule

> **Hide structural bookkeeping, not narrative structure.**

Creators express ordinary intent through their agent harness without manually managing IDs, parent references, operation types, or object wiring. They enter a Narrative Lens when that representation helps them think or manipulate the story directly.

## Default loop

```text
creator expresses intent in external harness
        ↓
harness inspects Salai through machine interface
        ↓
harness requests validated Salai changes
        ↓
canonical project
        ↓
continue in harness or open a Narrative Lens
        ↓
direct lens edit if useful
        ↓
next harness request reads current Salai state
```

No export/import or chat-history synchronization is required between harness and lens work.

## Script-first

```text
rough idea / prose in harness
      ↓
Salai machine interface
      ↓
usable canonical structure
      ↓
ordinary-language revision in harness
      ↓
optional Narrative Lens
```

The creator should not manually create/parent every Beat/Cue for the representative 0C scenario. Existing IDs remain stable when meaning is unchanged.

## Footage/source-first

```text
source fixture/context + story intention
      ↓
external harness
      ↓
Salai machine interface
      ↓
canonical narrative + source evidence
      ↓
optional lens/direct edit
```

Recorded wording/ranges remain source evidence; authored bridges remain authored. Mocked source metadata is sufficient for 0C.

## Harness → lens

Machine changes are visible in every lens because both use the same project service/canonical state.

## Lens → harness

A direct lens edit changes current Narrative IR or justified Workspace state. The next machine `context` call returns that current state; the harness does not need a separate synchronization record.

Examples:

- move sourced material in Paper/Radio, then ask the harness to tighten authored material around it;
- adjust audiovisual realization, then ask for a simpler surrounding Beat;
- restructure hierarchy in Outline, then continue the story through the harness.

## Workspace vs narrative change

Story Wall x/y position and parking are Workspace semantics, not canonical narrative order. Spatial movement must not silently reorder the story. Explicit narrative reorder remains a canonical operation.

## Narrative Lenses

0C reuses:

- Outline;
- Story Wall;
- AV Script;
- Paper / Radio Edit.

A new Coverage Lens is deferred until the production graph exists. 0C may answer a simple missing/unsupported-material question from mocked relationships.

## Resolve

```text
creative work in Salai
        ↓
canonical state
        ↓
explicit materialization decision
        ↓
Resolve adapter
        ↓
DaVinci Resolve
```

Neither harness instructions nor a Narrative Lens bypass canonical Salai state to mutate Resolve directly.

## 0C workflow proof

1. rough prose → canonical story → harness-driven revision;
2. fixture-backed source context → source-preserving structure;
3. one grouped harness change → summary → immediate revert;
4. harness-normalized project → existing lens → direct edit → follow-up harness request.
