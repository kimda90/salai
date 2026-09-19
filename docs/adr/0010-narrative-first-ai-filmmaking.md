# ADR 0010 — Narrative-First AI Filmmaking

## Status

Accepted product direction — September 18, 2026, following the product owner's instruction to document the pivot before implementation.

Partially supersedes: [ADR 0009](0009-salai-owns-structural-editorial.md), specifically the product positioning and the standalone semantic-editorial validation priority. Its canonical-state, Salai-owned structural-editing, and optional downstream-NLE boundaries remain in force.

Preserves: ADR 0003 (no initial graph database), ADR 0005 (one Narrative IR), and ADR 0008 (external harness owns agent runtime).

Implementation shape is proposed separately in [RFC 0004](../rfcs/0004-narrative-first-filmmaking-loop.md). This decision does not declare that schema or any generation/3D capability implemented.

## Context

The user described telling a story, having it interpreted and broken down, supplying references/direction, reviewing stills, reacting, and reviewing cheap motion. The exploration expanded into semantic dependency systems and industrial analogies, then the user explicitly asked to simplify the architecture and loop.

The resulting loop overlaps the AI filmmaking category. The product owner accepted that positioning: an AI filmmaking interface with a heavy focus on narrative intents. Salai does not need an entirely new category or an enterprise film-lifecycle architecture to justify testing it.

Existing spikes provide a useful narrative model, shared human/machine boundary, and playback foundation. They do not prove the new loop or a competitive advantage. The prior 0E implementation checklist remains uncompleted.

## Decision

1. Make **Tell → See → Direct → Update → See** the primary product loop, with narrative intent retained in context.
2. Start with stills and a reviewable animatic, then cheap generated motion. Quality escalation and stopping are explicit user decisions.
3. Make breakdown and prompt preparation supporting work. References and precise controls are available when useful, not compulsory onboarding.
4. Keep one canonical project and the existing service boundary. Reuse Narrative IR and ShotIntent identity rather than replacing them with a new generic Film graph.
5. Keep generation execution external. Store only the project-owned direction, scoped requests, input/output provenance, and selections needed for the loop; do not add another agent runtime.
6. Begin change awareness with recorded inputs/revisions and conservative review signals. Do not treat input changes as proven creative failure or infer that every semantic consequence is computable.
7. Pause the standalone 0E program. Adopt necessary editing tasks into the new [implementation plan](../filmmaking-implementation-plan.md); do not require the full old gate before testing generation. Do not mark 0E passed.
8. Retain optional 3D shot direction and higher-quality generation as next scope after the basic loop. Do not make either a prerequisite for an initial still.
9. Judge the product through actual filmmaking iteration, not ontology breadth or asserted competitor limitations.

## Alternatives considered

**Continue the full timeline-depth milestone first.** Not selected as the product priority. Its valid temporal semantics and useful interaction work are retained, but the next question is the narrative-directed filmmaking loop.

**Build a film PLM/digital-thread platform before the loop.** Rejected as initial scope. Requirements/satisfaction graphs, general constraint checking, semantic branching/merging, and a build engine create too much unvalidated machinery.

**Become a generic prompt-to-video wrapper.** Not selected as the focus. External model execution is useful infrastructure, but intent, references, accepted changes, and selected results should survive iteration.

**Claim Salai is categorically unlike Nolan/LTX.** Rejected. Category overlap is real; the quality of the narrative-focused experience needs testing.

## Consequences

Product/UX, roadmap, backlog, and agent-entry docs change together. The implemented Narrative IR contract remains unchanged until a separately reviewed implementation changes it.

Small asset/reference, request-provenance, persistence, and review capabilities move earlier because the loop needs them. A full production graph, NLE, desktop rewrite, and provider platform do not.

The first pilot may reveal that narrative context is not valuable enough or that generation control is insufficient. Record that evidence without compensating by adding architectural complexity. Human judgment remains the authority on creative success.
