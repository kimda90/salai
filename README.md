# Salai

Salai is an experimental local-first, narrative-aware production companion for DaVinci Resolve.

Its purpose is to keep **story intent, source material, production needs, real/generated media, alternatives, and Resolve editorial context connected** without making the filmmaker manually manage all of that structure.

## Product hypothesis

> **Express intent naturally; Salai structures it for production. See and reshape that structure through narrative lenses.**

```text
write / instruct / provide media context
                ↓
        Salai normalization
                ↓
      canonical project state
                ↓
        Narrative Lenses
                ↓
             Resolve
```

Underlying architecture:

> **One Narrative IR, multiple synchronized creative views.**

Key UX refinement after Spike 0B:

> **Hide structural bookkeeping, not narrative structure.**

Salai should automate incidental mechanics such as IDs, parent references, operation selection, and obvious relationship wiring. Structured views remain first-class when they help the creator understand or reshape the story.

## Narrative Lenses

The four existing structured surfaces are Narrative Lenses over the same canonical project:

- Outline;
- Story Wall / Beat Board;
- AV Script;
- Paper / Radio Edit.

A creator enters a lens deliberately when that representation is useful for thinking or direct manipulation; a lens is not a mandatory authoring stage or a separate project document.

Later lens candidates include Coverage and Frame Wall / Selects, after the corresponding production/media model exists and the workflow is validated.

See [`docs/narrative-lenses.md`](docs/narrative-lenses.md).

DaVinci Resolve remains the frame-accurate editing, Fusion, color, Fairlight, and delivery environment.

## What Spike 0B taught us

0B implemented the four structured surfaces over one `@salai/script-model` project and produced three conclusions:

- **the model/view architecture works:** stable identity, source evidence, Workspace separation, runtime, and cross-view changes remain coherent;
- **routine direct structured authoring does not:** ordinary creative changes require too much interaction/model management;
- **the structured views remain creatively useful:** they can reveal properties that prose/conversation alone may not make obvious.

The current direction is therefore agent-mediated routine authoring **plus** first-class Narrative Lenses, not “replace the views with chat.”

See [`docs/spike-0b-assessment.md`](docs/spike-0b-assessment.md).

## Current development state

### Spike 0A — Narrative IR

**Complete / pass.**

`packages/script-model/` provides the canonical TypeScript model, typed operations, validation, serialization, runtime estimation, stable identity, source-backed semantics, and representative fixtures.

Authoritative contract: [`docs/narrative-ir-spec.md`](docs/narrative-ir-spec.md).

### Spike 0B — Structured Authoring UX

**Closed / mixed.**

The shared React prototype proved the synchronized-view architecture but failed the creative-friction test as a routine authoring path.

Historical contract: [`docs/authoring-ux-spec.md`](docs/authoring-ux-spec.md).

Assessment: [`docs/spike-0b-assessment.md`](docs/spike-0b-assessment.md).

### Spike 0C — Agent-Mediated Authoring + Narrative Lenses

**Current validation milestone.**

0C is intentionally narrow. It must prove:

- one script-first low-friction vertical slice;
- one fixture-backed footage/source vertical slice;
- grouped canonical application + one-step revert using the existing `applyOperations()` boundary;
- one agent-normalized project → existing lens → direct edit → follow-up agent round trip;
- human evidence of materially lower routine interaction than 0B and useful voluntary structural insight.

A new Coverage Lens, production graph, real media analysis, desktop runtime, and Resolve execution are deferred.

See [`docs/agent-mediated-authoring.md`](docs/agent-mediated-authoring.md), [`docs/narrative-lenses.md`](docs/narrative-lenses.md), and [`docs/spike-0c-implementation-plan.md`](docs/spike-0c-implementation-plan.md).

## Architecture direction

Key accepted/proposed boundaries:

- TypeScript Narrative IR is canonical semantic state;
- one canonical IR backs synchronized Projections/Workspaces/Lenses (ADR 0005);
- the 0C agent path reuses public `NarrativeOperation[]` / `applyOperations()` before introducing any higher-level command adapter;
- a higher-level agent command is added only when a concrete scenario proves Salai must resolve IDs/relative references itself;
- hosted inference receives only task-relevant selected/derived context; raw production media remains local by default;
- Electron/local-service/persistence arrive after the primary interaction is validated;
- CutMaster remains the default Resolve automation boundary behind a Salai adapter;
- OpenTimelineIO/OpenAssetIO/ComfyUI/media-analysis tools stay at integration boundaries rather than owning Salai semantics.

An agent request changes canonical Salai state first; it does not become an opaque natural-language command stream directly into Resolve.

See [`docs/architecture.md`](docs/architecture.md) and [`docs/adr/`](docs/adr/).

## Documentation

Start with [`docs/README.md`](docs/README.md), which defines the canonical owner for each kind of information.

Most relevant current docs:

- [`docs/product-brief.md`](docs/product-brief.md) — product thesis/positioning;
- [`docs/prd.md`](docs/prd.md) — product requirements/success criteria;
- [`docs/research-notes.md`](docs/research-notes.md) — discovery evidence;
- [`docs/narrative-lenses.md`](docs/narrative-lenses.md) — canonical Narrative Lens semantics;
- [`docs/agent-mediated-authoring.md`](docs/agent-mediated-authoring.md) — active 0C interaction contract;
- [`docs/spike-0c-implementation-plan.md`](docs/spike-0c-implementation-plan.md) — only 0C task/status tracker;
- [`docs/mvp.md`](docs/mvp.md) — validation sequence;
- [`docs/backlog.md`](docs/backlog.md) — NOW/NEXT/LATER outcomes;
- [`docs/architecture.md`](docs/architecture.md) — system architecture.

## Contributing and license

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for development/documentation conventions.

Salai does not currently publish an open-source license. See [`LICENSE`](LICENSE) for current status; third-party dependencies retain their own licenses.