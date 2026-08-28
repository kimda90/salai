# Spike 0C — Agent-Mediated Authoring + Narrative Lenses Implementation Plan

## Status

Canonical execution tracker for **Spike 0C — Agent-Mediated Authoring + Narrative Lenses**.

Contracts:

- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — primary interaction/agent contract;
- [`narrative-lenses.md`](narrative-lenses.md) — structured-lens creative contract;
- [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) — architecture proposal.

The spike exists because 0B human testing found that using direct structured authoring as the routine path requires too much interaction. Follow-up interpretation also established that the same structured views remain useful when the creator deliberately wants to understand or manipulate the narrative system from another angle.

## Spike goal

Validate a dual interaction model:

1. a creator can build/revise representative script-first and footage-first stories primarily through writing, conversation, and media while Salai performs routine structural normalization; and
2. the creator can deliberately enter Narrative Lenses that expose useful properties of the canonical story and support meaningful direct manipulation.

The spike passes only if it demonstrates both:

- **interaction compression** — materially less incidental model-management work than 0B; and
- **structural insight** — structured lenses remain creatively valuable rather than merely exposing internals.

## Core principle

> **Hide structural bookkeeping, not narrative structure.**

## Tracker rules

- `[ ]` — not complete.
- `[x]` — implemented, merged, and verified.
- Leave cancelled/superseded work unchecked with explicit evidence.
- Do not mark a human UX criterion complete based only on code tests.
- Every implementation PR should update this tracker when it fully completes a task.

## Non-goals

Do not pull these into 0C unless a minimal mock is required to answer the interaction/lens question:

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
- autonomous background-agent runtime;
- universal/canonical `NarrativePulse` score.

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
0C.6 Narrative Lens integration
   ↓
0C.7 Agent ↔ lens continuity
   ↓
0C.8 Human interaction + insight validation
   ↓
