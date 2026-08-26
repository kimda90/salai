import {
  DomainOperationError,
  applyOperation as applyRawOperation,
  type DomainWarning,
  type NarrativeOperation,
  type OperationResult,
  type ParentRef,
  type RelationshipEffect,
  type SplitRelationshipAssignment,
} from "./operations.js";
import type { NarrativeProject } from "./types.js";

export {
  DomainOperationError,
  type DomainWarning,
  type NarrativeOperation,
  type OperationResult,
  type ParentRef,
  type RelationshipEffect,
  type SplitRelationshipAssignment,
};

function normalizePatchOperation(
  project: NarrativeProject,
  operation: NarrativeOperation,
): NarrativeOperation {
  switch (operation.op) {
    case "updateSection": {
      if ("title" in operation) return operation;
      const current = project.sections[operation.sectionId];
      if (current === undefined) return operation;
      return { ...operation, title: current.title };
    }
    case "updateScene": {
      if ("title" in operation) return operation;
      const current = project.scenes[operation.sceneId];
      if (current === undefined) return operation;
      return { ...operation, title: current.title };
    }
    case "updateBeat": {
      const current = project.beats[operation.beatId];
      if (current === undefined) return operation;
      return {
        ...operation,
        ...( "title" in operation ? {} : { title: current.title }),
        ...( "summary" in operation ? {} : { summary: current.summary }),
      };
    }
    case "updateCue": {
      if ("explicitDurationMs" in operation) return operation;
      const current = project.cues[operation.cueId];
      if (current === undefined) return operation;
      return { ...operation, explicitDurationMs: current.explicitDurationMs };
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
  const changedIds = new Set<string>();
  const createdIds = new Set<string>();
  const removedIds = new Set<string>();
  const relationshipEffects: RelationshipEffect[] = [];
  const warnings: DomainWarning[] = [];
  let mergedBeatIds: string[] | undefined;

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
