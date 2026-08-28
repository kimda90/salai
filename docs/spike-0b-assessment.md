# Spike 0B Assessment — Familiar Authoring UX

## Status

**CLOSED — semantic architecture passes; direct structured authoring fails the creative-friction test.**

Spike 0B answered two different questions with different results:

1. **Can Story Wall, Outline, AV Script, and Paper/Radio Edit operate over one canonical Narrative IR without state drift?** Yes.
2. **Are those structured surfaces, as direct authoring interfaces, low-friction enough to be the primary way people create in Salai?** No, based on the first human UX test.

The decisive human finding was:

> **It needs too much user interaction to be creatively useful.**

This is not treated as a request for more shortcuts or polish. It changes the authoring hypothesis.

The next milestone is [`agent-mediated-authoring.md`](agent-mediated-authoring.md): free-form writing, conversation, and media intake become the primary creative interaction; Salai normalizes that input into the already validated structured project state.

## Evidence

| Area | Evidence | Result |
| --- | --- | --- |
| Shared foundation | PR #12, PR #17 | Pass |
| Workspace semantics | PR #12, PR #14, PR #17 | Pass |
| Outline implementation | PR #12, PR #21 | Structurally valid |
| Story Wall | PR #14, PR #17, PR #20 | Semantically valid |
| AV Script | PR #15, PR #21 | Semantically valid |
| Paper / Radio Edit | PR #16, PR #20 | Semantically valid |
| Cross-surface identity/state | PR #20, PR #21 | Pass in deterministic acceptance tests |
| Fast CI | PR #20 | Typecheck + unit/acceptance tests + build |
| Human UX | first 0B UX test | **Fail as primary direct-manipulation authoring model: excessive interaction burden** |

## What 0B proved

### One Narrative IR can support all four surfaces

The prototype does not maintain separate canonical story documents per workflow. Outline, Story Wall, AV Script, and Paper / Radio Edit all read and modify the same `NarrativeProject` through the shared controller and public Narrative operations.

The continuous acceptance flow switches:

```text
Story Wall
  → Outline
  → AV Script
  → Paper / Radio Edit
  → Story Wall
```

without replacing or translating the canonical project.

**Assessment:** pass at the model/application-state level.

### Stable identity is sufficient for cross-surface continuity

Beat identity survives edits and structural moves. Cue identity survives surface switches and cross-Beat movement. SourceExcerpt identity, media identity, transcript snapshot, and source ranges survive narrative reattachment.

Shared selection as `{ type, id }` is sufficient for the prototype. Selection survives compatible surface switches and clears when the selected canonical object is deleted.

**Assessment:** pass.

### Workspace can remain small and separate

The implemented Story Wall Workspace requires only:

- Workspace / Board identity;
- BoardItem identity;
- canonical Scene or Beat reference, or an IdeaCard;
- `x` / `y` position;
- parking state.

Earlier speculative fields for size, color, rotation, labels, notes, and lanes/groups were removed because no implemented workflow required them.

Paper / Radio Edit did not produce evidence for additional Workspace state.

**Assessment:** keep the minimal schema. Do not expand it to solve the interaction problem.

### Authored and sourced material can share one model safely

Source-backed and authored material can be sequenced using existing Cues and ContentBlocks. SourceExcerpt evidence preserves media identity and source ranges when moved. Authored bridge material remains authored and independently editable.

**Assessment:** pass. Do not introduce a paper-edit-specific canonical document merely to make the UI easier.

### Structured views are viable projections/editors

The four surfaces are technically useful representations of the same project state. Nothing in the human finding invalidates the need for:

- a structural Outline;
- spatial Story Wall;
- AV planning view;
- source-evidence Paper/Radio view.

What changed is their **role**. They should be used when that representation helps a creative decision, not because the user must manually perform every underlying operation through them.

## What 0B failed

### The user is managing the model

The current direct-manipulation UX exposes too much structural bookkeeping.

