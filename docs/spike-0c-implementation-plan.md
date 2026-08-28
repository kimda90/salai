# Spike 0C — Agent-Mediated Authoring Implementation Plan

## Status

Canonical execution tracker for **Spike 0C — Agent-Mediated Authoring**.

Contract: [`agent-mediated-authoring.md`](agent-mediated-authoring.md).

Architecture proposal: [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md).

The spike exists because 0B human testing found that direct structured authoring requires too much interaction to remain creatively useful.

## Spike goal

Validate that a creator can build and revise representative script-first and footage-first stories primarily by writing, conversing, and providing media/context while Salai performs the structural normalization through valid, grouped, reversible canonical operations.

The spike passes only if this workflow produces **materially less model-management interaction** than 0B without weakening source identity, canonical-state rules, or user trust.

## Tracker rules

- `[ ]` — not complete.
- `[x]` — implemented, merged, and verified.
- Leave cancelled/superseded work unchecked with explicit evidence.
- Do not mark a human UX criterion complete based only on code tests.
- Every implementation PR should update this tracker when it fully completes a task.

## Non-goals

Do not pull these into 0C unless a minimal mock is required to answer the interaction question:

- Electron;
- FastAPI/Python service;
- SQLite/durable persistence;
- real Resolve/CutMaster execution;
- full transcription/media analysis;
- OpenTimelineIO/OpenAssetIO integration;
- GenAI media generation;
- vector database;
- generic infinite canvas;
- canonical rich-text document model;
- collaborative editor;
- general multi-agent framework;
- autonomous background-agent runtime.

# Execution order

```text
0C.0 Reuse canonical boundary
   ↓
0C.1 Free-form authoring shell
   ↓
0C.2 Agent normalization
   ↓
0C.3 Change batches + undo
   ↓
0C.4 Script-first flow
   ↓
0C.5 Attachment / footage-first flow
   ↓
0C.6 Structured-view continuity
   ↓
0C.7 Interaction-compression validation
   ↓
0C.GATE
```

---

# 0C.0 — Reuse the proven canonical boundary

- [ ] **0C.0.1 — Keep `@salai/script-model` as the only canonical narrative model.**
  - No second AI-owned story schema.
  - No canonical chat transcript/document.

- [ ] **0C.0.2 — Reuse the existing shared controller/dispatcher.**
  - Agent changes and direct structured-view changes enter the same canonical state.

- [ ] **0C.0.3 — Define an agent-facing project context DTO.**
  - Include only data the model needs to reason about the current task.
  - Do not expose UI implementation details as domain semantics.
  - Keep stable IDs available to tool calls.

- [ ] **0C.0.4 — Define typed agent tool/output schemas around public operations.**
  - Start with Narrative operations.
  - Workspace operations only where the requested action genuinely concerns Workspace state.
  - Do not create a generic mutation escape hatch.

- [ ] **0C.0.5 — Add deterministic tests that invalid agent-produced operations are rejected without project corruption.**

- [ ] **0C.0.GATE — Agent output cannot bypass canonical validation.**

---

# 0C.1 — Free-form authoring shell

## Working text

- [ ] **0C.1.1 — Add a simple free-form working text area.**
  - Plain text or minimal textarea/editor mechanics are sufficient.
  - Do not introduce a rich-text framework unless an interaction requirement appears.

- [ ] **0C.1.2 — Allow mixed story prose, notes, questions, and uncertainty.**
  - The UI must not force each line into a canonical object before processing.

- [ ] **0C.1.3 — Add an explicit “process / update project” action.**
  - Start explicit rather than continuous to simplify trust/latency validation.
  - Continuous processing can be tested later if evidence supports it.

## Conversation

- [ ] **0C.1.4 — Add project-aware conversational input.**
  - The same agent context can see current canonical state and current working text.

- [ ] **0C.1.5 — Support project questions without requiring mutation.**
  - Examples: “What is missing?”, “How long is this?”, “Which quote supports this?”

- [ ] **0C.1.6 — Keep conversation separate from canonical project truth.**
  - Chat history may be context but does not become the Script.

## Orientation

- [ ] **0C.1.7 — Show enough project/result context that users can see what changed without opening another surface.**
  - Avoid turning this into another structural form.

- [ ] **0C.1.GATE — A creator can remain in one low-friction authoring surface for ordinary input and revision requests.**

---

# 0C.2 — Agent normalization loop

