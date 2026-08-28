# Salai System Architecture

## Status

Living System Architecture Document (SAD).

This document owns system-level boundaries, runtime topology, component responsibilities, persistence ownership, and staged infrastructure direction. It does **not** own Narrative IR field-level semantics or the operation vocabulary; those are authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md).

Product terminology is centralized in [`glossary.md`](glossary.md). The active interaction contracts are [`agent-mediated-authoring.md`](agent-mediated-authoring.md) and [`narrative-lenses.md`](narrative-lenses.md). The completed 0B structured-authoring contract remains in [`authoring-ux-spec.md`](authoring-ux-spec.md) as historical evidence.

## Architectural thesis

Salai owns the narrative and production context around a video while reusing mature infrastructure for model inference, interaction mechanics, editing automation, media processing, interchange, and generation.

The current product-specific shape is:

```text
messy creative input
text / conversation / media
          ↕
Agent / Normalization layer
          ↕
typed Salai authoring commands
          ↕
canonical Narrative IR + production context
          ↕
Narrative Lenses
          ↕
source evidence / ShotIntent / assets
          ↕
editorial materialization
          ↕
DaVinci Resolve
```

The user does not need to manipulate every level directly.

The architecture should support two complementary interaction modes:

- **agent-mediated authoring** — reduces incidental structural work; and
- **Narrative Lenses** — deliberately expose useful structure for perception and direct manipulation.

Core UX/architecture rule:

> **Hide structural bookkeeping, not narrative structure.**

DaVinci Resolve remains the downstream NLE and finishing environment.

## Reuse principle

Salai should own product semantics and reuse commodity infrastructure for mechanics.

### Salai owns

- Narrative IR and stable narrative identity;
- agent interpretation/normalization semantics;
- Salai-owned authoring command schemas;
- compilation from agent commands to public canonical operations;
- canonical ID allocation/reference resolution;
- Narrative Lens semantics and projection/workspace mapping;
- Workspace semantics;
- grouped change/history and graduated-autonomy rules;
- ShotIntent and narrative/media relationships;
- source-evidence semantics;
- alternatives/rejection/version behavior;
- narrative-to-editorial materialization decisions;
- generated/captured asset provenance.

### Commodity infrastructure may provide

- UI primitives, dragging, virtualization, tables, docking;
- model inference / structured tool calling;
- media probing/transcoding/thumbnail extraction;
- waveform/media preview;
- transcription/alignment/scene detection;
- editorial interchange;
- Resolve automation plumbing;
- local model execution;
- generation execution.

A third-party model, editor framework, or agent framework must not own Salai's canonical project semantics.

# High-level system shape

```text
                                SALAI

                  Free-form Authoring Surface
                text · conversation · attachments
                               │
                        Agent / Normalizer
                               │
                    Salai authoring commands
                               │
                  typed operation batches
                               │
                         Narrative IR
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
   Narrative Lenses        Workspaces          Production Graph
 Outline / AV / Paper      Story Wall         ShotIntent / Assets
 Coverage / Teleprompt     future boards      MediaSegments / links
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
                     Local project state
                               │
               ┌───────────────┴───────────────┐
               │                               │
           Editorial                       Generation
               │                               │
        OpenTimelineIO                     ComfyUI /
               │                          hosted APIs
               └───────────────┬───────────────┘
                               │
                     Salai Resolve adapter
                               │
                           CutMaster
                               │
                        DaVinci Resolve
```

# Canonical and interaction layers

## 1. Free-form interaction / agent-normalization layer

Owns the mapping from low-structure user input into explicit project changes.

Inputs may include:

- free-form working text;
- conversational instructions/questions;
- attachments/media context;
- current canonical project state;
- active Narrative Lens identity/context where useful;
- later Resolve/current-production context where appropriate.

The model returns typed Salai authoring commands. Salai code then:

1. resolves stable existing references;
2. allocates IDs for newly created canonical objects;
3. compiles commands into public Narrative/Workspace/production operations;
4. validates the complete batch;
5. publishes canonical state once on success.

### Not canonical state

The following are not automatically canonical narrative truth:

- model private reasoning;
- chat transcript;
- arbitrary model prose;
- unprocessed working text;
- transient attachment presentation state;
- agent command plans before validation;
- lens presentation state unless explicitly owned by Workspace.

