# ADR 0009 — Salai Owns Structural Editorial

## Status

Accepted.

Supersedes: ADR 0001.

## Context

Spike 0A validated a stable Narrative IR. Spike 0B showed that several structured creative views can share that model but that routine direct structure management is too cumbersome. Spike 0C then human-validated an external-agent workflow using Codex: the harness integration worked correctly and the agent-in-the-loop interaction materially reduced the friction of manipulating the canonical project.

The next product risk is no longer whether Salai can keep narrative structure outside an NLE. It is whether that semantic structure can become a directly playable audiovisual environment where the creator can experience timing, media choices, source evidence, and alternatives without requiring DaVinci Resolve for every editorial judgment.

The previous product boundary made Salai a companion whose value depended on Resolve for all timeline playback and editing. That boundary now blocks the product from validating its core differentiation in time: the connection between narrative intent, source/production material, and the active audiovisual assembly.

## Decision

Salai is a standalone, local-first, narrative-aware audiovisual construction environment.

Salai owns **structural editorial** in addition to narrative construction. Structural editorial includes the minimum temporal/media operations required to construct, play, judge, and revise an audiovisual story while preserving narrative meaning and source identity. This includes a semantic timeline/playback surface, rough audiovisual assembly, narrative/media reordering, source-range trimming, and basic picture/audio arrangement as validated by product workflows.

Salai does **not** aim to replace specialist NLE capabilities such as precision finishing, advanced trim modes, multicam, compositing, color, full audio post, conform, mastering, or delivery.

DaVinci Resolve and other NLEs are optional downstream environments for precision editorial and finishing. Handoff is an explicit materialization/interchange boundary from Salai-owned canonical state; downstream timelines do not become Salai's source of truth.

ADR 0004 remains applicable when Resolve integration is used: the Salai Resolve adapter should still use CutMaster by default unless a capability requires another boundary.

## Alternatives considered

### Keep Resolve mandatory for all timeline editing and playback

Rejected because it prevents Salai from becoming independently useful for story construction and forces the creator to leave the semantic environment to judge duration, audiovisual rhythm, realization choices, and rough assembly.

### Build a complete professional NLE

Rejected. The decision expands Salai only into structural editorial required by its narrative/production thesis. Rebuilding specialist finishing systems would dilute the product and create unnecessary implementation surface.

### Treat the timeline as a passive visualization only

Rejected because a non-playable/non-editable timeline cannot validate whether narrative semantics remain useful while real media is sequenced and judged in time.

## Consequences

Positive:

- Salai can be useful without Resolve installed or open;
- narrative intent remains visible while the creator plays and structurally edits the work;
- captured, sourced, placeholder, and generated media can be evaluated in the same narrative context;
- external NLE integrations become optional adapters instead of the product's center;
- the next spike can test Salai's differentiated semantic timeline directly.

Costs:

- Salai now owns a bounded media-playback/editorial surface, including timebase, playback, basic media arrangement, and eventually local media lifecycle concerns needed by validated workflows;
- scope discipline is essential to avoid drifting into a general-purpose NLE;
- the canonical narrative/production model must remain separate from replaceable timeline/rendering-engine state;
- downstream interchange becomes a broader concern than Resolve-only automation.
