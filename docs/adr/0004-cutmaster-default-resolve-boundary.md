# ADR 0004 — CutMaster as Default Resolve Automation Boundary

## Status

Accepted.

## Context

Salai needs programmatic access to DaVinci Resolve for a future vertical slice that reads project/timeline context, imports media, maps source ranges, writes metadata/markers, creates or modifies timelines, and exposes alternate realizations where useful.

Salai should own the narrative and production semantics that explain *why* an editorial operation occurs, but generic Resolve scripting infrastructure is not product differentiation.

CutMaster provides reusable Resolve automation infrastructure and deterministic operations that can sit between Salai and the Resolve scripting API.

Directly building and maintaining a parallel general-purpose Resolve wrapper would duplicate infrastructure, increase coupling to Resolve API quirks, and consume engineering effort that should remain focused on Salai's narrative/production model.

## Decision

CutMaster is Salai's **default programmatic automation boundary to DaVinci Resolve**.

```text
Salai narrative / production intent
             ↓
     Salai Resolve adapter
             ↓
          CutMaster
             ↓
 DaVinci Resolve scripting API
```

Salai may call the Resolve scripting API directly only when a required capability is unavailable, unsuitable, or materially constrained through CutMaster.

Salai domain types must not depend directly on CutMaster types. A Salai-owned adapter boundary translates explicit Salai operations into CutMaster calls and isolates fallbacks to direct Resolve scripting where necessary.

Python runtime compatibility for the Resolve integration must follow the Python versions actually supported by Resolve and CutMaster rather than an unconstrained `3.11+` policy. The current application baseline is therefore Python 3.11 or 3.12 unless later compatibility evidence changes it.

## Alternatives considered

### Build a Salai-specific general Resolve wrapper

Rejected as the default. It would duplicate generic automation infrastructure and increase long-term maintenance without strengthening the Narrative IR or production graph.

### Call Resolve scripting APIs directly everywhere

Rejected as the default. Direct access remains an escape hatch but should not become the primary abstraction when reusable infrastructure already exists.

### Make CutMaster types part of Salai's domain model

Rejected. Resolve automation is an infrastructure boundary and must not define Narrative IR, Workspace, ShotIntent, Asset, or production-graph semantics.

## Consequences

Positive:

- less custom Resolve plumbing;
- a clearer separation between Salai intent and Resolve mechanics;
- reuse of deterministic automation infrastructure;
- easier replacement/fallback for individual unsupported operations;
- reduced pressure for Resolve-specific details to leak into the domain model.

Costs and risks:

- Salai depends on CutMaster's supported surface for most Resolve automation;
- version compatibility must be tested in the Phase 3 vertical slice;
- some capabilities may still require direct Resolve scripting;
- the adapter boundary must be maintained deliberately rather than passing CutMaster objects through the application.

## Validation

Phase 3 must verify CutMaster coverage for the required Salai vertical slice and document any direct-Resolve exceptions. If CutMaster proves unsuitable as the default boundary, supersede this ADR rather than silently building a second competing integration layer.
