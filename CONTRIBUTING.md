# Contributing to Salai

Salai is an experimental AI filmmaking interface centered on narrative intents. Optimize for a useful **Tell → See → Direct → Update** loop and a small maintainable implementation, not the breadth of an NLE or production-management suite.

## Start here

Read [AGENTS.md](AGENTS.md) and the [documentation map](docs/README.md). Product requirements live in [the PRD](docs/prd.md), current work in [the filmmaking implementation plan](docs/filmmaking-implementation-plan.md), and domain operations in [the Narrative IR specification](docs/narrative-ir-spec.md).

The standalone Spike 0E program is paused. Existing temporal behavior still follows [the editorial contract](docs/editorial-interaction.md); adopt a task from 0E only when the active filmmaking slice needs it. Do not mark the old spike passed.

## Setup and validation

The existing CI uses Node.js 24. Use the pnpm version declared by `packageManager` in `package.json`.

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

The browser joins the current machine bridge at `http://localhost:5173/salai/?bridge=1`. Discover supported commands with `pnpm salai tools` and follow [the operating procedure](docs/agent-usage.md).

## Change discipline

Keep one canonical project and one shared project-service mutation boundary. Preserve stable IDs, authored/source-backed distinctions, atomic changes, and derivable timeline/playback state. Keep model/session infrastructure in the external harness. A feedback box does not authorize a new agent runtime.

Do not silently rename ShotIntent, flatten Beat/Cue, add independent within-Cue timing, or attach new media state only to a renderer. Review [RFC 0004](docs/rfcs/0004-narrative-first-filmmaking-loop.md) before implementing proposed filmmaking data, and [RFC 0003](docs/rfcs/0003-semantic-editorial-interaction-model.md) when a temporal change reaches its deferred questions.

Generate against frozen inputs; keep completed media immutable; distinguish an input-version mismatch from a creative judgment. Scope and approve external generation, preserve selected work on failure, and never upload source/reference media implicitly.

## Evidence and documentation

Use the owner named in `docs/README.md` instead of copying contracts. Update schema, operations, migration tests, discovery, and relevant docs together when actual behavior changes. Runtime specifications must describe implemented behavior, not future capability.

Keep task checkboxes open until their criteria are met. A human pilot needs actual human evidence. A mock proves deterministic plumbing, not generation quality, narrative understanding, or market advantage.

For docs-only PRs, validate relative links, current-versus-historical status, scope consistency, and claims against sources. Do not claim application tests ran when the environment could not execute them.

## Pull requests

Use a focused branch and a clear outcome. State changed behavior or documentation scope, checks run and not run, migration implications, and remaining blockers. Do not bundle unrelated code, dependencies, or infrastructure. Do not merge without the requested review and required CI.

See [LICENSE](LICENSE) before assuming reuse rights. Third-party dependencies retain their own licenses.
