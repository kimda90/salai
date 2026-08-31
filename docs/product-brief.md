# Salai Product Brief

## Product thesis

Salai is a local-first, narrative-aware production companion for DaVinci Resolve.

Its job is not to replace the NLE or the user's agent harness. Salai keeps story intent, source evidence, production needs, real/generated media, alternatives, and later editorial use connected across a project.

> **Express intent naturally; Salai structures it for production. See and reshape that structure through narrative lenses.**

> **One Narrative IR, multiple human and machine interfaces.**

> **Hide structural bookkeeping, not narrative structure.**

## Problem

Video production is fragmented across writing, planning, shooting, footage review, editing, VFX, sound, color, graphics, and GenAI. Story intent gets disconnected from media and edit, while editors carry context such as what a moment communicates, which footage supports it, what is missing, which alternatives were rejected, and what changed after restructuring.

Spike 0B exposed a second problem: even when that context is represented correctly, routine manual creation/parenting/movement/wiring of narrative objects creates too much interaction overhead for creative work.

## Solution direction

```text
creator intent
     ↓
external agent harness
     ↓
Salai machine interface
     ↓
validated canonical project
     ↓
Narrative Lenses
     ↓
Resolve
```

The external harness handles natural-language reasoning/model execution. Salai handles project semantics, structural normalization that requires Salai-owned IDs/references, validation, source provenance, shared state, and downstream production context.

The creator can also manipulate the same project directly through Narrative Lenses when hierarchy, spatial organization, audiovisual realization, or source evidence is easier to understand there.

## Script-first and footage-first

Both entry paths converge on the same canonical project.

```text
idea / prose                media / transcripts / selects
     ↓                                  ↓
external harness                    external harness
     └───────────────┬──────────────────┘
                     ↓
             Salai machine interface
                     ↓
              Narrative IR
                     ↓
              Narrative Lenses
                     ↓
                  Resolve
```

## Product principles

1. **Creative intent before bookkeeping.** Users express the result they want; routine structural mechanics are hidden.
2. **Hide bookkeeping, not structure.** Expose structure when it contributes to a creative decision.
3. **Meaning before media.** Narrative intent is not defined by whichever clip currently represents it.
4. **One canonical project.** Harness history, lenses, and workspaces must not become competing story truths.
5. **Narrative Lenses are first-class creative tools.** Direct manipulation remains valid when that representation is the chosen way of thinking.
6. **Interaction cost follows creative decisions.** One creative intention may produce several internal operations but should not require equivalent user actions.
7. **Stable identity.** Normal restructuring preserves source, production, and editorial relationships.
8. **Authored and sourced material stay distinct.** Recorded evidence is not editable fiction.
9. **Machine changes are constrained and recoverable.** Canonical changes use typed operations and grouped revert behavior.
10. **External harnesses are commodity runtime infrastructure.** Salai does not need to own model/provider auth, sessions, planning, or chat execution.
11. **Local-first media handling.** The Salai machine interface does not implicitly expose raw production files; task-relevant project/source context is explicit.
12. **Resolve remains the NLE.** Salai does not rebuild frame-accurate editing, color, Fusion, Fairlight, or delivery.

## Target users

Initial audience:

- solo filmmakers/editors;
- small production companies;
- documentary and interview-driven editors;
- commercial/corporate videographers;
- professional YouTube/educational creators;
- Resolve Studio users with recurring story-driven work.

## Salai-owned semantics

Salai owns:

- Narrative IR and stable narrative identity;
- authored vs source-backed material;
- Narrative Lens and Workspace semantics;
- `SalaiProjectService` and machine-facing project commands;
- Salai-owned ID/reference/placement resolution where required;
- grouped action/revert semantics;
- ShotIntent and production/media relationships when introduced;
- generation intent/provenance;
- Resolve materialization boundaries.

Commodity/external infrastructure should provide model inference, authentication, generic agent harness behavior, media analysis, generation execution, interchange, UI mechanics, and Resolve automation plumbing where appropriate.

## What Salai is not

Salai is not defined by transcript editing, script-to-video generation, sticky-note boards, review/comments, standalone GenAI generation, or generic chat-controlled Resolve actions.

The thesis is the combination:

> **Messy human creative intent and media become durable narrative/production context; creators can perceive that context through multiple creative lenses; the context remains connected into Resolve.**

## Current product-risk focus

0A validated the Narrative IR baseline. 0B validated synchronized views and exposed routine interaction friction. 0C now asks:

> **Can an external agent harness operate Salai's canonical narrative system with materially less routine interaction while existing Narrative Lenses preserve useful structural visibility and direct control?**

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md), [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md), and [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).

## Pricing / business model

Not decided. Revisit after the primary workflow demonstrates clear value.
