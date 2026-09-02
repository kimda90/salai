# Salai System Architecture

## Status

Living system architecture. Narrative IR field semantics and canonical operations are authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md). Current human/machine runtime decision: [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md). Current product/editorial boundary: [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md).

Spike 0D validated the temporal/playback adapter architecture and closed mixed on direct interaction usefulness. Spike 0E is shaping deeper direct interaction without changing the ownership model. Proposed direct interaction behavior is in [`editorial-interaction.md`](editorial-interaction.md); unresolved cross-cutting semantics remain in [`rfcs/0003-semantic-editorial-interaction-model.md`](rfcs/0003-semantic-editorial-interaction-model.md).

## Architectural thesis

Salai owns narrative/project semantics **and structural editorial decisions**. External harnesses own model execution. Timeline/rendering engines and specialist NLEs are replaceable infrastructure, not project truth.

```text
human semantic editor                  external harness
        │                                   │
        │                              Salai machine interface
        │                                   │
        └───────────────┬───────────────────┘
                        ↓
               SalaiProjectService
                        ↓
                NarrativeOperation[]
                        ↓
                 Narrative IR
                        ↓
          Salai timeline/assembly projection
                  ↙               ↘
           timeline UI        playback adapter
                        ↓
             optional NLE handoff
```

Core rules:

> **One canonical project, multiple human and machine interfaces.**

> **Hide structural bookkeeping, not narrative structure.**

> **Salai owns structural editorial; specialist NLEs remain optional downstream.**

## Ownership

### Salai owns

- Narrative IR and stable narrative identity;
- authored vs source-backed semantics;
- canonical operation semantics and validation;
- `SalaiProjectService` reads/writes/subscriptions;
- minimum scenario-proven authoring commands that compile to canonical operations;
- grouped-action and immediate-revert behavior;
- Projection/Workspace semantics;
- structural-editorial meaning, including how direct gestures compile to canonical changes;
- Salai-owned timeline/assembly projection contracts;
- later production relationships/provenance and downstream materialization decisions.

### External harness owns

- model/provider selection;
- authentication/billing;
- conversation/session history;
- planning/reasoning/tool-loop behavior;
- model-specific retries, streaming, and context management.

Harness state is disposable from Salai's point of view. A new harness session continues by reading current Salai project state.

### Timeline/rendering infrastructure owns

Only replaceable mechanics such as:

- ruler/playhead/drag/resize rendering;
- viewport calculations;
- engine tracks/clips used for playback;
- frame playback/rendering;
- decode/cache/runtime state.

Third-party editor documents and renderer projects do not own Salai persistence or semantic meaning.

## Canonical state

### Narrative IR

```text
Script
  Section
    Scene?
      Beat
        Cue
          ContentBlock
```

Narrative IR owns stable identity, hierarchy/order, authored/source-backed content, Cue duration inputs, and explicit relationships.

Current relevant facts for 0E:

- Cue contains ordered `visualBlockIds[]` and `audioBlockIds[]`;
- ordinary ContentBlocks do not have independent narrative-time offsets/durations;
- SourceExcerpt owns source in/out evidence ranges;
- parent ordering arrays are canonical sequence order;
- `create*`, `update*`, `move*`, `moveBlock`, `splitBeat`, `mergeBeats`, delete operations, and `trimSourceExcerpt` already exist.

0E must expose this power before introducing a new clip/editorial domain model.

### Projection

A deterministic view of Salai-owned state. Outline, AV Script, Paper/Radio Edit, and the semantic timeline are projections. Projection edits must resolve to Salai-owned operations; projections own no independent story truth.

### Workspace / interaction state

Human organization or presentation state that is not inherent to narrative meaning.

Validated/projected examples include:

- Story Wall x/y placement and parking;
- timeline viewport;
- hierarchy expansion/collapse;
- selection/multi-selection;
- playhead/transport state;
- temporary filters/overlays.

These must not silently become Narrative IR.

### Narrative Lens

A creative interaction role implemented from Projection and/or Workspace state. Existing lens semantics remain valid evidence, but final top-level UI taxonomy is not an architecture concern.

### Structural assembly projection

A derived temporal representation sufficient to play the current story.

The 0D spike validated that this representation can be regenerated from Salai canonical state and used by timeline/playback adapters without becoming authoritative.

## Sequential temporal model

Until evidence explicitly changes the domain, structural editorial follows Narrative IR sequence semantics:

- Cue is the canonical narrative-time interval;
- Beat/Scene/Section/Script duration is derived from ordered descendants;
- `Cue.explicitDurationMs` overrides estimated Cue duration when present;
- reordering semantic objects changes derived sequence time and later starts ripple;
- changing Cue duration changes later derived starts;
- there is no canonical arbitrary absolute clip offset, overwrite mode, or free-positioned gap in 0E;
- ordinary ContentBlocks share their Cue interval rather than acquiring hidden engine-owned offsets.

If 0E human evidence demonstrates that independent within-Cue timing is essential, change the Salai domain explicitly rather than persisting timeline-engine coordinates.

## Direct interaction boundary

The human timeline is an intent/gesture client of `SalaiProjectService`, just like the external harness is a machine client.

```text
human gesture / inspector edit
          ↓
Salai interaction interpretation
          ↓
NarrativeOperation or atomic NarrativeOperation[]
          ↓
SalaiProjectService
          ↓
canonical project publish
          ↓
re-project timeline + playback
```

Examples already representable:

