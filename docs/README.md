# Salai Documentation Map

This directory separates product requirements, discovery evidence, workflow contracts, architecture, accepted decisions, and execution tracking so the same information does not drift across several files.

## Canonical ownership rule

| Information | Canonical source |
| --- | --- |
| Product/domain term definitions | [`glossary.md`](glossary.md) |
| Product requirements / success criteria | [`prd.md`](prd.md) |
| Product thesis / positioning | [`product-brief.md`](product-brief.md) |
| Discovery observations | [`research-notes.md`](research-notes.md) |
| Creative workflow movement between modes | [`workflows.md`](workflows.md) |
| Narrative Lens semantics | [`narrative-lenses.md`](narrative-lenses.md) |
| Narrative IR types/invariants/operations | [`narrative-ir-spec.md`](narrative-ir-spec.md) |
| Active agent/free-form interaction contract | [`agent-mediated-authoring.md`](agent-mediated-authoring.md) |
| Active Spike 0C task numbering/status/evidence | [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md) |
| Validation/implementation sequence | [`mvp.md`](mvp.md) |
| Current priority / user outcomes | [`backlog.md`](backlog.md) |
| System/runtime/persistence architecture | [`architecture.md`](architecture.md) |
| Accepted architecture decisions | [`adr/`](adr/) |
| Proposed cross-cutting changes | [`rfcs/`](rfcs/) |
| Reliability / service-level policy | [`service-levels.md`](service-levels.md) |

Other documents may summarize for context, but should link to the canonical source rather than copy implementation lists, exact definitions, operation vocabularies, or task numbering/status.

In particular:

- Narrative IR operation vocabulary lives only in `narrative-ir-spec.md`;
- 0C task numbering/status lives only in `spike-0c-implementation-plan.md`;
- Narrative Lens taxonomy/expose-hide rules live only in `narrative-lenses.md`;
- `mvp.md` owns sequence, not subphase implementation details;
- `backlog.md` owns NOW/NEXT/LATER outcomes, not duplicate engineering checklists.

# Living product / workflow docs

- [`product-brief.md`](product-brief.md) — concise thesis and positioning.
- [`prd.md`](prd.md) — product requirements and success criteria.
- [`research-notes.md`](research-notes.md) — discovery evidence; observations are not automatically requirements.
- [`glossary.md`](glossary.md) — canonical terminology.
- [`scripting.md`](scripting.md) — conceptual scripting rationale/research.
- [`workflows.md`](workflows.md) — how users move between free-form, agent, lenses, and downstream production.
- [`narrative-lenses.md`](narrative-lenses.md) — canonical role/requirements of structured Narrative Lenses.
- [`agent-mediated-authoring.md`](agent-mediated-authoring.md) — active low-friction authoring/agent contract.

# Validation contracts and assessments

- [`narrative-ir-spec.md`](narrative-ir-spec.md) — implemented Spike 0A contract.
- [`spike-0a-assessment.md`](spike-0a-assessment.md) — completed 0A result.
- [`authoring-ux-spec.md`](authoring-ux-spec.md) — historical 0B implementation contract only; it does not define current product direction.
- [`spike-0b-implementation-plan.md`](spike-0b-implementation-plan.md) — historical 0B task/evidence record.
- [`spike-0b-assessment.md`](spike-0b-assessment.md) — 0B result and human finding.
- [`spike-0b-human-test-plan.md`](spike-0b-human-test-plan.md) — historical 0B test procedure.
- [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md) — current executable tracker and evidence source.

Historical contracts should record what the experiment actually tested. Put later interpretation in the corresponding assessment or current living contract instead of teaching old contracts the new product direction.

# Architecture and engineering decisions

- [`architecture.md`](architecture.md) — living system boundaries/topology.
- [`rfcs/0001-one-narrative-ir-multiple-workflows.md`](rfcs/0001-one-narrative-ir-multiple-workflows.md) — **Accepted** canonical-model proposal; final decision recorded in ADR 0005.
- [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) — **Proposed** agent-mediated authoring + Narrative Lenses interaction model; validate through 0C.
- [`adr/0005-one-narrative-ir-multiple-views.md`](adr/0005-one-narrative-ir-multiple-views.md) — accepted one-IR/multiple-views decision.
- [`adr/`](adr/) — append-only accepted decisions.
- [`service-levels.md`](service-levels.md) — reliability expectations.

# Current development focus

**0A — Narrative IR: complete/pass.**

**0B — Structured Authoring UX: closed/mixed.** The canonical multi-view architecture works; routine direct structured manipulation failed the creative-friction test; structured surfaces remain promising as Narrative Lenses.

**0C — Agent-Mediated Authoring + Narrative Lenses: current.**

The minimum current proof is:

- one script-first low-friction vertical slice;
- one footage/source-backed vertical slice;
- grouped apply + one-step revert using the existing canonical operation boundary;
- one agent ↔ existing-lens round trip;
- human evidence of lower routine interaction and useful voluntary structural insight.

Start with:

- [`agent-mediated-authoring.md`](agent-mediated-authoring.md);
- [`narrative-lenses.md`](narrative-lenses.md);
- [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md);
- [`mvp.md`](mvp.md).