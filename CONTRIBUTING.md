# Contributing to Salai

Salai is still in discovery and spike-driven development. Contributions should optimize for validated product learning, clear domain behavior, and maintainable boundaries rather than premature breadth.

Coding agents must also follow [`AGENTS.md`](AGENTS.md) and [`docs/agent-development.md`](docs/agent-development.md).

## Current priority

The active milestone is **Spike 0E — Semantic Editorial Interaction Depth**, currently in a shaping-before-build state.

Before changing structural-editorial behavior, read:

- `docs/rfcs/0003-semantic-editorial-interaction-model.md` — proposed cross-cutting interaction direction and scoped unresolved semantics;
- `docs/editorial-interaction.md` — proposed observable interaction contract;
- `docs/spike-0e-implementation-plan.md` — authoritative 0E task/status/evidence tracker;
- `docs/spike-0d-assessment.md` — human evidence motivating 0E;
- `docs/narrative-ir-spec.md` — authoritative Narrative IR semantics/operations;
- `docs/architecture.md` — application/runtime/editorial boundaries;
- `docs/adr/0009-salai-owns-structural-editorial.md` — accepted structural-editorial product boundary;
- `docs/adr/0008-external-harness-owns-agent-runtime.md` — validated external-agent boundary;
- `docs/README.md` — documentation ownership/lifecycle.

Do not begin 0E implementation until `0E.SHAPE.GATE` is explicitly accepted. Do not use code to silently resolve RFC 0003 questions.

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

For local UI + bridge:

```bash
pnpm dev
```

The browser prototype joins the machine bridge only when opened with `?bridge=1`, for example:

```text
http://localhost:5173/salai/?bridge=1
```

## Change discipline

For Spike 0E:

- keep `@salai/script-model` as the only canonical narrative state;
- keep `SalaiProjectService` as the shared human/machine boundary;
- route canonical multi-operation edits through public Narrative IR operations and `applyOperations()`;
- keep selection/multi-selection, hierarchy expand/collapse, viewport, and playhead outside Narrative IR;
- preserve Cue-owned sequential narrative timing unless an explicit accepted domain decision changes it;
- expose multiple visual/audio ContentBlocks per Cue using the existing model before adding new timing concepts;
- reuse existing create/update/move/delete operations, `moveBlock`, `splitBeat`, `mergeBeats`, and `trimSourceExcerpt` before proposing a new operation;
- keep the external harness responsible for model/provider access, authentication, sessions, history, planning, and tool-loop behavior;
- keep local bridge stateless prototype transport glue;
- keep third-party timeline/rendering state derived/replaceable;
- keep `@moritzbrantner/timeline-editor` and `@elah/core` behind Salai-owned adapters;
- do not implement unresolved Cue split, SourceExcerpt split, independent within-Cue timing, or broad cross-parent grouped moves before RFC resolution;
- do not add MCP/another machine protocol, embedded agent runtime, Production Graph, Story Spine canvas, real media-analysis pipeline, Resolve execution, OTIO interchange, advanced NLE systems, CRDT/event sourcing, distributed state, or general plugin architecture unless the active milestone and an explicit decision require them;
- prefer existing operations/services/platform primitives before new abstractions/dependencies;
- test semantic boundaries rather than incidental presentation.

## Agent-facing machine interface

The validated external surface remains CLI-oriented and self-describing:

```bash
pnpm salai tools
```

When a machine command changes, update discovery output, deterministic tests, and canonical agent-use documentation in the same PR.

For 0E, prefer current semantic context and canonical operations over timeline-engine-specific agent commands.

## Task completion tracking

`docs/spike-0e-implementation-plan.md` is the single task-level tracker for Spike 0E.

A tracked task may be marked complete only when implementation and acceptance criteria are actually satisfied and verified. Human-validation items cannot be completed by automated tests or agent simulation.

Partially implemented work stays unchecked. Add newly required work to the tracker rather than silently expanding scope.

## Documentation changes

Use the canonical ownership table in `docs/README.md`.

- terms → `docs/glossary.md`;
- requirements → `docs/prd.md`;
- Narrative IR semantics → `docs/narrative-ir-spec.md`;
- structural-editorial interaction → `docs/editorial-interaction.md`;
- unresolved cross-cutting questions → `docs/rfcs/`;
- agent product behavior/procedure → agent docs;
- active 0E status/evidence → `docs/spike-0e-implementation-plan.md`;
- architecture → `docs/architecture.md` / ADRs;
- workflow UX → `docs/workflows.md` / `docs/narrative-lenses.md`;
- discovery observations → `docs/research-notes.md`.

Change canonical sources rather than copying the same contract into multiple documents.

## Pull requests

Prefer small reviewable PRs with:

- one clear question/outcome;
- tests for domain/interaction behavior where applicable;
- explicit documentation updates when contracts change;
- tracker updates only when criteria are genuinely completed;
- no unrelated refactors bundled into spike work.

A failed spike hypothesis is a valid result if documented with evidence.

## License status

Salai does not currently publish an open-source license. See `LICENSE` before assuming reuse rights. Third-party dependencies retain their own licenses.
