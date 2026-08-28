import { validateNarrativeProject } from "@salai/script-model";
import { describe, expect, it } from "vitest";
import { SalaiController } from "./controller";
import { findBeatParent, getDurationEstimate, orderedBeatRefs } from "./model-utils";

describe("Outline structural behavior", () => {
  it("supports a mixed Section hierarchy with direct and Scene-contained Beats", () => {
    const controller = new SalaiController("product");

    expect(
      controller.dispatchNarrative({
        op: "createScene",
        sectionId: "section_product",
        scene: { id: "scene_outline", title: "Outline scene", beatIds: [] },
        index: 1,
      }),
    ).toBe(true);
    expect(
      controller.dispatchNarrative({
        op: "moveBeat",
        beatId: "beat_problem",
        toParent: { type: "scene", id: "scene_outline" },
        toIndex: 0,
      }),
    ).toBe(true);

    const project = controller.getSnapshot().project;
    const refs = orderedBeatRefs(project);
    expect(refs.find((ref) => ref.beatId === "beat_hook")?.sceneId).toBeUndefined();
    expect(refs.find((ref) => ref.beatId === "beat_problem")).toMatchObject({
      sectionId: "section_product",
      sceneId: "scene_outline",
    });
    expect(validateNarrativeProject(project).valid).toBe(true);
  });

  it("preserves Beat identity across a valid cross-parent move", () => {
    const controller = new SalaiController("product");
    const before = controller.getSnapshot().project.beats.beat_problem;
    if (!before) throw new Error("fixture Beat missing");

    controller.dispatchNarrative({
      op: "createScene",
      sectionId: "section_product",
      scene: { id: "scene_move", title: "Move target", beatIds: [] },
    });
    expect(
      controller.dispatchNarrative({
        op: "moveBeat",
        beatId: before.id,
        toParent: { type: "scene", id: "scene_move" },
        toIndex: 0,
      }),
    ).toBe(true);

    expect(controller.getSnapshot().project.beats[before.id]).toEqual(before);
    expect(findBeatParent(controller.getSnapshot().project, before.id)).toEqual({
      type: "scene",
      id: "scene_move",
    });
  });

  it("rejects an invalid structural target without mutating the project", () => {
    const controller = new SalaiController("product");
    const before = controller.getSnapshot().project;

    expect(
      controller.dispatchNarrative({
        op: "moveBeat",
        beatId: "beat_problem",
        toParent: { type: "scene", id: "missing-scene" },
        toIndex: 0,
      }),
    ).toBe(false);

    expect(controller.getSnapshot().project).toBe(before);
    expect(controller.getSnapshot().feedback.error).toMatch(/unknown Scene/);
  });

  it("updates authored text and runtime through the shared domain dispatcher", () => {
    const controller = new SalaiController("product");
    const beforeMs = getDurationEstimate(controller.getSnapshot().project).scriptMs;

    expect(
      controller.dispatchNarrative({
        op: "updateBeat",
        beatId: "beat_demo",
        title: "Installation sequence",
      }),
    ).toBe(true);
    expect(
      controller.dispatchNarrative({
        op: "updateCue",
        cueId: "cue_demo_wide",
        explicitDurationMs: 7_000,
      }),
    ).toBe(true);

    expect(controller.getSnapshot().project.beats.beat_demo?.title).toBe("Installation sequence");
    expect(getDurationEstimate(controller.getSnapshot().project).scriptMs).toBe(beforeMs + 3_000);
    expect(validateNarrativeProject(controller.getSnapshot().project).valid).toBe(true);
  });
});
