# Salai Product Discovery Notes

This document records concrete workflow observations gathered during product discovery. These are **observations and research inputs**, not architecture decisions or committed requirements.

When an observation becomes a product requirement, technical proposal, or accepted decision, it must be reflected in the PRD, implementation plan, RFC, or ADR rather than silently promoted here.

Accepted current decisions are recorded elsewhere:

- external harness owns agent runtime — ADR 0008;
- Salai owns structural editorial and specialist NLEs are optional downstream — ADR 0009;
- current validation iteration — Spike 0D implementation plan.

# Narrative / interaction evidence

## Narrative thinking is idea-first

The atomic creative concern is the **idea or piece of narrative progression the audience should receive**, not the number of shots, dialogue lines, or graphics needed to express it.

A single idea may require one shot or many audiovisual moments.

This supports keeping Beat and Cue separate:

- Beat = intended narrative progression;
- Cue = audiovisual moment used to express that progression.

## Creative validation is progressive

A production idea is rarely validated once.

A common loop is closer to:

```text
read / imagine
    ↓
shoot, find, or generate
    ↓
watch the material
    ↓
place it in context
    ↓
edit until it feels right
```

An idea may read well and fail when captured; footage may look good and fail in context.

Salai should preserve intent and alternatives as work moves through these levels rather than treating an early decision as permanently committed.

## Rejected material is often moved aside, not destroyed

Editors commonly keep rejected ideas, takes, scenes, or alternate structures nearby rather than deleting them immediately.

This supports keeping `remove from active structure` and `delete permanently` distinct.

## Spatial proximity can keep alternatives “in hand”

Keeping alternatives physically or visually nearby is useful because material can remain accessible without cluttering the active sequence.

The Story Wall / Workspace parking-lot concept preserves this behavior.

0B human evidence also showed that spatial organization should not become mandatory interaction overhead. Spatial organization is useful when the creator chooses to think spatially.

## Previs can move the feedback loop earlier

Low-friction previs may let the creator feel the idea before expensive production.

```text
write / restructure
       ↓
cheap visual approximation
       ↓
feel the idea earlier
       ↓
revise before expensive production
```

Previs/generation should connect to the same narrative/production/assembly state rather than becoming a separate canonical GenAI workflow.

# Spike evidence

## Spike 0B — routine structured authoring creates too much friction

The 0B human test found:

> **The prototype requires too much user interaction to be creatively useful as the routine authoring path.**

The user was repeatedly required to operate the structure of the product instead of simply expressing the intended story change.

Examples included:

- explicitly creating and parenting narrative objects;
- selecting a structural destination before expressing an idea;
- manually managing spatial placement vs narrative order;
- switching surfaces because a particular operation was exposed there;
- translating one creative intention into several UI actions;
- thinking about Beat/Cue/Scene mechanics before those distinctions were creatively relevant.

The implementation simultaneously showed that the Narrative IR can support these operations safely.

The problem was therefore interaction, not representational failure.

## Structured representations remain creatively useful

The follow-up finding was not “hide the Narrative IR completely.”

A creator may deliberately want to see:

- hierarchy;
- progression;
- spatial balance;
- turning points;
- audiovisual density;
- source/evidence distribution;
- missing realizations;
- runtime proportion;
- alternatives.

This produced the Narrative Lens concept and the principle:

> **Hide structural bookkeeping, not narrative structure.**

## Spike 0C — external agent is convenient in practice

Human validation was completed with Codex as the external harness.

Observed result:

- Codex operated the live Salai project correctly through the machine interface;
- keeping an agent in the loop materially reduced the inconvenience of routine structural manipulation compared with 0B;
- Salai remained canonical project truth;
- conversation/model/session infrastructure did not need to become Salai project state.

This moves external-agent viability out of open discovery and into validated product architecture. See `spike-0c-assessment.md` and ADR 0008.

# Causality research

Causality is one of the closest conceptual references because it treats story Beats as persistent identity across script, whiteboard, and timeline representations.

Important lessons from its public product/history:

## Same semantic objects across representations

Causality's valuable precedent is not its particular whiteboard. The same underlying Beat can appear in script, whiteboard, and timeline.

Salai should preserve this principle as media/time surfaces expand: UI objects should reference canonical Salai identity rather than become separate documents that synchronize later.

## Narrative order and dependency are different

Causality's whiteboard originally behaved more like a dependency graph and evolved toward timeline/order behavior because users interpreted it spatially as sequence.

Lesson: Salai should not infer causal/dependency semantics merely from temporal order or canvas position.

## Persistent lanes do not scale well

Causality's own product history shows that many long-running story dimensions represented as physical lanes become difficult to trace and maintain.

Characters, themes, arcs, emotions, source distribution, coverage, and other cross-cutting dimensions are better candidates for relationships, filters, or temporary perceptual probes than permanent spatial containers.

## Multi-membership creates synchronization complexity

Experiments allowing the same Beat to appear as membership in several lanes created substantial complexity.

