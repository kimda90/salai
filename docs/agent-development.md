# Agent development standard

## Status

Canonical standard for coding agents that modify the Salai repository.

This document defines required context, architecture constraints, change procedure, validation, documentation discipline, and completion criteria for agent-authored changes.

## Objective

Optimize for validated product learning and a small maintainable architecture. Do not optimize for framework breadth, speculative extensibility, or agent-specific infrastructure.

Default decision ladder:

1. do not add it unless the current task needs it;
2. reuse existing Salai behavior;
3. use the standard library or native platform;
4. use an already-installed dependency;
5. add the smallest new dependency/abstraction only when necessary.

Validated structural-editorial adapters:

- `@moritzbrantner/timeline-editor` — controlled timeline interaction mechanics;
- `@elah/core` — playback/materialization adapter.

Treat both as replaceable adapters, not domain foundations.

## Required context before changing code

Always read [`../AGENTS.md`](../AGENTS.md) first.

For current Spike 0E work, read at minimum:

- [`rfcs/0003-semantic-editorial-interaction-model.md`](rfcs/0003-semantic-editorial-interaction-model.md) — accepted cross-cutting interaction direction and scoped deferred semantics;
- [`editorial-interaction.md`](editorial-interaction.md) — accepted observable direct-edit contract;
- [`spike-0e-implementation-plan.md`](spike-0e-implementation-plan.md) — active task/status/evidence tracker;
- [`spike-0d-assessment.md`](spike-0d-assessment.md) — human evidence that motivates 0E;
- [`narrative-ir-spec.md`](narrative-ir-spec.md) — canonical Narrative IR semantics/operations;
- [`architecture.md`](architecture.md) — current system boundaries;
- [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md) — product/editorial boundary;
- [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md) — agent-runtime boundary;
- [`README.md`](README.md) — documentation ownership map.

Read [`narrative-lenses.md`](narrative-lenses.md) and [`workflows.md`](workflows.md) before changing structured-view/workflow semantics.

Do not use historical spike implementation documents as current requirements except when explicitly comparing evidence.

## Accepted 0E shaping boundary

`0E.SHAPE.GATE` is accepted. Implementation begins at 0E.0 and must follow RFC 0003 plus `editorial-interaction.md`.

RFC 0003 intentionally leaves these questions deferred:

- Cue split semantics;
- SourceExcerpt split semantics;
- independent within-Cue ContentBlock timing;
- intentional black vs missing-realization identity;
- broad cross-parent grouped moves.

Do not use code to decide those questions implicitly. If a task reaches one, resolve/update RFC 0003 first, then promote accepted behavior into the canonical owning docs before implementation.

## Architecture invariants

### Canonical state

- `@salai/script-model` is the only canonical narrative model.
- Narrative IR operation semantics live in `narrative-ir-spec.md`.
- Do not create a second canonical representation for agents, timelines, renderers, or NLE adapters.
- New production/editorial identity is introduced only when validated workflow evidence proves existing IDs/relationships cannot represent required meaning.

For 0E, current canonical timing remains Cue-owned sequential narrative time. Ordinary ContentBlocks do not gain hidden independent offsets/durations.

### Application boundary

- `SalaiProjectService` is the shared human/machine boundary.
- Human UI and machine actions converge on the same live project.
- Canonical multi-operation changes use public `NarrativeOperation[]` and `applyOperations()`.
- Do not mutate persistence or serialized state behind the service.

### Structural-editorial boundary

- Salai owns structural-editorial semantics.
- The semantic timeline is a projection/interaction surface, not project truth.
- Timeline gestures/inspector edits must resolve to canonical operations or remain UI-only state.
- Timeline-editor document/history/serialization must not become Salai persistence.
- Elah project/renderer state must remain derivable/disposable.
- Specialist NLEs remain optional downstream targets.

Reuse existing operation vocabulary before proposing new operations:

- create/update/move/delete operations;
- `moveBlock`;
- `splitBeat` / `mergeBeats`;
- `trimSourceExcerpt`;
- atomic operation batches.

### Agent/runtime boundary

External harness owns model/provider access, authentication, session history, reasoning/tool loops, and model-specific context management.

Salai owns project semantics and machine interface. Do not add embedded provider SDKs, chat persistence, model routers, OAuth/API-key management, or another agent runtime to solve a harness problem.

### Interface/transport boundary

There is one Salai machine semantic interface. Transport adapters are replaceable glue and must not acquire domain logic/state ownership.

The validated surface is CLI-oriented; the local HTTP bridge exists because the prototype project is browser-owned.

