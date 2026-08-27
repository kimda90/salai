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
- the structural editing operation vocabulary;
- transactional validation and explicit relationship effects;
- split/merge/delete semantics;
- serialization/versioning;
- approximate runtime estimation;
- three representative fixtures covering product, interview/corporate, and footage-first documentary workflows.

The authoritative implementation contract remains [`docs/narrative-ir-spec.md`](docs/narrative-ir-spec.md). The implementation result and resolved open questions are recorded in [`docs/spike-0a-assessment.md`](docs/spike-0a-assessment.md).

**The current validation milestone is Spike 0B — Familiar Authoring UX.**

0B tests Story Wall, Outline, AV Script, and Paper/Radio Edit over the same IR, including the minimum in-memory Workspace/Board model and the distinction between workspace organization and semantic narrative edits. See [`docs/authoring-ux-spec.md`](docs/authoring-ux-spec.md).

The executable Spike 0B task plan and completion tracker lives in [`docs/spike-0b-implementation-plan.md`](docs/spike-0b-implementation-plan.md). Implementation PRs should update that tracker as tasks are merged and verified.

After that:

- **0C — Assisted authoring:** AI-proposed domain operations with reviewable structural/runtime/relationship consequences.
- **Phase 1+ — Local production application:** Electron/local service, persistence, Resolve integration, real-media reverse scripting, alternatives, and generated production media.

## Architecture direction

Current broader direction:

- TypeScript Narrative IR;
- React/TypeScript authoring UI, with normal DOM controls and reusable interaction primitives for 0B;
- Electron desktop shell after authoring UX validation;
- local Python 3.11/3.12 + FastAPI service;
- SQLite persistence after model/UX validation;
- CutMaster as the default Resolve automation boundary behind a Salai-owned adapter;
- OpenTimelineIO at editorial interchange/materialization boundaries;
- OpenAssetIO only when external asset-management interoperability is justified;
- ComfyUI and other providers for generation;
- FFmpeg/ffprobe and established local analysis tools for media utilities/reverse scripting.

See [`docs/architecture.md`](docs/architecture.md) for system-level ownership and [`docs/adr/0004-cutmaster-default-resolve-boundary.md`](docs/adr/0004-cutmaster-default-resolve-boundary.md) for the Resolve automation decision.

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
- [`docs/authoring-ux-spec.md`](docs/authoring-ux-spec.md) — active Spike 0B technical/UX contract;
- [`docs/spike-0b-implementation-plan.md`](docs/spike-0b-implementation-plan.md) — executable Spike 0B task plan and completion tracker;
- [`docs/mvp.md`](docs/mvp.md) — validation/implementation roadmap;
- [`docs/backlog.md`](docs/backlog.md) — current work ordering;
- [`docs/architecture.md`](docs/architecture.md) — System Architecture Document;
- [`docs/rfcs/`](docs/rfcs/) — proposals;
- [`docs/adr/`](docs/adr/) — accepted architecture decisions;
- [`docs/service-levels.md`](docs/service-levels.md) — current reliability/SLA policy.

## Contributing and license

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for development/documentation conventions.

Salai does not currently publish an open-source license. See [`LICENSE`](LICENSE) for the current status; third-party dependencies retain their own licenses.
