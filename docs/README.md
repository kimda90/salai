# Salai Documentation Map

## Current direction

**Salai is an AI filmmaking interface with a heavy focus on narrative intent.** The product loop is **Tell → See → Direct → Update → See**. Start with stills, review in story context, then use cheap motion when useful. Higher fidelity is a choice, not a required finish line.

Product direction is accepted in [ADR 0010](adr/0010-narrative-first-ai-filmmaking.md). [RFC 0004](rfcs/0004-narrative-first-filmmaking-loop.md) accepts the minimal F1 domain/migration plan. Its execution and motion gates remain unresolved. Accepted design does not imply an implemented API. The [filmmaking implementation plan](filmmaking-implementation-plan.md) is the only active task tracker.

Standalone Spike 0E is **paused, not passed**. Its accepted interaction work remains available for selective reuse; completing every 0E feature is no longer a prerequisite for testing generation.

## Canonical ownership

| Information | Owner |
| --- | --- |
| Product thesis and audience | [product-brief.md](product-brief.md) |
| Product requirements and scope | [prd.md](prd.md) |
| User workflow | [workflows.md](workflows.md) |
| Filmmaking interaction and review behavior | [filmmaking-interaction.md](filmmaking-interaction.md) |
| Supporting structural-editorial behavior | [editorial-interaction.md](editorial-interaction.md) |
| Terms | [glossary.md](glossary.md) |
| Narrative rationale, not a second schema | [scripting.md](scripting.md) |
| Narrative Lens / Projection / Workspace semantics | [narrative-lenses.md](narrative-lenses.md) |
| Implemented Narrative IR types, invariants, operations | [narrative-ir-spec.md](narrative-ir-spec.md) |
| Accepted filmmaking design and unresolved gates | [RFC 0004](rfcs/0004-narrative-first-filmmaking-loop.md) |
| Deferred temporal semantics | [RFC 0003](rfcs/0003-semantic-editorial-interaction-model.md) |
| Current architecture and bounded future additions | [architecture.md](architecture.md) |
| Accepted architecture decisions | [adr/README.md](adr/README.md) |
| Active tasks, implementation order, completion evidence | [filmmaking-implementation-plan.md](filmmaking-implementation-plan.md) |
| Priorities and user outcomes | [backlog.md](backlog.md) |
| Validation sequence | [mvp.md](mvp.md) |
| Discovery, learnings, and unproven ideas | [research-notes.md](research-notes.md) |
| Dated external competitive evidence | [competitive-landscape.md](competitive-landscape.md) |
| Implemented external-agent behavior | [agent-mediated-authoring.md](agent-mediated-authoring.md) |
| Supported live-project operating procedure | [agent-usage.md](agent-usage.md) |
| Coding-agent development procedure | [agent-development.md](agent-development.md) |
| Reliability expectations, not a contractual SLA | [service-levels.md](service-levels.md) |

Root [AGENTS.md](../AGENTS.md) is the repository entrypoint. [CONTRIBUTING.md](../CONTRIBUTING.md) covers human contribution conventions.

## Read before implementation

Read AGENTS and this map, then the PRD, filmmaking interaction contract, architecture, implemented Narrative IR spec, RFC 0004, and the active implementation plan. Read relevant code and tests before proposing schema changes. Consult RFC 0003 only when a slice reaches its deferred timing/editing questions.

Do not duplicate operation vocabularies, exact fields, or task completion across summaries. When an RFC question is accepted, promote its contract into its canonical specification in the same implementation change. A product decision is not evidence that a proposed field, tool, provider, or UI exists.

## Preserved history

- 0A: Narrative IR passed; [assessment](spike-0a-assessment.md).
- 0B: synchronized structured views worked, routine manual structure management was too costly; [assessment](spike-0b-assessment.md). [authoring-ux-spec.md](authoring-ux-spec.md) remains a historical implementation contract, not the new UI specification.
- 0C: external-harness authoring passed human validation; [assessment](spike-0c-assessment.md). This does not validate a new embedded chat or generation interface.
- 0D: temporal/playback architecture passed technically; direct editing usefulness was mixed; [assessment](spike-0d-assessment.md).
- 0E: technical implementation through 0E.4 exists on the current branch. Human gates remain open. Its standalone program is paused; see the [retained evidence](spike-0e-implementation-plan.md).

The following are exact, frozen pre-pivot snapshots. Their words such as “current,” “NOW,” and “next” describe their original period and **must not override this map or the active plan**:

- [spike-0e-plan-before-pivot.md](spike-0e-plan-before-pivot.md): original accepted plan and unchecked implementation tasks.
- [editorial-interaction-0e.md](editorial-interaction-0e.md): original accepted 0E interaction contract.
- [research-notes-before-filmmaking-pivot.md](research-notes-before-filmmaking-pivot.md): accumulated prior discovery.
- [competitive-landscape-2026-08-31.md](competitive-landscape-2026-08-31.md): previous market analysis; not reverified by the pivot.

Other 0A–0D plans and assessments retain their historical evidence. Accepted ADR bodies are append-only history; supersession is explicit. Do not turn paused work into a successful experiment or rewrite prior human feedback to support the new direction.