A later persistence phase may introduce durable working-session/document artifacts if 0C demonstrates they are required, but they do not replace Narrative IR.

### Agent runtime principle

Start with a small Salai-owned tool/structured-output loop. Do not introduce a general agent framework before concrete orchestration needs exist.

Provider choice—hosted, local, OpenAI-compatible, Ollama, `llama.cpp`, etc.—must not change canonical operation semantics.

## 2. Narrative IR

Owns stable semantic narrative identity and authored/source-backed content.

Conceptually:

```text
Script
  Section
    Scene?
      Beat
        Cue
          ContentBlock
```

The authoritative hierarchy, invariants, operation API, serialization contract, and fixtures live in [`narrative-ir-spec.md`](narrative-ir-spec.md).

The agent-mediated direction makes the IR function as an **intermediate representation** between messy creative input and deterministic product behavior.

It is also the structured system that Narrative Lenses make legible to humans.

## 3. Narrative Lens layer

A Narrative Lens is a creative representation over canonical project state.

Examples:

- Outline — hierarchy/proportion;
- Story Wall — spatial rhythm/alternatives;
- AV Script — audiovisual density/realization;
- Paper/Radio Edit — evidence/voice/source pacing;
- Coverage — intent/realization gaps;
- later Frame Wall/Selects — visual alternatives and coverage.

“Lens” describes **creative purpose**, not state ownership.

A lens may use:

- a Projection;
- a Workspace;
- derived indicators;
- a combination of these.

### Lens architecture rules

1. A lens does not become a second canonical document.
2. Agent changes appear automatically through canonical state.
3. Direct lens edits route through the same canonical/Workspace boundaries.
4. Lenses may expose canonical structure when it carries creative information.
5. Lenses should hide incidental mechanics such as raw IDs, parent refs, or array indices.
6. Active-lens identity/context may be supplied to the agent when it materially improves reasoning.
7. Presentation-only state does not leak into Narrative IR semantics.

See [`narrative-lenses.md`](narrative-lenses.md).

## 4. Workspace layer

Owns persistent human organization that should not pollute Narrative IR semantics.

Validated 0B concepts:

```text
Workspace
Board
BoardItem
IdeaCard
```

Current proven Story Wall metadata is intentionally small:

- canonical Beat/Scene reference or IdeaCard;
- x/y position;
- parking state.

Workspace is optional. It should not become the routine mechanism for narrative changes merely because a spatial board can represent them.

### Ownership by phase

- **Spike 0B:** minimum in-memory Story Wall semantics validated.
- **Spike 0C:** reuse Workspace where a Narrative Lens genuinely needs persistent organization; do not expand it to solve free-form authoring.
- **Phase 2:** persist only Workspace state still justified after 0C.

## 5. Production graph

Owns persistent relationships between narrative intent and production/editorial objects.

Representative concepts:

```text
ShotIntent
Asset
MediaSegment
Annotation
ResolveBinding
```

Later concepts are introduced only in the phase that needs them:

```text
alternative/versioned editorial plan  → later editorial phase
GenerationJob / GenerationArtifact    → GenAI phase
Deliverable                           → delivery/product phase
WorkingDocument/session artifact      → only if 0C evidence requires it
```

Plain typed records and conventional persistence are sufficient initially. No graph database is required.

# Narrative and production relationships

Representative relationships:

```text
Beat / Cue ↔ ShotIntent
Cue / ContentBlock ↔ MediaSegment / SourceExcerpt
ShotIntent ↔ Asset realization
Annotation ↔ narrative/media/editorial object
GenerationJob ↔ ShotIntent
```

Agent mediation may create/query these relationships, but does not change their domain meaning.

# Projection vs Workspace

A **Projection** is deterministically derived from canonical state.

Examples:

- Outline;
- AV Script;
- Paper/Radio Edit;
- Teleprompter;
- Coverage.

A **Workspace** stores human organizational decisions.

Examples:

- Story Wall;
- later Frame Wall;
- later Selects/alternative boards.

A Narrative Lens can be either or both depending on its needs.

No projection becomes canonical storage. Workspace metadata does not redefine Beat/Scene semantics.

# Narrative pulse / derived analysis

