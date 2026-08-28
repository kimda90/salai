# Salai Product Requirements Document

## Status

Living PRD. Current product stage: discovery and validation.

## Product statement

Salai is a local-first, narrative-aware production companion for DaVinci Resolve. It lets filmmakers express story intent naturally through writing, conversation, and media, normalizes that input into structured narrative/production context, and lets creators deliberately inspect and reshape that context through **Narrative Lenses** before eventual materialization into Resolve.

## Problem

Video production is fragmented across writing, planning, shooting, media review, editing, VFX, sound, color, graphics, and GenAI.

Story intent gets disconnected from source material and the edit. Editors repeatedly carry context in their heads:

- what a scene or shot is trying to communicate;
- which footage supports that idea;
- what coverage is missing;
- which interview excerpt supports which story point;
- which alternatives were tried or rejected;
- what changed after restructuring;
- whether missing material should be shot, found, generated, or represented as previs.

Traditional NLEs manipulate media well but do not maintain this broader narrative/production context.

Spike 0B exposed an additional problem: even a correct structured representation can be creatively unusable when routine tasks force the user to manually manage too much hierarchy, parentage, wiring, and operation mechanics.

However, the same test also left an important positive role for structured UI: exposing the narrative system can help a creator understand its **pulse** and modify the story from a different angle.

The product must therefore balance two needs:

1. **reduce structural bookkeeping for ordinary creative intent**; and
2. **preserve intentional structural visibility for creative understanding and direct manipulation**.

## Product thesis

> **Express intent naturally; Salai structures it for production. See and reshape that structure through narrative lenses.**

The underlying architectural principle remains:

> **One Narrative IR, multiple synchronized views.**

The practical UX principle is:

> **Hide structural bookkeeping, not narrative structure.**

## Primary authoring model

The user can begin with:

- free-form text;
- conversational instructions/questions;
- media/source material;
- later references and generated/previs material.

A Salai-owned agent/normalization layer interprets that input and compiles it into validated canonical project operations.

```text
write / talk / drop media
          ↓
agent interpretation
          ↓
Salai authoring commands
          ↓
typed canonical operations
          ↓
Narrative IR / production context
```

The user should not need to manually create or wire every Beat, Cue, source relationship, or parent target for ordinary changes.

## Narrative Lenses

A Narrative Lens is a structured representation of the same canonical project that emphasizes one creative dimension.

Examples:

| Lens | Creative dimension |
| --- | --- |
| Outline | hierarchy, progression, proportion |
| Story Wall | spatial rhythm, balance, alternatives |
| AV Script | audiovisual density and realization |
| Paper / Radio Edit | evidence, voice, source pacing |
| Coverage | gaps between intent and realization |
| later Frame Wall / Selects | visual coverage and alternatives |

Narrative Lenses are **first-class creative tools**, not merely fallback editors.

They should expose structure when that structure helps the user reason, while hiding incidental mechanics such as raw IDs, `ParentRef`s, insertion indices, or unnecessary object creation.

Direct manipulation inside a lens remains supported when the lens itself is the user's chosen way of thinking.

See [`narrative-lenses.md`](narrative-lenses.md).

## Target users

Primary initial audience:

- solo filmmakers/editors;
- small production companies;
- documentary/interview editors;
- videographers producing commercial/corporate work;
- professional YouTube/educational creators;
- DaVinci Resolve Studio users with recurring story-driven work.

## Jobs to be done

### Low-friction authoring

- Write or paste a rough story without deciding final hierarchy first.
- Ask Salai to restructure, shorten, expand, compare, or explain the story in ordinary language.
- Drop media/source material into the project without manually converting it into story objects first.
- Ask what is missing, unsupported, unresolved, repetitive, or contradictory.
- Make one creative request without manually executing every underlying structural operation.
- Understand and undo what Salai changed without reviewing every low-level operation.

### Narrative understanding

- Open a structured lens when prose/chat no longer makes the story's shape obvious.
- See hierarchy, proportion, density, pacing, source distribution, or coverage gaps.
- Compare alternatives spatially or structurally.
- Understand how one narrative idea is realized through several audiovisual moments.
- Inspect why a section feels crowded, slow, repetitive, unsupported, or overproduced.
- Modify the story directly from the representation that best matches the current creative problem.

