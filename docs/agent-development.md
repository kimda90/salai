# Agent development standard

## Status

Canonical standard for coding agents that modify the Salai repository.

This document defines required context, architecture constraints, change procedure, validation, documentation discipline, and completion criteria for agent-authored changes.

## Objective

Optimize for validated product learning and a small maintainable architecture. Do not optimize for framework breadth, speculative extensibility, or agent-specific infrastructure.

The default decision ladder is:

1. do not add it unless the current task needs it;
2. reuse existing Salai behavior;
3. use the standard library or native platform;
4. use an already-installed dependency;
5. add the smallest new dependency or abstraction only when necessary.

Spike 0D has two explicit new dependencies because they retire commodity timeline/playback risk for the active validation:

- `@moritzbrantner/timeline-editor` — controlled React timeline interaction;
- `@elah/core` — playback/materialization adapter.

Treat both as replaceable adapters, not project-domain foundations.

## Required context before changing code

Always read [`../AGENTS.md`](../AGENTS.md) first.

For current Spike 0D work, read at minimum:

- [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md) — current task/status/evidence source of truth;
- [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md) — accepted product/editorial boundary;
- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — validated external-agent interaction contract;
- [`narrative-ir-spec.md`](narrative-ir-spec.md) — canonical Narrative IR semantics and operation contract;
- [`architecture.md`](architecture.md) — current system boundaries;
- [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md) — validated agent-runtime boundary;
- [`README.md`](README.md) — canonical documentation ownership map.

Read additional canonical docs for the surface being changed. For example, read [`narrative-lenses.md`](narrative-lenses.md) and [`workflows.md`](workflows.md) before changing structured-view/workflow semantics.

Do not use historical Spike 0A/0B/0C implementation documents as current requirements except when explicitly comparing evidence or behavior.

## Architecture invariants

Coding agents must preserve these boundaries unless an accepted architecture decision explicitly changes them.

### Canonical state

- `@salai/script-model` is the only canonical narrative model.
- Narrative IR operation semantics live in the script-model package and [`narrative-ir-spec.md`](narrative-ir-spec.md).
- Do not create a second canonical narrative representation for agents, timelines, renderers, or NLE adapters.
- New production/editorial identity is introduced only when the active spike proves existing stable IDs/relationships cannot represent the required meaning.

### Application boundary

- `SalaiProjectService` is the shared human/machine boundary.
- Human UI actions and machine actions must converge on the same live project state.
- Canonical multi-operation changes use the public `NarrativeOperation[]` path and `applyOperations()`.
- Do not mutate persistence or serialized state behind the project service.

### Structural-editorial boundary

- Salai owns structural editorial semantics.
- The semantic timeline is a projection of Salai-owned state, not a third-party timeline document used as project truth.
- Timeline-engine gestures must resolve to Salai canonical operations or remain UI-only state.
- `@moritzbrantner/timeline-editor` document/history/serialization state must not become Salai persistence.
- `@elah/core` project/renderer state must be derivable and disposable.
- Do not add a direct Mediabunny dependency during 0D unless Elah fails to expose a concrete required capability.
- Specialist NLEs are optional downstream targets; do not route canonical editing through Resolve or another NLE during 0D.

### Agent/runtime boundary

The external harness owns:

- model/provider access;
- authentication;
- conversation/session history;
- planning/reasoning loops;
- model-specific context management.

Salai owns project semantics and the machine interface. Do not add embedded provider SDKs, agent sessions, chat persistence, model routers, or OAuth/API-key management to solve a harness problem.

### Interface/transport boundary

There is one Salai machine semantic interface. Transport adapters are replaceable glue and must not acquire domain logic or state ownership.

The validated external surface is CLI-oriented. The local HTTP bridge exists only because the current live project is browser-owned.

Do not add MCP, stdio RPC, WebSocket APIs, REST domain APIs, or another protocol simply because an agent framework supports them. A new transport requires a concrete validated need and an explicit architecture decision. When another adapter is eventually justified, it must reuse the same command semantics rather than defining a parallel API.

## Machine-tool evolution

The agent-facing CLI must remain self-describing through:

```bash
pnpm salai tools
```

When adding, removing, or changing a machine command:

1. change the implemented command behavior;
2. update the `tools` discovery manifest in the same PR;
3. add or update deterministic tests for the command and discovery output;
4. update [`agent-usage.md`](agent-usage.md) and [`agent-mediated-authoring.md`](agent-mediated-authoring.md) when the operating contract changes;
5. avoid duplicating the full Narrative IR operation vocabulary outside its canonical spec.

Higher-level commands are justified only when Salai must resolve canonical IDs, references, placement, or another Salai-owned concern that would be brittle in raw operations. They must compile immediately to canonical operations and must not become another persistent mutation model.

For 0D, prefer exposing additional **derived timing/assembly context** through existing context mechanisms before inventing timeline-engine commands.

## Change procedure

### 1. Establish the current state

Inspect the relevant code, tests, current canonical docs, and the active implementation tracker before editing.

Do not assume repository state from conversation memory or an earlier branch.

### 2. Define the smallest outcome

