# Spike 0D — Semantic Editorial Environment Implementation Plan

## Status

**Current validation iteration. 0D.0–0D.1 complete; 0D.2 next.**

This file is the canonical execution tracker for Spike 0D. It owns 0D task numbering, implementation order, completion state, and exit evidence.

Accepted product boundary: [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md).

Validated agent boundary: [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md).

## Goal

Validate that Salai can turn its existing semantic narrative state into a **playable structural audiovisual assembly** where the creator can reason about story meaning and time together, make structural edits directly or through an external agent, and remain inside Salai without requiring DaVinci Resolve for routine playback and rough editorial judgment.

## Validation question

> **Can Salai provide a semantic timeline/playback loop that is materially more useful than a conventional clip timeline because narrative identity, source evidence, and structural intent remain visible and editable in time?**

## Hard boundaries

- `@salai/script-model` remains the canonical narrative model.
- `SalaiProjectService` remains the shared human/machine mutation boundary.
- The external harness remains outside Salai and uses the existing machine interface.
- Timeline/rendering libraries are replaceable UI/materialization infrastructure and must not become canonical Salai project state.
- The spike implements structural editorial only: playback, scrub, rough assembly, narrative/media reorder, and source-range trim sufficient to test the product thesis.
- No attempt to reproduce specialist NLE finishing, multicam, advanced trim modes, effects/keyframe systems, color, compositing, full audio post, mastering, or delivery.
- No Resolve dependency in the validation loop.
- No new general agent framework, MCP interface, CRDT/event sourcing system, plugin framework, or full production graph unless the minimum experiment demonstrates that a missing semantic identity blocks the test.
- No direct dependency on Mediabunny unless the chosen playback engine fails to expose a required capability; avoid duplicating its transitive media layer prematurely.

## Spike implementation choices

0D deliberately uses off-the-shelf editing infrastructure so the experiment measures Salai's semantic interaction rather than custom media-engine work.

### Timeline interaction

