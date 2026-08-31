# Salai

Salai is an experimental local-first, narrative-aware production companion for DaVinci Resolve.

Its purpose is to keep **story intent, source material, production needs, real/generated media, alternatives, and Resolve editorial context connected** without making the filmmaker manually manage all of that structure.

## Product hypothesis

> **Express intent naturally; Salai structures it for production. See and reshape that structure through narrative lenses.**

Underlying architecture:

> **One Narrative IR, multiple human and machine interfaces.**

Key UX refinement after Spike 0B:

> **Hide structural bookkeeping, not narrative structure.**

Salai automates incidental mechanics such as IDs, parent references, operation selection, and obvious relationship wiring. Structured views remain first-class when they help the creator understand or reshape the story.

## Narrative Lenses

The existing structured surfaces are Narrative Lenses over the same canonical project:

- Outline;
- Story Wall / Beat Board;
- AV Script;
- Paper / Radio Edit.

A creator enters a lens when that representation is useful for thinking or direct manipulation; a lens is not a separate project document. DaVinci Resolve remains the frame-accurate editing, Fusion, color, Fairlight, and delivery environment.

See [`docs/narrative-lenses.md`](docs/narrative-lenses.md).

## What Spike 0B taught us

0B established that one Narrative IR can support synchronized creative views, while routine direct structured authoring requires too much interaction to be the default creative path. The views remain useful when deliberately entered as Narrative Lenses.

See [`docs/spike-0b-assessment.md`](docs/spike-0b-assessment.md).

## Current development state

### Spike 0A — Narrative IR

**Complete / pass.**

`packages/script-model/` provides the canonical TypeScript model, typed operations, validation, serialization, runtime estimation, stable identity, source-backed semantics, and representative fixtures.

Authoritative contract: [`docs/narrative-ir-spec.md`](docs/narrative-ir-spec.md).

### Spike 0B — Structured Authoring UX

**Closed / mixed.**

The React prototype proved synchronized views over one canonical project but failed the creative-friction test as the routine authoring path.

Historical contract: [`docs/authoring-ux-spec.md`](docs/authoring-ux-spec.md).

### Spike 0C — External-Agent Authoring + Narrative Lenses

**Current validation milestone.**

0C validates a deliberately small architecture:

```text
external agent harness
        ↓
Salai machine interface / CLI
        ↓
SalaiProjectService
        ↓
NarrativeOperation[] / applyOperations()
        ↓
Narrative IR + Workspace
        ↓
Narrative Lenses
```

The external harness owns model access, authentication, sessions, history, planning, and its tool loop. Salai owns the narrative/project semantics and exposes one narrow machine interface to the same live project service used by the UI.

0C must prove:

- an external harness can inspect and mutate the same live Salai project as the Narrative Lenses;
- one script-first low-friction vertical slice;
- one fixture-backed source vertical slice;
- grouped canonical application + immediate one-step revert;
- one harness-normalized project → lens → direct edit → follow-up harness round trip;
- human evidence of materially lower routine interaction than 0B and useful voluntary structural insight.

Salai does **not** embed a model/provider SDK, provider authentication, chat runtime, model router, or agent session in 0C. The current browser prototype may use a minimal local request/response bridge solely so an external CLI can reach its live `SalaiProjectService`.

See [`docs/agent-mediated-authoring.md`](docs/agent-mediated-authoring.md), [`docs/adr/0008-external-harness-owns-agent-runtime.md`](docs/adr/0008-external-harness-owns-agent-runtime.md), and [`docs/spike-0c-implementation-plan.md`](docs/spike-0c-implementation-plan.md).

## Architecture direction

- TypeScript Narrative IR is canonical semantic state.
- One canonical IR backs synchronized Projections/Workspaces/Lenses (ADR 0005).
- `SalaiProjectService` is the shared human/machine application boundary.
- External harnesses own model/runtime/auth/session behavior (ADR 0008).
- The first machine interface is CLI-oriented; MCP is added only if later evidence requires it.
- Machine changes reuse public `NarrativeOperation[]` / `applyOperations()` before any scenario-specific higher-level command is introduced.
- Higher-level commands are allowed only when Salai must resolve IDs/references/placement itself and compile immediately to canonical operations.
- Harness/model history is not Salai project persistence.
- Resolve remains downstream behind an explicit Salai adapter/materialization boundary.

See [`docs/architecture.md`](docs/architecture.md) and [`docs/adr/`](docs/adr/).

## Documentation

Start with [`docs/README.md`](docs/README.md), which defines the canonical owner for each kind of information.

Most relevant current docs:

- [`docs/product-brief.md`](docs/product-brief.md) — product thesis/positioning;
- [`docs/prd.md`](docs/prd.md) — product requirements/success criteria;
- [`docs/research-notes.md`](docs/research-notes.md) — discovery evidence;
- [`docs/narrative-lenses.md`](docs/narrative-lenses.md) — Narrative Lens semantics;
- [`docs/agent-mediated-authoring.md`](docs/agent-mediated-authoring.md) — active 0C interaction contract;
- [`docs/spike-0c-implementation-plan.md`](docs/spike-0c-implementation-plan.md) — only 0C task/status tracker;
- [`docs/mvp.md`](docs/mvp.md) — validation sequence;
- [`docs/backlog.md`](docs/backlog.md) — NOW/NEXT/LATER outcomes;
- [`docs/architecture.md`](docs/architecture.md) — current system architecture.

## Contributing and license

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for development/documentation conventions.

Salai does not currently publish an open-source license. See [`LICENSE`](LICENSE) for current status; third-party dependencies retain their own licenses.
