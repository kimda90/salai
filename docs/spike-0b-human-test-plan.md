# Spike 0B — Human Workflow Test Plan

## Purpose

Validate the questions that code tests cannot answer: whether the four Salai authoring surfaces are recognizable, understandable, and useful as different ways of working with one story.

This is not a usability-polish test and not a feature-request session. The goal is to pressure-test the product model before moving beyond Spike 0B.

## Participants

Prioritize people who actually edit or shape video stories:

- editors;
- filmmakers who edit their own work;
- documentary / interview-driven editors;
- optionally one script-first writer/director who regularly hands material into editorial.

Three useful sessions are enough to start making decisions if patterns are strong. Add sessions when evidence conflicts rather than targeting a fixed sample size for its own sake.

## Setup

Use the deployed Spike 0B web build and its existing deterministic fixtures.

Ask participants to think aloud. Do not explain the Narrative IR, Workspace model, or the intended answer to any interaction question before they attempt it.

Capture:

- what they expected before each action;
- what they actually did;
- where they hesitated;
- terminology they used naturally;
- moments where they believed data/story intent had been lost;
- workarounds they invented;
- explicit requests only after observing the underlying problem.

## Session structure

### 1. Orientation — one story or four tools?

Open the product fixture in Outline.

Ask the participant to:

1. describe what they think they are looking at;
2. switch through Story Wall, AV Script, and Paper / Radio Edit;
3. explain what they believe changes and what remains the same between views.

Do not explain that the surfaces share one model.

**Observe:**

- whether the surfaces feel related;
- whether switching feels like navigation or opening another document;
- whether the participant expects edits to propagate.

### 2. Story Wall — spatial vs structural intent

In Story Wall, ask the participant to:

1. move a Beat card somewhere that feels useful spatially;
2. change the story order so one Beat comes before another;
3. park an idea they do not want in the active flow;
4. bring it back.

Do not tell them which control changes story order.

**Observe:**

- whether they expect free x/y movement to reorder narrative structure;
- whether they discover and understand Story Order;
- whether parking feels different from deletion;
- whether the spatial board feels useful enough to justify Workspace state.

### 3. Outline — hierarchy pressure test

Use or create a Section containing both a Scene and a direct Beat.

Ask the participant to:

1. explain the hierarchy in their own words;
2. move a Beat into a Scene;
3. move it back to the Section;
4. create a new Beat where they think it belongs.

**Observe:**

- whether mixed Scene/direct-Beat hierarchy is understandable;
- whether Scene feels necessary or artificial;
- whether invalid destinations are obvious;
- whether restructuring feels like editing the same story seen on the wall.

### 4. AV Script — Cue terminology and audiovisual planning

Open a Beat with multiple Cues.

Ask the participant to:

1. explain how they would plan several audiovisual moments inside the Beat;
2. edit visual intent;
3. edit authored audio;
4. move a Cue to another Beat;
5. describe what the word `Cue` means to them, without offering a definition first.

**Observe:**

- whether Beat vs Cue is a useful distinction;
- whether `Cue` is understandable or implementation jargon;
- whether visual/audio side-by-side planning feels familiar;
- whether users need a different label such as moment, shot, event, or no visible label at all.

### 5. Paper / Radio Edit — source evidence vs authored material

Switch to the interview fixture.

Ask the participant to:

1. identify which text came from recorded media and which text was written;
2. try to change a sourced quote;
3. edit the authored bridge;
4. rearrange source-backed material;
5. add or inspect visual intent associated with an audio moment.

**Observe:**

- whether sourced material is immediately recognizable as evidence;
- whether read-only source wording is expected;
- whether range/media identity information is useful or noisy;
- whether the participant wants a separate Paper Edit document or is comfortable with this being another projection of the same story.

### 6. Return loop — continuity check

Return to Story Wall and then Outline.

Ask:

- What do you expect to have changed here?
- What do you expect to have stayed exactly where you put it?
- Is anything missing or unexpectedly changed?

**Observe:**

- trust in cross-surface propagation;
- whether Workspace positions are expected to survive;
- whether source/authored identity still makes sense after moving through several workflows.

## Debrief questions

Ask only after the participant has performed the tasks:

1. Which view would you start from for a blank-page project?
2. Which view would you start from with hours of interviews or footage?
3. Which view felt most familiar? Least familiar?
4. Did any two concepts feel like the same thing with different names?
5. Was there a moment where you did not know whether you were changing presentation or changing the story?
6. What did `Beat`, `Scene`, and `Cue` mean to you by the end?
7. What information did you expect to follow you between views but did not?
8. Would you expect undo to cross view changes, or only undo actions inside the current view?

## Decision rubric

### Story Wall spatial vs structural

**Keep current split** if participants reliably distinguish free placement from Story Order after minimal discovery.

**Revise interaction** if they repeatedly assume x/y position is canonical order or cannot predict which action changes narrative structure.

### Mixed hierarchy

**Keep** if participants can explain direct Beats and Scene-contained Beats and use both intentionally.

**Constrain** if they repeatedly treat the hierarchy as an error or cannot predict move/create destinations.

### `Cue` terminology

**Expose in AV Script** if participants naturally understand or quickly adopt it as a useful audiovisual unit.

**Rename or hide per surface** if it reads as implementation language without helping the workflow.

### Paper Edit domain state

**Keep projection-only model** unless participants repeatedly need persistent paper-specific organization that cannot be represented as canonical Narrative IR or existing Workspace state.

### Narrative IR

Open an IR change only when a participant's desired workflow cannot be expressed without losing meaning or source identity. Do not change the model merely because a UI affordance is awkward.

## Session record template

For each participant, record:

```text
Participant role:
Primary workflow: script-first / footage-first / mixed

Strong successes:
- 

Confusions:
- 

Story Wall spatial-vs-structural observation:
- 

Mixed hierarchy observation:
- 

Cue terminology observation:
- 

Paper/Radio source-vs-authored observation:
- 

Cross-surface continuity observation:
- 

Potential Narrative IR failure:
- none / describe

Do not solve yet:
- feature requests or polish notes that are not model/workflow blockers
```

## Exit criteria

Human validation is sufficient to finish Spike 0B when there is evidence to make the outstanding decisions in `spike-0b-assessment.md`:

- Story Wall spatial vs structural interaction;
- mixed Scene/direct-Beat hierarchy;
- visible `Cue` terminology per surface;
- Paper / Radio workflow fit;
- shared selection expectations;
- any genuine Narrative IR failure.

At that point, update the assessment, tracker, RFC status, and roadmap/current-focus docs.
