# Salai Glossary

This is the canonical lookup for Salai product/domain terminology. Implementation-level constraints belong in [`narrative-ir-spec.md`](narrative-ir-spec.md); this glossary defines what the terms mean to the product.

## Narrative terms

### Script

The canonical narrative structure for a Salai project. It is semantic production data, not a particular editor document or screenplay format.

### Section

A high-level ordered structural grouping within a Script. Depending on the production, a Section may represent an act, chapter, hook/problem/demo grouping, topic, or other major division.

### Scene

An optional scene-oriented structural grouping containing Beats. Scene is not required for every project type.

### Beat

The smallest intentional unit of narrative progression. A Beat may advance information, dramatic action, argument, emotion, revelation, or audience understanding. It is not defined by how many shots, lines, or clips are required to express it.

### Cue

An audiovisual/temporal moment used to express part of a Beat. A Beat may contain one or several Cues. Cue is canonical domain identity but does not need to be exposed as user-facing terminology in every workflow.

### ContentBlock

A typed piece of visual or audio content attached to a Cue, such as a visual description, on-screen text, authored speech, sourced excerpt, music, or SFX.

### AuthoredSpeech

Editable words created for the production, such as voiceover, presenter copy, scripted dialogue, or agent-generated authored copy accepted into the project.

### SourceExcerpt

A media-backed excerpt whose source range and words originate in recorded material. Its transcript is evidence/display data; editing the transcript must not pretend the underlying recording changed.

## Production/media terms

### ShotIntent

A statement of what production material is needed to express narrative intent, independent from how that need is realized. A ShotIntent may later be fulfilled by captured footage, stock, graphics, storyboard/previs, or generated media.

### Asset

A production media item or other reusable production artifact with stable identity. The concrete storage/location mechanism is separate from narrative semantics.

### MediaSegment

A referenced time range or meaningful portion of existing media. MediaSegments can act as source evidence, realizations of ShotIntents, or editorial/select material.

### Relationship

An explicit typed connection between stable domain objects. Salai uses relationship semantics without requiring a graph database.

### ResolveBinding

A persisted mapping between Salai identity and corresponding DaVinci Resolve project/media/timeline objects.

## UX terms

### Agent-mediated authoring

The primary interaction hypothesis introduced after Spike 0B: the user expresses creative intent through free-form text, conversation, and media, while Salai interprets and normalizes that input into constrained canonical project changes.

The agent is an interaction/normalization layer, not a second source of project truth.

### Working text

Free-form authored material used to think, draft, instruct, and provide context to Salai before or alongside normalization into canonical project state. Working text is not automatically the canonical Script and may contain unresolved notes, questions, or production comments.

### Attachment

A media/document/reference item supplied to the current authoring context. In early spikes an attachment may use mocked metadata; later it may resolve to persistent Asset/MediaSegment identity.

### Change batch

A user-understandable group of one or more typed canonical operations produced from one creative instruction. During agent-mediated authoring, a batch is the minimum unit for change summary and undo/revert.

### Projection

A deterministic presentation derived from canonical project data. Examples include Outline, AV Script, Teleprompter, and Coverage. A Projection does not own a separate drifting copy of the story.

### Workspace

A persistent human working surface that can reference canonical objects while storing its own organizational state. Examples include Story Wall and future Frame/Selects/alternative boards.

A Workspace is optional; ordinary authoring should not require spatial organization merely to modify the story.

### Board

A spatial Workspace surface containing BoardItems. Board is a UX/workspace concept, not part of Narrative IR.

### BoardItem

An item placed in a Board. It may reference a canonical object such as a Beat or Scene while separately storing validated layout metadata such as position or parking state.

### IdeaCard

A free-form Workspace item that has not yet become canonical narrative/production data. It can later be promoted or interpreted into canonical structure.

### Story Wall

A card/sticky-note Workspace for spatial narrative exploration, alternatives, and recoverable rejected material. Under the current direction it is a specialized optional view rather than the default authoring surface.

### Paper Edit

A source-driven editorial view/workspace for arranging interview excerpts, visual evidence, and authored bridges into narrative structure before committing to a timeline. Agent-mediated authoring may create or modify the underlying structure without requiring manual Paper Edit wiring.

### Radio Edit

An audio-first editorial view focused on interview/source excerpts and authored spoken material before visual coverage is fully solved.

### Frame Wall

A later spatial Workspace for comparing representative frames, takes, or selected moments from real media.

### Coverage

The state of how narrative needs/ShotIntents are or are not realized by available media, graphics, stock, generated material, or future capture.

## Process terms

### Narrative IR

The versioned semantic representation that keeps narrative identity stable across authoring, source evidence, production planning, agent normalization, and later editorial integration.

It acts as the structured intermediate representation between messy creative input and deterministic specialized views/downstream systems.

### Normalization

The process of interpreting free-form creative input and converting committed meaning into validated canonical project changes without requiring the user to perform each structural operation manually.

### Graduated autonomy

The trust model in which reversible local changes may apply as grouped undoable batches, meaningful ambiguity triggers focused clarification, and destructive/external side effects require explicit confirmation.

### Spike 0A

The pure-TypeScript experiment that validated the Narrative IR before UI, persistence, Resolve, or real AI integration. Complete/pass.

### Spike 0B

The structured authoring-UX experiment that tested Story Wall, Outline, AV Script, and Paper/Radio Edit over the validated Narrative IR. It validated the shared semantic architecture but failed the human creative-friction test for direct structured authoring as the primary workflow.

### Spike 0C

The agent-mediated authoring experiment that tests free-form text, conversation, and media input normalized into grouped, validated, reversible canonical project changes.
