# Salai Glossary

This is the canonical lookup for Salai product/domain terminology. Implementation-level constraints belong in [`narrative-ir-spec.md`](narrative-ir-spec.md); this glossary defines what the terms mean to the product.

## Narrative terms

### Script

The canonical narrative structure for a Salai project. It is semantic production data, not a particular editor document, chat transcript, or screenplay format.

### Section

A high-level ordered narrative grouping inside a Script.

### Scene

An optional structural grouping inside a Section. A Section may contain Scenes and/or direct Beats when the Narrative IR permits it.

### Beat

The smallest intentional unit of narrative progression. A Beat may advance information, emotion, argument, causality, or another meaningful story change.

### Cue

An audiovisual/temporal moment used to express part of a Beat. A Beat may contain one or several Cues. Cue is canonical domain identity but does not need to be exposed as user-facing terminology in every Narrative Lens.

### ContentBlock

A typed piece of visual or audio content attached to a Cue, such as a visual description, authored speech, source excerpt, sound, music, or related content.

### AuthoredSpeech

Editable words created for the production, such as voiceover, presenter copy, scripted dialogue, or agent-generated authored copy accepted into the project.

### SourceExcerpt

A media-backed excerpt whose words/timing originate from recorded material rather than authored prose. It preserves source/media identity and source range and must not silently become editable authored speech.

## Production terms

### ShotIntent

A required production realization independently of whether it has already been captured, found, generated, represented as previs, or remains missing.

### MediaSegment

A stable reference to a useful time range or segment of source media.

### Asset

A concrete media or production artifact such as captured footage, audio, still, generated media, plate, graphic, or other reusable project material.

### Coverage

The state of how narrative needs / ShotIntents are or are not realized by available production material.

### ResolveBinding

A persisted mapping between Salai identity and corresponding DaVinci Resolve project/timeline/media identity when integration is implemented.

## UX and interaction terms

### Agent-mediated authoring

The primary low-friction interaction hypothesis introduced after Spike 0B: the user expresses creative intent through free-form text, conversation, and media while Salai interprets and normalizes that input into constrained canonical project changes.

The agent is an interaction/normalization layer, not a second source of project truth.

### Normalization

The process of interpreting free-form creative input and converting committed meaning into validated canonical project changes without requiring the user to perform every structural operation manually.

### Working text

Free-form authored material used to think, draft, instruct, and provide context to Salai before or alongside normalization. Working text is not automatically the canonical Script and may contain unresolved notes, questions, alternatives, or production comments.

### Attachment

A media/document/reference item supplied to the current authoring context. In early spikes an attachment may use mocked metadata; later it may resolve explicitly to persistent Asset/MediaSegment identity.

### Change batch

A user-understandable group of one or more typed canonical operations produced from one creative instruction. During agent-mediated authoring, a batch is the minimum unit for change summary and one-step revert in the 0C prototype.

### Graduated autonomy

The trust model in which clearly requested reversible local changes may apply as grouped undoable batches, meaningful ambiguity triggers focused clarification, and high-impact external effects remain behind explicit user action.

### Narrative Lens

A structured representation of the same canonical Salai project that deliberately emphasizes one aspect of the narrative system so the creator can perceive and manipulate it from that angle.

Examples include:

- Outline — hierarchy/proportion;
- Story Wall — spatial rhythm/alternatives;
- AV Script — audiovisual density/realization;
- Paper/Radio Edit — evidence/voice/source pacing;
- Coverage — gaps between intent and realization.

A Narrative Lens is not merely an advanced settings screen or fallback editor. It is a first-class creative way to see and shape the story.

A lens may be implemented as a Projection, a Workspace, or a combination. “Lens” describes creative purpose; Projection/Workspace describe state ownership.

### Narrative pulse

A current product metaphor for patterns that emerge from the canonical story across several dimensions, such as progression, pacing, density, alternation, repetition, source/voice distribution, audiovisual complexity, coverage completeness, structural balance, and unresolved intent.

Narrative pulse is **not currently a canonical domain object or universal quality score**. 0C should test whether lenses and derived indicators make these patterns useful before formalizing anything further.

### Projection

A deterministic presentation derived from canonical project data. Examples include Outline, AV Script, Paper/Radio Edit, Teleprompter, and Coverage. A Projection does not own a drifting copy of the story.

### Workspace

Persistent human organization around canonical objects that is not inherent to narrative semantics. The validated 0B example is Story Wall position/parking state; later examples may include Frame Wall or Selects/alternative boards.

A Workspace is optional. Ordinary authoring should not require spatial organization merely to modify the story.

### Board

A spatial Workspace surface containing BoardItems. Board is a UX/workspace concept, not part of Narrative IR.

### BoardItem

An item placed in a Board. It may reference a canonical object such as a Beat or Scene while separately storing validated layout metadata such as position or parking state.

### IdeaCard

A free-form Workspace item that has not yet become canonical narrative/production data. It can later be promoted or interpreted into canonical structure.

### Story Wall

A spatial Narrative Lens/Workspace based on card or sticky-note story construction. It can reveal rhythm, balance, turning points, alternatives, and clustering while preserving Workspace-owned position/parking separately from canonical narrative order.

### Outline

A Narrative Lens/Projection for inspecting and precisely manipulating hierarchy, progression, and structural proportion.

### AV Script

A Narrative Lens/Projection for inspecting and manipulating Beat/Cue visual/audio realization, audiovisual density, timing, and production intent.

### Paper Edit

A source-evidence Narrative Lens/Projection for arranging and inspecting interview excerpts, visual evidence, authored bridges, source identity, and narrative placement before committing to a timeline.

### Radio Edit

An audio-first Narrative Lens focused on source excerpts, authored spoken material, voice distribution, spoken duration, sequence, and pacing.

### Frame Wall

A later spatial Narrative Lens/Workspace for comparing representative frames, takes, or selected moments from real media.

## Architecture terms

### Narrative IR

The versioned semantic representation that keeps narrative identity stable across authoring, source evidence, production planning, agent normalization, Narrative Lenses, and later editorial integration.

It acts as the structured intermediate representation between messy creative input and deterministic specialized views/downstream systems.

## Spike terms

### Spike 0A

The pure-TypeScript experiment that validated the Narrative IR before UI, persistence, Resolve, or real AI integration. Complete/pass.

### Spike 0B

The structured authoring-UX experiment that tested Story Wall, Outline, AV Script, and Paper/Radio Edit over the validated Narrative IR. It validated the synchronized semantic architecture but showed that using direct structured manipulation as the routine path creates too much interaction burden.

### Spike 0C

The agent-mediated authoring + Narrative Lens experiment. It tests free-form text, conversation, and media normalized into grouped, validated, reversible canonical changes while also testing whether structured lenses provide valuable narrative insight and meaningful direct manipulation.