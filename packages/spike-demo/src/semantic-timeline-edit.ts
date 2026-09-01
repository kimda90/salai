import type {
  TimelineEditorDocument,
  TimelineEditorItem,
} from "@moritzbrantner/timeline-editor/core";
import type {
  NarrativeOperation,
  NarrativeProject,
  ParentRef,
} from "@salai/script-model";
import type { TimelineEditorSalaiData } from "./timeline-editor-adapter";

export type SemanticTimelineDocument = TimelineEditorDocument<
  Record<string, never>,
  TimelineEditorSalaiData
>;

export type SemanticTimelineEditInterpretation =
  | { kind: "noop" }
  | { kind: "rejected"; reason: string }
  | {
      kind: "canonical";
      operations: NarrativeOperation[];
      summary: string;
    };

type SalaiTimelineEditorItem = TimelineEditorItem<TimelineEditorSalaiData>;

const EPSILON_MS = 1;

function nearlyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) <= EPSILON_MS;
}

function flattenItems(document: SemanticTimelineDocument): SalaiTimelineEditorItem[] {
  return document.tracks.flatMap((track) => track.items);
}

function itemMap(document: SemanticTimelineDocument): Map<string, SalaiTimelineEditorItem> {
  return new Map(flattenItems(document).map((item) => [item.id, item]));
}

function itemShapeChanged(
  current: SalaiTimelineEditorItem,
  proposed: SalaiTimelineEditorItem,
): boolean {
  return (
    current.trackId !== proposed.trackId ||
    current.label !== proposed.label ||
    current.kind !== proposed.kind ||
    current.locked !== proposed.locked ||
    current.color !== proposed.color ||
    JSON.stringify(current.data) !== JSON.stringify(proposed.data)
  );
}

function temporalChanged(
  current: SalaiTimelineEditorItem,
  proposed: SalaiTimelineEditorItem,
): boolean {
  return (
    !nearlyEqual(current.startMs, proposed.startMs) ||
    !nearlyEqual(current.durationMs, proposed.durationMs)
  );
}

function findBeatParent(project: NarrativeProject, beatId: string): ParentRef | null {
  for (const section of Object.values(project.sections)) {
    if (section.childIds.includes(beatId)) return { type: "section", id: section.id };
  }
  for (const scene of Object.values(project.scenes)) {
    if (scene.beatIds.includes(beatId)) return { type: "scene", id: scene.id };
  }
  return null;
}

function beatSiblingIds(project: NarrativeProject, parent: ParentRef): string[] | null {
  if (parent.type === "scene") {
    return project.scenes[parent.id]?.beatIds ?? null;
  }

  const section = project.sections[parent.id];
  if (!section) return null;
  if (section.childIds.some((id) => project.scenes[id] !== undefined)) {
    return null;
  }
  return section.childIds;
}