State the concrete behavior or invariant the change must produce. Avoid broad refactors unless they are required to make the requested behavior correct.

Do not silently expand the milestone scope.

### 3. Reuse before abstracting

Search for existing operations, service methods, utilities, fixtures, adapters, and tests before creating new abstractions.

Prefer extending an existing semantic boundary over introducing another layer.

### 4. Test the semantic boundary

Add or update tests near the behavior being changed.

Prioritize:

- Narrative IR invariants;
- atomicity and no-partial-publish behavior;
- human/machine shared-state behavior;
- source provenance preservation;
- stable identity during revisions;
- timeline projection identity/order/timing;
- direct temporal gesture → canonical operation behavior;
- third-party adapter derivability/replacement boundary;
- viewer/playback synchronization where behavior is part of the spike contract.

Avoid pixel-perfect tests for incidental presentation unless visual output itself is the contract.

### 5. Implement the smallest change

Keep domain logic out of transport/adapters. Keep provider/runtime concerns out of Salai. Keep Workspace/UI-only meaning separate from canonical story meaning.

For 0D specifically, do not introduce:

- a full production graph;
- Story Spine/infinite canvas implementation;
- real GenAI execution;
- production proxy/cache architecture;
- OTIO/downstream interchange;
- Resolve execution;
- advanced NLE trim/effect/keyframe systems;
- CRDT/event sourcing;
- a general plugin framework.

unless the smallest possible piece is necessary to answer the current pass/fail question.

### 6. Validate locally

Run focused tests while iterating. Before declaring the change complete, run from the repository root:

```bash
pnpm typecheck
pnpm test
pnpm build
```

If the change affects the live machine interface, also exercise the relevant CLI path. For bridge-backed live commands, start:

```bash
pnpm dev
```

and use a browser opened with `?bridge=1`.

If the change affects 0D playback/timeline behavior, exercise the actual fixture in the browser; deterministic unit tests alone cannot prove that the assembly can be watched and judged.

Do not claim a command, test, playback behavior, or human result passed unless it was actually run or CI/human evidence provides the proof.

### 7. Update canonical documentation

Use [`README.md`](README.md) to identify the owner of each kind of information.

Change the canonical source rather than copying the same contract into multiple summary documents. In particular:

- terms → `glossary.md`;
- product requirements → `prd.md`;
- Narrative IR operations/invariants → `narrative-ir-spec.md`;
- agent operating behavior → `agent-usage.md` and, where product-level, `agent-mediated-authoring.md`;
- agent development process → this document;
- architecture → `architecture.md` and ADRs when a decision changes;
- current 0D implementation status/evidence → `spike-0d-implementation-plan.md`;
- discovery observations/uncertainties → `research-notes.md`.

Do not mark human-validation tasks complete based on automated tests or agent simulation.

### 8. Keep the change reviewable

Prefer a small PR with one clear outcome. Do not bundle unrelated cleanup, dependency upgrades, architecture work, and feature behavior unless they are inseparable.

Document meaningful tradeoffs and any intentionally deferred work.

## Current Spike 0D constraints

Until the 0D human gate is complete:

- preserve the existing CLI-first external machine interface;
- preserve the external-harness runtime boundary;
- preserve `@salai/script-model` as canonical narrative state;
- keep timeline-editor/Elah state derived and replaceable;
- do not add a second machine protocol;
- do not introduce real model/provider integration inside Salai;
- do not build the full production graph, Story Spine canvas, real transcription/vision, Resolve execution, OTIO interchange, durable chat history, CRDT/event sourcing, or a general agent/plugin framework;
- keep the local bridge minimal and stateless;
- keep CI deterministic and provider-independent;
- human-validation items remain open until a human performs them.

## Dependency discipline

Before adding a dependency, establish that the standard library, browser/Node platform, existing dependencies, or the two accepted 0D adapters cannot reasonably solve the task.

A dependency must serve the current validated requirement rather than a hypothetical future adapter or architecture.

For 0D, do not add a second timeline or playback engine “just in case.” Replace an accepted spike adapter only when concrete implementation evidence shows it cannot satisfy the experiment.

## Git and pull-request discipline

Agents should:

- work on a focused branch unless explicitly instructed otherwise;
- avoid rewriting unrelated history;
- keep generated artifacts and caches out of commits;
- summarize behavioral changes, tests, and documentation updates in the PR;
- wait for required CI checks before merge when operating with repository access;
- never mark an implementation tracker item complete until its acceptance criteria are actually satisfied.

## Completion checklist

A coding task is complete only when all applicable items are true:

- requested behavior is implemented;
- architecture invariants remain intact or an explicit accepted decision documents the change;
- relevant tests cover the semantic boundary;
- `pnpm typecheck`, `pnpm test`, and `pnpm build` pass;
- machine-interface changes are reflected by `pnpm salai tools`;
- timeline/rendering adapter state remains derived rather than project truth;
- canonical docs are updated without introducing contradictory duplicate contracts;
- implementation tracker status is updated only where the task genuinely completes existing tracked work;
- no human-validation evidence is fabricated or inferred from automation;
- the PR contains no unrelated scope.
