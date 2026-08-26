import { describe, expect, it } from "vitest";
import {
  applyOperation,
  applyOperations,
  createInterviewFixture,
  createProductVideoFixture,
  serializeNarrativeProject,
} from "./index.js";

describe("Fixture A pressure tests", () => {
  it("supports a mixed Section with direct Beats plus an optional Scene grouping", () => {
    let project = createProductVideoFixture();
    project = applyOperations(project, [
      {
        op: "createScene",
        sectionId: "section_product",
        index: 2,
        scene: { id: "scene_demo_sequence", title: "Demo sequence", beatIds: [] },
      },
      {
        op: "moveBeat",
        beatId: "beat_demo",
        toParent: { type: "scene", id: "scene_demo_sequence" },
        toIndex: 0,
      },
      {
        op: "moveBeat",
        beatId: "beat_benefit",
        toParent: { type: "scene", id: "scene_demo_sequence" },
        toIndex: 1,
      },
    ]).model;

    expect(project.sections.section_product?.childIds).toEqual([
      "beat_hook",
      "beat_problem",
      "scene_demo_sequence",
      "beat_cta",
    ]);
    expect(project.scenes.scene_demo_sequence?.beatIds).toEqual([
      "beat_demo",
      "beat_benefit",
    ]);
  });

  it("exercises Section reorder/delete and block reorder/delete on the product model", () => {
    let project = createProductVideoFixture();
    project = applyOperations(project, [
      { op: "createSection", section: { id: "section_alt", title: "Alternate", childIds: [] } },
      { op: "moveSection", sectionId: "section_alt", toIndex: 0 },
      { op: "moveBlock", blockId: "text_demo_ui", toCueId: "cue_demo_ui", toIndex: 0 },
      { op: "deleteBlock", blockId: "text_demo_ui" },
      { op: "deleteSection", sectionId: "section_alt" },
    ]).model;

    expect(project.script.sectionIds).toEqual(["section_product"]);
    expect(project.blocks.text_demo_ui).toBeUndefined();
    expect(project.cues.cue_demo_ui?.visualBlockIds).toEqual(["visual_demo_ui"]);
  });
});

describe("Fixture B source-edit pressure tests", () => {
  it("reorders Beats without changing SourceExcerpt identity", () => {
    const project = createInterviewFixture();
    const before = project.blocks.quote_result;
    const moved = applyOperation(project, {
      op: "moveBeat",
      beatId: "beat_result",
      toParent: { type: "section", id: "section_interview" },
      toIndex: 0,
    }).model;

    expect(moved.sections.section_interview?.childIds[0]).toBe("beat_result");
    expect(moved.blocks.quote_result).toEqual(before);
  });

  it("replaces one recorded excerpt with another without pretending the recording changed", () => {
    let project = createInterviewFixture();
    project = applyOperations(project, [
      { op: "deleteBlock", blockId: "quote_result" },
      {
        op: "createBlock",
        cueId: "cue_result",
        block: {
          id: "quote_result_replacement",
          type: "source_excerpt",
          mediaSegmentId: "interview_juan",
          sourceInMs: 90_000,
          sourceOutMs: 112_000,
          transcriptSnapshot: "The team could finally see where every job was going.",
        },
      },
    ]).model;

    expect(project.blocks.quote_result).toBeUndefined();
    const replacement = project.blocks.quote_result_replacement;
    expect(replacement?.type).toBe("source_excerpt");
    if (replacement?.type === "source_excerpt") {
      expect(replacement.mediaSegmentId).toBe("interview_juan");
    }
  });
});

describe("operation contract", () => {
  it("rejects invalid hierarchy targets atomically", () => {
    const project = createProductVideoFixture();
    const before = serializeNarrativeProject(project);

    expect(() =>
      applyOperation(project, {
        op: "moveBeat",
        beatId: "beat_demo",
        toParent: { type: "scene", id: "missing_scene" },
        toIndex: 0,
      }),
    ).toThrow(/unknown Scene missing_scene/);
    expect(serializeNarrativeProject(project)).toBe(before);
  });

  it("keeps operation inputs and results JSON-serializable", () => {
    const project = createProductVideoFixture();
    const operation = {
      op: "moveBeat" as const,
      beatId: "beat_demo",
      toParent: { type: "section" as const, id: "section_product" },
      toIndex: 0,
    };
    const result = applyOperation(project, JSON.parse(JSON.stringify(operation)) as typeof operation);
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });
});
