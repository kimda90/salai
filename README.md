# Salai

Salai is an experimental local-first, narrative-aware production companion for DaVinci Resolve.

The core idea is to keep **story intent, source material, ShotIntents, captured/generated media, alternatives, review context, and Resolve editorial state connected** throughout a project.

## Product hypothesis

> **One Narrative IR, multiple familiar creative workflows.**

A project may begin from a blank idea/script or from existing footage/interviews/selects. The same underlying narrative/production data should be usable through workflows filmmakers already understand.

### Projections

- Outline
- AV Script
- Teleprompter
- Coverage

### Workspaces

- Story Wall / sticky-note scene construction
- Beat Board / Scratch Board
- Paper Edit
- Radio Edit
- later Frame Wall / Selects / previs-oriented surfaces

Salai should make the production graph disappear behind those familiar workflows rather than ask users to think in database concepts.

DaVinci Resolve remains the media, frame-accurate editing, Fusion, color, Fairlight, and delivery environment.

## Current development state

**Spike 0A — Narrative IR is implemented and passes its current validation criteria.**

The TypeScript package lives at:

```text
packages/script-model/
```

It now includes:

- stable `Script / Section / Scene? / Beat / Cue / ContentBlock` identity;
- authored vs source-backed content;
- mocked `MediaSegment` / `ShotIntent` references;
- the 27-operation structural editing vocabulary;
- transactional validation and explicit relationship effects;
- split/merge/delete semantics;
- serialization/versioning;
- approximate runtime estimation;
- three representative fixtures covering product, interview/corporate, and footage-first documentary workflows.

The authoritative implementation contract remains [`docs/narrative-ir-spec.md`](docs/narrative-ir-spec.md). The implementation result and resolved open questions are recorded in [`docs/spike-0a-assessment.md`](docs/spike-0a-assessment.md).

The next validation milestone is:

- **0B — Authoring UX:** Story Wall, Outline, AV Script, and Paper/Radio Edit over the same IR, including the minimum in-memory Workspace/Board model.
- **0C — Assisted authoring:** AI-proposed domain operations with reviewable structural/runtime/relationship consequences.

Resolve and broader persistence/integration work remain downstream.

## Architecture direction

Current broader direction:

- TypeScript Narrative IR;
- Electron + React/TypeScript desktop UI/runtime;
- local Python/FastAPI service;
- SQLite persistence after model/UX validation;
- CutMaster for Resolve automation where practical;
- OpenAssetIO / OpenTimelineIO at interoperability boundaries;
- ComfyUI and other providers for generation;
- FFmpeg/ffprobe for media utilities.

See [`docs/architecture.md`](docs/architecture.md) for system-level ownership.

## Documentation

Start with [`docs/README.md`](docs/README.md), which defines the canonical owner for each kind of information.

Key documents:

- [`docs/product-brief.md`](docs/product-brief.md) — concise product thesis and positioning;
- [`docs/prd.md`](docs/prd.md) — product requirements and success criteria;
- [`docs/glossary.md`](docs/glossary.md) — canonical product/domain terminology;
- [`docs/competitive-landscape.md`](docs/competitive-landscape.md) — named adjacent products and positioning pressure tests;
- [`docs/research-notes.md`](docs/research-notes.md) — product-discovery evidence;
- [`docs/scripting.md`](docs/scripting.md) — conceptual scripting rationale;
- [`docs/workflows.md`](docs/workflows.md) — familiar editorial workflow/Workspace semantics;
- [`docs/narrative-ir-spec.md`](docs/narrative-ir-spec.md) — authoritative Spike 0A TDD;
- [`docs/spike-0a-assessment.md`](docs/spike-0a-assessment.md) — Spike 0A result and open-question resolutions;
- [`docs/mvp.md`](docs/mvp.md) — validation/implementation roadmap;
- [`docs/backlog.md`](docs/backlog.md) — current work ordering;
- [`docs/architecture.md`](docs/architecture.md) — System Architecture Document;
- [`docs/rfcs/`](docs/rfcs/) — proposals;
- [`docs/adr/`](docs/adr/) — accepted architecture decisions;
- [`docs/service-levels.md`](docs/service-levels.md) — current reliability/SLA policy.

## Contributing and license

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for development/documentation conventions.

Salai does not currently publish an open-source license. See [`LICENSE`](LICENSE) for the current status; third-party dependencies retain their own licenses.
