import { describe, expect, it } from "vitest";
import {
  DomainOperationError,
  applyOperation,
  applyOperations,
  createEmptyNarrativeProject,
  createFootageFirstFixture,
  createInterviewFixture,
  createProductVideoFixture,
  deserializeNarrativeProject,
  estimateNarrativeDuration,
  serializeNarrativeProject,
  validateNarrativeProject,
  type NarrativeProject,
} from "./index.js";

function semanticRoundTrip(project: NarrativeProject): NarrativeProject {
  return deserializeNarrativeProject(serializeNarrativeProject(project));
}

describe("Spike 0A representative fixtures", () => {
  it("represents product, interview, and footage-first projects with one model", () => {
    const fixtures = [
      createProductVideoFixture(),
      createInterviewFixture(),
      createFootageFirstFixture(),
    ];

    for (const fixture of fixtures) {
      expect(validateNarrativeProject(fixture)).toEqual({ valid: true, issues: [] });
      expect(semanticRoundTrip(fixture)).toEqual(fixture);
      expect(Object.keys(fixture.beats).length).toBeGreaterThan(0);
      expect(Object.keys(fixture.cues).length).toBeGreaterThan(0);
    }
  });

  it("keeps Beat and Cue meaningfully distinct in the product fixture", () => {
    const project = createProductVideoFixture();
    expect(project.beats.beat_demo?.cueIds).toEqual([
      "cue_demo_wide",
      "cue_demo_connector",
      "cue_demo_ui",
    ]);
    expect(project.beats.beat_demo?.summary).toBe("Installation is three simple actions");
  });

  it("keeps authored speech and source excerpts semantically distinct", () => {
    const project = createInterviewFixture();
    expect(project.blocks.vo_bridge?.type).toBe("authored_speech");
    expect(project.blocks.quote_maria?.type).toBe("source_excerpt");
    if (project.blocks.quote_maria?.type === "source_excerpt") {
      expect(project.blocks.quote_maria.mediaSegmentId).toBe("interview_maria");
      expect(project.blocks.quote_maria.sourceOutMs - project.blocks.quote_maria.sourceInMs).toBe(27_000);
    }
  });
});

