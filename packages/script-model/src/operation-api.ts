import {
  DomainOperationError,
  applyOperation as applyRawOperation,
  type DomainWarning,
  type NarrativeOperation as RawNarrativeOperation,
  type OperationResult,
  type ParentRef,
  type RelationshipEffect,
  type SplitRelationshipAssignment,
} from "./operations.js";
import type { Id, NarrativeProject } from "./types.js";

type NonPatchOperation = Exclude<
  RawNarrativeOperation,
  | { op: "updateSection" }
  | { op: "updateScene" }
  | { op: "updateBeat" }
  | { op: "updateCue" }
>;

export type NarrativeOperation =
  | NonPatchOperation
  | { op: "updateSection"; sectionId: Id; title?: string | null }
  | { op: "updateScene"; sceneId: Id; title?: string | null }
  | {
      op: "updateBeat";
      beatId: Id;
      title?: string | null;
      summary?: string | null;
    }
  | { op: "updateCue"; cueId: Id; explicitDurationMs?: number | null };

export {
  DomainOperationError,
  type DomainWarning,
  type OperationResult,
  type ParentRef,
  type RelationshipEffect,
  type SplitRelationshipAssignment,
};

function normalizePatchOperation(
  project: NarrativeProject,
  operation: NarrativeOperation,
): RawNarrativeOperation {
  switch (operation.op) {
    case "updateSection": {
      const current = project.sections[operation.sectionId];
      if (current === undefined) {
        return {
          op: "updateSection",
          sectionId: operation.sectionId,
          title: operation.title === null ? undefined : operation.title,
        };
      }
      return {
        op: "updateSection",
        sectionId: operation.sectionId,
        title:
          "title" in operation
            ? operation.title === null
              ? undefined
              : operation.title
            : current.title,
      };
    }
    case "updateScene": {
      const current = project.scenes[operation.sceneId];
      if (current === undefined) {
        return {
          op: "updateScene",
          sceneId: operation.sceneId,
          title: operation.title === null ? undefined : operation.title,
        };
      }
      return {
        op: "updateScene",
        sceneId: operation.sceneId,
        title:
          "title" in operation
            ? operation.title === null
              ? undefined
              : operation.title
            : current.title,
      };
    }
    case "updateBeat": {
      const current = project.beats[operation.beatId];
      if (current === undefined) {
        return {
          op: "updateBeat",
          beatId: operation.beatId,
          title: operation.title === null ? undefined : operation.title,
          summary: operation.summary === null ? undefined : operation.summary,
        };
      }
      return {
        op: "updateBeat",
        beatId: operation.beatId,
        title:
          "title" in operation
            ? operation.title === null
              ? undefined
              : operation.title
            : current.title,
        summary:
          "summary" in operation
            ? operation.summary === null
              ? undefined
              : operation.summary
            : current.summary,
      };
    }
    case "updateCue": {
      const current = project.cues[operation.cueId];
      return {
        op: "updateCue",
        cueId: operation.cueId,
        explicitDurationMs:
          "explicitDurationMs" in operation
            ? operation.explicitDurationMs
            : current?.explicitDurationMs,
      };
    }
    default:
      return operation;
  }
}

export function applyOperation(
  project: NarrativeProject,
  operation: NarrativeOperation,
): OperationResult {
  return applyRawOperation(project, normalizePatchOperation(project, operation));
}

export function applyOperations(
  input: NarrativeProject,
  operations: readonly NarrativeOperation[],
): OperationResult {
  let model = input;
  const changedIds = new Set<Id>();
  const createdIds = new Set<Id>();
  const removedIds = new Set<Id>();
  const relationshipEffects: RelationshipEffect[] = [];
  const warnings: DomainWarning[] = [];
  let mergedBeatIds: Id[] | undefined;

  for (const operation of operations) {
    const result = applyOperation(model, operation);
    model = result.model;
    result.changedIds.forEach((id) => changedIds.add(id));
    result.createdIds.forEach((id) => createdIds.add(id));
    result.removedIds.forEach((id) => removedIds.add(id));
    relationshipEffects.push(...result.relationshipEffects);
    warnings.push(...result.warnings);
    if (result.metadata?.mergedBeatIds !== undefined) {
      mergedBeatIds = [...(mergedBeatIds ?? []), ...result.metadata.mergedBeatIds];
    }
  }

  return {
    model,
    changedIds: [...changedIds],
    createdIds: [...createdIds],
    removedIds: [...removedIds],
    relationshipEffects,
    warnings,
    ...(mergedBeatIds === undefined ? {} : { metadata: { mergedBeatIds } }),
  };
}
