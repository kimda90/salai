# Salai System Architecture

## Status

Living System Architecture Document (SAD).

This document owns current system-level boundaries, runtime topology, component responsibilities, persistence ownership, and integration direction. It does **not** own Narrative IR field semantics or the canonical operation vocabulary; those are authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md).

Current interaction contracts are [`agent-mediated-authoring.md`](agent-mediated-authoring.md) and [`narrative-lenses.md`](narrative-lenses.md).

Current human/machine application boundary: [`adr/0007-project-service-is-the-human-machine-boundary.md`](adr/0007-project-service-is-the-human-machine-boundary.md).

## Architectural thesis

Salai owns narrative and production context around a video while reusing mature infrastructure for model inference, UI mechanics, media processing, generation, interchange, and Resolve automation.

The product/domain shape is:

```text
creative input
text / instructions / attachment handles
          ↓
Salai interpretation / normalization
          ↓
SalaiProjectService
          ↓
NarrativeOperation[]
(or the minimum scenario-specific command adapter)
          ↓
@salai/script-model
          ↓
canonical Narrative IR
      ↙       ↓       ↘
Projections  Workspaces  production context
      ↘       ↓       ↙
       Narrative Lenses
              ↓
editorial materialization
              ↓
DaVinci Resolve
```

Human UI and machine integrations are clients of the same Salai-owned application boundary. Model/provider/runtime choices are replaceable adapters, not product state.

Core interaction rule:

> **Hide structural bookkeeping, not narrative structure.**

# Ownership

## Salai owns

- Narrative IR and stable narrative identity;
- authored vs source-backed semantics;
- canonical operation semantics;
- the application/project service that mediates project reads and writes;
- interpretation/normalization policy;
- any minimal authoring commands proven necessary by real scenarios;
- grouped action/immediate-revert semantics;
- Narrative Lens semantics and Projection/Workspace ownership;
- ShotIntent and narrative/media relationships when the production graph is introduced;
- source-evidence rules;
- alternatives/version behavior when justified;
- narrative-to-editorial materialization decisions;
- generated/captured asset provenance;
- the Resolve adapter boundary.

## Commodity infrastructure may provide

- model inference;
- provider/account authentication;
- generic agent harness/session behavior;
- UI primitives, dragging, tables, docking, virtualization;
- media probing/transcoding/thumbnail/waveform extraction;
- transcription/alignment/scene detection;
- editorial interchange;
- Resolve automation plumbing;
- local model execution;
- generation execution.

A model provider, agent harness, UI framework, or Resolve automation library must not own Salai's canonical project semantics.

# Canonical state layers

## 1. Narrative IR

Canonical semantic narrative state:

```text
Script
  Section
    Scene?
      Beat
        Cue
          ContentBlock
```

It owns stable identity, hierarchy/order, authored/source-backed content, runtime inputs, and explicit relationships defined by the current spec.

The accepted architectural decision that multiple views share one Narrative IR is recorded in [`adr/0005-one-narrative-ir-multiple-views.md`](adr/0005-one-narrative-ir-multiple-views.md).

## 2. Projection

A Projection is deterministically derived from canonical state and owns no independent narrative truth.

Existing examples include Outline, AV Script, and Paper/Radio Edit.

Editing a Projection produces canonical operations through the application boundary.

## 3. Workspace

A Workspace stores meaningful human organization that is not inherent to the narrative itself.

Validated example:

- Story Wall x/y placement and parking state around canonical Scene/Beat references.

Workspace metadata must not silently redefine canonical narrative order or meaning.

## 4. Narrative Lens

Narrative Lens describes a **creative role**, not a separate persistence layer.

A lens may be implemented by a Projection, Workspace, or combination. Its detailed product/UX contract lives in [`narrative-lenses.md`](narrative-lenses.md).

## 5. Production context

The future production graph owns objects/relationships such as:

- ShotIntent;
- Asset;
- MediaSegment;
- realizations/alternatives;
- provenance;
- Resolve bindings.

Do not pull the full production graph into Spike 0C merely to answer mocked missing-coverage questions.

# SalaiProjectService boundary

The stable application boundary is a Salai-owned project service over the current Narrative IR and Workspace state.

Its minimum responsibilities are:

- provide task-relevant project context to a client;
- apply validated canonical changes;
- publish project/Workspace changes to interested local clients.

Conceptually:

```ts
interface SalaiProjectService {
  getContext(request: ContextRequest): ProjectContext;
  applyOperations(
    operations: NarrativeOperation[],
    options?: { expectedRevision?: number; origin?: "agent" | "lens" | "system" },
  ): OperationResult;
  subscribe(listener: (change: ProjectChange) => void): () => void;
}
```