describe("structural operations", () => {
  it("updates fields without ID churn and rejects source/authored type mutation", () => {
    const initial = createProductVideoFixture();
    const updated = applyOperations(initial, [
      { op: "updateSection", sectionId: "section_product", title: "Thirty seconds" },
      { op: "updateBeat", beatId: "beat_hook", title: "Cold open", summary: "Get attention fast" },
      { op: "updateCue", cueId: "cue_cta", explicitDurationMs: 2_500 },
      {
        op: "updateBlock",
        block: {
          id: "vo_hook",
          type: "authored_speech",
          role: "vo",
          text: "Installation can be this simple.",
        },
      },
    ]).model;

    expect(updated.beats.beat_hook?.id).toBe("beat_hook");
    expect(updated.blocks.vo_hook?.id).toBe("vo_hook");
    expect(updated.sections.section_product?.title).toBe("Thirty seconds");
    expect(updated.cues.cue_cta?.explicitDurationMs).toBe(2_500);
    expect(initial.beats.beat_hook?.title).toBe("Hook");

    const interview = createInterviewFixture();
    expect(() =>
      applyOperation(interview, {
        op: "updateBlock",
        block: { id: "quote_maria", type: "authored_speech", text: "Invented rewrite" },
      }),
    ).toThrow(DomainOperationError);
  });

  it("supports Section/Scene/Beat/Cue/Block creation, reordering and reparenting", () => {
    let project = createEmptyNarrativeProject({ scriptId: "script_ops" });
    project = applyOperations(project, [
      { op: "createSection", section: { id: "s1", title: "One", childIds: [] } },
      { op: "createSection", section: { id: "s2", title: "Two", childIds: [] } },
      { op: "createScene", sectionId: "s1", scene: { id: "scene1", title: "Scene", beatIds: [] } },
      { op: "createBeat", parent: { type: "scene", id: "scene1" }, beat: { id: "b1", cueIds: [] } },
      { op: "createBeat", parent: { type: "section", id: "s2" }, beat: { id: "b2", cueIds: [] } },
      { op: "createCue", beatId: "b1", cue: { id: "c1", visualBlockIds: [], audioBlockIds: [] } },
      { op: "createCue", beatId: "b1", cue: { id: "c2", visualBlockIds: [], audioBlockIds: [] } },
      { op: "createBlock", cueId: "c1", block: { id: "v1", type: "visual_description", text: "Wide" } },
      { op: "createBlock", cueId: "c1", block: { id: "a1", type: "authored_speech", text: "Hello" } },
      { op: "updateScene", sceneId: "scene1", title: "Renamed scene" },
      { op: "moveSection", sectionId: "s2", toIndex: 0 },
      { op: "moveScene", sceneId: "scene1", toSectionId: "s2", toIndex: 1 },
      { op: "moveBeat", beatId: "b2", toParent: { type: "scene", id: "scene1" }, toIndex: 1 },
      { op: "moveCue", cueId: "c2", toBeatId: "b2", toIndex: 0 },
      { op: "moveBlock", blockId: "v1", toCueId: "c2", toIndex: 0 },
    ]).model;

    expect(project.script.sectionIds).toEqual(["s2", "s1"]);
    expect(project.sections.s2?.childIds).toEqual(["b2", "scene1"]);
    expect(project.scenes.scene1?.beatIds).toEqual(["b1", "b2"]);
    expect(project.beats.b1?.cueIds).toEqual(["c1"]);
    expect(project.beats.b2?.cueIds).toEqual(["c2"]);
    expect(project.cues.c2?.visualBlockIds).toEqual(["v1"]);
    expect(project.cues.c1?.audioBlockIds).toEqual(["a1"]);
    expect(project.scenes.scene1?.title).toBe("Renamed scene");
  });

  it("preserves relationships when Beats move", () => {
    const initial = createProductVideoFixture();
    const before = initial.relationships.rel_demo_wide;
    const moved = applyOperation(initial, {
      op: "moveBeat",
      beatId: "beat_demo",
      toParent: { type: "section", id: "section_product" },
      toIndex: 0,
    }).model;

    expect(moved.sections.section_product?.childIds[0]).toBe("beat_demo");
    expect(moved.relationships.rel_demo_wide).toEqual(before);
    expect(moved.beats.beat_demo?.id).toBe("beat_demo");
  });

  it("splits a Beat with explicit relationship redistribution and merges it back", () => {
    let project = createProductVideoFixture();
    project = applyOperation(project, {
      op: "linkShotIntent",
      relationshipId: "rel_demo_beat",
      sourceId: "beat_demo",
      shotIntentId: "shot_demo_wide",
    }).model;

    const split = applyOperation(project, {
      op: "splitBeat",
      beatId: "beat_demo",
      newBeatId: "beat_demo_tail",
      leftCueIds: ["cue_demo_wide"],
      rightCueIds: ["cue_demo_connector", "cue_demo_ui"],
      rightTitle: "Demo finish",
      relationshipPolicy: "right",
    });

    expect(split.model.beats.beat_demo?.cueIds).toEqual(["cue_demo_wide"]);
    expect(split.model.beats.beat_demo_tail?.cueIds).toEqual([
      "cue_demo_connector",
      "cue_demo_ui",
    ]);
    expect(split.model.relationships.rel_demo_beat?.sourceId).toBe("beat_demo_tail");
    expect(split.relationshipEffects).toContainEqual(
      expect.objectContaining({ relationshipId: "rel_demo_beat", effect: "retargeted" }),
    );

    const merged = applyOperation(split.model, {
      op: "mergeBeats",
      canonicalBeatId: "beat_demo",
      mergedBeatIds: ["beat_demo_tail"],
      cueIds: ["cue_demo_wide", "cue_demo_connector", "cue_demo_ui"],
    });

    expect(merged.model.beats.beat_demo_tail).toBeUndefined();
    expect(merged.model.beats.beat_demo?.cueIds).toEqual([
      "cue_demo_wide",
      "cue_demo_connector",
      "cue_demo_ui",
    ]);
    expect(merged.model.relationships.rel_demo_beat?.sourceId).toBe("beat_demo");
    expect(merged.metadata?.mergedBeatIds).toEqual(["beat_demo_tail"]);
  });

  it("supports split policy both only with explicit duplicate relationship IDs", () => {
    let project = createProductVideoFixture();
    project = applyOperation(project, {
      op: "linkShotIntent",
      relationshipId: "rel_demo_beat",
      sourceId: "beat_demo",
      shotIntentId: "shot_demo_wide",
    }).model;

    const split = applyOperation(project, {
      op: "splitBeat",
      beatId: "beat_demo",
      newBeatId: "beat_demo_tail",
      leftCueIds: ["cue_demo_wide"],
      rightCueIds: ["cue_demo_connector", "cue_demo_ui"],
      relationshipPolicy: "both",
      duplicateRelationshipIds: { rel_demo_beat: "rel_demo_beat_tail" },
    }).model;

    expect(split.relationships.rel_demo_beat?.sourceId).toBe("beat_demo");
    expect(split.relationships.rel_demo_beat_tail).toEqual({
      id: "rel_demo_beat_tail",
      sourceId: "beat_demo_tail",
      targetId: "shot_demo_wide",
      type: "requires_shot_intent",
    });
  });

  it("cascades narrative deletion while preserving external media and ShotIntents", () => {
    const initial = createProductVideoFixture();
    const deleted = applyOperation(initial, { op: "deleteBeat", beatId: "beat_demo" });

    expect(deleted.model.beats.beat_demo).toBeUndefined();
    expect(deleted.model.cues.cue_demo_wide).toBeUndefined();
    expect(deleted.model.blocks.visual_demo_wide).toBeUndefined();
    expect(deleted.model.shotIntents.shot_demo_wide).toEqual(initial.shotIntents.shot_demo_wide);
    expect(deleted.model.relationships.rel_demo_wide).toBeUndefined();
    expect(deleted.relationshipEffects).toContainEqual(
      expect.objectContaining({ relationshipId: "rel_demo_wide", effect: "removed" }),
    );
  });

  it("implements every delete inverse without leaving unreachable descendants", () => {
    let project = createEmptyNarrativeProject({ scriptId: "script_delete" });
    project = applyOperations(project, [
      { op: "createSection", section: { id: "s1", childIds: [] } },
      { op: "createScene", sectionId: "s1", scene: { id: "scene1", beatIds: [] } },
      { op: "createBeat", parent: { type: "scene", id: "scene1" }, beat: { id: "b1", cueIds: [] } },
      { op: "createCue", beatId: "b1", cue: { id: "c1", visualBlockIds: [], audioBlockIds: [] } },
      { op: "createBlock", cueId: "c1", block: { id: "v1", type: "visual_description", text: "Frame" } },
      { op: "deleteBlock", blockId: "v1" },
      { op: "createBlock", cueId: "c1", block: { id: "v2", type: "visual_description", text: "Frame 2" } },
      { op: "deleteCue", cueId: "c1" },
      { op: "createCue", beatId: "b1", cue: { id: "c2", visualBlockIds: [], audioBlockIds: [] } },
      { op: "deleteBeat", beatId: "b1" },
      { op: "createBeat", parent: { type: "scene", id: "scene1" }, beat: { id: "b2", cueIds: [] } },
      { op: "deleteScene", sceneId: "scene1" },
      { op: "createBeat", parent: { type: "section", id: "s1" }, beat: { id: "b3", cueIds: [] } },
      { op: "deleteSection", sectionId: "s1" },
    ]).model;

    expect(project.script.sectionIds).toEqual([]);
    expect(project.sections).toEqual({});
    expect(project.scenes).toEqual({});
    expect(project.beats).toEqual({});
    expect(project.cues).toEqual({});
    expect(project.blocks).toEqual({});
  });
});

