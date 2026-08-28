# Spike 0B Assessment — Familiar Authoring UX

## Status

**CLOSED — semantic architecture passes; routine direct structured authoring fails the creative-friction test; structured views remain valuable as Narrative Lenses.**

Spike 0B answered three related questions with different results:

1. **Can Story Wall, Outline, AV Script, and Paper/Radio Edit operate over one canonical Narrative IR without state drift?** Yes.
2. **Are those structured surfaces low-friction enough to be the routine/default path for ordinary creative changes?** No, based on the first human UX test.
3. **Are the structured surfaces still creatively useful when the creator deliberately wants to understand or manipulate the narrative system from another angle?** Current follow-up interpretation says yes; this becomes an explicit 0C hypothesis to validate.

The decisive human finding was:

> **It needs too much user interaction to be creatively useful.**

The important qualification is:

> **The problem is compulsory structural bookkeeping, not structural visibility itself.**

The next milestone is therefore not “replace the views with chat.” It is a dual interaction model:

- free-form writing/conversation/media + agent normalization for routine authoring; and
- first-class **Narrative Lenses** for structural perception and intentional direct manipulation.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md) and [`narrative-lenses.md`](narrative-lenses.md).

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
| Human UX | first 0B UX test | **Fail as routine direct-manipulation authoring model: excessive interaction burden** |
| Follow-up product interpretation | post-test reflection | **Structured views remain potentially valuable for understanding the narrative system/pulse and reshaping it from another angle** |

# What 0B proved

## One Narrative IR can support all four structured surfaces

The same canonical project can be rendered and modified through:

- Outline;
- Story Wall;
- AV Script;
- Paper / Radio Edit;

without replacing or translating the canonical project.

**Assessment:** pass.

## Stable identity survives restructuring

Beat identity survives edits and structural moves. Cue identity survives surface switches and cross-Beat movement. SourceExcerpt identity, media identity, transcript snapshot, and source ranges survive narrative reattachment.

Shared selection as `{ type, id }` is sufficient for the prototype.

**Assessment:** pass.

## Workspace can remain small and separate

The implemented Story Wall Workspace requires only:

- Workspace / Board identity;
- BoardItem identity;
- Scene/Beat canonical reference or IdeaCard;
- x/y position;
- parking state.

Speculative size/color/rotation/label/note/lane fields were removed because no implemented workflow required them.

Paper / Radio Edit did not produce evidence for separate Workspace state.

**Assessment:** pass. Keep Workspace small and contextual.

## Authored and sourced material can share one model safely

Source-backed and authored material can be sequenced using existing Cues/ContentBlocks. SourceExcerpt evidence preserves media identity/ranges when moved. Authored bridge material remains authored/editable.

**Assessment:** pass.

## Structured surfaces are valid views of the narrative system

The four surfaces represent meaningfully different dimensions of the same story:

- Outline exposes hierarchy/proportion;
- Story Wall exposes spatial rhythm/alternatives;
- AV Script exposes audiovisual realization/density;
- Paper/Radio exposes evidence/voice/source pacing.

Nothing in the first human finding invalidates those representations.

The finding changes **when and why** the user should need them.

# What 0B failed

