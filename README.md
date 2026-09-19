# Salai

**An experimental AI filmmaking interface with a heavy focus on narrative intents.**

Tell a story, see an early version, and direct it by responding to what you see. Salai should keep what a moment is meant to communicate connected to its references, shots, generated candidates, and current edit.

```text
Tell → See → Direct → Update → See …
```

The first useful result is a still-based storyboard or animatic, not a promise of a finished movie. Move to cheap motion when it helps answer the next creative question. Stop there, keep refining, or explicitly choose higher quality later.

## Product direction

- Interpret spoken or written stories into editable screenplay/narrative structure without making breakdown management a required user task.
- Add references and direction whenever useful, rather than completing a mandatory setup wizard.
- Keep narrative intent visible in context: what should change for the character or audience, not only what a shot looks like.
- Review and update selected parts of the existing film while preserving accepted work and earlier candidates.
- Treat generation as approved external work; show its scope, progress, failures, and cost uncertainty.

This is deliberately in the AI filmmaking category. Narrative-centered iteration is the focus to validate, not a claim that competitors cannot provide it. See [competitive positioning](docs/competitive-landscape.md).

## What exists versus what is planned

The repository currently contains a TypeScript Narrative IR and a React/Vite prototype with structured views, an external-agent machine interface, and rough timeline/playback adapters. The prior human-validation results are retained in the [documentation map](docs/README.md).

**The new filmmaking loop is not implemented by this documentation change.** Real story transcription, generated stills/motion, revision-aware generation provenance, durable media handling, and 3D shot direction must not be advertised as working features.

The previous standalone Spike 0E timeline-depth program is paused, not passed. Useful editing work is adopted only where the new loop needs it. The active work sequence and evidence live in [the filmmaking implementation plan](docs/filmmaking-implementation-plan.md).

## Small architecture

Human controls and an external harness use the same `SalaiProjectService` and canonical project. Script, storyboard, timeline, and future 3D controls are views or adapters, not separate sources of truth. Keep the existing Narrative IR and source-evidence semantics; extend them only through reviewed, tested contracts.

[Architecture](docs/architecture.md) · [Product brief](docs/product-brief.md) · [Requirements](docs/prd.md) · [Workflow](docs/workflows.md) · [Pivot decision](docs/adr/0010-narrative-first-ai-filmmaking.md)

## Development

Start with [AGENTS.md](AGENTS.md) and [CONTRIBUTING.md](CONTRIBUTING.md). Use the package-manager version declared in `package.json`.

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

The existing machine interface is self-describing: `pnpm salai tools`. Its supported operating procedure is [agent-usage.md](docs/agent-usage.md); proposed filmmaking commands are not available until implemented and added to discovery.

## License

See [LICENSE](LICENSE). This repository does not currently grant an open-source license; third-party dependencies retain their own licenses.
