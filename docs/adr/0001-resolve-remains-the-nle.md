# ADR 0001 — DaVinci Resolve Remains the NLE

## Status

Accepted.

## Context

Salai spans scripting, planning, source review, narrative structure, production intent, generated media, and editorial handoff. Rebuilding a complete NLE would multiply scope across media playback, proxies/codecs, frame-accurate editing, compositing, color, audio, rendering, and delivery.

DaVinci Resolve already provides mature implementations of those downstream post-production functions.

## Decision

Salai will be a companion to DaVinci Resolve rather than a replacement NLE.

Salai owns narrative/production context and higher-level creative workflows. Resolve remains responsible for frame-accurate editing, media post, Fusion, color, Fairlight, and delivery.

## Alternatives considered

### Build a standalone full editor

Rejected for initial product scope because it duplicates mature infrastructure and obscures the differentiated narrative/production problem.

### Use Resolve only as final export target

Rejected as the long-term direction because Salai should stay contextually connected to real editorial work rather than becoming a disconnected pre-production tool.

## Consequences

Positive:

- dramatically smaller implementation surface;
- Salai can benefit from improvements in Resolve rather than compete with them;
- professional finishing remains in a familiar environment.

Costs:

- product value partly depends on Resolve integration quality;
- some desired operations may be constrained by Resolve APIs;
- the user works across Salai and Resolve rather than in one monolithic application.