describe("source evidence operations", () => {
  it("trims excerpts inside source bounds and preserves the media reference", () => {
    const initial = createInterviewFixture();
    const trimmed = applyOperation(initial, {
      op: "trimSourceExcerpt",
      blockId: "quote_maria",
      sourceInMs: 12_000,
      sourceOutMs: 31_000,
    }).model;

    const block = trimmed.blocks.quote_maria;
    expect(block?.type).toBe("source_excerpt");
    if (block?.type === "source_excerpt") {
      expect(block.mediaSegmentId).toBe("interview_maria");
      expect(block.sourceInMs).toBe(12_000);
      expect(block.sourceOutMs).toBe(31_000);
    }

    expect(() =>
      applyOperation(initial, {
        op: "trimSourceExcerpt",
        blockId: "quote_maria",
        sourceInMs: 0,
        sourceOutMs: 200_000,
      }),
    ).toThrow(/SourceExcerpt range must stay within/);
    expect(initial.blocks.quote_maria).not.toEqual(trimmed.blocks.quote_maria);
  });

  it("can move a footage-first excerpt to another Beat without changing its source identity", () => {
    const initial = createFootageFirstFixture();
    const moved = applyOperation(initial, {
      op: "moveBlock",
      blockId: "quote_owner_failure",
      toCueId: "cue_new_machine",
      toIndex: 1,
    }).model;

    expect(moved.cues.cue_owner_quote?.audioBlockIds).toEqual([]);
    expect(moved.cues.cue_new_machine?.audioBlockIds).toEqual([
      "vo_change",
      "quote_owner_failure",
    ]);
    const block = moved.blocks.quote_owner_failure;
    expect(block?.type).toBe("source_excerpt");
    if (block?.type === "source_excerpt") {
      expect(block.mediaSegmentId).toBe("interview_owner");
    }
  });

  it("links and unlinks generic media and ShotIntent relationships explicitly", () => {
    let product = createProductVideoFixture();
    product.mediaSegments.stock = { id: "stock", sourceInMs: 0, sourceOutMs: 10_000 };
    product = applyOperation(product, {
      op: "linkMediaSegment",
      relationshipId: "rel_stock",
      sourceId: "beat_hook",
      mediaSegmentId: "stock",
    }).model;
    product = applyOperation(product, {
      op: "unlinkMediaSegment",
      relationshipId: "rel_stock",
    }).model;
    expect(product.relationships.rel_stock).toBeUndefined();

    product = applyOperation(product, {
      op: "linkShotIntent",
      relationshipId: "rel_hook_shot",
      sourceId: "beat_hook",
      shotIntentId: "shot_demo_wide",
    }).model;
    product = applyOperation(product, {
      op: "unlinkShotIntent",
      relationshipId: "rel_hook_shot",
    }).model;
    expect(product.relationships.rel_hook_shot).toBeUndefined();
  });
});