“Narrative pulse” is currently a product metaphor for patterns across canonical state, such as:

- pacing;
- density;
- repetition;
- voice/evidence distribution;
- audiovisual complexity;
- coverage completeness;
- section balance.

0C may add small derived indicators if they help test Narrative Lens value.

Candidate examples:

- Cue count per Beat;
- section runtime proportion;
- source-speaker distribution;
- unsupported Beat count.

These should be pure derived calculations where possible.

Do not add a canonical `NarrativePulse` object, hidden AI quality score, or generalized analytics subsystem without evidence.

# Authoring/UI architecture

## Spike 0C baseline

Reuse the existing React/TypeScript/Vite prototype and canonical controller boundary.

```text
React + TypeScript + Vite
│
├── Free-form working text
├── Conversation/instruction input
├── Attachment/media context
├── AgentSession / model adapter
│       ↓
│   Salai authoring commands
│       ↓
├── compile + validate operation batch
│       ↓
├── grouped history/revert boundary
│       ↓
├── existing SalaiController
│       ↓
├── @salai/script-model
│       ↓
└── Narrative Lenses
    ├── Outline
    ├── Story Wall
    ├── AV Script
    └── Paper / Radio Edit
```

No new editor framework is required to validate the first version. Start with normal DOM controls unless a real interaction need justifies more.

## Intent boundary

The primary boundary is:

```text
user creative intent
        ↓
agent interpretation or direct lens gesture
        ↓
Salai command / Workspace intent / Narrative operation
        ↓
validation
        ↓
canonical project state
```

A single user request may legitimately produce many canonical operations.

Libraries/models must not mutate canonical state directly.

## Grouped history / revert

Agent mediation makes history a near-term requirement.

Minimum 0C interaction type:

```text
AgentActionBatch
- user intent/input reference
- compiled operations[]
- before project/Workspace snapshot
- summary
- status/error
```

One agent request normally corresponds to one user-visible history entry even when it performs several operations.

0C does not require a unified event-sourced history for every direct lens edit.

## Graduated autonomy

### Reversible local normalization

May apply as grouped/undoable changes when clearly requested.

### Material ambiguity

Ask a focused creative clarification when necessary.

### High-impact external effects

Remain behind explicit user action in later phases.

The review policy belongs to Salai and should not be delegated to provider-specific agent behavior.

## Explicit 0C non-dependencies

Do not introduce without concrete evidence:

- tldraw/general infinite-canvas SDK;
- React Flow as primary authoring abstraction;
- Tiptap/ProseMirror/Lexical as canonical story storage;
- general multi-agent framework;
- autonomous background-agent runtime;
- vector database;
- Electron/persistence infrastructure merely to validate interaction;
- full media-analysis stack.

A future mixed-media canvas may become one Narrative Lens/Workspace after simpler authoring/lens behavior is validated.

# Runtime architecture

After agent-mediated authoring + Narrative Lenses are validated, Salai remains a local-first desktop application.

```text
┌─────────────────────────────────────────────┐
│ Electron                                    │
│                                             │
│ Renderer                                    │
│ - React + TypeScript                        │
│ - authoring + Narrative Lenses              │
└───────────────────┬─────────────────────────┘
                    │ localhost HTTP / WS
                    ▼
┌─────────────────────────────────────────────┐
│ Local service                               │
│ Python 3.11 / 3.12 + FastAPI                │
│ SQLite                                      │
│ media/filesystem services                   │
│ model-provider adapters where justified     │
│ CutMaster / Resolve adapter                 │
│ OpenTimelineIO                              │
│ optional OpenAssetIO integration            │
└─────────────────────────────────────────────┘
```

Electron remains the OS/runtime shell; the local service owns heavier media/integration concerns. Narrative IR remains independent from Electron/Python.

For the packaged application, `electron-vite` and `electron-builder` remain the preferred direction unless evidence justifies alternatives. Python packaging remains a later implementation concern.

# Infrastructure boundaries

## Model / agent providers

Providers supply inference. Salai supplies:

- project context shaping;
- authoring tools/command schemas;
- ID/reference resolution;
- operation compilation;
- validation;
- change batching;
- autonomy policy;
- history/revert semantics;
- source/provenance rules;
- Narrative Lens context semantics.

