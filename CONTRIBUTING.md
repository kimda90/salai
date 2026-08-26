# Contributing to Salai

Salai is still in discovery and spike-driven development. Contributions should optimize for learning and clear product/domain evidence rather than premature breadth.

## Current priority

The active implementation target is **Spike 0A — Narrative IR** in `packages/script-model/`.

Before changing Narrative IR behavior, read:

- `docs/glossary.md` — canonical terminology;
- `docs/narrative-ir-spec.md` — authoritative implementation contract;
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

For Spike 0A:

- keep the package independent from Electron, React, Python, SQLite, Resolve, real LLMs, and editor frameworks;
- prefer explicit domain operations over generic mutation helpers;
- update `docs/narrative-ir-spec.md` when implementation evidence changes the contract;
- add/adjust fixture tests for semantic changes;
- do not duplicate the authoritative operation vocabulary into summary docs.

## Documentation changes

Use the canonical ownership table in `docs/README.md`.

- product terms → `docs/glossary.md`;
- requirements → `docs/prd.md`;
- implementation semantics → `docs/narrative-ir-spec.md`;
- system architecture → `docs/architecture.md`;
- workflow UX → `docs/workflows.md`;
- proposals → `docs/rfcs/`;
- accepted architecture decisions → `docs/adr/`.

## Pull requests

Prefer small reviewable PRs with:

- a clear question or outcome;
- tests for domain behavior where applicable;
- explicit documentation updates when contracts change;
- no unrelated refactors bundled into spike work.

A failed spike hypothesis is a valid result if it is documented with evidence.

## License status

Salai does not currently publish an open-source license. See `LICENSE` before assuming reuse rights. Third-party dependencies retain their own licenses.
