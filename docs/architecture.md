# Salai System Architecture

## Status

Living system architecture. Narrative IR field semantics and canonical operations are authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md). Current human/machine runtime decision: [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md).

## Architectural thesis

Salai owns narrative/production semantics and exposes them through one application boundary. Existing agent harnesses own model execution.

```text
human UI / Narrative Lenses          external harness
            │                              │
            │                         Salai CLI
            │                              │
            └──────────┬───────────────────┘
                       ↓
              SalaiProjectService
                       ↓
               NarrativeOperation[]
                       ↓
                applyOperations()
                       ↓
                 Narrative IR
                       ↓
              Resolve materialization
```

Core rules:

> **One Narrative IR, multiple human and machine interfaces.**

> **Hide structural bookkeeping, not narrative structure.**

## Ownership

### Salai owns

- Narrative IR and stable narrative identity;
- authored vs source-backed semantics;
- canonical operation semantics and validation;
- `SalaiProjectService` reads/writes/subscriptions;
- minimum scenario-proven authoring commands that compile to canonical operations;
- grouped-action and immediate-revert behavior;
- Narrative Lens Projection/Workspace semantics;
- later production relationships/provenance and Resolve materialization decisions.

### External harness owns

- model/provider selection;
- authentication and billing/account behavior;
- conversation/session history;
- planning/reasoning/tool-loop behavior;
- model-specific retries, streaming, and context-management policy.

Harness state is disposable from Salai's point of view. A new harness session must be able to continue by reading current Salai project state.

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

### Projection

A deterministic view of canonical state. Outline, AV Script, and Paper/Radio Edit are current examples. Projection edits produce canonical operations; projections own no separate story truth.

### Workspace

Human organization that is not inherent to narrative meaning. Current validated example: Story Wall x/y placement and parking state for canonical Scene/Beat references.

### Narrative Lens

A creative interaction role implemented from Projection and/or Workspace state. It is not a persistence layer.

## `SalaiProjectService`

The stable application boundary sits over current Narrative IR and Workspace state. Current implementation is the existing `SalaiController`; do not introduce another state owner merely to satisfy the name.

Minimum responsibilities:

- return task-relevant current project context;
- apply one canonical operation or an atomic operation batch;
- publish current project/Workspace changes to local UI clients.

`@salai/script-model` already provides `applyOperation()` and `applyOperations()`. One machine request that resolves to several operations uses `applyOperations()` and publishes only after the full batch succeeds.

Do not add an agent-specific project model or batch engine.

## Higher-level authoring commands

Use public `NarrativeOperation[]` when existing stable IDs make them practical.

A higher-level command is justified only by a real scenario requiring Salai-owned resolution such as new-ID allocation, relative placement, or user-facing reference resolution. It must compile immediately to public canonical operations and remain transient.

## External machine interface

Spike 0C exposes one CLI-oriented machine interface first.

Required capabilities:

```text
salai context
salai apply <NarrativeOperation[]>
```

The CLI is a transport/client of `SalaiProjectService`, not a second domain API or storage path. Add MCP only if a later validated workflow requires it.

A Skill may describe when/how a generic harness should inspect, mutate, and verify Salai state. The Skill is instructions only; the CLI/project service provide capability.

## Local bridge

The current prototype keeps project state in the browser. An external process therefore needs a minimal local request/response bridge to reach that same live project service.

For 0C:

- the browser's `SalaiController` remains authoritative;
- the bridge carries commands/results only and stores no narrative project;
- one active local browser client is enough;
- bind locally by default;
- prefer Node/browser built-ins before adding a transport dependency;
- no CRDT, replicated state, event sourcing, or distributed locking.

The bridge exists because two processes need to communicate; it does not turn Salai into an agent backend.

## Change ordering

0C is local/single-user. Serialize mutations through the project service. Add a project revision only if a real stale-write case appears.

## Grouped action and revert

```text
one harness request
      ↓
NarrativeOperation[]
      ↓
SalaiProjectService / applyOperations()
      ↓
one canonical publish
```

Keep pre-action project/Workspace snapshots for immediate one-step revert only while no later canonical or Workspace edit has occurred. Any later machine or direct-lens edit invalidates the snapshot. Do not introduce general event sourcing or inverse-operation generation for 0C.

## Source/media boundary

Machine context is task-relevant, not an implicit dump of local production material.

- raw media stays local unless a later explicit operation exposes/exports it;
- attachment/reference identity is not permission to upload media;
- SourceExcerpt wording/ranges remain source evidence;
- the external harness decides what model/provider receives the context it requested, outside Salai project state;
- Salai never stores harness credentials/provider sessions as project state.

## Runtime topology

### Spike 0C

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
Narrative Lenses
```

There is no embedded model provider, Salai chat runtime, provider authentication layer, or model router.

### Broader product direction

Salai remains local-first. A future desktop shell can host the same project service and expose the same machine interface without changing Narrative IR or lens semantics.

```text
Electron / React renderer
      ↕ local application boundary
Narrative IR · media tools · machine interface · Resolve adapter
```

See [`adr/0002-local-first-desktop-runtime.md`](adr/0002-local-first-desktop-runtime.md).

## Persistence

Validated today:

- Narrative IR serialization exists;
- Story Wall Workspace semantics are currently in memory;
- 0C grouped-action history is intentionally in memory;
- harness/model conversation history is not required persistence.

Durable persistence comes after 0C and should include only validated product state. Narrative Lenses derive from canonical/Workspace state rather than storing duplicate narratives. SQLite remains the default local persistence direction unless measured needs justify otherwise.

## Resolve boundary

Resolve remains the editing/finishing environment.

```text
Salai canonical state
       ↓
materialization decision
       ↓
Salai Resolve adapter
       ↓
CutMaster by default
       ↓
DaVinci Resolve
```

Agent/harness instructions change Salai state first; they do not become arbitrary Resolve mutations.

## Spike 0C minimum additions

- existing `SalaiProjectService`/controller batch boundary;
- one CLI-oriented machine command surface;
- the smallest local bridge required to reach the live browser-owned project service;
- one script-first scenario;
- one fixture-backed source scenario;
- immediate last-machine-action revert;
- existing Narrative Lenses and deterministic tests.

Not part of 0C: model/provider SDKs, provider auth/key management, embedded chat/agent runtime, MCP in addition to CLI, durable harness history, production graph, real media intelligence, Resolve execution, CRDT/event sourcing, or a general plugin framework.
