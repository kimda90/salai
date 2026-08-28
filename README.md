# Salai

Salai is an experimental local-first, narrative-aware production companion for DaVinci Resolve.

Its purpose is to keep **story intent, source material, production needs, real/generated media, alternatives, and Resolve editorial context connected** throughout a project without making the filmmaker manually manage all of that structure.

## Product hypothesis

> **Express intent naturally; Salai structures it for production. See and reshape that structure through narrative lenses.**

The primary interaction direction is:

```text
write / talk / drop media
          ↓
    Salai agent layer
 interpret + normalize
          ↓
 structured canonical project
          ↓
     Narrative Lenses
          ↓
        Resolve
```

A project may begin from a blank idea/script or from existing footage/interviews/selects. The user should be able to describe the story they want, provide material, and ask Salai to restructure or reason about it without explicitly creating and wiring every narrative object.

The underlying architectural principle remains:

> **One Narrative IR, multiple synchronized creative views.**

The key UX refinement is:

> **Hide structural bookkeeping, not narrative structure.**

Salai should automate incidental mechanics such as object creation, parent references, IDs, and obvious relationship wiring. But structured views remain valuable when they help the creator understand or reshape the story.

## Narrative Lenses

Salai's structured surfaces are **Narrative Lenses**: different ways to perceive and manipulate the same canonical story.

- **Outline** — hierarchy, progression, proportion.
- **Story Wall / Beat Board** — spatial rhythm, balance, turning points, alternatives.
- **AV Script** — audiovisual density and realization over time.
- **Paper / Radio Edit** — evidence, voice, source pacing, authored-vs-sourced balance.
- **Coverage** — gaps between narrative intent and available realization.
- later **Frame Wall / Selects** — visual coverage and alternatives.

They are not mandatory stages, but they are also not merely fallback or expert controls. A creator can deliberately enter one when that representation helps them understand the narrative system or work from a different angle.

Direct manipulation remains first-class inside a lens when that is the creator's chosen way of thinking.

See [`docs/narrative-lenses.md`](docs/narrative-lenses.md).

DaVinci Resolve remains the media, frame-accurate editing, Fusion, color, Fairlight, and delivery environment.

## What Spike 0B taught us

Spike 0B implemented Story Wall, Outline, AV Script, and Paper/Radio Edit over one `@salai/script-model` project and validated the semantic boundaries with deterministic tests.

It produced three conclusions:

- **the model/view architecture works:** stable identity, source evidence, Workspace separation, runtime, and cross-view changes remain coherent;
- **the routine direct-manipulation workflow does not:** ordinary creative changes require too much interaction and model management;
- **the structured views remain creatively useful:** they can reveal hierarchy, rhythm, evidence, audiovisual complexity, gaps, and alternatives in ways free-form text/chat cannot.

The current direction is therefore not “replace the views with chat.” It is to put a low-friction agent-mediated layer above the proven canonical model while retaining the views as first-class Narrative Lenses.

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

The shared React prototype proved multiple synchronized views can use the same Narrative IR, but using direct structured manipulation as the default/routine path failed the creative-friction test.

Historical contract: [`docs/authoring-ux-spec.md`](docs/authoring-ux-spec.md).

Assessment: [`docs/spike-0b-assessment.md`](docs/spike-0b-assessment.md).

### Spike 0C — Agent-Mediated Authoring + Narrative Lenses

**Current validation milestone.**

0C tests:

- simple free-form working text;
- project-aware chat/instructions;
- attachment/media intake;
- model/agent normalization into typed Salai commands and canonical operations;
- grouped change summaries and one-step revert;
- existing structured views as synchronized Narrative Lenses;
- direct lens edits feeding back into subsequent agent context;
- whether the lenses reveal useful narrative information beyond free-form text/chat.

The interaction target is:

> **User effort should scale with creative decisions, while structural visibility should increase creative understanding.**

