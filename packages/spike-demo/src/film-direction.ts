import type { NarrativeOperation, NarrativeProject } from "@salai/script-model";
import { blockDisplayText } from "./content-utils";
import type { CanonicalSelection } from "./controller";
import { orderedBeatRefs } from "./model-utils";

export type DirectionTarget = CanonicalSelection | { type: "script" | "shot-intent"; id: string };

export type DirectionNote = {
  id: string;
  text: string;
  target: DirectionTarget;
  targetLabel: string;
  projectRevision: number;
  submittedProject: NarrativeProject;
  playheadMs: number;
};

export type DirectionProposalInput = {
  noteId: string;
  baseRevision: number;
  summary: string;
  operations: NarrativeOperation[];
};

export type ProjectChange = {
  id: string;
  label: string;
  kind: "added" | "removed" | "changed";
  fields: { label: string; before: string; after: string }[];
};

export type DirectionReview = {
  note: DirectionNote;
  status: "waiting" | "proposed" | "applied" | "dismissed" | "reverted";
  proposal?: DirectionProposalInput & { id: string; changes: ProjectChange[]; warnings: string[] };
  appliedRevision?: number;
};

export function directionTargetExists(project: NarrativeProject, target: DirectionTarget): boolean {
  switch (target.type) {
    case "script": return project.script.id === target.id;
    case "section": return Object.hasOwn(project.sections, target.id);
    case "scene": return Object.hasOwn(project.scenes, target.id);
    case "beat": return Object.hasOwn(project.beats, target.id);
    case "cue": return Object.hasOwn(project.cues, target.id);
    case "block": return Object.hasOwn(project.blocks, target.id);
    case "shot-intent": return Object.hasOwn(project.shotIntents, target.id);
    default: return false;
  }
}

export function narrativeLabel(project: NarrativeProject, id: string): string {
  if (id === project.script.id) return project.script.title ?? "Untitled story";
  const titled = project.sections[id] ?? project.scenes[id] ?? project.beats[id];
  if (titled) return titled.title ?? id;
  const block = project.blocks[id];
  if (block) return blockDisplayText(block);
  const cue = project.cues[id];
  if (cue) {
    const first = [...cue.visualBlockIds, ...cue.audioBlockIds].map((blockId) => project.blocks[blockId]).find(Boolean);
    return first ? blockDisplayText(first) : "Empty moment";
  }
  return project.shotIntents[id]?.description ?? project.mediaSegments[id]?.assetId ?? id;
}

export function filmMoments(project: NarrativeProject) {
  return orderedBeatRefs(project).flatMap((ref) => project.beats[ref.beatId]!.cueIds.map((cueId) => ({
    ...ref,
    cueId,
    label: narrativeLabel(project, cueId),
    shotIntents: Object.values(project.relationships)
      .filter((link) => link.type === "requires_shot_intent" && [cueId, ref.beatId].includes(link.sourceId))
      .map((link) => project.shotIntents[link.targetId]!)
      .filter((shot, index, values) => shot && values.findIndex((value) => value?.id === shot.id) === index),
  })));
}

function records(project: NarrativeProject): Record<string, Record<string, unknown>> {
  return {
    [project.script.id]: project.script,
    ...project.sections, ...project.scenes, ...project.beats, ...project.cues,
    ...project.blocks, ...project.relationships, ...project.mediaSegments, ...project.shotIntents,
  };
}

const FIELD_LABELS: Record<string, string> = {
  title: "Title", summary: "Narrative intent", text: "Text", description: "Direction",
  explicitDurationMs: "Duration", targetDurationMs: "Target duration",
  sectionIds: "Sequence order", childIds: "Scene and beat order", beatIds: "Beat order", cueIds: "Moment order",
  visualBlockIds: "Visual content", audioBlockIds: "Audio content",
  sourceInMs: "Source in", sourceOutMs: "Source out", transcriptSnapshot: "Source transcript",
  transcript: "Recording transcript", role: "Speech role", type: "Type", sourceId: "From", targetId: "To",
  assetId: "Media identity", mediaSegmentId: "Source recording",
};

function fieldValue(project: NarrativeProject, key: string, value: unknown): string {
  if (value === undefined) return "Not set";
  if (key.endsWith("Ms") && typeof value === "number") return `${value / 1000} s`;
  if (Array.isArray(value)) return value.length ? value.map((id) => narrativeLabel(project, String(id))).join(" → ") : "None";
  if (["sourceId", "targetId", "mediaSegmentId"].includes(key) && typeof value === "string") return narrativeLabel(project, value);
  return typeof value === "string" ? value : JSON.stringify(value);
}

export function describeProjectChanges(before: NarrativeProject, after: NarrativeProject): ProjectChange[] {
  const previous = records(before);
  const next = records(after);
  return [...new Set([...Object.keys(previous), ...Object.keys(next)])].flatMap((id) => {
    const left = previous[id];
    const right = next[id];
    const fields = [...new Set([...Object.keys(left ?? {}), ...Object.keys(right ?? {})])]
      .filter((key) => key !== "id" && JSON.stringify(left?.[key]) !== JSON.stringify(right?.[key]))
      .map((key) => ({ label: FIELD_LABELS[key] ?? key, before: fieldValue(before, key, left?.[key]), after: fieldValue(after, key, right?.[key]) }));
    if (left && right && !fields.length) return [];
    return [{
      id,
      label: narrativeLabel(left ? before : after, id),
      kind: !left ? "added" as const : !right ? "removed" as const : "changed" as const,
      fields,
    }];
  });
}
