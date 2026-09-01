# Salai Glossary

Canonical product/domain terminology. Implementation constraints belong in [`narrative-ir-spec.md`](narrative-ir-spec.md); current structural-editorial execution belongs in [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).

## Narrative terms

### Script

Canonical semantic narrative structure for a Salai project. It is not a particular editor document, chat transcript, screenplay format, or third-party timeline document.

### Section

High-level ordered narrative grouping inside a Script.

### Scene

Optional structural grouping inside a Section. A Section may contain Scenes and/or direct Beats when the Narrative IR permits it.

### Beat

Smallest intentional unit of narrative progression: a meaningful change in information, emotion, argument, causality, or another story dimension.

### Cue

Audiovisual/temporal moment used to express part of a Beat. A Beat may contain one or several Cues. Cue is canonical domain identity but need not be user-facing terminology in every interaction.

### ContentBlock

Typed visual or audio content attached to a Cue, such as visual description, authored speech, source excerpt, sound, or music.

### AuthoredSpeech

Editable words intentionally created for the production, including voiceover, presenter copy, scripted dialogue, or accepted agent-generated authored copy.

### SourceExcerpt

Media-backed excerpt whose wording/timing originates from recorded material. It preserves source/media identity and source range and must not silently become editable authored speech.

## Production terms

### ShotIntent

Required production realization independently of whether it has been captured, found, generated, represented as previs, or remains missing.

### MediaSegment

Stable reference to a useful time range/segment of source media.

### Asset

Concrete media or production artifact such as captured footage, audio, still, generated media, plate, graphic, or other reusable project material.

### Coverage

State of how narrative/ShotIntent needs are or are not realized by available production material. A dedicated Coverage representation is introduced only when real production-graph workflows prove what form it should take.

### ResolveBinding

Persisted mapping between Salai identity and corresponding DaVinci Resolve project/timeline/media identity when Resolve integration is used. ResolveBinding is optional downstream integration state, not part of Salai's core editing requirement.

## Structural editorial terms

### Structural editorial

Salai-owned temporal/media editing required to construct, play, judge, and revise an audiovisual story while preserving narrative and source identity.

The accepted boundary includes semantic timeline/playback, rough assembly, narrative/media reorder, source-range trimming, and basic picture/audio arrangement as validated by workflows.

It explicitly does not imply full specialist-NLE finishing such as advanced precision trim, multicam, compositing, color, full audio post, mastering, or delivery.

### Semantic timeline

Temporal projection of Salai-owned narrative/source state that keeps Section/Beat/Cue identity and relevant media/source realization visible in actual time.

The semantic timeline is a product interaction surface, not a separate canonical timeline document. Third-party timeline-library data is derived from Salai state.

### Structural assembly

Current playable rough audiovisual arrangement derived from Salai canonical state and any justified structural-editorial state.

It is sufficient to experience the story in time. Renderer-specific tracks/clips/caches used to play it are materialization details, not canonical project truth.

### Timeline projection

Salai-owned derived representation used to map canonical semantic identity into a timeline UI. It references stable Salai IDs and can be regenerated from current project state.

### Playback materialization

Conversion of current Salai structural assembly into the engine-specific representation required to play/render it.

Playback materialization is replaceable and downstream of Salai semantics.

### Specialist NLE

A downstream editing/finishing environment such as DaVinci Resolve used for capabilities beyond Salai's structural-editorial boundary: precision editorial, advanced post, compositing, color, audio finishing, mastering, and delivery.

Specialist NLE use is optional for Salai's core product workflow.

## Interaction terms

### Agent-mediated authoring

Validated low-friction interaction capability: the user expresses creative intent through working text, natural-language instructions, and relevant media/source context while an external harness interprets the task and Salai applies validated canonical project changes.

Spike 0C human validation using Codex demonstrated that this interaction works correctly and materially reduces routine structural bookkeeping.

The agent is an interaction/normalization layer, not a second source of project truth.

### Normalization

