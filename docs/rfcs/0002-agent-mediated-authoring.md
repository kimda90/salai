# RFC 0002 — Agent-Mediated Authoring as the Primary Workflow

## Status

Proposed.

Spike 0B produced strong evidence that the current Narrative IR and shared-view architecture are viable, but the first human UX test exposed a cross-cutting product failure: direct manipulation of structured authoring surfaces requires too much interaction to remain creatively useful.

This RFC proposes changing the primary interaction model while retaining the canonical Narrative IR.

## Summary

Salai should make free-form writing, conversation, and media intake the primary authoring path. An agent layer should interpret and normalize that input into typed canonical project changes. Existing structured surfaces—Outline, Story Wall, AV Script, Paper/Radio Edit, Coverage, and later media views—remain available as specialized projections/workspaces and precision-editing tools.

The proposed shape is:

```text
free-form text / conversation / media
                 ↓
          agent normalization
                 ↓
     Salai-owned authoring commands
                 ↓
 typed Narrative / Workspace / production operations
                 ↓
        canonical Salai project
                 ↓
 structured views / Resolve materialization
```

The agent is not a second source of truth. The chat transcript, working text, and agent command plan are not the canonical project model.

## Motivation

### Evidence from Spike 0B

0B validated several important architectural assumptions:

- one Narrative IR can support multiple authoring views;
- stable identity survives restructuring and view switching;
- Workspace state can remain separate from narrative semantics;
- source-backed material can retain source identity/ranges;
- the existing operation boundary can coordinate changes across views.

However, the human test found that a user must perform too many explicit actions to accomplish ordinary creative intentions. The current design asks the user to manage structure that Salai already understands well enough to infer.

Examples of unnecessary user burden include:

- explicitly creating and parenting Beats/Cues;
- selecting the correct structural target before expressing the idea;
- separating spatial and narrative operations through additional controls;
- switching surfaces because a particular operation is exposed only there;
- translating a creative request into several low-level edits.

The semantic architecture is useful; the interaction model is too literal.

### Product opportunity

Creative input is naturally messy. A filmmaker may mix:

- story prose;
- incomplete ideas;
- questions;
- source clips;
- interview excerpts;
- production notes;
- missing-coverage reminders;
- references;
- alternative directions.

Salai can create value by converting that ambiguity into a structured, serializable project representation without forcing the user to normalize it manually.

## Proposal

### 1. Add an agent-mediated interaction layer above canonical state

The user-facing authoring layer accepts ordinary creative input. The agent can inspect current project state and invoke a small set of Salai-owned authoring tools/commands.

```text
User intent
    ↓
AgentSession / AuthoringAgent
    ↓
interpretation + planning
    ↓
Salai authoring commands
    ↓
compile / allocate IDs / resolve references
    ↓
canonical operation batch
    ↓
validation
    ↓
canonical state
```

The agent may use an LLM, local model, hosted model, or future deterministic tools. Provider choice does not define project semantics.

#### Agent command schemas are transient adapters

The model should not be required to manufacture raw canonical IDs, calculate array indices, or construct internal `ParentRef` details when Salai can own that work deterministically.

Agent-facing tools may therefore be slightly higher level than the public Narrative operation union. For example, a tool can express “create a Beat after this existing Beat” without requiring the model to invent the new Beat ID or derive the exact target index.

The tool implementation then:

1. resolves stable existing references;
2. allocates new canonical IDs in Salai code;
3. compiles the command into one or more public `NarrativeOperation`s;
4. validates/applies the complete batch.

These commands are **not another canonical story schema**. They are transient typed input to the existing canonical operation boundary.

This separation keeps provider/model output ergonomic while keeping project identity and mutation semantics owned by Salai.

### 2. Keep Narrative IR canonical

The existing Narrative IR remains the semantic source of truth for story structure, content identity, duration, source evidence, and downstream materialization.

The agent must not mutate arbitrary UI documents and later attempt to synchronize them back into the IR.

All committed semantic changes resolve to public typed operations before they become canonical state.

### 3. Make the primary surface free-form and multimodal

The primary workflow should support:

- a simple free-form working text area;
- project-aware conversational instructions/questions;
- media/attachment drop.

It should be possible to use these together rather than selecting one exclusive mode.

This is intentionally **not** a chat-only architecture. A linear transcript is poor long-lived creative state. The user needs a stable working area plus conversational reasoning.

### 4. Reposition structured surfaces

Outline, Story Wall, AV Script, Paper/Radio Edit, and future Coverage/Frame/Selects views become specialized tools over canonical state.

They remain important because each representation helps with a different class of creative decision. They are no longer assumed to be mandatory authoring stages or the default entry point.

### 5. Introduce grouped, reversible agent actions