0C.GATE
```

---

# 0C.0 — Reuse the proven canonical boundary

- [ ] **0C.0.1 — Keep `@salai/script-model` as the only canonical narrative model.**
  - No second AI-owned story schema.
  - No canonical chat transcript/document.
  - No lens-owned duplicate narrative model.

- [ ] **0C.0.2 — Reuse the existing shared controller/dispatcher.**
  - Agent changes and direct lens edits enter the same canonical state.
  - Add a batch-dispatch path rather than a second agent-owned store.

- [ ] **0C.0.3 — Define an agent-facing project context DTO.**
  - Include only data required for the current task.
  - Keep stable existing IDs available when tools need references.
  - Do not expose UI mechanics as domain semantics.

- [ ] **0C.0.4 — Define typed Salai authoring commands that compile into public operations.**
  - Commands may be slightly higher-level than raw `NarrativeOperation` to avoid making the model manufacture IDs, indices, or `ParentRef` details.
  - Salai allocates new canonical IDs and resolves relative targets.
  - Compile immediately into public `NarrativeOperation[]` before application.
  - Workspace commands only where the requested action genuinely concerns Workspace state.
  - No generic mutation escape hatch or second persistent domain API.

- [ ] **0C.0.5 — Add deterministic rejection tests.**
  - invalid agent command;
  - invalid compiled operation batch;
  - failed batch leaves live project/Workspace unchanged.

- [ ] **0C.0.GATE — Agent/lens output cannot bypass canonical validation or ID ownership.**

---

# 0C.1 — Free-form authoring shell

## Working text

- [ ] **0C.1.1 — Add a simple free-form working text area.**
  - Plain text/minimal editor mechanics are sufficient.
  - No rich-text framework without evidence.

- [ ] **0C.1.2 — Allow mixed prose, notes, questions, alternatives, and uncertainty.**
  - Do not force each line into a canonical object before processing.

- [ ] **0C.1.3 — Add an explicit process/update action.**
  - Start explicit rather than continuous for trust/latency validation.
  - Do not attempt bidirectional working-text ↔ canonical synchronization.

## Conversation

- [ ] **0C.1.4 — Add project-aware conversational input.**
  - Agent context includes current canonical state and relevant working input.

- [ ] **0C.1.5 — Support read-only project questions.**
  - “What is missing?”
  - “How long is this?”
  - “Which quote supports this?”

- [ ] **0C.1.6 — Keep conversation separate from canonical truth.**

## Orientation

- [ ] **0C.1.7 — Show a concise result/change summary in the primary surface.**
  - Enough orientation that the user is not forced into a lens after every action.

- [ ] **0C.1.8 — Provide clear entry points to Narrative Lenses without making them mandatory stages.**

- [ ] **0C.1.GATE — Ordinary input/revision can remain low-friction without hiding access to structured views.**

---

# 0C.2 — Agent normalization loop

- [ ] **0C.2.1 — Implement a minimal `AuthoringAgent` / `AgentSession` adapter.**
  - Salai-owned loop.
  - Small provider abstraction.
  - No general agent framework.

- [ ] **0C.2.2 — Send relevant canonical project + working context to the model.**

- [ ] **0C.2.3 — Let the model return typed Salai authoring commands.**
  - Do not require raw create IDs or structural indices where Salai can resolve them.

- [ ] **0C.2.4 — Compile commands to public operations and validate the complete batch before publishing.**

- [ ] **0C.2.5 — Support multi-operation requests as one application/history batch.**

- [ ] **0C.2.6 — Keep canonical ID allocation in Salai and preserve existing IDs during restructuring.**

- [ ] **0C.2.7 — Keep SourceExcerpt semantics immutable as source evidence.**

- [ ] **0C.2.8 — Add focused creative clarification for material ambiguity.**
  - No questions about `ParentRef`, raw IDs, or internal operation types.

- [ ] **0C.2.9 — Add deterministic mocked-agent tests.**
  - Core command compilation/operation semantics do not depend on network/provider availability.

- [ ] **0C.2.GATE — Natural-language input can produce valid canonical changes without object-by-object authoring.**

---

# 0C.3 — Grouped changes, trust, and undo

- [ ] **0C.3.1 — Define an in-memory user-visible action batch.**

```text
AgentActionBatch
- id
- input / intent summary
- commands/tool calls?       debug/inspection only
- compiled operations
- change summary
- status/error
- beforeProject
- beforeWorkspace
```

- [ ] **0C.3.2 — Apply one agent request as one atomic application batch.**
  - Compile complete operation list first.
  - Compute/validate complete result before publishing.
  - Publish once on success.

- [ ] **0C.3.3 — Show a concise creative-level change summary.**
  - Example: “Moved proof before demo; runtime 54s → 42s.”

- [ ] **0C.3.4 — Implement one-step revert of the last successful agent batch.**
  - Restore pre-batch project/Workspace snapshots.
  - No general inverse-operation system yet.

- [ ] **0C.3.5 — Ensure failed batches cannot partially mutate live state.**

- [ ] **0C.3.6 — Preserve direct lens edits alongside agent history without a second model.**
  - Direct edits update the same current canonical state.
  - A long-lived unified undo stack for every manual edit is not required in 0C.

- [ ] **0C.3.7 — Implement graduated-autonomy boundaries.**
  - clearly requested reversible local batch → may apply;
  - material creative ambiguity → clarify;
  - high-impact external effect → explicit user action boundary/mock.

- [ ] **0C.3.GATE — Agent actions are understandable/recoverable without per-operation approval.**

---

# 0C.4 — Script-first interaction flow

## Blank-page structure

- [ ] **0C.4.1 — Paragraph → usable rough narrative in one process action.**
  - No manual Beat/Cue creation required.

- [ ] **0C.4.2 — Infer several Cues when one Beat clearly contains several audiovisual moments.**

- [ ] **0C.4.3 — Leave unresolved notes/questions uncommitted when appropriate.**

## Natural-language revision

- [ ] **0C.4.4 — Support reorder instruction as one agent action.**

- [ ] **0C.4.5 — Support authored rewrite/tightening as one agent action.**

- [ ] **0C.4.6 — Support runtime-target request as one agent action.**
  - Example: “Get this under 45 seconds.”

- [ ] **0C.4.7 — Preserve existing identities where possible.**

## Tests

- [ ] **0C.4.8 — Add deterministic script-first mocked-agent scenarios.**

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
- MediaSegment/source-range metadata when fixture-backed
```