## The user is managing the model too often

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
repeat for supporting structure
```

The Narrative IR can represent the result, but the user should not have to serialize every thought manually.

## Surface specialization can become interaction fragmentation

Multiple views are valuable, but if an operation is only available in one surface, the user may be forced to switch representation for mechanical reasons rather than creative reasons.

That interrupts flow.

## Technical correctness is not creative usability

The Story Wall spatial-vs-structural distinction is technically correct. The mixed Scene/direct-Beat hierarchy is representable. Cue identity is semantically useful.

Those facts do not prove the user should be required to manage those distinctions routinely.

# Follow-up interpretation — Narrative Lenses

The first 0B assessment draft risked overcorrecting by describing structured views primarily as “secondary precision tools.”

The stronger interpretation is:

> **Hide structural bookkeeping, not narrative structure.**

The structured UI can expose patterns that are difficult to perceive in free-form prose/chat:

- hierarchy;
- progression;
- runtime proportion;
- spatial balance;
- turning points;
- source/evidence concentration;
- audiovisual complexity;
- missing realization;
- alternatives.

This can help the creator understand the story's **pulse** and modify it from another angle.

The new product concept is a **Narrative Lens**: a structured representation of the same canonical project that deliberately emphasizes one of these dimensions.

## Direct manipulation remains useful

The 0B result does not say direct manipulation should disappear.

Direct manipulation is valuable when the user deliberately chooses the lens because the representation itself is the creative tool.

Examples:

- rearranging cards while thinking spatially;
- moving source excerpts while shaping a radio edit;
- adjusting Visual/Audio moments while planning realization;
- changing hierarchy while intentionally working in Outline.

What failed is making those mechanics the compulsory route for ordinary intent such as “move this earlier” or “make this shorter.”

# New product hypothesis

```text
free-form writing / conversation / media
                 ↓
          Salai agent layer
       interpret + normalize
                 ↓
       typed operation batches
                 ↓
          Narrative IR
        ↙    ↓     ↘
      Narrative Lenses
        ↖    ↓     ↗
     direct lens editing
```

The agent handles routine structural mechanics.

The lenses make the canonical system visible and directly manipulable when that visibility helps.

# Why the Narrative IR remains valuable

The UX failure does **not** imply Salai should abandon structured state and become a chat transcript or generic document editor.

The IR is now more clearly both:

- a machine-facing intermediate representation for agents, validation, source identity, persistence, and Resolve; and
- a human-facing narrative system exposed through lenses.

```text
messy human input
       ↓
agent interpretation
       ↓
Narrative IR
    ↙      ↘
 lenses   downstream systems
```

# Decisions from 0B

## Keep

- one canonical Narrative IR;
- stable object identity;
- authored/source distinction;
- Workspace separation from narrative semantics;
- existing typed operation boundary;
- structured surfaces over synchronized state;
- direct manipulation when intentionally working through a structured representation;
- Resolve as downstream NLE.

## Change

- do not make structured surfaces mandatory/routine authoring stages;
- do not require users to explicitly create/manage every Beat/Cue relationship;
- do not require surface switching for ordinary creative commands;
- make agent-mediated normalization the low-friction authoring hypothesis;
- formalize structured views as Narrative Lenses rather than merely “secondary editors”;
- make agent ↔ lens continuity a 0C requirement;
- make grouped revert/history a 0C requirement.

## Defer

The following remain per-lens questions rather than global 0B blockers:

- final user-facing `Cue` terminology;
- final mixed Scene/direct-Beat presentation;
- final Story Wall spatial-vs-structural gesture design;
- which lenses remain first-class after validation;
- which derived “narrative pulse” indicators are useful.

# Browser automation decision

Chromium/browser automation was removed from the active CI path in PR #20.

Current fast validation remains:

```text
install
  ↓
typecheck
  ↓
unit / deterministic acceptance tests
  ↓
build
```

Reintroduce browser automation only when a concrete regression class justifies it.

# 0B outcome

Spike 0B is not a product UX pass, but it is a successful discovery spike because it retired major uncertainties:

- synchronized Narrative IR/view architecture is viable;
- direct structured manipulation is too interaction-heavy as the routine authoring path;
- structured views are still promising as deliberate Narrative Lenses.

The correct response is not to keep polishing the old mandatory workflow until it passes, nor to hide the entire system behind chat.

# Next step

Proceed to **Spike 0C — Agent-Mediated Authoring + Narrative Lenses**.

0C should test whether users can:

- write naturally;
- converse with Salai;
- provide source/media context;
- ask for outcomes rather than structural operations;
- receive valid grouped/reversible canonical changes;
- deliberately enter Outline/Story Wall/AV/Paper views because those representations reveal something useful;
- directly manipulate a chosen lens;
- continue agent reasoning after lens edits without losing continuity.

The success target is:

> **Routine interaction cost scales with creative decisions, while structural visibility increases creative understanding and control.**