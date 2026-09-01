# Salai Product Brief

## Product thesis

Salai is a local-first, narrative-aware audiovisual construction environment.

Its job is to keep story intent, source evidence, production needs, real/generated media, alternatives, and the active structural edit connected across a project without making the filmmaker manually manage all of that structure.

> **Express intent naturally; Salai structures it for production and structural editorial. See, play, and reshape the same story through semantic creative surfaces.**

> **One canonical project, multiple human and machine interfaces.**

> **Hide structural bookkeeping, not narrative structure.**

## Problem

Video production is fragmented across writing, planning, shooting, footage review, editing, VFX, sound, color, graphics, and GenAI. Story intent gets disconnected from media and edit, while editors carry context such as what a moment communicates, which footage supports it, what is missing, which alternatives were rejected, and what changed after restructuring.

Spike 0B exposed a second problem: even when that context is represented correctly, routine manual creation/parenting/movement/wiring of narrative objects creates too much interaction overhead for creative work.

Spike 0C then demonstrated a practical answer to that interaction problem. Human validation using Codex showed that an external agent can operate the live Salai project correctly and materially reduce routine structural bookkeeping while Salai remains the canonical source of truth.

The remaining product problem is audiovisual: filmmakers must be able to **experience the story in time** while retaining the semantic context that ordinary timelines discard.

## Solution direction

```text
creator intent / source material
          ↓
external agent and/or direct Salai interaction
          ↓
validated canonical project
          ↓
semantic narrative + source context
          ↓
structural timeline / playback / rough assembly
          ↓
optional specialist NLE / finishing handoff
```

The external harness handles natural-language reasoning/model execution. Salai handles project semantics, structural normalization that requires Salai-owned IDs/references, validation, source provenance, shared state, structural editorial, and downstream materialization/interchange.

The creator can also manipulate the same project directly when temporal, spatial, textual, audiovisual, or source-evidence representations help them think.

## Script-first and footage-first

Both entry paths converge on the same canonical project.

```text
idea / prose                media / transcripts / selects
     ↓                                  ↓
external harness / direct Salai interaction
                     ↓
              Narrative IR
                     ↓
        structural audiovisual assembly
                     ↓
        optional downstream finishing
```

## Product principles

1. **Creative intent before bookkeeping.** Users express the result they want; routine structural mechanics are hidden.
2. **Hide bookkeeping, not structure.** Expose structure when it contributes to a creative decision.
3. **Meaning before media.** Narrative intent is not defined by whichever clip currently represents it.
4. **One canonical project.** Harness history, structured views, timeline engines, and workspaces must not become competing story truths.
5. **Time is first-class.** Salai must let the filmmaker play and structurally edit the story without leaving the semantic environment.
6. **Interaction cost follows creative decisions.** One creative intention may produce several internal operations but should not require equivalent user actions.
7. **Stable identity.** Normal restructuring preserves source, production, and editorial relationships.
8. **Authored and sourced material stay distinct.** Recorded evidence is not editable fiction.
9. **Machine changes are constrained and recoverable.** Canonical changes use typed operations and grouped revert behavior.
10. **External harnesses are commodity runtime infrastructure.** Salai does not need to own model/provider auth, sessions, planning, or chat execution.
11. **Local-first media handling.** Raw production media remains local unless a user action explicitly materializes/exports it elsewhere.
12. **Structural editorial, not full finishing.** Salai owns the minimum timeline/playback/editing surface required to construct and judge the story; specialist NLEs remain optional downstream for precision and finishing.
13. **Third-party media engines are adapters.** Timeline/rendering library state never becomes canonical Salai project state.

## Target users

Initial audience:

- solo filmmakers/editors;
- small production companies;
- documentary and interview-driven editors;
- commercial/corporate videographers;
- professional YouTube/educational creators;
- story-driven creators who need to move between intent, source media, rough assembly, and optional specialist finishing.

DaVinci Resolve remains an important downstream integration target, but Resolve usage is no longer a requirement for Salai's core value.

## Salai-owned semantics

Salai owns:

- Narrative IR and stable narrative identity;
- authored vs source-backed material;
- semantic timeline/structural-editorial meaning;
- Narrative Lens and Workspace semantics that remain useful;
- `SalaiProjectService` and machine-facing project commands;
- Salai-owned ID/reference/placement resolution where required;
- grouped action/revert semantics;
- ShotIntent and production/media relationships when introduced;
- generation intent/provenance when introduced;
- downstream materialization/interchange boundaries.

Commodity/external infrastructure should provide model inference, authentication, generic agent harness behavior, codec/rendering mechanics, media analysis, generation execution, interchange adapters, UI mechanics, and specialist NLE automation where appropriate.

## What Salai is not

Salai is not defined by transcript editing, script-to-video generation, sticky-note boards, review/comments, standalone GenAI generation, or generic chat-controlled editing.

Salai is also not intended to become a full professional finishing NLE with advanced trim systems, multicam, compositing, color, full audio post, mastering, and delivery.

The thesis is the combination:

> **Messy human creative intent and media become durable narrative/production context; the creator can experience and reshape that context in time; the context remains connected through rough assembly and optional downstream finishing.**

## Validation status

- **0A — Narrative IR:** complete/pass.
- **0B — Structured Authoring UX:** closed/mixed; shared semantic architecture passed, routine direct structure management failed the interaction-friction test.
- **0C — External-Agent Authoring:** complete/pass; Codex human validation confirmed the convenience and correctness of an external agent operating the canonical project.
- **0D — Semantic Editorial Environment:** current; validates semantic timeline, playback, structural editing, and agent/direct round trips without Resolve.

See [`spike-0c-assessment.md`](spike-0c-assessment.md), [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md), [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md), and [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md).

## Pricing / business model

Not decided. Revisit after the primary semantic-editorial workflow demonstrates clear value.
