# Spike 0C — Agent-Mediated Authoring

## Status

Proposed implementation and UX contract for the next Salai validation milestone.

Spike 0B established that one Narrative IR can support Story Wall, Outline, AV Script, and Paper/Radio Edit without duplicating canonical story state. Human testing then exposed a more important product failure: **direct manipulation of those structured surfaces requires too much interaction to remain creatively useful.**

This document defines the next hypothesis: users should express creative intent naturally, while Salai performs the structural bookkeeping.

The related architectural proposal is [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md).

## Validation question

Can a filmmaker construct and revise a story by writing, chatting, and dropping media into a low-friction working surface while Salai reliably normalizes that messy input into the canonical Narrative IR and production context?

The spike succeeds only if the user can stay focused on creative intent rather than manually creating, parenting, moving, and wiring domain objects.

## Product hypothesis

> **Express intent naturally; Salai structures it for production.**

The interaction model becomes:

```text
free-form writing / conversation / media
                 ↓
          Salai agent layer
      interpret / normalize / infer
                 ↓
    typed project operations + evidence
                 ↓
      Narrative IR / Workspace state
                 ↓
  specialized views / later Resolve handoff
```

The Narrative IR remains canonical. The agent is not a second source of truth and chat history is not the project model.

## Why this follows from Spike 0B

0B proved the difficult semantic part:

- one project can back multiple workflows;
- stable Beat/Cue/source identity survives restructuring;
- Workspace layout can remain separate from narrative meaning;
- source-backed material can remain distinct from authored material;
- structured views can all dispatch through one operation boundary.

The human test exposed the interaction failure:

- users must make too many explicit structural decisions;
- routine creative changes expose implementation-level hierarchy and operation mechanics;
- switching to the correct surface or control interrupts flow;
- a technically correct interaction can still be creatively expensive.

The next experiment should therefore **compress interaction**, not add more structured controls.

## Primary authoring surface

The next prototype should center on one low-friction surface with three complementary input modes.

### 1. Free-form working text

A simple text editor/scratch document where the user can write naturally:

```text
Open with Maria talking about the two-day manual process.
Then show the old workflow.
Move quickly into the install demo.
I do not think we have the connector close-up yet.
End with Juan's result quote.
```

The user should not have to decide whether each sentence is a Section, Beat, Cue, ContentBlock, ShotIntent, or note before writing it.

### 2. Conversation

The same project context is available through conversational instructions and questions:

```text
Make the middle tighter.

Move Maria's quote earlier.

What parts of this story do not have visual coverage?

Use the second interview excerpt instead.

Give me a version that lands under 45 seconds.
```

Conversation is a control and reasoning channel, not the only visible representation of the project.

### 3. Media drop / attachment

Users can add media or media-derived evidence directly to the working context:

- interview clips;
- B-roll;
- stills;
- reference images;
- scripts/documents;
- voice notes;
- generated/previs media.

For 0C, real analysis may be mocked or fixture-backed. The interaction question is whether the user can provide material without manually wiring every source object into the story.

## Not chat-only

A pure chat product would solve the command-entry problem but create another form of friction: important creative state would be buried in a linear transcript.

The intended shape is therefore closer to:

```text
┌────────────────────────────────────────────────────┐
│ Working story / scratch text                       │
│                                                    │
│ We open on Maria explaining the old process...     │
│ [ interview_maria.mov ]                            │
│                                                    │
│ Then show installation...                          │
│ [ demo-wide.mov ] [ connector-closeup.mov ]        │
│                                                    │
│ TODO: find a stronger transition                   │
└────────────────────────────────────────────────────┘

Ask Salai…
> Tighten this and tell me what coverage is missing.
```

The user gets a stable place to read and manipulate material, plus a conversational agent that can reason across the whole project.

## Agent responsibilities

The agent layer should perform work that 0B currently asks the user to do manually.

### Interpret creative intent

