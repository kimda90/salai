# Salai Service Levels and Reliability Policy

## Current SLA status

**No external Service Level Agreement applies at the current product stage.**

Salai is presently a local-first product in discovery/alpha development, not a hosted production service with contractual uptime or support guarantees. Publishing artificial uptime or response-time commitments now would be misleading.

## Why SLA is not applicable yet

The initial product is expected to run primarily on the user's workstation and interact with local software/services such as DaVinci Resolve, project storage, and optional local GenAI backends.

Traditional hosted-service metrics such as `99.9% API uptime` do not describe the most important current reliability risks.

Early concerns are instead:

- project data integrity;
- deterministic save/reopen behavior;
- crash recovery;
- safe structural editing;
- explicit degraded states when integrations are unavailable;
- no silent loss of relationships or source identity;
- predictable behavior when local files move or disappear.

The Narrative IR implementation-level data-integrity contract is authoritative in [`narrative-ir-spec.md`](narrative-ir-spec.md), especially its hierarchy, identity, deletion, relationship, atomic-operation, and serialization invariants. This document states quality expectations rather than duplicating those technical rules.

## Non-contractual engineering quality goals

These are product-quality expectations, **not customer SLAs**.

### Data integrity

- Ordinary edits must not silently discard narrative identity, source references, or production relationships.
- Schema migrations must be versioned and testable.
- Failed writes/migrations must surface clearly rather than leave partially mutated project state.
- Persistence tests should cover the authoritative domain invariants rather than restating a parallel rule set here.

### Local dependency failures

When an optional dependency such as Resolve, CutMaster, ComfyUI, or a hosted model provider is unavailable:

- the core project should remain usable where possible;
- the integration should report a clear disconnected/degraded state;
- failed external operations should not corrupt local project state;
- retry should be explicit and safe.

### User work preservation

Before public alpha, define and test:

- autosave/manual-save behavior;
- crash recovery expectations;
- backup/project-copy behavior;
- rollback behavior for failed migrations.

Numeric targets should be established only after the real desktop runtime can be instrumented and measured.

## When an SLA becomes necessary

Create a customer-facing SLA only if Salai introduces a service for which Salai controls availability, for example:

- hosted project sync/collaboration;
- hosted authentication/licensing required for normal use;
- cloud media processing;
- Salai-operated GenAI inference;
- hosted review/approval;
- paid support plans with promised response times.

At that point, define separate commitments for:

1. service availability;
2. data durability/recovery;
3. support response/resolution targets;
4. scheduled maintenance;
5. third-party dependency exclusions;
6. security-incident communication.

## Relationship to SLOs and SLIs

Before contractual SLAs, introduce measurable Service Level Indicators (SLIs) and Service Level Objectives (SLOs) only for components that actually exist.

Possible future desktop/local SLIs include:

- successful project-open rate;
- successful save rate;
- crash-free sessions;
- migration success rate;
- integration connection success rate;
- time to detect a disconnected dependency;
- operation failure/recovery rate.

Do not assign numeric targets until implementation can collect representative measurements.