### Script-first

- Develop an idea into a usable narrative before shooting.
- Explore structure without committing to a timeline.
- Plan visual/audio expression and required coverage when useful.
- Understand approximate runtime while writing.
- Preserve intent from authored material through capture and edit.

### Footage-first

- Provide existing footage/interviews without manual story-object wiring.
- Turn source material into a narrative without losing source identity.
- Associate source excerpts and visuals with story intent.
- Build a radio/paper-edit structure before committing to a timeline.
- Preserve exact recorded wording/ranges while allowing authored bridges and summaries.

### Production and edit

- Know what material exists for each narrative need.
- Keep alternatives/rejected ideas available without cluttering active structure.
- Create downstream Resolve edits without duplicating story state.
- Treat generated media as normal production media with provenance.

## Core product concepts

### Beat

The smallest intentional unit of narrative progression.

### Cue

An audiovisual/temporal moment used to express part of a Beat. Cue is canonical domain identity and does not need to be visible in every workflow.

### ShotIntent

A required piece of production material independent from whether it has been captured, found, generated, or represented as previs.

### SourceExcerpt

A media-backed excerpt whose words/timing originate from recorded media rather than authored prose.

### Projection

A deterministic view over canonical project data.

### Workspace

Persistent human organization around canonical objects, such as Story Wall layout.

### Narrative Lens

A structured representation that deliberately exposes one aspect of the canonical narrative system so the creator can perceive and manipulate it from that angle.

### Agent-mediated authoring

The interaction layer in which the user expresses intent through free-form text, conversation, and media while Salai normalizes that input into constrained canonical project changes.

### Change batch

A user-understandable group of one or more typed project operations produced from one creative instruction and reversible as a unit during 0C.

## Product principles

1. **Creative intent before bookkeeping.** The user normally states the desired result instead of performing model mechanics.
2. **Hide bookkeeping, not structure.** Expose structural information when it carries creative meaning.
3. **Meaning before media.** Story intent is not defined by a clip, shot, or timeline item.
4. **One source of truth.** Working text, chat, lenses, and Workspaces must not become competing canonical documents.
5. **Narrative Lenses are first-class.** Structured views can be valuable ways to see and shape the story, not just administrative interfaces.
6. **Interaction cost follows creative decisions.** A multi-operation change may still be one user action.
7. **Direct manipulation remains available.** When a creator intentionally chooses a lens, manipulation inside that lens should feel native and precise.
8. **Stable identity.** Normal restructuring should not break source, production, or editorial relationships.
9. **Authored and sourced material stay distinct.** Recorded evidence is not editable fiction.
10. **Agent changes are constrained and recoverable.** Typed operations, validation, grouped history, and undo provide trust.
11. **Clarification is about creative meaning.** Do not ask users for internal object types/parents when Salai can infer them.
12. **External/destructive effects require stronger review.** Resolve changes, irreversible deletion, publishing, and costly generation should not silently auto-apply.
13. **Local-first media handling.** Large camera originals should not require cloud upload to use Salai.
14. **Resolve remains the NLE.** Salai should not rebuild frame-accurate editing, color, Fusion, Fairlight, or delivery.
15. **AI is a normalization/reasoning layer, not a second project model.**

## P0 product requirements

The first validated product must support:

- one semantic narrative model for script-first and footage-first workflows;
- stable Sections/optional Scenes/Beats/Cues;
- authored content and source-backed excerpts;
- explicit relationships to ShotIntent and source material;
- approximate duration feedback;
- serialization without identity loss;
- free-form authoring input that does not require manual structural object creation;
- conversational project instructions/questions;
- attachment/media intake using mocked or fixture-backed metadata where necessary;
- agent normalization into typed canonical operations;
- grouped application and undo/revert of agent-generated operation batches;
- source-backed material remaining source-backed through agent-mediated changes;
- existing structured surfaces available as synchronized Narrative Lenses;
- direct editing through those lenses when the representation is the user's chosen way of thinking;
- active-lens context available to agent reasoning where useful.

## P1 product requirements

After agent-mediated authoring + lens value are validated:

