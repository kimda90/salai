import {
  applyOperations,
  createProductVideoFixture,
} from "@salai/script-model";
import { describe, expect, it } from "vitest";
import { formatDuration, getDurationEstimate, orderedBeatRefs } from "./model-utils";

describe("model utilities", () => {
  it("formats rounded minute boundaries without producing an invalid :60 remainder", () => {
    expect(formatDuration(59_949)).toBe("59.9s");
    expect(formatDuration(59_999)).toBe("60.0s");
    expect(formatDuration(60_000)).toBe("1:00");
    expect(formatDuration(119_999)).toBe("2:00");
  });

  it("preserves canonical beat order across direct and scene-contained beats", () => {
    const project = createProductVideoFixture();
    const sectionId = project.script.sectionIds[0]!;
    const mixed = applyOperations(project, [
      {
        op: "createScene",
        sectionId,
        scene: { id: "scene_test", title: "Scene test", beatIds: [] },
      },
      {
        op: "moveBeat",
        beatId: "beat_problem",
        toParent: { type: "scene", id: "scene_test" },
        toIndex: 0,
      },
    ]).model;

    const refs = orderedBeatRefs(mixed);
    expect(refs.length).toBe(Object.keys(mixed.beats).length);
    expect(new Set(refs.map((ref) => ref.beatId)).size).toBe(refs.length);
    expect(refs.find((ref) => ref.beatId === "beat_hook")?.sceneId).toBeUndefined();
    expect(refs.find((ref) => ref.beatId === "beat_problem")).toMatchObject({
      sectionId,
      sceneId: "scene_test",
    });
  });

  it("caches duration estimates for the same immutable project identity", () => {
    const project = createProductVideoFixture();

    expect(getDurationEstimate(project)).toBe(getDurationEstimate(project));
  });
});
