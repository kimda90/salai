# Spike 0D — Human Validation Protocol

## Purpose

This is the only remaining evidence gate for Spike 0D.

Do not use this run to verify implementation details already covered by automated tests. The question is whether the semantic timeline/playback changes creative reasoning in a useful way.

Do not force a positive result. If a task feels awkward, the semantic layer feels decorative, or Resolve/generic timeline thinking would be clearer, record that directly.

## Setup

For the complete run, including the external-harness step:

```bash
pnpm install
pnpm dev
```

Open the spike demo using the URL printed by Vite and add:

```text
?fixture=semantic-editorial&bridge=1
```

The validation fixture should open directly on the Timeline surface. The root `dev` command starts both the UI and the local bridge.

After this branch merges, the viewer/timeline portion is also available from GitHub Pages at:

```text
https://kimda90.github.io/salai/?fixture=semantic-editorial
```

Use the local run for the agent step.

## Evidence rule

Record what you noticed **before** reading the expected technical behavior below. The first reaction is part of the evidence.

For each task, record:

- what you tried;
- what you expected;
- what happened;
- whether the semantic structure helped, did nothing, or got in the way.

## 1. First watch — pacing / realization

Reset the `0D semantic editorial` fixture. Watch the rough assembly once from beginning to end without editing it.

Record the first pacing, story-order, evidence, or realization problem you notice. Include the approximate time or Beat/Cue if you can identify it from the interface.

If you do not notice a useful problem, record that rather than inventing one.

## 2. Direct story-order edit

In **Story** semantic zoom, make one Beat reorder that you believe improves the story.

Watch the result again.

Record:

- Beat moved;
- old/new position;
- why you moved it;
- whether seeing Beat meaning and duration together affected the decision;
- whether the result behaved as one story edit rather than a clip-layout operation.

## 3. Source-backed trim

In **Media** semantic zoom, trim one SourceExcerpt edge to the duration that feels better in context.

Watch across the edit before and after trimming.

Record:

- excerpt/voice selected;
- source range before and after if visible/known;
- whether the source-backed identity still felt intact;
- whether the change felt like editing evidence or merely resizing a generic audio clip.

## 4. External harness change

With the browser opened using `bridge=1`, use Codex or another external harness that can run the repo CLI.

Give the harness this intent, without supplying IDs or operations:

> Inspect Salai's available tools and current project. Make one story-order or timing change that you think improves the rough assembly. Use only Salai's discovered machine interface. Tell me what you changed and why.

Then watch the updated assembly in Salai.

Record:

- what the harness changed;
- whether the result appeared in the same timeline/project without import/export or refresh bookkeeping;
- whether the harness had enough timing/context to make the request sensibly;
- anything it misunderstood.

## 5. Compare against a generic clip timeline

After completing the edits, answer these without trying to justify the product thesis:

1. Did the visible Beat/Cue/source/missing-realization structure change any creative decision you made, or was it mostly labels on a normal timeline?
2. Was there any moment where the semantic view made the timeline less clear or slower to use?
3. Which semantic level was useful: Story, Moments, Media, more than one, or none?
4. What information did you still have to hold in your head?

## 6. Resolve independence

Answer:

> Could you judge and improve this rough story from Salai alone, without opening Resolve?

Use one of:

- **Yes** — sufficient for this structural decision;
- **Partly** — useful, but a specific missing capability blocked confidence;
- **No** — Resolve or a conventional NLE was still necessary.

State the specific reason.

## Evidence to return

A compact response is enough:

```text
First problem noticed:
Direct Beat edit:
Source trim:
Harness change:
Semantic vs generic timeline:
Could judge without Resolve: Yes / Partly / No
Main friction or missing capability:
```

Screenshots or exact timecodes are optional; observations matter more.

## Pass / fail interpretation

Do not decide the gate from automated behavior alone.

Spike 0D has positive human evidence only if both are true:

1. the semantic layer materially affected at least one useful structural/editorial decision rather than merely decorating a conventional timeline; and
2. the rough story could be meaningfully judged and improved in Salai without requiring Resolve for that structural task.

A `Partly` answer can still be useful evidence, but the assessment must name the blocker and decide whether it invalidates the 0D thesis or defines the next smallest experiment.
