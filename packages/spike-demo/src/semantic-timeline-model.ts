import type {
  TimelineEditorDocument,
  TimelineEditorSelection,
} from "@moritzbrantner/timeline-editor/core";
import type { CanonicalSelection } from "./controller";
import type { TimelineEditorSalaiData } from "./timeline-editor-adapter";
import type {
  SalaiTimelineItem,
  SalaiTimelineProjection,
} from "./timeline-projection";

export type SemanticTimelineZoom = "story" | "moments" | "media";

const TRACKS_BY_ZOOM: Record<SemanticTimelineZoom, readonly string[]> = {
  story: ["semantic-sections", "semantic-beats"],
  moments: ["semantic-beats", "semantic-cues"],
  media: ["semantic-cues", "visual-realization", "source-audio"],
};

export function filterTimelineDocumentForZoom(
  document: TimelineEditorDocument<Record<string, never>, TimelineEditorSalaiData>,
  zoom: SemanticTimelineZoom,
): TimelineEditorDocument<Record<string, never>, TimelineEditorSalaiData> {
  const visibleTrackIds = new Set(TRACKS_BY_ZOOM[zoom]);
  return {
    ...document,
    tracks: document.tracks.filter((track) => visibleTrackIds.has(track.id)),
  };
}

function allItems(projection: SalaiTimelineProjection): SalaiTimelineItem[] {
  return projection.tracks.flatMap((track) => track.items);
}

function canonicalRefType(
  type: SalaiTimelineItem["salaiRef"]["type"],
): CanonicalSelection["type"] | null {
  return type === "section" || type === "beat" || type === "cue" ? type : null;
}

export function canonicalSelectionFromTimelineSelection(
  document: TimelineEditorDocument<Record<string, never>, TimelineEditorSalaiData>,
  selection: TimelineEditorSelection,
): CanonicalSelection | null {
  const selectedId = selection.anchorItemId ?? selection.itemIds[0];
  if (!selectedId) return null;

  const item = document.tracks
    .flatMap((track) => track.items)
    .find((candidate) => candidate.id === selectedId);
  if (!item?.data) return null;

  const directType = canonicalRefType(item.data.salaiRef.type);
  if (directType) {
    return { type: directType, id: item.data.salaiRef.id };
  }

  return item.data.cueId ? { type: "cue", id: item.data.cueId } : null;
}

export function timelineSelectionForCanonical(
  projection: SalaiTimelineProjection,
  document: TimelineEditorDocument<Record<string, never>, TimelineEditorSalaiData>,
  selection: CanonicalSelection | null,
): TimelineEditorSelection {
  if (!selection) return { itemIds: [] };

  const visibleItems = document.tracks.flatMap((track) => track.items);
  const exact = visibleItems.find(
    (item) =>
      item.data?.salaiRef.type === selection.type &&
      item.data.salaiRef.id === selection.id,
  );
  if (exact) return { itemIds: [exact.id], anchorItemId: exact.id };

  const projectedItems = allItems(projection);

  if (selection.type === "cue") {
    const cue = projectedItems.find(
      (item) => item.kind === "cue" && item.salaiRef.id === selection.id,
    );
    const ancestorBeat = cue?.beatId
      ? visibleItems.find(
          (item) =>
            item.data?.salaiRef.type === "beat" &&
            item.data.salaiRef.id === cue.beatId,
        )
      : undefined;
    if (ancestorBeat) {
      return { itemIds: [ancestorBeat.id], anchorItemId: ancestorBeat.id };
    }
  }

  if (selection.type === "beat") {
    const descendant = visibleItems.find((item) => item.data?.beatId === selection.id);
    if (descendant) {
      return { itemIds: [descendant.id], anchorItemId: descendant.id };
    }
  }

  if (selection.type === "section") {
    const descendant = visibleItems.find((item) => item.data?.sectionId === selection.id);
    if (descendant) {
      return { itemIds: [descendant.id], anchorItemId: descendant.id };
    }
  }

  return { itemIds: [] };
}

export function semanticTimelineSummary(projection: SalaiTimelineProjection) {
  const items = allItems(projection);
  return {
    sections: items.filter((item) => item.kind === "section").length,
    beats: items.filter((item) => item.kind === "beat").length,
    cues: items.filter((item) => item.kind === "cue").length,
    visualMedia: items.filter((item) => item.kind === "visual-media").length,
    sourceExcerpts: items.filter((item) => item.kind === "source-excerpt").length,
    missingVisuals: items.filter((item) => item.kind === "missing-visual").length,
  };
}