describe("runtime and serialization", () => {
  it("estimates concurrent Cue duration and aggregates through hierarchy", () => {
    const product = createProductVideoFixture();
    const estimate = estimateNarrativeDuration(product, { wordsPerMinute: 150 });

    expect(estimate.cueMs.cue_demo_wide).toBe(4_000);
    expect(estimate.beatMs.beat_demo).toBe(12_000);
    expect(estimate.sectionMs.section_product).toBe(estimate.scriptMs);
    expect(estimate.scriptMs).toBeGreaterThan(20_000);
    expect(estimate.scriptMs).toBeLessThan(40_000);
  });

  it("uses source ranges for interview duration and reflects trimming", () => {
    const project = createInterviewFixture();
    const before = estimateNarrativeDuration(project).scriptMs;
    const trimmed = applyOperation(project, {
      op: "trimSourceExcerpt",
      blockId: "quote_maria",
      sourceInMs: 15_000,
      sourceOutMs: 25_000,
    }).model;
    const after = estimateNarrativeDuration(trimmed).scriptMs;

    expect(after).toBeLessThan(before);
  });

  it("preserves all semantic data across serialization", () => {
    const project = createFootageFirstFixture();
    const serialized = serializeNarrativeProject(project);
    expect(deserializeNarrativeProject(serialized)).toEqual(project);
    expect(() => deserializeNarrativeProject("{}")) .toThrow(/missing required top-level fields/);
  });
});

describe("validation and transaction safety", () => {
  it("rejects duplicate IDs, dangling references, invalid lanes, and orphan entities", () => {
    const project = createProductVideoFixture();
    project.blocks.orphan = { id: "orphan", type: "authored_speech", text: "unused" };
    project.cues.cue_hook!.visualBlockIds.push("vo_hook");
    project.sections.section_product!.childIds.push("missing");
    project.shotIntents.beat_hook = { id: "beat_hook", description: "duplicate ID" };

    const result = validateNarrativeProject(project);
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "duplicate_id",
        "dangling_reference",
        "invalid_block_lane",
        "orphaned_entity",
      ]),
    );
  });

  it("does not mutate the caller when an operation fails validation", () => {
    const project = createInterviewFixture();
    const snapshot = serializeNarrativeProject(project);

    expect(() =>
      applyOperation(project, {
        op: "trimSourceExcerpt",
        blockId: "quote_maria",
        sourceInMs: -1,
        sourceOutMs: 5_000,
      }),
    ).toThrow();

    expect(serializeNarrativeProject(project)).toBe(snapshot);
  });
});
