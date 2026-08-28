# Salai Product Requirements Document

## Status

Living PRD. Current product stage: discovery and validation.

## Product statement

Salai is a local-first, narrative-aware production companion for DaVinci Resolve. It lets filmmakers express story intent naturally through writing, conversation, and media, then normalizes that input into structured narrative/production context that can be inspected through specialized views and eventually materialized into Resolve.

## Problem

Video production is fragmented across writing, planning, shooting, reviewing, editing, VFX, audio, color, graphics, and increasingly GenAI.

Traditional NLEs are strong at manipulating media on a timeline, but broader production context is usually distributed across documents, bins, notes, memory, and external tools.

Users repeatedly need to answer questions such as:

- What idea is this moment trying to communicate?
- Which footage or quote supports that idea?
- What coverage is missing?
- Which alternatives were considered or rejected?
- What changed when the structure changed?
- Can a missing element be shot, found, generated, or represented as previs?

The result is context loss between story, production, and edit.

Spike 0B exposed a second problem: a correct structured representation can still be creatively unusable if users must manually manage too much of that structure. The first human UX test found that the direct Story Wall/Outline/AV/Paper authoring model requires too much interaction to remain in creative flow.

## Product thesis

> **Express intent naturally; Salai structures it for production.**

Salai should maintain one semantic project model while accepting low-friction creative input:

- free-form text;
- conversational instructions/questions;
- media and source material;
- later other references and generated/previs material.

An agent layer interprets and normalizes that input into canonical project operations.

The architectural principle remains:

> **One Narrative IR, multiple synchronized views.**

Views such as Outline, AV Script, Story Wall, Paper/Radio Edit, Coverage, and later Frame/Selects surfaces should manipulate the same underlying project state. They are specialized inspection/precision tools, not mandatory authoring stages.

Users should not need to understand Salai's internal data model to use the product.

## Product discovery observations

Current product discovery has surfaced several concrete workflow observations:

- narrative thinking is often idea-first: the creator cares first about what the audience should understand or experience, not how many shots or lines are required;
- one Beat may therefore need several Cues, while no additional semantic level below Cue has yet been justified;
- creative validation is progressive: an idea may work on the page, fail when shot, or only reveal its strengths/weaknesses once edited in context;
- rejected material is commonly retained nearby or in alternate timelines/versions rather than permanently deleted;
- spatial proximity can be useful for alternatives, but spatial organization should not become mandatory interaction overhead;
- lower-friction previs could move meaningful creative feedback earlier;
- 0B validated the shared Narrative IR / Workspace / projection architecture;
- the first 0B human test found excessive interaction burden across the direct structured authoring workflow;
- the next hypothesis is that an agent should perform routine structural normalization on behalf of the user.

See [`research-notes.md`](research-notes.md) for the evidence record.

## Target users

Primary initial audience:

- solo professional videographers;
- small production teams and agencies;
- branded/corporate content producers;
- documentary and interview editors;
- professional YouTube/educational creators;
- Resolve Studio users with recurring scripted or story-driven work.

## Jobs to be done

### Primary authoring

- Write or paste a rough story without deciding its final hierarchy first.
- Ask Salai to restructure, shorten, expand, compare, or explain the story in ordinary language.
- Drop media/source material into the project and have Salai understand how it may support the story.
- Ask what is missing, unsupported, unresolved, or contradictory.
- Make one creative request without manually executing every underlying structural operation.
- Understand and undo what Salai changed without reviewing every low-level operation.

### Script-first

- Develop an idea into a usable narrative before shooting.
- Explore structure without committing to a timeline.
- Plan visual/audio expression and required coverage when useful.
- Understand approximate runtime while writing.
- Preserve intent from authored text through capture and edit.

### Footage-first

- Provide existing footage and interview material without manually converting it into story objects first.
- Turn source material into a narrative without losing source identity.
- Associate source excerpts and visuals with story intent.
- Build a radio/paper-edit structure before committing to a timeline.
- Preserve exact recorded wording/ranges while allowing authored bridges and summaries.

### Production and edit

- Know what material exists for each narrative need.
- Keep alternatives and rejected ideas available without cluttering active structure.
- Create downstream Resolve edits without duplicating story state.
- Treat generated media as normal production media with provenance.

## Core product concepts

### Beat

The smallest intentional unit of narrative progression. A Beat may advance information, dramatic action, argument, emotion, or understanding.

### Cue

An audiovisual/temporal moment used to express part of a Beat. Cue is domain identity and does not need to be visible in every user-facing workflow.

### ShotIntent

A statement of what production material is needed, independent of whether it is captured, found, generated, or represented as previs.

### SourceExcerpt

A media-backed excerpt whose words/timing come from recorded material rather than authored copy.

### Projection

A deterministic view over canonical project data, such as Outline or AV Script.

### Workspace

Persistent human organization around canonical objects, such as a Story Wall or later media board.

### Agent-mediated authoring

The interaction layer in which the user expresses intent through free-form text, conversation, and media while Salai interprets that input and produces constrained canonical project changes.

### Change batch

A user-understandable group of one or more typed project operations produced from one creative instruction and reversible as a unit during the 0C prototype.

## Product principles

