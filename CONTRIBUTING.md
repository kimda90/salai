# Contributing to Salai

Salai is still in discovery and spike-driven development. Contributions should optimize for learning and clear product/domain evidence rather than premature breadth.

## Current priority

The active implementation target is **Spike 0B — Familiar Authoring UX**.

Before changing Spike 0B behavior, read:

- `docs/authoring-ux-spec.md` — authoritative Spike 0B implementation/validation contract;
- `docs/spike-0b-implementation-plan.md` — executable task tracker and completion evidence;
- `docs/workflows.md` — canonical creative workflow behavior;
- `docs/narrative-ir-spec.md` — authoritative Narrative IR semantics and operation contract;
- `docs/mvp.md` — validation sequence;
- `docs/README.md` — documentation ownership/lifecycle.

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

## Change discipline

For Spike 0B:

- keep `@salai/script-model` as the only canonical narrative state;
- route semantic edits through the public Narrative IR operation API;
- keep Workspace layout/organization separate from Narrative IR semantics;
- do not introduce Electron, Python/FastAPI, SQLite, Resolve, real LLMs, transcription, GenAI, generic canvas/graph editors, or rich-text document models unless a minimal mock is required to answer the 0B validation question;
- prefer commodity UI libraries for mechanics while keeping gesture meaning and workflow semantics in Salai-owned code;
- add tests around semantic boundaries rather than pixel-perfect appearance;
- update `docs/authoring-ux-spec.md` only when implementation evidence changes the contract;
- update `docs/spike-0b-implementation-plan.md` in every implementation PR, checking only tasks fully completed and verified by that PR;
- do not duplicate the authoritative Narrative IR operation vocabulary into summary or tracker docs.

## Task completion tracking

`docs/spike-0b-implementation-plan.md` is the single task-level tracker for Spike 0B.

A task may be marked complete only when the implementation is merged to `main`, relevant tests/typechecks/builds pass, task acceptance criteria have been verified, and any affected canonical documentation is updated.

Partially implemented work stays unchecked. Add new required tasks to the tracker when implementation reveals them rather than silently expanding scope.

## Documentation changes

Use the canonical ownership table in `docs/README.md`.

- product terms → `docs/glossary.md`;
- requirements → `docs/prd.md`;
- Narrative IR implementation semantics → `docs/narrative-ir-spec.md`;
- Spike 0B UX/interaction contract → `docs/authoring-ux-spec.md`;
- Spike 0B execution status → `docs/spike-0b-implementation-plan.md`;
- system architecture → `docs/architecture.md`;
- workflow UX → `docs/workflows.md`;
- proposals → `docs/rfcs/`;
- accepted architecture decisions → `docs/adr/`.

## Pull requests

Prefer small reviewable PRs with:

- a clear question or outcome;
- tests for domain/interaction behavior where applicable;
- the relevant Spike 0B tracker tasks checked only when fully satisfied;
- explicit documentation updates when contracts change;
- no unrelated refactors bundled into spike work.

A failed spike hypothesis is a valid result if it is documented with evidence.

## License status

Salai does not currently publish an open-source license. See `LICENSE` before assuming reuse rights. Third-party dependencies retain their own licenses.
