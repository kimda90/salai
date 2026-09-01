# Spike 0D Assessment — Semantic Editorial Environment

## Status

**CLOSED / MIXED — the semantic/editorial architecture passes, but the human interaction gate does not. The implemented timeline is too shallow and fragmented to provide a fair or useful test of semantic structural editing.**

Spike 0D answered several technical questions positively:

1. **Can Narrative IR remain canonical while timeline and playback state stay derived?** Yes.
2. **Can Salai play a rough audiovisual assembly without Resolve?** Yes.
3. **Can direct temporal gestures compile back into canonical Salai operations?** Yes, for the deliberately narrow implemented gestures.
4. **Can an external harness and direct temporal editing share one live project?** Yes.
5. **Did the implemented timeline provide enough direct editing depth for the semantic layer to become creatively useful?** No.
6. **Could the filmmaker meaningfully judge and improve the rough story in Salai without a conventional editor?** No.

The decisive human finding is:

> **The semantic timeline is technically coherent, but it exposes too little structure and too few editing operations at once to become a useful editorial environment.**

This is primarily an interaction-depth failure, not evidence that the Narrative IR, canonical mutation boundary, or external-agent architecture are wrong.

## Human evidence

The human validation produced the following observations.

### General interaction feedback

- Spacebar did not toggle play/pause.
- Placeholder/source audio used a fixed-frequency sound that was distracting and did not communicate useful editorial meaning.
- Most timeline items could not be meaningfully edited. The desired behavior is to select an item and edit the relevant properties of that object directly.
- New narrative/editorial items could not be created from the timeline. The desired baseline includes adding Beats, Cues, and audiovisual material where appropriate.
- Source audio was the only material with meaningful temporal editing, and the edit acted on the whole item rather than supporting a broader editorial grammar.
- The UI did not make it possible to work naturally with multiple visual or audio excerpts inside one Cue, despite the underlying Cue model supporting multiple visual and audio block IDs.
- Switching between Story / Moments / Media semantic levels fragmented context instead of helping navigation.
- A flamegraph-like or otherwise hierarchical timeline was requested: the whole temporal hierarchy should remain visible while the user drills into Section → Beat → Cue → content/media.
- There was no useful multiple-selection workflow.
- Missing baseline rough-editing operations included trim, blade/split, and source in/out style control.

### Validation task results

| Task | Observation | Result |
| --- | --- | --- |
| Watch initial assembly | Playback was watchable without issues; no useful pacing/realization problem stood out from the fixture | Completed, but did not produce the intended story-diagnosis evidence |
| Direct Beat/story edit | Editing was too simple and fragmented to be creatively useful; changing semantic tabs did not help | **Fail as interaction proof** |
| Source-backed trim | Implemented editing was too shallow to produce meaningful editorial evidence | **Fail as interaction proof** |
| External harness change | External harness performed the requested change correctly | **Pass** |
| Semantic vs generic timeline | Timeline was too simple to establish a meaningful semantic advantage | **Not validated** |
| Judge without Resolve / conventional editor | No; general editing tools such as trim, blade/split, and source I/O were missing | **Fail** |

## What 0D proved

### Canonical semantic state can drive real time

Narrative IR can project into a real temporal surface and playable assembly without becoming subordinate to a timeline document.

**Assessment: pass.**

### Timeline and playback engines can remain replaceable

`@moritzbrantner/timeline-editor` and `@elah/core` remain adapter infrastructure. Neither owns Salai project truth.

**Assessment: pass.**

### Direct timeline gestures can resolve through Salai semantics

Beat reorder, Cue reorder, and SourceExcerpt trim were proven to round-trip through canonical operations, re-project immediately, and preserve grouped revert behavior.

**Assessment: pass for the implemented narrow gesture set.**

### The 0C external-agent boundary survives temporal editing

The existing `context` / `create-story` / `apply` machine interface was sufficient. The external harness changed the live temporal project correctly, and direct timeline changes were visible to the next machine context read.

**Assessment: pass. Keep the agent architecture unchanged.**

### Playback without Resolve is technically viable

The rough assembly can be watched and scrubbed inside Salai.

**Assessment: technical pass. Human usefulness remains dependent on sufficient editing depth.**

## What 0D did not prove

### Semantic timing did not yet change creative reasoning

The user could see semantic timing, but the timeline did not offer enough control to make a substantive editing decision through that representation.

The result is therefore not evidence that semantics are useless. It is evidence that **semantic visibility without sufficient editing power is not enough**.

### Semantic-level tabs fragmented context

The Story / Moments / Media switcher exposed different projections of the same hierarchy, but switching levels removed context the user wanted to keep visible.

This is an important revision to the 0D UI hypothesis:

> **Semantic depth should usually be navigable within one temporal context, not by replacing the timeline with another semantic level.**

A flamegraph-like hierarchy is a strong candidate interaction model:

```text
Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Beat ━━━━━━━━━━━━━━━  Beat ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Cue ━━━━━ Cue ━━━      Cue ━━━━━━━━━━━━━ Cue ━━━━━━━━━━━
      visual ━━━━━━━        visual ━━━━━━━   missing ━━━━━━━
      audio  ━━━━━━━━━       source ━━━━━━━━━━━━━━━━━━━━━━━━━
```

