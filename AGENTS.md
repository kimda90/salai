# Salai agent instructions

This file applies to the entire repository. Start here, then use [docs/README.md](docs/README.md) to find the canonical owner of each topic.

## Operating modes

**Using Salai:** operate the live filmmaker project through its supported machine interface. Follow [agent-usage.md](docs/agent-usage.md). Repository file edits are not project edits.

**Developing Salai:** change source, tests, documentation, tooling, or architecture. Follow [agent-development.md](docs/agent-development.md) and [CONTRIBUTING.md](CONTRIBUTING.md). Inspect the branch, current tracker, relevant code, tests, and accepted decisions before changing anything.

## Current product direction

Salai is an **AI filmmaking interface with a heavy focus on narrative intents**. The user loop is **Tell → See → Direct → Update → See**. Stills and cheap motion make intent reviewable early; sophisticated internal models are not the product.

The active task/status owner is [filmmaking-implementation-plan.md](docs/filmmaking-implementation-plan.md). The former standalone [0E program](docs/spike-0e-implementation-plan.md) is paused, not completed. Do not resume the full timeline-depth checklist or gate generation on it by default.

Read for new work:

- [PRD](docs/prd.md), [workflows](docs/workflows.md), and [filmmaking interaction](docs/filmmaking-interaction.md);
- [architecture](docs/architecture.md) and [ADR 0010](docs/adr/0010-narrative-first-ai-filmmaking.md);
- [Narrative IR contract](docs/narrative-ir-spec.md) and relevant code;
- [RFC 0004](docs/rfcs/0004-narrative-first-filmmaking-loop.md) for proposed schema/generation additions.

An approved product direction is not evidence that a proposed schema or integration exists. RFC 0004 must be accepted before its domain extensions are implemented. Existing-API groundwork can proceed as identified in the active plan.

## Architecture boundaries

- `@salai/script-model` is the only canonical narrative model.
- `SalaiProjectService` is the shared human/machine application boundary; do not create another state owner to match its name.
- Canonical multi-operation changes use `applyOperations()` through that service.
- Human surfaces and agents operate on the same project. Timeline, playback, and future generation/3D adapter state do not become project truth.
- The external harness owns model access, authentication, conversation history, planning, and tool-loop behavior under [ADR 0008](docs/adr/0008-external-harness-owns-agent-runtime.md).
- Salai owns narrative intent, accepted project edits, source identity, and the structural edit. Specialist NLEs remain optional downstream.
- No graph database, generic dependency/constraint engine, parallel agent runtime, extra transport, or broad plugin framework is implied by this pivot.
- Preserve Beat/Cue distinctions, multiple Cue contents, existing ShotIntent identity, and recorded source ranges. Do not equate Cue with Shot or reduce existing relationships to a single parent pointer.
- Reuse the current timeline/playback adapters unless a concrete task proves they cannot meet the required behavior.

For temporal changes, consult [editorial-interaction.md](docs/editorial-interaction.md) and [RFC 0003](docs/rfcs/0003-semantic-editorial-interaction-model.md). Its deferred split/timing questions remain unresolved; do not implement them through hidden renderer state.

## Using the current prototype

```bash
pnpm salai tools
pnpm dev
```

Open `http://localhost:5173/salai/?bridge=1`. Before each project mutation, run `pnpm salai context`. Use only discovered tools. Inspect the result and read fresh context after each successful mutation.

Future transcription, generation, reference/version, and 3D commands must not be invented from the product docs. An uploaded recording is source evidence; screenplay interpretation is authored material.

## Completion

For code changes, run `pnpm typecheck`, `pnpm test`, and `pnpm build`, plus focused tests. For documentation-only work, check ownership, links, status consistency, and the proposed-versus-implemented boundary; report unavailable checks honestly.

Keep changes focused, preserve historical evidence, and do not mark human validation or market differentiation as proved by documentation, automated tests, or agent simulation.
