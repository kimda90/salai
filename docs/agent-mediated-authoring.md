# Spike 0C — Agent-Mediated Authoring

## Status

Proposed implementation and UX contract for the next Salai validation milestone.

Spike 0B established that one Narrative IR can support Story Wall, Outline, AV Script, and Paper/Radio Edit without duplicating canonical story state. Human testing then exposed a more important product failure: **using those structured surfaces as the routine path for ordinary creative changes requires too much interaction to remain creatively useful.**

That does **not** mean the structured surfaces are unimportant. The follow-up product insight is that they can reveal the narrative system from different angles and allow intentional direct manipulation when that representation itself is useful.

The next hypothesis therefore combines two complementary ideas:

1. users should express ordinary creative intent naturally while Salai performs structural bookkeeping; and
2. structured **Narrative Lenses** should remain first-class ways to inspect, understand, and reshape the story's structure, rhythm, evidence, audiovisual density, gaps, and alternatives.

See [`narrative-lenses.md`](narrative-lenses.md) and [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md).

## Validation question

Can a filmmaker construct and revise a story with substantially less structural bookkeeping through free-form writing, conversation, and media intake, while still being able to deliberately enter structured Narrative Lenses to understand and manipulate the narrative system from different creative angles?

The spike succeeds only if both are true:

- routine interaction cost falls materially compared with 0B; and
- the structured views remain creatively valuable as lenses rather than becoming obsolete or merely administrative.

## Product hypothesis

> **Express intent naturally; Salai structures it for production. See and reshape that structure through narrative lenses.**

The interaction model becomes:

```text
free-form writing / conversation / media
                 ↓
          Salai agent layer
      interpret / normalize / infer
                 ↓
    typed project operations + evidence
                 ↓
          canonical project
        ↙        ↓        ↘
  Narrative Lenses / production context
        ↖        ↓        ↗
     direct lens editing
                 ↓
      later Resolve handoff
```

The Narrative IR remains canonical. The agent, working text, chat transcript, and individual lenses are not competing sources of truth.

## Core UX principle

> **Hide structural bookkeeping, not narrative structure.**

The user should not have to manually perform incidental mechanics such as:

- choosing raw parent references;
- allocating IDs;
- calculating insertion indices;
- creating a Cue merely because the schema requires one;
- wiring obvious source relationships;
- switching surfaces only because an operation is unavailable elsewhere.

But Salai should intentionally expose structure when that structure carries creative information.

Examples:

- one Beat has six Cues while another has one;
- one section consumes half the runtime;
- three consecutive story moments depend on the same interview voice;
- several Beats lack visual realization;
- a Story Wall is visibly crowded in the middle;
- a narratively simple moment requires unexpectedly complex audiovisual coverage.

Those are not merely implementation details. They may be part of the story's **pulse**.

## Why this follows from Spike 0B

0B proved the difficult semantic part:

- one project can back multiple workflows;
- stable Beat/Cue/source identity survives restructuring;
- Workspace layout can remain separate from narrative meaning;
- source-backed material can remain distinct from authored material;
- structured views can all dispatch through one operation boundary.

The human test exposed the interaction failure:

- users must make too many explicit structural decisions for ordinary changes;
- routine creative work exposes hierarchy and operation mechanics prematurely;
- switching to the correct surface/control can interrupt flow;
- a technically correct interaction can still be creatively expensive.

The important refinement is:

> The problem is **not exposure of structure itself**. The problem is requiring the user to manage structure when the structure is not the creative question.

The next experiment should therefore compress routine interaction while preserving intentional structural perception and manipulation.

# Primary authoring surface

The next prototype should center on one low-friction surface with three complementary input modes.

## 1. Free-form working text

A simple text editor/scratch document where the user can write naturally:

```text
Open with Maria talking about the two-day manual process.
Then show the old workflow.
Move quickly into the install demo.
I do not think we have the connector close-up yet.
End with Juan's result quote.
```