Infer likely structure from ordinary language without requiring explicit model terminology.

Examples:

- infer Beats from narrative statements;
- infer sequence/order from prose;
- infer that several audiovisual moments belong to one Beat;
- infer when a media excerpt is supporting evidence rather than authored copy;
- infer missing coverage or production intent from statements such as “we need a close-up here.”

### Normalize into canonical state

Translate interpreted intent into explicit typed changes:

```text
NarrativeOperation[]
Workspace changes when relevant
future production-graph operations
```

The model may reason freely, but canonical state changes remain constrained by Salai-owned operations and validation.

### Manage structure on behalf of the user

The user should normally express the desired result, not the mechanical steps.

```text
"Put the result quote before the demo"
```

may become several internal operations while remaining one creative action to the user.

### Preserve provenance and evidence

The agent must not blur authored and sourced material.

- SourceExcerpt transcript/ranges remain source evidence.
- Rewording a sourced quote cannot silently mutate the recording.
- Media attachments retain their source identity.
- Generated material retains provenance.
- Agent-created authored text remains distinguishable from recorded evidence.

### Expose uncertainty instead of inventing certainty

When input is ambiguous, Salai should either:

- make a reversible best-effort interpretation and surface the assumption; or
- ask one focused clarification when the ambiguity materially changes meaning or causes an external/destructive effect.

Do not turn every ambiguity into a form or confirmation dialog.

## Interaction-compression principle

> **A common creative intention should usually require one gesture or one short input.**

Examples:

| Creative intention | Desired interaction |
| --- | --- |
| Add the next story idea | type it / press Enter |
| Reorder two story ideas | say or drag the desired result |
| Turn a paragraph into a rough structure | one processing action |
| Use a quote earlier | one conversational instruction or move |
| Add a clip as evidence | drop it near the relevant text or into the project context |
| Add visual coverage for a spoken moment | describe/drop it; Salai infers the required attachment |
| Make a 60s version into 30s | one instruction producing a reviewable batch |

The system may perform many typed operations internally. The user should not have to execute them individually.

## Trust and review model

The 0B-era assumption that every AI change should be individually proposed and explicitly accepted would recreate the same interaction problem.

0C should test **graduated autonomy**.

### Reversible in-project normalization

Safe, local, reversible changes may be applied as one batch when the user clearly requested the outcome.

Examples:

- creating inferred Beats from a paragraph;
- reordering narrative objects;
- attaching a provided excerpt to the intended Beat;
- creating Cues needed to represent obvious visual/audio changes;
- updating authored copy the user asked to rewrite.

Requirements:

- one visible batch/history entry;
- undo/revert;
- inspectable summary of what changed;
- stable identity where possible.

### Clarification-required actions

Ask when ambiguity changes creative meaning materially and a reasonable reversible interpretation is not available.

The clarification should be about the creative choice, not the data model.

Bad:

> Which ParentRef should this Beat use?

Good:

> Should this be part of the installation sequence, or a separate section after it?

### Explicit-confirmation actions

Require explicit confirmation for high-impact or external side effects, including later:

- destructive deletion when recovery is not obvious;
- modifying a real Resolve timeline;
- replacing source bindings;
- publishing/exporting;
- paid or expensive generation;
- irreversible filesystem/media operations.

The goal is **fewer confirmations, placed at the correct boundary**.

## Change/history model

Agent-mediated authoring makes undo/history a requirement rather than a deferred convenience.

The minimum 0C history unit is a user-visible **action batch**:

```text
User intent
    ↓
agent interpretation
    ↓
0..N typed operations
    ↓
one history entry
```

The user should be able to inspect and revert the batch without understanding every underlying operation.

This does not require a general event-sourcing architecture for the spike. An in-memory command/history layer is sufficient to validate the interaction.

## Role of existing structured surfaces

Story Wall, Outline, AV Script, and Paper/Radio Edit remain useful, but their role changes.