The current “propose every operation and require explicit approval” model would create confirmation friction comparable to the structured UI problem.

Agent actions should instead be grouped around the user's creative intention.

```text
one user request
     ↓
0..N typed operations
     ↓
one visible history/change batch
```

The user can inspect or undo the batch without approving each low-level operation.

For the 0C spike, the simplest correct implementation is preferred:

- compile the full requested change before publishing it to live application state;
- use the public batch operation path to validate/derive the resulting project;
- publish once only if the complete batch succeeds;
- retain the pre-batch in-memory project/Workspace snapshot for one-step revert.

Do not synthesize general inverse operations or introduce event sourcing merely to validate one-step agent undo.

### 6. Use graduated autonomy

Not all agent actions need the same review boundary.

#### Reversible local changes

May auto-apply when clearly requested, provided they are grouped and undoable:

- creating inferred narrative structure;
- reordering Beats/Cues;
- attaching provided evidence;
- rewriting authored copy;
- creating obvious supporting Cues.

#### Ambiguous creative choices

Ask a focused clarification when ambiguity materially affects meaning and a reversible best-effort choice is not reasonable.

Clarifications should use creative language, not internal domain vocabulary.

#### External/destructive effects

Require explicit confirmation:

- irreversible deletion;
- real Resolve timeline modifications;
- publishing/export;
- destructive filesystem operations;
- paid/expensive generation;
- source-binding replacement when recovery is unclear.

### 7. Preserve source/provenance semantics

Agent mediation must not weaken the authored/source boundary.

- recorded words remain SourceExcerpt evidence;
- source ranges remain stable;
- media attachments retain identity through explicit attachment/source handles;
- generated media keeps provenance;
- authored agent output remains authored content;
- the agent cannot silently convert recorded evidence into fictional editable prose.

### 8. Treat the Narrative IR as an intermediate representation

The IR becomes the normalized contract between:

- human creative input;
- agent reasoning;
- specialized views;
- media/source relationships;
- production planning;
- downstream Resolve materialization.

This makes the structured model more central while making it less visible to the user.

## Proposed architecture

```text
                         SALAI

         Free-form Authoring / Agent Interaction
           text · conversation · attachments
                         │
                  Agent/Normalizer
                         │
               Salai authoring tools
                         │
            typed canonical operations
                         │
                   Narrative IR
                         │
       ┌─────────────────┼──────────────────┐
       │                 │                  │
  Projections        Workspaces       Production Graph
Outline / AV /       Story Wall /      ShotIntent / media
Paper / Coverage     future boards     relationships
       └─────────────────┼──────────────────┘
                         │
                Resolve materialization
                         │
                Salai Resolve adapter
                         │
                     CutMaster
                         │
                  DaVinci Resolve
```

Paper/Radio is shown under Projections here because 0B did not justify separate Paper-specific Workspace state. If later user organization around source material requires persistent layout/grouping, that can be added as Workspace state independently of the canonical Paper/Radio projection.

## Canonical-state boundary

The free-form working text and conversation are inputs/context, not automatically canonical story state.

For the first implementation:

- raw input may remain session/workspace context;
- committed story meaning is normalized into Narrative IR;
- unresolved notes may remain unresolved;
- attachments retain temporary/stable handles;
- no new full `Document` domain model is introduced unless the prototype demonstrates a need.

A later persistence design may add a durable working-document/session artifact if validated.

### No bidirectional document synchronization in 0C

0C should not attempt to keep the free-form working text as a lossless live textual projection of every canonical change. That would create the synchronization problem this architecture is designed to avoid.

The working area is input/context. The canonical result should be visible through a concise natural-language change/result summary and the existing structured views. If human testing demonstrates that users require a durable editable text representation that stays synchronized with canonical state, that is evidence for a later explicit WorkingDocument/projection design rather than an implicit hidden contract.

## Agent runtime boundary

This RFC does **not** propose adopting a general agent framework.

Start with a small Salai-owned loop using structured output/tool calls into Salai authoring commands that compile into existing operation APIs. Add orchestration infrastructure only if real workflows require capabilities such as long-running planning, multiple specialist agents, resumable jobs, or tool coordination that cannot be expressed simply.

The initial runtime should favor deterministic mechanics around the model call:

```text
build context
   ↓
model chooses typed Salai tools/commands
   ↓
Salai resolves references + allocates IDs
   ↓
compile canonical operations
   ↓
validate complete batch
   ↓
publish once + record batch
```

## Media boundary

The interaction should allow media intake before full reverse-scripting infrastructure exists.

The first spike may use mocked or fixture-backed attachment metadata so it can validate:

- drag/drop interaction;
- source identity preservation;
- agent attachment/reasoning behavior;
- source-vs-authored semantics;
- missing-coverage reasoning.