Use [`@moritzbrantner/timeline-editor`](https://github.com/moritzbrantner/timeline-editor) (MIT) as the controlled React timeline interaction layer.

Reasons:

- host-owned document/selection/viewport/history state;
- replaceable React clip/track/header rendering;
- move/resize/split/playhead/ruler/zoom mechanics already implemented;
- source-range, waveform, thumbnail, marker, and transport support available without making its document model canonical.

Salai will feed it a **derived timeline projection**. Timeline-editor serialization/history are not Salai project persistence.

### Playback/materialization

Use [`@elah/core`](https://github.com/elahlabs/elah) from Elah (Apache-2.0) as the first playback/rendering adapter.

Reasons:

- browser-native deterministic playback architecture;
- frame-based timeline resolution;
- media playback/export infrastructure already exists;
- core is renderer-oriented infrastructure rather than a Salai domain model;
- Apache-2.0 licensing is compatible with a replaceable spike dependency.

Salai will derive an Elah playback project from current canonical/assembly state. Elah project state is not canonical Salai state.

### Spatial exploration

Do **not** add a canvas dependency in the first 0D slice. The semantic-timeline risk is tested first. Excalidraw remains the preferred MIT reference for a later Story Spine/Arrange experiment after the temporal loop passes.

## State boundary

0D must keep three kinds of state distinct.

### 1. Canonical semantic state

Owned by Salai:

- Script / Section / Scene / Beat / Cue / ContentBlock;
- SourceExcerpt identity/ranges;
- existing explicit relationships;
- any new production/editorial identity only if 0D evidence proves it is semantically necessary.

### 2. Workspace/UI state

Owned by Salai UI/Workspace as appropriate:

- selection/focus;
- timeline zoom/viewport;
- collapsed semantic levels;
- temporary filters/overlays;
- current viewer state that has no project meaning.

### 3. Playback/materialization projection

Derived/replaceable:

- renderer tracks;
- renderer clips;
- playback frame/time;
- resolved source placement;
- engine-specific caches/state.

Third-party timeline or renderer document formats must never become the authoritative project representation.

## Minimum fixture

Use one deterministic project that contains enough semantic/media pressure to test the pivot:

- at least two Sections;
- several Beats with different estimated durations;
- multiple Cues inside at least one Beat;
- authored speech;
- at least two SourceExcerpts with stable source ranges;
- visual media associated with several Cues;
- at least one intentionally unsupported/missing visual moment;
- at least one replaceable media choice represented with the smallest temporary mechanism necessary for the experiment;
- picture and audio that can be played as one rough assembly.

Use small local fixture media suitable for deterministic development/test execution. Do not introduce production proxy/cache infrastructure for this spike.

# Merge sequence

```text
0D.0  Timeline/playback adapter boundaries     [complete]
  ↓
0D.1  Semantic timeline projection             [complete]
  ↓
0D.2  Playable rough assembly                  [next]
  ↓
0D.3  Structural editing round trip
  ↓
0D.4  Agent ↔ timeline round trip
  ↓
0D.5  Human validation
  ↓
0D.GATE
  ↓
implementation review / next evidence-backed plan
```

---

# 0D.0 — Adapter boundaries and fixture

- [x] **0D.0.1 — Add the deterministic audiovisual fixture.**
- [x] **0D.0.2 — Define a Salai-owned timeline projection type that references canonical IDs without becoming persistence.**
- [x] **0D.0.3 — Add a thin adapter from Salai timeline projection to `@moritzbrantner/timeline-editor`.**
- [x] **0D.0.4 — Add a thin adapter from current assembly projection to `@elah/core`.**
- [x] **0D.0.5 — Add architecture tests proving third-party timeline/Elah objects are derived and replaceable.**
- [x] **0D.0.GATE — A canonical fixture can be projected into timeline UI and playback infrastructure without a second Salai project model.**

Evidence: PR #63 CI run 189 completed dependency installation, TypeScript checking, unit tests, and build successfully. The fixture validates against the canonical Narrative IR, source ranges survive projection, and mutation of the derived timeline-editor document does not mutate or replace the Salai project. The Elah project is regenerated deterministically from the same Salai projection and fixture-only media registry.

---

# 0D.1 — Semantic timeline

## Goal

Represent narrative structure in actual time without reducing the project to generic clips/tracks.

- [x] **0D.1.1 — Render Sections/Beats as temporal semantic regions.**
- [x] **0D.1.2 — Reveal Cue structure at a closer semantic zoom level.**
- [x] **0D.1.3 — Render source/media realization beneath the semantic structure where available.**
- [x] **0D.1.4 — Preserve stable Salai selection across semantic levels.**
- [x] **0D.1.5 — Expose unsupported/missing moments without inventing media.**
- [x] **0D.1.6 — Add deterministic projection tests for identity, ordering, timing, and missing material.**
- [x] **0D.1.GATE — The timeline visibly communicates narrative meaning + audiovisual timing rather than looking like an ordinary media-track editor with labels added.**

Evidence: PR #64 CI run 193 passed TypeScript, unit tests, and build against the published timeline-editor 1.0.0 contract. The Timeline surface exposes three semantic scales: Story (Sections/Beats), Moments (Beats/Cues), and Media (Cues/visual/source realization). Selection remains canonical while the visible timeline anchor changes to the nearest semantic ancestor/descendant. Media/source selections resolve back to their enclosing Cue, and unsupported visual material is rendered as an explicit `missing-visual` item. The engine remains read-only, so no timeline-only mutation path exists in this slice.

---

# 0D.2 — Playable rough assembly

## Goal

Let the filmmaker experience the current Salai story in time without Resolve.

- [ ] **0D.2.1 — Play/pause the current rough assembly.**
- [ ] **0D.2.2 — Scrub/seek from the semantic timeline.**
- [ ] **0D.2.3 — Keep viewer/playhead/timeline state synchronized.**
- [ ] **0D.2.4 — Play SourceExcerpt audio from its canonical source range.**
- [ ] **0D.2.5 — Play simple picture + audio arrangement for the fixture.**
- [ ] **0D.2.6 — Represent missing visuals with an explicit placeholder rather than silent failure.**
- [ ] **0D.2.GATE — The user can watch the narrative assembly and identify timing/realization problems without leaving Salai.**

---

# 0D.3 — Structural editing round trip

## Goal

Prove that direct temporal editing changes Salai meaning rather than mutating an engine-owned shadow timeline.

- [ ] **0D.3.1 — Reorder one Beat from the semantic timeline through canonical operations.**
- [ ] **0D.3.2 — Reorder/move one Cue while preserving identity.**
- [ ] **0D.3.3 — Trim one SourceExcerpt through canonical `trimSourceExcerpt` semantics.**
- [ ] **0D.3.4 — Prevent unsupported engine-only edits from silently diverging from Salai state.**
- [ ] **0D.3.5 — Re-project and replay immediately after canonical changes.**
- [ ] **0D.3.6 — Preserve existing grouped-action/revert behavior where a temporal gesture produces a grouped Salai action.**
- [ ] **0D.3.GATE — Direct timeline edits round-trip through Salai-owned semantics and playback reflects the new canonical state.**

---

# 0D.4 — Agent ↔ semantic timeline round trip

## Goal

Carry the validated 0C interaction into the temporal environment without creating a second agent path.

- [ ] **0D.4.1 — Existing `salai context` exposes enough timing/assembly context for the representative task without dumping engine internals.**
- [ ] **0D.4.2 — Codex/external harness performs one structural timing/reorder request through the existing machine boundary.**
- [ ] **0D.4.3 — The semantic timeline and playback update through canonical state only.**
- [ ] **0D.4.4 — A direct timeline edit is visible to the next external-harness context read.**
- [ ] **0D.4.5 — No new model/provider/session/runtime code is added to Salai.**
- [ ] **0D.4.GATE — Agent-mediated and direct temporal work remain coherent over one project, preserving the successful 0C boundary.**

---

# 0D.5 — Human validation

Use the playable fixture to test the actual product distinction.

- [ ] **0D.5.1 — Watch the initial assembly and identify one pacing or realization problem.**
- [ ] **0D.5.2 — Fix one narrative-order problem directly on the semantic timeline.**
- [ ] **0D.5.3 — Trim one source-backed moment while preserving its evidence identity.**
- [ ] **0D.5.4 — Ask Codex/external harness for one story/timing change and watch the result.**
- [ ] **0D.5.5 — Compare the experience against a generic clip timeline: record whether semantic regions/identity changed the creative reasoning.**
- [ ] **0D.5.6 — Record whether the user could judge the rough story without opening Resolve.**
- [ ] **0D.5.7 — Write `spike-0d-assessment.md` from observed evidence only.**
- [ ] **0D.5.GATE — Human evidence shows that Salai's semantic timeline/playback provides useful structural editorial beyond generic clip manipulation.**

---

# 0D.GATE

Spike 0D passes only when:

- [ ] current Narrative IR remains canonical;
- [ ] third-party timeline/rendering state is derived/replaceable;
- [ ] the fixture is playable inside Salai without Resolve;
- [ ] semantic timing visibly connects Beat/Cue meaning to media realization;
- [ ] direct structural timeline edits resolve through Salai operations;
- [ ] SourceExcerpt identity/ranges remain source-backed;
- [ ] external-agent interaction continues through the validated 0C boundary;
- [ ] agent and direct temporal edits share one project;
- [ ] the user can identify and improve at least one story/timing issue by watching the Salai assembly;
- [ ] human evidence shows that the semantic layer changes the usefulness of the timeline rather than merely decorating a conventional NLE UI;
- [ ] no specialist-NLE feature set or unrelated infrastructure was pulled into the spike.

After the gate, write the assessment and update the roadmap from observed evidence. A Story Spine/Arrange canvas is the next interaction experiment only if 0D confirms that the temporal spine is valuable enough to extend spatially.
