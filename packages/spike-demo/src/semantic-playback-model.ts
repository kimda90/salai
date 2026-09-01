import { resolveTimeline, type Project, type Scene } from "@elah/core";
import type {
  SalaiTimelineItem,
  SalaiTimelineProjection,
} from "./timeline-projection";

export type ResolvedSemanticAssembly = {
  frame: number;
  timeMs: number;
  scene: Scene;
  cue: SalaiTimelineItem | null;
  missingVisual: SalaiTimelineItem | null;
};

function itemAtTime(
  projection: SalaiTimelineProjection,
  kind: SalaiTimelineItem["kind"],
  timeMs: number,
): SalaiTimelineItem | null {
  return (
    projection.tracks
      .flatMap((track) => track.items)
      .find(
        (item) =>
          item.kind === kind &&
          timeMs >= item.startMs &&
          timeMs < item.startMs + item.durationMs,
      ) ?? null
  );
}

export function resolveSemanticAssemblyAtMs(
  projection: SalaiTimelineProjection,
  project: Project,
  requestedTimeMs: number,
): ResolvedSemanticAssembly {
  const clampedTimeMs = Math.max(
    0,
    Math.min(requestedTimeMs, Math.max(0, projection.durationMs - 1)),
  );
  const frame = Math.floor((clampedTimeMs / 1_000) * project.fps);

  return {
    frame,
    timeMs: clampedTimeMs,
    scene: resolveTimeline(frame, project),
    cue: itemAtTime(projection, "cue", clampedTimeMs),
    missingVisual: itemAtTime(projection, "missing-visual", clampedTimeMs),
  };
}

export function totalAssemblyFrames(
  projection: SalaiTimelineProjection,
  fps: number,
): number {
  return Math.max(1, Math.ceil((projection.durationMs / 1_000) * fps));
}
