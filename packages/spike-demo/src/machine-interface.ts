import type { NarrativeOperation } from "@salai/script-model";
import type { SalaiProjectService } from "./controller";

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

export type MachineCommand =
  | { command: "context" }
  | { command: "apply"; payload: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseNarrativeOperationBatch(value: unknown): NarrativeOperation[] {
  if (!Array.isArray(value)) throw new Error("apply payload must be an operation array");

  return value.map((operation) => {
    if (
      !isRecord(operation) ||
      typeof operation.op !== "string" ||
      !OPERATION_NAMES.has(operation.op as NarrativeOperation["op"])
    ) {
      throw new Error("apply payload contains an unknown narrative operation");
    }
    return operation as NarrativeOperation;
  });
}

export function handleMachineCommand(
  service: SalaiProjectService,
  command: MachineCommand,
): unknown {
  if (command.command === "context") {
    return service.getProjectContext({
      includeWorkspace: true,
      includeActiveSurface: true,
    });
  }

  const operations = parseNarrativeOperationBatch(command.payload);
  if (!service.dispatchNarrativeBatch(operations)) {
    throw new Error(service.getSnapshot().feedback.error ?? "Narrative changes were rejected");
  }

  return { feedback: service.getSnapshot().feedback };
}