The exact TypeScript API may evolve during implementation. The ownership rules do not:

- the service is a facade over existing model/controller behavior, not another domain model;
- Narrative IR/Workspace remain authoritative;
- lenses and machine clients use the same mutation path;
- clients do not write persistence directly;
- clients do not maintain shadow narrative truth;
- provider/runtime-specific types stay outside the domain/application layer.

## Reuse the existing operation API

`@salai/script-model` already exposes:

- `applyOperation()`;
- `applyOperations()`.

`applyOperations()` remains the model-level primitive for one request that resolves to several canonical operations. The project service/controller publishes only after the full call succeeds.

Do **not** add a second persistent batch engine or agent-specific project model.

## Higher-level authoring commands are conditional

Start with public `NarrativeOperation[]` where existing stable IDs make that practical.

Introduce a higher-level Salai command only for a concrete scenario that requires Salai-owned resolution, such as:

- new-ID allocation;
- relative placement;
- user-facing reference resolution;
- avoiding raw `ParentRef` or array-index manufacture by a model/client.

Any such command compiles immediately to public canonical operations and remains a transient adapter.

# Human and machine clients

Narrative Lenses, embedded model integrations, and future machine interfaces are all clients of `SalaiProjectService`.

```text
                 SalaiProjectService
                ↗        ↑         ↖
               /         |          \
      Narrative Lenses  embedded AI  machine adapter
             ↑                           ↑
           human                    external harness
```

A Skill, if provided later, teaches a generic agent how to use the machine interface. It is instructions, not capability/state implementation.

An external machine interface may later be CLI, MCP, or another narrow protocol. It must reuse the same project service rather than creating a separate project API or storage path.

# Agent/model state boundary

Model/provider state is not Salai project state.

Keep these layers explicit:

```text
model / harness state
session / auth / history / plan / tool trace
        ↓ disposable context

Salai interaction state
current request / selected context / proposed result
        ↓ transient

Salai project state
Narrative IR / Workspace / source relationships
        ↓ canonical
```

A new model session or different machine client must be able to continue from current task-relevant Salai state. Conversation history may help interaction continuity but cannot be required to reconstruct the project.

# Change propagation and concurrency

0C is a local single-user validation spike. It does not require CRDTs, event sourcing, distributed locks, or a replicated state framework.

Use one serialized mutation boundary. Local clients subscribe to project changes and read the current canonical state/projections.

A monotonically increasing project revision may be added when needed:

```text
client reads revision 41
human edit publishes revision 42
client submits expectedRevision: 41
→ stale revision failure
→ refetch current context
```

Do not build revision conflict machinery beyond the first concrete need.

# Grouped action / history boundary

For Spike 0C:

```text
one user request
      ↓
NarrativeOperation[]
      ↓
SalaiProjectService / applyOperations()
      ↓
one canonical publish
```

Keep the pre-action project/Workspace snapshots and allow immediate one-step revert **only while no later canonical or Workspace edit has occurred**. Any subsequent machine or direct-lens change clears/invalidates that snapshot.

This deliberately avoids reverting an old snapshot over newer manual work. A unified long-lived undo/history model is deferred until evidence requires it.

Do not introduce event sourcing or general inverse-operation generation for 0C.

# Local-first and provider data egress

Salai is local-first. A hosted model/provider does not receive implicit access to local production media or the entire project.

Rules:

- raw camera/media originals remain local by default;
- an attachment handle is a local/project reference, not authorization to upload the underlying file;
- hosted inference receives only the text, derived metadata, thumbnails/transcript excerpts, or project subset explicitly required for the current request;
- sending raw media or materially broader project context to a hosted provider requires an explicit product/user boundary;
- local providers may process local files without cloud egress, but context should still be task-relevant rather than indiscriminate;
- provider choice must not change Narrative IR, source, operation, or provenance semantics.

Credentials/authentication are adapter infrastructure, not project state.

This is an architecture boundary, not a requirement to build a full privacy subsystem in 0C.

# Runtime topology

## Spike 0C hosted validation topology

The primary 0C demo remains the existing static React/Vite application published with GitHub Pages.

```text
GitHub Pages
     ↓
React / Vite Salai UI
     ↓
SalaiProjectService
     ↙             ↘
Narrative Lenses   browser model adapter
                       ↓
                hosted inference
```

The browser model integration must be safe for a public static client. Do not embed a reusable developer API secret in the bundle. Model/provider selection is an adapter decision and does not affect canonical project semantics.

CI uses deterministic model-result fixtures/mocks and must not depend on network/model availability.

No Salai-operated backend, local agent host, durable chat service, or desktop shell is required for 0C.

