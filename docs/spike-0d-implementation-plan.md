# Spike 0D — Semantic Editorial Environment Implementation Plan

## Status

**CLOSED / MIXED. Technical implementation passed; human interaction gate did not pass.**

The canonical assessment is [`spike-0d-assessment.md`](spike-0d-assessment.md).

Spike 0D proved that Salai can derive a playable semantic timeline from Narrative IR, round-trip direct temporal gestures through canonical operations, and share the same temporal project with an external harness. Human validation found that the implemented timeline was too shallow and fragmented to make meaningful structural edits or demonstrate an advantage over a generic clip timeline.

Accepted product boundary: [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md).

Validated agent boundary: [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md).

Human protocol: [`spike-0d-human-validation.md`](spike-0d-human-validation.md).

## Validation question

> **Can Salai provide a semantic timeline/playback loop that is materially more useful than a conventional clip timeline because narrative identity, source evidence, and structural intent remain visible and editable in time?**

**Answer from 0D:** not yet. The architecture is viable, but the implemented interaction depth was insufficient to validate the product distinction.

## Hard boundaries retained

- `@salai/script-model` remains canonical.
- `SalaiProjectService` remains the shared human/machine mutation boundary.
- The external harness remains outside Salai and uses the existing CLI-oriented machine interface.
- Timeline/rendering libraries remain replaceable projections, not project state.
- Salai owns structural editorial; specialist NLE finishing remains downstream.
- No model/provider/session runtime, second machine protocol, CRDT/event sourcing system, production graph, GenAI stack, or specialist finishing feature set was introduced to make the spike pass.

# Merge sequence and result

```text
0D.0  Timeline/playback adapter boundaries     [complete / pass]
  ↓
0D.1  Semantic timeline projection             [complete / technical pass]
  ↓
0D.2  Playable rough assembly                  [complete / technical pass]
  ↓
0D.3  Structural editing round trip            [complete / technical pass]
  ↓
0D.4  Agent ↔ timeline round trip              [complete / pass]
  ↓
0D.5  Human validation                         [complete / interaction fail]
  ↓
0D.GATE                                      [NOT PASSED]
```

---

# 0D.0 — Adapter boundaries and fixture

- [x] deterministic audiovisual fixture;
- [x] Salai-owned timeline projection referencing canonical IDs;
- [x] thin timeline-editor adapter;
- [x] thin Elah playback adapter;
- [x] architecture tests proving third-party documents are derived/replaceable.

**Gate:** pass.

Evidence: PR #63 CI run 189. Narrative IR remains canonical; timeline-editor/Elah objects are disposable projections.

---

# 0D.1 — Semantic timeline

- [x] Sections/Beats represented in real time;
- [x] Cue structure exposed at deeper semantic level;
- [x] source/media realization shown where available;
- [x] stable canonical selection;
- [x] missing material explicit;
- [x] deterministic identity/order/timing tests.

**Technical gate:** pass.

Evidence: PR #64 CI run 193. The implemented Story / Moments / Media levels proved that the hierarchy can be projected temporally, but human validation later showed that replacing one level with another fragments context.

---

# 0D.2 — Playable rough assembly

- [x] play/pause;
- [x] scrub/seek;
- [x] synchronized viewer/playhead/timeline;
- [x] SourceExcerpt audio from canonical source ranges;
- [x] simple picture/audio assembly;
- [x] explicit missing-visual placeholder.

**Technical gate:** pass.

Evidence: PR #65 CI run 197. Playback works without Resolve. Human validation later found the fixed-frequency fixture audio distracting and found keyboard transport incomplete because spacebar did not toggle play/pause.

---

# 0D.3 — Structural editing round trip

- [x] Beat reorder through canonical `moveBeat`;
- [x] Cue reorder through canonical `moveCue`;
- [x] SourceExcerpt trim through canonical `trimSourceExcerpt` semantics;
- [x] unsupported engine-only edits rejected;
- [x] timeline/playback immediately re-projected from canonical state;
- [x] grouped action/revert preserved.

**Technical gate:** pass for the implemented narrow gesture set.

Evidence: PR #66 CI run 202. Human validation later showed the gesture set is too small for meaningful direct structural editing.

---

# 0D.4 — Agent ↔ semantic timeline round trip