Interpreting low-structure creative input and converting committed meaning into validated canonical changes without requiring the user to perform every structural operation manually.

### Working text

Free-form material used to think, draft, instruct, and provide context before or alongside normalization. It is not automatically the canonical Script and may contain unresolved notes/questions/alternatives.

### Attachment

Media/document/reference handle supplied to the current authoring context. Early spikes may use mocked metadata; later attachments may resolve explicitly to persistent Asset/MediaSegment identity.

### Agent action

One user-understandable agent-applied change that may contain several canonical `NarrativeOperation`s. Spike 0C validated grouped apply/revert behavior around this unit.

### Graduated autonomy

Trust policy in which clearly requested reversible local changes may apply as grouped undoable actions, meaningful ambiguity triggers focused clarification, and high-impact external effects remain behind explicit user action.

### Narrative Lens

Structured representation of the same canonical project that deliberately emphasizes one aspect of the narrative system so the creator can perceive/manipulate it from that angle.

0B/0C validated Outline, Story Wall, AV Script, and Paper/Radio Edit as coherent lenses over one project. They are not assumed to be the final top-level product navigation after the structural-editorial pivot.

A lens may be implemented as a Projection, Workspace, or combination. “Lens” describes creative purpose; Projection/Workspace describe state ownership.

### Projection

Deterministic presentation derived from Salai-owned project data. It owns no independent narrative truth. Existing examples include Outline, AV Script, Paper/Radio Edit, and the 0D semantic timeline projection.

### Workspace

Persistent human organization around canonical objects that is not inherent to narrative semantics. Validated example: Story Wall position/parking state.

### Board

Spatial Workspace surface containing BoardItems. Board is a UX/Workspace concept, not Narrative IR.

### BoardItem

Item placed on a Board. It may reference a canonical object while separately storing Workspace metadata such as position or parking state.

### IdeaCard

Free-form Workspace item not yet canonical narrative/production data. It may later be promoted/interpreted into canonical structure.

### Story Wall

Spatial Narrative Lens/Workspace based on card/sticky-note story construction.

### Outline

Narrative Lens/Projection for hierarchy, progression, and structural proportion.

### AV Script

Narrative Lens/Projection for Beat/Cue visual/audio realization and timing.

### Paper Edit

Source-evidence Narrative Lens/Projection for arranging and inspecting recorded excerpts, authored bridges, source identity, and narrative placement.

### Radio Edit

Audio-first use of the source-evidence lens focused on spoken sequence, voice distribution, duration, and pacing.

### Frame Wall

Later spatial Narrative Lens/Workspace candidate for comparing representative frames, takes, or selected moments from real media.

## Architecture terms

### Narrative IR

Versioned semantic representation that keeps narrative identity stable across authoring, source evidence, production planning, semantic projections, structural editorial, and later downstream integration.

### SalaiController

Application boundary currently coordinating canonical Narrative IR, Workspace state, selection, feedback, and UI publication without redefining domain semantics.

### SalaiProjectService

Product-level name for the shared application boundary used by human UI and machine clients. The current implementation may remain the existing controller rather than adding a redundant state owner.

## Spike terms

### Spike 0A

Pure-TypeScript experiment that validated the Narrative IR before UI, persistence, downstream NLE integration, or real AI integration. **Complete/pass.**

### Spike 0B

Structured-authoring UX experiment over Story Wall, Outline, AV Script, and Paper/Radio. It validated synchronized semantic architecture but found that routine direct structured manipulation creates too much interaction burden. **Closed/mixed.**

### Spike 0C

External-agent authoring experiment. Human validation using Codex confirmed that an external harness can operate the live Salai project correctly and make routine structural interaction materially more convenient while Salai remains canonical. **Complete/pass.**

### Spike 0D

Current semantic-editorial experiment. It validates a playable semantic timeline, rough structural assembly, direct temporal editing through Salai operations, and agent ↔ temporal UI coherence without requiring Resolve. **Current.**
