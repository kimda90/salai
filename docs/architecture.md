# Salai System Architecture

## Status

Living system architecture. Narrative IR field semantics and canonical operations are authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md). Current human/machine runtime decision: [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md). Current product/editorial boundary: [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md).

## Architectural thesis

Salai owns narrative/project semantics **and structural editorial decisions**. External harnesses own model execution. Timeline/rendering engines and specialist NLEs are replaceable downstream infrastructure, not project truth.

```text
human UI / semantic timeline          external harness
            │                              │
            │                         Salai CLI
            │                              │
            └──────────┬───────────────────┘
                       ↓
              SalaiProjectService
                       ↓
               NarrativeOperation[]
                       ↓
                Narrative IR
                       ↓
             timeline/assembly projection
                       ↓
             playback/materialization
                       ↓
          optional downstream NLE handoff
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
- Narrative Lens Projection/Workspace semantics that remain useful;
- semantic timeline meaning and structural-editorial operations;
- Salai-owned timeline/assembly projection contracts;
- later production relationships/provenance and downstream materialization decisions.

### External harness owns

- model/provider selection;
- authentication and billing/account behavior;
- conversation/session history;
- planning/reasoning/tool-loop behavior;
- model-specific retries, streaming, and context-management policy.

Harness state is disposable from Salai's point of view. A new harness session must be able to continue by reading current Salai project state.

### Timeline/rendering infrastructure owns

Only replaceable implementation mechanics such as:

- ruler/playhead/drag/resize rendering;
- resolved engine tracks/clips;
- frame playback/rendering;
- engine-specific decode/cache/runtime state.

Third-party timeline/editor formats do not own Salai persistence or semantics.

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

Narrative IR owns stable identity, hierarchy/order, authored/source-backed content, runtime inputs, and explicit relationships.

The current 0D spike intentionally does **not** expand the IR merely because a timeline library has additional concepts. New production/editorial identity is introduced only when a concrete workflow proves that existing stable IDs/relationships cannot represent the necessary meaning.

### Projection

A deterministic view of Salai-owned state. Outline, AV Script, Paper/Radio Edit, and the 0D semantic timeline projection are examples. Projection edits must resolve to Salai-owned operations; projections own no separate story truth.

### Workspace

Human organization that is not inherent to narrative meaning. Current validated example: Story Wall x/y placement and parking state for canonical Scene/Beat references.

### Narrative Lens

A creative interaction role implemented from Projection and/or Workspace state. Existing lens semantics remain useful evidence, but the final top-level UI taxonomy is not an architecture concern.

### Structural assembly projection

0D introduces a derived temporal representation sufficient to play the current story.

It may contain renderer/timeline-oriented placement needed to build the viewer output, but its authority comes from Salai canonical/Workspace state. Engine-specific project data can always be regenerated.

## `SalaiProjectService`

The stable application boundary sits over current Narrative IR and Workspace state. Current implementation is the existing `SalaiController`; do not introduce another state owner merely to satisfy the name.

Minimum responsibilities now include:

- return task-relevant current project context;
- apply one canonical operation or an atomic operation batch;
- publish current project/Workspace changes to local UI clients;
- provide enough derived timing/assembly context for the semantic timeline and external harness without exposing third-party engine internals.

`@salai/script-model` already provides `applyOperation()` and `applyOperations()`. One machine request that resolves to several operations uses `applyOperations()` and publishes only after the full batch succeeds.

Do not add an agent-specific or timeline-engine-specific project model.

## Higher-level authoring commands

Use public `NarrativeOperation[]` when existing stable IDs make them practical.

A higher-level command is justified only by a real scenario requiring Salai-owned resolution such as new-ID allocation, relative placement, or user-facing reference resolution. It must compile immediately to public canonical operations and remain transient.

The same principle applies to temporal interactions: a timeline gesture should compile to an existing Salai operation where possible rather than mutating renderer state directly.

## External machine interface

The validated first interface is CLI-oriented.

Current capabilities include project context plus narrow creation/apply commands implemented by the 0C spike. The CLI is a transport/client of `SalaiProjectService`, not a second domain API or storage path.

Add MCP or another protocol only if a later real integration requires it. Spike 0C demonstrated that one narrow interface is sufficient for useful external-agent interaction.

A Skill may describe when/how a generic harness should inspect, mutate, and verify Salai state. The Skill is instructions only; the CLI/project service provide capability.

## Local bridge

The current prototype keeps project state in the browser. An external process therefore uses the existing minimal local request/response bridge to reach that same live project service.

For current spikes:

- the browser's `SalaiController` remains authoritative;
- the bridge carries commands/results only and stores no narrative project;
- one active local browser client is enough;
- bind locally by default;
- no CRDT, replicated state, event sourcing, or distributed locking.

The bridge exists because two processes need to communicate; it does not turn Salai into an agent backend.

## Spike 0D timeline/playback adapters

0D uses two replaceable dependencies to retire commodity interaction/media risk quickly.

### `@moritzbrantner/timeline-editor`

Role: controlled React timeline interaction.

Salai owns the timeline projection supplied to it. Timeline-editor document/history/serialization helpers are not Salai persistence.

### `@elah/core`

Role: first playback/materialization adapter.

Salai derives an Elah project/assembly representation from current Salai state. Elah state can be thrown away and rebuilt.

Do not add a direct Mediabunny dependency during 0D unless Elah cannot expose a required capability. Avoid parallel media stacks before evidence requires them.

## Change ordering

Current spikes are local/single-user. Serialize mutations through the project service. Add a project revision only if a real stale-write case appears.

## Grouped action and revert

```text
one harness request or grouped temporal action
      ↓