Real transcription, visual analysis, segmentation, and retrieval remain separate implementation risks.

Attachment identity and canonical media identity should remain distinct concepts during the spike. An attachment is input-context identity; when it maps to an existing or newly created `MediaSegment`/Asset identity, Salai performs that resolution explicitly.

## Resolve boundary

The agent should not translate conversation directly into arbitrary Resolve commands.

Resolve remains downstream of canonical Salai state:

```text
intent
  ↓
agent normalization
  ↓
canonical state
  ↓
explicit materialization/edit action
  ↓
Resolve adapter
```

This preserves repeatability, reviewability, and project semantics.

## Alternatives considered

### A. Keep structured surfaces primary and add shortcuts

Pros:

- minimal architectural change;
- reuses existing UI directly.

Cons:

- does not address the core finding that the user is managing the model;
- shortcuts reduce clicks but still expose structural bookkeeping;
- operation availability remains fragmented across surfaces.

### B. Add a chat sidebar to the existing product

Pros:

- easy incremental implementation;
- agent can issue operations.

Cons:

- treats agent interaction as an accessory rather than the primary authoring layer;
- creative state becomes split between structured UI and chat history;
- does not solve free-form drafting/media intake coherently.

### C. Make one rich-text document canonical

Pros:

- extremely familiar authoring metaphor;
- direct writing experience.

Cons:

- risks recreating synchronization problems between document markup and Narrative IR;
- source evidence, production intent, and multiple structured projections become annotations around a document;
- document structure may begin defining product semantics.

The proposal uses a simple free-form working document as input without making it the canonical domain model.

### D. Generic multimodal canvas as the main UI

Pros:

- flexible media/text organization;
- attractive for exploratory work.

Cons:

- can create another high-interaction manual organization layer;
- risks becoming a node/canvas product rather than an intent-normalization product;
- not required to test the agent-mediated hypothesis.

A canvas may later become one Workspace if evidence supports it.

### E. Fully autonomous agent

Pros:

- minimum direct interaction.

Cons:

- weak trust and predictability;
- unsuitable for creative authorship;
- dangerous once external effects/Resolve/generation are connected.

The proposal favors user-directed, reversible automation rather than unattended autonomy.

## Consequences

### Positive

- interaction cost can scale with creative decisions rather than domain-object count;
- the Narrative IR becomes hidden infrastructure instead of visible workload;
- blank-page and footage-first work can share one entry surface;
- users can mix prose, instructions, and media naturally;
- structured views remain available when they genuinely help;
- downstream systems receive normalized deterministic state instead of conversational prose;
- source/provenance rules remain enforceable;
- Salai owns canonical ID allocation and reference resolution instead of delegating those mechanics to the model.

### Costs / risks

- agent interpretation can be wrong or overconfident;
- undo/history becomes necessary earlier than planned;
- user trust depends on understandable change summaries;
- free-form working state vs canonical state must remain conceptually clear;
- model latency may interrupt creative flow;
- media intake may create pressure to implement analysis infrastructure too early;
- excessive clarification or approval prompts could recreate the original friction;
- insufficient review could make users feel the project changes unpredictably;
- agent-facing command schemas can grow into an accidental second domain API if they are not kept narrow and compiled immediately into canonical operations.

## Validation plan

Spike 0C should validate the interaction before broad application infrastructure.

Required scenarios:

1. blank-page paragraph → rough narrative structure;
2. messy working draft → normalized structure without forcing every note into the IR;
3. source/media attachments → source-preserving radio/paper-edit structure;
4. natural-language revision → grouped multi-operation change;
5. change inspection + one-step batch undo;
6. inspect the same result in existing structured views.

Primary success criterion:

> Users spend materially less effort operating Salai and more effort making creative decisions.

See [`../agent-mediated-authoring.md`](../agent-mediated-authoring.md) for the detailed implementation/UX contract.

## Open questions

1. Should free-form text or conversation be visually primary?
2. Should normalization happen continuously, explicitly, or through both modes?
3. How should assumptions/uncertainty be surfaced without approval spam?
4. What is the right auto-apply boundary for reversible local changes?
5. What exact information belongs in one undoable agent batch?
6. Does the working document need durable identity/state, or can it remain session/workspace context initially?
7. How should attachments be represented before real media analysis exists?
8. Which structured surfaces remain first-class after agent-mediated authoring is tested?
9. How much latency is tolerable during creative writing/restructuring?
10. Does the existing Narrative IR remain sufficient once the agent is allowed to normalize genuinely messy input rather than curated fixtures?
11. Which agent-facing commands are truly needed, and which can remain direct wrappers around public Narrative operations?

## Decision / outcome

Pending Spike 0C implementation and human validation.