Do not add MCP, parallel REST/stdio/WebSocket domain APIs, or another protocol without a concrete validated need and explicit architecture decision.

## Machine-tool evolution

The agent-facing CLI remains self-describing through:

```bash
pnpm salai tools
```

When changing machine commands:

1. change implementation;
2. update tool discovery in the same PR;
3. update deterministic tests;
4. update agent operating docs when the contract changes;
5. do not duplicate the Narrative IR operation vocabulary outside its canonical spec.

Higher-level commands are justified only when Salai must resolve canonical IDs/references/placement or another Salai-owned concern. They compile immediately to canonical operations and do not become persistent mutation models.

## Change procedure

### 1. Establish current state

Inspect relevant code, tests, canonical docs, RFC/ADR decisions, and active tracker. Do not rely on conversation memory or earlier branches.

### 2. Define the smallest outcome

State the concrete behavior/invariant the change must produce. Do not silently expand the milestone.

### 3. Reuse before abstracting

Search existing operations, services, fixtures, adapters, utilities, and tests before creating new abstractions.

### 4. Test the semantic boundary

Prioritize tests for:

- Narrative IR invariants;
- atomicity/no-partial-publish;
- stable identity;
- source provenance;
- direct human action → canonical operation/batch;
- nested timeline projection identity/order/timing;
- selection/expand/viewport state remaining non-canonical;
- grouped multi-selection operations;
- adapter derivability;
- playback synchronization.

Avoid pixel-perfect tests unless visual output itself is the contract.

### 5. Implement the smallest change

Keep domain logic out of transport/adapters. Keep provider/runtime concerns out of Salai. Keep UI/Workspace meaning separate from canonical meaning.

For 0E, do not introduce unless an explicitly resolved/accepted requirement demands it:

- free-positioned generic clip state;
- independent ordinary ContentBlock timing;
- full Production Graph;
- Story Spine/infinite canvas;
- GenAI execution;
- proxy/cache architecture;
- OTIO/downstream interchange;
- Resolve execution;
- advanced NLE trim/effect/keyframe systems;
- CRDT/event sourcing;
- general plugin framework.

### 6. Validate

Run focused tests while iterating. Before completion, run from repository root:

```bash
pnpm typecheck
pnpm test
pnpm build
```

If the live machine interface is affected, exercise the relevant CLI path with `pnpm dev` and `?bridge=1`.

If playback/timeline interaction is affected, exercise the actual 0E fixture in the browser. Automated tests cannot prove human creative usefulness.

### 7. Update canonical documentation

Use `docs/README.md` to find the owner of information.

- terms → `glossary.md`;
- product requirements → `prd.md`;
- Narrative IR operations/invariants → `narrative-ir-spec.md`;
- structural-editorial interaction → `editorial-interaction.md`;
- deferred cross-cutting interaction/domain questions → RFC 0003;
- agent operating behavior → agent docs;
- architecture → `architecture.md` + ADRs when decisions change;
- active 0E status/evidence → `spike-0e-implementation-plan.md`;
- discovery observations → `research-notes.md`.

Do not mark human-validation tasks complete from automated tests or agent simulation.

### 8. Keep changes reviewable

Prefer small PRs with one clear outcome. Do not bundle unrelated cleanup, upgrades, architecture, and feature work unless inseparable.

## Dependency discipline

Before adding a dependency, establish that platform capabilities, existing dependencies, or current accepted adapters cannot reasonably solve the task.

Do not add a second timeline/playback engine “just in case.” Replace/wrap an existing adapter only when concrete evidence shows it cannot satisfy the accepted interaction contract.

## Git and pull-request discipline

Agents should:

- work on a focused branch unless explicitly instructed otherwise;
- avoid rewriting unrelated history;
- keep generated artifacts/caches out of commits;
- summarize behavior, tests, and docs in the PR;
- wait for required CI before merge when repository access is available;
- never mark tracker work complete until acceptance criteria are actually satisfied.

## Completion checklist

A coding task is complete only when all applicable items are true:

- accepted RFC/interaction contract permits the work;
- requested behavior is implemented;
- architecture invariants remain intact or an explicit accepted decision changes them;
- relevant semantic-boundary tests exist;
- `pnpm typecheck`, `pnpm test`, and `pnpm build` pass;
- machine changes are reflected by `pnpm salai tools`;
- timeline/rendering state remains derived;
- canonical docs are updated without contradictory duplicate contracts;
- tracker status reflects only genuinely completed evidence;
- no human-validation evidence is fabricated;
- PR contains no unrelated scope.