Lesson: prefer one canonical object with many queryable dimensions over duplicated or multi-owned view objects.

## Forced categorization consumes creative bandwidth

Story/Beat boundaries can be fuzzy while thinking. Causality's development discussion repeatedly emphasizes the cognitive cost of requiring the writer to classify everything upfront.

This reinforces Salai's agent-mediated normalization and “structure when useful” approach.

## Disconnected canvases are dangerous

Causality removed a relationship canvas partly because its spatial relationships were not deeply connected to the rest of the product semantics.

A future Salai canvas/Story Spine should therefore place references to the same project objects used elsewhere; canvas geometry itself should remain Workspace state unless the user explicitly creates semantic meaning.

## Research/boneyard material should remain available

Causality's Research area preserves Beats/ideas outside active script order. This closely matches editorial practice of moving material aside rather than destroying it.

## Human cognitive bandwidth is a real product constraint

Causality's recent simplification work and cancellation feedback are a strong warning against displaying all story dimensions simultaneously.

Salai should favor temporary probes such as “show sources,” “show coverage,” or “show Alice's path” over permanently encoding every dimension into color, lanes, shapes, or separate canonical object types.

# Competitive workflow decomposition

The adjacent market solves pieces of the Salai problem:

| Problem | Strong references |
| --- | --- |
| Story structure | Causality, Arc Studio, Plottr |
| Screenplay authoring | Final Draft, WriterDuet |
| Story → preproduction | Celtx, StudioBinder |
| Freeform visual ideation | Milanote, PureRef, Excalidraw-like canvases |
| Script → footage matching | Resolve IntelliScript, Avid ScriptSync |
| Footage → text edit | Premiere Text-Based Editing, Descript |
| Documentary paper edit | Lumberjack Builder |
| Local AI footage understanding | StoryToolkitAI |
| Script markup through production | Scriptation |

The current Salai white space is the persistent connection:

```text
narrative intent
      ↕
production / realization need
      ↕
real / generated / missing media
      ↕
structural editorial assembly
```

# Modern creative-AI UI observations

Recent tools increasingly combine multimodal generation, spatial work, timeline/playback, and contextual prompting rather than treating “AI” as a separate destination.

Useful references include Krea, Runway, Adobe Firefly, Figma Weave, Freepik Spaces, ComfyUI, Gradio, and related generative-media environments.

These references are interaction research, not dependencies.

## Prompt is becoming a control rather than the whole application

The useful pattern is increasingly:

```text
focus/select creative material
        ↓
type / drag / draw / perform / generate / transform
        ↓
result remains in working context
```

Natural language should be one modality among direct manipulation, media selection, drawing, timing, and references.

## Every creative object can become an input

Modern multimodal systems increasingly allow images, clips, audio, text, masks, drawings, and prior outputs to become inputs to the next operation.

For Salai, that suggests contextual operations scoped by current project identity rather than a separate universal chat/generation page.

## Generation history is creative provenance

Generative work branches rapidly. A useful system preserves candidate lineage and allows comparison/selection rather than flattening every generation into a media bin.

Salai's semantic opportunity is to organize those branches around the narrative/production job they might perform rather than around model-processing nodes.

## Avoid becoming a node-processing product

ComfyUI-style graphs are excellent for computational workflows. Salai's graph of interest is different:

```text
story intent
   ↓
possible audiovisual expression
   ↓
candidate media
   ↓
selection
   ↓
structural edit
```

If visible relationships are introduced, they should communicate filmmaking meaning rather than model plumbing.

# Time / timeline observations

## Audiovisual stories are irreducibly temporal

Outline, boards, and paper edits reveal useful structure but cannot fully communicate duration, rhythm, overlap, silence, or how audiovisual material feels in sequence.

This was the main reason to pivot away from mandatory Resolve playback and toward Salai-owned structural editorial (ADR 0009).

## Semantic zoom is a promising timeline property

Salai has identity above the clip level:

```text
Section → Beat → Cue → source/media realization
```

A temporal surface can therefore reveal different semantic levels as the user changes scale rather than exposing only generic tracks/clips.

This is the central product hypothesis of Spike 0D.

## The timeline may be foundational rather than merely another lens

This remains a discovery question, correctly scoped to post-0D interpretation.

A possible model is that time becomes a persistent story spine while cross-cutting dimensions—coverage, sources, voice distribution, alternatives—become temporary overlays/probes.

Do not make this taxonomy canonical before 0D human evidence.

# Viewer / review observations

Filmmaking contains a repeated loop:

```text
construct
→ watch
→ judge
→ revise
```

A narrative-aware system should eventually make review actions attach to stable meaning where possible rather than fragile timeline timecodes alone.

Potential review interactions include identifying weak moments, marking useful source moments, creating missing-production intent at the playhead, or attaching observations to Beat/Cue/media identity.

These are later workflow questions; 0D first validates simple playback + structural revision.

# Sound observations

Audio cannot be treated only as decoration under picture.

