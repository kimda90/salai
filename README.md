# Salai

Salai is an experimental local-first, narrative-aware audiovisual construction environment.

Its purpose is to keep **story intent, source material, production needs, real/generated media, alternatives, and the active structural edit connected** without making the filmmaker manually manage all of that structure.

## Product thesis

> **Express intent naturally; Salai structures it for production and structural editorial. See, play, and reshape the same story through semantic creative surfaces.**

Underlying architecture:

> **One canonical narrative/project model, multiple human and machine interfaces.**

Key UX principle after Spike 0B:

> **Hide structural bookkeeping, not narrative structure.**

Spike 0C then human-validated the external-agent loop with Codex: the integration worked correctly and demonstrated that an agent in the loop materially reduces the friction of manipulating Salai's canonical narrative structure.

## Product/editorial boundary

Salai now owns **narrative construction + structural editorial**.

Structural editorial means the minimum temporal/media capability needed to construct, play, judge, and revise an audiovisual story while preserving narrative identity and source provenance: semantic timeline, rough assembly, playback, narrative/media reordering, source-range trimming, and basic picture/audio arrangement as validated by workflows.

Salai does not aim to reproduce specialist NLE finishing systems. DaVinci Resolve and other NLEs are optional downstream targets for precision editorial, advanced post, color, audio finishing, compositing, mastering, and delivery.

See [`docs/adr/0009-salai-owns-structural-editorial.md`](docs/adr/0009-salai-owns-structural-editorial.md).

## Validated foundation

### Spike 0A — Narrative IR

**Complete / pass.**

`packages/script-model/` provides the canonical TypeScript model, typed operations, validation, serialization, runtime estimation, stable identity, source-backed semantics, and representative script-first/footage-first fixtures.

Authoritative contract: [`docs/narrative-ir-spec.md`](docs/narrative-ir-spec.md).

### Spike 0B — Structured Authoring UX

**Closed / mixed.**

The React prototype proved synchronized Story Wall, Outline, AV Script, and Paper/Radio views over one canonical project, while human testing showed that routine direct structure management required too much interaction to be the default creative path.

Historical contract: [`docs/authoring-ux-spec.md`](docs/authoring-ux-spec.md).

### Spike 0C — External-Agent Authoring + Narrative Lenses

**Complete / pass.**

0C validated this boundary:

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
human UI
```

Codex was used as the human-validation harness. It operated the live Salai project correctly and demonstrated the convenience of agent-mediated structural manipulation without Salai owning provider auth, sessions, model routing, conversation history, or the harness tool loop.

See [`docs/spike-0c-assessment.md`](docs/spike-0c-assessment.md) and [`docs/adr/0008-external-harness-owns-agent-runtime.md`](docs/adr/0008-external-harness-owns-agent-runtime.md).

## Current development state

### Spike 0D — Semantic Editorial Environment

**Current validation iteration.**

0D tests whether Salai's semantic narrative state remains valuable when the story becomes playable and structurally editable in time without Resolve.

The first implementation deliberately reuses open-source media/editor infrastructure:

- [`@moritzbrantner/timeline-editor`](https://github.com/moritzbrantner/timeline-editor) for controlled React timeline interaction;
- [`@elah/core`](https://github.com/elahlabs/elah) for the first playback/materialization adapter.

Both remain replaceable infrastructure. Their project/timeline models must not become canonical Salai project state.

0D must prove:

- a semantic timeline that exposes narrative meaning and audiovisual timing together;
- playable rough assembly inside Salai;
- direct timeline edits round-tripping through Salai-owned operations;
- source-backed ranges preserving provenance;
- Codex/external-agent changes and direct temporal edits sharing one project;
- human evidence that semantic structure makes the timeline more useful than a generic clip timeline.

Canonical tracker: [`docs/spike-0d-implementation-plan.md`](docs/spike-0d-implementation-plan.md).

## Architecture direction

- TypeScript Narrative IR remains canonical semantic state.
- One canonical project backs human surfaces and the machine interface.
- `SalaiProjectService` remains the shared human/machine application boundary.
- External harnesses own model/runtime/auth/session behavior (ADR 0008).
- Salai owns structural editorial/playback while specialist NLEs remain optional downstream (ADR 0009).
- Timeline/rendering engines are adapters/projections, never project truth.
- The first machine interface remains CLI-oriented; add another protocol only when an integration demonstrates a concrete need.
- Harness/model history is not Salai project persistence.

See [`docs/architecture.md`](docs/architecture.md) and [`docs/adr/`](docs/adr/).

## Documentation

Start with [`docs/README.md`](docs/README.md), which defines the canonical owner for each kind of information.

Most relevant current docs:

- [`docs/product-brief.md`](docs/product-brief.md) — product thesis/positioning;
- [`docs/prd.md`](docs/prd.md) — product requirements/success criteria;
- [`docs/research-notes.md`](docs/research-notes.md) — discovery evidence;
- [`docs/narrative-lenses.md`](docs/narrative-lenses.md) — structured-view semantics retained from 0B/0C;
- [`docs/agent-mediated-authoring.md`](docs/agent-mediated-authoring.md) — validated external-agent interaction contract;
- [`docs/spike-0c-assessment.md`](docs/spike-0c-assessment.md) — completed 0C result;
- [`docs/spike-0d-implementation-plan.md`](docs/spike-0d-implementation-plan.md) — current task/status tracker;
- [`docs/mvp.md`](docs/mvp.md) — validation sequence;
- [`docs/backlog.md`](docs/backlog.md) — NOW/NEXT/LATER outcomes;
- [`docs/architecture.md`](docs/architecture.md) — current system architecture.

## Contributing and license

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for development/documentation conventions.

Salai does not currently publish an open-source license. See [`LICENSE`](LICENSE) for current status; third-party dependencies retain their own licenses.
