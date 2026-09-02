# Salai RFC Process

RFCs are used for proposals that materially change shared product/technical architecture or cross-cutting interaction semantics and benefit from review before implementation.

Use an RFC for changes such as:

- Narrative IR semantics;
- new canonical domain objects or relationship rules;
- cross-cutting structural-editorial interaction rules that may imply domain changes;
- major persistence/runtime changes;
- introduction/replacement of core libraries or infrastructure;
- cross-cutting API conventions;
- collaboration/versioning architecture;
- changes that would invalidate several existing features or workspaces.

Do not require an RFC for small implementation choices that are local to one module and easy to reverse.

## File naming

```text
NNNN-short-title.md
```

## Required sections

- Status
- Summary
- Motivation
- Proposal
- Alternatives considered
- Consequences / risks
- Open questions
- Decision / outcome

## Status lifecycle

```text
Draft → Proposed → Accepted / Rejected / Superseded
```

The pull request or review discussion containing the RFC is the primary decision surface.

Once accepted:

- promote observable product/interaction behavior into the canonical owning specification;
- promote architecture decisions into ADRs when the choice and consequences need durable decision history;
- keep intentionally deferred questions scoped in the accepted RFC until evidence resolves them;
- remove resolved uncertainty from living canonical docs rather than duplicating the RFC discussion everywhere.

## Current RFCs

- [`0001-one-narrative-ir-multiple-workflows.md`](0001-one-narrative-ir-multiple-workflows.md) — one canonical Narrative IR across workflows.
- [`0002-agent-mediated-authoring.md`](0002-agent-mediated-authoring.md) — external-agent authoring direction that led to the validated 0C boundary.
- [`0003-semantic-editorial-interaction-model.md`](0003-semantic-editorial-interaction-model.md) — **Accepted** 0E hierarchical temporal interaction model and direct-edit grammar; it remains the canonical home for five explicitly deferred questions around Cue/source splitting, within-Cue timing, intentional black-vs-missing, and broad cross-parent grouped moves.
