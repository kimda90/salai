import { applyOperations } from "@salai/script-model";
import { describe, expect, it } from "vitest";
import { createSemanticEditorialFixture } from "./semantic-editorial-fixture";

describe("semantic editorial canonical operation contract", () => {
  it("uses canonical operations for inspector edits and grouped changes", () => {
    const project = createSemanticEditorialFixture().project;
    const visual = project.blocks["visual-hook"];
    if (!visual || visual.type !== "visual_description") {
      throw new Error("Missing visual block");
    }

    const result = applyOperations(project, [
      { op: "updateSection", sectionId: "section-problem", title: "Updated problem" },
      { op: "updateBeat", beatId: "beat-hook", title: "Updated hook", summary: "A summary" },
      { op: "updateCue", cueId: "cue-hook", explicitDurationMs: 4_500 },
      {
        op: "updateBlock",
        block: { ...visual, text: "An updated visual description." },
      },
      { op: "updateBeat", beatId: "beat-friction", summary: "Grouped edit" },
    ]);

    expect(result.model.sections["section-problem"]?.title).toBe("Updated problem");
    expect(result.model.beats["beat-hook"]).toMatchObject({
      title: "Updated hook",
      summary: "A summary",
    });
    expect(result.model.cues["cue-hook"]?.explicitDurationMs).toBe(4_500);
    expect(result.model.blocks["visual-hook"]).toMatchObject({
      text: "An updated visual description.",
    });
    expect(result.model.beats["beat-friction"]?.summary).toBe("Grouped edit");
  });

  it("uses canonical operations for creation, movement, and deletion", () => {
    const project = createSemanticEditorialFixture().project;
    const created = applyOperations(project, [
      {
        op: "createSection",
        section: { id: "section-new", title: "New section", childIds: [] },
        index: 0,
      },
      {
        op: "createScene",
        scene: { id: "scene-new", title: "New scene", beatIds: [] },
        sectionId: "section-new",
      },
      {
        op: "createBeat",
        beat: { id: "beat-new", title: "New beat", cueIds: [] },
        parent: { type: "scene", id: "scene-new" },
      },
      {
        op: "createCue",
        cue: { id: "cue-new", visualBlockIds: [], audioBlockIds: [] },
        beatId: "beat-new",
      },
      {
        op: "createBlock",
        block: { id: "visual-new", type: "visual_description", text: "New visual" },
        cueId: "cue-new",
      },
      {
        op: "createBlock",
        block: { id: "audio-new", type: "authored_speech", role: "vo", text: "New audio" },
        cueId: "cue-new",
      },
      { op: "updateScene", sceneId: "scene-new", title: "Updated scene" },
      { op: "moveSection", sectionId: "section-new", toIndex: 1 },
      {
        op: "moveScene",
        sceneId: "scene-new",
        toSectionId: "section-change",
        toIndex: 0,
      },
      {
        op: "moveBeat",
        beatId: "beat-new",
        toParent: { type: "section", id: "section-problem" },
        toIndex: 0,
      },
      { op: "moveCue", cueId: "cue-new", toBeatId: "beat-hook", toIndex: 0 },
      { op: "moveBlock", blockId: "visual-new", toCueId: "cue-hook", toIndex: 0 },
      { op: "moveBlock", blockId: "audio-new", toCueId: "cue-hook", toIndex: 0 },
    ]);

    expect(created.model.sections["section-problem"]?.childIds[0]).toBe("beat-new");
    expect(created.model.beats["beat-hook"]?.cueIds[0]).toBe("cue-new");
    expect(created.model.cues["cue-hook"]?.visualBlockIds[0]).toBe("visual-new");
    expect(created.model.cues["cue-hook"]?.audioBlockIds[0]).toBe("audio-new");

    const deleted = applyOperations(created.model, [
      { op: "deleteBlock", blockId: "audio-new" },
      { op: "deleteBlock", blockId: "visual-new" },
      { op: "deleteCue", cueId: "cue-new" },
      { op: "deleteBeat", beatId: "beat-new" },
      { op: "deleteScene", sceneId: "scene-new" },
      { op: "deleteSection", sectionId: "section-new" },
    ]);

    expect(deleted.model.sections["section-new"]).toBeUndefined();
    expect(deleted.model.scenes["scene-new"]).toBeUndefined();
    expect(deleted.model.beats["beat-new"]).toBeUndefined();
    expect(deleted.model.cues["cue-new"]).toBeUndefined();
    expect(deleted.model.blocks["visual-new"]).toBeUndefined();
    expect(deleted.model.blocks["audio-new"]).toBeUndefined();
  });

  it("uses accepted Beat split and merge operations at Cue boundaries", () => {
    const project = createSemanticEditorialFixture().project;
    const split = applyOperations(project, [
      {
        op: "splitBeat",
        beatId: "beat-demo",
        newBeatId: "beat-demo-tail",
        leftCueIds: ["cue-demo-import"],
        rightCueIds: ["cue-demo-result"],
        relationshipPolicy: "left",
      },
    ]);

    expect(split.model.beats["beat-demo"]?.cueIds).toEqual(["cue-demo-import"]);
    expect(split.model.beats["beat-demo-tail"]?.cueIds).toEqual(["cue-demo-result"]);

    const merged = applyOperations(split.model, [
      {
        op: "mergeBeats",
        canonicalBeatId: "beat-demo",
        mergedBeatIds: ["beat-demo-tail"],
        cueIds: ["cue-demo-import", "cue-demo-result"],
      },
    ]);

    expect(merged.model.beats["beat-demo"]?.cueIds).toEqual([
      "cue-demo-import",
      "cue-demo-result",
    ]);
    expect(merged.model.beats["beat-demo-tail"]).toBeUndefined();
  });
});