A normal creative intention can require several steps:

```text
form the idea
   ↓
choose the right surface/control
   ↓
create/select the right object type
   ↓
choose a parent/target
   ↓
perform the move/edit
   ↓
repeat for supporting Cues/content
```

The Narrative IR can represent the result, but the user should not have to serialize the thought manually.

### Surface specialization becomes interaction fragmentation

Multiple familiar views are valuable, but making operations surface-specific can force users to switch representations for mechanical reasons rather than creative reasons.

That undermines the original goal of keeping the user in flow.

### Explicit structural correctness is not the same as creative usability

The Story Wall spatial-vs-structural distinction is technically correct. The mixed Scene/direct-Beat hierarchy is technically representable. Cue identity is semantically useful. None of those facts prove that users should be required to interact with those distinctions routinely.

The key human-test lesson is broader:

> **Internal structure should be available for precision and inspection, but common creative work should not require operating it explicitly.**

## New product hypothesis

The next direction is:

```text
free-form writing / conversation / media
                 ↓
          Salai agent layer
       interpret + normalize
                 ↓
       typed operation batches
                 ↓
 Narrative IR / Workspace / production state
                 ↓
 specialized views / Resolve handoff
```

The user expresses the desired creative outcome. Salai manages the structural mechanics.

This is described in:

- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — Spike 0C implementation/UX contract;
- [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) — proposed architectural direction.

## Why the Narrative IR remains valuable

The 0B UX failure does **not** imply that Salai should abandon structured state and become a chat transcript or generic document editor.

The IR becomes more important as the target of normalization:

```text
messy human input
       ↓
agent interpretation
       ↓
Narrative IR
       ↓
validation / views / source identity / runtime / Resolve
```

It gives the agent a constrained, serializable representation that another subsystem can consume reliably.

## Decisions from 0B

### Keep

- one canonical Narrative IR;
- stable object identity;
- authored/source distinction;
- Workspace separation from narrative semantics;
- the existing typed operation boundary;
- structured surfaces as synchronized views/editors;
- Resolve as the downstream NLE.

### Change

- do not treat structured surfaces as the primary authoring flow;
- do not require the user to explicitly create/manage every Beat/Cue relationship;
- do not require surface switching for ordinary creative commands;
- make agent-mediated normalization the next primary interaction hypothesis;
- make grouped undo/history a next-spike requirement because the agent may perform several operations for one user intention.

### Defer

The following 0B questions are no longer blockers for the next milestone:

- perfect user-facing `Cue` terminology;
- final mixed Scene/direct-Beat presentation;
- final Story Wall spatial-vs-structural gesture design;
- which structured view should be the default entry point.

They can be revisited after the agent-mediated flow shows when users actually need those views.

## Browser automation decision

PR #19 briefly introduced Vitest Browser Mode with Playwright/Chromium. PR #20 removed that infrastructure and replaced the important state/identity assertions with fast deterministic acceptance tests.

Current CI intentionally runs:

```text
install
→ typecheck
→ unit + acceptance tests
→ build
```

No Chromium installation or browser test command is part of CI.

This remains appropriate for the current discovery stage.

## 0B outcome

Spike 0B is **not a product UX pass**, but it is a successful product-discovery spike because it retired two major uncertainties:

- the shared Narrative IR/workspace architecture is viable;
- direct structured manipulation is too interaction-heavy to be Salai's primary creative workflow.

The correct response is not to continue polishing 0B until the old gate passes. The result should change the roadmap.

## Next step

Proceed to **Spike 0C — Agent-Mediated Authoring**.

0C should test whether users can:

- write naturally;
- converse with Salai;
- drop source/media context;
- ask for creative outcomes rather than structural operations;
- receive valid, grouped, reversible canonical changes;
- open Outline/Story Wall/AV/Paper views only when those representations are useful.

The success metric is interaction compression: user effort should scale with creative decisions, not with the number of domain operations required to implement them.
