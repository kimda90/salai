# Salai Competitive Landscape

Status: lightweight positioning reference for product discovery. Last reviewed: 2026-08-31.

This is not a feature checklist. Its purpose is to keep Salai's differentiation honest as adjacent tools evolve.

## Current positioning

Salai is no longer defined primarily as a companion for DaVinci Resolve.

The accepted product boundary (ADR 0009) is:

> **Salai owns narrative construction + structural editorial. Specialist NLEs such as Resolve are optional downstream precision/finishing environments.**

The differentiation therefore needs to survive comparison not only with planning/script tools, but also with modern AI-assisted editors and browser-native timeline products.

The strongest product test is:

> **Does Salai preserve useful narrative/production meaning while the story is actually played and structurally edited in time?**

# Story / writing systems

## Causality

Causality is one of the closest conceptual references.

Relevant overlap:

- Beat-centered story modeling;
- script, whiteboard, and timeline representations over related story objects;
- story structure independent from final screenplay formatting;
- causes/effects, tags, research/boneyard material, grouping, and alternate ways to inspect structure.

Important lessons for Salai:

- the durable innovation is persistent story identity, not any particular board UI;
- narrative order and dependency should not be conflated;
- long-running dimensions such as character/theme/storyline do not scale well as permanent lanes;
- multi-membership/duplicated representation creates synchronization complexity;
- forcing categorization too early consumes creative bandwidth;
- disconnected relationship canvases become separate mini-apps unless they use the same semantic objects;
- research/boneyard material should survive removal from the active structure;
- exposing every dimension simultaneously can become cognitively paralyzing.

Salai differs by extending semantic identity beyond authored story structure into source evidence, production need, real/generated media, and playable structural editorial.

Official reference:

- https://www.hollywoodcamerawork.com/causality.html

## Final Draft / WriterDuet / Arc Studio / Plottr

Relevant overlap:

- outline/Beat/card representations;
- script ↔ outline synchronization;
- story elements and structural planning;
- alternate ways to inspect story progression.

Implication for Salai:

Screenwriting/outlining quality is not enough differentiation. Salai must remain useful after media exists and while the story is being played/structurally edited.

Representative references:

- https://www.finaldraft.com/products/features/
- https://www.writerduet.com/
- https://www.arcstudiopro.com/
- https://plottr.com/

# Story → production systems

## StudioBinder

Relevant overlap:

- scripts and AV scripts;
- breakdowns;
- storyboards, mood boards, and shot lists;
- scheduling/production management;
- media-oriented production planning.

Implication for Salai:

Traditional pre-production planning is already well served. Salai's opportunity is the lower-friction connection from story meaning into source/production material and active structural edit rather than broad production administration.

Official reference:

- https://www.studiobinder.com/

## Celtx

Relevant overlap:

- Beat/script development;
- breakdown/scheduling/call-sheet workflows;
- centralized production data.

Implication for Salai:

Avoid becoming a generalized production-management suite. The differentiated layer is semantic continuity from intent through media and edit.

Official reference:

- https://www.celtx.com/

## Scriptation

Relevant overlap:

- script markup through production;
- revision continuity;
- script supervision / notes / media annotation.

Implication for Salai:

Production continuity is useful evidence, but Salai should anchor continuity to semantic narrative/media identity rather than primarily to PDF/script pages.

Official reference:

- https://scriptation.com/

# Footage-first / text-first editorial systems

## Lumberjack Builder

Relevant overlap:

- documentary/reality transcript workflow;
- source transcript selections;
- Selects → Story / paper-edit construction;
- export back to an NLE.

Core precedent:

```text
media → transcript ranges → selects → story → timeline
```

Implication for Salai:

This strongly validates the footage-first path and stable source excerpts. Salai extends the flow by connecting those source selections to persistent narrative intent and, after ADR 0009, to its own playable structural assembly rather than requiring the NLE as the first place the story can be experienced.

Official reference:

- https://www.lumberjacksystem.com/builder-help/

## StoryToolkitAI

Relevant overlap:

- local-first transcription/indexing/search;
- transcript groups and Story Editor;
- Resolve integration;
- local/optional model backends;
- editorial export.

Implication for Salai:

StoryToolkitAI is a strong technical neighbor for real-media reverse scripting. Salai's stronger thesis is a persistent narrative/production model that can begin before or after footage and remains connected through structural editorial.

Repository:

- https://github.com/octimot/StoryToolkitAI