- [ ] **0C.2.1 — Implement a minimal `AuthoringAgent` / `AgentSession` adapter.**
  - Salai-owned loop.
  - Provider abstraction kept small.
  - No general agent framework.

- [ ] **0C.2.2 — Send current project + relevant working input to the model.**

- [ ] **0C.2.3 — Let the model return structured tool calls / operation plans.**

- [ ] **0C.2.4 — Validate every operation before canonical application.**

- [ ] **0C.2.5 — Support multi-operation requests.**
  - One instruction may create/move/update several canonical objects.

- [ ] **0C.2.6 — Preserve stable IDs where the requested change is restructuring rather than replacement.**

- [ ] **0C.2.7 — Keep SourceExcerpt semantics immutable as source evidence.**
  - Agent cannot rewrite a recording into authored text.

- [ ] **0C.2.8 — Add a focused clarification path for material creative ambiguity.**
  - Ask in creative language.
  - Do not ask for `ParentRef`, object type, IDs, etc.

- [ ] **0C.2.9 — Add deterministic mocked-agent tests.**
  - no network/provider dependency for core operation semantics tests.

- [ ] **0C.2.GATE — Natural-language input can produce valid canonical project changes without manual object-by-object authoring.**

---

# 0C.3 — Grouped changes, trust, and undo

- [ ] **0C.3.1 — Define an in-memory user-visible action batch.**

Minimum information:

```text
AgentActionBatch
- id
- input/intent summary
- operations
- change summary
- status/error
- reversible state/inverse data
```

This is an interaction-layer prototype type, not yet a persisted domain object.

- [ ] **0C.3.2 — Apply one agent request as one batch.**

- [ ] **0C.3.3 — Show a concise creative-level change summary.**
  - Example: “Moved proof before demo, shortened VO, runtime 54s → 42s.”
  - Do not require users to inspect every operation.

- [ ] **0C.3.4 — Implement one-step undo/revert of the last successful agent batch.**

- [ ] **0C.3.5 — Ensure failed batches do not leave partially applied canonical state.**

- [ ] **0C.3.6 — Preserve direct-view edits alongside agent history without creating a second model.**

- [ ] **0C.3.7 — Define the 0C graduated-autonomy rules in code/UI.**
  - reversible local batch → may apply;
  - material ambiguity → clarify;
  - external/destructive → explicit confirmation boundary/mock.

- [ ] **0C.3.GATE — Agent actions are understandable and recoverable without per-operation approval.**

---

# 0C.4 — Script-first interaction flow

## Blank-page structure

- [ ] **0C.4.1 — Paragraph → usable rough narrative in one process action.**
  - No manual Beat/Cue creation required.

- [ ] **0C.4.2 — Infer multiple Cues when one Beat clearly contains several audiovisual moments.**

- [ ] **0C.4.3 — Leave unresolved notes/questions uncommitted when appropriate.**
  - Do not force every line into canonical state.

## Natural-language revision

- [ ] **0C.4.4 — Support reorder instruction as one agent action.**

- [ ] **0C.4.5 — Support authored rewrite/tightening as one agent action.**

- [ ] **0C.4.6 — Support runtime-target request as one agent action.**
  - Example: “Get this under 45 seconds.”

- [ ] **0C.4.7 — Preserve existing identities during those changes where possible.**

## Tests

- [ ] **0C.4.8 — Add deterministic script-first fixture agent scenarios.**

- [ ] **0C.4.GATE — Representative blank-page work can be authored/revised without routine structural UI management.**

---

# 0C.5 — Attachment / footage-first flow

## Attachment boundary

- [ ] **0C.5.1 — Add media/document attachment input.**

- [ ] **0C.5.2 — Define minimum spike attachment metadata.**

```text
Attachment
- id
- displayName
- mediaType
- duration?
- transcript/description?
- MediaSegment/source range metadata when fixture-backed
```

- [ ] **0C.5.3 — Keep attachment UI identity distinct from canonical media/source identity.**

## Source normalization

- [ ] **0C.5.4 — Build a radio/paper structure from interview/source attachments plus a natural-language story request.**

- [ ] **0C.5.5 — Preserve SourceExcerpt wording/ranges/media identity.**

- [ ] **0C.5.6 — Allow authored bridge creation without converting source material into authored copy.**

- [ ] **0C.5.7 — Support source substitution instruction.**
  - Example: “Use Maria's second quote instead.”

