import type { NarrativeProject } from "./types.js";
import { assertValidNarrativeProject } from "./validation.js";

export function serializeNarrativeProject(project: NarrativeProject): string {
  assertValidNarrativeProject(project);
  return JSON.stringify(project, null, 2);
}

export function deserializeNarrativeProject(serialized: string): NarrativeProject {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid NarrativeProject JSON: ${message}`);
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Invalid NarrativeProject JSON: expected an object");
  }

  const candidate = parsed as Partial<NarrativeProject>;
  if (
    candidate.script === undefined ||
    candidate.sections === undefined ||
    candidate.scenes === undefined ||
    candidate.beats === undefined ||
    candidate.cues === undefined ||
    candidate.blocks === undefined ||
    candidate.relationships === undefined ||
    candidate.mediaSegments === undefined ||
    candidate.shotIntents === undefined ||
    candidate.schemaVersion === undefined
  ) {
    throw new Error("Invalid NarrativeProject JSON: missing required top-level fields");
  }

  const project = candidate as NarrativeProject;
  assertValidNarrativeProject(project);
  return project;
}