## Broader application direction

The accepted broader runtime direction remains local-first desktop:

```text
Electron / React renderer
      ↕ narrow preload / local API
local application/service processes
      ↕
filesystem · media tools · model runtimes · Resolve
```

See [`adr/0002-local-first-desktop-runtime.md`](adr/0002-local-first-desktop-runtime.md).

A later desktop process can expose `SalaiProjectService` to local machine clients when that workflow is validated. Do not pull that bridge into 0C merely to support an external agent proof.

# Persistence boundary

Validated state today:

- Narrative IR serialization exists;
- minimum Story Wall Workspace semantics are validated in memory;
- 0C grouped-action behavior is intentionally in-memory;
- model/harness history is not required Salai persistence.

Durable persistence comes after 0C and should include only state whose product role is validated:

- Narrative IR;
- production graph when introduced;
- justified Workspace state;
- Resolve bindings/annotations;
- action/history metadata required for recovery/audit;
- a durable WorkingDocument/session artifact only if evidence proves it is real product state.

Narrative Lenses should derive from canonical/Workspace state rather than storing duplicate narratives.

SQLite remains the default local persistence direction unless measured requirements justify otherwise.

# Resolve boundary

DaVinci Resolve remains the editing/finishing environment.

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

Free-form/model interaction must not turn directly into arbitrary Resolve mutations.

See [`adr/0001-resolve-remains-the-nle.md`](adr/0001-resolve-remains-the-nle.md) and [`adr/0004-cutmaster-default-resolve-boundary.md`](adr/0004-cutmaster-default-resolve-boundary.md).

# Integration direction

## Browser model adapter

Spike 0C needs one minimal browser-safe hosted-model adapter for the public demo. It receives task-relevant context and returns a Salai-owned structured result. It is not a canonical service and may be replaced without changing project/lens code.

## External machine interfaces

CLI/MCP/Skill integration is a later or optional proof over `SalaiProjectService`. Do not build both CLI and MCP in 0C. Do not make external-agent support part of the 0C gate unless product validation explicitly changes.

## OpenTimelineIO

Use where useful for editorial interchange/materialization. It does not replace Narrative IR or carry all Workspace/agent/lens semantics.

## OpenAssetIO

Conditional. Add only when external asset resolution/publishing creates a concrete validated need.

## FFmpeg / ffprobe

Commodity local media utilities for probing, extraction, proxy/transcode work, and similar operations.

## Transcription / reverse scripting

Prefer established components when real analysis is introduced. Convert their output into Salai-owned MediaSegment/SourceExcerpt semantics.

0C uses fixture/mock metadata instead of a real-media analysis stack.

## Generation

Generation providers remain process/API boundaries. Generated output becomes an ordinary production asset with provenance rather than creating a parallel GenAI workflow model.

# Technology baseline

## Spike 0A

- TypeScript;
- Vitest;
- `packages/script-model/`.

## Spike 0B retained foundation

- React;
- TypeScript;
- Vite;
- Pragmatic Drag and Drop;
- deterministic Vitest coverage;
- GitHub Pages prototype.

## Spike 0C minimum addition

- `SalaiProjectService` facade over current controller/model behavior;
- controller batch dispatch using `applyOperations()`;
- deterministic model-result fixtures/mocks for CI;
- one browser-safe hosted-model adapter for the public demo;
- simple text/instruction/attachment UI;
- in-memory immediate last-action revert;
- project change subscription/re-render through existing application state;
- existing Narrative Lenses.

No Salai backend, general provider framework, custom OAuth/key vault, durable chat infrastructure, external-agent bridge, or general agent framework is required.

# Architecture questions for Spike 0C

Only questions that can change near-term architecture belong here:

- Can public `NarrativeOperation[]` cover most revision scenarios directly?
- Which concrete creation/reference cases, if any, justify a higher-level command adapter?
- What is the minimum `SalaiProjectService` API required by both lenses and the embedded model flow?
- Is a project revision needed during 0C, or is serialized local mutation enough?
- What constitutes one understandable agent/model action beyond the immediate-revert spike boundary?
- Does working text need durable identity after human testing?
- What attachment-derived context is sufficient before real media analysis?
- Does active-lens identity materially improve interpretation without dragging UI state into the model contract?
- Does messy agent-mediated input expose a real Narrative IR semantic gap?

Narrative IR questions belong in [`narrative-ir-spec.md`](narrative-ir-spec.md). Interaction behavior belongs in [`agent-mediated-authoring.md`](agent-mediated-authoring.md) and [`narrative-lenses.md`](narrative-lenses.md). The current human/machine boundary decision is ADR 0007.