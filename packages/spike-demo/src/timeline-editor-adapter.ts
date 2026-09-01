import type { TimelineEditorDocument } from "@moritzbrantner/timeline-editor/core";
import type {
  SalaiTimelineItem,
  SalaiTimelineProjection,
} from "./timeline-projection";

export type TimelineEditorSalaiData = {
  salaiRef: SalaiTimelineItem["salaiRef"];
  salaiKind: SalaiTimelineItem["kind"];
  sectionId?: string;
  beatId?: string;
  cueId?: string;
  mediaSegmentId?: string;
  sourceInMs?: number;
  sourceOutMs?: number;
};

function colorForKind(kind: SalaiTimelineItem["kind"]): string {
  switch (kind) {
    case "section":
      return "#4b5563";
    case "beat":
      return "#475569";
    case "cue":
      return "#0369a1";
    case "visual-media":
      return "#0f766e";
    case "source-excerpt":
      return "#7c3aed";
    case "missing-visual":
      return "#b45309";
  }
}

export function toTimelineEditorDocument(
  projection: SalaiTimelineProjection,
): TimelineEditorDocument<Record<string, never>, TimelineEditorSalaiData> {
  return {
    durationMs: projection.durationMs,
    currentTimeMs: 0,
    tracks: projection.tracks.map((track) => ({
      id: track.id,
      label: track.label,
      kind: track.kind,
      items: track.items.map((item) => ({
        id: item.id,
        trackId: track.id,
        label: item.label,
        startMs: item.startMs,
        durationMs: item.durationMs,
        kind: item.kind,
        color: colorForKind(item.kind),
        locked: item.kind === "section",
        data: {
          salaiRef: item.salaiRef,
          salaiKind: item.kind,
          ...(item.sectionId ? { sectionId: item.sectionId } : {}),
          ...(item.beatId ? { beatId: item.beatId } : {}),
          ...(item.cueId ? { cueId: item.cueId } : {}),
          ...(item.mediaSegmentId ? { mediaSegmentId: item.mediaSegmentId } : {}),
          ...(item.sourceInMs !== undefined ? { sourceInMs: item.sourceInMs } : {}),
          ...(item.sourceOutMs !== undefined ? { sourceOutMs: item.sourceOutMs } : {}),
        },
      })),
    })),
  };
}
