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

function roundTrip(project: NarrativeProject): NarrativeProject {
  return deserializeNarrativeProject(serializeNarrativeProject(project));
}

describe("Spike 0A fixtures", () => {
  it("uses one valid model for script-first, interview, and footage-first work", () => {
    for (const fixture of [
      createProductVideoFixture(),
      createInterviewFixture(),
      createFootageFirstFixture(),
    ]) {
      expect(validateNarrativeProject(fixture)).toEqual({ valid: true, issues: [] });
      expect(roundTrip(fixture)).toEqual(fixture);
      expect(Object.keys(fixture.beats).length).toBeGreaterThan(0);
      expect(Object.keys(fixture.cues).length).toBeGreaterThan(0);
    }
  });

  it("keeps Beat distinct from Cue", () => {
    const project = createProductVideoFixture();
    expect(project.beats.beat_demo?.summary).toBe("Installation is three simple actions");
    expect(project.beats.beat_demo?.cueIds).toEqual([
      "cue_demo_wide",
      "cue_demo_connector",
      "cue_demo_ui",
    ]);
  });

  it("keeps authored speech distinct from source evidence", () => {
    const project = createInterviewFixture();
    expect(project.blocks.vo_bridge?.type).toBe("authored_speech");
    const quote = project.blocks.quote_maria;
    expect(quote?.type).toBe("source_excerpt");
    if (quote?.type === "source_excerpt") {
      expect(quote.mediaSegmentId).toBe("interview_maria");
      expect(quote.sourceOutMs - quote.sourceInMs).toBe(27_000);
    }
  });
});

