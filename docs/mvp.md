# Salai MVP and Technical Spikes

## MVP goal

Validate that a Resolve companion with a persistent `story ↔ shot ↔ media ↔ timeline` graph is useful before building a broad production platform.

The MVP should prove four things:

1. Resolve can be integrated tightly enough to support the product.
2. Narrative objects can remain linked to media and timeline usage.
3. Paper-edit/story-level operations provide value above working directly in the NLE.
4. Generated media can enter the same production flow as captured media.

## Phase 0 — Resolve API spike

Build the smallest possible integration before committing to application architecture.

### Required experiments

- connect to the current Resolve instance;
- read current project;
- enumerate Media Pool bins/items;
- enumerate timelines;
- map timeline items to their source Media Pool items;
- read playhead/current timecode;
- determine whether current selection can be observed;
- create a bin;
- import media;
- write/read custom metadata where supported;
- add/read markers;
- create a timeline;
- append/insert specific source ranges;
- identify what events/callbacks/polling are available for project/timeline/selection changes.

### Output

A capability matrix documenting:

| Capability | Workflow Integration | Python/Lua API | Reliable? | Notes |
|---|---|---|---|---|

This matrix should drive the product design.

## Phase 1 — Production graph prototype

Implement only these domain concepts:

- Project
- NarrativeNode (beat/scene/script block)
- PlannedShot
- MediaAsset
- MediaSegment
- Relationship
- Edit
- EditEvent

### Required flow

1. Create a project and a few narrative beats.
2. Create planned shots linked to those beats.
3. Sync a Resolve project/media pool.
4. Manually link a Resolve clip or clip range to a planned shot.
5. Read a Resolve timeline and show which beats/shots are represented.

Success means Salai can answer:

- Which footage satisfies this planned shot?
- Which planned shots are still uncovered?
- Where is this shot used in the current Resolve timeline?
- Which narrative beats are absent from the edit?

## Phase 2 — Paper edit

Create a story-level edit representation independent from a Resolve timeline.

A paper edit is an ordered set of narrative/media segments with approximate duration and intent.

Required operations:

- drag/reorder beats;
- choose a linked media segment/take;
- duplicate a paper edit into an alternative version;
- compare high-level structural differences;
- materialize the selected paper edit as a new Resolve timeline.

No full NLE UI should be built.

## Phase 3 — GenAI backend spike

Define a minimal provider-independent interface.

```text
GenerationBackend
- capabilities()
- validate(request)
- submit(request)
- status(job)
- cancel(job)
- result(job)
```

### Initial operations

Limit to:

- text_to_image;
- image_to_video.

These are sufficient to validate generated storyboard/previs/coverage workflows.

### Initial backend

Start with ComfyUI.

The spike should:

1. register a known workflow template;
2. expose selected workflow inputs (prompt, source image, duration where applicable, seed);
3. submit the workflow programmatically;
4. observe execution state;
5. retrieve outputs;
6. copy outputs into Salai-managed project storage;
7. create provenance records;
8. import the result into the appropriate Resolve bin;
9. link the generated asset to a PlannedShot.

### Generated take behavior

A generated result should behave like a take:

```text
Shot 07A
├── camera-01.mov
├── camera-02.mov
├── gen-01.mp4
└── gen-02.mp4
```

No generated result should overwrite source media.

## Phase 4 — AI-assisted linking/reasoning

Only after the graph and Resolve integration work manually.

Potential capabilities:

- break script into beats and suggested shots;
- suggest clip/segment ↔ shot links;
- identify missing coverage;
- describe footage and propose narrative groupings;
- propose alternate paper-edit structures;
- explain structural changes before applying them.

AI suggestions should carry provenance/confidence and remain user-confirmable.

## Explicit non-goals for MVP

Do not build:

- a frame-accurate NLE;
- a standalone color system;
- a compositor;
- an audio workstation;
- a render farm;
- a proxy/media transcoding platform beyond what integration requires;
- a ComfyUI node editor;
- a generic MAM;
- broad cloud collaboration;
- mobile capture tooling;
- every GenAI provider.

## First validation scenario

Use one concrete 30–60 second scripted piece.

1. Write 5–8 narrative beats.
2. Plan 8–15 shots.
3. Import a small real footage set into Resolve.
4. Link footage to planned shots.
5. Observe coverage gaps.
6. Generate one missing shot through ComfyUI.
7. Ingest it as a normal Resolve asset.
8. Build two paper-edit alternatives.
9. Materialize one as a Resolve timeline.
10. Change the Resolve timeline and inspect how much linkage Salai can preserve.

This end-to-end scenario should be the primary product/architecture test before expanding scope.