### Before 0B human evidence

They were treated as candidate primary authoring workflows.

### New hypothesis

They become **specialized views and precision editors** over agent-maintained project state.

Use them when the representation helps the user think:

- **Outline** — inspect hierarchy and precise structure;
- **Story Wall** — spatially inspect/compare story chunks and alternatives;
- **AV Script** — plan or inspect visual/audio realization;
- **Paper/Radio Edit** — inspect and precisely arrange source evidence;
- **Coverage** — identify missing production material;
- later **Frame Wall / Selects** — inspect real media visually.

A user should not have to visit these surfaces merely because an operation is unavailable from the primary authoring flow.

## Structured state as a compiler target

The Narrative IR becomes more valuable in this direction, not less.

It is the structured representation that allows:

- agents to reason without rewriting arbitrary documents;
- multiple views to remain synchronized;
- media/source identity to survive restructuring;
- validation and duration calculation;
- production needs to remain queryable;
- downstream systems to consume deterministic data;
- Resolve integration to materialize editorial choices without parsing a chat transcript.

A useful analogy is:

```text
creative input         source language
agent normalization    compiler
Narrative IR           intermediate representation
views / Resolve         targets
```

The analogy is about separation of concerns, not about making creative work rigid or deterministic.

## Working document vs canonical truth

The free-form working text and conversation should **not automatically become canonical story storage**.

For 0C:

- retain the raw text/conversation as user input/context;
- normalize committed meaning into Narrative IR;
- preserve attachments/source handles;
- allow unresolved text/notes to remain unstructured until needed;
- do not introduce a second full canonical document model.

A later persistence phase may justify a durable `WorkingDocument`/session artifact. Do not add that domain object during 0C unless the prototype proves it necessary.

## Media normalization boundary

0C should validate the interaction before building full media intelligence.

The agent-facing abstraction can accept fixture-backed or mocked media descriptors such as:

```text
attachment
- stable temporary id
- file/display name
- media type
- optional duration
- optional transcript/description
- optional mocked MediaSegment/source ranges
```

The agent can then reason about the attachment and produce the same Narrative IR/source relationships that later real analysis will produce.

Real transcription, segmentation, embeddings, and visual analysis remain later infrastructure unless a very small implementation is needed to make the interaction test credible.

## Resolve boundary

The free-form agent interaction must not become a hidden imperative command stream directly into Resolve.

The intended path remains:

```text
user intent / media
       ↓
agent normalization
       ↓
Salai canonical project state
       ↓
validated materialization decision
       ↓
Salai Resolve adapter
       ↓
CutMaster / Resolve
```

This keeps Resolve automation downstream from product semantics and makes actions inspectable/repeatable.

## 0C prototype scope

Build the smallest prototype that can test the interaction hypothesis.

### Required

- a simple free-form text editor/scratch area;
- project-aware chat/instruction input;
- attachment/media-drop affordance using fixture-backed or mocked metadata;
- an agent/model call that can inspect current canonical state and input context;
- typed tool/structured-output boundary into Narrative operations;
- grouped application of agent-produced operations;
- validation through `@salai/script-model`;
- user-visible summary of the resulting change batch;
- one-step undo/revert of the last agent batch;
- existing structured surfaces updated from the same canonical state;
- deterministic test scenarios for script-first and footage-first inputs.

### Explicitly not required

- Electron;
- durable persistence;
- real Resolve execution;
- a general-purpose multi-agent framework;
- autonomous background agents;
- full transcription/media understanding;
- vector database;
- rich-text collaborative editor;
- generic infinite canvas;
- GenAI media generation;
- full command/event-sourcing architecture.

## Suggested implementation shape

Start simple:

```text
React authoring surface
       ↓
AgentSession / AuthoringAgent adapter
       ↓
model provider
       ↓
structured tool calls / operation batches
       ↓
existing SalaiController
       ↓
@salai/script-model
```