describe("operation vocabulary", () => {
  it("creates, updates, reorders and reparents every hierarchy level", () => {
    let project = createEmptyNarrativeProject({ scriptId: "script_ops" });
    project = applyOperations(project, [
      { op: "createSection", section: { id: "s1", title: "One", childIds: [] } },
      { op: "createSection", section: { id: "s2", title: "Two", childIds: [] } },
      { op: "createScene", sectionId: "s1", scene: { id: "scene1", title: "Scene", beatIds: [] } },
      { op: "createBeat", parent: { type: "scene", id: "scene1" }, beat: { id: "b1", title: "Beat one", summary: "Keep me", cueIds: [] } },
      { op: "createBeat", parent: { type: "section", id: "s2" }, beat: { id: "b2", cueIds: [] } },
      { op: "createCue", beatId: "b1", cue: { id: "c1", visualBlockIds: [], audioBlockIds: [] } },
      { op: "createCue", beatId: "b1", cue: { id: "c2", visualBlockIds: [], audioBlockIds: [] } },
      { op: "createBlock", cueId: "c1", block: { id: "v1", type: "visual_description", text: "Wide" } },
      { op: "createBlock", cueId: "c1", block: { id: "a1", type: "authored_speech", text: "Hello" } },
      { op: "updateSection", sectionId: "s1", title: "Act one" },
      { op: "updateScene", sceneId: "scene1", title: "Renamed scene" },
      { op: "updateBeat", beatId: "b1", title: "Renamed beat" },
      { op: "updateCue", cueId: "c1", explicitDurationMs: 1_500 },
      { op: "updateBlock", block: { id: "a1", type: "authored_speech", text: "Hello again" } },
      { op: "moveSection", sectionId: "s2", toIndex: 0 },
      { op: "moveScene", sceneId: "scene1", toSectionId: "s2", toIndex: 1 },
      { op: "moveBeat", beatId: "b2", toParent: { type: "scene", id: "scene1" }, toIndex: 1 },
      { op: "moveCue", cueId: "c2", toBeatId: "b2", toIndex: 0 },
      { op: "moveBlock", blockId: "v1", toCueId: "c2", toIndex: 0 },
    ]).model;

    expect(project.script.sectionIds).toEqual(["s2", "s1"]);
    expect(project.sections.s2?.childIds).toEqual(["scene1"]);
    expect(project.scenes.scene1?.beatIds).toEqual(["b1", "b2"]);
    expect(project.beats.b1?.cueIds).toEqual(["c1"]);
    expect(project.beats.b2?.cueIds).toEqual(["c2"]);
    expect(project.cues.c2?.visualBlockIds).toEqual(["v1"]);
    expect(project.cues.c1?.audioBlockIds).toEqual(["a1"]);
    expect(project.sections.s1?.title).toBe("Act one");
    expect(project.scenes.scene1?.title).toBe("Renamed scene");
    expect(project.beats.b1?.title).toBe("Renamed beat");
    expect(project.beats.b1?.summary).toBe("Keep me");
    expect(project.cues.c1?.explicitDurationMs).toBe(1_500);
    expect(project.blocks.a1).toEqual({ id: "a1", type: "authored_speech", text: "Hello again" });
  });

  it("does not allow updateBlock to turn recorded evidence into authored copy", () => {
    const project = createInterviewFixture();
    expect(() =>
      applyOperation(project, {
        op: "updateBlock",
        block: { id: "quote_maria", type: "authored_speech", text: "Invented rewrite" },
      }),
    ).toThrow(DomainOperationError);
  });

  it("moves Beats without changing identity or relationships", () => {
    const initial = createProductVideoFixture();
    const relationship = initial.relationships.rel_demo_wide;
    const moved = applyOperation(initial, {
      op: "moveBeat",
      beatId: "beat_demo",
      toParent: { type: "section", id: "section_product" },
      toIndex: 0,
    }).model;

    expect(moved.sections.section_product?.childIds[0]).toBe("beat_demo");
    expect(moved.beats.beat_demo?.id).toBe("beat_demo");
    expect(moved.relationships.rel_demo_wide).toEqual(relationship);
  });

  it("splits and merges Beats with explicit relationship effects", () => {
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
    expect(split.model.beats.beat_demo_tail?.cueIds).toEqual(["cue_demo_connector", "cue_demo_ui"]);
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

  it("duplicates split relationships only when the caller provides new IDs", () => {
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

  it("deletes narrative descendants but preserves external production objects", () => {
    const initial = createProductVideoFixture();
    const deleted = applyOperation(initial, { op: "deleteBeat", beatId: "beat_demo" });

    expect(deleted.model.beats.beat_demo).toBeUndefined();
    expect(deleted.model.cues.cue_demo_wide).toBeUndefined();
    expect(deleted.model.blocks.visual_demo_wide).toBeUndefined();
    expect(deleted.model.shotIntents.shot_demo_wide).toEqual(initial.shotIntents.shot_demo_wide);
    expect(deleted.model.relationships.rel_demo_wide).toBeUndefined();
  });

  it("implements deleteBlock/deleteCue/deleteBeat/deleteScene/deleteSection cleanly", () => {
    let project = createEmptyNarrativeProject({ scriptId: "script_delete" });
    project = applyOperations(project, [
      { op: "createSection", section: { id: "s", childIds: [] } },
      { op: "createScene", sectionId: "s", scene: { id: "scene", beatIds: [] } },
      { op: "createBeat", parent: { type: "scene", id: "scene" }, beat: { id: "b", cueIds: [] } },
      { op: "createCue", beatId: "b", cue: { id: "c", visualBlockIds: [], audioBlockIds: [] } },
      { op: "createBlock", cueId: "c", block: { id: "v", type: "visual_description", text: "Frame" } },
      { op: "deleteBlock", blockId: "v" },
      { op: "createBlock", cueId: "c", block: { id: "v2", type: "visual_description", text: "Frame" } },
      { op: "deleteCue", cueId: "c" },
      { op: "createCue", beatId: "b", cue: { id: "c2", visualBlockIds: [], audioBlockIds: [] } },
      { op: "deleteBeat", beatId: "b" },
      { op: "createBeat", parent: { type: "scene", id: "scene" }, beat: { id: "b2", cueIds: [] } },
      { op: "deleteScene", sceneId: "scene" },
      { op: "createBeat", parent: { type: "section", id: "s" }, beat: { id: "b3", cueIds: [] } },
      { op: "deleteSection", sectionId: "s" },
    ]).model;

    expect(project.script.sectionIds).toEqual([]);
    expect(project.sections).toEqual({});
    expect(project.scenes).toEqual({});
    expect(project.beats).toEqual({});
    expect(project.cues).toEqual({});
    expect(project.blocks).toEqual({});
  });

  it("links and unlinks ShotIntent and MediaSegment relationships", () => {
    let project = createProductVideoFixture();
    project.mediaSegments.stock = { id: "stock", sourceInMs: 0, sourceOutMs: 10_000 };

    project = applyOperations(project, [
      { op: "linkMediaSegment", relationshipId: "rel_stock", sourceId: "beat_hook", mediaSegmentId: "stock" },
      { op: "unlinkMediaSegment", relationshipId: "rel_stock" },
      { op: "linkShotIntent", relationshipId: "rel_hook_shot", sourceId: "beat_hook", shotIntentId: "shot_demo_wide" },
      { op: "unlinkShotIntent", relationshipId: "rel_hook_shot" },
    ]).model;

    expect(project.relationships.rel_stock).toBeUndefined();
    expect(project.relationships.rel_hook_shot).toBeUndefined();
  });
});

describe("source evidence", () => {
  it("trims SourceExcerpt ranges without changing media identity", () => {
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
  });

  it("moves footage-derived evidence between narrative moments without changing the source", () => {
    const initial = createFootageFirstFixture();
    const moved = applyOperation(initial, {
      op: "moveBlock",
      blockId: "quote_owner_failure",
      toCueId: "cue_new_machine",
      toIndex: 1,
    }).model;

    expect(moved.cues.cue_owner_quote?.audioBlockIds).toEqual([]);
    expect(moved.cues.cue_new_machine?.audioBlockIds).toEqual(["vo_change", "quote_owner_failure"]);
    const block = moved.blocks.quote_owner_failure;
    if (block?.type === "source_excerpt") expect(block.mediaSegmentId).toBe("interview_owner");
    else throw new Error("expected SourceExcerpt");
  });
});

describe("runtime and persistence semantics", () => {
  it("estimates Cue concurrency and aggregates runtime", () => {
    const product = createProductVideoFixture();
    const estimate = estimateNarrativeDuration(product, { wordsPerMinute: 150 });

    expect(estimate.cueMs.cue_demo_wide).toBe(4_000);
    expect(estimate.beatMs.beat_demo).toBe(12_000);
    expect(estimate.sectionMs.section_product).toBe(estimate.scriptMs);
    expect(estimate.scriptMs).toBeGreaterThan(20_000);
    expect(estimate.scriptMs).toBeLessThan(40_000);
  });

  it("uses source duration and changes runtime after trimming", () => {
    const project = createInterviewFixture();
    const before = estimateNarrativeDuration(project).scriptMs;
    const trimmed = applyOperation(project, {
      op: "trimSourceExcerpt",
      blockId: "quote_maria",
      sourceInMs: 15_000,
      sourceOutMs: 25_000,
    }).model;
    expect(estimateNarrativeDuration(trimmed).scriptMs).toBeLessThan(before);
  });

  it("round-trips IDs, ordering, ranges, relationships and schema version", () => {
    const project = createFootageFirstFixture();
    expect(roundTrip(project)).toEqual(project);
    expect(() => deserializeNarrativeProject("{}")).toThrow(/missing required top-level fields/);
  });
});

describe("validation and transactions", () => {
  it("rejects duplicate IDs, dangling refs, wrong lanes and orphans", () => {
    const project = createProductVideoFixture();
    project.blocks.orphan = { id: "orphan", type: "authored_speech", text: "unused" };
    project.cues.cue_hook!.visualBlockIds.push("vo_hook");
    project.sections.section_product!.childIds.push("missing");
    project.shotIntents.beat_hook = { id: "beat_hook", description: "duplicate ID" };

    const result = validateNarrativeProject(project);
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(["duplicate_id", "dangling_reference", "invalid_block_lane", "orphaned_entity"]),
    );
  });

  it("does not mutate caller state when an operation fails", () => {
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
