# Spike 0C — Agent-Mediated Authoring

## Status

Active product/UX contract for the low-friction half of Spike 0C.

Spike 0B established that one Narrative IR can support several synchronized structured views, then human testing exposed a different problem: **routine direct model management requires too much interaction to remain creatively useful.**

The follow-up hypothesis is not “replace the views with chat.” Structured surfaces remain first-class **Narrative Lenses** when the creator deliberately wants to perceive or manipulate the story through that representation.

Narrative Lens semantics are owned by [`narrative-lenses.md`](narrative-lenses.md). This document owns only low-friction authoring/agent behavior and its boundary with canonical state.

The current application boundary is recorded in [`adr/0007-project-service-is-the-human-machine-boundary.md`](adr/0007-project-service-is-the-human-machine-boundary.md).

## Validation question

Can a filmmaker construct and revise representative stories through free-form writing, natural-language instructions, and supplied media while Salai handles routine structural bookkeeping, without losing canonical validity, source provenance, recoverability, or continuity with direct lens editing?

## Product hypothesis

> **Express intent naturally; Salai structures it for production. See and reshape that structure through narrative lenses.**

Core rule:

> **Hide structural bookkeeping, not narrative structure.**

## Primary flow

```text
working text / instruction / attachment handles
                    ↓
          model / interpretation step
                    ↓
         Salai-owned structured result
                    ↓
          SalaiProjectService
                    ↓
        typed canonical changes
                    ↓
      @salai/script-model validation
                    ↓
          one canonical publish
                    ↓
           canonical project
                    ↓
          Narrative Lenses
```

Working text, model conversation/history, provider sessions, and lens presentation are not competing sources of narrative truth.

# Working surface

0C needs one deliberately simple place to think and instruct Salai.

It should support:

- rough prose;
- notes and uncertainty;
- project-aware questions/instructions;
- attachment handles;
- one explicit Process/Apply action;
- one concise change/result summary;
- easy entry to existing Narrative Lenses.

The user should not need to decide whether each sentence is a Section, Beat, Cue, ContentBlock, ShotIntent, or note before expressing it.

Do not introduce a canonical rich-text document or attempt bidirectional lossless working-text ↔ Narrative IR synchronization in 0C.

A polished chatbot transcript or token-by-token streaming UI is not required to test this product hypothesis. A clear running/error/result state is enough unless human testing proves otherwise.

# Application boundary

All human and machine interactions that change the project go through the same Salai-owned application boundary.

For 0C:

- `SalaiProjectService` provides task-relevant project context;
- it applies validated canonical operations using the existing model/controller path;
- it exposes project/Workspace changes to local clients;
- Narrative Lenses and the embedded model flow are clients of the same service;
- no model/provider session is canonical project storage;
- a new model session must be able to continue from current Salai project context.

This service is an application facade over existing state, not a second narrative model or a general agent framework.

# Embedded model boundary

The primary 0C demo runs in the existing browser/GitHub Pages application without a Salai-operated backend.

Therefore:

- use one browser-safe, user-scoped hosted-model adapter;
- never embed a reusable developer API secret in the static bundle;
- send only task-relevant Salai context;
- parse/validate a Salai-owned structured result before applying canonical changes;
- keep provider/auth/session types outside project/lens/domain code;
- use deterministic model-result fixtures/mocks in CI.

The provider/model is an adapter choice. Replacing it must not change Narrative IR, operation semantics, Workspace ownership, or lens behavior.

0C does not require an `AgentRuntime` lifecycle abstraction, local agent host, durable chat service, provider registry, or model router.

# Canonical operation boundary

0C should reuse the public model API before inventing agent-specific abstractions.

`@salai/script-model` already provides:

- `applyOperation()` for one `NarrativeOperation`;
- `applyOperations()` for a `NarrativeOperation[]` over immutable input with one final `OperationResult`.

`SalaiProjectService` should use `applyOperations()` for a model-produced batch and publish only after the full call succeeds.

## Model output policy

Start with public `NarrativeOperation[]` whenever the scenario can express its changes cleanly with existing stable IDs.

Introduce a higher-level Salai authoring command only when a concrete implemented scenario requires Salai-owned resolution that a model/client should not manufacture, such as:

- allocating new canonical IDs;
- expressing relative placement such as “after the proof Beat”;
- resolving a user-facing reference to the correct canonical object;
- avoiding raw `ParentRef` or insertion-index construction.

When such a command is needed:

```text
structured model result
      ↓
small Salai command
      ↓
resolve refs / allocate IDs
      ↓
NarrativeOperation[]
      ↓
SalaiProjectService / applyOperations()
```

Authoring commands are transient adapters. They must not grow into a second persistent domain API or generic mutation language.

# Grouped changes and trust

One creative request may produce several canonical operations but should appear as one understandable action.

Minimum 0C behavior:

- apply the request as one project-service batch;
- show a creative-level summary;
- retain pre-action project/Workspace snapshots;
- allow **immediate one-step revert** while that action is still the most recent project/Workspace change;
- invalidate that snapshot as soon as any later canonical or Workspace edit occurs;
- publish no partial live state when the batch fails.