The user should not have to decide whether each sentence is a Section, Beat, Cue, ContentBlock, ShotIntent, or note before writing it.

## 2. Conversation

The same project context is available through conversational instructions and questions:

```text
Make the middle tighter.

Move Maria's quote earlier.

What parts of this story do not have visual coverage?

Use the second interview excerpt instead.

Give me a version that lands under 45 seconds.
```

Conversation is a control and reasoning channel, not the only visible representation of the project.

## 3. Media drop / attachment

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

A pure chat product would solve command entry while creating another form of friction: important creative state would be buried in a linear transcript.

The intended shape is closer to:

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

Open Lens…
> Story Wall · Outline · AV Script · Paper/Radio · Coverage
```

The user gets a stable place to think, a conversational agent that can reason across the project, and structured lenses when another representation helps them perceive the story.

# Narrative Lenses

A **Narrative Lens** is a structured representation of the same canonical project that emphasizes a specific property of the narrative system.

It is not merely an advanced settings panel or a fallback editor.

A lens is useful when the representation helps the user **see, feel, or manipulate something that is difficult to perceive in prose/chat alone**.

| Lens | Primary creative perception |
| --- | --- |
| Outline | hierarchy, progression, proportion, structural weight |
| Story Wall | spatial rhythm, balance, turning points, alternatives |
| AV Script | audiovisual density, realization over time, visual/audio interplay |
| Paper / Radio Edit | evidentiary spine, voice, source pacing, authored-vs-sourced balance |
| Coverage | gaps between intent and available realization |
| later Frame Wall / Selects | visual coverage, contrast, repetition, alternatives |

## Direct manipulation remains first-class

The user may directly edit through a lens when the lens itself is the chosen way of thinking.

Examples:

- drag cards because spatial relationship is the creative question;
- move a quote because the radio edit's spoken rhythm is the creative question;
- edit Visual/Audio realization because audiovisual timing is the creative question;
- restructure hierarchy because hierarchy itself is the creative question.

The 0B failure was not that these operations should disappear. It was making them the routine path for every creative intention.

## Agent + lens interaction

The agent should understand the active lens when useful.

Examples:

```text
Story Wall
> Why does the middle feel crowded?

AV Script
> Reduce the number of visual changes in this Beat.

Paper Edit
> Can we make this section less dependent on Maria?

Coverage
> Show only the missing material that blocks a rough cut.
```

A lens therefore provides both human legibility and additional structured context for agent reasoning.

See [`narrative-lenses.md`](narrative-lenses.md) for the detailed contract.

# Agent responsibilities

The agent layer should perform work that 0B asks the user to do mechanically while preserving structure that may later be inspected through a lens.

## Interpret creative intent

Infer likely structure from ordinary language without requiring explicit model terminology.

Examples:

- infer Beats from narrative statements;
- infer sequence/order from prose;
- infer that several audiovisual moments belong to one Beat;
- infer when a media excerpt is supporting evidence rather than authored copy;
- infer missing coverage or production intent from statements such as “we need a close-up here.”

## Normalize into canonical state

Translate interpreted intent into explicit typed changes.

The model should invoke Salai-owned authoring commands which Salai compiles into public canonical operations.

```text
agent command/tool call
        ↓
Salai resolves references + allocates IDs
        ↓
NarrativeOperation[]
Workspace operations when relevant
future production-graph operations
        ↓
validation
        ↓