Documentary work often begins as a radio edit, and narrative progression may depend on speech, music, ambience, silence, or SFX before picture exists.

Current Cue/audio ContentBlocks may remain sufficient; do not add an `AudioIntent` domain type without evidence. The 0D playback fixture should nevertheless include meaningful picture + audio so the temporal model is not accidentally picture-only.

# Alternatives / version-space observations

Undo and alternatives are different:

- **Undo** — the previous operation was unwanted;
- **Alternative** — multiple possibilities remain creatively legitimate.

Alternatives may exist at media-realization, Beat, Section, or full structural-edit levels.

Do not solve all levels with one generic version graph in the current iteration. Later workflow evidence should determine which identities deserve persistence.

# Continuity / world identity observations

Generated media increases pressure to preserve consistency of characters, locations, props, wardrobe, voice, time-of-day, and visual identity across separately produced realizations.

This may eventually justify persistent continuity/world constraints, but it does not belong in the Narrative IR until concrete production/generation failures demonstrate the required semantics.

# Provenance observations

Generated and transformed media can accumulate lineage such as:

```text
production intent
→ storyboard
→ generated previs
→ camera take
→ AI cleanup
→ structural/editorial use
```

Provenance should eventually help answer where material came from and why it exists, not merely satisfy technical metadata requirements.

The production-graph phase should preserve enough identity to expose this without making provider/model details canonical narrative meaning.

# Search / retrieval observations

Large projects require more than bins and filenames.

Useful queries include:

- unused close-ups of a character;
- interview excerpts about a concept excluding already-used material;
- visual material that could support a narrative intention;
- source material from a particular location/time/state;
- possible bridges between two current story moments.

The Salai-specific opportunity is retrieval in the context of current narrative intent rather than generic media similarity alone.

# Interaction-model observations

## Focus is a promising universal interaction scope

A user's current focus may be a whole project, Section, Beat, Cue, timeline range, SourceExcerpt, media segment, or later production realization.

Contextual commands can inherit that focus instead of requiring a permanent global chat pane.

This remains interaction research, not a canonical domain type.

## Write / Arrange / Play is a useful design hypothesis

One possible simplification of Salai's creative spaces is:

- **Write** — linear/semantic thought such as outline, paper/radio, AV planning;
- **Arrange** — spatial exploration, alternatives, references, story wall;
- **Play** — temporal assembly, viewer, rough structural editorial.

Do not store this as final navigation until human tests demonstrate it is better than other organizations.

## Story Spine is a later spatial hypothesis

A possible mixed temporal/spatial surface would keep active material on a temporal spine while references, alternatives, unused Beats, and generated candidates remain nearby off-spine.

This may combine the useful behaviors of a timeline, Murch-style scene cards, and generative branching.

Spike 0D deliberately tests the temporal spine first. Spatial expansion should follow only if the timeline proves valuable.

# Open-source implementation research for Spike 0D

These are concrete implementation references selected to retire commodity UI/media risk while keeping Salai semantics independent.

## `@moritzbrantner/timeline-editor`

Repository: https://github.com/moritzbrantner/timeline-editor

License: MIT.

Useful because it provides controlled React timeline mechanics while allowing the host to own document/selection/viewport/history and replace track/clip rendering.

0D decision: use it as the first timeline interaction adapter. Its document serialization is not Salai persistence.

## Elah / `@elah/core`

Repository: https://github.com/elahlabs/elah

License for current core/timeline/editor packages: Apache-2.0.

Useful because it provides browser-native deterministic playback/timeline/rendering infrastructure without requiring Salai to implement the media engine before testing product interaction.

0D decision: use `@elah/core` as the first playback/materialization adapter. Elah project state is derived and replaceable.

## Mediabunny

Repository: https://github.com/Vanilagy/mediabunny

Useful low-level TypeScript/WebCodecs media foundation and already used by modern browser-editor projects.

0D decision: do not add it directly unless Elah fails to expose a required capability. Avoid duplicate media stacks in the spike.

## Excalidraw

Repository: https://github.com/excalidraw/excalidraw

License: MIT.

Useful mature reference for a later spatial Story Spine/Arrange experiment.

0D decision: defer. Validate the semantic temporal spine before adding a canvas dependency.

## Cutaway / OpenCut and OpenReel

Useful open-source browser-editor references for architecture, media lifecycle, WebCodecs, local project behavior, and timeline implementation.

Decision: study/selectively reuse patterns if needed; do not fork either application or make its editor model canonical Salai state.

## OpenTimelineIO

Useful downstream interchange model for editorial materialization.

Decision: defer until the downstream NLE/interchange phase. OTIO must not become the canonical Salai timeline because it does not model Beat/Cue/source/production intent semantics.

# Current discovery interpretation

The next risk is not whether Salai can represent narrative semantics or whether an agent can conveniently manipulate them. Those questions have enough positive evidence from 0A–0C.

The active question is:

> **Does preserving narrative/source semantics on a playable timeline materially change how useful structural editing feels?**

That question is intentionally isolated in Spike 0D.