- [x] `salai context` exposes concise semantic timing/assembly context;
- [x] external harness performs a structural timing/reorder request through the existing boundary;
- [x] timeline/playback update through canonical state only;
- [x] direct timeline edit visible to the next context read;
- [x] no new model/provider/session/runtime code.

**Gate:** pass.

Evidence: PR #67 CI run 205. The command set remains `context`, `create-story`, and `apply`. Human validation confirmed the external harness performed its requested change correctly.

---

# 0D.5 — Human validation

Human validation is complete. See [`spike-0d-assessment.md`](spike-0d-assessment.md) for the interpretation.

- [x] **0D.5.1 — Watch the initial assembly.** Result: playback was watchable without issues; no useful pacing/realization problem stood out from the fixture.
- [x] **0D.5.2 — Attempt direct story-order editing.** Result: editing was too simple and fragmented to be creatively useful; changing semantic tabs did not help.
- [x] **0D.5.3 — Attempt source-backed temporal editing.** Result: source audio was the only materially editable item and the interaction was too shallow to yield meaningful editorial evidence.
- [x] **0D.5.4 — External harness change.** Result: pass; the harness operated the live project correctly.
- [x] **0D.5.5 — Compare semantic vs generic timeline.** Result: not validated; the surface was too simple to establish a meaningful semantic advantage.
- [x] **0D.5.6 — Judge without Resolve/conventional editor.** Result: **No**; general structural editing tools such as trim, blade/split, and source in/out control were missing.
- [x] **0D.5.7 — Assessment written.** See [`spike-0d-assessment.md`](spike-0d-assessment.md).
- [ ] **0D.5.GATE — Human evidence shows useful structural editorial beyond generic clip manipulation.** **Not passed.**

Additional human findings:

- spacebar should toggle play/pause;
- placeholder/source audio should not use a distracting fixed-frequency tone;
- selected items need a contextual way to edit their meaningful properties;
- Beats, Cues, and audiovisual content need to be creatable in temporal context;
- multiple visual/audio blocks inside one Cue need to be visible and independently selectable;
- Story / Moments / Media tab switching loses context;
- a flamegraph-like hierarchical timeline is a promising next interaction hypothesis;
- multiple selection is missing;
- the minimum structural editing grammar needs trim, split/blade where semantically valid, and source I/O.

---

# 0D.GATE — NOT PASSED

| Condition | Result |
| --- | --- |
| Narrative IR remains canonical | Pass |
| timeline/rendering state derived and replaceable | Pass |
| fixture playable inside Salai without Resolve | Technical pass |
| semantic timing connects Beat/Cue meaning to realization | Technical pass |
| direct timeline edits resolve through Salai operations | Technical pass for narrow gesture set |
| SourceExcerpt identity/ranges remain source-backed | Pass |
| external-agent interaction uses validated 0C boundary | Pass |
| agent and direct temporal edits share one project | Pass |
| user can identify and meaningfully improve a story/timing issue in the implemented editor | **Fail / insufficient interaction depth** |
| semantic layer changes timeline usefulness beyond generic clip manipulation | **Not validated** |
| no unrelated/specialist infrastructure pulled into spike | Pass |

The product gate therefore does not pass despite the technical architecture passing.

# Next validation priority

Proceed to **Spike 0E — Semantic Editorial Interaction Depth** before Phase 1 production infrastructure.

The next question is:

> **If Salai provides one context-preserving hierarchical timeline plus a minimum useful rough-editing grammar, do its semantic objects materially improve structural editing compared with generic clip manipulation?**

The smallest evidence-backed scope is:

1. one hierarchical/flamegraph-like Section → Beat → Cue → content/media temporal view that keeps surrounding context visible;
2. contextual editing/inspector for the selected semantic item;
3. creation of Beats, Cues, and appropriate visual/audio content from temporal context;
4. multiple visual/audio blocks per Cue rendered and independently selectable;
5. selection + multi-selection;
6. spacebar transport, reorder, edge trim, source I/O, and the smallest semantically correct split/blade behavior;
7. grouped canonical operations + revert;
8. non-distracting validation media;
9. reuse the existing external-harness boundary unchanged.

Do not start Phase 1, Production Graph, Story Spine canvas, Resolve integration, GenAI, specialist finishing, or a second agent architecture until 0E answers this interaction question.