The exact visual design remains to be tested. The important property is preserving whole-story temporal context while progressively exposing nested semantic detail.

### The direct editor lacked a minimum useful editing grammar

The experiment deliberately avoided building an NLE, but the boundary was drawn too narrowly. A structural editor still needs enough ordinary editing verbs to let the user manipulate the semantic objects being shown.

The next experiment needs a minimum rough-editor grammar, not specialist finishing features.

Candidate baseline:

- keyboard play/pause;
- select and multi-select;
- contextual inspector/editing for the selected semantic object;
- create Beat / Cue / appropriate audiovisual content from temporal context;
- reorder/move;
- source/media edge trim;
- split/blade where a clear canonical semantic operation can be defined;
- source in/out adjustment;
- multiple visual/audio blocks per Cue rendered and independently selectable;
- remove/park/delete behavior with explicit semantics;
- grouped action + revert.

This does **not** imply adding color, VFX, keyframes, multicam, finishing audio, delivery, or other specialist-NLE capabilities.

### The fixture audio harmed evaluation

The fixed-frequency source placeholder was distracting and made source-backed moments feel artificial.

This is not an architectural issue, but the next human test should use non-distracting, semantically legible audiovisual fixture material so the evaluation measures editing rather than placeholder irritation.

## Product interpretation

0D should not be treated as a reason to return structural editorial ownership to Resolve.

The stronger conclusion is:

> **Salai can own structural editorial technically, but a semantic editor must be a sufficiently complete direct-manipulation environment before its semantic advantage can be judged.**

This also reinforces the 0B lesson. Surface specialization becomes harmful when users must switch representations for mechanical reasons. The temporal environment should make the hierarchy continuously available and let the user choose how deeply to inspect it without losing surrounding context.

## Decisions from 0D

### Keep

- Narrative IR as canonical project state;
- stable Beat / Cue / ContentBlock / SourceExcerpt identity;
- authored vs source-backed semantics;
- `SalaiProjectService` as the shared mutation boundary;
- derived timeline and playback adapters;
- external harness ownership of model/provider/session/runtime;
- the current narrow CLI machine interface;
- internal playback as a Salai responsibility;
- Resolve/specialist NLEs as optional downstream finishing targets rather than the only place structural editing can happen.

### Change

- do not treat Story / Moments / Media tabs as the final semantic timeline interaction;
- preserve whole-timeline context while exposing nested semantic depth;
- add a contextual inspector so selected items can expose their meaningful editable properties;
- allow creation of narrative and audiovisual objects from the timeline;
- render and independently manipulate multiple visual/audio blocks within a Cue;
- add multiple selection and grouped manipulation;
- provide the minimum rough-editing grammar required for meaningful structural work;
- add standard transport interaction such as spacebar play/pause;
- replace distracting fixed-frequency fixture audio before the next human validation.

### Do not infer

0D does not justify:

- a full specialist NLE feature set;
- abandoning the Narrative IR;
- making timeline-editor or Elah canonical;
- moving agent runtime into Salai;
- adding a second machine protocol;
- building the production graph before the temporal interaction is useful;
- implementing a separate Story Spine canvas yet.

## 0D outcome

Spike 0D is a successful technical spike but **does not pass the product interaction gate**.

The two decisive exit conditions were not met:

- the user could not identify and meaningfully improve a story/timing issue through the implemented Salai timeline; and
- the semantic layer did not yet demonstrate greater usefulness than a generic timeline because the editing surface was too limited to make the comparison meaningful.

The correct response is not to polish labels or add more semantic tabs. It is to make one temporal environment deep enough to test the thesis fairly.

# Next step — Spike 0E: Semantic Editorial Interaction Depth

Before Phase 1 production infrastructure or the Production Graph, run one focused interaction spike.

The validation question should be:

> **If Salai provides one context-preserving hierarchical timeline plus a minimum useful rough-editing grammar, do its semantic objects materially improve structural editing compared with generic clip manipulation?**

Minimum scope:

1. **Hierarchical temporal context** — replace/de-emphasize semantic-level tab switching with a flamegraph-like expandable Section → Beat → Cue → content/media timeline that keeps surrounding story visible.
2. **Contextual inspector** — edit the meaningful properties of the selected Beat, Cue, ContentBlock, SourceExcerpt, or realization without hunting for another surface.
3. **Creation in time** — create Beats, Cues, and appropriate visual/audio content from the current temporal location.
4. **Multiple material per Cue** — show and independently select more than one visual/audio block inside a Cue.
5. **Minimum editing grammar** — play/pause shortcut, selection/multi-selection, reorder, trim, source I/O, and the smallest semantically correct split/blade behavior.
6. **Grouped canonical actions** — all edits still compile immediately to Salai operations and remain reversible.
7. **Better validation media** — use non-distracting audiovisual material suitable for judging edits.
8. **External harness continuity** — reuse the 0C/0D machine boundary unchanged.

Do not advance to Phase 1 until this interaction question is answered. Do not add production graph, Resolve integration, GenAI, finishing features, or a second agent architecture to make 0E pass.
