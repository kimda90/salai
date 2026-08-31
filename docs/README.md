# Salai Documentation Map

This directory separates current product/workflow/architecture contracts from historical experiment records.

## Canonical ownership

| Information | Canonical source |
| --- | --- |
| Terms | [`glossary.md`](glossary.md) |
| Product requirements | [`prd.md`](prd.md) |
| Product thesis | [`product-brief.md`](product-brief.md) |
| Discovery observations | [`research-notes.md`](research-notes.md) |
| Workflow movement | [`workflows.md`](workflows.md) |
| Narrative Lens semantics | [`narrative-lenses.md`](narrative-lenses.md) |
| Narrative IR types/invariants/operations | [`narrative-ir-spec.md`](narrative-ir-spec.md) |
| Active agent-mediated interaction contract | [`agent-mediated-authoring.md`](agent-mediated-authoring.md) |
| Active 0C tasks/status/evidence | [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md) |
| Validation sequence | [`mvp.md`](mvp.md) |
| Current priorities | [`backlog.md`](backlog.md) |
| Current system architecture | [`architecture.md`](architecture.md) |
| Accepted/superseded decisions | [`adr/`](adr/) |
| Proposed cross-cutting changes | [`rfcs/`](rfcs/) |

Do not duplicate exact operation vocabularies, task status, or superseded runtime behavior across living docs. ADRs retain decision history.

## Current contracts

- [`narrative-ir-spec.md`](narrative-ir-spec.md) — implemented canonical model contract.
- [`narrative-lenses.md`](narrative-lenses.md) — structured creative views over one project.
- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — external-harness authoring behavior.
- [`architecture.md`](architecture.md) — current runtime/application boundaries.
- [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) — proposed interaction model under 0C validation.
- [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md) — current human/machine runtime decision.
- [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md) — only current 0C execution tracker.

## Historical validation records

- [`spike-0a-assessment.md`](spike-0a-assessment.md) — completed Narrative IR spike.
- [`authoring-ux-spec.md`](authoring-ux-spec.md), [`spike-0b-implementation-plan.md`](spike-0b-implementation-plan.md), [`spike-0b-human-test-plan.md`](spike-0b-human-test-plan.md), [`spike-0b-assessment.md`](spike-0b-assessment.md) — 0B structured-authoring experiment.
- [`adr/`](adr/) — append-only architecture decision history, including superseded 0C runtime approaches.

## Current development focus

**0A — Narrative IR:** complete/pass.

**0B — Structured Authoring UX:** closed/mixed. Multi-view coherence passed; routine direct structure management failed the interaction-friction test.

**0C — External-Agent Authoring + Narrative Lenses:** current.

Current implementation strategy:

```text
external harness
      ↓
Salai CLI / machine interface
      ↓
SalaiProjectService
      ↓
Narrative IR + Workspace
      ↓
Narrative Lenses
```

The external harness owns model/provider/auth/session/tool-loop behavior. Salai owns project semantics, canonical mutation, source provenance, grouped-action/revert behavior, and the machine interface to the same live project used by the UI.

Start with [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md) and [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md).
