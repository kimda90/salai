# Salai Architecture

## Status

Current ownership model plus a bounded extension direction under [ADR 0010](adr/0010-narrative-first-ai-filmmaking.md). The [Narrative IR specification](narrative-ir-spec.md) describes implemented types/operations. [RFC 0004](rfcs/0004-narrative-first-filmmaking-loop.md) contains proposed filmmaking additions, not a shipped API. The [active plan](filmmaking-implementation-plan.md) is the implementation-status authority.

## One project, one service, replaceable execution

```text
Human controls / external harness
                 ↓
        SalaiProjectService
                 ↓
      Canonical Salai project
                 ↓
  Script / storyboard / timeline / viewer
                 ↓
    External execution and media adapters
```

Adapters return results through validated service actions; they do not mutate a separate authoritative project. This is an ownership sketch, not a requirement for new packages, services, queues, or transports.

## Keep the implemented foundation

`@salai/script-model` owns Script → Section → optional Scene → Beat → Cue → ContentBlock, stable identities, explicit relationships, source ranges, serialization, and operation validation. Section can be labeled “sequence” in the product; no new hierarchy level is assumed.

`SalaiProjectService` names the existing shared boundary, currently implemented by `SalaiController`. Canonical multi-operation changes use `applyOperations()` and publish atomically. A second service/state owner is unnecessary.

The external harness owns model/provider access, auth, sessions, planning, and tool-loop behavior under [ADR 0008](adr/0008-external-harness-owns-agent-runtime.md). The CLI and local HTTP bridge reach the browser-owned project. The bridge stores no project. Proposed conversational UI must not silently introduce another agent runtime.

Timeline/playback projections remain disposable. Retain `@moritzbrantner/timeline-editor` and `@elah/core` behind their current boundaries until evidence requires a change. Specialist NLEs remain optional downstream; the pivot does not make an NLE a dependency.

## Add only what the loop needs

The conceptual data remains small:

| Area | Existing foundation | Bounded future addition |
| --- | --- | --- |
| Story | Narrative IR, authored text, ShotIntent references | scoped direction/guidance using existing owners |
| References | attachment/source handles | durable reference assets and minimal reusable subject/location/prop records when needed |
| Shots | stable ShotIntent stubs and explicit relationships | direction, reference links, and optional nested staging on that identity |
| Media | MediaSegment/source references and playback materialization | assets, candidate selections, frozen generation requests/results |

These are categories within one project, not four independent systems. A comprehensive World ontology, ShotPlan service, Realization graph, Prompt tree, and separate Coverage subsystem are not required.

Keep existing ShotIntent IDs and relationship cardinality. Do not replace them with a single `cueId` ownership pointer. Do not flatten the existing many visual/audio contents of a Cue. The first generated sequence can use separate Cues for ordered shots without making “one Cue = one Shot” a domain invariant.

New stored fields, asset bindings, revision rules, operations, and migrations require the reviewed RFC and an implementation PR updating the canonical spec and tests. Do not persist them in a timeline engine or arbitrary JSON side channel in the meantime.

## A request records its inputs

When generation is implemented, construct a frozen request containing the target, requested output kind/profile, effective guidance/reference inputs, actual execution parameters, and the versions/content identifiers used. Preserve enough input values or immutable snapshots to inspect the request after later edits; revision numbers alone do not reconstruct history.

A result is a concrete artifact linked to that request. Preserve the actual returned output even when the provider is nondeterministic or its model later changes. Request provenance improves traceability; it does not guarantee bit-for-bit reproduction of generated media.

The simplest first comparison is between the recorded input manifest and the current effective input manifest. Compare membership as well as versions: newly attached references, removed inputs, and reparenting into different inherited guidance all matter. Include the relevant resolved upstream inputs, not only the immediate shot's revision.

A mismatch produces **needs review**, not “creatively invalid.” Unknown or incomplete provenance stays unknown. Scanning these records is enough initially; an index can be added for measured need. No graph database or automatic dirty-propagation framework is required.

Revision changes concern authored/generation-relevant project content. Selection, viewport, and playhead do not invalidate outputs. Historical guidance snapshots can support basic version inspection/reuse without introducing Git-style branches or event sourcing.

## Separate three operations

**Edit the project:** interpret feedback and apply an approved canonical change. Human notes about motivation may need judgment; they are not deterministic dependency rules.

**Request external work:** resolve and freeze context, show scope/cost/recipient, obtain approval, then execute outside the domain model. The model stores request/result metadata, not provider credentials or a general planning loop.

**Select a result:** explicitly bind a candidate into the current assembly through Salai-owned state. Arrival alone does not replace accepted material. Recheck target existence and current inputs before presenting it as current.

Partial failure preserves successful assets and existing selections. Repeated completion must be idempotent. If a target was deleted, preserve the output without re-creating the target. Cancellation/retry policy must acknowledge unknown provider status and possible charges.

## Timing and evidence remain explicit

Cue owns sequential narrative time; source in/out selects evidence. Ordinary ContentBlocks do not acquire hidden independent offsets or a universal razor. Relevant unresolved questions remain in [RFC 0003](rfcs/0003-semantic-editorial-interaction-model.md).

A source recording is not generated from story intent. Preserve its acquisition identity, source range, and transcript. Revising a story can change the recording's selection or suitability, not its historical provenance or bytes.

Likewise, a screenplay adaptation of a spoken story is authored interpretation. Keep the recording/transcript available as its input instead of overwriting them with the adaptation.

## Guidance and 3D

Store authored guidance on appropriate existing scopes, with local versus shared meaning explicit. The effective context and backend prompt are derived; frozen request snapshots preserve what was actually sent. Do not declare a second “resolved canonical film” beside the authored project.

Optional 3D staging is nested shot direction: placements, camera, and lights. A replaceable engine edits/materializes that description. Full 3D asset management, animation systems, and model-specific conditioning are not prerequisites for the stills loop. A backend's ability to follow staging must be verified independently.

## Persistence and external execution

Narrative serialization already exists; durable media/request recovery does not follow automatically from it. Add the smallest save/reopen and material-retention slice before live pilot use. Keep originals local unless an approved operation explicitly sends them. Store credentials outside project files and omit them from saved requests.

The first external execution route is a scoped implementation choice in RFC 0004 and the active plan. Start with one executor, not a provider platform. Development-only harness/manual receipt paths must be disclosed as such; they do not prove the final app interaction.

No desktop rewrite is required to test the loop. A later desktop runtime may host the same service. No new transport, embedded chat runtime, graph engine, plugin framework, or NLE document is authorized merely by calling the product AI filmmaking.
