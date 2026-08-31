# Contributing to Salai

Salai is still in discovery and spike-driven development. Contributions should optimize for validated product learning, clear domain behavior, and maintainable boundaries rather than premature breadth.

Coding agents must also follow [`AGENTS.md`](AGENTS.md) and [`docs/agent-development.md`](docs/agent-development.md).

## Current priority

The active milestone is **Spike 0C — External-Agent Authoring + Narrative Lenses**.

Before changing current behavior, read:

- `docs/spike-0c-implementation-plan.md` — authoritative task/status/evidence tracker;
- `docs/agent-mediated-authoring.md` — active agent-mediated interaction contract;
- `docs/narrative-ir-spec.md` — authoritative Narrative IR semantics and operation contract;
- `docs/architecture.md` — current application/runtime boundaries;
- `docs/adr/0007-project-service-is-the-human-machine-boundary.md` — shared human/machine service boundary;
- `docs/adr/0008-external-harness-owns-agent-runtime.md` — current runtime decision;
- `docs/README.md` — documentation ownership/lifecycle.

Human-validation tasks in 0C remain open until a human actually performs them.

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

For Spike 0C:

- keep `@salai/script-model` as the only canonical narrative state;
- keep `SalaiProjectService` as the shared human/machine application boundary;
- route canonical multi-operation edits through the public Narrative IR operation path and `applyOperations()`;
- keep Workspace layout/organization separate from Narrative IR semantics;
- keep the external harness responsible for model/provider access, authentication, sessions, history, planning, and tool-loop behavior;
- keep the local HTTP bridge stateless and limited to prototype transport glue;
- do not add MCP, another machine protocol, an embedded agent runtime, model/provider SDKs, CRDT/event sourcing, distributed state, production graph, real media analysis, Resolve execution, or a general plugin framework unless the active validated milestone and an explicit architecture decision require them;
- prefer existing operations/services and platform primitives before new abstractions or dependencies;
- add tests around semantic boundaries rather than incidental presentation;
- do not duplicate the authoritative Narrative IR operation vocabulary into summary or tracker docs.

## Agent-facing machine interface

The supported Spike 0C external surface is CLI-oriented. The CLI is self-describing:

```bash
pnpm salai tools
```

When a machine command changes, update the discovery output, deterministic tests, and the canonical agent-use documentation in the same PR. See `docs/agent-development.md`.

## Task completion tracking

`docs/spike-0c-implementation-plan.md` is the single task-level tracker for Spike 0C.

A tracked task may be marked complete only when its implementation and acceptance criteria are actually satisfied and verified. Human-validation items cannot be completed by automated tests or agent simulation.

Partially implemented work stays unchecked. Add newly required work to the tracker rather than silently expanding scope.

## Documentation changes

Use the canonical ownership table in `docs/README.md`.

- product terms → `docs/glossary.md`;
- requirements → `docs/prd.md`;
- Narrative IR implementation semantics → `docs/narrative-ir-spec.md`;
- agent-mediated product behavior → `docs/agent-mediated-authoring.md`;
- agent operating procedure → `docs/agent-usage.md`;
- coding-agent development procedure → `docs/agent-development.md`;
- active 0C status/evidence → `docs/spike-0c-implementation-plan.md`;
- system architecture → `docs/architecture.md`;
- workflow UX → `docs/workflows.md` and `docs/narrative-lenses.md`;
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
