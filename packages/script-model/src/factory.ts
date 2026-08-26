import type { Id, NarrativeProject } from "./types.js";

export type CreateEmptyProjectInput = {
  scriptId: Id;
  title?: string;
  targetDurationMs?: number;
  schemaVersion?: number;
};

export function createEmptyNarrativeProject(
  input: CreateEmptyProjectInput,
): NarrativeProject {
  return {
    schemaVersion: input.schemaVersion ?? 1,
    script: {
      id: input.scriptId,
      ...(input.title === undefined ? {} : { title: input.title }),
      ...(input.targetDurationMs === undefined
        ? {}
        : { targetDurationMs: input.targetDurationMs }),
      sectionIds: [],
    },
    sections: {},
    scenes: {},
    beats: {},
    cues: {},
    blocks: {},
    relationships: {},
    mediaSegments: {},
    shotIntents: {},
  };
}
