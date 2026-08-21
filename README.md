# Salai

Salai is an experimental local-first DaVinci Resolve companion for scripted and footage-first video production.

The core idea is to keep **story, narrative intent, ShotIntents, captured/generated media, review notes, and Resolve timelines connected** throughout a project.

## Current product hypothesis

A Salai script is not only formatted text. It is a structured narrative model with stable identity.

The same model should support different views and workflows:

- **Outline** — sections/scenes/beats and structural authoring;
- **AV Script** — visual and audio intent side by side;
- **Teleprompter** — derived spoken copy;
- **Coverage** — narrative Beats linked to ShotIntents and their realizations;
- **reverse scripting** — existing footage becomes source evidence for an editable narrative structure.

Projects can therefore start either from a blank idea/script or from existing footage.

## Architecture direction

- **Electron + React/TypeScript** for the local desktop runtime and UI.
- **Python/FastAPI + SQLite** for the local production service and graph persistence.
- **Tiptap / ProseMirror** as the initial structured scripting-editor candidate.
- **CutMaster** as the preferred Resolve automation infrastructure rather than rebuilding broad Resolve API coverage.
- **OpenAssetIO** at the asset identity/resolution/publishing boundary.
- **OpenTimelineIO** for editorial interchange where useful.
- **ComfyUI** as the initial GenAI execution backend.
- **FFmpeg/ffprobe** for media utilities.
- **Fountain** for initial screenplay-oriented import/export, not canonical storage.

DaVinci Resolve remains the media, editing, Fusion, color, Fairlight, and delivery engine. Generated media is treated as ordinary production media: generate, ingest, review, edit, and finish normally.

## Current development priority

The next milestone is a **structured scripting spike**. The main unknown is whether one semantic model can naturally support blank-page authoring, AV scripting, stable links to production intent, duration-aware AI rewriting, and footage-first narrative construction.

Resolve integration is intentionally downstream of this spike because CutMaster already provides a credible open-source path for the generic Resolve automation layer.

## Documentation

- [`docs/product-brief.md`](docs/product-brief.md) — product thesis, users, principles, and current MVP priority.
- [`docs/scripting.md`](docs/scripting.md) — structured scripting model, stable identity, script views, AI editing, reverse scripting, and the next spike.
- [`docs/architecture.md`](docs/architecture.md) — runtime, domain model, OSS infrastructure boundaries, and downstream integrations.
- [`docs/mvp.md`](docs/mvp.md) — ordered technical/product validation phases and acceptance criteria.

This repository is currently in product/technical discovery.