```text
edit Beat fields        → updateBeat
edit Cue duration       → updateCue
create Cue              → createCue
move Cue                → moveCue
move ContentBlock       → moveBlock
trim source I/O         → trimSourceExcerpt
split Beat              → splitBeat
merge Beats             → mergeBeats
multi-edit               → atomic operation batch
seek / zoom / selection → interaction state only
```

Unsupported engine changes are disabled/reverted rather than becoming shadow state.

Unresolved Cue split, SourceExcerpt split, and independent within-Cue timing belong to RFC 0003 until explicitly resolved.

## `SalaiProjectService`

The stable application boundary sits over current Narrative IR and Workspace state. Current implementation is the existing `SalaiController`; do not introduce another state owner merely to satisfy the product-level name.

Minimum responsibilities:

- return task-relevant current project context;
- apply one canonical operation or atomic batch;
- publish current project/Workspace changes to UI clients;
- provide derived timing/assembly context without exposing third-party engine internals;
- keep direct human editing and external harness edits coherent over one project.

`@salai/script-model` provides `applyOperation()` and `applyOperations()`. One user/harness action that resolves to several operations publishes only after the whole batch succeeds.

## Higher-level authoring commands

Use public `NarrativeOperation[]` when existing stable IDs make them practical.

A higher-level command is justified only by a real scenario requiring Salai-owned resolution such as new-ID allocation, relative placement, or user-facing reference resolution. It must compile immediately to public canonical operations and remain transient.

The same principle applies to temporal interactions: editor gestures compile to Salai operations rather than mutating renderer state directly.

## External machine interface

The validated first interface is CLI-oriented and currently sufficient for useful external-agent interaction.

The machine interface is a transport/client of `SalaiProjectService`, not a second domain API or storage path.

Add MCP or another protocol only if a later real integration requires it. A Skill may describe how a harness should inspect/mutate/verify Salai; the Skill is instruction, not project state.

## Local bridge

The current prototype keeps project state in the browser. An external process therefore uses the minimal local request/response bridge to reach that same live service.

For current spikes:

- browser `SalaiController` remains authoritative;
- bridge carries commands/results only;
- bridge stores no project;
- one active local browser client is sufficient;
- bind locally by default;
- no CRDT, replicated state, event sourcing, or distributed locking.

## Timeline/playback adapters

0D validated two replaceable dependencies:

### `@moritzbrantner/timeline-editor`

Role: controlled React timeline interaction mechanics.

Salai owns the semantic timeline projection supplied to it. Timeline-editor document/history/serialization helpers are not project persistence.

0E may replace or wrap its visual structure if the hierarchical interaction contract cannot be expressed cleanly, but replacement must not change Salai semantics.

### `@elah/core`

Role: playback/materialization adapter.

Salai derives Elah state from the current structural assembly. Elah state can be discarded/rebuilt.

Do not add parallel media stacks merely for convenience; introduce a direct lower-level media dependency only when a concrete capability requires it.

## Grouped action and revert

```text
one harness request or grouped human action
      ↓
NarrativeOperation[]
      ↓
SalaiProjectService / applyOperations()
      ↓
one canonical publish
```

Keep immediate one-step revert semantics while no later canonical/Workspace edit has occurred. Do not introduce event sourcing or inverse-operation architecture without a later validated requirement.

## Source/media boundary

Machine context is task-relevant, not an implicit dump of local production material.

- raw media stays local unless explicitly exposed/exported;
- SourceExcerpt wording/ranges remain source evidence;
- playback honors canonical source ranges;
- source I/O changes use `trimSourceExcerpt`;
- external harness decides what provider receives requested context outside Salai project state;
- Salai never stores harness credentials/provider sessions in project state.

## Runtime topology

### Current prototype / Spike 0E

```text
external harness
      ↓ shell
Salai machine interface
      ↓ local request/response bridge
React/Vite Salai prototype
      ↓
SalaiProjectService / SalaiController
      ↓
Narrative IR + Workspace/interaction state
      ↓
semantic timeline / assembly projections
      ├── timeline adapter
      └── Elah playback/materialization
```

There is no embedded provider runtime, Salai chat runtime, Resolve runtime dependency, or second canonical timeline model.

### Broader product direction

Salai remains local-first. A future desktop shell can host the same project service, media access, structural editor, playback adapters, and machine interface without changing Narrative IR semantics.

## Persistence

Validated today:

- Narrative IR serialization exists;
- Story Wall Workspace semantics are currently in memory;
- timeline/rendering state is derived;
- grouped-action history is intentionally limited;
- harness conversation history is not required project persistence.

Durable persistence comes after the structural-editorial interaction passes human validation. Persist only Salai-owned state needed to reconstruct semantic views and structural assembly.

## Downstream NLE/interchange boundary

Specialist NLEs are optional downstream targets.

```text
Salai canonical state
       ↓
structural assembly / materialization decision
       ↓
interchange or Salai-owned NLE adapter
       ↓
Resolve / other specialist NLE
```

Agent instructions and direct temporal edits change Salai state first; they do not become arbitrary downstream NLE mutations.

When Resolve automation is used, ADR 0004 remains the accepted CutMaster boundary.

## Current 0E architecture guard

0E may deepen direct interaction but must not add by default:

- a second canonical editorial/timeline document;
- free-positioned generic clip state;
- independent ordinary ContentBlock offsets/durations;
- Production Graph;
- Story Spine canvas;
- Resolve execution/interchange;
- GenAI execution;
- production persistence/desktop migration;
- advanced NLE feature systems;
- CRDT/event sourcing;
- another agent runtime/protocol.

Any domain expansion needed for a meaningful 0E task must be surfaced as an explicit decision rather than hidden inside the timeline adapter.