- persistent free-form/session context if evidence requires it;
- richer Story Wall/lens behavior;
- AV Script precision authoring/planning;
- Paper/Radio source-evidence precision workflows;
- Coverage and media-aware reasoning;
- desktop/local project runtime;
- persistent production graph;
- Resolve handoff through reusable automation infrastructure;
- real-media reverse scripting;
- alternative story versions / paper edits;
- generated media as normal project assets.

## Non-goals

Salai is not initially:

- a replacement NLE;
- a full screenplay-formatting competitor;
- a cloud MAM;
- a generic chatbot that converts natural language directly into Resolve commands;
- a fully autonomous unattended editing agent;
- a standalone GenAI video generator;
- a full VFX/color/audio/delivery application;
- a graph database exposed to users;
- a generic node/canvas editor;
- a rich-text document used as the canonical project database;
- a system that hides all narrative structure behind opaque AI output.

## Agent trust requirements

### Reversible local changes

May apply as one batch when clearly requested, provided they can be inspected and undone.

### Clarification-required changes

Ask one focused question when ambiguity materially changes creative meaning and no safe reversible interpretation is reasonable.

### Explicit-confirmation changes

Require confirmation for high-impact or external effects such as:

- irreversible deletion;
- actual Resolve timeline changes;
- destructive filesystem/media actions;
- publishing/export;
- expensive/paid generation;
- replacing source identity when recovery is unclear.

## Narrative-lens requirements

A useful lens should:

1. reveal a property of the story difficult to perceive in ordinary prose/chat;
2. operate on the same canonical project;
3. expose stable identity/relationships where useful;
4. allow direct editing when that representation is intentionally chosen;
5. avoid incidental domain mechanics unrelated to the creative question;
6. reflect agent changes automatically;
7. feed direct lens changes back into subsequent agent context;
8. allow entry/exit without export/import or state drift.

## Narrative pulse

“Narrative pulse” is a working product metaphor for patterns across the story such as pacing, density, repetition, voice distribution, audiovisual complexity, coverage completeness, and structural balance.

0C should test whether these patterns are usefully revealed through several lenses/derived indicators.

Do not introduce a canonical `Pulse` score/object without evidence.

## Business / product objectives

Near-term objectives remain validation rather than revenue optimization:

1. preserve the proven Narrative IR/source identity semantics;
2. prove agent-mediated input can reduce routine interaction without making project state unpredictable;
3. prove Narrative Lenses add creative understanding rather than merely exposing internals;
4. prove direct manipulation remains valuable when intentionally chosen;
5. prove the model works from blank-page and footage-first entry points under messy input;
6. demonstrate a credible path into Resolve without Salai becoming an NLE or brittle chat shell.

## Success metrics

### Spike 0A — model validation

Complete/pass.

### Spike 0B — structured workflow validation

Closed/mixed.

Pass:

- multiple structured views share one canonical project;
- stable identity/source semantics survive cross-surface edits;
- Workspace state remains separate.

Fail:

- making direct structured manipulation the routine path for ordinary creative work creates too much interaction burden.

### Spike 0C — agent-mediated authoring + Narrative Lens validation

0C should demonstrate:

- a meaningful rough story can be created from free-form text without manual Beat/Cue creation;
- common revisions can be expressed as one natural instruction;
- media/source attachments can be incorporated without manual relationship wiring;
- agent output resolves to valid typed operations;
- SourceExcerpt identity/ranges remain intact;
- one user intention can produce an understandable, undoable change batch;
- lenses reflect the resulting canonical state immediately;
- users voluntarily open at least some lenses because those views reveal useful narrative information;
- direct manipulation within a lens feels creatively meaningful when chosen;
- representative routine tasks require materially fewer explicit interactions than the 0B baseline;
- human attention tracks creative choices more than software mechanics;
- the combined agent + lens workflow preserves user agency better than either a form-heavy UI or blind chat alone.

## Current milestone

**Spike 0C — Agent-Mediated Authoring + Narrative Lenses.**

Spike 0A validated the Narrative IR. Spike 0B validated the synchronized-view architecture and exposed the routine interaction problem. The current goal is to validate free-form text + conversation + media normalized into grouped, reversible canonical changes while proving that structured Narrative Lenses remain valuable for understanding and shaping the story.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md), [`narrative-lenses.md`](narrative-lenses.md), and [`mvp.md`](mvp.md).