canonical state
```

The model may reason freely, but canonical state changes remain constrained by Salai-owned semantics and validation.

## Manage structure on behalf of the user

The user should normally express the desired result, not the mechanical steps.

```text
"Put the result quote before the demo"
```

may become several internal operations while remaining one creative action.

The user can then inspect the result through a lens if the structural consequence matters.

## Preserve provenance and evidence

The agent must not blur authored and sourced material.

- SourceExcerpt transcript/ranges remain source evidence.
- Rewording a sourced quote cannot silently mutate the recording.
- Media attachments retain source identity through explicit resolution.
- Generated material retains provenance.
- Agent-created authored text remains distinguishable from recorded evidence.

## Expose uncertainty instead of inventing certainty

When input is ambiguous, Salai should either:

- make a reversible best-effort interpretation and surface the assumption; or
- ask one focused clarification when ambiguity materially changes meaning or causes an external/destructive effect.

Do not turn every ambiguity into a form or confirmation dialog.

# Interaction-compression principle

> **A common creative intention should usually require one gesture or one short input.**

Examples:

| Creative intention | Desired interaction |
| --- | --- |
| Add the next story idea | type it / press Enter |
| Reorder two story ideas | say the desired result, or manipulate them in a chosen lens |
| Turn a paragraph into rough structure | one processing action |
| Use a quote earlier | one conversational instruction or a direct Paper/Radio move |
| Add a clip as evidence | drop it near relevant text or into project context |
| Add visual coverage for a spoken moment | describe/drop it; Salai infers the relationship |
| Make a 60s version into 30s | one instruction producing a reviewable batch |
| Understand why a section feels dense | open the relevant lens and inspect/ask |

The system may perform many typed operations internally. The user should not have to execute them individually unless intentionally working at that level through a lens.

# Trust and review model

The 0B-era assumption that every AI change should be individually proposed and explicitly accepted would recreate the same interaction problem.

0C should test **graduated autonomy**.

## Reversible in-project normalization

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
- stable identity where possible;
- the result is immediately visible in relevant Narrative Lenses.

## Clarification-required actions

Ask when ambiguity changes creative meaning materially and a reasonable reversible interpretation is not available.

The clarification should be about the creative choice, not the data model.

Bad:

> Which ParentRef should this Beat use?

Good:

> Should this be part of the installation sequence, or a separate section after it?

## Explicit-confirmation actions

Require explicit confirmation for high-impact or external side effects, including later:

- destructive deletion when recovery is not obvious;
- modifying a real Resolve timeline;
- replacing source bindings;
- publishing/exporting;
- paid or expensive generation;
- irreversible filesystem/media operations.

The goal is **fewer confirmations, placed at the correct boundary**.

# Change/history model

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

For the spike, keep the implementation small:

- compile/validate the full batch before publishing live state;
- publish once on success;
- retain the pre-batch immutable project/Workspace snapshot;
- restore that snapshot for one-step revert.

Do not introduce event sourcing or general inverse-operation synthesis merely to validate this behavior.

# Structured state as a compiler target and perception surface

The Narrative IR becomes more valuable in this direction, not less.

It has two complementary roles.

## Machine-facing intermediate representation

It allows:

- agents to reason without rewriting arbitrary documents;
- validation and duration calculation;
- media/source identity to survive restructuring;
- downstream systems to consume deterministic state;
- Resolve integration to materialize choices without parsing chat history.

## Human-facing narrative system

Through Narrative Lenses, the same structured state lets creators perceive:

- progression;
- pacing;
- density;
- audiovisual complexity;
- source/evidence distribution;
- coverage gaps;
- alternatives;
- structural balance.

A useful analogy is:

```text
creative input         source language
agent normalization    compiler
Narrative IR           intermediate representation
Narrative Lenses       human-readable analyses/views
Resolve                 downstream editorial target
```

The analogy is about separation of concerns, not about making creative work rigid or deterministic.

# Working document vs canonical truth

The free-form working text and conversation should **not automatically become canonical story storage**.

For 0C:

- retain raw text/conversation as user input/context;
- normalize committed meaning into Narrative IR;
- preserve attachments/source handles;
- allow unresolved text/notes to remain unstructured until needed;
- do not introduce a second full canonical document model;
- do not attempt bidirectional lossless synchronization between the scratch text and canonical state.

The canonical result should be understandable through change summaries and Narrative Lenses.

A later persistence phase may justify a durable `WorkingDocument`/session artifact. Do not add that domain object during 0C unless the prototype proves it necessary.

# Media normalization boundary

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

Attachment identity and canonical media/source identity remain distinct. Salai explicitly resolves an attachment to existing/new Asset/MediaSegment identity when canonical relationships are created.

Real transcription, segmentation, embeddings, and visual analysis remain later infrastructure unless a small implementation is required to make the interaction test credible.

# Resolve boundary

The free-form agent interaction must not become a hidden imperative command stream directly into Resolve.

The intended path remains:

```text
user intent / media
       ↓
