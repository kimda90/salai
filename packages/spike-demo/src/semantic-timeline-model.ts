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

export type SemanticTimelineInsertionContext = {
  sectionId?: string;
  beatId?: string;
  cueId?: string;
  label: string;
};

const TRACKS_BY_ZOOM: Record<SemanticTimelineZoom, readonly string[]> = {
  story: ["semantic-sections", "semantic-beats"],
  moments: ["semantic-beats", "semantic-cues"],
  media: ["semantic-cues", "visual-content", "visual-realization", "source-audio"],
};

export function filterTimelineDocumentForZoom(
  document: TimelineEditorDocument<Record<string, never>, TimelineEditorSalaiData>,
  zoom: SemanticTimelineZoom,
): TimelineEditorDocument<Record<string, never>, TimelineEditorSalaiData> {
  const visibleTrackIds = new Set(TRACKS_BY_ZOOM[zoom]);
  return {
    ...document,
    tracks: document.tracks.filter(
      (track) =>
        visibleTrackIds.has(track.id) ||
        (zoom === "media" && (track.id.startsWith("visual-content:") || track.id.startsWith("source-audio:"))),
    ),
  };
}

function allItems(projection: SalaiTimelineProjection): SalaiTimelineItem[] {
  return projection.tracks.flatMap((track) => track.items);
}

export function filterTimelineDocumentForExpansion(
  document: TimelineEditorDocument<Record<string, never>, TimelineEditorSalaiData>,
  collapsedIds: ReadonlySet<string>,
): TimelineEditorDocument<Record<string, never>, TimelineEditorSalaiData> {
  return {
    ...document,
    tracks: document.tracks.map((track) => ({
      ...track,
      items: track.items.filter((item) => {
        const data = item.data;
        if (!data) return true;
        if (data.salaiKind === "section") return true;
        if (data.sectionId && collapsedIds.has(`section:${data.sectionId}`)) return false;
        if (data.salaiKind === "beat") return !data.beatId || !collapsedIds.has(`beat:${data.beatId}`);
        if (data.beatId && collapsedIds.has(`beat:${data.beatId}`)) return false;
        if (data.salaiKind === "cue") return true;
        return !data.cueId || !collapsedIds.has(`cue:${data.cueId}`);
      }),
    })),
  };
}

function canonicalRefType(
  type: SalaiTimelineItem["salaiRef"]["type"],
): CanonicalSelection["type"] | null {
  return type === "section" || type === "beat" || type === "cue" || type === "block"
    ? type
    : null;
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

  if (selection.type === "block") {
    const block = projectedItems.find(
      (item) => item.salaiRef.type === "block" && item.salaiRef.id === selection.id,
    );
    const ancestorCue = block?.cueId
      ? visibleItems.find(
          (item) => item.data?.salaiRef.type === "cue" && item.data.salaiRef.id === block.cueId,
        )
      : undefined;
    if (ancestorCue) return { itemIds: [ancestorCue.id], anchorItemId: ancestorCue.id };
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

function containsTime(item: SalaiTimelineItem, timeMs: number): boolean {
  return timeMs >= item.startMs && timeMs < item.startMs + Math.max(item.durationMs, 1);
}

export function resolveSemanticInsertionContext(
  projection: SalaiTimelineProjection,
  currentTimeMs: number,
  selection: CanonicalSelection | null,
): SemanticTimelineInsertionContext | null {
  const items = allItems(projection);
  if (selection?.type === "section") {
    return { sectionId: selection.id, label: `Section ${selection.id}` };
  }
  if (selection?.type === "beat") {
    const beat = items.find((item) => item.salaiRef.type === "beat" && item.salaiRef.id === selection.id);
    return beat?.sectionId
      ? { sectionId: beat.sectionId, beatId: selection.id, label: `Beat ${selection.id}` }
      : null;
  }
  if (selection?.type === "cue" || selection?.type === "block") {
    const selected = items.find(
      (item) => item.salaiRef.type === selection.type && item.salaiRef.id === selection.id,
    );
    const cueId = selection.type === "cue" ? selection.id : selected?.cueId;
    const cue = items.find((item) => item.salaiRef.type === "cue" && item.salaiRef.id === cueId);
    return cue?.sectionId && cue.beatId && cue.cueId
      ? { sectionId: cue.sectionId, beatId: cue.beatId, cueId: cue.cueId, label: `Cue ${cue.cueId}` }
      : null;
  }

  const atPlayhead = items.filter((item) => containsTime(item, currentTimeMs)).sort((a, b) => {
    const depth = (item: SalaiTimelineItem) =>
      item.kind === "section" ? 0 : item.kind === "beat" ? 1 : item.kind === "cue" ? 2 : 3;
    return depth(b) - depth(a);
  });
  const item = atPlayhead[0];
  if (!item?.sectionId) return null;
  if (item.cueId && item.beatId) {
    return {
      sectionId: item.sectionId,
      beatId: item.beatId,
      cueId: item.cueId,
      label: `Cue ${item.cueId} at playhead`,
    };
  }
  if (item.beatId) return { sectionId: item.sectionId, beatId: item.beatId, label: `Beat ${item.beatId} at playhead` };
  return { sectionId: item.sectionId, label: `Section ${item.sectionId} at playhead` };
}

export function semanticTimelineSummary(projection: SalaiTimelineProjection) {
  const items = allItems(projection);
  return {
    sections: items.filter((item) => item.kind === "section").length,
    beats: items.filter((item) => item.kind === "beat").length,
    cues: items.filter((item) => item.kind === "cue").length,
    visualMedia: items.filter((item) => item.kind === "visual-media").length,
    visualBlocks: items.filter((item) => ["visual-description", "on-screen-text", "graphic"].includes(item.kind)).length,
    audioBlocks: items.filter((item) => ["authored-speech", "source-excerpt", "music", "sfx"].includes(item.kind)).length,
    sourceExcerpts: items.filter((item) => item.kind === "source-excerpt").length,
    missingVisuals: items.filter((item) => item.kind === "missing-visual").length,
  };
}
