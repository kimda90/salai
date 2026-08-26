import { describe, expect, it } from "vitest";

import {
  assertValidNarrativeProject,
  createEmptyNarrativeProject,
  validateNarrativeProject,
  type NarrativeProject,
} from "./index.js";

function makeValidProject(): NarrativeProject {
  const project = createEmptyNarrativeProject({
    scriptId: "script-1",
    title: "Fixture",
    targetDurationMs: 30_000,
  });

  project.script.sectionIds.push("section-1");
  project.sections["section-1"] = {
    id: "section-1",
    title: "Main",
    childIds: ["beat-1", "scene-1"],
  };
  project.scenes["scene-1"] = {
    id: "scene-1",
    title: "Optional scene grouping",
    beatIds: ["beat-2"],
  };
  project.beats["beat-1"] = {
    id: "beat-1",
    summary: "Direct beat",
    cueIds: ["cue-1"],
  };
  project.beats["beat-2"] = {
    id: "beat-2",
    summary: "Scene beat",
    cueIds: ["cue-2"],
  };
  project.cues["cue-1"] = {
    id: "cue-1",
    visualBlockIds: ["visual-1"],
    audioBlockIds: ["speech-1"],
  };
  project.cues["cue-2"] = {
    id: "cue-2",
    visualBlockIds: [],
    audioBlockIds: ["source-1"],
  };
  project.blocks["visual-1"] = {
    id: "visual-1",
    type: "visual_description",
    text: "Wide product shot",
  };
  project.blocks["speech-1"] = {
    id: "speech-1",
    type: "authored_speech",
    role: "vo",
    text: "Installation takes seconds.",
  };
  project.blocks["source-1"] = {
    id: "source-1",
    type: "source_excerpt",
    mediaSegmentId: "media-1",
    sourceInMs: 2_000,
    sourceOutMs: 5_000,
    transcriptSnapshot: "Recorded interview excerpt",
  };
  project.mediaSegments["media-1"] = {
    id: "media-1",
    assetId: "asset-1",
    sourceInMs: 1_000,
    sourceOutMs: 8_000,
  };
  project.shotIntents["shot-1"] = {
    id: "shot-1",
    description: "Show completed installation",
  };
  project.relationships["rel-1"] = {
    id: "rel-1",
    sourceId: "beat-1",
    targetId: "shot-1",
    type: "requires_shot_intent",
  };
  project.relationships["rel-2"] = {
    id: "rel-2",
    sourceId: "source-1",
    targetId: "media-1",
    type: "source_excerpt_of",
  };

  return project;
}

describe("Narrative IR validation", () => {
  it("accepts a valid project, including a Section mixing a direct Beat and Scene", () => {
    const project = makeValidProject();

    expect(validateNarrativeProject(project)).toEqual({ valid: true, issues: [] });
    expect(() => assertValidNarrativeProject(project)).not.toThrow();
  });

  it("rejects dangling hierarchy references", () => {
    const project = makeValidProject();
    project.beats["beat-1"].cueIds.push("missing-cue");

    const result = validateNarrativeProject(project);

    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "dangling_reference",
          path: "beats.beat-1.cueIds[1]",
        }),
      ]),
    );
  });

  it("rejects global ID reuse across domain collections", () => {
    const project = makeValidProject();
    project.shotIntents["duplicate-key"] = {
      id: "beat-1",
      description: "Invalid duplicate ID",
    };

    const result = validateNarrativeProject(project);

    expect(result.valid).toBe(false);
    expect(result.issues.some((entry) => entry.code === "duplicate_id")).toBe(true);
  });

  it("rejects a SourceExcerpt outside its referenced MediaSegment", () => {
    const project = makeValidProject();
    const source = project.blocks["source-1"];
    if (source.type !== "source_excerpt") throw new Error("test fixture mismatch");
    source.sourceOutMs = 9_000;

    const result = validateNarrativeProject(project);

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "source_range_outside_segment" }),
      ]),
    );
  });

  it("rejects putting an audio block in the visual lane", () => {
    const project = makeValidProject();
    project.cues["cue-1"].visualBlockIds = ["speech-1"];
    project.cues["cue-1"].audioBlockIds = [];

    const result = validateNarrativeProject(project);

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid_block_lane" }),
      ]),
    );
  });

  it("rejects canonical narrative objects with multiple parents", () => {
    const project = makeValidProject();
    project.beats["beat-2"].cueIds.push("cue-1");

    const result = validateNarrativeProject(project);

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "multiple_parents" }),
      ]),
    );
  });

  it("rejects relationships with incompatible endpoint types", () => {
    const project = makeValidProject();
    project.relationships["rel-invalid"] = {
      id: "rel-invalid",
      sourceId: "media-1",
      targetId: "shot-1",
      type: "requires_shot_intent",
    };

    const result = validateNarrativeProject(project);

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid_relationship_types" }),
      ]),
    );
  });
});