- [ ] **0C.5.3 — Keep attachment identity distinct from canonical media/source identity.**
  - Salai explicitly resolves attachments to existing/new MediaSegment/Asset identity.

## Source normalization

- [ ] **0C.5.4 — Build a radio/paper structure from source attachments + natural-language request.**

- [ ] **0C.5.5 — Preserve SourceExcerpt wording/ranges/media identity.**

- [ ] **0C.5.6 — Allow authored bridge creation without converting source material into authored copy.**

- [ ] **0C.5.7 — Support source substitution instruction.**
  - Example: “Use Maria's second quote instead.”

## Coverage reasoning

- [ ] **0C.5.8 — Answer which narrative moments lack supplied visual/source support.**

- [ ] **0C.5.9 — Keep real transcription/vision outside the spike.**
  - Fixture/mock evidence is sufficient to validate interaction.

## Tests

- [ ] **0C.5.10 — Add deterministic footage-first mocked-agent scenarios.**

- [ ] **0C.5.GATE — Source material can enter the story without manual source/Beat/Cue wiring.**

---

# 0C.6 — Narrative Lens integration

Narrative Lenses are first-class creative surfaces over the same canonical state.

## Existing lenses

- [ ] **0C.6.1 — Outline remains available as a hierarchy/proportion lens.**
- [ ] **0C.6.2 — Story Wall remains available as a spatial rhythm/alternatives lens.**
- [ ] **0C.6.3 — AV Script remains available as an audiovisual-density/realization lens.**
- [ ] **0C.6.4 — Paper/Radio remains available as an evidence/voice/source-pacing lens.**

## Lens semantics

- [ ] **0C.6.5 — Agent changes appear immediately in all relevant lenses.**

- [ ] **0C.6.6 — Direct lens edits continue through the canonical operation/Workspace boundaries.**

- [ ] **0C.6.7 — Lenses expose useful domain structure while avoiding incidental mechanics.**
  - Do not add raw IDs/parent-reference controls merely because they exist internally.

- [ ] **0C.6.8 — Preserve lens-specific state ownership.**
  - Projection data derives from canonical state.
  - Story Wall x/y/parking remains Workspace-owned.
  - Do not turn every lens into a Workspace.

- [ ] **0C.6.9 — Add at least one derived narrative indicator only if it helps test lens value.**
  - candidate: Cue count/density per Beat;
  - section runtime proportion;
  - source-voice distribution;
  - unsupported/coverage count.
  - Do not build a universal narrative score.

- [ ] **0C.6.GATE — Structured UI remains a coherent set of creative lenses, not a second authoring model or a collection of administrative forms.**

---

# 0C.7 — Agent ↔ lens continuity

- [ ] **0C.7.1 — Direct edits from any existing lens are visible to the next agent request.**

- [ ] **0C.7.2 — Agent context can include active lens identity when useful.**
  - Do not send irrelevant UI state.

- [ ] **0C.7.3 — Support at least one lens-aware question per major lens.**

Examples:

```text
Story Wall: "Why does the middle feel crowded?"
AV Script: "Reduce the visual changes in this Beat."
Paper Edit: "Can this rely less on Maria?"
Outline: "Which section is carrying too much weight?"
```

- [ ] **0C.7.4 — Agent actions generated from a lens still compile to canonical operations rather than mutating presentation state directly.**

- [ ] **0C.7.5 — Workspace-specific requests remain Workspace-specific.**
  - Example: “move this card aside” in Story Wall may change x/y without changing narrative order if that is the clear intent.

- [ ] **0C.7.6 — Add deterministic continuity tests.**
  - agent change → lens projection;
  - direct lens edit → next agent context;
  - Story Wall Workspace-only edit → canonical Narrative IR unchanged;
  - source evidence unchanged through agent/lens round trip.

- [ ] **0C.7.GATE — Agent and lenses behave as peer interaction layers over one canonical project.**

---

# 0C.8 — Human interaction-compression + structural-insight validation

## 0B comparison baseline

For representative routine tasks record:

- explicit user actions/inputs;
- clarifications;
- structural/model concepts the user must reason about;
- qualitative hesitation/flow;
- whether change summaries and revert create trust.

