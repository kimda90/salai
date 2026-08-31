import type { NarrativeOperation } from "@salai/script-model";
import type { SalaiProjectService } from "../controller";
import type {
  AuthoringAdapter,
  AuthoringRequest,
  AuthoringResult,
} from "./contract";

const OPERATION_NAMES = new Set<NarrativeOperation["op"]>([
  "createSection",
  "createScene",
  "createBeat",
  "createCue",
  "createBlock",
  "updateSection",
  "updateScene",
  "updateBeat",
  "updateCue",
  "updateBlock",
  "moveSection",
  "moveScene",
  "moveBeat",
  "moveCue",
  "moveBlock",
  "splitBeat",
  "mergeBeats",
  "deleteSection",
  "deleteScene",
  "deleteBeat",
  "deleteCue",
  "deleteBlock",
  "linkShotIntent",
  "unlinkShotIntent",
  "linkMediaSegment",
  "unlinkMediaSegment",
  "trimSourceExcerpt",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseOperation(value: unknown): NarrativeOperation {
  if (!isRecord(value) || typeof value.op !== "string" || !OPERATION_NAMES.has(value.op as NarrativeOperation["op"])) {
    throw new Error("Authoring result contains an unknown narrative operation");
  }

  // Structural field validation remains owned by @salai/script-model. This layer only
  // validates the provider-facing envelope and known operation vocabulary.
  return value as NarrativeOperation;
}

export function parseAuthoringResult(value: unknown): AuthoringResult {
  if (!isRecord(value) || typeof value.summary !== "string") {
    throw new Error("Authoring result must contain a string summary");
  }
  if (value.answer !== undefined && typeof value.answer !== "string") {
    throw new Error("Authoring result answer must be a string when present");
  }
  if (value.operations !== undefined && !Array.isArray(value.operations)) {
    throw new Error("Authoring result operations must be an array when present");
  }

  return {
    summary: value.summary,
    ...(value.answer === undefined ? {} : { answer: value.answer }),
    ...(value.operations === undefined
      ? {}
      : { operations: value.operations.map(parseOperation) }),
  };
}

export type AuthoringExecution = {
  request: AuthoringRequest;
  result: AuthoringResult;
  applied: boolean;
};

export async function runAuthoringTurn(
  service: SalaiProjectService,
  adapter: AuthoringAdapter,
  instruction: string,
): Promise<AuthoringExecution> {
  const normalizedInstruction = instruction.trim();
  if (!normalizedInstruction) throw new Error("Enter an authoring instruction first");

  const request: AuthoringRequest = {
    instruction: normalizedInstruction,
    context: service.getProjectContext({ includeActiveSurface: true }),
  };
  const result = parseAuthoringResult(await adapter.run(request));
  const operations = result.operations ?? [];

  if (operations.length > 0 && !service.dispatchNarrativeBatch(operations)) {
    throw new Error(
      service.getSnapshot().feedback.error ?? "Narrative changes were rejected",
    );
  }

  return { request, result, applied: operations.length > 0 };
}