This intentionally avoids a dangerous case where reverting an old snapshot would erase later direct lens edits. A long-lived mixed manual/model undo history belongs to a later phase if evidence requires it.

Do not introduce event sourcing or general inverse-operation synthesis for this spike.

## Graduated autonomy

- A clearly requested, reversible local change may apply as one revertible batch.
- Material creative ambiguity may trigger one focused clarification in ordinary creative language.
- Destructive/external effects remain outside the 0C execution path and later require an explicit boundary.

Do not recreate 0B friction by asking for per-operation approval.

# Script-first behavior

0C needs one representative script-first vertical slice, not a general natural-language editor.

The prototype should prove that a rough paragraph can become a usable canonical story in one action and that one ordinary revision can be expressed naturally without manual Beat/Cue/parent management.

Existing identity should be preserved during revision where possible.

# Media / source behavior

0C should validate source semantics before building real media intelligence.

Attachment input may use fixture-backed or mocked descriptors:

```text
Attachment
- id
- displayName
- mediaType
- optional duration
- optional transcript/description
- optional fixture MediaSegment/source-range reference
```

Attachment identity is not automatically canonical media identity. Salai resolves it when canonical source relationships are created.

Required invariant:

> **Recorded evidence remains recorded evidence.**

The model may arrange, trim through the existing source operation, or select a different excerpt. It must not silently rewrite a `SourceExcerpt` as authored speech.

0C may answer a missing/unsupported-material question from mocked relationships. It does **not** need to build the Coverage Lens or production graph.

# Narrative Lens continuity

Narrative Lens definitions, taxonomy, expose/hide rules, and direct-manipulation semantics live in [`narrative-lenses.md`](narrative-lenses.md).

0C only needs to prove continuity:

1. model-mediated changes are immediately visible in the existing lenses because those lenses read the same project state;
2. one meaningful direct-lens edit changes the same canonical/Workspace state;
3. that edit is visible to the next model request from fresh project context without export/import or shadow synchronization;
4. Workspace-only changes remain Workspace-only.

The active lens identity may be included in context when it materially helps interpret a question, but arbitrary UI state should not become model context by default.

# External machine interfaces

External-agent integration is not required for the 0C gate.

A later or optional proof may expose `SalaiProjectService` through one machine-oriented interface such as CLI or MCP. A Skill may document the intended workflow for a generic agent.

Rules:

- the adapter uses the same project queries/commands as the UI;
- it does not edit persistence directly;
- it does not introduce a second project/session model;
- external agent history/auth/provider state remains outside Salai project state;
- do not build both CLI and MCP before one concrete external-agent scenario justifies them.

# Hosted-provider / local-first boundary

Salai is local-first. Supporting hosted inference does not imply that local production media or the whole project is uploaded.

For 0C and later provider adapters:

- raw camera/media originals remain local by default;
- attachment handles are references, not permission to upload the underlying file;
- hosted inference receives only the text/derived metadata/project subset explicitly required for the current request;
- sending raw media or materially broader project context to a hosted provider requires an explicit product boundary and user choice;
- provider choice must not change canonical operation/source semantics;
- credentials/authentication are adapter infrastructure, not project state.

A local provider may receive broader local context because it does not create the same data-egress boundary, but task relevance should still constrain context size.

# Resolve boundary

Free-form/model interaction must not become an imperative command stream directly into Resolve.

```text
user intent
    ↓
model normalization / direct lens edit
    ↓
SalaiProjectService
    ↓
canonical Salai project
    ↓
explicit materialization decision
    ↓
Salai Resolve adapter
    ↓
Resolve
```

Resolve remains downstream of canonical Salai state.

# Explicit 0C scope

Required:

- simple free-form/instruction surface;
- `SalaiProjectService` over the existing controller/model state;
- deterministic model-result fixtures/mocks for CI;
- one backendless browser-safe hosted-model adapter for the public demo;
- existing canonical `NarrativeOperation[]` / `applyOperations()` reuse;
- only the minimal higher-level command adapters proved necessary by implemented scenarios;
- one script-first vertical slice;
- one fixture-backed footage/source vertical slice;
- grouped summary + immediate one-step revert;
- one model-mediated ↔ existing-lens round trip;
- human comparison with 0B.

Not required:

- Salai-operated backend;
- local agent host;
- external CLI/MCP/Skill integration;
- production Electron shell or durable persistence;
- production graph;
- Coverage Lens;
- real transcription/vision;
- Resolve execution;
- general agent/provider/plugin framework;
- Salai-owned API-key/OAuth-token infrastructure;
- durable chat history or polished streaming chat UI;
- autonomous/background agents;
- canonical rich-text model;
- generic canvas;
- vector database;
- GenAI execution;
- CRDT/event-sourcing infrastructure;
- universal narrative-quality score.

# Validation target

0C passes only if users can complete representative routine tasks with materially less incidental interaction than 0B **and** at least one existing Narrative Lens remains useful enough that users voluntarily enter it for structural insight or direct manipulation.

The exact executable tasks and evidence live in [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).