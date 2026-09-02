# Salai Documentation Map

This directory separates current product/workflow/architecture contracts from historical experiment records and scoped proposals.

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
| Structural-editorial interaction behavior | [`editorial-interaction.md`](editorial-interaction.md) |
| Narrative IR types/invariants/operations | [`narrative-ir-spec.md`](narrative-ir-spec.md) |
| Validated external-agent interaction contract | [`agent-mediated-authoring.md`](agent-mediated-authoring.md) |
| External-agent operating procedure | [`agent-usage.md`](agent-usage.md) |
| Coding-agent development procedure | [`agent-development.md`](agent-development.md) |
| Active 0E tasks/status/evidence | [`spike-0e-implementation-plan.md`](spike-0e-implementation-plan.md) |
| Validation sequence | [`mvp.md`](mvp.md) |
| Current priorities | [`backlog.md`](backlog.md) |
| Current system architecture | [`architecture.md`](architecture.md) |
| Accepted/superseded decisions | [`adr/`](adr/) |
| Proposed cross-cutting changes / scoped uncertainty | [`rfcs/`](rfcs/) |

Root-level [`../AGENTS.md`](../AGENTS.md) is the concise repository entrypoint for coding agents and delegates detailed behavior to the canonical standards above.

Do not duplicate exact operation vocabularies, active task state, or unresolved design questions across living docs. Narrative operations belong in `narrative-ir-spec.md`; active implementation state belongs in the current spike plan; unresolved cross-cutting questions belong in an RFC until accepted.

## Current contracts

- [`narrative-ir-spec.md`](narrative-ir-spec.md) — implemented canonical narrative-model contract.
- [`editorial-interaction.md`](editorial-interaction.md) — proposed 0E direct structural-editorial interaction contract; it must not outrun RFC 0003 on unresolved semantics.
- [`narrative-lenses.md`](narrative-lenses.md) — validated structured-view semantics over one project; not a commitment to final top-level navigation.
- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — validated external-harness product behavior from 0C.
- [`architecture.md`](architecture.md) — current runtime/application/editorial boundaries.
- [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md) — external harness owns model/session behavior.
- [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md) — Salai owns structural editorial; specialist NLEs are optional downstream.
- [`rfcs/0003-semantic-editorial-interaction-model.md`](rfcs/0003-semantic-editorial-interaction-model.md) — proposed 0E interaction model and the only home for its scoped unresolved semantics.
- [`spike-0e-implementation-plan.md`](spike-0e-implementation-plan.md) — current execution tracker; implementation remains blocked until the 0E interaction contract is reviewed/stable.

## Historical validation records

- [`spike-0a-assessment.md`](spike-0a-assessment.md) — Narrative IR: complete/pass.
- 0B structured-authoring records — synchronized-view architecture passed; routine direct structured manipulation failed the interaction-friction test.
- 0C external-agent records — complete/pass using Codex as the external harness.
- [`spike-0d-assessment.md`](spike-0d-assessment.md) and [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md) — semantic-editorial architecture passed technically; the direct timeline interaction gate closed/mixed because the editor was too shallow/fragmented.
- [`adr/`](adr/) — append-only decision history, including superseded decisions.

## Current development focus

**0A — Narrative IR:** complete/pass.

**0B — Structured Authoring UX:** closed/mixed.

**0C — External-Agent Authoring + Narrative Lenses:** complete/pass.

**0D — Semantic Editorial Environment:** closed/mixed. Playback, derived timeline architecture, canonical round-trip, and agent continuity passed; human editing usefulness did not.

**0E — Semantic Editorial Interaction Depth:** current shaping/validation iteration.

Current direction:

```text
external harness                         human direct editing
      ↓                                         ↓
Salai machine interface            hierarchical semantic timeline
      └──────────────────┬──────────────────────┘
                         ↓
                SalaiProjectService
                         ↓
                  Narrative IR
                         ↓
          timeline / playback projections
```

Before implementing 0E, start with:

1. [`rfcs/0003-semantic-editorial-interaction-model.md`](rfcs/0003-semantic-editorial-interaction-model.md)
2. [`editorial-interaction.md`](editorial-interaction.md)
3. [`narrative-ir-spec.md`](narrative-ir-spec.md)
4. [`spike-0e-implementation-plan.md`](spike-0e-implementation-plan.md)
5. [`spike-0d-assessment.md`](spike-0d-assessment.md)

The external harness continues to own model/provider/auth/session/tool-loop behavior. Salai owns project semantics, canonical mutation, source provenance, structural editorial meaning, and the shared application boundary. Timeline-editor and Elah remain replaceable adapters; their state is never project truth.