agent normalization
       ↓
Salai canonical project state
       ↓
Narrative Lenses / validation
       ↓
validated materialization decision
       ↓
Salai Resolve adapter
       ↓
CutMaster / Resolve
```

This keeps Resolve automation downstream from product semantics and makes actions inspectable/repeatable.

# 0C prototype scope

Build the smallest prototype that can test both **interaction compression** and **structural insight**.

## Required

- a simple free-form text editor/scratch area;
- project-aware chat/instruction input;
- attachment/media-drop affordance using fixture-backed or mocked metadata;
- an agent/model call that can inspect current canonical state and input context;
- typed Salai authoring commands compiled into Narrative operations;
- grouped application of agent-produced operations;
- validation through `@salai/script-model`;
- user-visible summary of the resulting change batch;
- one-step undo/revert of the last agent batch;
- existing Outline, Story Wall, AV Script, and Paper/Radio surfaces available as Narrative Lenses over the same state;
- active-lens context available to the agent where useful;
- deterministic script-first and footage-first scenarios.

## Explicitly not required

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
- full command/event-sourcing architecture;
- a canonical `NarrativePulse` score/object.

# Suggested implementation shape

Start simple:

```text
React authoring surface
       ↓
AgentSession / AuthoringAgent adapter
       ↓
model provider
       ↓
Salai authoring commands
       ↓
compile + validate canonical operation batch
       ↓
existing SalaiController
       ↓
@salai/script-model
       ↓