NarrativeOperation[]
      ↓
SalaiProjectService / applyOperations()
      ↓
one canonical publish
```

Keep pre-action project/Workspace snapshots for immediate one-step revert only while no later canonical or Workspace edit has occurred. Do not introduce general event sourcing or inverse-operation generation without a later versioning/recovery requirement.

## Source/media boundary

Machine context is task-relevant, not an implicit dump of local production material.

- raw media stays local unless an explicit operation exposes/exports it;
- attachment/reference identity is not permission to upload media;
- SourceExcerpt wording/ranges remain source evidence;
- playback must honor canonical source ranges;
- the external harness decides what model/provider receives the context it requested, outside Salai project state;
- Salai never stores harness credentials/provider sessions as project state.

## Runtime topology

### Spike 0D

```text
external harness
      ↓ shell
Salai CLI
      ↓ local request/response transport
React/Vite Salai prototype
      ↓
SalaiProjectService / SalaiController
      ↓
Narrative IR + Workspace
      ↓
semantic timeline projection
      ├── @moritzbrantner/timeline-editor
      └── @elah/core playback/materialization
```

There is no embedded model provider, Salai chat runtime, provider authentication layer, model router, or Resolve runtime dependency in the spike.

### Broader product direction

Salai remains local-first. A future desktop shell can host the same project service, media access, timeline/playback adapters, and machine interface without changing Narrative IR semantics.

```text
Desktop / React renderer
      ↕ local application boundary
Narrative IR · structural editorial · media tools · machine interface
      ↓ optional interchange/materialization
specialist NLEs / finishing systems
```

See [`adr/0002-local-first-desktop-runtime.md`](adr/0002-local-first-desktop-runtime.md).

## Persistence

Validated today:

- Narrative IR serialization exists;
- Story Wall Workspace semantics are currently in memory;
- grouped-action history is intentionally limited;
- harness/model conversation history is not required persistence.

0D timeline/rendering state remains derived and should not be persisted merely because a third-party package can serialize it.

Durable persistence comes after 0D and should include only validated Salai-owned product state needed to reconstruct semantic views and structural assembly. SQLite remains the default local persistence direction unless measured needs justify otherwise.

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

Agent/harness instructions and direct temporal edits change Salai state first; they do not become arbitrary NLE mutations.

When Resolve automation is used, ADR 0004 remains the accepted default CutMaster boundary.

## Spike 0D minimum additions

- deterministic audiovisual fixture;
- Salai-owned semantic timeline projection;
- `@moritzbrantner/timeline-editor` adapter;
- `@elah/core` playback/materialization adapter;
- playable rough assembly;
- direct Beat/Cue reorder and SourceExcerpt trim through canonical operations;
- existing external-agent ↔ direct temporal round trip;
- human validation of semantic value in time.

Not part of 0D: full production graph, real media-analysis pipeline, Story Spine canvas, Resolve execution, OTIO interchange, GenAI execution, production proxy/cache system, advanced NLE features, CRDT/event sourcing, or a general plugin framework.
