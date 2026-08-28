# Spike 0B Assessment — Familiar Authoring UX

## Status

**PARTIAL — automated semantic validation passes; human workflow validation remains.**

Spike 0B has reached the point where further implementation should be driven by human workflow evidence rather than by adding more speculative UI or infrastructure.

The current prototype implements all four intended authoring surfaces over one shared `@salai/script-model` project:

- Outline;
- Story Wall;
- AV Script;
- Paper / Radio Edit.

Fast deterministic tests now exercise the important semantic boundaries and cross-surface state behavior. Chromium/browser automation was explicitly removed from CI in PR #20; visual recognizability, terminology, and interaction comprehension are therefore intentionally assigned to human testing.

## Evidence

| Area | Evidence | Result |
| --- | --- | --- |
| Shared foundation | PR #12, PR #17 | Pass |
| Workspace semantics | PR #12, PR #14, PR #17 | Pass |
| Outline implementation | PR #12, PR #21 | Pass structurally; human legibility pending |
| Story Wall | PR #14, PR #17, PR #20 | Pass semantically; human interaction comprehension pending |
| AV Script | PR #15, PR #21 | Pass semantically; `Cue` terminology pending |
| Paper / Radio Edit | PR #16, PR #20 | Pass semantically; human workflow fit pending |
| Cross-surface identity/state | PR #20, PR #21 | Pass in deterministic acceptance tests |
| CI | PR #20 | Typecheck + unit/acceptance tests + build; no browser runner |

## What the implementation proved

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

Shared selection as `{ type, id }` is sufficient for the current prototype. Selection survives compatible surface switches and clears when the selected canonical object is deleted.

**Assessment:** pass for 0B.

### Workspace should remain small and Story-Wall-specific

The implemented Workspace requires only:

- Workspace / Board identity;
- BoardItem identity;
- canonical Scene or Beat reference, or an IdeaCard;
- `x` / `y` position;
- parking state.

Earlier speculative fields for size, color, rotation, labels, notes, and lanes/groups were removed because no implemented workflow required them.

Paper / Radio Edit has not produced evidence for additional Workspace state.

**Assessment:** keep the minimal schema. Do not add generic canvas/document state without new evidence.

### Spatial organization and narrative structure must remain separate actions

The implementation supports two explicit intents:

- free Story Wall movement changes Workspace position only;
- explicit Story Order controls emit Narrative structural operations.

Parking is Workspace organization and is not deletion. Canonical deletion removes the Narrative object and its projected board reference.

Automated tests verify these boundaries and verify that unrelated Workspace positions survive narrative membership changes.

**Assessment:** this is the correct technical baseline. Human testing must determine whether the distinction is understandable without explanation.

### Paper / Radio Edit does not currently need a new domain concept

Source-backed and authored material can be sequenced using existing Cues and ContentBlocks. SourceExcerpt-backed evidence preserves media identity and source ranges when moved. Authored bridge material remains authored and independently editable. Visual intent can be attached to the same Cue without creating another canonical paper-edit document.

**Assessment:** do not add a PaperEdit domain object or paper-specific canonical model.

### No Narrative IR semantic failure has been exposed yet

The implemented fixtures and acceptance tests have not required workflow-specific semantic workarounds. The current IR supports:

- mixed direct-Beat / Scene-contained hierarchy;
- multiple Cues per Beat;
- visual/audio content lanes;
- sourced and authored audio material;
- source-preserving reorder/attachment;
- Story Wall projection and Workspace isolation.

This is not evidence that the IR is final. It means the next useful pressure test is human workflow use rather than additional speculative modeling.

## Decisions that can be made now

### Workspace schema

Keep the current minimal Story Wall Workspace schema. Add fields only when a concrete interaction requires them.

### Paper Edit domain state

Do not introduce additional Paper Edit domain state in the next iteration unless human testing demonstrates a requirement that cannot be represented through Narrative IR plus Workspace organization.

### Shared selection

Keep canonical selection as object type + stable ID. Surface-specific hover, drag, menus, text drafts, and transient UI state stay local.

### Undo/history

Defer coordinated undo/history until after human validation. 0B does not need a command-history architecture to answer the current workflow questions. If the next phase introduces assisted multi-operation changes, undo/history should be revisited there with concrete command semantics.

## Decisions that require human evidence

### Story Wall spatial vs structural interaction

The technical distinction is sound. We still need to observe whether users naturally understand that moving a card spatially does not reorder the story, and whether the explicit Story Order affordance feels predictable.

### Mixed Scene / direct-Beat hierarchy

The model and Outline support it. Human testing must determine whether users understand the mixed hierarchy or whether the product should constrain it for clarity.

### User-facing `Cue` terminology

`Cue` is useful as an implementation identity and works naturally in AV-oriented modeling. Human testing must determine:

- whether AV Script users understand and benefit from seeing `Cue`;
- whether Paper / Radio Edit should hide or rename it;
- whether other surfaces should expose it at all.

### Surface recognizability and workflow fit

Automated tests intentionally do not decide whether the four surfaces feel familiar, useful, or like different views of the same story. That is the purpose of the next human sessions.

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

If browser automation becomes valuable later, reintroduce it because a concrete regression class justifies it, not because it is a generic frontend expectation.

## Remaining pressure points

Before declaring Spike 0B complete, human testing should answer:

1. Do the four surfaces feel like views of one story rather than separate documents?
2. Do users understand Story Wall spatial movement vs narrative reordering?
3. Is mixed Scene/direct-Beat hierarchy understandable?
4. Where, if anywhere, should the word `Cue` be visible?
5. Does Paper / Radio Edit feel natural for source-first work?
6. Is authored vs sourced material immediately unambiguous?
7. Does shared selection/navigation behave as users expect when changing surfaces?
8. Do the sessions expose any Narrative IR limitation currently hidden by the fixtures?

## Exit from Spike 0B

After human sessions:

- record observations and decision evidence in this document;
- resolve the remaining terminology/hierarchy/interaction decisions;
- update RFC 0001 status;
- update the final 0B tracker and roadmap docs;
- either mark 0B **PASS** and advance, or open explicit Narrative IR / workflow changes with evidence.

Until then, the appropriate status is **PARTIAL — ready for human workflow validation**.
