# Salai Glossary

Product terminology is defined here. Implemented fields and operations belong in [narrative-ir-spec.md](narrative-ir-spec.md); proposed additions belong in [RFC 0004](rfcs/0004-narrative-first-filmmaking-loop.md). A product term does not imply that a corresponding type or feature already exists. Current task state belongs in [the active plan](filmmaking-implementation-plan.md).

## Product terms

### Narrative intent

What a moment should communicate or change for the audience or a character: information, emotion, motivation, argument, or a reveal. Initially expressed in ordinary authored fields and direction, not a compulsory formal requirements object.

### Direction

A human instruction or direct manipulation intended to change the film. Its scope matters. The original note, an agent's interpretation, and the accepted project edit are distinct.

### Update

Bring a reviewed part of the current film toward accepted direction while preserving existing work. Editing the plan, requesting external generation, and selecting a result are separate actions.

### Generation guidance

Authored instructions/references attached to an appropriate project, narrative, subject, or shot scope. Planned versioning preserves readable prior guidance. A backend prompt is derived from relevant guidance, not a separate source of story truth.

### Stills / animatic / cheap motion

Stills are static candidates. An animatic plays stills or other rough material with timing. Cheap motion is actually generated or otherwise produced moving material at a low-cost review profile. These outputs answer different creative questions.

### Quality profile

A requested fidelity/cost choice, such as draft, low, or HQ. Separate from output kind. Higher quality requires explicit selection, not automatic promotion.

### Candidate / selected material

A candidate is available for review. Selected material is the candidate deliberately used in a particular place in the current assembly. Being newest does not make an asset selected, and one global choice must not accidentally change unrelated uses.

### Input freshness

Comparison between recorded generation inputs and current effective inputs. “Current” means they match; “needs review” means a relevant difference exists; “unknown” means comparison cannot be established. None proves creative adequacy.

## Narrative terms — implemented baseline

### Script

Canonical semantic narrative structure, not a formatted screenplay file, chat transcript, or timeline-engine document.

### Section

High-level ordered grouping. “Sequence” may label a Section in the filmmaking UI; it is not an additional implemented hierarchy type.

### Scene

Optional grouping inside a Section. Sections can contain Scenes and/or direct Beats under the existing model.

### Beat

Smallest intentional narrative progression: a meaningful change in information, emotion, argument, causality, or another story dimension. Not synonymous with a shot.

### Cue

Audiovisual/temporal moment expressing part of a Beat. It currently owns the canonical narrative-time interval. Cue need not be the label shown for every user interaction; it remains distinct from ShotIntent.

### ContentBlock

Typed visual/audio content belonging to a Cue. Several can coexist in each lane. Ordinary blocks do not currently own independent narrative offsets/durations.

### AuthoredSpeech

Editable words intentionally written for the production, including accepted AI-assisted dialogue or narration.

### SourceExcerpt

Recorded-media-backed evidence with stable media identity and source in/out. Rewriting a quote as authored copy is not a transcript/source edit.

## Production and media terms

### ShotIntent

Required production realization independent of whether material exists. The implemented type is a minimal stable reference with a description. Enriching that same identity with direction or optional staging is proposed; separate mandatory ShotIntent/ShotPlan/Realization hierarchies are not required.

### Shot

User-facing production framing/direction concept. Not a new narrative hierarchy level and not an authorization to rename or replace the implemented ShotIntent schema.

### Reference

Material offered to guide a particular decision, with explicit scope and intended use. A reference to layout need not also govern color, appearance, or performance.

### World

Convenient product shorthand for reusable characters, locations, props, and their references. Not a committed universal ontology, separate service, or mandatory graph.

### Staging

Optional shot-local spatial direction for subjects/props, camera, and lights. A future 3D engine materializes it; its internal scene document is not canonical Salai state.

### MediaSegment

Stable reference to a source-media range. Already present in the baseline model.

### Asset

Concrete reusable artifact: source recording, still, generated clip, audio, graphic, or previs output. A full asset/generation registry is proposed, not implied by the current MediaSegment stub.

### Generation request / provenance

Planned frozen record of what was requested, its target, effective inputs, profile, and actual execution parameters, linked to returned artifacts. Captured/imported media instead keeps real source/acquisition provenance; it must not be assigned fictional generation history.

