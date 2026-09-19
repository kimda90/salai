# Narrative-First Filmmaking Interaction

Target observable behavior for [the PRD](prd.md). Implementation status is in [the active plan](filmmaking-implementation-plan.md). This specification does not imply that an in-app conversational runtime or a generation backend already exists.

## One working context

The default surface centers on the current film: viewer, ordered shot strip or compact timeline, and contextual direction. Intent, references, screenplay text, candidates, and later staging can open near the selection. These are views of one project, not mandatory stages or separate editors the user must keep synchronized.

The user should be able to answer: What am I looking at? What should it communicate? What have I selected? What will change if I request an update?

## First pass

The user tells or pastes the story. Show the original input and a compact interpretation. Highlight material uncertainties, but do not force completion of a screenplay database before showing useful work.

Before generation, present the scope and profile. References are optional; assumptions used without them remain editable. Stills arrive into an ordered review, with unfinished shots visibly unfinished. Keep reviewing available material while work continues.

## Feedback targets

A direction captures an explicit target: project, Section/sequence, Scene, Beat, ShotIntent, or selected material use. Preserve the target even if selection changes before processing completes.

Distinguish:

- **intent:** “The audience should suspect that she is hiding something.”
- **direction:** “Hold on her reaction rather than cutting to the letter.”
- **reference:** “Use this room's layout, not its color.”
- **selection:** “Keep this candidate in the current cut.”

These distinctions guide interpretation; they are not four compulsory forms. A plain note is sufficient. Show a concise proposed interpretation when meaning or scope is uncertain.

## Editing and generating are different actions

A project edit can apply as a reversible grouped action. External generation starts only from an approved request. The UI must not charge the user merely because they edit a Beat summary or change a reference.

An Update review shows the target set, requested output kind/profile, the inputs and provider/executor involved, and known cost or cost uncertainty. Grouping by Beat/Scene/Sequence is a convenience over the existing targets, not a new canonical nested generation document.

“Update affected” means updating a reviewed set based on known changed inputs and accepted interpretation. It is not a promise to find every semantic consequence of arbitrary story changes.

## Review signals

Keep three concerns separate:

| Concern | Useful states | Meaning |
| --- | --- | --- |
| Material | missing / available / offline | Does a usable referenced artifact exist? |
| Input comparison | current / needs review / unknown | Does the recorded request agree with current effective inputs? |
| Execution | queued / running / succeeded / failed / cancelled or unknown | What happened to the approved work? |

These are UI concepts, not a requirement for three new domain subsystems. “Alternative” is a relationship or selection role, not a freshness state. “Current” never means “the audience definitely understands it.”

Show reasons: changed scene guidance, reference replaced, inherited context changed, or incomplete provenance. An imported recording without generation inputs is not automatically stale.

## Candidate handling

Keep the active selection visible while new candidates arrive. Compare old and new in the same narrative context. Selecting a take is an explicit project decision; generating one does not accept it.

Retaining an older take is allowed. Record the user's decision against the context reviewed, without rewriting the historical generation request or pretending it used newer inputs. Revisit the warning if another relevant change occurs.

Deleting a Beat removes it from the active story under existing semantics; it does not delete media files or resurrect deleted structure when a late job completes. Earlier candidates remain available for deliberate reuse.

## Fidelity and stopping

Start at the cheapest representation that can answer the current question. A timed still animatic tests sequence and holds; generated motion tests movement. Do not present them as equivalent outputs.

The creator can stop after stills, keep a mixed-fidelity draft, update one scene only, or request higher-quality media later. Preserve candidate identity, narrative context, and review history across these choices.

## Direct controls and optional 3D

Provide enough direct editing to avoid making natural language mandatory for simple precise actions: selection, order, Cue duration, relevant text fields, and material choice. Preserve the source/temporal semantics in [editorial-interaction.md](editorial-interaction.md).

The retained next-scope 3D panel places subjects/props, camera, and lights for a shot. It is optional direction, not a required modeling task. Shared references describe reusable subjects/environments; shot-local staging must not accidentally mutate them globally. Treat generated adherence to staging as something to evaluate, not guarantee.

## Failure, cost, and trust

If the executor disconnects, keep the project and previous media usable. Report the last known job status honestly. A cancelled UI request does not prove provider cancellation or zero cost. Retrying must account for work whose external status is unknown.

Explain unsupported capability instead of silently substituting another model, quality level, or external recipient. If a session ends during generation, reopening must recover the request and its state or state clearly that its outcome is unknown.

The development harness can validate early slices, but final pilot evidence must record its interaction overhead. A developer manually moving files or directing the agent is not evidence that the intended end-user interaction is complete.
