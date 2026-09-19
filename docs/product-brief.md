# Salai Product Brief

## Product thesis

**Salai is an AI filmmaking interface with a heavy focus on narrative intents.**

Tell a story. See an early version. Direct it by responding to what you see. Salai keeps the intended meaning connected to references, shots, available media, and the current film as those decisions change.

```text
Tell → See → Direct → Update → See …
```

The product category is accepted, not something to avoid by inventing a larger architecture. The focus is whether narrative-aware iteration helps a filmmaker express and preserve their decisions. Distinctiveness is a hypothesis to test, not an established moat.

Direction accepted by the product owner on September 18, 2026; recorded in [ADR 0010](adr/0010-narrative-first-ai-filmmaking.md). This document describes the target product, not currently shipped generation features.

## Problem to solve

A filmmaker may know what a moment should communicate before knowing its exact dialogue, staging, camera, or edit. Early images make that intent easier to discuss, but each revision risks losing earlier decisions or requiring the user to reconstruct context across scripts, prompts, reference images, and takes.

The first problem is therefore not “manage a complete production graph.” It is **make the intended story visible early and make the next direction easy to apply without unnecessarily disturbing the rest**.

## Intended experience

A spoken story or written draft becomes an editable interpretation and a first visual pass. Breakdown is useful internal work, not a mandatory form-filling stage. References can arrive before the first pass or as a response to it.

The filmmaker can say “she already knows he is lying,” replace a location reference, edit a description, select another candidate, or later adjust a camera in 3D. These are different ways to direct the same project.

Start with stills. Use a timed still animatic to examine order and duration. Request genuinely generated cheap motion when motion matters. Higher quality is an explicit investment, not an automatic next step or the only valid ending.

Show the current film while new work runs. Preserve prior results and accepted selections. Explain what is being updated and why, but do not make the user maintain a dependency graph.

## Narrative focus

Narrative intent is what a moment should communicate or change: an audience inference, a character decision, an emotional turn, an argument, or a reveal. “Make her doubt him earlier” is different from “use a wider lens.” Salai should retain both, without reducing intent to the latest prompt string.

A generated image can match its inputs and still fail creatively. The filmmaker judges that. Salai can retain notes and offer interpretations; it must not pretend to prove audience understanding or infer every consequence of a story change.

## Initial audience and scope

Start with a solo filmmaker or a small creative team exploring a short, story-driven piece. The initial pilot is story-first and stills-first, followed by cheap-motion review. Existing footage/source semantics remain supported foundations; a broad footage-first documentary workflow is not a parallel initial milestone.

The original 3D requirement remains in the product direction: optional per-shot placement of characters, props, camera, and lights. It follows the basic loop rather than blocking the first useful still. HQ output, advanced continuity, and specialist finishing similarly come later.

## What stays small

One canonical project, one shared service, and ordinary references between existing story objects and future media records. Generated results retain the inputs used to produce them. A changed input can prompt review; it does not justify automatic creative correction or paid regeneration.

There is no initial enterprise lifecycle system, generalized satisfaction model, graph database, build-system framework, or Git-like branch/merge product. Prompt guidance is authored project content; backend prompts are derived requests with saved provenance.

## Boundaries and evidence

Salai owns the story and enough structural editing/playback to review it. It does not own a full finishing NLE, a foundation model, or a general agent runtime. External execution stays behind existing architectural boundaries.

Prior experiments established useful model, shared-state, and playback foundations, but did not validate this filmmaking loop. The [active plan](filmmaking-implementation-plan.md) separates those foundations from required new work. The earlier standalone timeline-depth milestone is paused; its human findings are not erased.

Success means a filmmaker can give a meaningful narrative note, see a useful revision, and retain accepted work with less bookkeeping. It does not require proving that no competitor can offer a similar experience. Pricing remains undecided pending that evidence.