### Coverage

Available material relative to stated needs. Initially a review aid such as missing shots or changed inputs, not proof that the audience receives the intended meaning. No standalone satisfaction engine is required.

### ResolveBinding

Optional downstream identity mapping when Resolve integration is implemented. Not part of the initial filmmaking loop.

## Editorial and interaction terms

### Structural editorial

Salai-owned work needed to construct, play, judge, and revise the story. Supports the filmmaking loop; does not imply full specialist finishing.

### Semantic timeline

A temporal view/interaction surface over canonical story and media state, not a second authoritative document.

### Hierarchical semantic timeline

The accepted 0E interaction direction for revealing nested detail without losing temporal context. The full standalone implementation program is paused; use it where the filmmaking loop needs it.

### Structural assembly

Current playable rough arrangement derived from canonical order, timing, and selected material.

### Timeline projection

Derived mapping into timeline UI mechanics, retaining Salai identity.

### Playback materialization

Replaceable conversion of the assembly into a player/renderer representation.

### Narrative time

Sequential time derived from canonical order and Cue duration. Not arbitrary free-positioned clip coordinates.

### Source I/O

The evidence range within a SourceExcerpt's MediaSegment, distinct from Cue duration.

### Specialist NLE

Optional downstream precision editing/finishing environment, such as DaVinci Resolve.

### Selection

Current object focus. UI state itself is not narrative truth. A submitted direction captures its target explicitly rather than following later selection changes.

### Multi-selection

UI selection of several objects. A grouped mutation requires clear shared meaning and atomic application.

### Inspector

Contextual controls for semantic properties of the selected object, not arbitrary engine fields.

### Semantic depth

How much nested detail is revealed, distinct from viewport zoom or canonical structure.

### Agent-mediated authoring

External-harness interpretation followed by validated changes to the same live project used by the UI. Already demonstrated in 0C; not evidence that new filmmaking tools exist.

### Normalization

Turning accepted low-structure input into valid project changes without requiring manual ID/parent management.

### Working text

Draft/input material, not automatically the canonical Script.

### Attachment

A supplied reference handle. A handle alone does not prove durable access to the underlying bytes.

### Agent action

One user-understandable change that may compile into several atomic canonical operations.

### Graduated autonomy

Clear reversible local changes may be grouped and applied; material ambiguity is reviewed; costly or external effects require approval.

## Views and state ownership

### Narrative Lens

A creative view emphasizing an aspect of the same project. Not a required top-level navigation mode.

### Projection

A derived presentation with no independent narrative truth.

### Workspace

Human organization around project objects, such as placement, parking, or view configuration, separate from narrative meaning.

### Board

A spatial Workspace containing BoardItems; not a second narrative model.

### BoardItem

A placed item referencing canonical material and carrying Workspace layout.

### IdeaCard

Free-form Workspace material not yet promoted into canonical story structure. Spatial position does not silently establish story order or causality.

### Story Wall

Spatial story-construction view validated as part of the earlier prototype.

### Outline

View of hierarchy, progression, and proportion.

### AV Script

View of visual/audio intent and timing.

### Paper Edit

A source-evidence view preserving source identity alongside authored bridges.

### Radio Edit

An audio-first use of the source-evidence view for voice, sequence, and pacing.

### Frame Wall

Possible later view for comparing frames/candidates, not an initial separate subsystem.

## Architecture and history

### Narrative IR

The canonical semantic narrative model. Its schema version is not the same thing as a future object's content revision.

### SalaiController

The existing controller implementing the shared application boundary.

### SalaiProjectService

Product-level name of the shared human/machine application boundary. Do not introduce a duplicate owner merely to match a name.

### Spike 0A

Narrative IR experiment; complete/pass.

### Spike 0B

Structured-authoring experiment; closed/mixed.

### Spike 0C

External-agent authoring experiment; complete/pass.

### Spike 0D

Semantic-editorial experiment; closed/mixed.

### Spike 0E

Accepted interaction-depth plan; standalone execution paused, not passed.

Historical evidence is indexed in [docs/README.md](README.md); detailed current work is tracked only in [filmmaking-implementation-plan.md](filmmaking-implementation-plan.md).