Narrative Lenses
```

Do not adopt an agent framework until the spike demonstrates orchestration needs that cannot be handled by a small Salai-owned loop.

The provider should be replaceable. Local vs hosted inference is not part of the UX contract.

# Validation scenarios

## Scenario A — blank page

Input:

```text
Make a 30-second product story. Open on the pain of doing this manually,
show three quick installation moments, then end on the time saved.
```

Expected behavior:

- one submit creates a usable rough structure;
- no manual Beat/Cue creation is required;
- user can refine it conversationally;
- Outline and AV Script reveal the resulting structure when opened;
- the user can intentionally modify the result in either lens.

## Scenario B — messy authored draft

Input is a paragraph containing story copy, notes, uncertainty, and production comments.

Expected behavior:

- Salai separates likely story intent from unresolved notes;
- it does not force every line into canonical structure;
- “make this 45 seconds” produces a coherent batched revision;
- a lens can reveal where the runtime/density changed.

## Scenario C — footage-first

User drops mocked interview/source attachments and says:

```text
Build a short radio edit around the old manual process, what changed,
and the result. Keep Maria's wording exactly as recorded.
```

Expected behavior:

- source identity/ranges are preserved;
- sourced wording is not rewritten as authored speech;
- Salai creates/attaches necessary narrative structure;
- Paper/Radio exposes the evidentiary spine and exact source choices;
- direct source arrangement remains available when the user wants to work at that level.

## Scenario D — mixed media and missing coverage

User writes a rough story and adds several media attachments.

Expected behavior:

- the agent maps obvious supporting material;
- it identifies unsupported narrative moments;
- Coverage makes those gaps legible;
- user can ask about or directly inspect the gaps;
- later ShotIntent creation can use the same boundary.

## Scenario E — narrative-lens discovery

Give the user a story with a deliberate structural pattern, for example:

- an overloaded middle;
- one interview voice dominating several Beats;
- a Beat with disproportionate audiovisual complexity;
- several unsupported moments.

Expected behavior:

- the user can choose an appropriate Narrative Lens;
- the lens reveals something useful that was not obvious in free-form text/chat;
- direct manipulation inside the lens feels creatively meaningful rather than mechanical;
- the agent can reason with the lens context.

# Acceptance criteria

0C passes when human testing demonstrates all of the following:

1. A user can construct and revise a meaningful story primarily through free-form authoring without routine manual structure management.
2. Common structural changes can be expressed as one natural instruction or one intentional lens manipulation rather than a sequence of incidental model-management actions.
3. Agent-produced changes resolve to valid typed project operations; the model does not bypass Narrative IR invariants or canonical ID ownership.
4. Source-backed material remains source-backed and identifiable after agent reasoning/restructuring.
5. Narrative Lenses remain synchronized with canonical state.
6. At least some lenses provide creative insight that is meaningfully different from the free-form/chat representation.
7. Users can directly manipulate a lens when its representation is the chosen way of thinking.
8. Users can understand what the agent changed at the level of creative consequences without reviewing every low-level operation.
9. A user can undo/revert an agent-applied batch reliably.
10. Routine interaction does not require users to learn `ParentRef`, operation types, IDs, or other incidental implementation mechanics.
11. Domain concepts such as Beat/Cue may remain visible in a lens when they carry useful creative meaning.
12. Representative tasks require materially fewer explicit interactions than the 0B structured-authoring baseline.
13. No new canonical free-form document model is required merely to support the interaction.
14. The combined agent + lens workflow preserves user agency rather than collapsing into either model-management software or blind chat automation.

# Human-test focus

Measure creative friction **and** structural insight.

For each representative task record:

- number of user actions/inputs;
- number of times the user must think about incidental structure rather than story;
- number of clarifications requested by Salai;
- whether the user feels they are “operating software” or “working on the story”;
- whether agent changes are trusted and recoverable;
- which Narrative Lens, if any, the user opens voluntarily;
- why they opened that lens;
- whether the lens reveals something they did not notice in free-form authoring;
- whether direct manipulation in the lens is creatively meaningful or mechanical;
- whether agent + lens context work better together than either alone.

The target is not zero structured interaction.

The target is:

> **Interaction cost should scale with creative decisions, while structural visibility should increase creative understanding.**

# Open questions

0C must produce evidence for:

- Should free-form text or conversation be visually primary?
- Should processing happen continuously, on explicit command, or both?
- How much reversible normalization can auto-apply before trust falls?
- What constitutes one undoable agent batch?
- How should assumptions/uncertainty be shown without approval spam?
- Which internal structures are creatively meaningful enough to expose in each lens?
- Which existing lenses remain first-class and which become niche?
- How should active-lens context influence agent reasoning?
- Should users be able to ask questions directly “of” a lens?
- Does media dropping belong inline with text, in a tray, or both?
- Does a persistent working document become necessary, or is session context plus Narrative IR sufficient?
- What minimum media metadata makes the footage-first interaction credible before real analysis is implemented?
- Does genuinely messy agent-mediated input expose a Narrative IR semantic failure?
- Is “narrative pulse” best expressed through several derived indicators/lenses rather than a single score?

# Exit

If 0C succeeds, proceed to the local desktop/persistence phase with:

- agent-mediated free-form authoring as the low-friction default entry point;
- Narrative Lenses as first-class ways to understand and directly reshape the narrative system;
- the Narrative IR as the canonical contract connecting both to production and Resolve.

If it fails, do not compensate by adding more forms or hiding more structure. Determine whether the failure is in model reasoning, trust/review semantics, the free-form surface, the usefulness of the lenses, or the Narrative IR's ability to represent the requested intent.