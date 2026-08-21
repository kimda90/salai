# Salai

Salai is an experimental local-first DaVinci Resolve companion for scripted and footage-first video production.

The core idea is to keep **story, narrative intent, ShotIntents, captured/generated media, review notes, and Resolve timelines connected** throughout a project.

## Current product hypothesis

A Salai script is not only formatted text. It is a structured narrative model with stable identity.

The same Narrative IR should support both derived projections and familiar persistent creative workspaces.

### Projections

- **Outline** — sections/scenes/beats and structural authoring;
- **AV Script** — Beat/Cue visual and audio intent side by side;
- **Teleprompter** — derived spoken copy;
- **Coverage** — narrative objects linked to ShotIntents and realizations.

### Familiar workspaces

- **Story Wall** — scene/beat cards for spatial structural reasoning, inspired by established index-card/sticky-note editorial methods;
- **Beat Board / Scratch Board** — loose ideas that can later become or attach to canonical narrative objects;
- **Paper Edit** — source excerpts and visual evidence arranged into story structure;
- **Radio Edit** — audio-first interview/VO construction;
- **Frame Wall** — later spatial exploration of selected frames/takes;
- **Selects/Coverage** — production intent connected to available realizations.

Projects can start from a blank idea, an AV script, a wall of cards, transcripts/interview selects, or existing footage. These are different ways of manipulating the same underlying production graph rather than separate project types.

A core UX principle is:

> Salai should make the production graph disappear behind familiar creative workflows.

## Architecture direction

- **Narrative IR in TypeScript** as the canonical scripting/domain model, independent from any editor framework.
- **Electron + React/TypeScript** for the eventual local desktop runtime and UI.
- **Python/FastAPI + SQLite** for the local production service and graph persistence after the Narrative IR is validated.
- **CutMaster** as the preferred Resolve automation infrastructure rather than rebuilding broad Resolve API coverage.
- **OpenAssetIO** at the asset identity/resolution/publishing boundary.
- **OpenTimelineIO** for editorial interchange where useful.
- **ComfyUI** as the initial GenAI execution backend.
- **FFmpeg/ffprobe** for media utilities.
- **Fountain/FDX** as later screenplay interchange adapters, not canonical storage.

DaVinci Resolve remains the media, editing, Fusion, color, Fairlight, and delivery engine. Generated media is treated as ordinary production media: generate, ingest, review, edit, and finish normally.

## Current development priority

The immediate milestone is **Spike 0A — Narrative IR**: validate the Beat/Cue model, authored-vs-sourced content, stable IDs, structural operations, runtime estimation, and three realistic fixtures in a pure TypeScript package.

The next UX spike, **0B**, will test whether the same IR feels natural through familiar working methods: Story Wall, Outline, AV Script, and Paper/Radio Edit. Rich-text/editor frameworks should be chosen only after the working surfaces demonstrate what they actually need.

Resolve integration is intentionally downstream because CutMaster already provides a credible open-source path for the generic Resolve automation layer.

## Documentation

- [`docs/product-brief.md`](docs/product-brief.md) — product thesis, users, principles, and current MVP priority.
- [`docs/scripting.md`](docs/scripting.md) — Narrative IR, Beat/Cue model, stable identity, authored vs sourced content, and scripting spikes.
- [`docs/workflows.md`](docs/workflows.md) — familiar editorial paradigms, Projection vs Workspace, boards/cards, Story Wall, Paper/Radio Edit, AV Script, and UX validation.
- [`docs/architecture.md`](docs/architecture.md) — runtime, domain model, OSS infrastructure boundaries, and downstream integrations.
- [`docs/mvp.md`](docs/mvp.md) — ordered technical/product validation phases and acceptance criteria.

This repository is currently in product/technical discovery.
