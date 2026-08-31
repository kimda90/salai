import type { NarrativeOperation, NarrativeProject } from "@salai/script-model";
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

type CreateStoryBeat = {
  title?: string;
  summary?: string;
};

type CreateStoryPayload = {
  sectionTitle?: string;
  beats: CreateStoryBeat[];
};

export type MachineCommand =
  | { command: "context" }
  | { command: "apply"; payload: unknown }
  | { command: "createStory"; payload: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") throw new Error(`${key} must be a string`);
  return value;
}

function parseCreateStoryPayload(value: unknown): CreateStoryPayload {
  if (!isRecord(value) || !Array.isArray(value.beats) || value.beats.length === 0) {
    throw new Error("createStory payload must contain at least one Beat");
  }

  const sectionTitle = optionalString(value, "sectionTitle");
  return {
    ...(sectionTitle === undefined ? {} : { sectionTitle }),
    beats: value.beats.map((beat, index) => {
      if (!isRecord(beat)) throw new Error(`createStory Beat ${index + 1} must be an object`);
      const title = optionalString(beat, "title");
      const summary = optionalString(beat, "summary");
      return {
        ...(title === undefined ? {} : { title }),
        ...(summary === undefined ? {} : { summary }),
      };
    }),
  };
}

function projectIds(project: NarrativeProject): Set<string> {
  return new Set([
    project.script.id,
    ...Object.keys(project.sections),
    ...Object.keys(project.scenes),
    ...Object.keys(project.beats),
    ...Object.keys(project.cues),
    ...Object.keys(project.blocks),
    ...Object.keys(project.relationships),
    ...Object.keys(project.mediaSegments),
    ...Object.keys(project.shotIntents),
  ]);
}

function allocateId(prefix: string, usedIds: Set<string>): string {
  let index = 1;
  while (usedIds.has(`${prefix}-${index}`)) index += 1;
  const id = `${prefix}-${index}`;
  usedIds.add(id);
  return id;
}

export function compileCreateStoryOperations(
  project: NarrativeProject,
  payload: unknown,
): NarrativeOperation[] {
  if (project.script.sectionIds.length > 0) {
    throw new Error("createStory requires an empty story");
  }

  const input = parseCreateStoryPayload(payload);
  const usedIds = projectIds(project);
  const sectionId = allocateId("section-agent", usedIds);
  const operations: NarrativeOperation[] = [
    {
      op: "createSection",
      section: {
        id: sectionId,
        ...(input.sectionTitle === undefined ? {} : { title: input.sectionTitle }),
        childIds: [],
      },
    },
  ];

  for (const beat of input.beats) {
    const beatId = allocateId("beat-agent", usedIds);
    operations.push({
      op: "createBeat",
      beat: {
        id: beatId,
        ...(beat.title === undefined ? {} : { title: beat.title }),
        ...(beat.summary === undefined ? {} : { summary: beat.summary }),
        cueIds: [],
      },
      parent: { type: "section", id: sectionId },
    });
  }

  return operations;
}

export function parseNarrativeOperationBatch(value: unknown): NarrativeOperation[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("apply payload must be a non-empty operation array");
  }

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

function applyMachineBatch(
  service: SalaiProjectService,
  operations: readonly NarrativeOperation[],
): unknown {
  if (!service.dispatchNarrativeBatch(operations, { revertible: true })) {
    throw new Error(service.getSnapshot().feedback.error ?? "Narrative changes were rejected");
  }
  return { feedback: service.getSnapshot().feedback };
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

  if (command.command === "createStory") {
    return applyMachineBatch(
      service,
      compileCreateStoryOperations(service.getSnapshot().project, command.payload),
    );
  }

  return applyMachineBatch(service, parseNarrativeOperationBatch(command.payload));
}