## Required human scenarios

- [ ] **0C.8.1 — Blank-page product/branded story.**
- [ ] **0C.8.2 — Messy draft restructure + runtime target.**
- [ ] **0C.8.3 — Interview/source-driven radio edit.**
- [ ] **0C.8.4 — Mixed story + attachments + missing-coverage question.**
- [ ] **0C.8.5 — Revert an agent interpretation and try another direction.**

## Narrative Lens scenarios

- [ ] **0C.8.6 — Give the user an overloaded-middle story and observe whether a lens helps diagnose it.**
- [ ] **0C.8.7 — Give the user a source-voice imbalance and observe Paper/Radio usefulness.**
- [ ] **0C.8.8 — Give the user disproportionate audiovisual complexity and observe AV Script usefulness.**
- [ ] **0C.8.9 — Observe direct lens manipulation after agent normalization.**
- [ ] **0C.8.10 — Observe agent reasoning while a relevant lens is active.**

## Human decisions

- [ ] **0C.8.11 — Decide whether working text or conversation is visually primary.**
- [ ] **0C.8.12 — Decide explicit vs continuous normalization.**
- [ ] **0C.8.13 — Decide acceptable auto-apply boundary.**
- [ ] **0C.8.14 — Decide whether a durable WorkingDocument/session artifact is needed.**
- [ ] **0C.8.15 — Decide which Narrative Lenses remain first-class.**
- [ ] **0C.8.16 — Decide which internal concepts are worth exposing in each lens.**
- [ ] **0C.8.17 — Decide whether active-lens context materially improves agent usefulness.**
- [ ] **0C.8.18 — Decide whether any “narrative pulse” indicators deserve productization.**
- [ ] **0C.8.19 — Record Narrative IR failures exposed by genuinely messy input/lens use.**

- [ ] **0C.8.GATE — Human testing shows lower routine interaction burden AND useful voluntary structured-lens use.**

---

# 0C.GATE — Spike completion

0C is complete only when:

- [ ] **0C.GATE.1 — Free-form text can create/revise a representative story without routine manual structure management.**
- [ ] **0C.GATE.2 — Conversation can request common multi-operation changes naturally.**
- [ ] **0C.GATE.3 — Attachments can participate in source-first authoring without manual relationship wiring.**
- [ ] **0C.GATE.4 — Agent output is constrained by Salai commands compiled into validated canonical operations.**
- [ ] **0C.GATE.5 — Source/provenance semantics survive agent and lens actions.**
- [ ] **0C.GATE.6 — One user request can be one understandable, reversible change batch.**
- [ ] **0C.GATE.7 — Narrative Lenses remain synchronized over the same canonical state.**
- [ ] **0C.GATE.8 — Direct lens manipulation remains useful when intentionally chosen.**
- [ ] **0C.GATE.9 — At least some lenses reveal meaningful narrative information not obvious in free-form/chat alone.**
- [ ] **0C.GATE.10 — Direct lens edits are visible to subsequent agent reasoning.**
- [ ] **0C.GATE.11 — No canonical chat/rich-text/lens shadow model is required.**
- [ ] **0C.GATE.12 — Routine interaction burden is materially lower than the 0B baseline.**
- [ ] **0C.GATE.13 — Trust/clarification behavior is good enough to continue into real local-media/runtime work.**
- [ ] **0C.GATE.14 — CI/typecheck/tests/build are green.**
- [ ] **0C.GATE.15 — Assessment and RFC 0002 decision are recorded.**

# Initial evidence log

| Area | Evidence | Result |
| --- | --- | --- |
| Direction trigger | Spike 0B first human UX test | Routine direct structured authoring requires too much interaction |
| Follow-up interpretation | post-test product review | Structured UI remains valuable for understanding the narrative system/pulse and reshaping it from another angle |
| Canonical boundary available | Spikes 0A/0B, PRs #12–#21 | Narrative IR/controller/views ready for reuse |
| Agent contract | `agent-mediated-authoring.md` | Proposed |
| Lens contract | `narrative-lenses.md` | Proposed |
| RFC | RFC 0002 | Proposed |