function desiredIndexFromStart(
  siblingIds: readonly string[],
  movedId: string,
  proposedStartMs: number,
  currentItems: Map<string, SalaiTimelineEditorItem>,
  refType: "beat" | "cue",
): number | null {
  const ordered = siblingIds
    .map((id, canonicalIndex) => {
      const item = [...currentItems.values()].find(
        (candidate) =>
          candidate.data?.salaiRef.type === refType && candidate.data.salaiRef.id === id,
      );
      if (!item) return null;
      return {
        id,
        startMs: id === movedId ? proposedStartMs : item.startMs,
        canonicalIndex,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => a.startMs - b.startMs || a.canonicalIndex - b.canonicalIndex);

  if (ordered.length !== siblingIds.length) return null;
  return ordered.findIndex((item) => item.id === movedId);
}

function interpretBeatMove(
  project: NarrativeProject,
  current: SalaiTimelineEditorItem,
  proposed: SalaiTimelineEditorItem,
  currentItems: Map<string, SalaiTimelineEditorItem>,
): SemanticTimelineEditInterpretation {
  if (!nearlyEqual(current.durationMs, proposed.durationMs)) {
    return { kind: "rejected", reason: "Beat duration is derived; resize the underlying Cues instead." };
  }

  const beatId = current.data?.salaiRef.type === "beat" ? current.data.salaiRef.id : null;
  if (!beatId) return { kind: "rejected", reason: "Timeline Beat lost its Salai identity." };

  const parent = findBeatParent(project, beatId);
  if (!parent) return { kind: "rejected", reason: `Beat ${beatId} has no canonical parent.` };
  const siblings = beatSiblingIds(project, parent);
  if (!siblings) {
    return {
      kind: "rejected",
      reason: "Beat drag is intentionally limited to a simple Beat parent in this spike; mixed Scene/Beat sections stay canonical-only.",
    };
  }

  const toIndex = desiredIndexFromStart(siblings, beatId, proposed.startMs, currentItems, "beat");
  if (toIndex === null) return { kind: "rejected", reason: "Could not resolve Beat order from the semantic projection." };
  if (toIndex === siblings.indexOf(beatId)) return { kind: "noop" };

  return {
    kind: "canonical",
    operations: [{ op: "moveBeat", beatId, toParent: parent, toIndex }],
    summary: `Moved Beat ${beatId} to position ${toIndex + 1}`,
  };
}

function interpretCueMove(
  project: NarrativeProject,
  current: SalaiTimelineEditorItem,
  proposed: SalaiTimelineEditorItem,
  currentItems: Map<string, SalaiTimelineEditorItem>,
): SemanticTimelineEditInterpretation {
  if (!nearlyEqual(current.durationMs, proposed.durationMs)) {
    return {
      kind: "rejected",
      reason: "Cue duration is canonical meaning; this spike only changes it through a source-backed trim.",
    };
  }

  const cueId = current.data?.salaiRef.type === "cue" ? current.data.salaiRef.id : null;
  const beatId = current.data?.beatId;
  if (!cueId || !beatId) return { kind: "rejected", reason: "Timeline Cue lost its Salai ancestry." };
  const beat = project.beats[beatId];
  if (!beat || !beat.cueIds.includes(cueId)) {
    return { kind: "rejected", reason: `Cue ${cueId} is no longer in Beat ${beatId}.` };
  }

  const toIndex = desiredIndexFromStart(beat.cueIds, cueId, proposed.startMs, currentItems, "cue");
  if (toIndex === null) return { kind: "rejected", reason: "Could not resolve Cue order from the semantic projection." };
  if (toIndex === beat.cueIds.indexOf(cueId)) return { kind: "noop" };

  return {
    kind: "canonical",
    operations: [{ op: "moveCue", cueId, toBeatId: beatId, toIndex }],
    summary: `Moved Cue ${cueId} to position ${toIndex + 1}`,
  };
}

function interpretSourceTrim(
  project: NarrativeProject,
  current: SalaiTimelineEditorItem,
  proposed: SalaiTimelineEditorItem,
): SemanticTimelineEditInterpretation {
  const data = current.data;
  const blockId = data?.salaiRef.type === "block" ? data.salaiRef.id : null;
  const cueId = data?.cueId;
  const sourceInMs = data?.sourceInMs;
  const sourceOutMs = data?.sourceOutMs;
  if (!blockId || !cueId || sourceInMs === undefined || sourceOutMs === undefined) {
    return { kind: "rejected", reason: "SourceExcerpt lost its canonical source-range metadata." };
  }

  const block = project.blocks[blockId];
  if (!block || block.type !== "source_excerpt") {
    return { kind: "rejected", reason: `ContentBlock ${blockId} is not a SourceExcerpt.` };
  }

  const currentEndMs = current.startMs + current.durationMs;
  const proposedEndMs = proposed.startMs + proposed.durationMs;
  const startChanged = !nearlyEqual(current.startMs, proposed.startMs);
  const endChanged = !nearlyEqual(currentEndMs, proposedEndMs);

  if (startChanged === endChanged) {
    return {
      kind: "rejected",
      reason: startChanged
        ? "Moving a SourceExcerpt on the engine timeline is not canonical in this spike; trim one edge instead."
        : "SourceExcerpt gesture did not change a trim edge.",
    };
  }

  const nextSourceInMs = startChanged
    ? Math.round(sourceInMs + (proposed.startMs - current.startMs))
    : sourceInMs;
  const nextSourceOutMs = endChanged
    ? Math.round(sourceOutMs + (proposedEndMs - currentEndMs))
    : sourceOutMs;
  const nextDurationMs = Math.round(proposed.durationMs);

  if (nextSourceOutMs <= nextSourceInMs || nextDurationMs <= 0) {
    return { kind: "rejected", reason: "SourceExcerpt trim would produce an empty range." };
  }

  return {
    kind: "canonical",
    operations: [
      {
        op: "trimSourceExcerpt",
        blockId,
        sourceInMs: nextSourceInMs,
        sourceOutMs: nextSourceOutMs,
      },
      {
        op: "updateCue",
        cueId,
        explicitDurationMs: nextDurationMs,
      },
    ],
    summary: `Trimmed SourceExcerpt ${blockId} to ${nextSourceInMs}–${nextSourceOutMs} ms`,
  };
}

export function interpretSemanticTimelineDocumentChange(
  project: NarrativeProject,
  currentDocument: SemanticTimelineDocument,
  proposedDocument: SemanticTimelineDocument,
): SemanticTimelineEditInterpretation {
  if (currentDocument.tracks.length !== proposedDocument.tracks.length) {
    return { kind: "rejected", reason: "Timeline tracks are derived and cannot be added or removed." };
  }

  const currentItems = itemMap(currentDocument);
  const proposedItems = itemMap(proposedDocument);
  if (currentItems.size !== proposedItems.size) {
    return { kind: "rejected", reason: "Timeline items are derived; create/delete through Salai semantics." };
  }

  const changed: Array<{ current: SalaiTimelineEditorItem; proposed: SalaiTimelineEditorItem }> = [];
  for (const [id, current] of currentItems) {
    const proposed = proposedItems.get(id);
    if (!proposed) {
      return { kind: "rejected", reason: `Timeline item ${id} cannot be deleted outside Salai.` };
    }
    if (itemShapeChanged(current, proposed)) {
      return { kind: "rejected", reason: `Timeline item ${id} changed non-temporal engine state.` };
    }
    if (temporalChanged(current, proposed)) changed.push({ current, proposed });
  }

  if (changed.length === 0) return { kind: "noop" };
  if (changed.length > 1) {
    return {
      kind: "rejected",
      reason: "This spike accepts one semantic timeline gesture at a time; engine ripple/push edits are not project state.",
    };
  }

  const { current, proposed } = changed[0]!;
  switch (current.data?.salaiKind) {
    case "beat":
      return interpretBeatMove(project, current, proposed, currentItems);
    case "cue":
      return interpretCueMove(project, current, proposed, currentItems);
    case "source-excerpt":
      return interpretSourceTrim(project, current, proposed);
    case "section":
      return { kind: "rejected", reason: "Section timing is derived from its narrative contents." };
    case "visual-media":
      return { kind: "rejected", reason: "Media realization placement is derived from its Cue in Spike 0D." };
    case "missing-visual":
      return { kind: "rejected", reason: "Missing coverage is an explicit semantic gap, not a movable clip." };
    default:
      return { kind: "rejected", reason: "Unsupported timeline engine edit." };
  }
}