A provider response is never canonical until it resolves through Salai validation/application logic.

## DaVinci Resolve

Resolve owns:

- frame-accurate media editing;
- Fusion/VFX;
- color;
- Fairlight/audio post;
- rendering/delivery.

Salai owns story/production context and the decision to materialize it.

The agent should not turn free-form conversation directly into arbitrary Resolve mutations.

## CutMaster

CutMaster remains the default Resolve automation boundary. A Salai-owned Resolve adapter translates canonical materialization intent into CutMaster operations. Direct Resolve scripting is an exception for capabilities unavailable or unsuitable through CutMaster.

Salai domain types must not depend on CutMaster types.

See [`adr/0004-cutmaster-default-resolve-boundary.md`](adr/0004-cutmaster-default-resolve-boundary.md).

## OpenTimelineIO

Use for editorial interchange/materialization where useful. It does not carry all Salai narrative/workspace/agent/lens semantics and does not replace Narrative IR.

## OpenAssetIO

Conditional interoperability integration, not a prerequisite for stable local Asset identity.

Add when external asset resolution/publishing creates a concrete need.

## ComfyUI / generation providers

Treat generated outputs as normal production assets with provenance. The agent may formulate generation intent later, but generation execution remains a separate production effect.

Keep ComfyUI at a process/API boundary rather than importing its UI/editor model.

## FFmpeg / ffprobe

Use as commodity local media utilities for probing, frame/audio extraction, proxy/transcode work, and similar tasks.

## Transcription and reverse scripting

Real-media phases should reuse established components rather than implement speech recognition from scratch.

Candidate infrastructure:

```text
faster-whisper  → transcription
WhisperX        → alignment/diarization when required
PySceneDetect   → initial scene/shot segmentation candidate
```

These produce evidence/metadata that Salai converts into its own MediaSegment/SourceExcerpt semantics and exposes through agents/lenses.

0C may use mocked attachment metadata instead of pulling this stack forward.

## Local search

Use SQLite capabilities before separate infrastructure:

```text
SQLite relational data
├── FTS5        text/transcript retrieval
└── sqlite-vec  semantic retrieval if/when embeddings prove useful
```

Do not introduce a standalone vector database until scale/measured requirements justify it.

# Persistence boundary

Spike 0A validated Narrative IR serialization. Spike 0B validated minimum Workspace semantics in memory. Spike 0C validates agent/session/history/lens interaction semantics in memory.

Phase 2 introduces durable local persistence for:

- validated Narrative IR;
- production graph objects/relationships;
- Workspace state still justified after 0C;
- annotations and Resolve bindings;
- agent action/history metadata required for recovery/audit;
- a durable free-form WorkingDocument/session artifact only if 0C proves it necessary.

Narrative Lenses should derive from persisted canonical/Workspace state rather than requiring separate narrative copies.

SQLite remains the default direction.

# Technology baseline

## Spike 0A

```text
TypeScript
Vitest/unit tests
packages/script-model/
```

## Spike 0B retained foundation

```text
React
TypeScript
Vite
Pragmatic Drag and Drop
Vitest deterministic tests
GitHub Pages prototype
```

## Spike 0C added layer

```text
simple text/chat/attachment UI
model provider adapter
Salai authoring commands
operation batching
in-memory revert/history
existing Narrative IR/controller
Narrative Lenses
```

No general agent framework is assumed.

# Architecture questions for Spike 0C

- What exact contract should agent-facing Salai authoring commands expose?
- What constitutes one reversible action batch?
- How should uncertainty be represented without approval spam?
- Does free-form working text need durable identity/state?
- Which reversible changes may auto-apply?
- What attachment metadata is sufficient before real media analysis?
- Which Narrative Lenses remain first-class?
- Which internal concepts are creatively meaningful enough to expose per lens?
- How should active-lens context affect agent reasoning?
- Which derived “narrative pulse” indicators help without becoming an opaque score?
- Does messy agent-mediated input expose a real Narrative IR semantic gap?

Narrative IR questions belong in [`narrative-ir-spec.md`](narrative-ir-spec.md). Active 0C interaction/lens questions belong in [`agent-mediated-authoring.md`](agent-mediated-authoring.md) and [`narrative-lenses.md`](narrative-lenses.md).