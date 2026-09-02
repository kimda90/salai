# Salai agent instructions

This file applies to the entire repository.

## Choose the operating mode

Agents working in this repository must distinguish between two modes:

1. **Using Salai** — operating the live Salai project on behalf of a filmmaker through the supported machine interface.
2. **Developing Salai** — changing Salai source code, tests, documentation, build tooling, or architecture.

If a task spans both modes, follow both standards. Do not use repository/source-file edits as a substitute for the Salai machine interface, and do not use the live Salai machine interface as a substitute for code changes.

## Non-negotiable architecture

- `@salai/script-model` is the only canonical narrative model.
- `SalaiProjectService` is the human/machine application boundary.
- Canonical multi-operation changes go through `applyOperations()` via the project service.
- Human semantic surfaces and agents operate on the same live project; there is no shadow agent project.
- The external agent harness owns model/provider access, authentication, conversation history, planning, and tool-loop behavior.
- Salai owns structural editorial semantics; third-party timeline/rendering state is derived and replaceable.
- Specialist NLEs such as DaVinci Resolve are optional downstream precision/finishing targets, not canonical Salai state.
- The local HTTP bridge is prototype transport glue for the browser-owned project, not a second domain API or state owner.
- Do not add MCP, another transport, another agent runtime, a parallel mutation model, or a canonical third-party timeline document unless a validated need and an explicit architecture decision require it.

## Using Salai

The canonical operating standard is [`docs/agent-usage.md`](docs/agent-usage.md).

The CLI is self-describing. At the beginning of a session, discover the currently implemented tools instead of relying on prompt memory:

```bash
pnpm salai tools
```

For live project access:

```bash
pnpm dev
```

Then ensure the browser is open at:

```text
http://localhost:5173/salai/?bridge=1
```

Before every project mutation, read fresh context:

```bash
pnpm salai context
```

Use only tools reported by `pnpm salai tools`. Treat Salai project state, not conversation history, as authoritative. After every successful mutation, inspect the result and read context again before making another creative change.

## Developing Salai

The canonical development standard for agents is [`docs/agent-development.md`](docs/agent-development.md). Human contribution guidance is in [`CONTRIBUTING.md`](CONTRIBUTING.md).

The current milestone is **Spike 0E — Semantic Editorial Interaction Depth**. RFC 0003 and the structural-editorial interaction contract are accepted; implementation begins at **0E.0 — Interaction foundation and evaluation noise**.

Before changing current structural-editorial behavior, read at minimum:

- [`docs/rfcs/0003-semantic-editorial-interaction-model.md`](docs/rfcs/0003-semantic-editorial-interaction-model.md)
- [`docs/editorial-interaction.md`](docs/editorial-interaction.md)
- [`docs/spike-0e-implementation-plan.md`](docs/spike-0e-implementation-plan.md)
- [`docs/spike-0d-assessment.md`](docs/spike-0d-assessment.md)
- [`docs/narrative-ir-spec.md`](docs/narrative-ir-spec.md)
- [`docs/architecture.md`](docs/architecture.md)
- [`docs/adr/0009-salai-owns-structural-editorial.md`](docs/adr/0009-salai-owns-structural-editorial.md)
- [`docs/adr/0008-external-harness-owns-agent-runtime.md`](docs/adr/0008-external-harness-owns-agent-runtime.md)

0E reuses `@moritzbrantner/timeline-editor` as the controlled timeline adapter and `@elah/core` as the playback/materialization adapter unless evidence from the accepted interaction contract proves one cannot satisfy the required behavior. Keep both replaceable and keep their state out of Salai persistence.

Prefer existing canonical operations before adding domain behavior. In particular, existing `create*`, `update*`, `move*`, `moveBlock`, `splitBeat`, `mergeBeats`, delete operations, and `trimSourceExcerpt` are the starting vocabulary for 0E direct manipulation.

RFC 0003 intentionally defers Cue split, SourceExcerpt split, independent within-Cue block timing, intentional black-vs-missing identity, and broad cross-parent grouped moves. Do not implement any of those implicitly through UI/engine state; resolve the relevant RFC question explicitly first if a later slice reaches it.

Before declaring a code change complete, run:

```bash
pnpm typecheck
pnpm test
pnpm build
```

Do not mark human-validation tasks complete without actual human evidence.
