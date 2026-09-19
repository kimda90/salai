# Salai Product Requirements

## Status and goal

Target requirements for the narrative-first AI filmmaking pivot recorded in [ADR 0010](adr/0010-narrative-first-ai-filmmaking.md). Implementation status belongs only in [filmmaking-implementation-plan.md](filmmaking-implementation-plan.md). The existing Narrative IR remains the [implemented contract](narrative-ir-spec.md); proposed additions are in [RFC 0004](rfcs/0004-narrative-first-filmmaking-loop.md).

**Goal:** a filmmaker can tell a story, see it early, give narrative direction, and review an updated film without repeatedly reconstructing context or losing accepted work.

**Loop:** Tell → See → Direct → Update → See. Stopping at stills or cheap motion is a successful outcome when it answers the filmmaker's question.

## P0 — First usable filmmaking loop

### P0.1 — Story intake and interpretation

Accept written story/draft input and provide an explicit path for recorded-story transcription. Preserve the input recording and transcript separately from the authored screenplay interpretation. A transcript correction must not mutate source audio. A development slice may begin with text; the complete spoken-story path must be tested before claiming voice support.

Produce a reviewable story/scene/beat/shot interpretation with meaningful uncertainties visible. Breakdown must not require the user to manually create every entity or confirm every field. The user can correct an interpretation before paying for visual generation.

Use existing Script/Section/Scene/Beat/Cue identities. “Sequence” can be a user-facing label for a Section, not an unreviewed extra hierarchy level. Do not turn a Beat or Cue into a Shot by renaming it.

### P0.2 — Narrative intent is actionable context

Retain what the selected moment should communicate or change for the audience/character. Initially use existing authored fields, including Beat summary and ShotIntent description, rather than a mandatory requirements ontology.

The user can inspect and edit intent near the current shot, frame, or sequence. Feedback about meaning must remain distinguishable from visual direction and from a model's interpretation. A narrative note can lead to a proposed change; it is not automatically an instruction to rewrite the entire film.

### P0.3 — References and versioned guidance

References can be attached before or after the first result. Scope them to the project, sequence/scene, beat, shot, or reusable subject as appropriate. A local wardrobe/performance note must not silently change the character globally.

Compose generation guidance from the relevant scopes and references. Show enough origin information to explain which guidance applies and where a local override was made. Keep readable revisions of authored guidance; reusing an earlier version creates a new current revision rather than destroying history.

Store the effective guidance and actual request used for each generated result. Do not require a separate prompt-management application or claim that plain string concatenation resolves conflicting direction.

### P0.4 — See an inexpensive first film

Generate still candidates for the planned shots through one supported external execution path. Show their relationship to scene/beat intent. Permit whole-piece and selected-scope review before everything is finished.

Provide a timed still animatic with clear missing material. Label it as an animatic, not generated motion. The viewer and compact shot strip/timeline must support selection, playback/scrubbing, useful field edits, order changes, and duration changes without unnecessary mode switching.

The selected material, not merely the newest generated file, determines what the user sees. Multiple existing visual/audio ContentBlocks remain valid; the new UI must not collapse them into one invented canonical clip.

### P0.5 — Direct and preserve

Capture the feedback target and project context at submission time. Support a local narrative note, a reference replacement, a direct edit, and choosing between candidates.

Clear, reversible project changes use the shared atomic operation path. Ambiguous or wide-reaching changes show a reviewable interpretation. Preserve accepted selections, source links, unrelated project objects, and older candidates unless the user explicitly changes them.

Preserving a camera instruction or character reference does not guarantee that a generative model will preserve its rendered appearance exactly. Show such failures as reviewable outcomes, not successful control.

### P0.6 — Scope and approve updates

Distinguish a plan edit from a generation request. Before dispatch, show targets, output profile, external destination, inputs to be shared, and the available cost estimate or explicit lack of one. Require approval for external work and quality escalation. Never auto-upload original recordings or all references merely to provide context.

Use a frozen request with explicit inputs and durable provenance. Detect changed, added, removed, or unavailable effective inputs, including inherited guidance after reparenting. Explain conservative “needs review” results; input mismatch is not proof of narrative failure.

Users can update selected or affected material, retain an old take deliberately, or do nothing. Completion from an older request must not silently replace the currently selected asset. Keep successful candidates when other jobs fail. Duplicate completion must be safe; uncertain/paid retries require explicit handling rather than blind resubmission.

### P0.7 — Cheap motion and scoped orchestration

After still review, allow explicitly requested cheap generated motion for a shot or selected group. A Beat/Scene/Sequence action schedules its relevant shots; it need not be one large model call. Preserve hierarchy and current selections when assembling results.

Keep mixed-fidelity review usable. Motion failure must not erase the still/previous take. There is no requirement to generate every level before the user can stop, and no automatic jump to HQ.

### P0.8 — Save, resume, and recover

Before an external pilot, save/reopen canonical project state, guidance revisions needed for review, accepted selections, frozen requests, and asset references without the original chat. Test unavailable media and interrupted work explicitly.

Use the smallest suitable persistence/material-handling slice. A desktop migration, media-asset-management system, or production cache architecture is not a prerequisite. Metadata serialization alone must not be represented as durable storage of media bytes.

### P0.9 — Human evaluation

A filmmaker must actually watch the piece, identify an intent mismatch, direct a change, compare the result, and decide whether to keep it. Automated tests or model-generated critique cannot substitute for this evidence.

Measure time to first useful review, manual correction/context-reentry effort, preservation of accepted work, unnecessary updates, actual/unknown generation cost, and whether the narrative note helped the next decision. Do not invent numeric performance or quality guarantees before measurement.

## P1 — Retained next scope

**3D shot direction:** optional placement of characters, props, camera, and lights, with a view through the camera. Persist Salai-owned staging description; engine scene state is not project truth. Staging may produce reference/control inputs, but backend support and control fidelity need a real test. Full animation, physics, rigging, and DCC replacement are not required.

**Higher-quality profiles:** low/HQ generation after explicit approval, with the same input provenance, candidate review, and preservation rules. Output kind and quality/cost profile remain separate internally.

**Media and handoff:** better local media lifecycle, imported/captured alternatives, and optional specialist-NLE export as workflow evidence warrants. Preserve the existing footage-first model; do not run a full documentary-ingest milestone in parallel with the first story-first loop.

## Non-goals for this pivot's first implementation

No full finishing NLE, autonomous finished-film promise, enterprise production scheduling/budgeting suite, generic node/graph editor, graph database, satisfaction/constraint solver, automatic psychological or continuity correctness, general branch/merge system, foundation-model training, multi-provider platform, or new agent runtime.

A contextual intent note is not a formal verification requirement. Candidate presence/input freshness is not proof of creative coverage. No competitor-exclusivity claim is a launch criterion.

## Previous scope

The standalone 0E timeline-depth program is paused, not passed. Its [retained interaction contract](editorial-interaction.md) and [RFC 0003](rfcs/0003-semantic-editorial-interaction-model.md) still govern relevant temporal changes. The active plan adopts only the editor work required to evaluate this loop. The five deferred timing/split questions remain unresolved.
