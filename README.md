# Salai

Salai is an experimental local-first, narrative-aware production companion for DaVinci Resolve.

Its purpose is to keep **story intent, source material, production needs, real/generated media, alternatives, and Resolve editorial context connected** throughout a project without making the filmmaker manually manage all of that structure.

## Product hypothesis

> **Express intent naturally; Salai structures it for production.**

The primary interaction direction is now:

```text
write / talk / drop media
          ↓
    Salai agent layer
 interpret + normalize
          ↓
 structured canonical project
          ↓
 specialized views / Resolve
```

A project may begin from a blank idea/script or from existing footage/interviews/selects. The user should be able to describe the story they want, provide material, and ask Salai to restructure or reason about it without explicitly creating and wiring every narrative object.

The underlying architectural principle remains:

> **One Narrative IR, multiple synchronized creative views.**

### Specialized views

- Outline
- AV Script
- Story Wall / Beat Board
- Paper / Radio Edit
- Coverage
- later Frame Wall / Selects / previs-oriented surfaces

These are no longer assumed to be mandatory authoring stages. They are tools for inspection, spatial thinking, precision editing, source verification, and production planning over the same canonical state.

DaVinci Resolve remains the media, frame-accurate editing, Fusion, color, Fairlight, and delivery environment.

## What changed after Spike 0B

Spike 0B implemented Story Wall, Outline, AV Script, and Paper/Radio Edit over one `@salai/script-model` project and validated the semantic boundaries with deterministic tests.

That experiment produced two conclusions:

- **the model/view architecture works:** stable identity, source evidence, Workspace separation, runtime, and cross-view changes remain coherent;
- **the primary UX did not:** the first human test found that direct structured manipulation requires too much interaction to remain creatively useful.

The current direction is therefore not “add more controls to the four surfaces.” It is to put an agent-mediated free-form layer above the proven canonical model.

See [`docs/spike-0b-assessment.md`](docs/spike-0b-assessment.md).

## Current development state

### Spike 0A — Narrative IR

**Complete / pass.**

The TypeScript package lives at:

```text
packages/script-model/
```

It includes:

- stable `Script / Section / Scene? / Beat / Cue / ContentBlock` identity;
- authored vs source-backed content;
- mocked `MediaSegment` / `ShotIntent` references;
- structural editing operations;
- transactional validation and relationship effects;
- split/merge/delete semantics;
- serialization/versioning;
- approximate runtime estimation;
- product, interview/corporate, and footage-first documentary fixtures.

Authoritative contract: [`docs/narrative-ir-spec.md`](docs/narrative-ir-spec.md).

### Spike 0B — Structured Authoring UX

**Closed / mixed result.**

The shared React prototype proved multiple synchronized views can use the same Narrative IR, but direct manipulation failed the creative-friction test.

Historical contract: [`docs/authoring-ux-spec.md`](docs/authoring-ux-spec.md).

Assessment: [`docs/spike-0b-assessment.md`](docs/spike-0b-assessment.md).

### Spike 0C — Agent-Mediated Authoring

**Current validation milestone.**

0C tests a primary authoring surface combining:

- simple free-form working text;
- project-aware chat/instructions;
- attachment/media intake;
- model/agent normalization into typed Narrative operations;
- grouped change summaries and undo;
- the existing structured views as synchronized inspection/precision tools.

The interaction target is simple:

> **User effort should scale with creative decisions, not with the number of internal operations required to represent them.**

See [`docs/agent-mediated-authoring.md`](docs/agent-mediated-authoring.md) and [`docs/rfcs/0002-agent-mediated-authoring.md`](docs/rfcs/0002-agent-mediated-authoring.md).

## Architecture direction

Current broader direction:

- TypeScript Narrative IR as canonical semantic state;
- React/TypeScript authoring UI;
- a Salai-owned agent/normalization layer using structured tools/operation batches;
- provider-agnostic model boundary rather than a model-owned project format;
- grouped history/undo and graduated autonomy;
- existing Story Wall/Outline/AV/Paper views as specialized surfaces;
- Electron desktop shell after the primary authoring UX is validated;
- local Python 3.11/3.12 + FastAPI service;
- SQLite persistence after interaction/persistence requirements are validated;
- CutMaster as the default Resolve automation boundary behind a Salai-owned adapter;
- OpenTimelineIO at editorial interchange/materialization boundaries;
- OpenAssetIO only when external asset-management interoperability is justified;
- ComfyUI and other providers for generation;
- FFmpeg/ffprobe and established local analysis tools for media utilities/reverse scripting.

An agent request should change canonical Salai state first; it should not become an opaque natural-language command stream directly into Resolve.

See [`docs/architecture.md`](docs/architecture.md).

## Documentation

Start with [`docs/README.md`](docs/README.md), which defines the canonical owner for each kind of information.

Key documents:

- [`docs/product-brief.md`](docs/product-brief.md) — concise product thesis and positioning;
- [`docs/prd.md`](docs/prd.md) — product requirements and success criteria;
- [`docs/glossary.md`](docs/glossary.md) — canonical product/domain terminology;
- [`docs/research-notes.md`](docs/research-notes.md) — product-discovery evidence, including the 0B human finding;
- [`docs/workflows.md`](docs/workflows.md) — primary agent-mediated workflow and specialized views;
- [`docs/narrative-ir-spec.md`](docs/narrative-ir-spec.md) — authoritative Narrative IR TDD;
- [`docs/spike-0a-assessment.md`](docs/spike-0a-assessment.md) — Spike 0A result;
- [`docs/authoring-ux-spec.md`](docs/authoring-ux-spec.md) — historical 0B structured-authoring contract;
- [`docs/spike-0b-assessment.md`](docs/spike-0b-assessment.md) — 0B result and direction change;
- [`docs/agent-mediated-authoring.md`](docs/agent-mediated-authoring.md) — active 0C contract;
- [`docs/mvp.md`](docs/mvp.md) — validation/implementation roadmap;
- [`docs/backlog.md`](docs/backlog.md) — current work ordering;
- [`docs/architecture.md`](docs/architecture.md) — System Architecture Document;
- [`docs/rfcs/0001-one-narrative-ir-multiple-workflows.md`](docs/rfcs/0001-one-narrative-ir-multiple-workflows.md) — canonical IR / synchronized views proposal;
- [`docs/rfcs/0002-agent-mediated-authoring.md`](docs/rfcs/0002-agent-mediated-authoring.md) — new primary interaction proposal;
- [`docs/adr/`](docs/adr/) — accepted architecture decisions.

## Contributing and license

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for development/documentation conventions.

Salai does not currently publish an open-source license. See [`LICENSE`](LICENSE) for the current status; third-party dependencies retain their own licenses.
