# Salai

Salai is an experimental local-first, narrative-aware audiovisual construction environment.

Its purpose is to keep **story intent, source material, production needs, real/generated media, alternatives, and the active structural edit connected** without making the filmmaker manually manage all of that structure.

## Product thesis

> **Express intent naturally; Salai structures it for production and structural editorial. See, play, and reshape the same story through semantic creative surfaces.**

Underlying architecture:

> **One canonical narrative/project model, multiple human and machine interfaces.**

Core UX principle:

> **Hide structural bookkeeping, not narrative structure.**

## Product/editorial boundary

Salai owns **narrative construction + structural editorial**.

Structural editorial is the temporal/media capability needed to construct, play, judge, and revise an audiovisual story while preserving narrative identity and source provenance. Salai does not aim to reproduce specialist NLE finishing systems. DaVinci Resolve and other NLEs are optional downstream targets for precision editorial, advanced post, color, audio finishing, compositing, mastering, and delivery.

See [`docs/adr/0009-salai-owns-structural-editorial.md`](docs/adr/0009-salai-owns-structural-editorial.md).

## Validated foundation

### Spike 0A — Narrative IR

**Complete / pass.**

`packages/script-model/` provides the canonical TypeScript model, typed operations, validation, serialization, runtime estimation, stable identity, source-backed semantics, and representative script-first/footage-first fixtures.

Authoritative contract: [`docs/narrative-ir-spec.md`](docs/narrative-ir-spec.md).

### Spike 0B — Structured Authoring UX

**Closed / mixed.**

The React prototype proved synchronized Story Wall, Outline, AV Script, and Paper/Radio views over one canonical project, while human testing showed routine direct structure management required too much interaction to be the default creative path.

### Spike 0C — External-Agent Authoring

**Complete / pass.**

Codex was used as the human-validation harness. It operated the live Salai project correctly and demonstrated that an external agent can materially reduce routine structural bookkeeping without Salai owning provider auth, sessions, model routing, conversation history, or the harness tool loop.

See [`docs/spike-0c-assessment.md`](docs/spike-0c-assessment.md) and [`docs/adr/0008-external-harness-owns-agent-runtime.md`](docs/adr/0008-external-harness-owns-agent-runtime.md).

### Spike 0D — Semantic Editorial Environment

**Closed / mixed.**

0D technically validated:

- Narrative IR projected into actual time;
- rough picture/audio playback inside Salai without Resolve;
- direct Beat/Cue reorder and SourceExcerpt trim through canonical operations;
- replaceable timeline/playback adapters;
- direct temporal editing and the external harness sharing one live project.

Human validation found the editor too shallow and fragmented to demonstrate useful semantic structural editing. Story/Moments/Media switching lost context, selected items exposed too little editing, creation/multi-material/multi-selection were insufficient, and basic source-I/O/split/transport behavior was missing.

See [`docs/spike-0d-assessment.md`](docs/spike-0d-assessment.md).

## Current development state

### Spike 0E — Semantic Editorial Interaction Depth

**Current shaping/validation iteration. Implementation has not started.**

0E asks:

> **If Salai provides one context-preserving hierarchical timeline plus the minimum useful canonical rough-editing grammar, do its semantic objects materially improve structural editing compared with generic clip manipulation?**

The proposed temporal interaction keeps nested semantic depth visible on one shared time axis:

```text
Script  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━ Section ━━━━━━━━━━━━━━━━━
  Beat  ━━━━━━━━━━━ Beat ━━━━━━━━━   Beat ━━━━━━━━━━━━━━━━━
    Cue ━━━━━ Cue ━   Cue ━━━━━━━     Cue ━━━━━ Cue ━━━━━━━
      V ━━━━  V ━━     V ━━━━━          V ━━━━   missing ━━
      A ━━━━━━━       source ━━━━━       A ━━━━━━━━━━━━━━━━━
```

Important current constraints:

- Cue remains the canonical narrative-time interval;
- all visual/audio ContentBlocks in a Cue are exposed, but ordinary blocks do not gain hidden independent offsets/durations;
- SourceExcerpt source I/O remains evidence state distinct from Cue duration;
- canonical reorder/duration changes ripple later narrative time;
- direct gestures compile to existing Narrative IR operations/batches where possible;
- selection, hierarchy expansion, viewport, and playhead remain non-canonical interaction state;
- timeline/rendering engine documents remain derived/replaceable;
- the existing external-agent machine boundary remains unchanged.

Before implementation, review:

- [`docs/rfcs/0003-semantic-editorial-interaction-model.md`](docs/rfcs/0003-semantic-editorial-interaction-model.md) — proposed cross-cutting interaction model and scoped unresolved semantics;
- [`docs/editorial-interaction.md`](docs/editorial-interaction.md) — proposed observable direct-edit contract;
- [`docs/spike-0e-implementation-plan.md`](docs/spike-0e-implementation-plan.md) — tracker with an explicit shaping gate.

Do not implement unresolved Cue split, SourceExcerpt split, independent within-Cue timing, intentional black-vs-missing identity, or broad cross-parent grouped moves before RFC resolution.

## Architecture direction

- TypeScript Narrative IR remains canonical semantic state.
- One project backs human surfaces and machine interface.
- `SalaiProjectService` remains the shared human/machine application boundary.
- External harnesses own model/runtime/auth/session behavior (ADR 0008).
- Salai owns structural editorial while specialist NLEs remain optional downstream (ADR 0009).
- Timeline/rendering engines are adapters/projections, never project truth.
- The first machine interface remains CLI-oriented; add another protocol only from concrete evidence.
- Harness/model history is not Salai project persistence.

See [`docs/architecture.md`](docs/architecture.md).

## Documentation

Start with [`docs/README.md`](docs/README.md), which defines canonical ownership.

Most relevant current docs:

- [`docs/product-brief.md`](docs/product-brief.md) — product thesis/positioning;
- [`docs/prd.md`](docs/prd.md) — current product requirements;
- [`docs/editorial-interaction.md`](docs/editorial-interaction.md) — proposed 0E direct interaction contract;
- [`docs/rfcs/0003-semantic-editorial-interaction-model.md`](docs/rfcs/0003-semantic-editorial-interaction-model.md) — proposed cross-cutting interaction decision;
- [`docs/narrative-lenses.md`](docs/narrative-lenses.md) — lens semantics and relation to the temporal surface;
- [`docs/agent-mediated-authoring.md`](docs/agent-mediated-authoring.md) — validated external-agent contract;
- [`docs/spike-0d-assessment.md`](docs/spike-0d-assessment.md) — 0D evidence;
- [`docs/spike-0e-implementation-plan.md`](docs/spike-0e-implementation-plan.md) — current tracker;
- [`docs/mvp.md`](docs/mvp.md) — validation sequence;
- [`docs/backlog.md`](docs/backlog.md) — priorities;
- [`docs/architecture.md`](docs/architecture.md) — system architecture.

## Contributing and license

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for development/documentation conventions.

Salai does not currently publish an open-source license. See [`LICENSE`](LICENSE) for current status; third-party dependencies retain their own licenses.
