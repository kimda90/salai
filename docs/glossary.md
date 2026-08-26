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

An audiovisual/temporal moment used to express part of a Beat. A Beat may contain one or several Cues. `Cue` remains a working term until Spike 0A validates it across representative fixtures.

### ContentBlock

A typed piece of visual or audio content attached to a Cue, such as a visual description, on-screen text, authored speech, sourced excerpt, music, or SFX.

### AuthoredSpeech

Editable words created for the production, such as voiceover, presenter copy, or scripted dialogue.

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

### Projection

A deterministic presentation derived from canonical project data. Examples include Outline, AV Script, Teleprompter, and Coverage. A Projection does not own a separate drifting copy of the story.

### Workspace

A persistent human working surface that can reference canonical objects while storing its own organizational state. Examples include Story Wall, Beat Board, Paper Edit, Radio Edit, Frame Wall, and Selects/Coverage boards.

### Board

A spatial Workspace surface containing BoardItems. Board is currently a UX/workspace concept, not part of Spike 0A Narrative IR.

### BoardItem

An item placed in a Board. It may reference a canonical object such as a Beat, Scene, MediaSegment, or ShotIntent, while separately storing layout metadata such as position, size, color, rotation, lane, or notes.

### IdeaCard

A freeform workspace item that has not yet become canonical narrative/production data. It can later be promoted or attached to a Beat, Scene, source item, or other domain object.

### Story Wall

A card/sticky-note workspace for spatial narrative restructuring, including alternate/rejected material kept nearby rather than immediately deleted.

### Paper Edit

A source-driven editorial workspace for arranging interview excerpts, visual evidence, and authored bridges into narrative structure before committing to a timeline.

### Radio Edit

An audio-first editorial workspace focused on interview/source excerpts and authored spoken material before visual coverage is fully solved.

### Frame Wall

A later spatial workspace for comparing representative frames, takes, or selected moments from real media.

### Coverage

The state of how narrative needs/ShotIntents are or are not realized by available media, graphics, stock, generated material, or future capture.

## Process terms

### Narrative IR

The versioned semantic representation that keeps narrative identity stable across authoring, source evidence, production planning, and later editorial integration.

### Spike 0A

The pure-TypeScript experiment that validates the Narrative IR before UI, persistence, Resolve, or real AI integration.

### Spike 0B

The authoring-UX experiment that tests familiar working surfaces over the validated Narrative IR.

### Spike 0C

The assisted-authoring experiment that tests AI-proposed, validated domain operations with reviewable diffs.
