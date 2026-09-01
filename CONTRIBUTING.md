# Contributing to Salai

Salai is still in discovery and spike-driven development. Contributions should optimize for validated product learning, clear domain behavior, and maintainable boundaries rather than premature breadth.

Coding agents must also follow [`AGENTS.md`](AGENTS.md) and [`docs/agent-development.md`](docs/agent-development.md).

## Current priority

The active milestone is **Spike 0D — Semantic Editorial Environment**.

Before changing current behavior, read:

- `docs/spike-0d-implementation-plan.md` — authoritative task/status/evidence tracker;
- `docs/adr/0009-salai-owns-structural-editorial.md` — accepted structural-editorial product boundary;
- `docs/agent-mediated-authoring.md` — validated external-agent interaction contract;
- `docs/narrative-ir-spec.md` — authoritative Narrative IR semantics and operation contract;
- `docs/architecture.md` — current application/runtime/editorial boundaries;
- `docs/adr/0008-external-harness-owns-agent-runtime.md` — validated agent-runtime decision;
- `docs/README.md` — documentation ownership/lifecycle.

Spike 0C is complete/pass. Human validation using Codex confirmed that the external-agent loop works correctly and materially reduces routine structural interaction. Do not reopen the agent-runtime question inside 0D unless new evidence directly invalidates ADR 0008.

## Development setup

Requirements:

- Node.js 24 LTS or compatible newer LTS;
- pnpm 10+.

Install and validate:

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

For the local UI + bridge:

```bash
pnpm dev
```

The current browser prototype joins the machine bridge only when opened with `?bridge=1`, for example:

```text
http://localhost:5173/salai/?bridge=1
```

## Change discipline

For Spike 0D:

- keep `@salai/script-model` as the only canonical narrative state;
- keep `SalaiProjectService` as the shared human/machine application boundary;
- route canonical multi-operation edits through the public Narrative IR operation path and `applyOperations()`;
- keep Workspace/UI-only state separate from Narrative IR semantics;
- keep the external harness responsible for model/provider access, authentication, sessions, history, planning, and tool-loop behavior;
- keep the local HTTP bridge stateless and limited to prototype transport glue;
- keep third-party timeline/rendering document state derived and replaceable rather than canonical;
- use `@moritzbrantner/timeline-editor` as the first timeline interaction adapter for the spike;
- use `@elah/core` as the first playback/materialization adapter for the spike;
- do not add a direct Mediabunny dependency unless a concrete required 0D capability is unavailable through Elah;
- do not add MCP, another machine protocol, an embedded agent runtime, full production graph, Story Spine canvas, real media-analysis pipeline, Resolve execution, OTIO interchange, advanced NLE effects/trim systems, CRDT/event sourcing, distributed state, or a general plugin framework unless the active milestone and an explicit architecture decision require them;
- prefer existing operations/services and platform primitives before new abstractions or dependencies;
- add tests around semantic boundaries rather than incidental presentation;
- do not duplicate the authoritative Narrative IR operation vocabulary into summary or tracker docs.

## Agent-facing machine interface

The validated external surface is CLI-oriented. The CLI is self-describing:

```bash
pnpm salai tools
```

When a machine command changes, update the discovery output, deterministic tests, and canonical agent-use documentation in the same PR. See `docs/agent-development.md`.

For 0D, prefer extending task-relevant context with derived timing/assembly information before inventing timeline-engine-specific agent commands.

## Task completion tracking

`docs/spike-0d-implementation-plan.md` is the single task-level tracker for Spike 0D.

A tracked task may be marked complete only when its implementation and acceptance criteria are actually satisfied and verified. Human-validation items cannot be completed by automated tests or agent simulation.

Partially implemented work stays unchecked. Add newly required work to the tracker rather than silently expanding scope.

## Documentation changes

Use the canonical ownership table in `docs/README.md`.

- product terms → `docs/glossary.md`;
- requirements → `docs/prd.md`;
- Narrative IR implementation semantics → `docs/narrative-ir-spec.md`;
- validated agent-mediated product behavior → `docs/agent-mediated-authoring.md`;
- agent operating procedure → `docs/agent-usage.md`;
- coding-agent development procedure → `docs/agent-development.md`;
- active 0D status/evidence → `docs/spike-0d-implementation-plan.md`;
- system architecture → `docs/architecture.md`;
- workflow UX → `docs/workflows.md` and `docs/narrative-lenses.md`;
- discovery observations/uncertainties → `docs/research-notes.md`;
- proposals → `docs/rfcs/`;
- accepted architecture decisions → `docs/adr/`.

Change canonical sources rather than copying the same contract into multiple documents.

## Pull requests

Prefer small reviewable PRs with:

- one clear question or outcome;
- tests for domain/interaction behavior where applicable;
- explicit documentation updates when contracts change;
- tracker updates only when existing tracked acceptance criteria are genuinely completed;
- no unrelated refactors bundled into spike work.

A failed spike hypothesis is a valid result if it is documented with evidence.

## License status

Salai does not currently publish an open-source license. See `LICENSE` before assuming reuse rights. Third-party dependencies retain their own licenses.