## Adobe Premiere Pro

Relevant overlap:

- professional timeline editing;
- transcript-based editing;
- semantic/media-intelligence search;
- generative extensions;
- direct relationship between transcript and timeline.

Implication for Salai:

Transcript editing, semantic search, and AI-assisted timeline operations are commodity directions. Salai must connect media operations to durable narrative/production meaning rather than competing only on editing convenience.

Official references:

- https://www.adobe.com/products/premiere.html
- https://www.adobe.com/products/premiere/ai-video-editing.html

## Descript

Relevant overlap:

- transcript/text-native video/audio editing;
- source media synchronized to text edits;
- scene + timeline workflow;
- AI-assisted editing and generation.

Implication for Salai:

“Edit video like a document” is not sufficient differentiation. Salai must preserve why media exists in the story, what source/intent it satisfies, what is missing, and what alternatives remain.

Official reference:

- https://www.descript.com/video-editing

## Avid ScriptSync / PhraseFind

Relevant overlap:

- script/transcript ↔ source-media association;
- dialogue/media search;
- long-standing professional precedent for semantic lookup tied to editorial source.

Implication for Salai:

Script/media linkage alone is not enough; Salai's opportunity is the broader narrative/production layer around those associations.

Official reference:

- https://www.avid.com/

# Specialist NLEs

## DaVinci Resolve

Resolve remains an important downstream target, but it is no longer a required runtime/editorial dependency for Salai.

Relevant overlap:

- professional timeline editing;
- transcription and AI-assisted media/editorial workflows;
- IntelliScript rough-cut generation;
- color, Fusion, Fairlight, delivery.

Implication for Salai:

Salai should not attempt to beat Resolve at specialist finishing. It must instead prove that its semantic timeline/rough structural editorial is useful because it understands narrative identity, source evidence, production need, alternatives, and missing material in ways a conventional NLE timeline does not.

Downstream handoff remains explicit and optional. When Resolve automation is used, ADR 0004 keeps CutMaster behind a Salai-owned adapter.

Official references:

- https://www.blackmagicdesign.com/products/davinciresolve/
- https://documents.blackmagicdesign.com/SupportNotes/DaVinci_Resolve_21_New_Features_Guide.pdf

# AI-native creative environments

## Runway

Relevant overlap:

- generative video/media creation;
- agent-assisted editing;
- timeline-based assembly;
- generation and editing increasingly coexist in one workspace.

Implication for Salai:

Natural-language editing and generation inside a timeline are rapidly becoming expected capabilities. Salai's differentiation must come from the semantic story/production model underneath those operations, not from adding an agent beside a timeline.

Official reference:

- https://runwayml.com/

## Adobe Firefly

Relevant overlap:

- unified project media/generation history;
- timeline/video editing;
- generated image/video/audio in working context;
- provenance/content-credential direction.

Implication for Salai:

Generation should appear in story context as candidate production material rather than through a separate canonical AI project. Salai should preserve narrative intent and production lineage while generated material moves into the structural edit.

Official reference:

- https://www.adobe.com/products/firefly.html

## Krea

Relevant overlap:

- realtime steering;
- multimodal inputs;
- generation/editing across shared sessions/workflows;
- reduced “prompt → wait → result” separation.

Implication for Salai:

The prompt should be treated as one contextual control modality rather than the organizing metaphor for the whole application.

Official reference:

- https://www.krea.ai/

## Figma Weave

Relevant overlap:

- connected generative workflows;
- visible references/branches/transformation history;
- multimodal creative canvas;
- generated output treated as material for continued work.

Implication for Salai:

Visible lineage/alternatives are valuable, but Salai should expose **creative/narrative provenance**, not general computational node graphs.

Official reference:

- https://www.figma.com/solutions/figma-ai-tool-weave/

## ComfyUI

Relevant overlap:

- explicit local generative workflow graphs;
- model/tool composability;
- visible provenance of computational operations.

Implication for Salai:

ComfyUI is a useful local-generation infrastructure/reference, not a product UI blueprint. Salai should hide model plumbing behind narrative/production intent.

Official reference:

- https://github.com/comfyanonymous/ComfyUI

## Gradio

Relevant overlap:

- multimodal component model;
- text + file inputs;
- media can be both input and output;
- image/audio/video interactions assembled quickly around model workflows.

Implication for Salai:

