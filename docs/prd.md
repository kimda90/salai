# Salai Product Requirements Document

## Status

Living PRD. Current product stage: discovery and validation.

## Product statement

Salai is a local-first, narrative-aware production companion for DaVinci Resolve. It keeps story intent, source material, shot intent, generated/captured media, and editorial decisions connected while letting filmmakers work through familiar creative workflows.

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

## Product thesis

> One Narrative IR, multiple familiar creative workflows.

Salai should maintain one semantic project model while allowing users to work through established creative paradigms such as:

- Outline;
- AV Script;
- Story Wall / sticky-note scene construction;
- Beat Board / scratch board;
- Paper Edit;
- Radio Edit;
- Shot/Coverage planning;
- later Frame Wall, Selects boards, previs, and timeline-oriented views.

Users should not need to understand Salai's internal data model to use the product.

## Product discovery observations

Current product discovery has surfaced several concrete workflow observations that inform, but do not by themselves commit, requirements:

- narrative thinking is often idea-first: the creator cares first about what the audience should understand or experience, not how many shots or lines are required;
- one Beat may therefore need several Cues, while no additional semantic level below Cue has yet been justified;
- creative validation is progressive: an idea may work on the page, fail when shot, or only reveal its strengths/weaknesses once edited in context;
- rejected material is commonly retained nearby or in alternate timelines/versions rather than permanently deleted;
- spatial proximity helps keep alternates "in hand" without cluttering the active sequence;
- lower-friction previs could move meaningful creative feedback earlier, before expensive production or timeline work;
- a mixed-media freeform canvas is a future research direction, not a committed product surface.

See [`research-notes.md`](research-notes.md) for the evidence record and its current implications.

## Target users

Primary initial audience:

- solo professional videographers;
- small production teams and agencies;
- branded/corporate content producers;
- documentary and interview editors;
- professional YouTube/educational creators;
- Resolve Studio users with recurring scripted or story-driven work.

## Jobs to be done

### Script-first

- Develop an idea into a usable narrative before shooting.
- Explore structure without committing to a timeline.
- Plan visual/audio expression and required coverage.
- Understand approximate runtime while writing.
- Preserve intent from script through capture and edit.

### Footage-first

- Review existing footage and interview material.
- Turn source material into a narrative without losing source identity.
- Associate source excerpts and visuals with story intent.
- Build paper/radio edits before committing to a timeline.

### Production and edit

- Know what material exists for each narrative need.
- Keep alternates and rejected ideas available without cluttering the active structure.
- Create downstream Resolve edits without duplicating story state.
- Treat generated media as normal production media with provenance.

## Core product concepts

### Beat

The smallest intentional unit of narrative progression. A Beat may advance information, dramatic action, argument, emotion, or understanding.

### Cue

An audiovisual/temporal moment used to express part of a Beat.

### ShotIntent

A statement of what production material is needed, independent of whether it is captured, found, generated, or represented as previs.

### SourceExcerpt

A media-backed excerpt whose words/timing come from recorded material rather than authored copy.

### Projection

A deterministic view over canonical narrative data, such as Outline or AV Script.

### Workspace

Persistent human organization around canonical objects, such as a Story Wall or Paper Edit.

## Product principles

1. **Meaning before media.** Story intent is not defined by a clip, shot, or timeline item.
2. **Familiar workflows over internal abstractions.** Users see cards, quotes, beats, scenes, selects, and scripts—not database relationships.
3. **One source of narrative truth.** Workspaces and projections must not become drifting duplicate documents.
4. **Stable identity.** Normal restructuring should not break source, production, or editorial relationships.
5. **Alternatives stay recoverable.** Rejected/tried material should be easy to move aside, revisit, or use in another version.
6. **Local-first media handling.** Large camera originals should not require cloud upload to use Salai.
7. **Resolve remains the NLE.** Salai should not rebuild frame-accurate editing, color, Fusion, Fairlight, or delivery.
8. **AI is assistive and reviewable.** AI should propose structure, media, or operations without silently replacing the user's project.

## P0 product requirements

The first validated product must support:

- one semantic narrative model for script-first and footage-first workflows;
- stable Sections/optional Scenes/Beats/Cues;
- authored content and source-backed excerpts;
- structural operations such as create, edit, move, split, merge, and delete;
- explicit relationships to ShotIntent and source material;
- approximate duration feedback;
- serialization without identity loss;
- at least one familiar script-first workflow and one footage-first workflow over the same model.

## P1 product requirements

After the Narrative IR is validated:

- Story Wall / card-based restructuring;
- AV Script authoring;
- Paper/Radio Edit workflows;
- desktop/local project runtime;
- persistent production graph;
- Resolve handoff through reusable automation infrastructure;
- real-media reverse scripting;
- alternative story versions / paper edits;
- generated media as normal project assets.

## Non-goals

Salai is not initially:

- a replacement NLE;
- a full screenplay-formatting competitor to Final Draft;
- a cloud MAM;
- a generic AI chat frontend for Resolve;
- a standalone GenAI video generator;
- a full VFX, color, audio, or delivery application;
- a graph-database product exposed to users.

## Business / product objectives

Near-term objectives are validation rather than revenue optimization:

1. Prove that the Narrative IR survives real creative restructuring.
2. Prove that familiar workflows can manipulate the same model without drift.
3. Prove that the model works from both blank-page and footage-first entry points.
4. Demonstrate a credible path into Resolve without Salai becoming an NLE.
5. Demonstrate that real and generated media can participate in the same production model.

## Success metrics

### Spike 0A — model validation

- All three required fixtures use the same core schema without workflow-specific forks.
- Stable IDs and relationships survive defined edit operations and serialization round-trips.
- Beat and Cue remain meaningfully distinct in all fixtures.
- AuthoredSpeech and SourceExcerpt can coexist without ambiguous semantics.
- Runtime estimation is useful enough to detect structural over/under-duration.

### Spike 0B — workflow validation

- Target users can recognize the intended Story Wall, AV Script, Outline, and Paper/Radio Edit paradigms without learning Salai's internal model first.
- Moving between those surfaces does not require export/import or duplicate story documents.
- Users can preserve alternates/rejects without losing them or confusing them with active structure.

### Early product validation

Before claiming product-market fit, Salai should be tested on real projects covering at least:

- short scripted product/branded content;
- interview/corporate content;
- footage-first documentary/editorial work.

Quantitative adoption/retention targets should be set only after an instrumented alpha exists.

## Current milestone

**Spike 0A — Narrative IR.**

The immediate goal is to validate the semantic model in a pure TypeScript package before implementing application UI, persistence, Resolve, or AI integrations.