Do not adopt an agent framework until the spike demonstrates orchestration needs that cannot be handled by a small Salai-owned loop.

The provider should be replaceable. Local vs hosted inference is not part of the UX contract.

## Validation scenarios

### Scenario A — blank page

Input:

```text
Make a 30-second product story. Open on the pain of doing this manually,
show three quick installation moments, then end on the time saved.
```

Expected behavior:

- one submit creates a usable rough structure;
- no manual Beat/Cue creation is required;
- user can refine it conversationally;
- Outline/AV Script can inspect the resulting state.

### Scenario B — messy authored draft

Input is a paragraph containing story copy, notes, uncertainty, and production comments.

Expected behavior:

- Salai separates likely story intent from unresolved notes;
- it does not force every line into canonical structure;
- a request such as “make this 45 seconds” produces a coherent batched revision.

### Scenario C — footage-first

User drops mocked interview/source attachments and says:

```text
Build a short radio edit around the old manual process, what changed,
and the result. Keep Maria's wording exactly as recorded.
```

Expected behavior:

- source identity/ranges are preserved;
- sourced wording is not rewritten as authored speech;
- Salai creates/attaches the necessary narrative structure;
- Paper/Radio Edit can inspect the result without manual source wiring.

### Scenario D — mixed media and missing coverage

User writes a rough story and adds several media attachments.

Expected behavior:

- the agent maps obvious supporting material;
- it identifies unsupported narrative moments;
- it can describe missing coverage in creative language;
- later ShotIntent creation can use the same boundary.

## Acceptance criteria

0C passes when human testing demonstrates all of the following:

1. A user can remain primarily in the free-form authoring surface while constructing and revising a meaningful story.
2. Common structural changes can be expressed as one natural instruction or direct manipulation rather than a sequence of model-management actions.
3. Agent-produced changes resolve to valid typed project operations; the model does not bypass Narrative IR invariants.
4. Source-backed material remains source-backed and identifiable after agent reasoning/restructuring.
5. Existing structured views remain synchronized and useful for inspection/precision editing.
6. Users can understand what the agent changed at the level of creative consequences without reviewing every low-level operation.
7. A user can undo/revert an agent-applied batch reliably.
8. The interaction does not require users to learn `Section`, `ParentRef`, `Cue`, or other implementation terminology unless a specialized view makes the term useful.
9. The new workflow requires materially fewer explicit interactions than the 0B structured-authoring baseline for the same representative tasks.
10. No new canonical free-form document model is required merely to support the interaction.

## Human-test focus

Measure creative friction rather than feature completeness.

For each representative task record:

- number of user actions/inputs;
- number of times the user must think about structure rather than story;
- number of clarifications requested by Salai;
- whether the user feels they are “operating software” or “working on the story”;
- whether agent changes are trusted and recoverable;
- whether structured views are opened because they help, not because they are required.

The target is not zero interaction. The target is that interaction cost scales with **creative decisions**, not with the number of underlying domain operations.

## Open questions

0C must produce evidence for:

- Should free-form text or conversation be visually primary?
- Should processing happen continuously, on explicit command, or both?
- How much reversible normalization can auto-apply before trust falls?
- What constitutes one undoable agent batch?
- How should assumptions/uncertainty be shown without turning into approval spam?
- When should structured hierarchy become visible?
- Which existing surfaces remain worth keeping as first-class views?
- Does media dropping belong inline with text, in a tray, or both?
- Does a persistent working document become necessary, or is session context plus Narrative IR sufficient?
- What minimum media metadata makes the footage-first interaction credible before real analysis is implemented?

## Exit

If 0C succeeds, proceed to the local desktop/persistence phase with agent-mediated authoring as the primary product interaction and structured views as secondary tools.

If it fails, do not compensate by adding more forms. Determine whether the failure is in model reasoning, trust/review semantics, the free-form surface itself, or the Narrative IR's ability to represent the requested intent.