The useful trend is that any creative object can become input to another operation. Salai should apply that principle through current semantic focus rather than copy Gradio's application structure.

Official reference:

- https://www.gradio.app/

# Spatial planning / canvas systems

## Milanote / PureRef

Relevant overlap:

- freeform mixed-media arrangement;
- visual references, notes, clips/images;
- alternatives kept nearby;
- weak semantic coupling between objects and downstream edit.

Implication for Salai:

Spatial work remains a useful creative mode, but the canvas should place references to the same canonical objects used elsewhere. Geometry belongs to Workspace state unless explicitly promoted to meaning.

## Excalidraw

Open-source implementation reference for a future Story Spine/Arrange experiment.

Relevant strengths:

- mature embeddable React canvas;
- images/arrows/free drawing;
- MIT license;
- spatial interaction without forcing a node-processing model.

0D deliberately defers this experiment until the temporal semantic spine is validated.

Repository:

- https://github.com/excalidraw/excalidraw

# Browser-native editor infrastructure references

These are implementation references rather than direct product competitors.

## `@moritzbrantner/timeline-editor`

Selected for Spike 0D as the first controlled React timeline interaction layer.

Useful properties:

- host-owned state;
- replaceable clip/track rendering;
- timeline movement/resize/split/markers/transport mechanics;
- MIT license.

Repository:

- https://github.com/moritzbrantner/timeline-editor

## Elah

Selected for Spike 0D as the first playback/materialization adapter.

Useful properties:

- browser-native deterministic playback/timeline architecture;
- modular core;
- current core/timeline/editor packages licensed Apache-2.0;
- avoids writing a custom media engine before validating the product interaction.

Repository:

- https://github.com/elahlabs/elah

## Mediabunny

Relevant low-level TypeScript/WebCodecs media foundation used by modern browser-editor projects.

0D does not add a direct dependency unless Elah fails to provide a required capability.

Repository:

- https://github.com/Vanilagy/mediabunny

## Cutaway / OpenCut

Relevant as an open-source browser-video-editor architecture/code reference.

Use it to study media adapters, timeline mechanics, local-first project behavior, WebCodecs, and testing patterns rather than forking the complete application.

Repository:

- https://github.com/S07K/cutaway

## OpenReel Video

Relevant working browser-NLE reference for WebCodecs/WebGPU timeline/playback/export patterns.

Again, the value is implementation reference rather than adopting its project model.

Repository:

- https://github.com/syntax-syndicate/openreel-video-editor

## OpenTimelineIO

Relevant future downstream interchange technology.

Implication for Salai:

OTIO may help materialize structural editorial decisions to multiple specialist NLEs, but its Clip/Track timeline model must remain downstream of Salai's Beat/Cue/source/production semantics.

Repository:

- https://github.com/AcademySoftwareFoundation/OpenTimelineIO

# Market map

| Problem | Strong examples |
| --- | --- |
| Story structure | Causality, Arc Studio, Plottr |
| Screenplay authoring | Final Draft, WriterDuet |
| Story → preproduction | Celtx, StudioBinder |
| Freeform spatial ideation | Milanote, PureRef |
| Script/source → footage lookup | Resolve IntelliScript, Avid ScriptSync |
| Footage → text edit | Premiere, Descript |
| Documentary paper edit | Lumberjack Builder |
| Local AI media understanding | StoryToolkitAI |
| AI-native generation + editing | Runway, Firefly, Krea |
| General generative workflow canvas | Weave, ComfyUI |
| Professional finishing | Resolve, Premiere, Avid |

Salai's target space is the connective layer:

> **intent ⇄ source/production need ⇄ real/generated/missing media ⇄ playable structural edit ⇄ optional specialist finishing**

# Current positioning test

Salai should remain defensible if another product adds any single feature below:

- transcript editing;
- script-to-timeline rough cuts;
- semantic footage search;
- storyboards;
- sticky-note boards;
- review/comments;
- GenAI generation;
- natural-language editing/chat;
- timeline playback;
- Resolve automation.

The product thesis depends on the combination:

> **Let filmmakers express intent naturally, normalize intent and source media into durable narrative/production context, experience that context in time through a semantic structural edit, and keep it connected into optional downstream finishing.**

The strongest current competitive question is:

> **If the timeline looks like a normal clip editor with semantic labels added, Salai is not differentiated enough. If the semantic layer materially changes how the creator reasons about timing, evidence, missing material, and alternatives while watching the story, the product has a distinct center.**