1. **Creative intent before structure.** The user should normally state the desired result instead of performing model bookkeeping.
2. **Meaning before media.** Story intent is not defined by a clip, shot, or timeline item.
3. **One source of truth.** Working text, conversation, Workspaces, and Projections must not become competing canonical documents.
4. **Interaction cost follows creative decisions.** A multi-operation change may still be one user action.
5. **Structured views are optional tools.** Users enter them when the representation helps, not to access routine operations.
6. **Stable identity.** Normal restructuring should not break source, production, or editorial relationships.
7. **Authored and sourced material stay distinct.** Recorded evidence is not editable fiction, including when an agent operates on it.
8. **Alternatives stay recoverable.** Rejected/tried material should be easy to move aside, revisit, or use in another version.
9. **Agent changes are constrained and recoverable.** Typed operations, validation, grouped history, and undo provide trust.
10. **Clarification is about creative meaning.** Do not ask users to choose internal object types/parents when Salai can infer them.
11. **External/destructive effects require stronger review.** Real Resolve changes, irreversible deletion, publishing, and costly generation should not silently auto-apply.
12. **Local-first media handling.** Large camera originals should not require cloud upload to use Salai.
13. **Resolve remains the NLE.** Salai should not rebuild frame-accurate editing, color, Fusion, Fairlight, or delivery.

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
- attachment/media intake at least through mocked or fixture-backed metadata;
- agent normalization into typed Narrative operations;
- grouped application and undo/revert of agent-generated operation batches;
- source-backed material remaining source-backed through agent-mediated changes;
- at least one synchronized structured view available for inspection/precision editing.

## P1 product requirements

After the agent-mediated authoring workflow is validated:

- persistent free-form/session context if the spike proves it necessary;
- Story Wall / card-based inspection/restructuring;
- AV Script precision authoring/planning;
- Paper/Radio source-evidence precision workflows;
- desktop/local project runtime;
- persistent production graph;
- Resolve handoff through reusable automation infrastructure;
- real-media reverse scripting;
- alternative story versions / paper edits;
- generated media as normal project assets;
- richer coverage and media-aware agent tools.

## Non-goals

Salai is not initially:

- a replacement NLE;
- a full screenplay-formatting competitor to Final Draft;
- a cloud MAM;
- a generic chatbot that simply converts natural language directly into Resolve commands;
- a standalone GenAI video generator;
- a fully autonomous unattended editing agent;
- a full VFX, color, audio, or delivery application;
- a graph-database product exposed to users;
- a generic node/canvas editor;
- a rich-text document model used as the canonical project database.

## Agent trust requirements

The product should test graduated autonomy rather than one approval rule for every action.

### Reversible local changes

May apply as one batch when clearly requested, provided they can be inspected and undone.

Examples:

- inferred Beat/Cue creation;
- narrative reordering;
- authored-copy changes;
- attaching provided evidence;
- other in-memory structural normalization.

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

## Business / product objectives

Near-term objectives remain validation rather than revenue optimization:

1. Preserve the proven Narrative IR/source identity semantics.
2. Prove agent-mediated input can reduce interaction without making project state unpredictable.
3. Prove the model works from both blank-page and footage-first entry points under messy, free-form input.
4. Prove structured views remain useful as optional synchronized representations.
5. Demonstrate a credible path into Resolve without Salai becoming an NLE or a brittle chat command shell.
6. Demonstrate that real and generated media can participate in the same production model.

## Success metrics

### Spike 0A — model validation

Complete/pass.

- All three required fixtures use the same core schema without workflow-specific forks.
- Stable IDs and relationships survive defined edit operations and serialization round-trips.
- Beat and Cue remain meaningfully distinct in all fixtures.
- AuthoredSpeech and SourceExcerpt coexist without ambiguous semantics.
- Runtime estimation is useful enough to detect structural over/under-duration.

### Spike 0B — structured workflow validation

Closed with mixed result.

Pass:

- multiple structured views share one canonical project;
- stable identity/source semantics survive cross-surface edits;
- Workspace state remains separate.

Fail:

- direct structured manipulation is too interaction-heavy to be the primary creative authoring model.

### Spike 0C — agent-mediated authoring validation

- A user can create a meaningful rough story from free-form text with one processing action and no manual Beat/Cue creation.
- A user can express common structural revisions as one natural instruction.
- Media/source attachments can be incorporated without manual relationship wiring.
- Agent output resolves to valid typed project operations.
- SourceExcerpt identity/ranges remain intact.
- One user intention can produce a grouped, understandable, undoable change batch.
- Structured views reflect the resulting canonical state without export/import.
- Representative tasks require materially fewer explicit user interactions than the 0B baseline.
- Human testers report that interaction attention tracks creative choices more than software/model mechanics.

### Early product validation

Before claiming product-market fit, Salai should be tested on real projects covering at least:

- short scripted product/branded content;
- interview/corporate content;
- footage-first documentary/editorial work.

Quantitative adoption/retention targets should be set only after an instrumented alpha exists.

## Current milestone

**Spike 0C — Agent-Mediated Authoring.**

Spike 0A validated the Narrative IR. Spike 0B validated the shared structured-view architecture but failed the direct-manipulation creative-friction test.

The immediate goal is now to test free-form text + conversation + media input normalized into grouped, validated, reversible canonical changes while keeping the existing structured surfaces synchronized.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md), [`spike-0b-assessment.md`](spike-0b-assessment.md), and [`mvp.md`](mvp.md).
