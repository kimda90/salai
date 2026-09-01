import type { TimelineEditorDocument } from "@moritzbrantner/timeline-editor/core";
import type {
  SalaiTimelineItem,
  SalaiTimelineProjection,
} from "./timeline-projection";

export type TimelineEditorSalaiData = {
  salaiRef: SalaiTimelineItem["salaiRef"];
  salaiKind: SalaiTimelineItem["kind"];
  cueId?: string;
  mediaSegmentId?: string;
  sourceInMs?: number;
  sourceOutMs?: number;
};

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
        locked: item.kind === "section",
        data: {
          salaiRef: item.salaiRef,
          salaiKind: item.kind,
          ...(item.cueId ? { cueId: item.cueId } : {}),
          ...(item.mediaSegmentId ? { mediaSegmentId: item.mediaSegmentId } : {}),
          ...(item.sourceInMs !== undefined ? { sourceInMs: item.sourceInMs } : {}),
          ...(item.sourceOutMs !== undefined ? { sourceOutMs: item.sourceOutMs } : {}),
        },
      })),
    })),
  };
}
