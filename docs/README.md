# Salai Documentation Map

This directory separates current product/workflow/architecture contracts from historical experiment records.

## Canonical ownership

| Information | Canonical source |
| --- | --- |
| Terms | [`glossary.md`](glossary.md) |
| Product requirements | [`prd.md`](prd.md) |
| Product thesis | [`product-brief.md`](product-brief.md) |
| Discovery observations | [`research-notes.md`](research-notes.md) |
| Competitive positioning | [`competitive-landscape.md`](competitive-landscape.md) |
| Workflow movement | [`workflows.md`](workflows.md) |
| Narrative Lens semantics | [`narrative-lenses.md`](narrative-lenses.md) |
| Narrative IR types/invariants/operations | [`narrative-ir-spec.md`](narrative-ir-spec.md) |
| Validated external-agent interaction contract | [`agent-mediated-authoring.md`](agent-mediated-authoring.md) |
| External-agent operating procedure | [`agent-usage.md`](agent-usage.md) |
| Coding-agent development procedure | [`agent-development.md`](agent-development.md) |
| Active 0D tasks/status/evidence | [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md) |
| Validation sequence | [`mvp.md`](mvp.md) |
| Current priorities | [`backlog.md`](backlog.md) |
| Current system architecture | [`architecture.md`](architecture.md) |
| Accepted/superseded decisions | [`adr/`](adr/) |
| Proposed cross-cutting changes | [`rfcs/`](rfcs/) |

Root-level [`../AGENTS.md`](../AGENTS.md) is the concise repository entrypoint for coding agents and delegates detailed operating/development behavior to the two canonical agent standards above.

Do not duplicate exact operation vocabularies, task status, or superseded runtime behavior across living docs. ADRs retain decision history.

## Current contracts

- [`narrative-ir-spec.md`](narrative-ir-spec.md) — implemented canonical narrative-model contract.
- [`narrative-lenses.md`](narrative-lenses.md) — validated structured-view semantics over one project; not a commitment to final top-level UI navigation.
- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — validated external-harness product behavior from 0C.
- [`agent-usage.md`](agent-usage.md) — required workflow for agents operating a live Salai project.
- [`agent-development.md`](agent-development.md) — required workflow for coding agents changing Salai.
- [`architecture.md`](architecture.md) — current runtime/application/editorial boundaries.
- [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md) — external harness owns model/session behavior; human-validated using Codex in 0C.
- [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md) — current product boundary: Salai owns structural editorial; specialist NLEs are optional downstream.
- [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md) — only current 0D execution tracker.

## Historical validation records

- [`spike-0a-assessment.md`](spike-0a-assessment.md) — completed Narrative IR spike.
- [`authoring-ux-spec.md`](authoring-ux-spec.md), [`spike-0b-implementation-plan.md`](spike-0b-implementation-plan.md), [`spike-0b-human-test-plan.md`](spike-0b-human-test-plan.md), [`spike-0b-assessment.md`](spike-0b-assessment.md) — 0B structured-authoring experiment.
- [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md), [`spike-0c-human-validation.md`](spike-0c-human-validation.md), [`spike-0c-assessment.md`](spike-0c-assessment.md) — completed external-agent authoring experiment.
- [`adr/`](adr/) — append-only architecture decision history, including superseded Resolve and 0C runtime approaches.

## Current development focus

**0A — Narrative IR:** complete/pass.

**0B — Structured Authoring UX:** closed/mixed. Multi-view coherence passed; routine direct structure management failed the interaction-friction test.

**0C — External-Agent Authoring + Narrative Lenses:** complete/pass. Human validation using Codex confirmed that an external agent can operate the live canonical project correctly and materially reduce routine structural interaction.

**0D — Semantic Editorial Environment:** current.

Current validation architecture:

```text
external harness
      ↓
Salai CLI / machine interface
      ↓
SalaiProjectService
      ↓
Narrative IR + Workspace
      ↓
Salai timeline projection
      ↓
semantic timeline + playback adapter
```

The external harness continues to own model/provider/auth/session/tool-loop behavior. Salai owns project semantics, canonical mutation, source provenance, structural editorial decisions, and the application boundary shared by UI and machine clients.

0D uses `@moritzbrantner/timeline-editor` for the first controlled React timeline interaction and `@elah/core` for the first playback/materialization adapter. Both are replaceable derived infrastructure; neither owns Salai project truth.

Start with [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md) and [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).
