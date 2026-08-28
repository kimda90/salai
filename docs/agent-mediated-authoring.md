# Spike 0C — Agent-Mediated Authoring

## Status

Active product/UX contract for the low-friction half of Spike 0C.

Spike 0B established that one Narrative IR can support several synchronized structured views, then human testing exposed a different problem: **routine direct model management requires too much interaction to remain creatively useful.**

The follow-up hypothesis is not “replace the views with chat.” Structured surfaces remain first-class **Narrative Lenses** when the creator deliberately wants to perceive or manipulate the story through that representation.

Narrative Lens semantics are owned by [`narrative-lenses.md`](narrative-lenses.md). This document owns only the low-friction authoring/agent behavior and its boundary with canonical state.

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
             model/provider call
                    ↓
        typed canonical changes
                    ↓
      @salai/script-model validation
                    ↓
          one controller publish
                    ↓
           canonical project
                    ↓
          Narrative Lenses
```

Working text, chat history, model prose, and lens presentation are not competing sources of narrative truth.

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

# Canonical operation boundary

0C should reuse the public model API before inventing agent-specific abstractions.

`@salai/script-model` already provides:

- `applyOperation()` for one `NarrativeOperation`;
- `applyOperations()` for a `NarrativeOperation[]` over immutable input with one final `OperationResult`.

The controller should use `applyOperations()` for an agent batch and publish only after the full call succeeds.

## Agent output policy

Start with public `NarrativeOperation[]` whenever the scenario can express its changes cleanly with existing stable IDs.

Introduce a higher-level Salai authoring command only when a concrete implemented scenario requires Salai-owned resolution that the model should not manufacture, such as:

- allocating new canonical IDs;
- expressing relative placement such as “after the proof Beat”;
- resolving a user-facing reference to the correct canonical object;
- avoiding raw `ParentRef` or insertion-index construction.

When such a command is needed:

```text
model tool call
      ↓
small Salai command
      ↓
resolve refs / allocate IDs
      ↓
NarrativeOperation[]
      ↓
applyOperations()
```

Agent commands are transient adapters. They must not grow into a second persistent domain API or generic mutation language.

# Grouped changes and trust

One creative request may produce several canonical operations but should appear as one understandable action.

Minimum 0C behavior:

- apply the request as one controller batch;
- show a creative-level summary;
- retain pre-action project/Workspace snapshots;
- allow **immediate one-step revert** while that agent action is still the most recent project/Workspace change;
- invalidate that snapshot as soon as any later canonical or Workspace edit occurs;
- publish no partial live state when the batch fails.

This intentionally avoids a dangerous case where reverting an old agent snapshot would erase later direct lens edits. A long-lived mixed manual/agent undo history belongs to a later phase if evidence requires it.

Do not introduce event sourcing or general inverse-operation synthesis for this spike.

## Graduated autonomy

- A clearly requested, reversible local change may apply as one undoable batch.
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

The agent may arrange, trim through the existing source operation, or select a different excerpt. It must not silently rewrite a `SourceExcerpt` as authored speech.

0C may answer a missing/unsupported-material question from mocked relationships. It does **not** need to build the Coverage Lens or production graph.

# Narrative Lens continuity

Narrative Lens definitions, taxonomy, expose/hide rules, and direct-manipulation semantics live in [`narrative-lenses.md`](narrative-lenses.md).

0C only needs to prove continuity:

1. agent changes are immediately visible in the existing lenses because those lenses read canonical state;
2. one meaningful direct-lens edit changes the same canonical/Workspace state;
3. that edit is therefore visible to the next agent request without export/import or synchronization logic;
4. Workspace-only changes remain Workspace-only.

The agent may receive the active lens identity when it materially helps interpret a question, but arbitrary UI state should not become agent context by default.

# Hosted-provider / local-first boundary

Salai is local-first. Supporting a hosted model provider does not imply that local production media or the whole project is uploaded.

For 0C and later provider adapters:

- raw camera/media originals remain local by default;
- attachment handles are references, not permission to upload the underlying file;
- hosted inference receives only the text/derived metadata/project subset explicitly required for the current request;
- sending raw media or materially broader project context to a hosted provider requires an explicit product boundary and user choice;
- provider choice must not change canonical operation/source semantics.

A local provider may receive broader local context because it does not create the same data-egress boundary, but task relevance should still constrain context size.

# Resolve boundary

Conversation must not become an imperative command stream directly into Resolve.

```text
user intent
    ↓
agent normalization / direct lens edit
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
- deterministic mockable model/provider boundary;
- existing canonical `NarrativeOperation[]` / `applyOperations()` reuse;
- only the minimal higher-level command adapters proved necessary by the implemented scenarios;
- one script-first vertical slice;
- one fixture-backed footage/source vertical slice;
- grouped summary + immediate one-step revert;
- one agent ↔ existing-lens round trip;
- human comparison with 0B.

Not required:

- Electron or durable persistence;
- production graph;
- Coverage Lens;
- real transcription/vision;
- Resolve execution;
- general agent framework;
- autonomous/background agents;
- canonical rich-text model;
- generic canvas;
- vector database;
- GenAI execution;
- universal narrative-quality score.

# Validation target

0C passes only if users can complete representative routine tasks with materially less incidental interaction than 0B **and** at least one existing Narrative Lens remains useful enough that users voluntarily enter it for structural insight or direct manipulation.

The exact executable tasks and evidence live in [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).