See [`docs/agent-mediated-authoring.md`](docs/agent-mediated-authoring.md), [`docs/narrative-lenses.md`](docs/narrative-lenses.md), and [`docs/rfcs/0002-agent-mediated-authoring.md`](docs/rfcs/0002-agent-mediated-authoring.md).

## Architecture direction

Current broader direction:

- TypeScript Narrative IR as canonical semantic state;
- React/TypeScript authoring UI;
- a Salai-owned agent/normalization layer using structured tools/operation batches;
- provider-agnostic model boundary rather than a model-owned project format;
- grouped history/revert and graduated autonomy;
- Narrative Lenses over the same canonical state;
- Electron desktop shell after the primary interaction is validated;
- local Python 3.11/3.12 + FastAPI service;
- SQLite persistence after interaction/persistence requirements are validated;
- CutMaster as the default Resolve automation boundary behind a Salai-owned adapter;
- OpenTimelineIO at editorial interchange/materialization boundaries;
- OpenAssetIO only when external asset-management interoperability is justified;
- ComfyUI and other providers for generation;
- FFmpeg/ffprobe and established local analysis tools for media utilities/reverse scripting.

An agent request should change canonical Salai state first; it should not become an opaque natural-language command stream directly into Resolve.

See [`docs/architecture.md`](docs/architecture.md) for system-level ownership and [`docs/adr/0004-cutmaster-default-resolve-boundary.md`](docs/adr/0004-cutmaster-default-resolve-boundary.md) for the Resolve automation decision.

## Documentation

Start with [`docs/README.md`](docs/README.md), which defines the canonical owner for each kind of information.

Key documents:

- [`docs/product-brief.md`](docs/product-brief.md) — concise product thesis and positioning;
- [`docs/prd.md`](docs/prd.md) — product requirements and success criteria;
- [`docs/glossary.md`](docs/glossary.md) — canonical terminology;
- [`docs/competitive-landscape.md`](docs/competitive-landscape.md) — adjacent products and positioning pressure tests;
- [`docs/research-notes.md`](docs/research-notes.md) — product-discovery evidence;
- [`docs/scripting.md`](docs/scripting.md) — conceptual scripting rationale;
- [`docs/workflows.md`](docs/workflows.md) — primary workflow and Narrative Lens behavior;
- [`docs/narrative-lenses.md`](docs/narrative-lenses.md) — Narrative Lens product/UX contract;
- [`docs/narrative-ir-spec.md`](docs/narrative-ir-spec.md) — authoritative Narrative IR TDD;
- [`docs/spike-0a-assessment.md`](docs/spike-0a-assessment.md) — Spike 0A result;
- [`docs/authoring-ux-spec.md`](docs/authoring-ux-spec.md) — historical 0B structured-authoring contract;
- [`docs/spike-0b-assessment.md`](docs/spike-0b-assessment.md) — 0B result and direction change;
- [`docs/agent-mediated-authoring.md`](docs/agent-mediated-authoring.md) — active 0C interaction contract;
- [`docs/spike-0c-implementation-plan.md`](docs/spike-0c-implementation-plan.md) — active 0C tracker;
- [`docs/mvp.md`](docs/mvp.md) — validation/implementation roadmap;
- [`docs/backlog.md`](docs/backlog.md) — current work ordering;
- [`docs/architecture.md`](docs/architecture.md) — system architecture;
- [`docs/rfcs/0001-one-narrative-ir-multiple-workflows.md`](docs/rfcs/0001-one-narrative-ir-multiple-workflows.md) — canonical IR / synchronized views proposal;
- [`docs/rfcs/0002-agent-mediated-authoring.md`](docs/rfcs/0002-agent-mediated-authoring.md) — agent + Narrative Lens proposal;
- [`docs/adr/`](docs/adr/) — accepted architecture decisions;
- [`docs/service-levels.md`](docs/service-levels.md) — current reliability/SLA policy.

## Contributing and license

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for development/documentation conventions.

Salai does not currently publish an open-source license. See [`LICENSE`](LICENSE) for the current status; third-party dependencies retain their own licenses.