## Coverage reasoning

- [ ] **0C.5.8 — Answer which narrative moments lack supplied visual/source support.**

- [ ] **0C.5.9 — Do not require real transcription/vision stack for the spike.**
  - Fixture/mock evidence is sufficient to validate the interaction.

## Tests

- [ ] **0C.5.10 — Add deterministic footage-first agent scenarios.**

- [ ] **0C.5.GATE — Users can provide source material and request a story without manual source/Beat/Cue wiring.**

---

# 0C.6 — Structured-view continuity

These views are secondary in 0C, but remain important verification tools.

- [ ] **0C.6.1 — Agent changes appear in Outline.**
- [ ] **0C.6.2 — Agent-created/modified audiovisual structure appears in AV Script.**
- [ ] **0C.6.3 — Agent-arranged source evidence appears correctly in Paper/Radio Edit.**
- [ ] **0C.6.4 — Story Wall canonical references remain valid after agent structural changes.**
- [ ] **0C.6.5 — Direct edits from a specialized view remain visible to the agent on the next request.**
- [ ] **0C.6.6 — Runtime/source identity remains consistent across views.**

- [ ] **0C.6.GATE — Agent-mediated authoring and structured precision views operate on the same canonical state with no synchronization document.**

---

# 0C.7 — Human interaction-compression validation

## Baseline

Use representative 0B tasks as the comparison baseline.

Record for each task:

- explicit user actions/inputs;
- clarifications;
- structural/model concepts the user must reason about;
- time/hesitation qualitatively;
- whether the user remains in creative flow;
- whether change summaries and undo create trust;
- whether specialized views are opened voluntarily.

## Required human scenarios

- [ ] **0C.7.1 — Blank-page product/branded story.**
- [ ] **0C.7.2 — Messy draft restructure + runtime target.**
- [ ] **0C.7.3 — Interview/source-driven radio edit.**
- [ ] **0C.7.4 — Mixed story + attachments + missing-coverage question.**
- [ ] **0C.7.5 — Undo an agent interpretation and try a different direction.**

## Human decisions

- [ ] **0C.7.6 — Decide whether working text or conversation is visually primary.**
- [ ] **0C.7.7 — Decide explicit vs continuous normalization behavior.**
- [ ] **0C.7.8 — Decide acceptable auto-apply boundary for reversible changes.**
- [ ] **0C.7.9 — Decide whether a durable WorkingDocument/session artifact is needed.**
- [ ] **0C.7.10 — Decide which structured surfaces remain first-class.**
- [ ] **0C.7.11 — Record any Narrative IR failure exposed by genuinely messy input.**

- [ ] **0C.7.GATE — Human testing shows materially lower interaction burden than 0B while preserving trust/control.**

---

# 0C.GATE — Spike completion

0C is complete only when:

- [ ] **0C.GATE.1 — Free-form text can create/revise a representative story without manual structure management.**
- [ ] **0C.GATE.2 — Conversation can request common multi-operation changes naturally.**
- [ ] **0C.GATE.3 — Attachments can participate in source-first authoring without manual relationship wiring.**
- [ ] **0C.GATE.4 — Agent output is constrained by canonical typed operations and validation.**
- [ ] **0C.GATE.5 — Source/provenance semantics survive agent actions.**
- [ ] **0C.GATE.6 — One user request can be one understandable, undoable change batch.**
- [ ] **0C.GATE.7 — Structured views remain synchronized as optional precision tools.**
- [ ] **0C.GATE.8 — No canonical chat/rich-text shadow model is required.**
- [ ] **0C.GATE.9 — Human interaction burden is materially lower than the 0B baseline.**
- [ ] **0C.GATE.10 — Trust/clarification/autonomy behavior is good enough to continue into real local-media/runtime work.**
- [ ] **0C.GATE.11 — CI/typecheck/tests/build are green.**
- [ ] **0C.GATE.12 — Assessment and RFC 0002 decision are recorded.**

# Initial evidence log

| Area | Evidence | Result |
| --- | --- | --- |
| Direction trigger | Spike 0B first human UX test | Direct structured authoring requires too much interaction |
| Canonical boundary available | Spikes 0A/0B, PRs #12–#21 | Narrative IR/controller/views ready for reuse |
| 0C contract | `agent-mediated-authoring.md` | Proposed |
| RFC | RFC 0002 | Proposed |
