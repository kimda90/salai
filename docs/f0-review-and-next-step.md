# F0 usability and architecture review

Review date: September 19, 2026. Implementation: [PR #74](https://github.com/kimda90/salai/pull/74).

September 20 follow-up: the [active plan](filmmaking-implementation-plan.md#f0-visual-redesign-follow-up) records an implemented visual redesign guided by ImageGen. The observations below describe the September 19 interface.

## Recommendation

Keep the shared project model and operation boundary. Improve the working context before adding more visible structure.

The next useful experience is a filmmaker who can identify a moment, change its meaning, inspect the result, and retain the accepted work. Generation alone does not complete that experience.

F0 passes its technical interaction checks. Its usefulness for filmmakers remains **inconclusive**. This review contains an agent-operated browser inspection, source inspection, and primary-source research. It contains no new human study or competitor performance benchmark.

The highest-risk question is whether visible narrative intent helps people make better revisions than an image, scene text, and an ordinary note already do.

The [interactive layout study](design/f0-review-concept.html) demonstrates one proposed arrangement. It uses prepared examples and fixed sketches. It does not modify Salai or implement generation, persistence, or an agent handoff.

## Evidence and limits

- The F0 implementation preserves canonical identity, atomic proposals, source ranges, and immediate revert. The local suite passes 146 tests.
- Browser checks cover proposal review, direct edits, stale recovery, playback, and navigation. The [active plan](filmmaking-implementation-plan.md) owns verification status.
- This review reproduced a lost draft when changing views. The fix retains draft text and scope in existing controller state.
- A settled narrow-window check also found horizontal overflow in the shared header. The fix constrains the grid column and wraps navigation.
- At an effective 818 × 727 CSS-pixel viewport, the direction panel begins approximately 1,590 pixels down the document. Removing overflow does not remove context separation.
- The separate layout study passes browser checks for scene navigation, target retention, example apply/undo, and focus recovery. At 390 pixels wide, it has no horizontal page overflow. These checks verify the illustration, not improved human task performance.
- Official product documentation establishes documented features and interaction patterns. Vendor quality, speed, and consistency claims are not independently verified here.
- The older [0B assessment](spike-0b-assessment.md) already identifies structural bookkeeping as a problem. The [0D assessment](spike-0d-assessment.md) identifies lost context between views. These remain relevant observations, not new F0 human evidence.

## Compare useful patterns

| Tool and primary evidence | Documented pattern | Implication for Salai |
| --- | --- | --- |
| [LTX shot editor](https://ltx.io/studio/platform/shot-video-editor) and [platform overview](https://website.ltx.studio/) | Script/concept entry, storyboards, shot controls, references, and repeated refinement already exist in this category. | A storyboard with an AI note box is not sufficient differentiation. Test whether an intent change produces a useful, limited revision while preserving accepted choices. |
| [Boords frame notes](https://help.boords.com/en/articles/3430147-adding-notes-to-frames) | Action and sound text can be edited under frames, in a script editor, and beside the animatic. The text stays synchronized. | Put direct text edits beside the image. A user should not change views merely to edit a sentence. |
| [Final Draft outlining](https://kb.finaldraft.com/hc/en-us/articles/27613546469652-How-do-I-use-the-Outline-Editor) and [Focus Mode](https://www.finaldraft.com/blog/focus-mode-other-features-we-love-for-screenwriting) | Story structure and writing views support different tasks. Focus Mode hides surrounding tools while retaining access to them. | Preserve useful Narrative Lenses. Make them deliberate choices inside a continuous project context, rather than six equally prominent starting points. |
| [Frame.io comments](https://help.frame.io/en/articles/9105251-commenting-on-your-media) and [comparison viewer](https://help.frame.io/en/articles/9952618-comparison-viewer) | Feedback attaches to a frame or range. Two versions can be compared with linked controls and comments. | Keep the feedback target visible. Compare previous and proposed material in context, with the affected moment and playback range intact. |
| [StudioBinder revised scripts](https://support.studiobinder.com/en/articles/10952576-how-do-i-import-a-revised-script) | Script revision reaches connected production views through an explicit comparison and update step. | Show the scope and consequences of a story change before replacing accepted work. A producer needs a reviewable change summary. |

Two documented limitations reinforce the architecture. [LTX color editing](https://help.ltx.io/hc/en-us/articles/35494322496786-How-to-use-Color-Elements) has no undo for a saved color edit. Existing generations do not update automatically. Salai should preserve the previous reference and explain which inputs changed.

[StudioBinder documents missing breakdown tags after scene-number or heading changes](https://support.studiobinder.com/en/articles/3009805-why-did-my-tagged-elements-disappear). Salai should retain stable internal IDs when users rename or reorder scenes. Display numbers must not become identity.

[Frame.io version stacks](https://help.frame.io/en/articles/9101068-versioning-in-frame-io) open the newest version for review. Salai can borrow grouped alternatives while keeping assembly selection explicit. A new result must not replace the selected take merely because it arrives last.

These are product-pattern comparisons. They do not establish how the competing products implement their private architectures.

## Design for the task

| Person | Immediate decision | Minimum useful interface | Avoid |
| --- | --- | --- | --- |
| Scriptwriter | Does the audience understand the intended change? | Scene text beside the selected image, an optional purpose statement, direct text editing, and a visible revision comparison. | Mandatory intent fields for every object or a replacement for a complete screenplay editor. |
| Director | Does this performance, composition, or hold communicate the scene? | Large review image, scene playback, clear selected moment, alternatives, and a separate **Use this take** action. | Prompt parameters as the main interface or silently replacing accepted material. |
| Producer | What changed, what remains unresolved, and what external work is approved? | A review version, an affected-moment summary, unresolved items, save state, and request scope/cost before dispatch. | A scheduling, budgeting, permissions, and production-management suite inside this pilot. |

One person can perform all three tasks. Use task controls and optional panels, not separate role modes or separate project models.

Pilot recommendation: start with a creator who writes and directs a short scene. Let a producer review the result. These are test roles, not validated market segments.

## Prioritized interaction findings

### 1. Keep the review context together

**Observation:** The page places fixture controls, six view tabs, explanatory text, a large viewer, a strip, and intent above or beside the note. Narrow layouts put the note after all review content.

**Interpretation:** Users must remember the image or purpose while scrolling to direct it. Confidence is high about layout, but its effect on task success needs human evidence.

**Change:** Use one compact project header. Put the scene, selected moment, purpose, image, and direction in the same working area. Keep a compact strip below the image. Put fixture controls and valid-model diagnostics in development controls. Continue to show invalid-project errors.

Keep Outline, Story Wall, AV Script, and source review available as Narrative Lenses. Preserve selection, drafts, and navigation context when users choose them. The earlier evidence supports these views as creative tools.

### 2. Make the handoff real and visible

**Observation:** Submitting a note does not start an agent. The user must leave Salai and ask the external harness to read context. Bridge failures retry silently.

**Interpretation:** The current waiting label can look like active processing to a nontechnical user. It is an honest developer-assisted spike, not a self-service direction loop.

**Change:** Until a supported handoff exists, state that the note is ready for the external agent. Distinguish bridge connection from an agent accepting work. In F2, verify one complete handoff through the existing boundary before adding generation choices. Keep model sessions in the external harness.

### 3. Ask for a creative decision, not a schema choice

**Observation:** The target selector exposes moment, Beat, Scene, sequence, story, and linked ShotIntent concepts. The user must understand overlapping scopes.

**Change:** Default to the visibly selected moment. Offer **This scene** and **Whole story** nearby, with additional scopes available deliberately. Show the target name beside the note. Keep precise internal identities and relationships unchanged.

Use familiar field labels such as **Action**, **Dialogue**, **Sound**, and **Duration**. Show purpose as an optional question: “What should the audience understand here?” Do not require prose before a direct duration edit.

### 4. Review effects at the level of the story

**Observation:** The example changes one Cue and one text block. The proposal reports two affected items, although the filmmaker perceives one moment.

**Change:** Group the actual field diff by affected moment and scene. Show “Moment 4: reaction and duration, 3 s → 5 s” first. Retain expandable field details, deletions, source changes, and edits outside the note target. A summary must derive from the operation result.

Show before/after text now. Add image or motion comparison when real candidates exist. Keep fixed fixture artwork labeled. A text edit must not appear to have regenerated an image.

### 5. Make recovery ordinary

**Observation:** Reload loses the project. A subsequent project or workspace edit removes the single revert opportunity. The draft-navigation defect is now fixed.

**Change:** Put save state and recovery ahead of more generation controls. F1 needs save/open with retained media bytes and explicit missing-media handling. Start with the accepted portable bundle, a dirty indicator, and a native leave-page warning for unsaved work.

A short bounded undo history can reuse project/workspace snapshots if the next usability test needs it. Group complete creative actions. Do not add event sourcing. Do not restore an old workspace snapshot over later layout edits without an explicit undo policy.

### 6. Support an actual starting point

**Observation:** The original story shown in F0 is a fixture constant. The machine `create-story` helper creates structure, not a complete user-facing story-to-film workflow.

**Change:** Test pasted scene text or a story description before a blank hierarchy editor. Preserve supplied words separately from authored interpretation. Reuse existing blocks and external interpretation. Formal screenplay import needs its own identity and revision contract.

The alternative explanation for these findings is that F0 intentionally exposes its development machinery. That explains the current design, but it does not make it sufficient for a nontechnical pilot.

## Architecture: retain the boundary, reduce coordination

| Area | Finding and smallest useful action | When |
| --- | --- | --- |
| Canonical ownership | Keep `@salai/script-model`, stable IDs, `applyOperations()`, and the existing controller. Timeline and playback remain derived. No new state service is needed. | Continue now. |
| Drafts versus project facts | Draft text belongs in controller interaction state. The navigation fix follows this rule. Submitted context remains frozen. | Implemented in this PR. |
| Bridge targeting | `bridge.mjs` has one global queue. Any polling browser can consume the next request. There is no registered project-session destination. Bind requests to one explicit browser/project session and reject mismatches. | Before multiple projects/tabs or unattended external execution. |
| Optimistic concurrency | Direction proposals check their submitted revision. Ordinary `apply` relies on the caller reading fresh context. Add an expected session, project ID, and revision to canonical machine mutations when the protocol evolves. | Before concurrent editing or asynchronous automatic application. |
| Media durability | Store immutable asset metadata in the project. Keep bytes in the bundle/storage boundary, outside undo snapshots and renderer state. Missing bytes remain recoverable records. | First F1 vertical slice. |
| Generation state | Keep edited direction, approved external requests, returned candidates, and selected material separate. Use typed records and explicit transitions. | F1 fake execution, then one F2 executor. |
| Change detection | Whole-project invalidation is safe for the small F0 fixture. In F1, compare complete resolved input manifests. Added references and changed ancestry matter. | As already required by RFC 0004. |
| Controller organization | The controller mixes React context wiring, application state, and commands. A small module separation can improve hot reload and headless use. It does not justify another service or framework. | When addressing the reproduced development hot-reload error. |
| Performance | Full snapshots, scans, and per-operation validation are acceptable at this fixture size. Profile before indexing or batching validation differently. Lazy-load optional editors only if cold-load measurements justify it. | Measured need, not the bundle warning alone. |

The bridge finding follows the inspected routing code. This review does not claim a deployed exploit or a completed multi-client test. The present single-client development boundary must remain explicit.

Relevant implementation owners: [controller](../packages/spike-demo/src/controller.tsx), [review UI](../packages/spike-demo/src/FilmReview.tsx), [proposal diff](../packages/spike-demo/src/film-direction.ts), [machine boundary](../packages/spike-demo/src/machine-interface.ts), [bridge](../packages/spike-demo/tools/bridge.mjs), [serialization](../packages/script-model/src/serialization.ts), and [operations](../packages/script-model/src/operation-api.ts).

The accepted F1 design is broader than its first implementation step needs to be. Split the work vertically without removing its invariants:

1. Register local stills, select material per use, save, reopen, and recover missing bytes.
2. Add scoped guidance and frozen manifests with deterministic fake completion.
3. Verify duplicate/late receipts, deleted targets, changed references, and preservation of accepted selections.

Keep the accepted schema migration and per-use binding. Do not start with a general asset platform, dependency graph, provider registry, or nested prompt editor. These refinements change execution order, not canonical ownership.

## Proposed next experiment

**Objective:** Determine whether a continuous review context reduces bookkeeping and makes revision scope understandable.

**Hypothesis:** Users can direct and inspect one meaningful change with fewer forced view changes, while preserving accepted work.

**Minimum fair experience:** Scene text, review image, purpose, target, actual before/after changes, clear handoff state, direct duration/text edits, and draft retention. A file reopen task also requires the F1 persistence slice.

**Implementation order:** First consolidate the existing review layout and group proposal effects. Then deliver the F1 save/open vertical slice. Test the harness handoff before real generation. The active F1–F4 gates remain unchanged.

**Automated acceptance:** Preserve IDs, multiple Cue contents, source ranges, atomicity, stale rejection, and selection across views. Verify keyboard access, visible focus, narrow layouts, and text zoom. A save/open test must load real bytes after the original page closes.

**Human procedure:** Recruit a small mix of writers, directors, and producers. Ask each person to find the reversal, change its interpretation, inspect the scope, reject one unsuitable proposal, and resume saved work. Record assistance, wrong targets, unwanted changes, and recovery. Do not teach the hierarchy first.

Use matched tasks with purpose text visible and hidden. Rotate task order. Ask what the audience should understand before and after the revision. This comparison is exploratory and does not establish statistical superiority.

**Pass:** Participants complete the core decisions without help with internal structure, can explain what changes, and retain the work they chose.

**Mixed:** Some tasks pass, but a particular role, handoff, or recovery path still requires assistance. Preserve the successful behavior and narrow the next slice.

**Fail:** Users repeatedly need to manage internal objects, cannot identify scope, or lose accepted work despite a functioning implementation.

**Inconclusive:** Missing assets, unavailable execution, facilitator intervention, or an incomplete prototype prevents a fair task.

Stop and reshape if the interface needs a new canonical hierarchy, generic job runtime, or screenplay engine to support this small experiment. Investigate that requirement before implementation.

## Assessment and decision boundary

Technical outcome: **PASS** for F0's implemented contract. Human/product outcome: **INCONCLUSIVE**. Production outcome: untested.

The two reproduced defects are implementation failures and receive focused fixes. The remaining findings are interaction risks or deliberate scope gaps. They do not establish a failed product hypothesis.

Confidence is high in observed code and browser behavior. Confidence is moderate in the proposed interaction improvements. Narrative value and market differentiation remain hypotheses.

Recommended next action: **BUILD the bounded review improvements, then the first F1 persistence slice**, followed by human observation. No new ADR is needed for layout or draft retention. A new runtime, transport, or materially different media binding still requires its existing RFC gate.

This document is an assessment and proposed experiment. It does not accept a new product scope, replace the active tracker, or mark human work complete.
