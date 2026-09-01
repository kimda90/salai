import type { Clip, Project, Track } from "@elah/core";
import type { FixtureMediaSource } from "./semantic-editorial-fixture";
import type { SalaiTimelineProjection } from "./timeline-projection";

export type ElahMaterializationOptions = {
  fps?: number;
  stage?: { width: number; height: number };
};

function msToFrames(ms: number, fps: number): number {
  return Math.max(0, Math.round((ms / 1_000) * fps));
}

function durationToFrames(ms: number, fps: number): number {
  return Math.max(1, msToFrames(ms, fps));
}

function createTrack(id: string, name: string, kind: Track["kind"], order: number): Track {
  return {
    id,
    name,
    kind,
    order,
    height: 72,
    locked: false,
    disabled: false,
    muted: false,
    solo: false,
    volume: 1,
  };
}

export function toElahProject(
  projection: SalaiTimelineProjection,
  mediaSources: Readonly<Record<string, FixtureMediaSource>>,
  options: ElahMaterializationOptions = {},
): Project {
  const fps = options.fps ?? 30;
  const visualTrack = createTrack("salai-visual", "Salai visual", "video", 0);
  const audioTrack = createTrack("salai-audio", "Salai source audio", "audio", 1);
  const clips: Record<string, Clip[]> = {
    [visualTrack.id]: [],
    [audioTrack.id]: [],
  };

  for (const track of projection.tracks) {
    for (const item of track.items) {
      if (!item.mediaSegmentId) continue;
      const source = mediaSources[item.mediaSegmentId];
      if (!source) continue;

      if (item.kind === "visual-media" && source.kind !== "audio") {
        const sourceStartMs = item.sourceInMs ?? 0;
        const sourceDurationMs = Math.max(
          1,
          (item.sourceOutMs ?? sourceStartMs + item.durationMs) - sourceStartMs,
        );
        clips[visualTrack.id]!.push({
          id: `elah:${item.id}`,
          trackId: visualTrack.id,
          type: source.kind,
          name: item.label,
          startFrame: msToFrames(item.startMs, fps),
          durationFrames: durationToFrames(item.durationMs, fps),
          sourceStartFrame: msToFrames(sourceStartMs, fps),
          sourceDurationFrames: durationToFrames(sourceDurationMs, fps),
          src: source.src,
          volume: 1,
          opacity: 1,
        });
      }

      if (item.kind === "source-excerpt" && source.kind === "audio") {
        const sourceStartMs = item.sourceInMs ?? 0;
        const sourceDurationMs = Math.max(
          1,
          (item.sourceOutMs ?? sourceStartMs + item.durationMs) - sourceStartMs,
        );
        clips[audioTrack.id]!.push({
          id: `elah:${item.id}`,
          trackId: audioTrack.id,
          type: "audio",
          name: item.label,
          startFrame: msToFrames(item.startMs, fps),
          durationFrames: durationToFrames(item.durationMs, fps),
          sourceStartFrame: msToFrames(sourceStartMs, fps),
          sourceDurationFrames: durationToFrames(sourceDurationMs, fps),
          src: source.src,
          volume: 1,
          opacity: 1,
        });
      }
    }
  }

  for (const trackClips of Object.values(clips)) {
    trackClips.sort((a, b) => a.startFrame - b.startFrame || a.id.localeCompare(b.id));
  }

  return {
    id: `elah:${projection.scriptId}`,
    fps,
    stage: options.stage ?? { width: 1_920, height: 1_080 },
    tracks: [visualTrack, audioTrack],
    clips,
    transitions: [],
    version: 1,
    masterVolume: 1,
  };
}
