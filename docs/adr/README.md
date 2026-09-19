# Salai Architecture Decision Records

ADRs are the append-only record of accepted architectural decisions: context, decision, alternatives, and consequences. Use an RFC for engineering proposals that still need review.

Do not rewrite an accepted ADR to make history look cleaner. Add a new record for a changed decision, specify full or partial supersession, and add a status notice to the earlier record. Product acceptance does not imply implementation or acceptance of every accompanying technical proposal.

## Records

- [0001 — Resolve remains the NLE](0001-resolve-remains-the-nle.md): superseded by ADR 0009.
- [0002 — Local-first desktop runtime](0002-local-first-desktop-runtime.md): broader local-first direction; no desktop migration is required before the initial filmmaking proof.
- [0003 — No graph database initially](0003-no-graph-database-initially.md): ordinary typed data and relationships before graph infrastructure.
- [0004 — CutMaster Resolve boundary](0004-cutmaster-default-resolve-boundary.md): retained when optional downstream Resolve automation is implemented.
- [0005 — One Narrative IR, multiple views](0005-one-narrative-ir-multiple-views.md): retained canonical state boundary.
- [0006 — Codex runtime seam](0006-codex-runtime-behind-salai-agent-seam.md): superseded by ADR 0007.
- [0007 — Project-service boundary](0007-project-service-is-the-human-machine-boundary.md): superseded by ADR 0008; shared service retained.
- [0008 — External harness owns agent runtime](0008-external-harness-owns-agent-runtime.md): retained. The pivot does not authorize a second runtime or embedded provider platform.
- [0009 — Salai owns structural editorial](0009-salai-owns-structural-editorial.md): retained ownership and optional-NLE boundary; **positioning and next-validation priority partially superseded by ADR 0010**.
- [0010 — Narrative-first AI filmmaking](0010-narrative-first-ai-filmmaking.md): **current accepted product direction**. Tell → See → Direct → Update; stills and cheap motion first; simple project architecture; standalone 0E paused.

Exact current architecture lives in [architecture.md](../architecture.md). Concrete filmmaking extensions are proposed in [RFC 0004](../rfcs/0004-narrative-first-filmmaking-loop.md), not retroactively declared implemented by ADR 0010.
