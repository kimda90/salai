# Salai Glossary

Canonical product/domain terminology. Implementation constraints belong in [`narrative-ir-spec.md`](narrative-ir-spec.md); detailed Narrative Lens behavior belongs in [`narrative-lenses.md`](narrative-lenses.md).

## Narrative terms

### Script

Canonical semantic narrative structure for a Salai project. It is not a particular editor document, chat transcript, or screenplay format.

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

State of how narrative/ShotIntent needs are or are not realized by available production material. The production graph and dedicated Coverage Lens are later than Spike 0C.

### ResolveBinding

Persisted mapping between Salai identity and corresponding DaVinci Resolve project/timeline/media identity when integration is implemented.

## Interaction terms

### Agent-mediated authoring

Current low-friction interaction hypothesis: the user expresses creative intent through working text, natural-language instructions, and relevant media/source context while Salai normalizes committed meaning into canonical project changes.

The agent is an interaction/normalization layer, not a second source of project truth.

### Normalization

Interpreting low-structure creative input and converting committed meaning into validated canonical changes without requiring the user to perform every structural operation manually.

### Working text

Free-form material used to think, draft, instruct, and provide context before or alongside normalization. It is not automatically the canonical Script and may contain unresolved notes/questions/alternatives.

### Attachment

Media/document/reference handle supplied to the current authoring context. Early spikes may use mocked metadata; later attachments may resolve explicitly to persistent Asset/MediaSegment identity.

### Agent action

One user-understandable agent-applied change that may contain several canonical `NarrativeOperation`s. In Spike 0C it is the unit for change summary and one-step revert.

### Graduated autonomy

Trust policy in which clearly requested reversible local changes may apply as grouped undoable actions, meaningful ambiguity triggers focused clarification, and high-impact external effects remain behind explicit user action.

### Narrative Lens

Structured representation of the same canonical project that deliberately emphasizes one aspect of the narrative system so the creator can perceive/manipulate it from that angle.

Existing lenses: Outline, Story Wall, AV Script, Paper/Radio Edit. Later candidates include Coverage and Frame Wall/Selects.

A lens may be implemented as a Projection, Workspace, or combination. “Lens” describes creative purpose; Projection/Workspace describe state ownership.

### Projection

Deterministic presentation derived from canonical project data. It owns no independent narrative truth. Existing examples include Outline, AV Script, and Paper/Radio Edit.

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

Source-evidence Narrative Lens/Projection for arranging and inspecting recorded excerpts, authored bridges, source identity, and narrative placement before timeline commitment.

### Radio Edit

Audio-first use of the source-evidence lens focused on spoken sequence, voice distribution, duration, and pacing.

### Frame Wall

Later spatial Narrative Lens/Workspace candidate for comparing representative frames, takes, or selected moments from real media.

## Architecture terms

### Narrative IR

Versioned semantic representation that keeps narrative identity stable across authoring, source evidence, production planning, Narrative Lenses, and later editorial integration.

### SalaiController

Application boundary currently coordinating canonical Narrative IR, Workspace state, selection, feedback, and UI publication without redefining domain semantics.

## Spike terms

### Spike 0A

Pure-TypeScript experiment that validated the Narrative IR before UI, persistence, Resolve, or real AI integration. **Complete/pass.**

### Spike 0B

Structured-authoring UX experiment over Story Wall, Outline, AV Script, and Paper/Radio. It validated synchronized semantic architecture but found that routine direct structured manipulation creates too much interaction burden. **Closed/mixed.**

### Spike 0C

Current agent-mediated authoring + Narrative Lens experiment. It validates one script-first flow, one fixture-backed source flow, grouped apply/revert, one agent↔existing-lens round trip, and human evidence of interaction compression plus structural insight.